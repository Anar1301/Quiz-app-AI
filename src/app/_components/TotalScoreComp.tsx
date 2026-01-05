import { QuizAttemptScoreType } from "@/lib/types";
import React from "react";

export const TotalScoreComp = ({
  attemptScores,
}: {
  attemptScores: QuizAttemptScoreType[];
}) => {
  let userPrevTotalScore = 0;
  attemptScores.forEach(
    (attempScore) => (userPrevTotalScore += attempScore.score)
  );

  return (
    <div className="text-sm leading-5 font-medium">
      Total score: {userPrevTotalScore}
    </div>
  );
};
