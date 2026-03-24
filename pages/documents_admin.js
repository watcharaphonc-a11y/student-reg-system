// ============================
// Admin Documents Approval Page
// ============================
pages['documents-admin'] = function() {
    const docs = MOCK.adminDocuments || [];

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">อนุมัติเอกสาร</h1>
            <p class="page-subtitle">ดาวน์โหลดเอกสารเพื่อลงนาม อัปโหลดเอกสารที่ลงนามแล้ว และส่งต่อตามขั้นตอนอุนมัติ</p>
        </div>

        <div class="card animate-in animate-delay-1">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">รายการเอกสารรออนุมัติ</h3>
                <div class="search-box" style="width: 250px; min-width: unset;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="adminDocQuery" placeholder="ค้นหารหัสนักศึกษา, ชื่อ, นามสกุล, สาขาวิชา..." style="font-size:0.8rem; padding:4px 8px;" onkeyup="searchAdminDocs()">
                </div>
            </div>
            
            <div class="card-body" style="padding: 0;">
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>รหัสเอกสาร / แบบฟอร์ม</th>
                                <th>ข้อมูลนักศึกษา</th>
                                <th>สถานะ / ขั้นตอนปัจจุบัน</th>
                                <th>การดำเนินการ (ดาวน์โหลด/ลงนาม)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${docs.length === 0 ? `<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">ไม่มีเอกสารรออนุมัติ</td></tr>` : ''}
                            ${docs.map(d => {
                                let badgeClass = 'warning';
                                if (d.status.includes('อนุมัติแล้ว')) badgeClass = 'success';
                                else if (d.status.includes('ปฏิเสธ')) badgeClass = 'danger';
                                
                                return `
                                <tr class="admin-doc-row" data-search="${[d.id, d.formName, d.studentName, d.studentId, d.status, (d.major || '')].join(' ').toLowerCase()}">
                                    <td>
                                        <div style="font-weight:600; color:var(--accent-primary)">${d.id}</div>
                                        <div style="font-size:0.85rem; margin-top:4px;">${d.formName}</div>
                                        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">ส่งเมื่อ: ${d.submitDate}</div>
                                    </td>
                                    <td>
                                        <div style="font-weight:600;">${d.studentName}</div>
                                        <div style="font-size:0.85rem; color:var(--text-muted);">รหัส: ${d.studentId}</div>
                                        <div style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">สาขาวิชา: ${d.major || '-'}</div>
                                    </td>
                                    <td>
                                        <span class="badge ${badgeClass}">${d.status}</span>
                                        ${d.nextStep ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:6px;">รอ: ${d.nextStep}</div>` : ''}
                                    </td>
                                    <td>
                                        <div style="display:flex; flex-direction:column; gap:8px;">
                                            <div style="display:flex; gap:8px;">
                                                <button class="btn btn-sm btn-secondary" onclick="previewAdminDoc('${d.id}')" title="พรีวิวตรวจสอบเอกสาร">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                    พรีวิวเอกสาร
                                                </button>
                                                <button class="btn btn-sm btn-primary" onclick="openUploadSignedModal('${d.id}')" title="อัปโหลดไฟล์ที่ลงนามแล้ว">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                                    อัปโหลด
                                                </button>
                                            </div>
                                            <button class="btn btn-sm" style="background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color);" onclick="forwardAdminDoc('${d.id}')">
                                                ส่งต่อ / เปลี่ยนสถานะ
                                            </button>
                                        </div>
                                    </td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

// Global action handlers for admin docs
window.downloadAdminDoc = function(docId) {
    showApiLoading('กำลังดาวน์โหลดเอกสาร...');
    setTimeout(() => {
        hideApiLoading();
        alert('ดาวน์โหลดเอกสารรหัส ' + docId + ' เรียบร้อยแล้ว (จำลอง)');
    }, 600);
};

window.openUploadSignedModal = function(docId) {
    const doc = MOCK.adminDocuments.find(d => d.id === docId);
    if (!doc) return;
    
    const modalHtml = `
        <div style="padding:10px;">
            <p style="margin-bottom:15px;">อัปโหลดไฟล์ที่ได้รับการลงนามแล้วสำหรับเอกสารรหัส <strong>${docId}</strong></p>
            
            <div class="form-group">
                <label class="form-label">เลือกไฟล์เอกสาร (PDF)</label>
                <div style="border: 2px dashed var(--border-color); padding: 25px; text-align: center; border-radius: var(--radius-md); background: var(--bg-tertiary); cursor: pointer;" onclick="document.getElementById('signedFile').click()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom: 8px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="color: var(--text-muted); font-size: 0.85rem;" id="signedFileNameDisplay">คลิกเพื่อเลือกไฟล์ที่ลงนามแล้ว</p>
                    <input type="file" id="signedFile" style="display: none;" onchange="updateSignedFileName(this)">
                </div>
            </div>
            
            <div id="uploadPreviewSection" class="animate-in" style="display:none; margin-top:15px; padding:15px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-md); text-align:center;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" style="margin-bottom:10px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><polyline points="9 15 11 17 15 13"></polyline></svg>
                <div style="font-weight:500; color:var(--text-primary); font-size:0.95rem;">ไฟล์พร้อมสำหรับอัปโหลดเข้าสู่ระบบ</div>
                <div id="uploadFileSize" style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">ขนาดไฟล์: -</div>
            </div>
            
            <button class="btn btn-primary" style="width:100%; margin-top:15px;" onclick="submitSignedDoc('${docId}')">ยืนยันการอัปโหลดเข้าสู่ระบบ</button>
        </div>
    `;
    
    openModal('อัปโหลดเอกสารลงนาม', modalHtml);
};

window.updateSignedFileName = function(input) {
    const display = document.getElementById('signedFileNameDisplay');
    const previewSection = document.getElementById('uploadPreviewSection');
    const sizeDisplay = document.getElementById('uploadFileSize');
    
    if (input.files && input.files.length > 0) {
        display.textContent = input.files[0].name;
        display.style.color = 'var(--text-primary)';
        display.style.fontWeight = '600';
        
        if (previewSection) {
            previewSection.style.display = 'block';
            const sizeInMB = (input.files[0].size / (1024 * 1024)).toFixed(2);
            sizeDisplay.textContent = `เอกสาร PDF ขนาด: ${sizeInMB > 0.00 ? sizeInMB : '0.01'} MB`;
        }
    } else {
        if (previewSection) previewSection.style.display = 'none';
        display.textContent = 'คลิกเพื่อเลือกไฟล์ที่ลงนามแล้ว';
        display.style.color = 'var(--text-muted)';
        display.style.fontWeight = 'normal';
    }
};

window.previewAdminDoc = function(docId) {
    const doc = MOCK.adminDocuments.find(d => d.id === docId);
    if (!doc) return;
    
    showApiLoading('กำลังเปิดเครื่องมือดูเอกสาร...');
    setTimeout(() => {
        hideApiLoading();
        
        const modalHtml = `
            <div style="padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
                    <div>
                        <h3 style="margin:0; color:var(--accent-primary); font-size:1.1rem;">${doc.id}</h3>
                        <div style="font-size:0.9rem; color:var(--text-muted);">${doc.formName}</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="downloadAdminDoc('${doc.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ดาวน์โหลดไฟล์ต้นฉบับ
                    </button>
                </div>
                
                <div class="animate-in" style="background:#f1f5f9; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:20px; text-align:center; min-height:400px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin-bottom:15px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div style="color:var(--text-primary); font-weight:500; font-size:1.1rem; margin-bottom:5px;">Preview รูปแบบจำลองเอกสาร PDF</div>
                    <div style="color:var(--text-muted); font-size:0.9rem;">(ในระบบจริงจะแสดงหน้าตัวอย่างเอกสารอย่างละเอียดในส่วนนี้)</div>
                    
                    <div style="margin-top:20px; padding:15px; background:white; text-align:left; border-radius:var(--radius-sm); border:1px solid #e2e8f0; width:100%; max-width:400px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                        <p style="margin:0 0 8px; font-size:0.9rem; color:var(--text-muted); border-bottom:1px solid var(--border-color); padding-bottom:6px;">สรุปข้อมูลในเอกสาร</p>
                        <p style="margin:0 0 4px; font-size:0.95rem;"><strong>ชื่อนักศึกษา:</strong> ${doc.studentName}</p>
                        <p style="margin:0 0 4px; font-size:0.95rem;"><strong>รหัส:</strong> ${doc.studentId}</p>
                        <p style="margin:0 0 4px; font-size:0.95rem;"><strong>วันที่ส่ง:</strong> ${doc.submitDate}</p>
                    </div>
                </div>
            </div>
        `;
        // Use a slightly larger modal for preview
        openModal('พรีวิวเอกสารคำร้อง', modalHtml, '550px');
    }, 600);
};

window.submitSignedDoc = function(docId) {
    const fileInput = document.getElementById('signedFile');
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('กรุณาเลือกไฟล์ก่อนอัปโหลด');
        return;
    }
    
    showApiLoading('กำลังอัปโหลดและบันทึกข้อมูล...');
    
    setTimeout(() => {
        const doc = MOCK.adminDocuments.find(d => d.id === docId);
        if (doc) {
            doc.attachment = fileInput.files[0].name;
            // Note: In real app, we would update status here too
        }
        
        hideApiLoading();
        closeModal();
        alert('อัปโหลดไฟล์ลงนามสำเร็จ');
        renderPage();
    }, 800);
};

window.forwardAdminDoc = function(docId) {
    const doc = MOCK.adminDocuments.find(d => d.id === docId);
    if (!doc) return;
    
    const steps = [
        'รอเจ้าหน้าที่งานบัณฑิตศึกษาตรวจสอบ',
        'รอประธานหลักสูตรลงนาม',
        'รอคณบดีลงนาม',
        'อนุมัติแล้ว',
        'ไม่อนุมัติ/ถูกปฏิเสธ'
    ];
    
    const nextPersons = [
        'เจ้าหน้าที่งานบัณฑิตศึกษา',
        'ประธานกรรมการบริหารหลักสูตร',
        'คณบดีคณะพยาบาลศาสตร์',
        '-',
        '-'
    ];
    
    let optionsHtml = steps.map((s, idx) => `
        <option value="${idx}" ${doc.status === s ? 'selected' : ''}>${s}</option>
    `).join('');
    
    const modalHtml = `
        <div style="padding:10px;">
            <p style="margin-bottom:15px;">อัปเดตสถานะและส่งต่อเอกสาร <strong>${docId}</strong></p>
            
            <div class="form-group">
                <label class="form-label">สถานะใหม่ / ขัั้นตอนปัจจุบัน</label>
                <select class="form-select" id="newStatusStep">
                    ${optionsHtml}
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">ผู้รับผิดชอบขั้นต่อไป (ถ้ามี)</label>
                <div style="display:flex; gap:10px;">
                    <select class="form-select" id="nextPersonSelect" style="flex:1;">
                        <option value="">-- ระบุผู้รับ --</option>
                        ${nextPersons.map(p => `<option value="${p}" ${doc.nextStep === p ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">ความเห็นเพิ่มเติม / เหตุผล (ถ้าปฏิเสธ)</label>
                <textarea class="form-textarea" id="forwardNote" placeholder="ระบุข้อความถึงขั้นตอนถัดไปหรือแจ้งนักศึกษา..."></textarea>
            </div>
            
            <button class="btn btn-primary" style="width:100%; margin-top:10px;" onclick="submitForwardDoc('${docId}')">บันทึกและส่งต่อ</button>
        </div>
    `;
    
    // Auto sync person with status change for convenience
    setTimeout(() => {
        document.getElementById('newStatusStep')?.addEventListener('change', function(e) {
            const idx = e.target.value;
            const personSelect = document.getElementById('nextPersonSelect');
            if (personSelect && nextPersons[idx]) {
                personSelect.value = nextPersons[idx];
            }
        });
    }, 100);
    
    openModal('ส่งต่อ/เปลี่ยนสถานะเอกสาร', modalHtml);
};

window.submitForwardDoc = function(docId) {
    const select = document.getElementById('newStatusStep');
    const newStatus = select.options[select.selectedIndex].text;
    const nextPerson = document.getElementById('nextPersonSelect').value;
    
    showApiLoading('กำลังบันทึกและส่งต่อ...');
    
    setTimeout(() => {
        const adminDoc = MOCK.adminDocuments.find(d => d.id === docId);
        if (adminDoc) {
            adminDoc.status = newStatus;
            adminDoc.nextStep = nextPerson || null;
        }
        
        // Also update student side if it exists
        const stuDoc = MOCK.studentDocuments.find(d => d.id === docId);
        if (stuDoc) {
            stuDoc.status = newStatus;
            stuDoc.lastUpdate = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        }
        
        hideApiLoading();
        closeModal();
        alert('อัปเดตสถานะเอกสารสำเร็จ');
        renderPage();
    }, 600);
};

window.searchAdminDocs = function() {
    const query = document.getElementById('adminDocQuery').value.toLowerCase();
    const rows = document.querySelectorAll('.admin-doc-row');
    let hasVisibleRows = false;
    
    rows.forEach(row => {
        const searchData = row.getAttribute('data-search') || '';
        if (searchData.includes(query)) {
            row.style.display = '';
            hasVisibleRows = true;
        } else {
            row.style.display = 'none';
        }
    });

    let noResultMsg = document.getElementById('noAdminDocMatch');
    if (hasVisibleRows || rows.length === 0) {
        if (noResultMsg) noResultMsg.style.display = 'none';
    } else {
        if (!noResultMsg) {
            const tbody = document.querySelector('.data-table tbody');
            if (tbody) {
                const tr = document.createElement('tr');
                tr.id = 'noAdminDocMatch';
                tr.innerHTML = '<td colspan="4" style="text-align:center;color:var(--text-muted);padding:20px;">ไม่พบเอกสารที่ค้นหา</td>';
                tbody.appendChild(tr);
            }
        } else {
            noResultMsg.style.display = '';
        }
    }
};
