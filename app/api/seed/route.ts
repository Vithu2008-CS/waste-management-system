import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET() {
    try {
        console.log('Starting database seed via API...')

        // 1. Create/Update Admin User
        const adminPassword = await bcrypt.hash('password123', 12)
        await prisma.user.upsert({
            where: { email: 'admin@eu.edu' },
            update: {},
            create: {
                name: 'Admin User',
                email: 'admin@eu.edu',
                password: adminPassword,
                phone: '+94771234567',
                role: 'ADMIN',
                admin: {
                    create: {
                        department: 'Administration',
                    },
                },
            },
        })
        console.log('✓ Processed admin user')

        // 2. Create/Update Faculties
        const engFaculty = await prisma.faculty.upsert({
            where: { code: 'ENG' },
            update: {},
            create: {
                name: 'Faculty of Engineering',
                code: 'ENG',
                description: 'Engineering faculty building',
                location: 'Main Campus - Block A',
            },
        })

        const sciFaculty = await prisma.faculty.upsert({
            where: { code: 'SCI' },
            update: {},
            create: {
                name: 'Faculty of Science',
                code: 'SCI',
                description: 'Science faculty building',
                location: 'Main Campus - Block B',
            },
        })

        const artsFaculty = await prisma.faculty.upsert({
            where: { code: 'ARTS' },
            update: {},
            create: {
                name: 'Faculty of Arts',
                code: 'ARTS',
                description: 'Arts faculty building',
                location: 'Main Campus - Block C',
            },
        })
        console.log('✓ Processed faculties')

        // 3. Create/Update Dustbins
        await prisma.dustbin.upsert({
            where: { code: 'DB-ENG-001' },
            update: {},
            create: {
                code: 'DB-ENG-001',
                location: 'Engineering Block - Ground Floor',
                latitude: 6.9271,
                longitude: 79.8612,
                capacity: 120,
                facultyId: engFaculty.id,
            },
        })

        await prisma.dustbin.upsert({
            where: { code: 'DB-ENG-002' },
            update: {},
            create: {
                code: 'DB-ENG-002',
                location: 'Engineering Block - First Floor',
                latitude: 6.9272,
                longitude: 79.8613,
                capacity: 120,
                facultyId: engFaculty.id,
            },
        })

        await prisma.dustbin.upsert({
            where: { code: 'DB-SCI-001' },
            update: {},
            create: {
                code: 'DB-SCI-001',
                location: 'Science Block - Ground Floor',
                latitude: 6.9273,
                longitude: 79.8614,
                capacity: 100,
                facultyId: sciFaculty.id,
            },
        })

        await prisma.dustbin.upsert({
            where: { code: 'DB-ARTS-001' },
            update: {},
            create: {
                code: 'DB-ARTS-001',
                location: 'Arts Block - Ground Floor',
                latitude: 6.9274,
                longitude: 79.8615,
                capacity: 100,
                facultyId: artsFaculty.id,
            },
        })
        console.log('✓ Processed dustbins')

        // 4. Create/Update Student User
        const studentPassword = await bcrypt.hash('password123', 12)
        await prisma.user.upsert({
            where: { email: 'student@eu.edu' },
            update: {},
            create: {
                name: 'John Doe',
                email: 'student@eu.edu',
                password: studentPassword,
                phone: '+94771234568',
                role: 'STUDENT',
                student: {
                    create: {
                        rollNumber: 'EU2024001',
                        department: 'Computer Science',
                        year: 2,
                    },
                },
            },
        })
        console.log('✓ Processed student user')

        // 5. Create/Update Driver Users
        const driverPassword = await bcrypt.hash('password123', 12)
        await prisma.user.upsert({
            where: { email: 'driver@eu.edu' },
            update: {},
            create: {
                name: 'Mike Driver',
                email: 'driver@eu.edu',
                password: driverPassword,
                phone: '+94771234569',
                role: 'DRIVER',
                driver: {
                    create: {
                        licenseNumber: 'DL123456',
                        vehicleNumber: 'CAA-1234',
                        status: 'ACTIVE',
                        currentLat: 6.9270,
                        currentLng: 79.8610,
                        lastLocation: new Date(),
                    },
                },
            },
        })
        console.log('✓ Processed driver user 1')

        const driver2Password = await bcrypt.hash('password123', 12)
        await prisma.user.upsert({
            where: { email: 'driver2@eu.edu' },
            update: {},
            create: {
                name: 'Sarah Driver',
                email: 'driver2@eu.edu',
                password: driver2Password,
                phone: '+94771234570',
                role: 'DRIVER',
                driver: {
                    create: {
                        licenseNumber: 'DL789012',
                        vehicleNumber: 'CAB-5678',
                        status: 'INACTIVE',
                    },
                },
            },
        })
        console.log('✓ Processed driver user 2')

        console.log('Database seeded successfully!')

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully! ✅',
            data: {
                users: {
                    admin: 'admin@eu.edu',
                    student: 'student@eu.edu',
                    drivers: ['driver@eu.edu', 'driver2@eu.edu']
                },
                faculties: ['Engineering', 'Science', 'Arts'],
                dustbins: 4,
                defaultPassword: 'password123'
            },
            warning: '⚠️ IMPORTANT: Delete this /api/seed endpoint after use for security!'
        }, { status: 200 })

    } catch (error) {
        console.error('Error seeding database:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to seed database',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
