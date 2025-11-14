"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HistoryDataType, UserAnswer } from "@/lib/types";
import LastPage from "@/components/Home/Lastpage";
import TestPage from "@/components/Home/Testpage";
import HomePage from "@/components/Home/Homepage";

export default function SearchBar() {
  const [result, setResult] = useState<HistoryDataType | null>(null);
  const [page, setPage] = useState<"page" | "test" | "last">("page");
  const [step, setStep] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const articleID = searchParams.get("search");

  // Жишээ user объект

  // =================== Backend data татах ===================
  const GetHistory = async (articleID: string | null) => {
    if (!articleID) return;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${baseUrl}/api/history/article`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleID }),
        cache: "no-store",
      });

      const { data } = await response.json();

      if (!data) {
        console.warn("No history data found for this article");
        setResult(null);
        return;
      }

      setResult(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    GetHistory(articleID);
  }, [articleID]);

  // =================== Timer ===================
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // =================== quiz хариулт ===================
  const HandleOnAnswer = (optionIndex: number) => {
    if (!result || articleID === null) return;

    const current = result.quiz[step];
    const correctIndex = parseInt(current.answer);
    const isCorrect = optionIndex === correctIndex;
    const selected = current.options[optionIndex];
    const correct = current.options[correctIndex];

    if (isCorrect) setCorrectAnswers((prev) => prev + 1);

    const updatedAnswers = [
      ...userAnswers,
      {
        quizID: current.id, // quiz id-г шууд дамжуулна
        question: current.question,
        selected,
        correct,
        isCorrect,
      },
    ];
    setUserAnswers(updatedAnswers);

    const next = step + 1;
    if (next >= result.quiz.length) {
      setPage("last");
      setTimerRunning(false);
    } else {
      setStep(next);
    }
  };

  // =================== Quiz хадгалах ===================
  const SaveAndLeave = async () => {
    if (!articleID) return;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    try {
      const res = await fetch(`${baseUrl}/api/history/save-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID: articleID,
          user: result?.user.id,
          userAnswers,
          correctAnswers,
          timeSpent: seconds,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
      }
    } catch (err) {
      console.error("Failed to save quiz:", err);
    }
  };

  if (!result)
    return (
      <div className="text-center ml-50 mt-50 text-gray-500">Loading...</div>
    );

  // ======================== Render ========================
  return (
    <div className="mt-50 ml-50 flex justify-center">
      <div className="w-[600px] border-2 bg-white rounded-xl p-6">
        {page === "page" && (
          <HomePage
            userid={result.user.id}
            setSeconds={setSeconds}
            setPage={setPage}
            setStep={setStep}
            setCorrectAnswers={setCorrectAnswers}
            setUserAnswers={setUserAnswers}
            result={result}
            setTimerRunning={setTimerRunning}
          />
        )}

        {page === "test" && (
          <TestPage
            step={step}
            HandleOnAnswer={HandleOnAnswer}
            setPage={setPage}
            setStep={setStep}
            setCorrectAnswers={setCorrectAnswers}
            setUserAnswers={setUserAnswers}
            result={result}
            setTimerRunning={setTimerRunning}
            seconds={seconds}
          />
        )}

        {page === "last" && (
          <LastPage
            SaveAndLeave={SaveAndLeave}
            setPage={setPage}
            setStep={setStep}
            setCorrectAnswers={setCorrectAnswers}
            setSeconds={setSeconds}
            setUserAnswers={setUserAnswers}
            result={result}
            correctAnswers={correctAnswers}
            router={router}
            userAnswers={userAnswers}
            setTimerRunning={setTimerRunning}
            seconds={seconds}
          />
        )}
      </div>
    </div>
  );
}
