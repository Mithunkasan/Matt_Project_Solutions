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

async function getAssignedStudentEmails(handlerEmail: string) {
  const projects = await prisma.project.findMany({
    where: { handlerEmail, studentEmail: { not: null } },
    select: { studentEmail: true }
  });
  return projects.map(project => project.studentEmail).filter((email): email is string => Boolean(email));
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let where = {};
    if (session.user.role === 'PROJECT_HANDLER') {
      const studentEmails = await getAssignedStudentEmails(session.user.email);
      where = { studentEmail: { in: studentEmails } };
    } else if (session.user.role !== 'ADMIN') {
      where = { studentEmail: session.user.email };
    }

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

    if (!session?.user?.id || session.user.role !== 'PROJECT_HANDLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const studentEmail = data.studentEmail ? String(data.studentEmail).toLowerCase().trim() : null;

    const studentEmails = await getAssignedStudentEmails(session.user.email);
    if (!studentEmail || !studentEmails.includes(studentEmail)) {
      return NextResponse.json({ error: 'Student is not assigned to this project handler' }, { status: 403 })
    }

    const classSchedule = await prisma.classSchedule.create({
      data: {
        ...data,
        studentEmail,
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
