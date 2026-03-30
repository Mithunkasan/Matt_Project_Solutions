// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const classes = await prisma.classSchedule.findMany({
//       orderBy: { date: 'asc' }
//     })

//     return NextResponse.json(classes)
//   } catch (error) {
//     console.error('Failed to fetch classes:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch classes' },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const data = await request.json()

//     const classSchedule = await prisma.classSchedule.create({
//       data: {
//         ...data,
//         date: new Date(data.date)
//       }
//     })

//     return NextResponse.json(classSchedule)
//   } catch (error) {
//     console.error('Failed to create class schedule:', error)
//     return NextResponse.json(
//       { error: 'Failed to create class schedule' },
//       { status: 500 }
//     )
//   }
// }







import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Filter by student email if user is a student
    const where = session.user.role === 'ADMIN' ? {} : { studentEmail: session.user.email };

    const classes = await prisma.classSchedule.findMany({
      where,
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Failed to fetch classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const classSchedule = await prisma.classSchedule.create({
      data: {
        ...data,
        studentEmail: data.studentEmail || null,
        date: new Date(data.date)
      }
    })

    return NextResponse.json(classSchedule)
  } catch (error) {
    console.error('Failed to create class schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create class schedule' },
      { status: 500 }
    )
  }
}