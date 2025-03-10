// help.js - ヘルプ機能
document.addEventListener('DOMContentLoaded', function() {
    // ヘルプコンテンツを更新する日時やバージョン情報
    const helpVersionInfo = {
        version: '1.0.0',
        lastUpdated: '2025年3月10日'
    };
    
    // ヘルプセクションが表示されたときに実行
    document.getElementById('btn-help').addEventListener('click', function() {
        updateHelpContent();
    });
    
    // ヘルプコンテンツを更新する関数
    function updateHelpContent() {
        // バージョン情報を更新
        const helpContent = document.querySelector('.help-content');
        
        // 既にバージョン情報がある場合は更新
        let versionElement = helpContent.querySelector('.version-info');
        if (!versionElement) {
            // なければ作成
            versionElement = document.createElement('div');
            versionElement.className = 'version-info';
            helpContent.appendChild(versionElement);
        }
        
        // バージョン情報をセット
        versionElement.innerHTML = `
            <p class="version-text">バージョン: ${helpVersionInfo.version} (最終更新: ${helpVersionInfo.lastUpdated})</p>
        `;
        
        // ヘルプ内のリンクにイベントリスナーを追加
        addHelpLinkListeners();
    }
    
    // ヘルプ内のリンクにイベントリスナーを追加する関数
    function addHelpLinkListeners() {
        // 例: 特定セクションへジャンプするリンク
        const helpLinks = document.querySelectorAll('.help-link');
        helpLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // ヘルプページにPDFダウンロードボタンを追加
    function addHelpPdfButton() {
        const helpContent = document.querySelector('.help-content');
        if (!helpContent.querySelector('.help-pdf-button')) {
            const pdfButton = document.createElement('button');
            pdfButton.className = 'help-pdf-button';
            pdfButton.textContent = 'マニュアルをPDFでダウンロード';
            pdfButton.addEventListener('click', downloadHelpPdf);
            
            // ヘルプコンテンツの先頭に挿入
            helpContent.insertBefore(pdfButton, helpContent.firstChild);
        }
    }
    
    // ヘルプマニュアルをPDFでダウンロードする関数
    function downloadHelpPdf() {
        // PDFを生成
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // タイトルを追加
        doc.setFontSize(22);
        doc.text('売上日報システム 使い方ガイド', 14, 22);
        
        // バージョン情報を追加
        doc.setFontSize(10);
        doc.text(`バージョン: ${helpVersionInfo.version} (最終更新: ${helpVersionInfo.lastUpdated})`, 14, 30);
        
        let startY = 40;
        doc.setFontSize(16);
        doc.text('1. 日報の新規作成', 14, startY);
        startY += 10;
        
        doc.setFontSize(11);
        doc.text('「新規日報作成」ボタンをクリックして、日報入力フォームを開きます。', 14, startY);
        startY += 7;
        doc.text('必要事項を入力し、「保存」ボタンをクリックすると日報が作成されます。', 14, startY);
        startY += 15;
        
        doc.setFontSize(16);
        doc.text('2. 日報一覧の閲覧', 14, startY);
        startY += 10;
        
        doc.setFontSize(11);
        doc.text('「日報一覧」ボタンをクリックすると、これまでに作成された日報の一覧が表示されます。', 14, startY);
        startY += 7;
        doc.text('日付や記入者で絞り込みができます。', 14, startY);
        startY += 15;
        
        // 残りのセクションも同様に追加...
        
        // PDFを保存
        doc.save('sales-report-manual.pdf');
    }
    
    // 初期化時にPDFボタンを追加
    setTimeout(function() {
        addHelpPdfButton();
    }, 1000);
});
