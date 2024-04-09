import type { MyForm, FormResponse } from "~/types";

export const useApiCalls = () => {
  const { notification } = useNotification();

  async function createForm(uId: string, data: MyForm) {
    try {
      const response = await $fetch("/api/v1/users/:uId/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          form: data,
          uId: uId,
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create form");
    }
  }

  async function submitForm(uId: string, response: FormResponse) {
    try {
      await $fetch(`/api/v1/users/${uId}/forms/${response.fId}/responses`, {
        method: "POST",
        body: {
          form: {
            fId: response.fId,
            title: response.title,
            description: response.description,
            questions: response.questions,
            rId: response.rId,
          },
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
      const data = await $fetch(`/api/v1/users/${uId}/forms/${fId}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function getForms(uId: string) {
    try {
      const data = await $fetch(`/api/v1/users/${uId}/forms`);
      return data;
    } catch (error) {
      throw error;
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
      const data = await $fetch(`/api/v1/users/${uId}/forms/${fId}/responses`);

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function getResponse(uId: string, fId: string, rId: string) {
    try {
      const data = await $fetch(
        `/api/v1/users/${uId}/forms/${fId}/responses/${rId}`
      );

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function updateForm(uId: string, data: MyForm) {
    try {
      const res = await $fetch(`/api/v1/users/${uId}/forms/${data.fId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          form: data,
          uId: uId,
        },
      });

      notification("Success", "Form updated successfully", "success");
      navigateTo(`/dashboard/forms/${data.fId}`);

      return res;
    } catch (error) {
      notification("Error", "Failed to update form", "error");
    }
  }

  async function deleteForm(uId: string, fId: string) {
    try {
      await $fetch(`/api/v1/users/${uId}/forms/${fId}`, {
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
      throw error;
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

  async function createProfile(email: string, password: string) {
    try {
      const response = await $fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email,
          password,
        },
      });
      return response;
    } catch (error) {
      throw new Error("Failed to create profile");
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
    createProfile,
  };
};
