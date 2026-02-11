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
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const body = await request.json()
        const { status } = body

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 })
        }

        // Get the complaint
        const complaint = await prisma.complaint.findUnique({
            where: { id: params.id },
            include: {
                driver: true,
            },
        })

        if (!complaint) {
            return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
        }

        // Check authorization
        if (payload.role === 'DRIVER') {
            const driver = await prisma.driver.findUnique({
                where: { userId: payload.userId },
            })

            if (!driver || complaint.driverId !== driver.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
            }
        } else if (payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Update complaint status
        const updatedComplaint = await prisma.complaint.update({
            where: { id: params.id },
            data: {
                status,
                ...(status === 'IN_PROGRESS' && !complaint.assignedAt && { assignedAt: new Date() }),
                ...(status === 'COMPLETED' && { completedAt: new Date() }),
            },
            include: {
                dustbin: {
                    include: {
                        faculty: true,
                    },
                },
                student: {
                    include: {
                        user: true,
                    },
                },
                driver: {
                    include: {
                        user: true,
                    },
                },
            },
        })

        // If completed, create collection record and update driver status
        if (status === 'COMPLETED' && complaint.driverId) {
            await prisma.collection.create({
                data: {
                    complaintId: complaint.id,
                    driverId: complaint.driverId,
                    endTime: new Date(),
                },
            })

            // Set driver back to active
            await prisma.driver.update({
                where: { id: complaint.driverId },
                data: { status: 'ACTIVE' },
            })
        }

        // Log the action
        await prisma.systemLog.create({
            data: {
                action: 'COMPLAINT_STATUS_UPDATED',
                userId: payload.userId,
                userRole: payload.role,
                details: `Complaint ${params.id} status changed to ${status}`,
            },
        })

        return NextResponse.json(
            {
                message: 'Complaint updated successfully',
                complaint: updatedComplaint,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Update complaint error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
