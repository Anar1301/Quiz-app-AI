"use client";
import React, { useState } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { IoCloseOutline } from "react-icons/io5";

export const CancelAndRestartQuiz = ({
  restartQuizHandler,
}: {
  restartQuizHandler: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const cancelAndRestartQuiz = () => {
    restartQuizHandler();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant={"outline"}
          className="h-10 has-[>svg]:px-4 cursor-pointer"
        >
          <IoCloseOutline size={16} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[450px] border-0 rounded-xl gap-6">
        <AlertDialogHeader className="gap-1.5">
          <AlertDialogTitle className="text-2xl leading-8 text-foreground">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-5 text-[#B91C1C]">
            If you press Cancel, this quiz will restart from the beginning.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-11">
          <Button
            onClick={() => setOpen(false)}
            className="w-[calc(50%-22px)] h-10 cursor-pointer"
          >
            Go back
          </Button>
          <Button
            onClick={cancelAndRestartQuiz}
            variant={"outline"}
            className="w-[calc(50%-22px)] h-10 cursor-pointer"
          >
            Cancel quiz
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
