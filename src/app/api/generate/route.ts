import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export async function POST(request: NextRequest) {
  const { articleTitle, articleContent } = await request.json();

  if (!articleTitle || !articleContent) {
    return NextResponse.json(
      { error: "Missing required fields!" },
      { status: 400 }
    );
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Please provide a concise, natural summary of the following article: 
    Title: ${articleTitle}
    Content: ${articleContent}  
     The summary should:
    - Focus on the article's core message and main points.
    - Flow naturally as a paragraph, not as a list or outline.
    - Contain enough meaningful details to allow relevant questions to be generated from it later.
    - Maximum length: 60 words
     
     Summary:`,
  });

  const generatedSummary = response.text;
  return NextResponse.json({
    message: "Summary generated successfully",
    text: generatedSummary,
  });
}
