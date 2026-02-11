import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

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

        // Fetch all statistics
        const [
            totalComplaints,
            pendingComplaints,
            completedComplaints,
            activeDrivers,
            totalStudents,
            totalDrivers,
            totalDustbins,
            totalFaculties,
        ] = await Promise.all([
            prisma.complaint.count(),
            prisma.complaint.count({ where: { status: 'PENDING' } }),
            prisma.complaint.count({ where: { status: 'COMPLETED' } }),
            prisma.driver.count({ where: { status: 'ACTIVE' } }),
            prisma.student.count(),
            prisma.driver.count(),
            prisma.dustbin.count(),
            prisma.faculty.count(),
        ])

        return NextResponse.json(
            {
                stats: {
                    totalComplaints,
                    pendingComplaints,
                    completedComplaints,
                    activeDrivers,
                    totalStudents,
                    totalDrivers,
                    totalDustbins,
                    totalFaculties,
                },
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Fetch stats error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
