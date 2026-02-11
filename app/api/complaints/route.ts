import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { assignComplaintToDriver } from '@/lib/location'

// GET - Fetch complaints
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

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        let complaints

        if (payload.role === 'STUDENT') {
            // Get student's complaints
            const student = await prisma.student.findUnique({
                where: { userId: payload.userId },
            })

            if (!student) {
                return NextResponse.json({ error: 'Student not found' }, { status: 404 })
            }

            complaints = await prisma.complaint.findMany({
                where: {
                    studentId: student.id,
                    ...(status && { status: status as any }),
                },
                include: {
                    dustbin: {
                        include: {
                            faculty: true,
                        },
                    },
                    driver: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    reportedAt: 'desc',
                },
            })
        } else if (payload.role === 'DRIVER') {
            // Get driver's assigned complaints
            const driver = await prisma.driver.findUnique({
                where: { userId: payload.userId },
            })

            if (!driver) {
                return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
            }

            complaints = await prisma.complaint.findMany({
                where: {
                    driverId: driver.id,
                    ...(status && { status: status as any }),
                },
                include: {
                    dustbin: {
                        include: {
                            faculty: true,
                        },
                    },
                    student: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    assignedAt: 'desc',
                },
            })
        } else if (payload.role === 'ADMIN') {
            // Get all complaints
            complaints = await prisma.complaint.findMany({
                where: {
                    ...(status && { status: status as any }),
                },
                include: {
                    dustbin: {
                        include: {
                            faculty: true,
                        },
                    },
                    student: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                    driver: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    reportedAt: 'desc',
                },
            })
        } else {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        return NextResponse.json({ complaints }, { status: 200 })
    } catch (error) {
        console.error('Fetch complaints error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create new complaint
export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'STUDENT') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { dustbinId, description } = body

        if (!dustbinId) {
            return NextResponse.json({ error: 'Dustbin ID is required' }, { status: 400 })
        }

        // Get student
        const student = await prisma.student.findUnique({
            where: { userId: payload.userId },
        })

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 })
        }

        // Verify dustbin exists
        const dustbin = await prisma.dustbin.findUnique({
            where: { id: dustbinId },
        })

        if (!dustbin) {
            return NextResponse.json({ error: 'Dustbin not found' }, { status: 404 })
        }

        // Create complaint
        const complaint = await prisma.complaint.create({
            data: {
                studentId: student.id,
                dustbinId,
                description,
                status: 'PENDING',
            },
            include: {
                dustbin: {
                    include: {
                        faculty: true,
                    },
                },
            },
        })

        // Log the action
        await prisma.systemLog.create({
            data: {
                action: 'COMPLAINT_CREATED',
                userId: payload.userId,
                userRole: payload.role,
                details: `Complaint created for dustbin ${dustbin.code}`,
            },
        })

        // Try to assign to nearest driver
        try {
            await assignComplaintToDriver(complaint.id)
        } catch (error) {
            console.error('Auto-assignment failed:', error)
            // Continue even if auto-assignment fails
        }

        return NextResponse.json(
            {
                message: 'Complaint created successfully',
                complaint,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Create complaint error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
