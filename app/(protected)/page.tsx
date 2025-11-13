"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type UserAnswer = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};

export default function ArticleQuiz() {
  const [page, setPage] = useState<"start" | "summary" | "quiz" | "result">(
    "start"
  );
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleSummary, setArticleSummary] = useState("");
  const [takeID, setTakeID] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🧠 Summary үүсгэх
  const handleGenerateSummary = async () => {
    if (!articleContent || !articleTitle) return;
    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articlecontent: articleContent, articleTitle }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setArticleSummary(data.data.summary);
      setTakeID(data.data.id);
      setPage("summary");
    } catch (err: any) {
      alert("Summary үүсгэхэд алдаа гарлаа: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🤖 Quiz үүсгэх
  const handleGenerateQuiz = async () => {
    if (!articleSummary || !takeID) {
      alert("Summary болон ID дутуу байна!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/generate/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleSummary, takeID }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.data);
      setStep(0);
      setUserAnswers([]);
      setCorrectAnswers(0);
      setPage("quiz");
    } catch (err: any) {
      alert("Quiz үүсгэхэд алдаа гарлаа: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Хариулт шалгах
  const handleAnswer = (idx: number) => {
    const current = questions[step];
    const correctIndex = parseInt(current.answer);
    const isCorrect = idx === correctIndex;

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        selected: current.options[idx],
        correct: current.options[correctIndex],
        isCorrect,
      },
    ]);

    if (isCorrect) setCorrectAnswers((prev) => prev + 1);

    if (step + 1 >= questions.length) setPage("result");
    else setStep(step + 1);
  };

  // 🚀 Reset function
  const resetAll = () => {
    setArticleContent("");
    setArticleTitle("");
    setArticleSummary("");
    setTakeID(null);
    setQuestions([]);
    setStep(0);
    setUserAnswers([]);
    setCorrectAnswers(0);
    setPage("start");
  };

  return (
    <div className="bg-gray-100 w-screen min-h-screen p-10 flex justify-center">
      <div className="w-full max-w-[700px] mt-50 ml-50">
        {/* ================= START PAGE ================= */}
        {page === "start" && (
          <div className="bg-white border rounded-md p-6">
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-4">
              <img src="/Vector.svg" /> Article Quiz Generator
            </h1>
            <p className="text-gray-600 mb-4">
              Paste your article below to generate a summary and quiz questions.
            </p>
            <label className="text-gray-700 mb-2 flex gap-2">
              Article Title
            </label>
            <Input
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
            />
            <label className="text-gray-700 mt-4 mb-2 flex gap-2">
              Article Content
            </label>
            <Textarea
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleGenerateSummary} disabled={loading}>
                {loading ? "Generating..." : "Generate Summary"}
              </Button>
            </div>
          </div>
        )}

        {/* ================= SUMMARY PAGE ================= */}
        {page === "summary" && (
          <div className="bg-white border rounded-md p-6">
            <div
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={() => setPage("start")}
            >
              <MdOutlineKeyboardArrowLeft /> Back
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-4">
              <img src="/Vector.svg" /> Article Summary
            </h1>
            <h2 className="font-bold text-lg">{articleTitle}</h2>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">
              {articleSummary}
            </p>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setPage("start")}>
                Back
              </Button>
              <Button onClick={handleGenerateQuiz} disabled={loading}>
                {loading ? "Generating Quiz..." : "Take a Quiz"}
              </Button>
            </div>
          </div>
        )}

        {/* ================= QUIZ PAGE ================= */}
        {page === "quiz" && questions[step] && (
          <div className="bg-white border rounded-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <img src="/Vector.svg" /> Quick Test
              </h1>
              <Button variant="outline" onClick={resetAll}>
                X
              </Button>
            </div>
            <p className="text-gray-600 mb-4">
              Question {step + 1} / {questions.length}
            </p>
            <h2 className="text-2xl font-semibold mb-4">
              {questions[step].question}
            </h2>
            <div className="flex flex-col gap-3">
              {questions[step].options.map((opt, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => handleAnswer(idx)}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* ================= RESULT PAGE ================= */}
        {page === "result" && (
          <div className="bg-white border rounded-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <img src="/Vector.svg" /> Quiz Completed
              </h1>
              <Button variant="outline" onClick={resetAll}>
                X
              </Button>
            </div>
            <p className="text-gray-600 mb-4">Here’s your score</p>
            <div className="border-2 rounded-md p-6 mb-4">
              <div className="text-3xl font-bold mb-4">
                Your score: {correctAnswers} / {questions.length}
              </div>
              <div className="space-y-4 mb-4">
                {userAnswers.map((ans, i) => (
                  <div key={i} className="flex gap-3 items-start border-b pb-3">
                    <img
                      src={ans.isCorrect ? "/rigth.svg" : "/wrong.svg"}
                      className="w-6 h-6 mt-1"
                    />
                    <div>
                      <div className="text-gray-700 font-medium">
                        {i + 1}. {ans.question}
                      </div>
                      <div className="text-gray-800">
                        Your answer: {ans.selected}
                      </div>
                      <div
                        className={
                          ans.isCorrect ? "text-green-600" : "text-red-600"
                        }
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
                    setCorrectAnswers(0);
                    setUserAnswers([]);
                    setPage("quiz");
                  }}
                >
                  Restart Quiz
                </Button>
                <Button onClick={resetAll}>Save and Leave</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
