import React from "react";

export const QuizGeneratorHeading = () => {
  return (
    <div className="flex gap-2 items-center">
      <img src="/article-icon.svg" alt="" className="w-6 h-6" />
      <div className="text-2xl leading-8 font-semibold text-foreground">
        Article Quiz Generator
      </div>
    </div>
  );
};
