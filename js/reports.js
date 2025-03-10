// reports.js - レポート関連の機能
// 日報を保存する関数
function saveReport() {
    // フォームからデータを取得
    const reportDate = document.getElementById('report-date').value;
    const reportUser = document.getElementById('report-user').value;
    const customerCount = parseInt(document.getElementById('customer-count').value);
    
    // 参加経緯データを取得
    const referralCount = parseInt(document.getElementById('referral-count').value) || 0;
    const advertisingCount = parseInt(document.getElementById('advertising-count').value) || 0;
    const repeatCount = parseInt(document.getElementById('repeat-count').value) || 0;
    const walkinCount = parseInt(document.getElementById('walkin-count').value) || 0;
    const eventCount = parseInt(document.getElementById('event-count').value) || 0;
    const snsCount = parseInt(document.getElementById('sns-count').value) || 0;
    const searchCount = parseInt(document.getElementById('search-count').value) || 0;
    
    // 決済方法データを取得
    const cashAmount = parseInt(document.getElementById('cash-amount').value) || 0;
    const creditAmount = parseInt(document.getElementById('credit-amount').value) || 0;
    const electronicAmount = parseInt(document.getElementById('electronic-amount').value) || 0;
    const webAmount = parseInt(document.getElementById('web-amount').value) || 0;
    
    // 備考を取得
    const notes = document.getElementById('report-notes').value;
    
 // 合計が一致するかチェック
const sourceTotal = referralCount + advertisingCount + repeatCount + walkinCount + eventCount + snsCount + searchCount;
if (sourceTotal !== customerCount) {
    console.log('人数不一致:', '合計売上人数=', customerCount, '参加経緯合計=', sourceTotal);
    
    // より詳細なエラーメッセージを表示
    const message = `参加経緯別人数の合計と売上人数が一致しません。

売上人数: ${customerCount}人
参加経緯合計: ${sourceTotal}人
差異: ${Math.abs(customerCount - sourceTotal)}人

各参加経緯の内訳:
- 紹介: ${referralCount}人
- 広告: ${advertisingCount}人
- リピート: ${repeatCount}人
- 飛び込み: ${walkinCount}人
- イベント参加: ${eventCount}人
- SNSからの流入: ${snsCount}人
- オンライン検索: ${searchCount}人

すべての参加者がいずれかの経緯に分類されているか確認してください。`;

    alert(message);
    return;
}
    
    // 現在の日時
    const now = new Date();
    
    // 保存するデータを作成
    const reportData = {
        date: reportDate,
        user: reportUser,
        customerCount: customerCount,
        sources: {
            referral: referralCount,
            advertising: advertisingCount,
            repeat: repeatCount,
            walkin: walkinCount,
            event: eventCount,
            sns: snsCount,
            search: searchCount
        },
        payments: {
            cash: cashAmount,
            credit: creditAmount,
            electronic: electronicAmount,
            web: webAmount
        },
        totalAmount: cashAmount + creditAmount + electronicAmount + webAmount,
        notes: notes,
        createdAt: now,
        updatedAt: now
    };
    
    // Firestoreに保存
    reportsRef.add(reportData)
        .then(function(docRef) {
            alert('日報が正常に保存されました');
            
            // フォームをリセット
            document.getElementById('report-form').reset();
            
            // 現在の日付を設定
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('report-date').value = today;
        })
        .catch(function(error) {
            console.error('日報の保存中にエラーが発生しました:', error);
            alert('日報の保存中にエラーが発生しました');
        });
}

// 日報リストを読み込む関数
function loadReportsList() {
    const tableBody = document.querySelector('#reports-table tbody');
    tableBody.innerHTML = '';
    
    // 絞り込み条件を取得
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const filterUser = document.getElementById('filter-user').value;
    
    // 絞り込み条件を適用したクエリを作成
    let query = reportsRef.orderBy('date', 'desc');
    
    if (startDate) {
        query = query.where('date', '>=', startDate);
    }
    
    if (endDate) {
        // 終了日は含めるために1日後の日付を使用
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const endDateString = nextDay.toISOString().split('T')[0];
        query = query.where('date', '<', endDateString);
    }
    
    // クエリを実行
    query.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                const reportData = doc.data();
                
                // ユーザーフィルターが指定されている場合はスキップ
                if (filterUser && reportData.user !== filterUser) {
                    return;
                }
                
                // 日付をフォーマット
                const dateObj = new Date(reportData.date);
                const formattedDate = dateObj.toLocaleDateString('ja-JP');
                
                // 作成日時と更新日時をフォーマット
                const createdAt = reportData.createdAt.toDate().toLocaleString('ja-JP');
                const updatedAt = reportData.updatedAt.toDate().toLocaleString('ja-JP');
                
                // 行を作成
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${reportData.user}</td>
                    <td>${reportData.customerCount}人</td>
                    <td>${reportData.totalAmount.toLocaleString()}円</td>
                    <td>${createdAt}</td>
                    <td>${updatedAt}</td>
                    <td>
                        <button class="btn-edit" data-id="${doc.id}">編集</button>
                        <button class="btn-archive" data-id="${doc.id}">非表示</button>
                    </td>
                `;
                
                // 表に追加
                tableBody.appendChild(row);
            });
            
            // 編集ボタンのイベントリスナーを追加
            attachEditButtonListeners();
            
            // 非表示ボタンのイベントリスナーを追加
            attachArchiveButtonListeners();
        })
        .catch(function(error) {
            console.error('日報リストの読み込み中にエラーが発生しました:', error);
            alert('日報リストの読み込み中にエラーが発生しました');
        });
}

// 編集ボタンのイベントリスナーを追加する関数
function attachEditButtonListeners() {
    document.querySelectorAll('.btn-edit').forEach(function(button) {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            editReport(reportId);
        });
    });
}

// 非表示ボタンのイベントリスナーを追加する関数
function attachArchiveButtonListeners() {
    document.querySelectorAll('.btn-archive').forEach(function(button) {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            confirmArchiveReport(reportId);
        });
    });
}

// 日報を編集する関数
function editReport(reportId) {
    // 日報データを取得
    reportsRef.doc(reportId).get()
        .then(function(doc) {
            if (doc.exists) {
                const reportData = doc.data();
                
                // 新規日報セクションを表示
                document.getElementById('btn-new-report').click();
                
                // フォームに値を設定
                document.getElementById('report-date').value = reportData.date;
                document.getElementById('report-user').value = reportData.user;
                document.getElementById('customer-count').value = reportData.customerCount;
                
                // 参加経緯データを設定
                document.getElementById('referral-count').value = reportData.sources.referral || 0;
                document.getElementById('advertising-count').value = reportData.sources.advertising || 0;
                document.getElementById('repeat-count').value = reportData.sources.repeat || 0;
                document.getElementById('walkin-count').value = reportData.sources.walkin || 0;
                document.getElementById('event-count').value = reportData.sources.event || 0;
                document.getElementById('sns-count').value = reportData.sources.sns || 0;
                document.getElementById('search-count').value = reportData.sources.search || 0;
                
                // 決済方法データを設定
                document.getElementById('cash-amount').value = reportData.payments.cash || 0;
                document.getElementById('credit-amount').value = reportData.payments.credit || 0;
                document.getElementById('electronic-amount').value = reportData.payments.electronic || 0;
                document.getElementById('web-amount').value = reportData.payments.web || 0;
                
                // 備考を設定
                document.getElementById('report-notes').value = reportData.notes || '';
                
                // 保存ボタンの動作を変更
                const reportForm = document.getElementById('report-form');
                reportForm.onsubmit = function(e) {
                    e.preventDefault();
                    updateReport(reportId);
                    return false;
                };
            } else {
                alert('指定された日報が見つかりません');
            }
        })
        .catch(function(error) {
            console.error('日報データの取得中にエラーが発生しました:', error);
            alert('日報データの取得中にエラーが発生しました');
        });
}

// 日報を更新する関数
function updateReport(reportId) {
    // フォームからデータを取得（saveReport関数と同様）
    // ...
    
    // 現在の日時
    const now = new Date();
    
    // 更新するデータを作成
    const reportData = {
        // saveReport関数と同様のデータ構造
        // ...
        updatedAt: now // 更新日時のみ現在の時刻に変更
    };
    
    // Firestoreで更新
    reportsRef.doc(reportId).update(reportData)
        .then(function() {
            alert('日報が正常に更新されました');
            
            // フォームをリセットして通常の保存モードに戻す
            document.getElementById('report-form').reset();
            document.getElementById('report-form').onsubmit = function(e) {
                e.preventDefault();
                saveReport();
                return false;
            };
            
            // 日報一覧に戻る
            document.getElementById('btn-view-reports').click();
        })
        .catch(function(error) {
            console.error('日報の更新中にエラーが発生しました:', error);
            alert('日報の更新中にエラーが発生しました');
        });
}

// 日報の非表示を確認する関数
function confirmArchiveReport(reportId) {
    if (confirm('この日報を非表示にしますか？（この操作は元に戻せません）')) {
        archiveReport(reportId);
    }
}

// 日報を非表示にする関数
function archiveReport(reportId) {
    // 非表示フラグを設定
    reportsRef.doc(reportId).update({
        isArchived: true,
        archivedAt: new Date()
    })
    .then(function() {
        alert('日報を非表示にしました');
        
        // 日報リストを再読み込み
        loadReportsList();
    })
    .catch(function(error) {
        console.error('日報の非表示処理中にエラーが発生しました:', error);
        alert('日報の非表示処理中にエラーが発生しました');
    });
}

// 統計データを読み込む関数
function loadStatisticsData() {
    // 期間を取得
    const periodType = document.getElementById('chart-period').value || 'monthly';
    const startDate = document.getElementById('chart-start-date').value;
    const endDate = document.getElementById('chart-end-date').value;
    
    // デフォルトの期間（過去3ヶ月）
    let defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 3);
    const defaultEndDate = new Date();
    
    // 日付フィールドが空の場合はデフォルト値を設定
    if (!startDate) {
        document.getElementById('chart-start-date').value = defaultStartDate.toISOString().split('T')[0];
    }
    
    if (!endDate) {
        document.getElementById('chart-end-date').value = defaultEndDate.toISOString().split('T')[0];
    }
    
    // データを取得してグラフを描画
    fetchDataAndDrawCharts(periodType, startDate || defaultStartDate.toISOString().split('T')[0], endDate || defaultEndDate.toISOString().split('T')[0]);
}

// データを取得してグラフを描画する関数
function fetchDataAndDrawCharts(periodType, startDate, endDate) {
    // Firestoreからデータを取得
    reportsRef.where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .orderBy('date')
        .get()
        .then(function(querySnapshot) {
            // データを加工してグラフに適した形式に変換
            const salesData = [];
            const sourceData = {
                referral: 0,
                advertising: 0,
                repeat: 0,
                walkin: 0,
                event: 0,
                sns: 0,
                search: 0
            };
            const paymentData = {
                cash: 0,
                credit: 0,
                electronic: 0,
                web: 0
            };
            
            querySnapshot.forEach(function(doc) {
                const reportData = doc.data();
                
                // 期間タイプに応じてデータをグループ化
                let dateKey;
                const date = new Date(reportData.date);
                
                if (periodType === 'daily') {
                    dateKey = reportData.date;
                } else if (periodType === 'weekly') {
                    // 週の初めの日付を取得
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    dateKey = weekStart.toISOString().split('T')[0];
                } else { // monthly
                    dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                }
                
                // 売上データを集計
                const existingData = salesData.find(item => item.dateKey === dateKey);
                if (existingData) {
                    existingData.amount += reportData.totalAmount;
                    existingData.customers += reportData.customerCount;
                } else {
                    salesData.push({
                        dateKey: dateKey,
                        date: date,
                        amount: reportData.totalAmount,
                        customers: reportData.customerCount
                    });
                }
                
                // 参加経緯データを集計
                Object.keys(sourceData).forEach(key => {
                    if (reportData.sources && reportData.sources[key]) {
                        sourceData[key] += reportData.sources[key];
                    }
                });
                
                // 決済方法データを集計
