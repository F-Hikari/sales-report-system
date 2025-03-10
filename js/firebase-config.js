// firebase-config.js - Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBqR9NdUvXcuhgyj95L6x8M9uelIc1wJto",
  authDomain: "sales-report-system.firebaseapp.com",
  projectId: "sales-report-system",
  storageBucket: "sales-report-system.appspot.com", // 注意: これは.firebasestorage.appではなく.appspot.comになるはずです
  messagingSenderId: "149432948067",
  appId: "1:149432948067:web:271301f844c6f2b0286f56"
};

// Firebaseの初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// コレクション参照
const reportsRef = db.collection('salesReports');
const usersRef = db.collection('users');
