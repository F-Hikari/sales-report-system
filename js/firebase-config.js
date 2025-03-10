// firebase-config.js - Firebase設定
const firebaseConfig = {
    // 実際のFirebaseプロジェクト設定に置き換える
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebaseの初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// コレクション参照
const reportsRef = db.collection('salesReports');
const usersRef = db.collection('users');
