import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, ApiError } from '../api/client';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
      } else {
        setError({
          message: response.message || 'An error occurred',
          status: 400,
        });
      }
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      await fetchData();
    };

    if (isMounted) {
      executeFetch();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook for mutations (POST, PUT, DELETE)
export function useApiMutation<T, P = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = async (apiCall: (params?: P) => Promise<ApiResponse<T>>, params?: P) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(params);
      
      if (response.success) {
        return response.data;
      } else {
        throw {
          message: response.message || 'An error occurred',
          status: 400,
        };
      }
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
