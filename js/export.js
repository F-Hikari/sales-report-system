// export.js - エクスポート機能
// PDFエクスポート関数
function exportToPdf() {
    // 現在表示されている日報データを取得
    const tableRows = document.querySelectorAll('#reports-table tbody tr');
    if (tableRows.length === 0) {
        alert('エクスポートするデータがありません');
        return;
    }
    
    // PDFを生成
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // タイトルを追加
    doc.setFontSize(18);
    doc.text('売上日報一覧', 14, 22);
    
    // 生成日時を追加
    const now = new Date().toLocaleString('ja-JP');
    doc.setFontSize(10);
    doc.text(`出力日時: ${now}`, 14, 30);
    
    // フィルター条件を追加
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const filterUser = document.getElementById('filter-user').value;
    
    let filterText = '対象期間: ';
    if (startDate && endDate) {
        filterText += `${startDate} 〜 ${endDate}`;
    } else if (startDate) {
        filterText += `${startDate} 以降`;
    } else if (endDate) {
        filterText += `${endDate} 以前`;
    } else {
        filterText += '全期間';
    }
    
    if (filterUser) {
        filterText += `, 記入者: ${filterUser}`;
    }
    
    doc.text(filterText, 14, 36);
    
    // ヘッダーを追加
    const headers = ['日付', '記入者', '売上人数', '売上合計', '作成日時', '最終更新'];
    let startY = 45;
    let pageNumber = 1;
    
    // ヘッダー行を描画する関数
    function drawHeaders(y) {
        doc.setFillColor(230, 230, 230);
        doc.rect(14, y - 5, 180, 8, 'F');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        doc.text(headers[0], 15, y);
        doc.text(headers[1], 45, y);
        doc.text(headers[2], 85, y);
        doc.text(headers[3], 115, y);
        doc.text(headers[4], 145, y);
        doc.text(headers[5], 175, y);
        
        return y + 8;
    }
    
    // ページ番号を描画する関数
    function drawPageNumber() {
        doc.setFontSize(8);
        doc.text(`ページ ${pageNumber}`, 190, 286, null, null, 'right');
    }
    
    // ヘッダーを描画
    startY = drawHeaders(startY);
    
    // データを追加
    tableRows.forEach((row, index) => {
        // 新しいページが必要かチェック
        if (startY > 280) {
            drawPageNumber();
            doc.addPage();
            pageNumber++;
            startY = 20;
            startY = drawHeaders(startY);
        }
        
        const cells = row.querySelectorAll('td');
        
        doc.setFontSize(9);
        doc.text(cells[0].textContent, 15, startY);
        doc.text(cells[1].textContent, 45, startY);
        doc.text(cells[2].textContent, 85, startY);
        doc.text(cells[3].textContent, 115, startY);
        doc.text(cells[4].textContent, 145, startY);
        doc.text(cells[5].textContent, 175, startY);
        
        startY += 7;
    });
    
    // 最後のページ番号を描画
    drawPageNumber();
    
    // PDFを保存
    doc.save('sales-report.pdf');
}

// CSVエクスポート関数
function exportToCsv() {
    // 現在表示されている日報データを取得
    const tableRows = document.querySelectorAll('#reports-table tbody tr');
    if (tableRows.length === 0) {
        alert('エクスポートするデータがありません');
        return;
    }
    
    // ヘッダー行
    const headers = ['日付', '記入者', '売上人数', '売上合計', '作成日時', '最終更新'];
    
    // CSVデータの作成
    let csvContent = headers.join(',') + '\n';
    
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [
            cells[0].textContent,  // 日付
            '"' + cells[1].textContent.replace(/"/g, '""') + '"',  // 記入者（引用符でエスケープ）
            cells[2].textContent.replace(/[^0-9]/g, ''),  // 売上人数（数字のみ）
            cells[3].textContent.replace(/[^0-9]/g, ''),  // 売上合計（数字のみ）
            '"' + cells[4].textContent.replace(/"/g, '""') + '"',  // 作成日時
            '"' + cells[5].textContent.replace(/"/g, '""') + '"'   // 最終更新
        ];
        
        csvContent += rowData.join(',') + '\n';
    });
    
    // CSVファイルのダウンロード
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // 日時を含めたファイル名
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `sales-report_${formattedDate}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.rem
