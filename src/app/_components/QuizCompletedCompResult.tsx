import React from "react";
import { QuizResultType } from "@/lib/types";
import { LuCircleCheck } from "react-icons/lu";
import { IoCloseCircleOutline } from "react-icons/io5";

export const QuizCompletedCompResult = ({
  res,
  i,
}: {
  res: QuizResultType;
  i: number;
}) => {
  return (
    <div className="flex gap-3">
      <div>
        {res.clientAnswer !== res.quizCorrectAnswer ? (
          <IoCloseCircleOutline size={22} className="text-red-700" />
        ) : (
          <LuCircleCheck size={22} className="text-green-500" />
        )}
      </div>
      <div className="flex flex-col gap-1 text-xs leading-4 font-medium">
        <div className="text-muted-foreground">
          <span>{i + 1}. </span>
          {res.question}
        </div>
        <div>Your answer: {res.clientAnswer}</div>
        <div className="text-green-500">
          {res.clientAnswer !== res.quizCorrectAnswer &&
            `Correct: ${res.quizCorrectAnswer}`}
        </div>
      </div>
    </div>
  );
};
