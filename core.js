// ============================
// Core utilities - loaded first
// ============================

// Page renderers map (populated by page scripts)
const pages = {};

// Registration wizard state
let registrationStep = 1;

// ====== Utility Functions ======
function formatMoney(n) {
    return n.toLocaleString('th-TH');
}

function getStatusBadge(status) {
    const map = {
        'เปิด': 'success', 'เต็ม': 'danger', 'ปิด': 'neutral',
        'ชำระแล้ว': 'success', 'ค้างชำระ': 'danger',
        'กำลังศึกษา': 'success', 'พ้นสภาพ': 'danger',
    };
    return `<span class="badge ${map[status] || 'neutral'}">${status}</span>`;
}

// Modal functions (need to be available to page scripts)
let modalOverlay, modalTitle, modalBody;

function openModal(title, bodyHtml) {
    if (!modalOverlay) modalOverlay = document.getElementById('modalOverlay');
    if (!modalTitle) modalTitle = document.getElementById('modalTitle');
    if (!modalBody) modalBody = document.getElementById('modalBody');
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = bodyHtml;
    if (modalOverlay) modalOverlay.classList.add('show');
}

function closeModal() {
    if (!modalOverlay) modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.remove('show');
}

function showApiLoading(msg = 'กำลังโหลดข้อมูล...') {
    const loader = document.getElementById('apiLoader');
    const loaderText = document.getElementById('apiLoaderText');
    if (loader) loader.classList.add('show');
    if (loaderText) loaderText.textContent = msg;
}

function hideApiLoading() {
    const loader = document.getElementById('apiLoader');
    if (loader) loader.classList.remove('show');
}

// Generic CSV Import Helper
window.handleGenericCSVImport = function(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        showApiLoading('กำลังวิเคราะห์ไฟล์ CSV...');
        const reader = new FileReader();
        reader.onload = function(errEv) {
            let text = errEv.target.result;
            
            // Robust line splitting
            const lines = text.split(/\r?\n|\r/).filter(l => l.trim());
            if (lines.length < 2) {
                hideApiLoading();
                alert('ไฟล์ไม่มีข้อมูล (ต้องมีอย่างน้อย 1 แถวหัวตาราง + 1 แถวข้อมูล)');
                return;
            }
            
            const headers = parseCSVLine(lines[0]);
            const data = [];
            for (let i = 1; i < lines.length; i++) {
                const cols = parseCSVLine(lines[i]);
                if (cols.length < 1) continue;
                const row = {};
                headers.forEach((h, idx) => { 
                    row[h.trim()] = (cols[idx] || '').trim(); 
                });
                data.push(row);
            }
            hideApiLoading();
            callback(data, headers);
        };
        reader.readAsText(file, 'UTF-8');
    };
    input.click();
};

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuote = !inQuote; }
        else if (ch === ',' && !inQuote) { result.push(current); current = ''; }
        else { current += ch; }
    }
    result.push(current);
    return result;
}

window.downloadCSVTemplate = function(filename, headers, sampleRow) {
    const BOM = '\uFEFF';
    const csv = BOM + headers.join(',') + '\n' + sampleRow.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};
