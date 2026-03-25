import axios from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  isNetworkError: boolean;
  isTimeout: boolean;
  status?: number;
}

export function parseApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return {
          message: 'Request timeout. Please check your internet connection.',
          code: error.code,
          isNetworkError: true,
          isTimeout: true,
        };
      }
      return {
        message: 'No internet connection. Please check your network and try again.',
        code: error.code,
        isNetworkError: true,
        isTimeout: false,
      };
    }

    // Server error
    const data = error.response.data as any;
    return {
      message:
        data?.message ||
        data?.error ||
        error.message ||
        'Something went wrong. Please try again.',
      status: error.response.status,
      code: error.code,
      isNetworkError: false,
      isTimeout: false,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      isNetworkError: false,
      isTimeout: false,
    };
  }

  return {
    message: 'Something went wrong. Please try again.',
    isNetworkError: false,
    isTimeout: false,
  };
}
