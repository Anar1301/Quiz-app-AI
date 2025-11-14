import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
  const articles = await prisma.article.findMany({
    include: { quiz: true, user: true },
    orderBy: { id: "desc" },
  });

  return NextResponse.json({ data: articles });
}

export async function POST(req: NextRequest) {
  try {
    const { content, title, user } = await req.json();
    console.log({ user });

    if (!content || !title) {
      return NextResponse.json(
        { error: "content болон articleTitle заавал хэрэгтэй" },
        { status: 400 }
      );
    }

    // 1️⃣ Хэрэглэгчийг шалгаад үүсгэх / шинэчлэх
    const DeployUser = await prisma.user.upsert({
      where: { email: user.primaryEmailAddress.emailAddress },
      update: {
        name: user.fullName,
        clerk_id: user.id,
      },
      create: {
        clerk_id: user.id,
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName,
      },
    });

    // 2️⃣ Gemini AI-аар summary гаргах
    const prompt = `Please provide a concise summary of the following article: ${content}`;
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const summary =
      typeof (aiResponse as any).text === "string"
        ? (aiResponse as any).text
        : JSON.stringify(aiResponse);

    // 3️⃣ Article-ийг хэрэглэгчийн ID-тай холбож үүсгэх
    const createdArticle = await prisma.article.create({
      data: {
        title: title,
        content: content,
        summary,
        userid: DeployUser.id, // ← холбоож байна
      },
      include: { user: true },
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
