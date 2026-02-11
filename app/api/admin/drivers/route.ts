import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromRequest, hashPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const drivers = await prisma.driver.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json({ drivers }, { status: 200 })
    } catch (error) {
        console.error('Fetch drivers error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

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
        const { name, email, password, phone, licenseNumber, vehicleNumber } = body

        if (!name || !email || !password || !licenseNumber || !vehicleNumber) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Check if license exists
        const existingDriver = await prisma.driver.findUnique({
            where: { licenseNumber },
        })

        if (existingDriver) {
            return NextResponse.json(
                { error: 'Driver with this license number already exists' },
                { status: 400 }
            )
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                role: 'DRIVER',
                driver: {
                    create: {
                        licenseNumber,
                        vehicleNumber,
                        status: 'INACTIVE',
                    },
                },
            },
            include: {
                driver: true,
            },
        })

        return NextResponse.json(
            { message: 'Driver created successfully', driver: user.driver },
            { status: 201 }
        )
    } catch (error) {
        console.error('Create driver error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
