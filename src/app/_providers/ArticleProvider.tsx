"use client";

import { cleanText } from "@/lib/utils/get-clean-text";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

type Props = { children: ReactNode };

type ArticleContextType = {
  articleTitle: string;
  setArticleTitle: (articleTitle: string) => void;
  articleContent: string;
  setArticleContent: (articleContent: string) => void;
  generateSummary: () => void;
  loading: boolean;
};

const ArticleContext = createContext<ArticleContextType>(
  {} as ArticleContextType
);

export const ArticleProvider = ({ children }: Props) => {
  const [articleTitle, setArticleTitle] = useState<string>("");
  const [articleContent, setArticleContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { user } = useUser();
  const clerkId = user?.id;

  const generateSummary = async () => {
    if (!articleTitle || !articleContent) {
      toast.warning("All fields are required!");
      return;
    }

    setLoading(true);

    const response = await fetch(`/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleTitle, articleContent }),
    });

    if (!response.ok) {
      toast.error("Failed to generate summary!");
    }

    const result = await response.json();

    const cleanedAricleTitle = cleanText(articleTitle);
    const cleanedArticleContent = cleanText(articleContent);
    const cleanedSummary = cleanText(result.text);

    const res = await fetch(`/api/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: cleanedAricleTitle,
        content: cleanedArticleContent,
        summary: cleanedSummary,
        userClerkId: clerkId,
      }),
    });

    mutate("/articles");

    if (!res.ok) {
      toast.error("Failed to add article!");
    }

    const { data } = await res.json();
    toast.success("Article added successfully");
    setArticleTitle("");
    setArticleContent("");
    setLoading(false);
    if (data?.id) {
      router.push(`/article/${data.id}`);
    }
  };

  return (
    <ArticleContext.Provider
      value={{
        articleTitle,
        setArticleTitle,
        articleContent,
        setArticleContent,
        generateSummary,
        loading,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};
export const useData = () => {
  return useContext(ArticleContext);
};
