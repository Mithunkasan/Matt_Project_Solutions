// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const { id } = await params
    
//     // No conversion needed - id is already a string
//     // Just validate that it's not empty
//     if (!id || id.trim() === '') {
//       return NextResponse.json(
//         { error: 'Invalid project ID' },
//         { status: 400 }
//       )
//     }

//     await prisma.project.delete({
//       where: { id } // Use the string ID directly
//     })
    
//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Failed to delete project:', error)
    
//     // Handle specific Prisma errors
//     if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
//       return NextResponse.json(
//         { error: 'Project not found' },
//         { status: 404 }
//       )
//     }
    
//     return NextResponse.json(
//       { error: 'Failed to delete project' },
//       { status: 500 }
//     )
//   }
// }
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   const body = await req.json();
//   const updatedProject = await prisma.project.update({
//     where: { id: params.id },
//     data: body,
//   });
//   return NextResponse.json(updatedProject);
// }







import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    // No conversion needed - id is already a string
    // Just validate that it's not empty
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    await prisma.project.delete({
      where: { id } // Use the string ID directly
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete project:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    // Validate project ID
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const amountPaid = body.amountPaid !== undefined ? Number(body.amountPaid) || 0 : undefined
    const finalAmount = body.finalAmount !== undefined ? Number(body.finalAmount) || 0 : undefined
    const paymentProgress =
      amountPaid !== undefined && finalAmount !== undefined
        ? finalAmount > 0 ? Math.round((amountPaid / finalAmount) * 100) : 0
        : undefined

    const data = {
      ...(body.name !== undefined && { name: String(body.name) }),
      ...(body.college !== undefined && { college: String(body.college) }),
      ...(body.department !== undefined && { department: String(body.department) }),
      ...(body.handler !== undefined && { handler: String(body.handler) }),
      ...(body.handlerEmail !== undefined && { handlerEmail: body.handlerEmail ? String(body.handlerEmail).toLowerCase().trim() : null }),
      ...(body.team !== undefined && { team: String(body.team) }),
      ...(body.student !== undefined && { student: String(body.student) }),
      ...(body.studentEmail !== undefined && { studentEmail: body.studentEmail ? String(body.studentEmail).toLowerCase().trim() : null }),
      ...(body.date !== undefined && { date: new Date(body.date) }),
      ...(amountPaid !== undefined && { amountPaid }),
      ...(finalAmount !== undefined && { finalAmount }),
      ...(paymentProgress !== undefined && { paymentProgress }),
      ...(body.status !== undefined && { status: String(body.status) }),
    }
    
    const updatedProject = await prisma.project.update({
      where: { id },
      data,
      include: {
        files: true
      }
    })
    
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Failed to update project:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}
