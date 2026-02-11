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

        const students = await prisma.student.findMany({
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

        return NextResponse.json({ students }, { status: 200 })
    } catch (error) {
        console.error('Fetch students error:', error)
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
        const { name, email, password, phone, rollNumber, department, year } = body

        if (!name || !email || !password || !rollNumber || !department || !year) {
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

        // Check if student exists
        const existingStudent = await prisma.student.findUnique({
            where: { rollNumber },
        })

        if (existingStudent) {
            return NextResponse.json(
                { error: 'Student with this roll number already exists' },
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
                role: 'STUDENT',
                student: {
                    create: {
                        rollNumber,
                        department,
                        year: parseInt(year),
                    },
                },
            },
            include: {
                student: true,
            },
        })

        return NextResponse.json(
            { message: 'Student created successfully', student: user.student },
            { status: 201 }
        )
    } catch (error) {
        console.error('Create student error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
