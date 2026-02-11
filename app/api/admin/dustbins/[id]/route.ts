import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const updateData: any = {}
        if (code) updateData.code = code
        if (location) updateData.location = location
        if (latitude) updateData.latitude = parseFloat(latitude)
        if (longitude) updateData.longitude = parseFloat(longitude)
        if (capacity) updateData.capacity = parseInt(capacity)
        if (facultyId) updateData.facultyId = facultyId

        const dustbin = await prisma.dustbin.update({
            where: { id: params.id },
            data: updateData,
            include: {
                faculty: true
            }
        })

        return NextResponse.json({ dustbin }, { status: 200 })
    } catch (error) {
        console.error('Update dustbin error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Check for related complaints
        const dustbin = await prisma.dustbin.findUnique({
            where: { id: params.id },
            include: {
                complaints: true
            }
        })

        if (!dustbin) {
            return NextResponse.json({ error: 'Dustbin not found' }, { status: 404 })
        }

        if (dustbin.complaints && dustbin.complaints.length > 0) {
            return NextResponse.json({
                error: `Cannot delete dustbin with ${dustbin.complaints.length} related complaint(s). Please delete complaints first.`
            }, { status: 400 })
        }

        await prisma.dustbin.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Dustbin deleted successfully' }, { status: 200 })
    } catch (error: any) {
        console.error('Delete dustbin error:', error)
        if (error.code === 'P2003') {
            return NextResponse.json({
                error: 'Cannot delete dustbin due to related records. Please remove related data first.'
            }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
