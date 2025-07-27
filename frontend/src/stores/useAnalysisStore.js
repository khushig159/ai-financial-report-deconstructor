import { create } from 'zustand';

const useAnalysisStore = create((set) => ({
  // State
  analysisResult: null,
  isLoading: false,
  error: null,

  // Actions
  startLoading: () => set({ isLoading: true, error: null, analysisResult: null }),
  setResult: (data) => set({ analysisResult: data, isLoading: false }),
  setError: (errorMessage) => set({ error: errorMessage, isLoading: false, analysisResult: null }),
}));

export default useAnalysisStore;
