// app.js - メインアプリケーションロジック
document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションボタン
    const btnNewReport = document.getElementById('btn-new-report');
    const btnViewReports = document.getElementById('btn-view-reports');
    const btnStatistics = document.getElementById('btn-statistics');
    const btnManageUsers = document.getElementById('btn-manage-users');
    const btnHelp = document.getElementById('btn-help');
    
    // セクション
    const newReportSection = document.getElementById('new-report-section');
    const reportsListSection = document.getElementById('reports-list-section');
    const statisticsSection = document.getElementById('statistics-section');
    const usersSection = document.getElementById('users-section');
    const helpSection = document.getElementById('help-section');
    
    // すべてのセクションを非表示にする関数
    function hideAllSections() {
        newReportSection.classList.add('hidden');
        reportsListSection.classList.add('hidden');
        statisticsSection.classList.add('hidden');
        usersSection.classList.add('hidden');
        helpSection.classList.add('hidden');
    }
    
    // 新規日報作成セクションを表示
    btnNewReport.addEventListener('click', function() {
        hideAllSections();
        newReportSection.classList.remove('hidden');
        loadUsersList(); // ユーザーリストを読み込む
        
        // 現在の日付を初期値に設定
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('report-date').value = today;
    });
    
    // 日報一覧セクションを表示
    btnViewReports.addEventListener('click', function() {
        hideAllSections();
        reportsListSection.classList.remove('hidden');
        loadReportsList(); // 日報リストを読み込む
    });
    
    // 統計・グラフセクションを表示
    btnStatistics.addEventListener('click', function() {
        hideAllSections();
        statisticsSection.classList.remove('hidden');
        loadStatisticsData(); // 統計データを読み込む
    });
    
    // 入力者管理セクションを表示
    btnManageUsers.addEventListener('click', function() {
        hideAllSections();
        usersSection.classList.remove('hidden');
        loadUsersTable(); // ユーザーテーブルを読み込む
    });
    
    // ヘルプセクションを表示
    btnHelp.addEventListener('click', function() {
        hideAllSections();
        helpSection.classList.remove('hidden');
    });
    
    // 初期表示（日報一覧を表示）
    btnViewReports.click();
    
    // 日報フォームの送信処理
    const reportForm = document.getElementById('report-form');
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveReport();
    });
    
    // 新規ユーザー追加ボタン
    const btnAddUser = document.getElementById('btn-add-user');
    btnAddUser.addEventListener('click', function() {
        const userName = prompt('新しい入力者の名前を入力してください:');
        if (userName && userName.trim() !== '') {
            addNewUser(userName.trim());
        }
    });
    
    // PDF出力ボタン
    const btnExportPdf = document.getElementById('btn-export-pdf');
    btnExportPdf.addEventListener('click', function() {
        exportToPdf();
    });
    
    // CSV出力ボタン
    const btnExportCsv = document.getElementById('btn-export-csv');
    btnExportCsv.addEventListener('click', function() {
        exportToCsv();
    });
});
