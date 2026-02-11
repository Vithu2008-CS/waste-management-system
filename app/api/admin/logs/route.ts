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

        const logs = await prisma.systemLog.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 100, // Limit to last 100 logs
        })

        return NextResponse.json({ logs }, { status: 200 })
    } catch (error) {
        console.error('Fetch logs error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
