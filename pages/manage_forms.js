/**
 * Page: Manage Forms (Administrative)
 * Allows importing and managing student petition template lists.
 */

pages['manage-forms'] = function () {
    return `
        <div class="animate-in">
            <div class="page-header">
                <div class="header-content">
                    <h1 class="page-title">จัดการชุดแบบฟอร์ม</h1>
                    <p class="page-subtitle">จัดการรายชื่อแบบฟอร์มคำร้องออนไลน์ที่แสดงให้นักศึกษาใช้งาน</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-outline" onclick="window.downloadFormsTemplate()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ดาวน์โหลดเทมเพลต
                    </button>
                    <button class="btn btn-primary" onclick="window.showFormsImportTab()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/></svg>
                        นำเข้าข้อมูล (CSV)
                    </button>
                </div>
            </div>

            <div class="card" style="margin-bottom:24px; padding:0;">
                <div class="tabs-header" style="padding: 0 24px; border-bottom: 1px solid var(--border-color); display: flex;">
                    <button class="tab-btn active" data-tab="list" onclick="window.switchFormsTab('list')">รายชื่อแบบฟอร์ม</button>
                    <button class="tab-btn" data-tab="import" onclick="window.switchFormsTab('import')">นำเข้าข้อมูลใหม่</button>
                </div>

                <div id="formsTabContent" style="padding: 24px;">
                    <!-- Content will be injected here -->
                </div>
            </div>
        </div>
    `;
};

window.switchFormsTab = function(tab) {
    const container = document.getElementById('formsTabContent');
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    
    const targetBtn = document.querySelector(`[data-tab="${tab}"]`);
    if (targetBtn) targetBtn.classList.add('active');

    if (tab === 'list') {
        renderFormsList(container);
    } else {
        renderFormsImport(container);
    }
};

window.showFormsImportTab = function() {
    window.switchFormsTab('import');
};

function renderFormsList(container) {
    const items = MOCK.documentTemplates || [];
    
    if (items.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 0; color:var(--text-muted);">
                <div style="font-size:3rem; margin-bottom:16px;">📑</div>
                <h3>ยังไม่มีข้อมูลชุดแบบฟอร์ม</h3>
                <p>กรุณานำเข้าข้อมูลจากไฟล์ CSV เพื่อเริ่มใช้งานในระบบคำร้องออนไลน์</p>
                <button class="btn btn-primary" style="margin-top:16px;" onclick="window.showFormsImportTab()">นำเข้าข้อมูลตอนนี้</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div style="margin-bottom:20px; display:flex; gap:12px; align-items:center;">
            <div class="search-box" style="flex:1;">
                <input type="text" id="formsSearch" placeholder="ค้นหารหัส หรือชื่อแบบฟอร์ม..." class="form-control" onkeyup="window.filterFormsTable()">
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted);">
                ทั้งหมด <span id="formsCount">${items.length}</span> รายการ
            </div>
        </div>
        <div class="table-container">
            <table class="table" id="formsMainTable">
                <thead>
                    <tr>
                        <th>รหัสแบบฟอร์ม (ID)</th>
                        <th>ชื่อแบบฟอร์ม</th>
                        <th>ประเภท (Type)</th>
                        <th style="text-align:center;">สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((item, idx) => `
                        <tr>
                            <td style="font-weight:600; font-family:monospace;">${item.id}</td>
                            <td>${item.name}</td>
                            <td>
                                <span class="badge badge-info">${item.type || 'ทั่วไป'}</span>
                            </td>
                            <td style="text-align:center; color:var(--success-color);">
                                ใช้งาน
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

window.filterFormsTable = function() {
    const query = document.getElementById('formsSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#formsMainTable tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    document.getElementById('formsCount').textContent = visibleCount;
};

function renderFormsImport(container) {
    container.innerHTML = `
        <div style="max-width:800px; margin:0 auto;">
            <div class="alert alert-info" style="margin-bottom:24px;">
                <h4 style="margin-bottom:8px;">การนำเข้าข้อมูลแบบฟอร์ม</h4>
                <p style="font-size:0.9rem;">ข้อมูลนีจะใช้แสดงผลในหน้านักศึกษา เมื่อเปิดเมนู "ยื่นคำร้องออนไลน์"</p>
                <ul style="font-size:0.9rem; margin-left:20px; color:var(--info-color-dark); margin-top:8px;">
                    <li><strong>id</strong>: รหัสเอกสาร (เช่น PI-GSR-01)</li>
                    <li><strong>name</strong>: ชื่อเรียกแบบเต็ม</li>
                    <li><strong>type</strong>: ประเภท (general, thesis, exam, leave)</li>
                </ul>
            </div>

            <div id="dropZoneForms" style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 48px; text-align: center; cursor: pointer; transition: all 0.2s;" 
                 onclick="window.handleGenericCSVImport(window.previewFormsImport)">
                <div style="font-size:3rem; margin-bottom:16px;">📁</div>
                <h3 style="margin-bottom:8px;">คลิกเพื่อเลือกไฟล์ CSV</h3>
                <p style="color:var(--text-muted);">นำเข้าชุดรายชื่อแบบฟอร์มคำร้อง (UTF-8)</p>
            </div>

            <div id="formsImportPreview" style="margin-top:32px; display:none;">
                <h3 style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
                    ตรวจสอบข้อมูลตัวอย่าง
                    <button class="btn btn-primary" onclick="window.submitFormsImport()">
                        ยืนยันการนำเข้า (<span id="previewFormsCount">0</span> รายการ)
                    </button>
                </h3>
                <div class="table-container" style="max-height:400px;">
                    <table class="table" id="previewFormsTable">
                        <thead>
                            <tr id="previewFormsHeaders"></tr>
                        </thead>
                        <tbody id="previewFormsBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

let pendingFormsData = null;

window.previewFormsImport = function(data, headers) {
    pendingFormsData = data;
    const previewArea = document.getElementById('formsImportPreview');
    const headersRow = document.getElementById('previewFormsHeaders');
    const body = document.getElementById('previewFormsBody');
    const countLabel = document.getElementById('previewFormsCount');

    headersRow.innerHTML = headers.map(h => `<th>${h}</th>`).join('');
    body.innerHTML = data.slice(0, 10).map(row => `
        <tr>
            ${headers.map(h => `<td>${row[h] || '-'}</td>`).join('')}
        </tr>
    `).join('') + (data.length > 10 ? `<tr><td colspan="${headers.length}" style="text-align:center; color:var(--text-muted);">... และอีก ${data.length - 10} รายการ ...</td></tr>` : '');

    countLabel.textContent = data.length;
    previewArea.style.display = 'block';
    previewArea.scrollIntoView({ behavior: 'smooth' });
};

window.submitFormsImport = async function() {
    if (!pendingFormsData) return;

    if (!confirm(`ยืนยันการนำเข้าข้อมูลแบบฟอร์มจำนวน ${pendingFormsData.length} รายการ?\n(ข้อมูลเดิมในระบบจะถูกแทนที่ทั้งหมด)`)) return;

    try {
        showApiLoading('กำลังบันทึกข้อมูลแบบฟอร์ม...');
        const result = await postData('importDocumentTemplates', {
            templates: pendingFormsData,
            clearExisting: true
        });

        if (result.status === 'success') {
            alert('นำเข้าข้อมูลแบบฟอร์มสำเร็จ!');
            window.location.reload();
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        alert('เกิดข้อผิดพลาด: ' + err.message);
    } finally {
        hideApiLoading();
    }
};

window.downloadFormsTemplate = function() {
    const headers = ['id', 'name', 'type'];
    const sample = ['PI-GSR-01', 'PI-GSR-01 คำร้องทั่วไป', 'general'];
    window.downloadCSVTemplate('form_templates_template.csv', headers, sample);
};

window.init_manage_forms = function() {
    window.switchFormsTab('list');
};
