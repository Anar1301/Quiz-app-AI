export type HistoryDataType = {
  user: { id: string };

  quiz: { id: string; question: string; answer: string; options: string[] }[];
  title: string;
  summary: string;
  content: string;
};
export type userData = {
  id: string;
};
export type UserAnswer = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};
export type Question = {
  question: string;
  options: string[];
  answer: string;
};
export type History = {
  title: string;
  id: string;
};
