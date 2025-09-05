import { useState, useEffect } from 'react';
import { handleApiError } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Generic API hook
export function useApi<T>(
  apiFunction: () => Promise<any>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: options.immediate !== false,
    error: null
  });

  const execute = async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(...args);
      const data = response.data || response;
      
      setState({
        data,
        loading: false,
        error: null
      });

      if (options.onSuccess) {
        options.onSuccess(data);
      }

      return { success: true, data };
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      
      setState({
        data: null,
        loading: false,
        error: errorMessage
      });

      if (options.onError) {
        options.onError(errorMessage);
      }

      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    refetch: execute
  };
}

// Specific hooks for common operations
export function useVideos(params?: any) {
  const { videosAPI } = require('../services/api');
  
  return useApi(() => videosAPI.getVideos(params), {
    immediate: true
  });
}

export function useVideo(id: string) {
  const { videosAPI } = require('../services/api');
  
  return useApi(() => videosAPI.getVideo(id), {
    immediate: !!id
  });
}

export function useUserProfile(id: string) {
  const { usersAPI } = require('../services/api');
  
  return useApi(() => usersAPI.getProfile(id), {
    immediate: !!id
  });
}

export function useWalletData() {
  const { walletAPI } = require('../services/api');
  
  const balance = useApi(() => walletAPI.getBalance());
  const transactions = useApi(() => walletAPI.getTransactions());
  const stats = useApi(() => walletAPI.getStats());

  return {
    balance,
    transactions,
    stats,
    refetchAll: () => {
      balance.refetch();
      transactions.refetch();
      stats.refetch();
    }
  };
}

export function useLiveStreams() {
  const { liveAPI } = require('../services/api');
  
  return useApi(() => liveAPI.getStreams(), {
    immediate: true
  });
}

// Upload hook with progress
export function useUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadVideo = async (formData: FormData) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const { videosAPI } = require('../services/api');
      const response = await videosAPI.uploadVideo(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);

      return response;
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      throw error;
    }
  };

  return {
    uploadVideo,
    uploadProgress,
    isUploading
  };
}

// Pagination hook
export function usePagination(initialPage = 1, initialLimit = 12) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(1, prev - 1));
  const goToPage = (pageNumber: number) => setPage(pageNumber);
  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  return {
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    setPage,
    setLimit
  };
}

// Search hook with debounce
export function useSearch(delay = 500) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm
  };
}