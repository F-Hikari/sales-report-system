// firebase-config.js - Firebase設定
const firebaseConfig = {
    // 実際のFirebaseプロジェクト設定に置き換える
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqR9NdUvXcuhgyj95L6x8M9uelIc1wJto",
  authDomain: "sales-report-system.firebaseapp.com",
  projectId: "sales-report-system",
  storageBucket: "sales-report-system.firebasestorage.app",
  messagingSenderId: "149432948067",
  appId: "1:149432948067:web:271301f844c6f2b0286f56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
};

// Firebaseの初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// コレクション参照
const reportsRef = db.collection('salesReports');
const usersRef = db.collection('users');
