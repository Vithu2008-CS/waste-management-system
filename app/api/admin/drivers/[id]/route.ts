import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromRequest, hashPassword } from '@/lib/auth'

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
        const { name, email, phone, licenseNumber, vehicleNumber, status, password } = body

        // Update User data
        const userData: any = {}
        if (name) userData.name = name
        if (email) userData.email = email
        if (phone) userData.phone = phone
        if (password) userData.password = await hashPassword(password)

        // Update Driver data
        const driverData: any = {}
        if (licenseNumber) driverData.licenseNumber = licenseNumber
        if (vehicleNumber) driverData.vehicleNumber = vehicleNumber
        if (status) driverData.status = status

        // Transaction to update both
        const driver = await prisma.driver.update({
            where: { id: params.id },
            data: {
                ...driverData,
                user: {
                    update: userData
                }
            },
            include: {
                user: true
            }
        })

        return NextResponse.json({ driver }, { status: 200 })
    } catch (error) {
        console.error('Update driver error:', error)
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

        // Get driver with related data
        const driver = await prisma.driver.findUnique({
            where: { id: params.id },
            include: {
                complaints: true,
                collections: true
            }
        })

        if (!driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
        }

        // Check if driver has active complaints
        if (driver.complaints && driver.complaints.length > 0) {
            return NextResponse.json({
                error: `Cannot delete driver with ${driver.complaints.length} assigned complaint(s). Please reassign complaints first.`
            }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id: driver.userId },
        })

        return NextResponse.json({ message: 'Driver deleted successfully' }, { status: 200 })
    } catch (error: any) {
        console.error('Delete driver error:', error)
        if (error.code === 'P2003') {
            return NextResponse.json({
                error: 'Cannot delete driver due to related records. Please remove related data first.'
            }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
