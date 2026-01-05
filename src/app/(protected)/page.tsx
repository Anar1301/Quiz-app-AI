"use client";

import React from "react";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { LuLoaderCircle } from "react-icons/lu";
import { QuizGeneratorHeading } from "../_components";
import { ArticleProvider, useData } from "../_providers/ArticleProvider";

const Homepage = () => {
  const {
    articleTitle,
    setArticleTitle,
    articleContent,
    setArticleContent,
    generateSummary,
    loading,
  } = useData();

  return (
    <ArticleProvider>
      <div className="w-full h-full bg-secondary flex justify-center">
        <div className="bg-background flex flex-col p-7 mt-26 mx-64 rounded-lg h-fit gap-5 text-muted-foreground border border-border">
          <div className="flex flex-col gap-2">
            <QuizGeneratorHeading />
            <div className="text-base leading-[19px]">
              Paste your article below to generate a summarize and quiz
              question. Your articles will saved in the sidebar for future
              reference.
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1 text-sm leading-5">
              <div className="flex gap-1 items-center">
                <img
                  src="/article-note.svg"
                  alt=""
                  className="px-0.5 py-[px]"
                />
                <Label className="font-semibold">Article Title</Label>
              </div>
              <Input
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="Enter a title for your article..."
                className="h-10 py-2 text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1 text-sm leading-5">
              <div className="flex gap-1 items-center">
                <img
                  src="/article-note.svg"
                  alt=""
                  className="px-0.5 py-[px]"
                />
                <Label className="font-semibold">Article Content</Label>
              </div>
              <Textarea
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                placeholder="Paste your article content here..."
                className="min-h-30 text-foreground"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={generateSummary}
                size={"lg"}
                className="w-fit px-4 cursor-pointer"
                disabled={!articleTitle || !articleContent || loading}
              >
                {loading && <LuLoaderCircle className="animate-spin" />}
                Generate summary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ArticleProvider>
  );
};
export default Homepage;
