"use client";
import { useEffect, useState } from "react";
import { ArticleType } from "@/lib/types";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useArticle = () => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(
    null
  );
  const { articleId } = useParams<{ articleId: string }>();

  const getSelectedArticle = async () => {
    if (!articleId) {
      return;
    }

    const response = await fetch(`/api/article/${articleId}`);

    if (!response.ok) {
      toast.error("Failed to get article!");
    }

    const { data } = await response.json();
    if (data) {
      setSelectedArticle(data);
    }
  };

  useEffect(() => {
    getSelectedArticle();
  }, []);

  return { selectedArticle };
};
