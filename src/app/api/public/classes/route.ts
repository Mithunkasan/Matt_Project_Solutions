import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const classes = await prisma.classSchedule.findMany({
      orderBy: { date: "asc" },
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error("Failed to fetch classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}
