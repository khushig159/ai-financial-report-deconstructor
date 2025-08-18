import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const useAnalysisStore = create(persist(
    (set) => ({

  analysisResult: null,
  isLoading: false,
  error: null,
  chartTitle:null,

  currentUser:null,
  chartData:null,
  context:null,

  isAuthLoading:true,

  startLoading: () => set({ isLoading: true, error: null, analysisResult: null }),
  setResult: (data) => set({ analysisResult: data, isLoading: false }),
  setError: (errorMessage) => set({ error: errorMessage, isLoading: false, analysisResult: null }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
  setchartTitle:(title)=>set({chartTitle:title}),
  setchartData:(data)=>set({chartData:data}),
  setcontext:(des)=>set({context:des})

}),
{
  name: 'analysis-storage', 
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage
      partialize: (state) => ({ analysisResult: state.analysisResult }),
}
))
onAuthStateChanged(auth, (user) => {
  useAnalysisStore.getState().setCurrentUser(user);
  useAnalysisStore.getState().setAuthLoading(false);
});

export default useAnalysisStore;


