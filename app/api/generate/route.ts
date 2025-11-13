import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
  const articles = await prisma.article.findMany({
    include: { Quiz: true },
    orderBy: { id: "desc" },
  });

  return NextResponse.json({ data: articles });
}

export async function POST(req: NextRequest) {
  try {
    const { content, title } = await req.json();

    if (!content || !title) {
      return NextResponse.json(
        { error: "content болон title заавал хэрэгтэй" },
        { status: 400 }
      );
    }

    // Gemini API-аар summary гаргах
    const prompt = `Please provide a concise summary of the following article: ${content}`;
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const summary = (aiResponse as any).text ?? aiResponse;

    // Article хадгалах (Prisma ашиглан)
    const createdArticle = await prisma.article.create({
      data: {
        title: title,
        content: content,
        summary: summary,
      },
    });

    return NextResponse.json({
      message: "Article амжилттай үүслээ",
      data: createdArticle,
    });
  } catch (err: any) {
    console.error("POST /api/generate error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
