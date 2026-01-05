"use client";
import React from "react";
import { RxReload } from "react-icons/rx";
import { Button } from "@/components/ui";
import { LuBookmark } from "react-icons/lu";
import { QuizResultType, QuizType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import {
  QuizCompletedCompResult,
  QuizCompletedCompScoreAndTime,
  QuizCompletedHeading,
} from "@/app/_components";

export const QuizCompletedComp = ({
  articleId,
  selectedArticleQuizzes,
  quizResult,
  restartQuizHandler,
  setLoading,
  loading,
  sec,
  timeSpentOnQuiz,
}: {
  articleId: string;
  selectedArticleQuizzes: QuizType[];
  quizResult: QuizResultType[];
  restartQuizHandler: () => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  sec: number;
  timeSpentOnQuiz: string;
}) => {
  const router = useRouter();
  const { user } = useUser();
  const clerkId = user?.id;

  const saveQuizAttemptScores = async (quizResult: QuizResultType[]) => {
    if (!clerkId || !quizResult || !sec || !articleId) {
      toast.warning("Missing required fields!");
    }

    setLoading(true);

    const res = await fetch(
      `/api/article/${articleId}/quizzes/attempt-scores`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userClerkId: clerkId,
          quizResult,
          sec,
          articleId,
        }),
      }
    );

    if (!res.ok) {
      toast.error("Failed to save result to DB!");
    }

    toast.success("Result added to DB successfully");
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="flex flex-col mt-44 mx-50 gap-6 text-foreground">
      <QuizCompletedHeading />

      <div className="w-full bg-background rounded-lg p-7 border border-border flex flex-col gap-7">
        <QuizCompletedCompScoreAndTime
          selectedArticleQuizzes={selectedArticleQuizzes}
          quizResult={quizResult}
          timeSpentOnQuiz={timeSpentOnQuiz}
        />

        <div className="flex flex-col gap-5">
          {quizResult.map((res, i) => (
            <QuizCompletedCompResult key={res.quizQuestionId} res={res} i={i} />
          ))}
        </div>

        <div className="flex justify-between">
          <Button
            onClick={restartQuizHandler}
            variant={"outline"}
            size={"lg"}
            className="cursor-pointer"
          >
            <RxReload size={16} />
            Restart quiz
          </Button>
          <Button
            onClick={() => saveQuizAttemptScores(quizResult)}
            disabled={loading}
            size={"lg"}
            className="cursor-pointer"
          >
            <LuBookmark size={16} />
            Save and leave
          </Button>
        </div>
      </div>
    </div>
  );
};
