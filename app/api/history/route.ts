import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ID } = await req.json();

    if (!ID) {
      return NextResponse.json(
        { error: "Article ID заавал хэрэгтэй" },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: Number(ID) },
      include: {
        Quiz: {
          select: {
            question: true,
            options: true,
            answer: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article олдсонгүй" }, { status: 404 });
    }

    return NextResponse.json({ data: article });
  } catch (error: any) {
    console.error("Error fetching article history:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
