import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB16r520h0I1t_H9Frq3m7Vzdz2GkVw4r0",
  authDomain: "aifinancialanalyser.firebaseapp.com",
  projectId: "aifinancialanalyser",
  storageBucket: "aifinancialanalyser.firebasestorage.app",
  messagingSenderId: "299607254677",
  appId: "1:299607254677:web:918b8061193e98d8abdd9c",
  measurementId: "G-6KHWX5D1KN"
};

const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);