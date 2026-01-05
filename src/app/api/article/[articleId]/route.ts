import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) => {
  const { articleId } = await params;

  const article = await prisma.articles.findFirst({
    where: {
      id: articleId,
    },
    omit: { userid: true, createdat: true, updatedat: true },
  });

  return NextResponse.json({ data: article }, { status: 200 });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) => {
  const { articleId } = await params;

  const attempts = await prisma.attempts.findMany({
    where: { articleid: articleId },
    select: { id: true },
  });

  const attemptsIds = attempts.map((el: { id: any }) => el.id);

  // zuvhun ter article -iin attempts id--ig olood score deere ugch yabulj ustgana
  const deleteScores = prisma.scores.deleteMany({
    where: { attemptid: { in: attemptsIds } },
  });
  const deleteAttempts = prisma.attempts.deleteMany({
    where: { articleid: articleId },
  });
  const deleteQuizzes = prisma.quizzes.deleteMany({
    where: { articleid: articleId },
  });
  const deleteArticle = prisma.articles.delete({ where: { id: articleId } });

  await prisma.$transaction([
    deleteScores,
    deleteAttempts,
    deleteQuizzes,
    deleteArticle,
  ]);

  return NextResponse.json({ data: "" });
};
