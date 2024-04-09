import type { Question, User } from "~/types";

export const useQuestions = () =>
  useState<Question[]>("questions", () => {
    return [
      {
        qId: "q1",
        question: "How satisfied are you with our product/service?",
        required: true,
        type: "single",
        options: [
          "Very satisfied",
          "Satisfied",
          "Neutral",
          "Dissatisfied",
          "Very dissatisfied",
        ],
      },
      {
        qId: "q2",
        question:
          "What features would you like to see added in future updates?",
        required: false,
        type: "text",
      },
      {
        qId: "q3",
        question:
          "On a scale of 1 to 10, how likely are you to recommend us to a friend or colleague?",
        required: true,
        type: "text",
      },
    ];
  });

export const useUser = () =>
  useState<User | null>("user", () => {
    return null;
  });
