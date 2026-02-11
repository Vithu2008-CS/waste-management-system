import prisma from './prisma'

interface Location {
    lat: number
    lng: number
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(loc2.lat - loc1.lat)
    const dLon = toRad(loc2.lng - loc1.lng)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(loc1.lat)) *
        Math.cos(toRad(loc2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return distance
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
}

/**
 * Find the nearest available driver to a given location
 */
export async function findNearestDriver(dustbinLocation: Location) {
    const activeDrivers = await prisma.driver.findMany({
        where: {
            status: 'ACTIVE',
            currentLat: { not: null },
            currentLng: { not: null },
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },
    })

    if (activeDrivers.length === 0) {
        // Return default parking location if no drivers available
        return {
            driver: null,
            distance: null,
            defaultLocation: {
                lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_PARKING_LAT || '6.9271'),
                lng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_PARKING_LNG || '79.8612'),
            },
        }
    }

    let nearestDriver = activeDrivers[0]
    let minDistance = calculateDistance(dustbinLocation, {
        lat: nearestDriver.currentLat!,
        lng: nearestDriver.currentLng!,
    })

    for (const driver of activeDrivers.slice(1)) {
        const distance = calculateDistance(dustbinLocation, {
            lat: driver.currentLat!,
            lng: driver.currentLng!,
        })

        if (distance < minDistance) {
            minDistance = distance
            nearestDriver = driver
        }
    }

    return {
        driver: nearestDriver,
        distance: minDistance,
        defaultLocation: null,
    }
}

/**
 * Assign complaint to nearest available driver
 */
export async function assignComplaintToDriver(complaintId: string) {
    const complaint = await prisma.complaint.findUnique({
        where: { id: complaintId },
        include: {
            dustbin: true,
        },
    })

    if (!complaint) {
        throw new Error('Complaint not found')
    }

    const { driver, distance } = await findNearestDriver({
        lat: complaint.dustbin.latitude,
        lng: complaint.dustbin.longitude,
    })

    if (!driver) {
        // No driver available, keep complaint pending
        return {
            success: false,
            message: 'No active drivers available. Complaint remains pending.',
        }
    }

    // Update complaint with assigned driver
    await prisma.complaint.update({
        where: { id: complaintId },
        data: {
            driverId: driver.id,
            status: 'ASSIGNED',
            assignedAt: new Date(),
        },
    })

    // Update driver status
    await prisma.driver.update({
        where: { id: driver.id },
        data: {
            status: 'ON_DUTY',
        },
    })

    return {
        success: true,
        driver,
        distance,
        message: `Complaint assigned to ${driver.user.name}`,
    }
}

/**
 * Try to assign all pending complaints
 * Useful when a driver becomes active
 */
export async function assignPendingComplaints() {
    const pendingComplaints = await prisma.complaint.findMany({
        where: { status: 'PENDING' },
    })

    let assignedCount = 0

    for (const complaint of pendingComplaints) {
        try {
            const result = await assignComplaintToDriver(complaint.id)
            if (result.success) {
                assignedCount++
            }
        } catch (error) {
            console.error(`Failed to assign complaint ${complaint.id}:`, error)
        }
    }

    return assignedCount
}
