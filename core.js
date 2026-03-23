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
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalOverlay.classList.add('show');
}

function closeModal() {
    if (!modalOverlay) modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('show');
}
