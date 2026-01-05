import { QuizResultType, QuizType } from "@/lib/types";
import React from "react";

export const QuizCompletedCompScoreAndTime = ({
  selectedArticleQuizzes,
  quizResult,
  timeSpentOnQuiz,
}: {
  selectedArticleQuizzes: QuizType[];
  quizResult: QuizResultType[];
  timeSpentOnQuiz: string;
}) => {
  let userScore = 0;
  quizResult.forEach((item) => (userScore += item.quizScore));
  return (
    <div className="flex justify-between items-center text-2xl leading-8 font-semibold">
      <div>
        Your score: {userScore}
        <span className="text-base leading-6 font-medium text-muted-foreground">
          /{selectedArticleQuizzes.length}
        </span>
      </div>

      <div>
        Time spent:{" "}
        <span className="text-base leading-6 font-medium text-muted-foreground">
          {timeSpentOnQuiz}
        </span>
      </div>
    </div>
  );
};
