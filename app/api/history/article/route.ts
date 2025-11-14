import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { articleID } = await req.json();

    if (!articleID) {
      return NextResponse.json(
        { error: "Article ID заавал хэрэгтэй" },
        { status: 400 }
      );
    }

    // Article болон холбоотой quiz, attempt, score, user-г хамтад нь татах
    const article = await prisma.article.findUnique({
      where: { id: Number(articleID) },
      include: {
        quiz: {
          include: {
            quizanswer: true,
            userscore: true,
            quizattempt: {
              include: { quizanswer: true, user: true },
            },
          },
        },
        user: true,
      },
    });

    if (!article) {
      return NextResponse.json({
        message: "Article олдсонгүй",
        data: null,
      });
    }

    return NextResponse.json({
      message: "Article мэдээлэл амжилттай татагдлаа",
      data: article,
    });
  } catch (error: any) {
    console.error("Error fetching article by ID:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
