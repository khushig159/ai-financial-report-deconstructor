import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB16r520h0I1t_H9Frq3m7Vzdz2GkVw4r0",
  authDomain: "aifinancialanalyser.firebaseapp.com",
  projectId: "aifinancialanalyser",
  storageBucket: "aifinancialanalyser.firebasestorage.app",
  messagingSenderId: "299607254677",
  appId: "1:299607254677:web:918b8061193e98d8abdd9c",
  measurementId: "G-6KHWX5D1KN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);