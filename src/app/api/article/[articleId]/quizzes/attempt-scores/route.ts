import { prisma } from "@/lib/prisma";
import { QuizResultType } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const { articleId } = await params;

  const attempts = await prisma.attempts.findMany({
    where: { articleid: articleId },
    orderBy: { createdat: "asc" },
    include: {
      scores: {
        where: { quizzes: { articleid: articleId } },
        select: {
          score: true,
          useranswer: true,
          correctanswer: true,
          quizzes: { select: { question: true, id: true } },
        },
      },
    },
  });

  return NextResponse.json({ attempts });
}

export async function POST(request: NextRequest) {
  const { userClerkId, quizResult, sec, articleId } = await request.json();

  const user = await prisma.users.findUnique({
    where: { clerkid: userClerkId },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Missing required field!" },
      { status: 400 }
    );
  }

  const attempt = await prisma.attempts.create({
    data: { articleid: articleId, userid: user.id, timespent: sec },
  });

  attempt &&
    quizResult.map(async (item: QuizResultType) => {
      await prisma.scores.create({
        data: {
          quizid: item.quizQuestionId,
          userid: user.id,
          attemptid: attempt.id,
          score: item.quizScore,
          useranswer: item.clientAnswer,
          correctanswer: item.quizCorrectAnswer,
        },
      });
    });

  return NextResponse.json({
    message: "Result added to DB successfully",
    status: 200,
  });
}
