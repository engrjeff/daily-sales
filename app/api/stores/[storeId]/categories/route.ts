import { NextResponse } from "next/server"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const categories = await prisma.category.findMany({
      where: { storeId: params.storeId },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.log("Get Categories Error: ", error)

    return NextResponse.json([])
  }
}
