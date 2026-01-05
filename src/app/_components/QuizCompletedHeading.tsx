import React from "react";

export const QuizCompletedHeading = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center text-2xl leading-8 font-semibold">
        <img src="/article-icon.svg" alt="" className="w-6 h-6" />
        <div>Quiz completed</div>
      </div>
      <div className="text-base leading-6 font-medium text-muted-foreground">
        Let’s see what you did
      </div>
    </div>
  );
};
