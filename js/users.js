// users.js - ユーザー管理機能
// ユーザーリストを読み込む関数
function loadUsersList() {
    const userSelect = document.getElementById('report-user');
    const filterUserSelect = document.getElementById('filter-user');
    
    // 既存のオプションをクリア
    userSelect.innerHTML = '<option value="">選択してください</option>';
    filterUserSelect.innerHTML = '<option value="">すべて</option>';
    
    // ユーザーデータを取得
    usersRef.orderBy('name').get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                const userData = doc.data();
                
                // アーカイブされたユーザーはスキップ
                if (userData.isArchived) {
                    return;
                }
                
                // 選択肢を作成
                const option = document.createElement('option');
                option.value = userData.name;
                option.textContent = userData.name;
                
                // 選択肢を追加
                userSelect.appendChild(option.cloneNode(true));
                filterUserSelect.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('ユーザーリストの読み込み中にエラーが発生しました:', error);
        });
}

// 新規ユーザーを追加する関数
function addNewUser(userName) {
    console.log('ユーザー追加処理を開始:', userName);
    
    // 名前のバリデーション
    if (!userName || userName.trim() === '') {
        alert('有効な名前を入力してください');
        return;
    }
    
    // 現在の日時
    const now = new Date();
    
    // ユーザーデータを作成
    const userData = {
        name: userName,
        createdAt: now,
        updatedAt: now,
        isActive: true,
        isArchived: false
    };
    
    // Firestoreに直接追加（重複チェックを一時的に省略）
    usersRef.add(userData)
        .then(function(docRef) {
            console.log('ユーザー追加成功:', docRef.id);
            alert(`入力者「${userName}」が追加されました`);
            
            // ユーザーリストを再読み込み
            loadUsersList();
            try {
                loadUsersTable();
            } catch (e) {
                console.log('ユーザーテーブル読み込みでエラー発生:', e);
            }
        })
        .catch(function(error) {
            console.error('ユーザーの追加中にエラーが発生しました:', error);
            alert('ユーザーの追加中にエラーが発生しました: ' + error.message);
        });
}

// ユーザーテーブルを読み込む関数
function loadUsersTable() {
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '';
    
    // ユーザーデータを取得
    usersRef.orderBy('name').get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                const userData = doc.data();
                
                // アーカイブされたユーザーはスキップ
                if (userData.isArchived) {
                    return;
                }
                
                // 登録日をフォーマット
                const createdAt = userData.createdAt.toDate().toLocaleDateString('ja-JP');
                
                // 行を作成
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${userData.name}</td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="btn-edit-user" data-id="${doc.id}">編集</button>
                        <button class="btn-delete-user" data-id="${doc.id}" data-name="${userData.name}">削除</button>
                    </td>
                `;
                
                // 表に追加
                tableBody.appendChild(row);
            });
            
            // 編集ボタンのイベントリスナーを追加
            document.querySelectorA
