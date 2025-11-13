import React from "react";
import { Button } from "../ui/button";
import { HistoryDataType, UserAnswer } from "@/lib/types";

const LastPage = ({
  setPage,
  setStep,
  setUserAnswers,
  setCorrectAnswers,
  result,
  correctAnswers,
  seconds,
  setSeconds,
  userAnswers,
  router,
  setTimerRunning,
}: {
  setPage: Function;
  setStep: Function;
  setUserAnswers: Function;
  setCorrectAnswers: Function;
  result: HistoryDataType;
  correctAnswers: any;
  seconds: number;
  setSeconds: Function;
  userAnswers: UserAnswer[];
  router: any;
  setTimerRunning: Function;
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">Quiz Completed</h1>
        <Button
          variant="outline"
          onClick={() => {
            setPage("page");
            setStep(0);
            setUserAnswers([]);
            setCorrectAnswers(0);
          }}
        >
          X
        </Button>
      </div>

      <div className="text-gray-500 mb-2">Your score:</div>
      <div className="font-bold text-xl mb-2">
        {correctAnswers} / {result.data.Quiz.length}
      </div>
      <div className="text-gray-500 mb-4">
        Time spent: {Math.floor(seconds / 60)}:
        {(seconds % 60).toString().padStart(2, "0")}
      </div>

      <div className="space-y-3 mb-4">
        {userAnswers.map((ans, idx) => (
          <div key={idx} className="flex gap-2 items-start border-b pb-2">
            <img
              src={ans.isCorrect ? "/rigth.svg" : "/wrong.svg"}
              className="w-5 h-5 mt-1"
            />
            <div>
              <div className="text-gray-700">
                {idx + 1}. {ans.question}
              </div>
              <div className="text-gray-800">Your answer: {ans.selected}</div>
              <div
                className={ans.isCorrect ? "text-green-600" : "text-red-600"}
              >
                Correct: {ans.correct}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setStep(0);
            setUserAnswers([]);
            setCorrectAnswers(0);
            setPage("test");
            setSeconds(0);
            setTimerRunning(true);
          }}
        >
          Restart Quiz
        </Button>
        <Button onClick={() => router.push(`/`)}>Save and Leave</Button>
      </div>
    </div>
  );
};

export default LastPage;
