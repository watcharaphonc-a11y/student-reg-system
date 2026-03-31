// ============================
// Thesis Topic Reporting Page
// ============================

pages['thesis-topic'] = function() {
    const role = window.currentUserRole;
    
    if (role === 'student') {
        return renderStudentThesisTopic();
    } else {
        return renderAdminThesisTopic();
    }
};

function renderStudentThesisTopic() {
    const st = MOCK.student;
    if (!st) return `<div class="card"><div class="card-body">ไม่พบข้อมูลนักศึกษา</div></div>`;

    const history = (MOCK.thesisTopicHistory || []).filter(h => h.studentId === st.studentId);
    
    let historyRows = (history.length === 0) 
        ? '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-secondary);">ยังไม่มีประวัติการแจ้งเปลี่ยนหัวข้อ</td></tr>'
        : history.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map((h, idx) => `
            <tr>
                <td>${history.length - idx}</td>
                <td>
                    <div style="font-weight:600;">${h.titleTh}</div>
                    <div style="font-size:0.85rem; color:var(--text-secondary);">${h.titleEn}</div>
                </td>
                <td><span class="status-badge status-active">แจ้งเปลี่ยน</span></td>
                <td>${formatThaiDateTime(h.timestamp)}</td>
            </tr>
        `).join('');

    return `
        <div class="animate-in">
            <div class="page-header">
                <h1 class="page-title">แจ้งหัวข้อวิทยานิพนธ์</h1>
                <p class="page-subtitle">นักศึกษาสามารถแจ้งหรือขอเปลี่ยนหัวข้อวิทยานิพนธ์ได้ที่นี่ ระบบจะเก็บประวัติการเปลี่ยนแปลงทั้งหมด</p>
            </div>

            <div class="grid-1">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">แบบฟอร์มแจ้งหัวข้อปัจจุบัน</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="form-label">ชื่อหัวข้อ (ภาษาไทย)</label>
                            <textarea id="topic-th" class="form-control" rows="3" placeholder="ระบุชื่อหัวข้อวิทยานิพนธ์ภาษาไทย">${st.thesisInfo?.title || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">ชื่อหัวข้อ (ภาษาอังกฤษ)</label>
                            <textarea id="topic-en" class="form-control" rows="3" placeholder="Specify Thesis Title in English">${st.thesisInfo?.titleEn || ''}</textarea>
                        </div>
                        <div style="margin-top:20px; display:flex; justify-content:flex-end;">
                            <button class="btn btn-primary" onclick="saveThesisTopic()">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                ยืนยันการแจ้ง/เปลี่ยนหัวข้อ
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">ประวัติการแจ้งเปลี่ยนหัวข้อ</h3>
                    </div>
                    <div class="card-body" style="padding:0;">
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th style="width:80px">ลำดับ</th>
                                        <th>หัวข้อที่แจ้ง</th>
                                        <th style="width:120px">สถานะ</th>
                                        <th style="width:200px">วันที่-เวลาที่แจ้ง</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${historyRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAdminThesisTopic() {
    const history = MOCK.thesisTopicHistory || [];
    
    let historyRows = (history.length === 0)
        ? '<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-secondary);">ยังไม่มีประวัติการแจ้งเปลี่ยนหัวข้อจากนักศึกษา</td></tr>'
        : history.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map((h, idx) => {
            const student = MOCK.students.find(s => s.studentId === h.studentId);
            return `
                <tr>
                    <td>${formatThaiDateTime(h.timestamp)}</td>
                    <td>
                        <div style="font-weight:600;">${student ? student.firstName + ' ' + student.lastName : h.studentId}</div>
                        <div style="font-size:0.8rem; color:var(--text-secondary);">${h.studentId}</div>
                    </td>
                    <td>
                        <div style="font-weight:500;">${h.titleTh}</div>
                        <div style="font-size:0.85rem; color:var(--text-secondary);">${h.titleEn}</div>
                    </td>
                    <td><span class="status-badge status-active">แจ้งเปลี่ยน</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewStudentTopicHistory('${h.studentId}')">ดูประวัติ</button>
                    </td>
                </tr>
            `;
        }).join('');

    return `
        <div class="animate-in">
            <div class="page-header">
                <h1 class="page-title">ประวัติการแจ้งหัวข้อวิทยานิพนธ์</h1>
                <p class="page-subtitle">ตรวจสอบและติดตามการเปลี่ยนแปลงหัวข้อวิทยานิพนธ์ของนักศึกษาทุกคน</p>
            </div>

            <div class="card">
                <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 class="card-title">รายการแจ้งเปลี่ยนหัวข้อวิจัยล่าสุด</h3>
                    <div class="search-box" style="width:300px;">
                        <input type="text" class="form-control" placeholder="ค้นหารหัสนักศึกษา หรือชื่อ..." onkeyup="filterThesisTopicTable(this.value)">
                    </div>
                </div>
                <div class="card-body" style="padding:0;">
                    <div class="table-container">
                        <table class="data-table" id="admin-topic-table">
                            <thead>
                                <tr>
                                    <th style="width:180px">วันที่-เวลา</th>
                                    <th style="width:200px">นักศึกษา</th>
                                    <th>หัวข้อที่แจ้งเปลี่ยน</th>
                                    <th style="width:120px">สถานะ</th>
                                    <th style="width:100px">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${historyRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Logic functions
window.saveThesisTopic = function() {
    const titleTh = document.getElementById('topic-th').value.trim();
    const titleEn = document.getElementById('topic-en').value.trim();
    
    if (!titleTh || !titleEn) {
        showToast('กรุณากรอกหัวข้อทั้งภาษาไทยและภาษาอังกฤษ', 'error');
        return;
    }

    const st = MOCK.student;
    const newEntry = {
        studentId: st.studentId,
        titleTh: titleTh,
        titleEn: titleEn,
        timestamp: new Date().toISOString()
    };

    // Update global history
    MOCK.thesisTopicHistory.push(newEntry);
    
    // Update current student thesisInfo
    if (!st.thesisInfo) st.thesisInfo = {};
    st.thesisInfo.title = titleTh;
    st.thesisInfo.titleEn = titleEn;

    showToast('แจ้งเปลี่ยนหัวข้อเรียบร้อยแล้ว', 'success');
    renderPage();
};

window.filterThesisTopicTable = function(val) {
    const q = val.toLowerCase();
    const rows = document.querySelectorAll('#admin-topic-table tbody tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
    });
};

window.viewStudentTopicHistory = function(studentId) {
    const student = MOCK.students.find(s => s.studentId === studentId);
    if (!student) return;
    
    const history = (MOCK.thesisTopicHistory || []).filter(h => h.studentId === studentId);
    let historyHtml = history.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map((h, idx) => `
        <div style="padding:15px; border-bottom:1px solid var(--border-color); ${idx === 0 ? 'background:#f0f9ff;' : ''}">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span class="status-badge ${idx === 0 ? 'status-active' : 'status-pending'}">${idx === 0 ? 'หัวข้อล่าสุด' : 'หัวข้อเดิม'}</span>
                <span style="font-size:0.85rem; color:var(--text-secondary);">${formatThaiDateTime(h.timestamp)}</span>
            </div>
            <div style="font-weight:600; margin-bottom:4px;">${h.titleTh}</div>
            <div style="font-size:0.9rem; color:var(--text-secondary); font-style:italic;">${h.titleEn}</div>
        </div>
    `).join('');

    const modalHtml = `
        <div style="max-height:400px; overflow-y:auto;">
            ${historyHtml || '<p style="text-align:center; color:var(--text-secondary); padding:20px;">ไม่พบประวัติหัวข้อ</p>'}
        </div>
    `;

    openModal(`ประวัติหัวข้อวิทยานิพนธ์: ${student.firstName} ${student.lastName}`, modalHtml);
};

// Helper: Format DateTime to Thai
function formatThaiDateTime(isoString) {
    if (!isoString) return '-';
    try {
        const d = new Date(isoString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        let year = d.getFullYear();
        if (year < 2400) year += 543;
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${mins} น.`;
    } catch (e) {
        return isoString;
    }
}
