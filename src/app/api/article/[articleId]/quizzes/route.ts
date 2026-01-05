import { prisma } from "@/lib/prisma";
import { QuizType } from "@/lib/types";
import { parseJsonBlockSafe } from "@/lib/utils/get-clean-text";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) => {
  const { articleId } = await params;

  const quizCollection = await prisma.quizzes.findMany({
    where: {
      articleid: articleId,
    },
    omit: { createdat: true, updatedat: true },
  });

  return NextResponse.json({ data: quizCollection }, { status: 200 });
};

export async function POST(request: NextRequest) {
  const { selectedArticleSummary, articleId } = await request.json();

  if (!selectedArticleSummary || !articleId) {
    return NextResponse.json(
      { error: "Missing required fields!" },
      { status: 400 }
    );
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate 5 multiple choice questions based on this article: ${selectedArticleSummary}. Return the response in this exact JSON format:
      [
        {
          "question": "Question text here",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "0"
        }
      ]
      Make sure the response is valid JSON and the answer is the index (0-3) of the correct option.`,
  });

  const generatedQuiz = response.text;

  const quizObj = parseJsonBlockSafe(generatedQuiz!);
  if (!quizObj) {
    return NextResponse.json(
      { error: "Failed to generate quiz!" },
      { status: 500 }
    );
  }

  try {
    quizObj.map(async (item: QuizType) => {
      await prisma.quizzes.create({
        data: {
          question: item.question,
          options: item.options,
          answer: item.answer.toString(),
          articleid: articleId,
        },
      });
    });

    return NextResponse.json({
      message: "Quiz added to DB successfully",
    });
  } catch (error) {
    console.error("Error while adding quiz to DB!", error);
  }

  return NextResponse.json(
    { error: "Failed to add quiz to DB!" },
    { status: 500 }
  );
}
