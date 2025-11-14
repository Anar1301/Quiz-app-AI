import { Button } from "../ui/button";
import { HistoryDataType } from "@/lib/types";

import { LuBookOpen } from "react-icons/lu";
import Link from "next/link";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import HistoryDrawer from "./HistoryDrawer";

const HomePage = ({
  setPage,
  setStep,
  setUserAnswers,
  setCorrectAnswers,
  result,
  setSeconds,
  setTimerRunning,
  userid,
}: {
  userid: string | number;
  setSeconds: Function;
  setPage: Function;
  setStep: Function;
  setUserAnswers: Function;
  setCorrectAnswers: Function;
  result: HistoryDataType;

  setTimerRunning: Function;
}) => {
  const GoToTest = () => {
    if (result.quiz.length === 0) {
      alert("Sorry this article has a no questions");
      return;
    }
    setPage("test");
    setStep(0);
    setUserAnswers([]);
    setCorrectAnswers(0);
    setSeconds(0);
    setTimerRunning(true);
  };
  return (
    <div>
      <Link href="/">
        <div className="w-12 h-10 border-2 flex items-center justify-center mb-5 cursor-pointer">
          <MdOutlineKeyboardArrowLeft />
        </div>
      </Link>

      <h1 className="font-bold text-3xl flex items-center gap-2 mb-4">
        Article Quiz Generator
      </h1>

      <div className="text-gray-500 mb-2 flex items-center gap-2">
        <LuBookOpen /> Summary
      </div>
      <div className="text-lg font-semibold mb-2">{result.title}</div>
      <div className="mb-4">{result.summary}</div>

      <div className="text-gray-500 mb-2">Content:</div>

      <div className="h-10 truncate mb-4">{result.content}</div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-[100px] ml-110 mb-4 bg-white text-black border-2">
            See More
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[600px] p-6 border-2 rounded-xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">
              {result.title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-gray-700">{result.content}</div>

          <div className="flex justify-end mt-4">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Button className="mt-2 w-[124px]" onClick={() => GoToTest()}>
        Take Quiz
      </Button>

      <div className="mt-10">
        <HistoryDrawer userId={userid} />
      </div>
    </div>
  );
};

export default HomePage;
