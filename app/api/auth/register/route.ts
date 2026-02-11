import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password, phone, role, rollNumber, department, year, licenseNumber, vehicleNumber } = body

        // Validate required fields
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user based on role
        if (role === 'STUDENT') {
            if (!rollNumber || !department || !year) {
                return NextResponse.json(
                    { error: 'Missing student details' },
                    { status: 400 }
                )
            }

            // Check if roll number already exists
            const existingStudent = await prisma.student.findUnique({
                where: { rollNumber },
            })

            if (existingStudent) {
                return NextResponse.json(
                    { error: 'Student with this roll number already exists' },
                    { status: 400 }
                )
            }

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
                {
                    message: 'Student registered successfully',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                },
                { status: 201 }
            )
        } else if (role === 'DRIVER') {
            if (!licenseNumber || !vehicleNumber) {
                return NextResponse.json(
                    { error: 'Missing driver details' },
                    { status: 400 }
                )
            }

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
                {
                    message: 'Driver registered successfully',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                },
                { status: 201 }
            )
        } else if (role === 'ADMIN') {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    role: 'ADMIN',
                    admin: {
                        create: {
                            department: department || 'Administration',
                        },
                    },
                },
                include: {
                    admin: true,
                },
            })

            return NextResponse.json(
                {
                    message: 'Admin registered successfully',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                },
                { status: 201 }
            )
        }

        return NextResponse.json(
            { error: 'Invalid role' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
