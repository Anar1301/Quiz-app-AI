import { Button } from "@/components/ui";
import { QuizType } from "@/lib/types";
import React from "react";

export const MainQuiz = ({
  selectedArticleQuizzes,
  step,
  quizStepScoreHandler,
}: {
  selectedArticleQuizzes: QuizType[];
  step: number;
  quizStepScoreHandler: (index: string, quiz: QuizType) => void;
}) => {
  return (
    <div>
      {selectedArticleQuizzes?.map((quiz, i) => {
        return (
          step === i && (
            <div key={quiz.id} className="flex flex-col gap-5">
              <div className="flex gap-2 text-xl leading-7 font-medium">
                <div className="w-auto">{quiz.question}</div>
                <div>
                  {i + 1}
                  <span className="text-base leading-6 text-muted-foreground">
                    /{selectedArticleQuizzes.length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {quiz.options.map((option, index) => (
                  <Button
                    onClick={() => {
                      quizStepScoreHandler(index.toString(), quiz);
                    }}
                    key={option}
                    variant={"outline"}
                    className="w-auto min-h-10 h-auto whitespace-pre-wrap cursor-pointer"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};
