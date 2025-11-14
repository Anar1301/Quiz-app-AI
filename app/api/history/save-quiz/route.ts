import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type UserAnswer = {
  quizID: number;
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};

type BodyType = {
  user: number;
  articleID: number;
  userAnswers: UserAnswer[];
  correctAnswers: number;
  timeSpent: number;
};

export async function POST(req: NextRequest) {
  try {
    const body: BodyType = await req.json();
    const { user, articleID, userAnswers, correctAnswers, timeSpent } = body;

    // QuizAttempt үүсгэх
    const quizAttempt = await prisma.quizattempt.create({
      data: {
        userid: user,
        timespent: timeSpent,
        score: correctAnswers,
      },
    });

    // Хариултуудыг хадгалах
    await prisma.quizanswer.createMany({
      data: userAnswers.map((a) => ({
        quizattemptid: quizAttempt.id,
        quizid: a.quizID,
        question: a.question,
        selected: a.selected,
        correct: a.correct,
        iscorrect: a.isCorrect,
      })),
    });

    return NextResponse.json({ success: true, attemptId: quizAttempt.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save quiz attempt" },
      { status: 500 }
    );
  }
}
