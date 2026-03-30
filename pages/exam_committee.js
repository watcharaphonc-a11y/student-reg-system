// ============================
// Examination Committee Page
// ============================
let examCommitteeRegData = {};

pages['exam-committee'] = function() {
    const rawCommittees = MOCK.examCommittees || [];
    const regMode = window._examCommitteeRegMode || 'view';
    const isAdmin = window.currentUserRole === 'admin' || window.currentUserRole === 'staff';
    
    // If student, filter only their own committee
    let committees = rawCommittees;
    if (window.currentUserRole === 'student' && window.currentUserData) {
        const myId = String(window.currentUserData.username || window.currentUserData.id).trim();
        committees = rawCommittees.filter(c => String(c.studentId).trim() === myId);
    }

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">คณะกรรมการสอบ</h1>
            <p class="page-subtitle">ข้อมูลจัดการคณะกรรมการสอบวิทยานิพนธ์</p>
        </div>

        ${isAdmin ? `
        <!-- Mode Tabs -->
        <div style="display:flex; gap:0; margin-bottom:20px; border-bottom:2px solid var(--border-color);">
            <button class="btn" onclick="switchExamCommitteeRegMode('view')" style="flex:1; padding:12px 20px; border:none; border-bottom:3px solid ${regMode==='view'?'var(--accent-primary)':'transparent'}; background:${regMode==='view'?'var(--bg-secondary)':'transparent'}; color:${regMode==='view'?'var(--accent-primary)':'var(--text-muted)'}; font-weight:${regMode==='view'?'600':'400'}; font-size:0.95rem; cursor:pointer; border-radius:var(--radius-md) var(--radius-md) 0 0; transition:all 0.2s;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:6px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                รายการคณะกรรมการ
            </button>
            <button class="btn" onclick="switchExamCommitteeRegMode('bulk')" style="flex:1; padding:12px 20px; border:none; border-bottom:3px solid ${regMode==='bulk'?'var(--accent-primary)':'transparent'}; background:${regMode==='bulk'?'var(--bg-secondary)':'transparent'}; color:${regMode==='bulk'?'var(--accent-primary)':'var(--text-muted)'}; font-weight:${regMode==='bulk'?'600':'400'}; font-size:0.95rem; cursor:pointer; border-radius:var(--radius-md) var(--radius-md) 0 0; transition:all 0.2s;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                นำเข้าข้อมูล (Bulk Import)
            </button>
        </div>
        ` : ''}

        <!-- View Mode -->
        <div id="committeeViewPanel" style="display:${regMode==='view'?'block':'none'}">
            ${committees.length === 0 ? `
            <div class="card animate-in animate-delay-1">
                <div class="card-body" style="text-align:center; padding:40px;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin-bottom:15px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                    <h3 style="color:var(--text-muted);">ยังไม่ได้แต่งตั้งคณะกรรมการสอบ</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem;">คณะกรรมการสอบจะถูกแต่งตั้งเมื่อวิทยานิพนธ์พร้อมสอบ</p>
                </div>
            </div>` : ''}

            ${committees.map((exam, idx) => `
            <div class="card animate-in animate-delay-${idx+1}" style="margin-bottom:18px;">
                <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 class="card-title">${exam.type}</h3>
                    <div style="display:flex; gap:8px; align-items:center;">
                        <span class="badge ${exam.status === 'approved' ? 'success' : 'neutral'}">${exam.status || 'รอดำเนินการ'}</span>
                        <span style="font-size:0.82rem; color:var(--text-muted);">${exam.date || ''}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="font-size:0.8rem; color:var(--text-muted);">รหัสนักศึกษา:</span>
                            <span style="font-weight:600; font-size:0.9rem; margin-left:4px;">${exam.studentId}</span>
                        </div>
                        <span class="badge neutral" style="font-size:0.75rem;">ExamID: ${exam.id}</span>
                    </div>
                    ${exam.thesisTitle ? `<div style="margin-bottom:16px; padding:12px; background:var(--bg-secondary); border-radius:var(--radius-md); border-left:4px solid var(--accent-primary);">
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">หัวข้อวิทยานิพนธ์</div>
                        <div style="font-weight:500; font-size:0.95rem;">${exam.thesisTitle}</div>
                    </div>` : ''}
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th style="width:50px;">#</th>
                                    <th>ชื่อ-สกุล</th>
                                    <th>ตำแหน่งในคณะกรรมการ</th>
                                    <th>ตำแหน่งวิชาการ</th>
                                    <th>สังกัด</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${exam.members.map((m, i) => `
                                    <tr>
                                        <td style="text-align:center;">${i+1}</td>
                                        <td>
                                            <div style="display:flex; align-items:center; gap:10px;">
                                                <div style="width:32px;height:32px;border-radius:50%;background:${m.role === 'ประธานกรรมการ' ? 'var(--accent-primary)' : 'var(--bg-tertiary)'};display:flex;align-items:center;justify-content:center;color:${m.role === 'ประธานกรรมการ' ? 'white' : 'var(--text-primary)'};font-weight:600;font-size:0.8rem;">${m.name ? m.name[0] : '?'}</div>
                                                <span>${m.name}</span>
                                            </div>
                                        </td>
                                        <td><span class="badge ${m.role === 'ประธานกรรมการ' ? 'success' : m.role === 'กรรมการผู้ทรงคุณวุฒิภายนอก' ? 'warning' : 'neutral'}">${m.role}</span></td>
                                        <td>${m.position}</td>
                                        <td>${m.affiliation}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>

        <!-- Bulk Mode -->
        <div id="committeeBulkPanel" style="display:${regMode==='bulk'?'block':'none'}">
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                <div class="card animate-in animate-delay-1">
                    <div class="card-header"><h3 class="card-title">ขั้นตอนที่ 1: ดาวน์โหลดรูปแบบไฟล์</h3></div>
                    <div class="card-body">
                        <p style="margin-bottom:15px; color:var(--text-muted); font-size:0.9rem;">ใช้ไฟล์ CSV ตามรูปแบบมาตรฐานเพื่อให้ระบบนำเข้าข้อมูลได้ถูกต้อง</p>
                        <button class="btn btn-secondary" onclick="downloadExamCommitteeTemplate()" style="width:100%; justify-content:center;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            ดาวน์โหลด Template CSV
                        </button>
                    </div>
                </div>
                <div class="card animate-in animate-delay-2">
                    <div class="card-header"><h3 class="card-title">ขั้นตอนที่ 2: อัปโหลดไฟล์ข้อมูล</h3></div>
                    <div class="card-body">
                        <input type="file" id="committeeCsvFile" accept=".csv" style="display:none;" onchange="handleExamCommitteeCsvUpload(event)">
                        <div onclick="document.getElementById('committeeCsvFile').click()" style="border:2px dashed var(--border-color); border-radius:var(--radius-md); padding:30px; text-align:center; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--accent-primary)';this.style.background='var(--bg-secondary)'" onmouseout="this.style.borderColor='var(--border-color)';this.style.background='transparent'">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom:10px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <p style="font-weight:500; color:var(--text-primary);">คลิกเพื่อเลือกไฟล์ CSV</p>
                            <p style="font-size:0.8rem; color:var(--text-muted); margin-top:5px;">หรือลากไฟล์มาวางที่นี่</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card animate-in animate-delay-3" id="committeeBulkPreviewCard" style="display:none; margin-bottom:18px;">
                <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 class="card-title">ขั้นตอนที่ 3: ตรวจสอบและนำเข้า</h3>
                    <span class="badge success" id="committeeBulkCountBadge">0 รายการ</span>
                </div>
                <div class="card-body">
                    <div style="overflow-x:auto; max-height:400px; overflow-y:auto;" id="committeeBulkPreviewTable"></div>
                    <div style="display:flex; gap:12px; margin-top:16px; justify-content:flex-end;">
                        <button class="btn btn-secondary" onclick="clearExamCommitteeBulkImport()">ยกเลิก</button>
                        <button class="btn btn-primary" onclick="submitExamCommitteeBulkImport()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>
                            นำเข้าข้อมูลทั้งหมด
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

// ====== Logic Functions ======

window.switchExamCommitteeRegMode = function(mode) {
    window._examCommitteeRegMode = mode;
    renderPage();
};

window.downloadExamCommitteeTemplate = function() {
    const headers = ['ExamID', 'StudentID', 'Role', 'Prefix', 'FirstName', 'LastName', 'Position', 'Affiliation'];
    const sampleRows = [
        ['EX-001', '661001', 'ประธานกรรมการ', 'รศ.ดร.', 'สมชาย', 'สายเสมอ', 'รองศาสตราจารย์', 'คณะพยาบาลศาสตร์'],
        ['EX-001', '661001', 'กรรมการ', 'ผศ.ดร.', 'สมหญิง', 'ชูจิต', 'ผู้ช่วยศาสตราจารย์', 'คณะพยาบาลศาสตร์'],
        ['EX-001', '661001', 'กรรมการผู้ทรงคุณวุฒิภายนอก', 'ดร.', 'มงคล', 'ดีเกื้อ', 'ผู้ทรงคุณวุฒิ', 'โรงพยาบาลศิริราช']
    ];
    let csvContent = "\uFEFF" + headers.join(",") + "\n" + sampleRows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_exam_committee.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.handleExamCommitteeCsvUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').replace('\uFEFF', ''));
        
        const data = rows.slice(1).map(row => {
            const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            let obj = {};
            headers.forEach((h, i) => obj[h] = values[i]);
            return obj;
        });

        examCommitteeRegData = data;
        renderExamCommitteePreview(headers, data);
    };
    reader.readAsText(file);
};

function renderExamCommitteePreview(headers, data) {
    const card = document.getElementById('committeeBulkPreviewCard');
    const badge = document.getElementById('committeeBulkCountBadge');
    const tableDiv = document.getElementById('committeeBulkPreviewTable');

    card.style.display = 'block';
    badge.textContent = data.length + ' รายการ';

    let html = `<table class="data-table"><thead><tr>`;
    headers.forEach(h => html += `<th>${h}</th>`);
    html += `</tr></thead><tbody>`;
    data.forEach(row => {
        html += `<tr>`;
        headers.forEach(h => html += `<td>${row[h] || '-'}</td>`);
        html += `</tr>`;
    });
    html += `</tbody></table>`;
    tableDiv.innerHTML = html;
}

window.clearExamCommitteeBulkImport = function() {
    examCommitteeRegData = {};
    renderPage();
};

window.submitExamCommitteeBulkImport = async function() {
    if (!examCommitteeRegData || examCommitteeRegData.length === 0) return;

    showApiLoading('กำลังนำเข้าข้อมูลคณะกรรมการสอบ...');
    
    // Process rows one by one or in batch if API supports it
    // For now, assume postData handles batching if we pass the array
    try {
        const res = await postData('batchImportExamCommittee', examCommitteeRegData);
        hideApiLoading();

        if (res && res.status === 'success') {
            openModal('สำเร็จ!', `<div style="text-align:center;padding:20px"><div style="font-size:3rem;margin-bottom:12px">🎉</div><h3>นำเข้าข้อมูลสำเร็จ</h3><p>${examCommitteeRegData.length} รายการถูกเพิ่มเข้าสู่ระบบ</p><button class="btn btn-primary" style="margin-top:16px" onclick="closeModal();if(typeof bootApp==='function') bootApp();">กลับสู่หน้าหลัก</button></div>`);
        } else {
            // Mock fallback
            if (!MOCK.examCommitteesData) MOCK.examCommitteesData = [];
            MOCK.examCommitteesData.push(...examCommitteeRegData);
            
            // Re-boot to trigger local mapping if needed
            if (typeof bootApp === 'function') await bootApp();
            
            openModal('สำเร็จ!', `<div style="text-align:center;padding:20px"><div style="font-size:3rem;margin-bottom:12px">🎉</div><h3>นำเข้าข้อมูลสำเร็จ (โหมดจำลอง)</h3><p>${examCommitteeRegData.length} รายการถูกเพิ่มเรียบร้อย</p><button class="btn btn-primary" style="margin-top:16px" onclick="closeModal();">ตกลง</button></div>`);
        }
    } catch (err) {
        hideApiLoading();
        alert('เกิดข้อผิดพลาด: ' + err.message);
    }
};
