// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// // DELETE class by ID
// export async function DELETE(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     // Extract the ID from the URL
//     const { pathname } = request.nextUrl;
//     const id = pathname.split("/").pop(); // get last part of URL

//     if (!id) return NextResponse.json({ error: "ID not provided" }, { status: 400 });

//     await prisma.classSchedule.delete({ where: { id } });

//     return NextResponse.json({ message: "Class schedule deleted" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
//   }
// }

// // PUT (edit) class by ID
// export async function PUT(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { pathname } = request.nextUrl;
//     const id = pathname.split("/").pop(); // get last part of URL

//     if (!id) return NextResponse.json({ error: "ID not provided" }, { status: 400 });

//     const data = await request.json();

//     const updatedClass = await prisma.classSchedule.update({
//       where: { id },
//       data: {
//         ...data,
//         date: data.date ? new Date(data.date) : undefined,
//       },
//     });

//     return NextResponse.json(updatedClass);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
//   }
// }







import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// DELETE class by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // Await the params

    if (!id) return NextResponse.json({ error: "ID not provided" }, { status: 400 });

    await prisma.classSchedule.delete({ where: { id } });

    return NextResponse.json({ message: "Class schedule deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
  }
}

// PUT (edit) class by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // Await the params

    if (!id) return NextResponse.json({ error: "ID not provided" }, { status: 400 });

    const data = await request.json();

    const updatedClass = await prisma.classSchedule.update({
      where: { id },
      data: {
        project: data.project,
        day: data.day,
        time: data.time,
        location: data.location,
        department: data.department,
        faculty: data.faculty,
        // Only update date if it exists in the request
        ...(data.date && { date: new Date(data.date) }),
      },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
  }
}

// GET class by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // Await the params

    if (!id) return NextResponse.json({ error: "ID not provided" }, { status: 400 });

    const classSchedule = await prisma.classSchedule.findUnique({
      where: { id },
    });

    if (!classSchedule) {
      return NextResponse.json({ error: "Class schedule not found" }, { status: 404 });
    }

    return NextResponse.json(classSchedule);
  } catch (error) {
    console.error("Get error:", error);
    return NextResponse.json({ error: "Failed to fetch class" }, { status: 500 });
  }
}