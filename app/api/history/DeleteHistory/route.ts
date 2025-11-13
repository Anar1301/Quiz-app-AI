import { query } from "@/lib/connectDb";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ID } = await req.json();
    const id = ID;
    const deletetitle = await prisma.article.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
