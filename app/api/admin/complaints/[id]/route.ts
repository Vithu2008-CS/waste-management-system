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
        const { status, driverId } = body

        const updateData: any = {}
        if (status) updateData.status = status
        if (driverId !== undefined) updateData.driverId = driverId

        // If status is changed to COMPLETED, set completedAt
        if (status === 'COMPLETED') {
            updateData.completedAt = new Date()
        }
        // If driver is assigned, set assignedAt and status to ASSIGNED if it was PENDING
        if (driverId) {
            updateData.assignedAt = new Date()
            const currentComplaint = await prisma.complaint.findUnique({
                where: { id: params.id },
                select: { status: true }
            })
            if (currentComplaint?.status === 'PENDING') {
                updateData.status = 'ASSIGNED'
            }
        }

        const complaint = await prisma.complaint.update({
            where: { id: params.id },
            data: updateData,
            include: {
                student: { include: { user: true } },
                driver: { include: { user: true } },
                dustbin: true,
            }
        })

        return NextResponse.json({ complaint }, { status: 200 })
    } catch (error) {
        console.error('Update complaint error:', error)
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

        await prisma.complaint.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Complaint deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('Delete complaint error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
