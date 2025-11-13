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
  const ID = searchParams.get("search");

  // =================== Backend data татах ===================
  const GetHistory = async (ID: string | null) => {
    if (!ID) return;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${baseUrl}/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ID }),
        cache: "no-store",
      });
      const responseData = await response.json();
      setResult(responseData);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    GetHistory(ID);
  }, [ID]);

  // =================== Timer ===================
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // =================== Quiz хариулт ===================
  const HandleOnAnswer = (optionIndex: number) => {
    if (!result) return;
    const current = result.data.Quiz[step];
    const correctIndex = parseInt(current.answer);
    const isCorrect = optionIndex === correctIndex;
    const selected = current.options[optionIndex];
    const correct = current.options[correctIndex];

    if (isCorrect) setCorrectAnswers((prev) => prev + 1);

    const updatedAnswers = [
      ...userAnswers,
      { question: current.question, selected, correct, isCorrect },
    ];
    setUserAnswers(updatedAnswers);

    const next = step + 1;
    if (next >= result.data.Quiz.length) {
      setPage("last");
      setTimerRunning(false); // timer зогсоох

      // Backend руу хадгалах
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      fetch(`${baseUrl}/api/save-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID,
          userAnswers: updatedAnswers,
          correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
          timeSpent: seconds,
        }),
      }).catch(console.error);
    } else setStep(next);
  };

  if (!result)
    return (
      <div className="text-center ml-50 mt-50 text-gray-500">Loading...</div>
    );

  // ======================== Render ========================
  return (
    <div className="mt-50 ml-50 flex justify-center  ">
      <div className="w-[600px] border-2 bg-white rounded-xl p-6 ">
        {/* ======================== PAGE 1 ======================== */}
        {page === "page" && (
          <>
            <HomePage
              setSeconds={setSeconds}
              setPage={setPage}
              setStep={setStep}
              setCorrectAnswers={setCorrectAnswers}
              setUserAnswers={setUserAnswers}
              result={result}
              setTimerRunning={setTimerRunning}
            ></HomePage>
          </>
        )}

        {/* ======================== PAGE 2 ======================== */}
        {page === "test" && (
          <>
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
            ></TestPage>
          </>
        )}

        {/* ======================== PAGE 3 ======================== */}
        {page === "last" && (
          <>
            <LastPage
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
            ></LastPage>
          </>
        )}
      </div>
    </div>
  );
}
