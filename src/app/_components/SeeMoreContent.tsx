import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { ArticleType } from "@/lib/types";

export const SeeMoreContent = ({
  selectedArticle,
}: {
  selectedArticle: ArticleType;
}) => {
  return (
    <DialogContent className="sm:max-w-157 p-7">
      <DialogHeader className="gap-5">
        <DialogTitle className="text-2xl leading-8 py-1">
          {selectedArticle?.title}
        </DialogTitle>
        <DialogDescription className="text-foreground">
          {selectedArticle?.content}
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};
