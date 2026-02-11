import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// GET - Fetch all dustbins
export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const dustbins = await prisma.dustbin.findMany({
            include: {
                faculty: {
                    select: {
                        name: true,
                        code: true,
                    },
                },
            },
            orderBy: {
                code: 'asc',
            },
        })

        return NextResponse.json({ dustbins }, { status: 200 })
    } catch (error) {
        console.error('Fetch dustbins error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create new dustbin (Admin only)
export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { code, location, latitude, longitude, capacity, facultyId } = body

        if (!code || !location || !latitude || !longitude || !capacity || !facultyId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if dustbin code already exists
        const existingDustbin = await prisma.dustbin.findUnique({
            where: { code },
        })

        if (existingDustbin) {
            return NextResponse.json({ error: 'Dustbin code already exists' }, { status: 400 })
        }

        const dustbin = await prisma.dustbin.create({
            data: {
                code,
                location,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                capacity: parseInt(capacity),
                facultyId,
            },
            include: {
                faculty: true,
            },
        })

        // Log the action
        await prisma.systemLog.create({
            data: {
                action: 'DUSTBIN_CREATED',
                userId: payload.userId,
                userRole: payload.role,
                details: `Dustbin ${code} created`,
            },
        })

        return NextResponse.json(
            {
                message: 'Dustbin created successfully',
                dustbin,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Create dustbin error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
