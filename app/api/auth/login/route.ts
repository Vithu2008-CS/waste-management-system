import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                student: true,
                driver: true,
                admin: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Log the login
        await prisma.systemLog.create({
            data: {
                action: 'USER_LOGIN',
                userId: user.id,
                userRole: user.role,
                details: `User ${user.email} logged in`,
            },
        })

        // Return user data (excluding password)
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            ...(user.student && { student: user.student }),
            ...(user.driver && { driver: user.driver }),
            ...(user.admin && { admin: user.admin }),
        }

        return NextResponse.json(
            {
                message: 'Login successful',
                token,
                user: userData,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
