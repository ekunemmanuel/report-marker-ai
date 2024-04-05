export const useNotification = () => {
  function notification(title: string, description: string, id?: string) {
    const toast = useToast();

    toast.add({
      id: id,
      title: title,
      description: description,
    });
  }

  return {
    notification,
  };
};
