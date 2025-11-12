"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import Link from "next/link";

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

export default function Home() {
  const [page, setPage] = useState<"page" | "summary" | "test" | "last">(
    "page"
  );
  const [content, setContent] = useState("");
  const [Title, setTitle] = useState("");
  const [Summary, setSummary] = useState("");
  const [takeID, setTakeID] = useState("");
  const [generatedtext, setGeneratedtext] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const HandleOnContent = async () => {
    const response = await fetch("/api/generate/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, Title }),
    });

    const rawData = await response.json();
    const cleanedText = extractJsonArray(rawData.data || rawData);
    setSummary(cleanedText);

    try {
      // const parsedArray = JSON.parse(cleanedText);
      // console.log({ parsedArray });

      if (cleanedText.length > 0) {
        setPage("test");
      }
    } catch (e) {
      console.error("JSON parse error:", e);
    }
    if (rawData.data) {
      setTakeID(rawData.id.rows[0].id);
      setPage("summary");
    }
  };

  const HandleOnPost = async () => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Summary, takeID }),
    });

    const rawData = await response.json();
    const cleanedText = extractJsonArray(rawData.data || rawData);
    console.log("2", cleanedText);

    try {
      const parsedArray = JSON.parse(cleanedText);
      setGeneratedtext(parsedArray);
      if (parsedArray.length > 0) setPage("test");
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  };

  const extractJsonArray = (text: unknown): string => {
    const safeText = typeof text === "string" ? text : JSON.stringify(text);

    const match = safeText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    return match ? match[1].trim() : safeText.trim();
  };

  const HandleOnAnswer = (selectedIndex: number) => {
    const current = generatedtext[step];
    const correctIndex = parseInt(current.answer);
    const isCorrect = selectedIndex === correctIndex;
    const selected = current.options[selectedIndex];
    const correct = current.options[correctIndex];

    if (isCorrect) setCorrectAnswers((prev) => prev + 1);
    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        selected,
        correct,
        isCorrect,
      },
    ]);

    if (step + 1 >= generatedtext.length) {
      setPage("last");
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-accent w-screen h-screen p-10 ">
      {page === "page" && (
        <div className="w-[856px] ml-50 bg-white border-2 rounded-md p-6 mt-50">
          <div className="flex gap-2 mb-2">
            <img src="/Vector.svg" />
            <Link href="/turshih?search=my-project">
              <h1 className="font-bold text-3xl">Article Quiz Generator</h1>
            </Link>
          </div>
          <p className="text-gray-600 mb-4">
            Paste your article below to generate a summary and quiz questions.
          </p>

          <label className="text-gray-700 flex gap-2 mb-2">
            <img src="/Shape.svg" />
            Article title
          </label>
          <Input
            placeholder="Enter a title..."
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="text-gray-700 flex gap-2 mt-5 mb-2">
            <img src="/Shape.svg" />
            Article content
          </label>
          <Textarea
            placeholder="Paste your article content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-end">
            <Button
              onClick={HandleOnContent}
              className="mt-5"
              disabled={!content}
            >
              Generate summary
            </Button>
          </div>
        </div>
      )}

      {page === "summary" && (
        <div>
          <div
            className="w-12 h-10 border-2 flex items-center justify-center ml-34 mb-5 "
            onClick={() => setPage("page")}
          >
            <MdOutlineKeyboardArrowLeft />
          </div>

          <div className="w-[856px] mt-50 mx-auto bg-white border-2 rounded-md p-6">
            <div className="flex gap-2 mb-2">
              <img src="/Vector.svg" />
              <h1 className="font-bold text-3xl">Article Quiz Generator</h1>
            </div>

            <p className="text-gray-700 flex gap-2 mb-2 mt-5">
              <img src="/Shape.svg" />
              Summarized Content
            </p>
            <h2 className="font-bold mt-4">{Title}</h2>
            <p className="mt-4">{Summary}</p>

            <div className="flex justify-between mt-5">
              <Button variant="outline" onClick={() => setPage("page")}>
                Back
              </Button>
              <Button onClick={HandleOnPost}>Take a quiz</Button>
            </div>
          </div>
        </div>
      )}

      {page === "test" && generatedtext[step] && (
        <div className="w-[700px] mt-50 mx-auto bg-white border-2 rounded-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Quick Test</h1>
            <Button variant="outline" onClick={() => setPage("page")}>
              X
            </Button>
          </div>

          <p className="text-gray-600 mt-2">
            Question {step + 1} / {generatedtext.length}
          </p>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-6">
              {generatedtext[step].question}
            </h2>

            <div className="flex flex-col gap-3 ">
              {generatedtext[step].options.map((opt, idx) => (
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
        </div>
      )}

      {page === "last" && generatedtext && (
        <div className="w-[600px] h-fit ml-64 mt-50">
          <div className="mx-7">
            <div className="flex justify-between w-[600px]">
              <div className="flex gap-2">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">Quiz completed</div>
              </div>
            </div>

            <div className="mt-2 text-[#71717A]">Let's see what you did</div>
            <div className="mt-6 border-2 bg-white rounded-md w-[600px] p-6">
              <div className="font-bold text-[32px]">
                Your score: {correctAnswers}
                <span className="text-[#71717A] text-[20px]">
                  / {generatedtext.length}
                </span>
              </div>

              <div className="mt-5">
                {userAnswers.map((ans, index) => (
                  <div key={index} className="flex gap-3 mb-4">
                    <img
                      src={ans.isCorrect ? "/rigth.svg" : "/wrong.svg"}
                      className="w-6 h-6 mt-1"
                    />
                    <div>
                      <div className="text-[#737373] font-medium">
                        {index + 1}. {ans.question}
                      </div>
                      <div className="text-[#171717]">
                        Your answer: {ans.selected}
                      </div>
                      <div
                        className={
                          ans.isCorrect ? "text-[#22C55E]" : "text-[#EF4444]"
                        }
                      >
                        Correct: {ans.correct}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between my-7">
                <Button
                  className="w-44 h-10 bg-white text-black border-2 text-[20px]"
                  onClick={() => {
                    setStep(0);
                    setCorrectAnswers(0);
                    setUserAnswers([]);
                    setPage("test");
                  }}
                >
                  <img src="/reload.svg" /> Restart quiz
                </Button>
                <Button
                  className="w-44 h-10"
                  onClick={() => {
                    setPage("page");
                    setStep(0);
                    setCorrectAnswers(0);
                    setUserAnswers([]);
                    setTitle("");
                    setContent("");
                    setSummary("");
                  }}
                >
                  <img src="/favorite.svg" />
                  Save and leave
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
