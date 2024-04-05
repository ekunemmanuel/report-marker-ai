import type { MyForm, Question, User } from "~/types";

export const useQuestion = () =>
  useState<Question>("question", () => {
    return {
      qId: "",
      question: "",
      required: false,
      type: "text",
    };
  });

export const useQuestions = () =>
  useState<Question[]>("questions", () => {
    return [
      {
        qId: "1",
        question: "What is your favorite color?",
        required: true,
        type: "text",
      },
      {
        qId: "2",
        question: "What is your favorite animal?",
        options: ["Dog", "Cat", "Bird"],
        required: true,
        type: "single",
      },
      {
        qId: "3",
        question: "What is your favorite food?",
        options: ["Pizza", "Burger", "Salad"],
        required: true,
        type: "multiple",
      },
      {
        qId: "4",
        question: "What is your favorite color?",
        required: true,
        type: "single",
        options: ["Red", "Blue", "Green", "Yellow", "Other"],
      },
      {
        qId: "5",
        question: "What is your age?",
        required: false,
        type: "text",
      },
      {
        qId: "6",
        question: "Which of the following activities do you enjoy?",
        required: true,
        type: "multiple",
        options: ["Reading", "Sports", "Cooking", "Traveling", "Gaming"],
      },
    ];
  });

export const useNewQuestions = () =>
  useState<Question[]>("newQuestions", () => {
    return [];
  });

export const useForms = () =>
  useState<MyForm[]>("forms", () => {
    return [
      // {
      //   fId: "ba8d9695-6904-4732-a652-c3c35ebb12f1",
      //   title: "Form 1",
      //   description: "This is the first form",
      //   questions: [
      //     {
      //       qId: "1",
      //       question: "What is your favorite color?",
      //       required: true,
      //       type: "text",
      //     },
      //     {
      //       qId: "2",
      //       question: "What is your favorite animal?",
      //       options: ["Dog", "Cat", "Bird"],
      //       required: true,
      //       type: "single",
      //     },
      //     {
      //       qId: "3",
      //       question: "What is your favorite food?",
      //       options: ["Pizza", "Burger", "Salad"],
      //       required: false,
      //       type: "multiple",
      //     },
      //   ],
      // },
    ];
  });

export const useNewForm = () =>
  useState<MyForm>("newForm", () => {
    return {
      fId: "",
      title: "",
      description: "",
      questions: [],
    };
  });

// export const useUser = () =>
//   useState<User | null>("user", () => {
//     return {
//       uId: "x3chDlrgBfNQdotr76wUlMRnLSj1",
//       name: "John Doe",
//       email: "Doe@gamil.com",
//       plan: {
//         amount: 0,
//         currency: "NGN",
//         id: 1,
//         interval: "1",
//         name: "plan name",
//         plan_code: "asdsad",
//         send_invoices: true,
//         send_sms: true,
//         description: "asd",
//       },
//       subscription: "inactive",
//     };
//   });

export const useUser = () =>
  useState<User | null>("user", () => {
    return null;
  });

export const useForm = () =>
  useState<MyForm>("newForm", () => {
    return {
      fId: "",
      title: "",
      description: "",
      questions: [],
    };
  });

export const useResponses = () =>
  useState<MyForm[]>("response", () => {
    return [];
  });
