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

//     const projects = await prisma.project.findMany({
//       orderBy: { createdAt: 'desc' }
//     })

//     return NextResponse.json(projects)
//   } catch (error) {
//     console.error('Failed to fetch projects:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch projects' },
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

//     console.log('Received data:', data)

//     // Validate required fields
//     const requiredFields = ['name', 'college', 'department', 'handler', 'team', 'student', 'date']
//     const missingFields = requiredFields.filter(field => !data[field])

//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { error: `Missing required fields: ${missingFields.join(', ')}` },
//         { status: 400 }
//       )
//     }

//     // Parse date
//     let projectDate: Date;
//     try {
//       projectDate = new Date(data.date);
//       if (isNaN(projectDate.getTime())) {
//         throw new Error('Invalid date');
//       }
//     } catch (error) {
//       return NextResponse.json(
//         { error: 'Invalid date format' },
//         { status: 400 }
//       )
//     }

//     // Ensure numeric values are properly typed
//     const amountPaid = Number(data.amountPaid) || 0;
//     const finalAmount = Number(data.finalAmount) || 0;

//     // Calculate payment progress
//     const paymentProgress = finalAmount > 0 ? 
//       Math.round((amountPaid / finalAmount) * 100) : 0;

//     console.log('Creating project with data:', {
//       name: data.name,
//       college: data.college,
//       department: data.department,
//       handler: data.handler,
//       team: data.team,
//       student: data.student,
//       date: projectDate,
//       amountPaid: amountPaid,
//       finalAmount: finalAmount,
//       status: data.status || 'pending',
//       paymentProgress: paymentProgress
//       // createdAt and updatedAt are automatically handled by Prisma
//     })

//     const project = await prisma.project.create({
//       data: {
//         name: data.name,
//         college: data.college,
//         department: data.department,
//         handler: data.handler,
//         team: data.team,
//         student: data.student,
//         date: projectDate,
//         amountPaid: amountPaid,
//         finalAmount: finalAmount,
//         status: data.status || 'pending',
//         paymentProgress: paymentProgress
//         // Don't include createdAt and updatedAt - they're auto-generated
//       }
//     })

//     console.log('Project created successfully:', project)
//     return NextResponse.json(project)

//   } catch (error: any) {
//     console.error('Failed to create project:', error)

//     return NextResponse.json(
//       { 
//         error: 'Failed to create project',
//         details: error.message,
//         code: error.code
//       },
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

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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

    console.log('Received data:', data)

    // Validate required fields
    const requiredFields = ['name', 'college', 'department', 'handler', 'team', 'student', 'date']
    const missingFields = requiredFields.filter(field => !data[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Parse date
    let projectDate: Date;
    try {
      projectDate = new Date(data.date);
      if (isNaN(projectDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Ensure numeric values are properly typed
    const amountPaid = Number(data.amountPaid) || 0;
    const finalAmount = Number(data.finalAmount) || 0;

    // Calculate payment progress
    const paymentProgress = finalAmount > 0 ?
      Math.round((amountPaid / finalAmount) * 100) : 0;

    const project = await prisma.project.create({
      data: {
        name: data.name,
        college: data.college,
        department: data.department,
        handler: data.handler,
        team: data.team,
        student: data.student,
        studentEmail: data.studentEmail || null,
        date: projectDate,
        amountPaid: amountPaid,
        finalAmount: finalAmount,
        status: data.status || 'pending',
        paymentProgress: paymentProgress
      }
    })

    return NextResponse.json(project)

  } catch (error: unknown) {
    console.error('Failed to create project:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as { code?: string }).code;

    return NextResponse.json(
      {
        error: 'Failed to create project',
        details: errorMessage,
        code: errorCode
      },
      { status: 500 }
    )
  }
}