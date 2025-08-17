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
  name: 'analysis-storage', // A unique name for the storage
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage
      // We only want to save the analysisResult. We don't want to save
      // loading or error states, as they should be fresh on every page load.
      partialize: (state) => ({ analysisResult: state.analysisResult }),
}
))
onAuthStateChanged(auth, (user) => {
  useAnalysisStore.getState().setCurrentUser(user);
  useAnalysisStore.getState().setAuthLoading(false);
});

export default useAnalysisStore;


// const handleExport = () => {
//   console.log('clicked')
 

//     // if (!analysisResult || !analysisResult.current) return;


// console.log(analysisResult)
//     // const { current } = analysisResult;
//     // console.log(current)
//     console.log(analysisResult.executive_summary.paragraph)
//     console.log(analysisResult.executive_summary.takeaways)
//     console.log(analysisResult.risk_summary.top_risks)
//     console.log(analysisResult.red_flags)
//     const doc = new jsPDF('p', 'mm', 'a4');
//     let yPos = 20; // Y position starts at 20mm from the top

//     // Helper function to add text and handle page breaks
//     const addTextSection = (title, content) => {
//         if (yPos > 250) { // Check if we need a new page
//             doc.addPage();
//             yPos = 20;
//         }
//         doc.setFontSize(16);
//         doc.text(title, 14, yPos);
//         yPos += 8;
//         doc.setFontSize(10);
//         // jsPDF's splitTextToSize handles automatic wrapping
//         const lines = doc.splitTextToSize(content, 180);
//         doc.text(lines, 14, yPos);
//         yPos += lines.length * 4 + 10; // Move Y position down
//     };

//     // --- 1. Add Title ---
//     doc.setFontSize(22);
//     doc.text(`AI Financial Analysis: ${analysisResult.companyTicker}`, 105, yPos, { align: 'center' });
//     yPos += 15;

//     // --- 2. Add Executive Summary ---
//     addTextSection("Executive Summary", analysisResult.executive_summary.paragraph);
    
//     // --- 3. Add Key Takeaways ---
//     addTextSection("Key Takeaways", analysisResult.executive_summary.takeaways.join('\n'));

//     // --- 4. Add Top Risks ---
//     addTextSection("Top Identified Risks", analysisResult.risk_summary.top_risks.join('\n'));

//     // --- 5. Add Red Flags ---
//     addTextSection("AI-Detected Potential Red Flags", analysisResult.red_flags.join('\n'));

    
    
//     // --- 6. Save the PDF ---
//     doc.save(`${analysisResult.companyTicker}-full-analysis.pdf`);
//   };