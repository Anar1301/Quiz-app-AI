import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId параметр заавал хэрэгтэй" },
        { status: 400 }
      );
    }

    const id = parseInt(userId);

    // 🧠 Хэрэглэгчийн бүх оролт (quizattempt) + quiz + article-г хамт татна
    const history = await prisma.quizattempt.findMany({
      where: { userid: id },
      include: {
        quiz: {
          include: {
            article: {
              select: { id: true, title: true, summary: true },
            },
          },
        },
        quizanswer: true,
      },
      orderBy: { createdat: "desc" },
    });

    // 🧾 Хэрэглэгчийн ерөнхий score-г нэмэлтээр авах
    const userScore = await prisma.userscore.findMany({
      where: { userid: id },
      include: {
        quiz: {
          select: { question: true, articleid: true },
        },
      },
      orderBy: { createdat: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        attempts: history,
        scores: userScore,
      },
    });
  } catch (error) {
    console.error("GET /api/history/user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
}
