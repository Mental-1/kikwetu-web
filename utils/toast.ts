import { toast } from 'sonner';

export const showToast = {
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 4000,
      className: 'toast-success',
    });
  },
  
  error: (message: string, description?: string) => {
    return toast.error(message, {
      description,
      duration: 5000,
    });
  },
  
  warning: (message: string, description?: string) => {
    return toast.warning(message, {
      description,
      duration: 4000,
    });
  },
  
  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 4000,
    });
  },
  
  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description,
      duration: Infinity, // Loading toasts stay until dismissed or replaced
    });
  },
  
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};

