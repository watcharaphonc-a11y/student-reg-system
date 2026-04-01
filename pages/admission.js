// ============================
// Admission Management Page (Admin Only)
// ============================
pages['admission'] = function() {
    const applicants = MOCK.applicants || [];
    const stats = {
        total: applicants.length,
        pending: applicants.filter(a => a.Status === 'Pending').length,
        accepted: applicants.filter(a => a.Status === 'Accepted').length,
        enrolled: applicants.filter(a => a.Status === 'Enrolled').length
    };

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px;">
            <div>
                <h1 class="page-title">จัดการการรับสมัคร</h1>
                <p class="page-subtitle">ตรวจสอบและอนุมัติรายชื่อผู้สมัครเรียนระดับบัณฑิตศึกษา</p>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" onclick="bootApp()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    รีเฟรชข้อมูล
                </button>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
            <div class="card"><div class="card-body"><div style="font-size:0.8rem; color:var(--text-muted);">ผู้สมัครทั้งหมด</div><div style="font-size:1.8rem; font-weight:800; color:var(--accent-primary);">${stats.total}</div></div></div>
            <div class="card"><div class="card-body"><div style="font-size:0.8rem; color:var(--text-muted);">รอตรวจสอบ</div><div style="font-size:1.8rem; font-weight:800; color:var(--warning);">${stats.pending}</div></div></div>
            <div class="card"><div class="card-body"><div style="font-size:0.8rem; color:var(--text-muted);">ต้องสัมภาษณ์</div><div style="font-size:1.8rem; font-weight:800; color:#8b5cf6;">${applicants.filter(a => a.Status === 'Interview').length}</div></div></div>
            <div class="card"><div class="card-body"><div style="font-size:0.8rem; color:var(--text-muted);">รับเข้าศึกษา</div><div style="font-size:1.8rem; font-weight:800; color:var(--success);">${stats.accepted}</div></div></div>
        </div>

        <div class="card">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">รายชื่อผู้สมัครล่าสุด</h3>
                <select id="statusFilter" class="form-select" style="min-width:150px;" onchange="filterApplicants(this.value)">
                    <option value="ALL">ทุกสถานะ</option>
                    <option value="Pending">รอตรวจสอบ (Pending)</option>
                    <option value="Interview">นัดสัมภาษณ์ (Interview)</option>
                    <option value="Accepted">รับเข้าศึกษา (Accepted)</option>
                </select>
            </div>
            <div class="card-body" style="padding:0;">
                <div style="overflow-x:auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>วันที่สมัคร</th>
                                <th>ID</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>สาขาที่สมัคร</th>
                                <th>สถานะ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="applicantsList">
                            ${renderApplicantsList(applicants)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

function renderApplicantsList(data) {
    if (!data.length) return `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">ไม่มีข้อมูลผู้สมัคร</td></tr>`;
    return data.map(app => `
        <tr data-status="${app.Status}">
            <td>${app.Date || '-'}</td>
            <td><code style="font-size:0.8rem;">${app.ApplicationID}</code></td>
            <td>
                <div style="font-weight:600;">${app.Prefix}${app.FirstName} ${app.LastName}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${app.Email}</div>
            </td>
            <td>${app.Major || '-'}</td>
            <td>${getStatusBadge(app.Status)}</td>
            <td style="text-align:right">
                <button class="btn btn-secondary" onclick="viewApplicantDetail('${app.ApplicationID}')">ตรวจสอบ</button>
            </td>
        </tr>`).join('');
}

function getStatusBadge(status) {
    switch(status) {
        case 'Pending': return '<span class="badge info">Pending</span>';
        case 'Interview': return '<span class="badge warning" style="background:#8b5cf6">Interview</span>';
        case 'Accepted': return '<span class="badge success">Accepted</span>';
        case 'Rejected': return '<span class="badge danger">Rejected</span>';
        case 'Enrolled': return '<span class="badge success" style="background:var(--primary-color)">Enrolled</span>';
        default: return `<span class="badge secondary">${status}</span>`;
    }
}

window.viewApplicantDetail = function(appId) {
    const app = MOCK.applicants.find(a => a.ApplicationID === appId);
    if (!app) return;

    const eduHistory = JSON.parse(app.EducationHistory || '[]');
    const workHistory = JSON.parse(app.WorkHistory || '[]');
    const trainHistory = JSON.parse(app.TrainingHistory || '[]');

    const content = `
    <div style="max-height:85vh; overflow-y:auto; padding:15px; font-size:0.9rem;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px; margin-bottom:20px;">
            <div>
                <h4 style="color:var(--accent-primary); border-bottom:2px solid #fee2e2; padding-bottom:5px; margin-bottom:15px;">👤 ข้อมูลส่วนบุคคล</h4>
                <p><strong>ชื่อ-สกุล (TH):</strong> ${app.Prefix}${app.FirstName} ${app.LastName}</p>
                <p><strong>ชื่อ-สกุล (EN):</strong> ${app.FirstNameEn} ${app.LastNameEn}</p>
                <p><strong>เลขบัตรประชาชน:</strong> ${app.IdCard}</p>
                <p><strong>วันเกิด:</strong> ${app.Dob} (อายุ: ${app.Age} ปี)</p>
                <p><strong>ศสนา:</strong> ${app.Religion} | <strong>สัญชาติ:</strong> ${app.Nationality}</p>
                <p><strong>ที่อยู่:</strong> ${app.Address}</p>
                <p><strong>เบอร์โทร:</strong> ${app.Phone} (มือถือ) | ${app.PhoneHome || '-'} (บ้าน)</p>
            </div>
            <div>
                <h4 style="color:var(--accent-primary); border-bottom:2px solid #fee2e2; padding-bottom:5px; margin-bottom:15px;">🎓 ข้อมูลการศึกษา</h4>
                <table class="data-table" style="font-size:0.8rem; margin-top:5px;">
                    <thead><tr><th>ระดับ</th><th>สถาบัน</th><th>วิชาเอก</th><th>GPA</th></tr></thead>
                    <tbody>${eduHistory.map(e => `<tr><td>${e.degree}</td><td>${e.inst}</td><td>${e.major}</td><td>${e.gpa}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        </div>

        <div style="margin-bottom:20px;">
            <h4 style="color:var(--accent-primary); border-bottom:2px solid #fee2e2; padding-bottom:5px; margin-bottom:15px;">💼 ประวัติการทำงานและการฝึกอบรม</h4>
            <p><strong>สถานะปัจจุบัน:</strong> ${app.WorkStatus}</p>
            <p><strong>สถานที่ทำงานปัจจุบัน:</strong> ${app.CurrentWorkplace || '-'}</p>
            <table class="data-table" style="font-size:0.8rem; margin-top:10px;">
                <thead><tr><th>หน่วยงาน</th><th>ตำแหน่ง</th><th>ระยะเวลา</th><th>ปี</th></tr></thead>
                <tbody>${workHistory.map(w => `<tr><td>${w.inst}</td><td>${w.pos}</td><td>${w.dur}</td><td>${w.start}-${w.end}</td></tr>`).join('')}</tbody>
            </table>
        </div>

        <div style="background:#f8fafc; padding:20px; border-radius:12px; margin-top:20px; border:1px solid #e2e8f0;">
            <h4 style="margin-bottom:10px;">💡 ความสนใจ/หัวข้อวิทยานิพนธ์ที่สนใจ</h4>
            <div style="white-space:pre-wrap; line-height:1.6; color:#334155;">${app.ResearchTopic || 'ไม่ได้ระบุ'}</div>
        </div>

        <div style="margin-top:25px; display:flex; gap:10px; flex-wrap:wrap; padding-top:20px; border-top:1px solid #e2e8f0;">
            <div style="width:100%; margin-bottom:10px;">
                <h5 style="margin-bottom:10px; color:var(--text-muted);">📂 เอกสารหลักฐานที่แนบมา:</h5>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    ${renderDocumentLinks(app.DocumentsLink)}
                </div>
            </div>
            <div style="flex:1;"></div>
            ${app.Status !== 'Enrolled' ? `
                <button class="btn btn-secondary" onclick="updateAppStatus('${appId}', 'Interview')">นัดสัมภาษณ์</button>
                <button class="btn success" style="background:var(--success); color:white;" onclick="updateAppStatus('${appId}', 'Accepted')">รับเข้าศึกษา</button>
                <button class="btn danger" style="background:#ef4444; color:white;" onclick="updateAppStatus('${appId}', 'Rejected')">ไม่ผ่านคัดเลือก</button>
            ` : ''}
            ${app.Status === 'Accepted' ? `<button class="btn btn-primary" onclick="openEnrollModal('${appId}')">ลงทะเบียนเป็นนักศึกษา</button>` : ''}
        </div>
    </div>
    `;
    openModal('ตรวจสอบรายละเอียดผู้สมัคร', content);
};

function renderDocumentLinks(linkStr) {
    if (!linkStr) return '<span style="color:var(--text-muted); font-size:0.8rem;">ไม่พบเอกสารแนบ</span>';
    
    try {
        const docMap = JSON.parse(linkStr);
        if (typeof docMap === 'object' && docMap !== null) {
            let html = '';
            
            // Render Folder Link first
            if (docMap['_folder']) {
                html += `
                    <a href="${docMap['_folder']}" target="_blank" class="btn btn-secondary btn-sm" style="background:#fff7ed; border-color:#fdba74; color:#9a3412;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        เปิดโฟลเดอร์เก็บเอกสาร (Google Drive)
                    </a>
                `;
            }

            // Render individual files
            html += Object.entries(docMap).map(([type, url]) => {
                if (type === '_folder') return ''; // Skip folder key here
                return `
                    <a href="${url}" target="_blank" class="btn btn-secondary btn-sm" title="${type}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        ${type}
                    </a>
                `;
            }).join('');
            
            return html;
        }
    } catch (e) {
        if (linkStr.startsWith('http')) {
            return `<a href="${linkStr}" target="_blank" class="btn btn-secondary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                เปิดลิงก์โฟลเดอร์เอกสาร
            </a>`;
        }
    }
    return '<span style="color:var(--text-muted); font-size:0.8rem;">ไม่พบลิงก์เอกสาร</span>';
}
