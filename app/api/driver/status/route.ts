import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function PUT(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'DRIVER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { status, latitude, longitude } = body

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 })
        }

        // Get driver
        const driver = await prisma.driver.findUnique({
            where: { userId: payload.userId },
        })

        if (!driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
        }

        // Update driver status and location
        const updatedDriver = await prisma.driver.update({
            where: { id: driver.id },
            data: {
                status,
                ...(latitude && longitude && {
                    currentLat: parseFloat(latitude),
                    currentLng: parseFloat(longitude),
                    lastLocation: new Date(),
                }),
            },
        })

        // Log the action
        await prisma.systemLog.create({
            data: {
                action: 'DRIVER_STATUS_UPDATED',
                userId: payload.userId,
                userRole: payload.role,
                details: `Driver status changed to ${status}`,
            },
        })

        // If driver became active, try to assign pending complaints
        if (status === 'ACTIVE') {
            try {
                const { assignPendingComplaints } = await import('@/lib/location')
                await assignPendingComplaints()
            } catch (error) {
                console.error('Error assigning pending complaints:', error)
            }
        }

        return NextResponse.json(
            {
                message: 'Status updated successfully',
                driver: updatedDriver,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Update driver status error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
