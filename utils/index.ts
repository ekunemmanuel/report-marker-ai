import type { QuestionType } from "~/types";

export function parseQuestionType(type: QuestionType) {
  switch (type) {
    case "text":
      return "Written Choice";
    case "single":
      return "Single Choice";
    case "multiple":
      return "Multiple Choice";
    default:
      return "Unknown Type";
  }
}
