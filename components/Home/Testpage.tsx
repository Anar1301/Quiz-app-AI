import React from "react";
import { Button } from "../ui/button";
import { HistoryDataType, UserAnswer } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const TestPage = ({
  setPage,
  setStep,
  setUserAnswers,
  setCorrectAnswers,
  result,
  step,
  HandleOnAnswer,
  seconds,
  setTimerRunning,
}: {
  step: number;
  HandleOnAnswer: Function;
  setPage: Function;
  setStep: Function;
  setUserAnswers: Function;
  setCorrectAnswers: Function;
  result: HistoryDataType;
  seconds: number;
  setTimerRunning: Function;
}) => {
  return (
    <div>
      <div className="flex  gap-4 items-center mb-4">
        <h1 className="font-bold text-2xl">Quick Test</h1>
        <div className="text-gray-500 text-lg">
          Time: {Math.floor(seconds / 60)}:
          {(seconds % 60).toString().padStart(2, "0")}
        </div>

        <div className="ml-67">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">X</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="p-6 border-2 rounded-xl w-[500px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold mb-2">
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-red-600 mb-4">
                  If you press 'Cancel', this quiz will restart from the
                  beginning.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex justify-between ">
                <AlertDialogCancel className="bg-black text-white w-44 h-10 rounded-md">
                  Go Back
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-white text-black border-2 w-44 h-10 rounded-md"
                  onClick={() => {
                    setPage("page");
                    setStep(0);
                    setUserAnswers([]);
                    setCorrectAnswers(0);
                    setTimerRunning(false);
                  }}
                >
                  Cancel quiz
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="text-[#71717A]">
        Take a quick test about your knowledge from your content{" "}
      </div>
      <div className="flex items-center justify-between mt-5">
        <div className="mb-6 font-semibold text-lg ">
          {result.quiz[step].question}
        </div>
        <div className="mb-4 text-gray-500 ">
          {step + 1} / {result.quiz.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {result.quiz[step].options.map((opt, idx) => (
          <Button
            key={idx}
            variant="outline"
            onClick={() => HandleOnAnswer(idx)}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
