export type HistoryDataType = {
  data: {
    Quiz: { question: string; answer: string; options: string[] }[];
    title: string;
    summary: string;
    content: string;
  };
};

export type UserAnswer = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};
