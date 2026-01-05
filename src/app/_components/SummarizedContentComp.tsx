import { Label } from "@/components/ui";
import { ArticleType } from "@/lib/types";
import React from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { PiBookOpen } from "react-icons/pi";

export const SummarizedContentComp = ({
  selectedArticle,
}: {
  selectedArticle: ArticleType;
}) => {
  return (
    <div className="flex flex-col gap-2 text-sm leading-5 text-foreground font-semibold">
      <div className="flex gap-2 items-center">
        <PiBookOpen size={16} />
        <Label className="text-[#737373]">Summarized content</Label>
      </div>
      <>
        {!selectedArticle && (
          <div className="flex justify-center items-center">
            <LuLoaderCircle size={24} className="animate-spin" />
          </div>
        )}
      </>
      {selectedArticle && (
        <div className="flex flex-col gap-2">
          <div className="text-2xl leading-8">{selectedArticle?.title}</div>
          <div className="font-normal">{selectedArticle?.summary}</div>
        </div>
      )}
    </div>
  );
};
