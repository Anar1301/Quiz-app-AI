"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const Home = () => {
  type Quistions = {
    question: string;
    options: string[];
    answer: string;
    ID: string[];
  };
  const [page, setPage] = useState<string>("page");
  const [content, setcontent] = useState<string>("");
  const [Title, setTitle] = useState<string>("");
  const [Summary, setSummary] = useState<string>("");
  const [takeID, setTakeID] = useState<string>("");
  const [step, setStep] = useState(0);
  const [generatedtext, setGeneratedtext] = useState<Quistions[]>([]);
  const HandleOnContent = async () => {
    const response = await fetch("/api/generate/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, Title }),
    });
    const rawData = await response.json();
    console.log({ rawData });
    if (rawData.data.length > 1) {
      setPage("summary");
    }
    setSummary(rawData.data);
    setTakeID(rawData.id.rows[0].id);
  };
  const HandleOnPost = async () => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Summary, takeID }),
    });

    const rawData = await response.json();
    console.log({ rawData });

    const cleanedText = extractJsonArray(rawData.data || rawData);
    try {
      const parsedArray = JSON.parse(cleanedText);

      setGeneratedtext(parsedArray);
      if (parsedArray.length > 0) {
        setPage("test");
      }
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  };
  // Regex функц нь гаднаас тусдаа байрлаж болно
  const extractJsonArray = (text: string) => {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      return match[1].trim();
    }
    return text.trim();
  };

  return (
    <div className="bg-accent w-screen h-screen ">
      {page === "page" && (
        <div className="mt-10">
          <div className="h-72"></div>
          <div className="w-[856px] h-fit ml-54  border-2 bg-white">
            <div className="mx-7 mb-7">
              <div className="flex gap-2">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">
                  Article Quiz Generator
                </div>
              </div>
              <div className="mt-2 text-[#71717A]">
                Paste your article below to generate a summarize and quiz
                question. Your articles will saved in the sidebar for future
                reference.
              </div>
              <div className="mt-5 text-[#71717A] flex gap-2">
                <img src="/Shape.svg" />
                Article title
              </div>
              <Input
                placeholder="Enter a title for your article.."
                type="text"
                value={Title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mt-5 text-[#71717A] flex gap-2">
                <img src="/Shape.svg" />
                Article Content
              </div>
              <Textarea
                placeholder="Paste your article content here..."
                value={content}
                onChange={(e) => setcontent(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={() => HandleOnContent()} className="mt-5 ">
                  Generate summary
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {page === "summary" && (
        <div className="mt-10">
          <div className="h-72"></div>
          <div className="w-[856px] h-fit ml-114  border-2 bg-white">
            <div className="mx-7 mb-7">
              <div className="flex gap-2">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">
                  Article Quiz Generator
                </div>
              </div>

              <div className="mt-5 text-[#71717A] flex gap-2">
                <img src="/Shape.svg" />
                Summarized Content
              </div>
              <div className="font-bold mt-4">{Title}</div>
              <div className="mt-4">{Summary}</div>
              <div className="flex justify-between mt-5">
                <Button className="bg-white text-black border-2">
                  See content
                </Button>
                <Button onClick={() => HandleOnPost()} className=" ">
                  Take a quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {page === "test" && (
        <div className="w-[680px] h-fit ml-64">
          <div className="h-30"></div>
          <div className="mx-7 ">
            <div className="flex justify-between w-[680px]">
              <div className="flex gap-2">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">Quick test</div>
              </div>

              <div>
                <Button
                  className="bg-white text-black border-2"
                  onClick={() => setPage("page")}
                >
                  X
                </Button>
              </div>
            </div>
            <div className="mt-2 text-[#71717A]">
              Take a quick test about your knowledge from your content
            </div>
            {step === 0 && (
              <div>
                {generatedtext.slice(0, 1).map((data, index) => (
                  <div
                    key={index}
                    className="mt-6 border-2 bg-white rounded-md w-fit"
                  >
                    <div className="mx-7">
                      <div className="flex justify-between  ">
                        <div className="mt-7 text-[28px] font-semibold  w-[500px]">
                          {data.question}
                        </div>
                        <div className="text-[28px] mt-7">
                          {step + 1}
                          <span className="text-[#737373] text-[20px]">
                            / {generatedtext.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap w-fit gap-4 h-fit mt-10 mb-10">
                        {data.options.map((dat, index2) => (
                          <Button
                            key={index2}
                            onClick={() => setStep(1)}
                            className="w-fit bg-white text-black border-2 h-10 hover:text-white"
                          >
                            {dat}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {data.answer}
                  </div>
                ))}
              </div>
            )}
            {step === 1 && (
              <div>
                {generatedtext.slice(1, 2).map((data, index) => (
                  <div
                    key={index}
                    className="mt-6 border-2 bg-white rounded-md w-fit"
                  >
                    <div className="mx-7">
                      <div className="flex justify-between  ">
                        <div className="mt-7 text-[28px] font-semibold  w-[500px]">
                          {data.question}
                        </div>
                        <div className="text-[28px] mt-7">
                          {step + 1}
                          <span className="text-[#737373] text-[20px]">
                            / {generatedtext.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap w-fit gap-4 h-fit mt-10 mb-10">
                        {data.options.map((dat) => (
                          <Button
                            onClick={() => setStep(2)}
                            className="w-fit bg-white text-black border-2 h-10 hover:text-white"
                          >
                            {dat}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {data.answer}
                  </div>
                ))}
              </div>
            )}
            {step === 2 && (
              <div>
                {generatedtext.slice(2, 3).map((data, index) => (
                  <div
                    key={index}
                    className="mt-6 border-2 bg-white rounded-md w-fit"
                  >
                    <div className="mx-7">
                      <div className="flex justify-between  ">
                        <div className="mt-7 text-[28px] font-semibold  w-[500px]">
                          {data.question}
                        </div>
                        <div className="text-[28px] mt-7">
                          {step + 1}
                          <span className="text-[#737373] text-[20px]">
                            / {generatedtext.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap w-fit gap-4 h-fit mt-10 mb-10">
                        {data.options.map((dat) => (
                          <Button
                            onClick={() => setStep(3)}
                            className="w-fit bg-white text-black border-2 h-10 hover:text-white"
                          >
                            {dat}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {data.answer}
                  </div>
                ))}
              </div>
            )}
            {step === 3 && (
              <div>
                {generatedtext.slice(3, 4).map((data, index) => (
                  <div
                    key={index}
                    className="mt-6 border-2 bg-white rounded-md w-fit"
                  >
                    <div className="mx-7">
                      <div className="flex justify-between  ">
                        <div className="mt-7 text-[28px] font-semibold  w-[500px]">
                          {data.question}
                        </div>
                        <div className="text-[28px] mt-7">
                          {step + 1}
                          <span className="text-[#737373] text-[20px]">
                            / {generatedtext.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap w-fit gap-4 h-fit mt-10 mb-10">
                        {data.options.map((dat) => (
                          <Button
                            onClick={() => setStep(4)}
                            className="w-fit bg-white text-black border-2 h-10 hover:text-white"
                          >
                            {dat}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {data.answer}
                  </div>
                ))}
              </div>
            )}
            {step === 4 && (
              <div>
                {generatedtext.slice(4, 5).map((data, index) => (
                  <div
                    key={index}
                    className="mt-6 border-2 bg-white rounded-md w-fit"
                  >
                    <div className="mx-7">
                      <div className="flex justify-between  ">
                        <div className="mt-7 text-[28px] font-semibold  w-[500px]">
                          {data.question}
                        </div>
                        <div className="text-[28px] mt-7">
                          {step + 1}
                          <span className="text-[#737373] text-[20px]">
                            / {generatedtext.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap w-fit gap-4 h-fit mt-10 mb-10">
                        {data.options.map((dat) => (
                          <Button
                            onClick={() => setPage("last")}
                            className="w-fit bg-white text-black border-2 h-10 hover:text-white"
                          >
                            {dat}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {data.answer}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {page === "last" && (
        <div className="w-[680px] h-fit ml-64">
          <div className="h-30"></div>
          <div className="mx-7 ">
            <div className="flex justify-between w-[680px]">
              <div className="flex gap-2">
                <img src="/Vector.svg" />
                <div className="font-bold text-[32px]">Quick completed</div>
              </div>

              <div>
                <Button
                  className="bg-white text-black border-2"
                  onClick={() => (setPage("page"), setStep(0))}
                >
                  X
                </Button>
              </div>
            </div>
            <div className="mt-2 text-[#71717A]">Lets see what you did</div>
            <div>
              <div className="font-semibold">
                Your score:2 <span>/5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
