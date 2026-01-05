"use client";
import React, { useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useParams } from "next/navigation";
import { QuizResultType, QuizType } from "@/lib/types";
import {
  CancelAndRestartQuiz,
  MainQuiz,
  QuizCompletedComp,
} from "@/app/_components";
import { useQuiz } from "@/app/_hooks/use-quiz";

const QuizPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { selectedArticleQuizzes } = useQuiz();
  const [step, setStep] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<QuizResultType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sec, setSec] = useState<number>(0);
  const [timeIsRunning, setTimeIsRunning] = useState<boolean>(false);
  const timeSpentOnQuiz =
    (Math.floor(sec / 60) < 10 ? "0" : "") +
    Math.floor(sec / 60) +
    ":" +
    (sec % 60 < 10 ? "0" : "") +
    (sec % 60);

  const quizStepScoreHandler = (selectedAnswerI: string, quiz: QuizType) => {
    const quizCorrectAnswer = quiz.options[JSON.parse(quiz.answer)];
    const clientAnswer = quiz.options[JSON.parse(selectedAnswerI)];

    let userQuizScore: number;
    if (quizCorrectAnswer === clientAnswer) {
      userQuizScore = 1;
    } else {
      userQuizScore = 0;
    }
    console.log({ quizResult });
    const newQuizResult = [
      ...quizResult,
      {
        quizQuestionId: quiz.id,
        question: quiz.question,
        clientAnswer: clientAnswer,
        quizCorrectAnswer: quizCorrectAnswer,
        quizScore: userQuizScore,
      },
    ];
    if (newQuizResult) {
      setQuizResult(newQuizResult);
    }

    setStep((prev) => prev + 1);
  };

  const restartQuizHandler = () => {
    setStep(0);
    setQuizResult([]);
    setSec(0);
  };

  useEffect(() => {
    if (!timeIsRunning) {
      return;
    }
    const timer = setInterval(() => {
      setSec((prevSec) => prevSec + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeIsRunning]);

  useEffect(() => {
    if (step === 0) {
      setTimeIsRunning(true);
    } else if (step >= selectedArticleQuizzes.length) {
      setTimeIsRunning(false);
    }
  }, [step]);

  return (
    <div className="w-full h-full bg-secondary flex justify-center">
      {step < selectedArticleQuizzes.length ? (
        <div className="flex flex-col mt-44 mx-50 gap-6 text-foreground">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center text-2xl leading-8 font-semibold">
                <img src="/article-icon.svg" alt="" className="w-6 h-6" />
                <div>Quick test</div>
              </div>
              <div className="text-base leading-6 font-medium text-muted-foreground">
                Take a quick test about your knowledge from your content
              </div>
            </div>

            <CancelAndRestartQuiz restartQuizHandler={restartQuizHandler} />
          </div>

          {selectedArticleQuizzes.length > 0 && (
            <div className="text-base leading-6 font-medium text-muted-foreground">
              Timer: {timeSpentOnQuiz}
            </div>
          )}

          <div className="w-full bg-background rounded-lg p-7 border border-border">
            {loading && (
              <div className="h-fit flex justify-center">
                <LuLoaderCircle size={24} className="animate-spin" />
              </div>
            )}

            <MainQuiz
              selectedArticleQuizzes={selectedArticleQuizzes}
              step={step}
              quizStepScoreHandler={quizStepScoreHandler}
            />
          </div>
        </div>
      ) : selectedArticleQuizzes.length === 5 ? (
        <QuizCompletedComp
          articleId={articleId}
          selectedArticleQuizzes={selectedArticleQuizzes}
          quizResult={quizResult}
          restartQuizHandler={restartQuizHandler}
          setLoading={setLoading}
          loading={loading}
          sec={sec}
          timeSpentOnQuiz={timeSpentOnQuiz}
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default QuizPage;
