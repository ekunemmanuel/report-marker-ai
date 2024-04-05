import type { MyForm, FormResponse } from "~/types";

export const useApiCalls = () => {
  const { notification } = useNotification();
  const myForms = useForms();
  const form = useForm();

  async function createForm(uId: string, data: MyForm) {
    try {
      await $fetch("/api/v1/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          form: data,
          uId: uId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function submitForm(uId: string, response: FormResponse) {
    try {
      await $fetch("/api/v1/responses", {
        method: "POST",
        body: {
          form: {
            fId: response.fId,
            title: response.title,
            description: response.description,
            questions: response.questions,
          },
          rId: response.rId,
          uId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      notification("Success", "Form submitted successfully", "success");
      navigateTo("/");
    } catch (error) {
      console.error(error);
      notification("Error", "Failed to submit form", "error");
      return null;
    }
  }

  async function getForm(uId: string, fId: string) {
    try {
      const data = await $fetch(`/api/v1/forms/shared-form`, {
        method: "POST",
        body: {
          uId,
          fId,
        },
      });

      form.value = data;
    } catch (error) {
      // console.error(error);
      return null;
    }
  }

  async function getForms(uId: string) {
    try {
      const data = await $fetch(`/api/v1/forms/fId`, {
        method: "POST",
        body: {
          uId,
        },
      });
      // data.sort((a, b) => {
      //   let dateA = a.createdAt!.toDate();
      //   let dateB = b.createdAt!.toDate();

      //   return dateB!.getTime() - dateA!.getTime();
      // });

      myForms.value = data;
    } catch (error) {
      // console.error(error);
      return null;
    }
  }

  async function makePayment(email: string, amount: number) {
    try {
      const response = await $fetch("/api/v1/paystack/pay", {
        method: "POST",
        body: {
          email,
          amount,
          isDaily: false,
        },
      });

      navigateTo(response.data.authorization_url, {
        external: true,
        redirectCode: 302,
        replace: true,
      });

      notification("Redirecting", "Redirecting to payment page", "info");
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function getResponses(uId: string, fId: string) {
    try {
      const data = await $fetch(`/api/v1/responses/fetch-responses`, {
        method: "post",
        body: {
          uId,
          fId,
        },
      });

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function getResponse(uId: string, fId: string, rId: string) {
    try {
      const data = await $fetch(`/api/v1/responses/fetch-response`, {
        method: "post",
        body: {
          uId,
          fId,
          rId,
        },
      });

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function updateForm(uId: string, data: MyForm) {
    try {
      const res = await $fetch("/api/v1/forms/edit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          form: data,
          uId: uId,
          fId: data.fId,
        },
      });

      notification("Success", "Form updated successfully", "success");

      return res;
    } catch (error) {
      notification("Error", "Failed to update form", "error");
    }
  }

  async function deleteForm(uId: string, fId: string) {
    try {
      await $fetch("/api/v1/forms", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          uId,
          fId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function getProfile(uId: string) {
    try {
      const data = await $fetch(`/api/v1/users/${uId}`);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return {
    createForm,
    submitForm,
    getForm,
    getForms,
    makePayment,
    getResponses,
    getResponse,
    updateForm,
    deleteForm,
    getProfile,
  };
};
