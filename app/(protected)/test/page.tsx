"use client";

import { Button } from "@/components/ui/button";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuBookOpen } from "react-icons/lu";
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
} from "@/components/ui/alert-dialog";
import Link from "next/link";

type HistoryDataType = {
  data: ObjHistoryDatatype[];
};

type ObjHistoryDatatype = {
  question: string;
  answer: string;
  options: string[];
  title: string;
  summary: string;
  content: string;
};

type UserAnswer = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};

export default function SearchBar() {
  const [result, setResult] = useState<HistoryDataType | null>(null);
  const [page, setPage] = useState<"page" | "test" | "last">("page");
  const [step, setStep] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const searchParams = useSearchParams();
  const ID = searchParams.get("search");
  const router = useRouter();

  const GetHistory = async (ID: string | null) => {
    if (!ID) return;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID }),
      cache: "no-store",
    });

    const responseData = await response.json();
    console.log(responseData, "hha");
    setResult(responseData);
  };

  useEffect(() => {
    GetHistory(ID);
  }, [ID]);

  const HandleOnAnswer = (optionIndex: number) => {
    if (!result) return;
    const current = result.data[step];
    const correctIndex = parseInt(current.answer);
    const isCorrect = optionIndex === correctIndex;
    const selected = current.options[optionIndex];
    const correct = current.options[correctIndex];

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        selected,
        correct,
        isCorrect,
      },
    ]);

    const next = step + 1;
    if (next >= result.data.length) {
      setPage("last");
    } else {
      setStep(next);
    }
  };

  return (
    <div className="mt-50">
      {page === "page" && result && (
        <div>
          <Link href="/">
            <div className="w-12 h-10 border-2 flex items-center justify-center ml-34 mb-5 ">
              <MdOutlineKeyboardArrowLeft />
            </div>
          </Link>

          <div className="w-[628px] h-fit ml-34 border-2 bg-white">
            <div className="mx-7 mb-7">
              <div className="flex gap-2 mt-5">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">
                  Article Quiz Generator
                </div>
              </div>

              <div className="mt-5 text-[#71717A] flex gap-2 items-center">
                <LuBookOpen /> Summarized content
              </div>
              <div className="text-[24px] font-bold">
                {result.data[0].title}
              </div>
              <div>{result.data[0].summary}</div>

              <div className="mt-5 text-[#71717A] flex gap-2">
                <img src="/Shape.svg" />
                Article Content
              </div>
              <div className="h-[60px] flex flex-wrap w-[572px] text-ellipsis">
                <div className="truncate">{result.data[0].content}</div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="ml-115 mt-3 bg-white text-black">
                      See more
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-[24px] font-bold">
                        {result.data[0].title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">{result.data[0].content}</div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex justify-start">
                <Button
                  className="mt-5"
                  onClick={() => {
                    setPage("test");
                    setStep(0);
                    setCorrectAnswers(0);
                    setUserAnswers([]);
                  }}
                >
                  Take quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "test" && result && (
        <div className="w-[680px] h-fit ml-64">
          <div className="mx-7">
            <div className="flex justify-between w-[680px]">
              <div className="flex gap-2">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">Quick test</div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-white text-black border-2">X</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[450px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[32px]">
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[#B91C1C] text-[18  px]">
                      If you press 'Cancel', this quiz will restart from the
                      beginning.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <div className="w-[450px] flex gap-11 mt-6">
                      <AlertDialogCancel className="bg-black text-white w-[180px]">
                        Go back
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-white text-black border-2 w-[180px]"
                        onClick={() => {
                          setPage("page");
                          setStep(0);
                          setCorrectAnswers(0);
                          setUserAnswers([]);
                        }}
                      >
                        Cancel quiz
                      </AlertDialogAction>
                    </div>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="mt-2 text-[#71717A]">
              Take a quick test about your knowledge from your content
            </div>

            <div className="mt-6 border-2 bg-white rounded-md w-fit">
              <div className="mx-7">
                <div className="flex justify-between">
                  <div className="mt-7 text-[28px] font-semibold w-[500px]">
                    {result.data[step].question}
                  </div>
                  <div className="text-[28px] mt-7">
                    {step + 1}
                    <span className="text-[#737373] text-[20px]">
                      / {result.data.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap w-fit gap-4 h-fit mt-10 mb-10">
                  {result.data[step].options.map((opt, idx) => (
                    <Button
                      key={idx}
                      onClick={() => HandleOnAnswer(idx)}
                      className="w-fit bg-white text-black border-2 h-10 hover:text-white"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "last" && result && (
        <div className="w-[600px] h-fit ml-64">
          <div className="mx-7">
            <div className="flex justify-between w-[600px]">
              <div className="flex gap-2">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">Quiz completed</div>
              </div>
              <Button
                className="bg-white text-black border-2"
                onClick={() => {
                  setPage("page");
                  setStep(0);
                  setCorrectAnswers(0);
                  setUserAnswers([]);
                }}
              >
                X
              </Button>
            </div>

            <div className="mt-2 text-[#71717A]">Here’s your score</div>
            <div className="mt-6 border-2 bg-white rounded-md w-[600px] p-6">
              <div className="font-bold text-[32px]">
                Your score: {correctAnswers}
                <span className="text-[#71717A] text-[20px]">
                  / {result.data.length}
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
                <Button onClick={() => router.push(`/`)} className="w-44 h-10">
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
