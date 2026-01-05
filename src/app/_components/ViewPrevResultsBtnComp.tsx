"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Separator,
} from "@/components/ui";
import { LuCircleCheck } from "react-icons/lu";
import { IoCloseCircleOutline } from "react-icons/io5";
import { QuizAllAttemptsType } from "@/lib/types";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { TotalScoreComp } from "@/app/_components";

export const ViewPrevResultsBtnComp = ({
  articleId,
}: {
  articleId: string;
}) => {
  const [quizAllAttempts, setQuizAllAttempts] = useState<QuizAllAttemptsType[]>(
    []
  );
  const { user } = useUser();

  const getQuizResults = async () => {
    const response = await fetch(
      `/api/article/${articleId}/quizzes/attempt-scores`
    );

    if (!response.ok) {
      toast("Failed to get quiz results");
    }

    const { attempts } = await response.json();

    if (attempts) {
      setQuizAllAttempts(attempts);
    }
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          onClick={getQuizResults}
          size={"lg"}
          variant={"outline"}
          className="w-fit cursor-pointer"
        >
          View previous results
        </Button>
      </DrawerTrigger>

      <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-80">
        <DrawerHeader className="p-5">
          <DrawerTitle>User: {user?.firstName}</DrawerTitle>
          <DrawerDescription>
            Previous attempts: {quizAllAttempts.length}
          </DrawerDescription>
        </DrawerHeader>

        <Tabs defaultValue="account" className="w-full px-5">
          {quizAllAttempts &&
            quizAllAttempts.map((attempt, i) => (
              <div key={attempt.id}>
                <TabsList>
                  <TabsTrigger value={`attempt${i}`}>
                    Attempt {i + 1}:
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value={`attempt${i}`}
                  className="flex flex-col gap-2 mt-1"
                >
                  <div className="flex justify-between">
                    <TotalScoreComp attemptScores={attempt.scores} />
                    <div className="text-sm leading-5 font-medium">
                      Time spent: {attempt.timespent}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {attempt.scores.map((el, i) => (
                      <div
                        key={el.correctanswer}
                        className="flex gap-1 text-xs leading-4 font-medium"
                      >
                        <div>
                          {el.useranswer !== el.correctanswer ? (
                            <IoCloseCircleOutline
                              size={24}
                              className="text-red-700"
                            />
                          ) : (
                            <LuCircleCheck
                              size={24}
                              className="text-green-500"
                            />
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="text-muted-foreground">
                            {i + 1}. {el.quizzes.question}
                          </div>
                          <div className="text-foreground">
                            Your answer: {el.useranswer}
                          </div>
                          <div className="text-green-500">
                            {el.correctanswer !== el.useranswer &&
                              `Correct: ${el.correctanswer}`}
                          </div>
                          <Separator className="w-full border-t border-dashed" />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            ))}
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};
