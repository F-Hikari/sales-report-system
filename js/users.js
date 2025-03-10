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
            document.querySelectorAll('.btn-edit-user').forEach(function(button) {
                button.addEventListener('click', function() {
                    const userId = this.getAttribute('data-id');
                    editUser(userId);
                });
            });
            
            // 削除ボタンのイベントリスナーを追加
            document.querySelectorAll('.btn-delete-user').forEach(function(button) {
                button.addEventListener('click', function() {
                    const userId = this.getAttribute('data-id');
                    const userName = this.getAttribute('data-name');
                    confirmDeleteUser(userId, userName);
                });
            });
        })
        .catch(function(error) {
            console.error('ユーザーテーブルの読み込み中にエラーが発生しました:', error);
            alert('ユーザーテーブルの読み込み中にエラーが発生しました');
        });
}

// ユーザーを編集する関数
function editUser(userId) {
    // ユーザーデータを取得
    usersRef.doc(userId).get()
        .then(function(doc) {
            if (doc.exists) {
                const userData = doc.data();
                
                // 新しい名前を入力
                const newName = prompt('入力者名を入力してください:', userData.name);
                
                if (newName && newName.trim() !== '' && newName !== userData.name) {
                    // 更新
                    usersRef.doc(userId).update({
                        name: newName,
                        updatedAt: new Date()
                    })
                    .then(function() {
                        alert(`入力者名を「${newName}」に変更しました`);
                        
                        // ユーザーリストを再読み込み
                        loadUsersList();
                        loadUsersTable();
                    })
                    .catch(function(error) {
                        console.error('ユーザーの更新中にエラーが発生しました:', error);
                        alert('ユーザーの更新中にエラーが発生しました');
                    });
                }
            } else {
                alert('指定されたユーザーが見つかりません');
            }
        })
        .catch(function(error) {
            console.error('ユーザーデータの取得中にエラーが発生しました:', error);
            alert('ユーザーデータの取得中にエラーが発生しました');
        });
}

// ユーザー削除の確認
function confirmDeleteUser(userId, userName) {
    if (confirm(`入力者「${userName}」を削除しますか？この操作は元に戻せません。`)) {
        deleteUser(userId, userName);
    }
}

// ユーザーを削除する関数（実際には非表示にする）
function deleteUser(userId, userName) {
    // 非表示フラグを設定
    usersRef.doc(userId).update({
        isArchived: true,
        archivedAt: new Date()
    })
    .then(function() {
        alert(`入力者「${userName}」を削除しました`);
        
        // ユーザーリストを再読み込み
        loadUsersList();
        loadUsersTable();
    })
    .catch(function(error) {
        console.error('ユーザーの削除中にエラーが発生しました:', error);
        alert('ユーザーの削除中にエラーが発生しました');
    });
}
