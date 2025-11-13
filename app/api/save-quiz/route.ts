import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type BodyType = {
  ID: string | null;
  userAnswers: {
    question: string;
    selected: string;
    correct: string;
    isCorrect: boolean;
  }[];
  correctAnswers: number;
  timeSpent: number;
};

export async function POST(req: NextRequest) {
  try {
    const body: BodyType = await req.json();

    if (!body.ID) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const articleId = parseInt(body.ID);

    const quizResult = await prisma.quizResult.create({
      data: {
        articleid: articleId,
        correctAnswers: body.correctAnswers,
        timeSpent: body.timeSpent,
        answers: body.userAnswers, // JSON column
      },
    });

    return NextResponse.json({ success: true, quizResult });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save quiz" }, { status: 500 });
  }
}
