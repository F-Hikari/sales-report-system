// firebase-config.js - Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBqR9NdUvXcuhgyj95L6x8M9uelIc1wJto",
  authDomain: "sales-report-system.firebaseapp.com",
  projectId: "sales-report-system",
  storageBucket: "sales-report-system.appspot.com",
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

// 初期データの設定（必要に応じて実行）
function initializeDatabase() {
  // ユーザーコレクションが空かどうか確認
  usersRef.get().then((snapshot) => {
    if (snapshot.empty) {
      // 初期ユーザーを追加
      const initialUser = {
        name: '管理者',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isArchived: false
      };
      
      usersRef.add(initialUser)
        .then(() => {
          console.log('初期ユーザーが追加されました');
        })
        .catch((error) => {
          console.error('初期ユーザーの追加に失敗しました:', error);
        });
    }
  }).catch((error) => {
    console.error('ユーザーコレクションの確認中にエラーが発生しました:', error);
  });
}

// データベースの初期化を実行
initializeDatabase();
