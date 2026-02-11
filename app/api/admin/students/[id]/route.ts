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
        const { name, email, phone, rollNumber, department, year, password } = body

        // Update User data
        const userData: any = {}
        if (name) userData.name = name
        if (email) userData.email = email
        if (phone) userData.phone = phone
        if (password) userData.password = await hashPassword(password)

        // Update Student data
        const studentData: any = {}
        if (rollNumber) studentData.rollNumber = rollNumber
        if (department) studentData.department = department
        if (year) studentData.year = parseInt(year)

        const student = await prisma.student.update({
            where: { id: params.id },
            data: {
                ...studentData,
                user: {
                    update: userData
                }
            },
            include: {
                user: true
            }
        })

        return NextResponse.json({ student }, { status: 200 })
    } catch (error) {
        console.error('Update student error:', error)
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

        const student = await prisma.student.findUnique({
            where: { id: params.id },
            include: {
                complaints: true
            }
        })

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 })
        }

        // Check if student has complaints
        if (student.complaints && student.complaints.length > 0) {
            return NextResponse.json({
                error: `Cannot delete student with ${student.complaints.length} complaint(s). Please delete or reassign complaints first.`
            }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id: student.userId },
        })

        return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 })
    } catch (error: any) {
        console.error('Delete student error:', error)
        if (error.code === 'P2003') {
            return NextResponse.json({
                error: 'Cannot delete student due to related records. Please remove related data first.'
            }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
