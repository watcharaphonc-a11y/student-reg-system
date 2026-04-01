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
        case 'Interview': return '<span class="badge interview">Interview</span>';
        case 'Accepted': return '<span class="badge success">Accepted</span>';
        case 'Rejected': return '<span class="badge danger">Rejected</span>';
        case 'Enrolled': return '<span class="badge enrolled">Enrolled</span>';
        default: return `<span class="badge secondary">${status}</span>`;
    }
}

window.viewApplicantDetail = function(appId) {
    const app = (MOCK.applicants || []).find(a => String(a.ApplicationID) === String(appId));
    if (!app) return;

    let eduHistory = [];
    let workHistory = [];
    try { eduHistory = JSON.parse(app.EducationHistory || '[]'); } catch(e) { eduHistory = []; }
    try { workHistory = JSON.parse(app.WorkHistory || '[]'); } catch(e) { workHistory = []; }

    const content = `
    <div style="max-height:85vh; overflow-y:auto; padding:25px; font-size:0.95rem; color:var(--text-primary);">
        <!-- Personal & Education Grid -->
        <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:40px; margin-bottom:30px;">
            <!-- Column 1: Personal Info -->
            <div>
                <div style="display:flex; align-items:center; gap:10px; color:#9d174d; border-bottom:1px solid #fecdd3; padding-bottom:8px; margin-bottom:20px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <h3 style="font-weight:700; font-size:1.1rem; margin:0;">ข้อมูลส่วนบุคคล</h3>
                </div>
                <div style="display:grid; gap:12px;">
                    <div><span style="font-weight:700; color:var(--text-primary);">ชื่อ-สกุล (TH):</span> <span style="margin-left:5px;">${app.Prefix || ''}${app.FirstName || ''} ${app.LastName || ''}</span></div>
                    <div><span style="font-weight:700; color:var(--text-primary);">ชื่อ-สกุล (EN):</span> <span style="margin-left:5px;">${app.FirstNameEn || ''} ${app.LastNameEn || ''}</span></div>
                    <div><span style="font-weight:700; color:var(--text-primary);">เลขบัตรประชาชน:</span> <span style="margin-left:5px;">${app.IdCard || '-'}</span></div>
                    <div><span style="font-weight:700; color:var(--text-primary);">วันเกิด:</span> <span style="margin-left:5px;">${app.Dob || '-'} (อายุ: ${app.Age || '-'} ปี)</span></div>
                    <div><span style="font-weight:700; color:var(--text-primary);">ศาสนา:</span> <span style="margin-left:5px;">${app.Religion || '-'}</span> | <span style="font-weight:700; color:var(--text-primary);">สัญชาติ:</span> <span style="margin-left:5px;">${app.Nationality || '-'}</span></div>
                    <div><span style="font-weight:700; color:var(--text-primary);">ที่อยู่:</span> <span style="margin-left:5px; line-height:1.4;">${app.Address || '-'}</span></div>
                    <div><span style="font-weight:700; color:var(--text-primary);">เบอร์โทร:</span> <span style="margin-left:5px;">${app.Phone || '-'} (มือถือ) | ${app.PhoneHome || '-'} (บ้าน)</span></div>
                </div>
            </div>

            <!-- Column 2: Education Info -->
            <div>
                <div style="display:flex; align-items:center; gap:10px; color:#9d174d; border-bottom:1px solid #fecdd3; padding-bottom:8px; margin-bottom:20px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    <h3 style="font-weight:700; font-size:1.1rem; margin:0;">ข้อมูลการศึกษา</h3>
                </div>
                <div class="table-wrapper" style="border:1px solid #f1f5f9; border-radius:8px; overflow:hidden;">
                    <table class="data-table" style="font-size:0.85rem;">
                        <thead style="background:#f8fafc;">
                            <tr><th style="padding:10px;">ระดับ</th><th style="padding:10px;">สถาบัน</th><th style="padding:10px;">วิชาเอก</th><th style="padding:10px; text-align:center;">GPA</th></tr>
                        </thead>
                        <tbody>
                            ${eduHistory.length > 0 ? eduHistory.map(e => `
                                <tr>
                                    <td style="padding:10px; font-weight:600;">${e.degree || '-'}</td>
                                    <td style="padding:10px;">${e.inst || '-'}</td>
                                    <td style="padding:10px;">${e.major || '-'}</td>
                                    <td style="padding:10px; text-align:center; font-weight:700; color:var(--accent-primary);">${e.gpa || '-'}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">ไม่มีข้อมูล</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Work History Section -->
        <div style="margin-bottom:30px;">
            <div style="display:flex; align-items:center; gap:10px; color:#9d174d; border-bottom:1px solid #fecdd3; padding-bottom:8px; margin-bottom:20px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <h3 style="font-weight:700; font-size:1.1rem; margin:0;">ประวัติการทำงานและการฝึกอบรม</h3>
            </div>
            <div style="margin-bottom:15px; display:flex; gap:30px;">
                <div><span style="font-weight:700;">สถานะปัจจุบัน:</span> <span style="margin-left:5px;">${app.WorkStatus || '-'}</span></div>
                <div><span style="font-weight:700;">สถานที่ทำงานปัจจุบัน:</span> <span style="margin-left:5px;">${app.CurrentWorkplace || '-'}</span></div>
            </div>
            <div class="table-wrapper" style="border:1px solid #f1f5f9; border-radius:8px; overflow:hidden;">
                <table class="data-table" style="font-size:0.85rem;">
                    <thead style="background:#f8fafc;">
                        <tr><th style="padding:10px;">หน่วยงาน</th><th style="padding:10px;">ตำแหน่ง</th><th style="padding:10px; text-align:center;">ระยะเวลา</th><th style="padding:10px; text-align:center;">ปี</th></tr>
                    </thead>
                    <tbody>
                        ${workHistory.length > 0 ? workHistory.map(w => `
                            <tr>
                                <td style="padding:10px; font-weight:600;">${w.inst || '-'}</td>
                                <td style="padding:10px;">${w.pos || '-'}</td>
                                <td style="padding:10px; text-align:center;">${w.dur || '-'}</td>
                                <td style="padding:10px; text-align:center;">${w.start || ''}${w.end ? ' - ' + w.end : ''}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">ไม่มีข้อมูล</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Research Topic Box -->
        <div style="background:#f8fafc; padding:24px; border-radius:16px; border:1px solid #e2e8f0; margin-top:10px; position:relative;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; color:#b45309;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/></svg>
                <h4 style="margin:0; font-size:1.05rem; font-weight:700;">ความสนใจ/หัวข้อวิทยานิพนธ์ที่สนใจ</h4>
            </div>
            <div style="white-space:pre-wrap; line-height:1.7; color:#334155; font-size:0.92rem;">${app.ResearchTopic || 'ไม่ได้ระบุ'}</div>
        </div>

        <!-- Documents Section -->
        <div style="margin-top:35px; padding-top:25px; border-top:1px solid #f1f5f9;">
            <div style="margin-bottom:15px;">
                <h5 style="margin-bottom:12px; color:var(--text-muted); font-size:0.85rem; font-weight:700;">📂 เอกสารหลักฐานที่แนบมา:</h5>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    ${renderDocumentLinks(app.DocumentsLink)}
                </div>
            </div>
            
            <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:25px;">
                ${app.Status !== 'Enrolled' ? `
                    <button class="btn btn-secondary" onclick="updateAppStatus('${appId}', 'Interview')">นัดสัมภาษณ์</button>
                    <button class="btn success" style="background:var(--success); color:white; border:none; padding:10px 20px;" onclick="updateAppStatus('${appId}', 'Accepted')">รับเข้าศึกษา</button>
                    <button class="btn danger" style="background:#ef4444; color:white; border:none; padding:10px 20px;" onclick="updateAppStatus('${appId}', 'Rejected')">ไม่ผ่านคัดเลือก</button>
                ` : ''}
                ${app.Status === 'Accepted' ? `<button class="btn btn-primary" onclick="openEnrollModal('${appId}')" style="box-shadow:0 10px 15px -3px rgba(220, 38, 38, 0.25);">ลงทะเบียนเป็นนักศึกษา</button>` : ''}
            </div>
        </div>
    </div>
    `;
    openModal('ตรวจสอบรายละเอียดผู้สมัคร', content);
};


function renderDocumentLinks(linkStr) {
    if (!linkStr || linkStr === '-') return '<span style="color:var(--text-muted); font-size:0.8rem;">ไม่พบเอกสารแนบ</span>';
    
    // 1. Try to parse as JSON first (handles multiple documents mapping)
    try {
        const docMap = JSON.parse(linkStr);
        if (typeof docMap === 'object' && docMap !== null) {
            let html = '';
            
            // Render Folder Link first if exists
            if (docMap['_folder']) {
                const folderUrl = window.getDriveUrl(docMap['_folder'], 'folder');
                html += `
                    <a href="${folderUrl}" target="_blank" class="btn btn-secondary btn-sm" style="background:#fff7ed; border-color:#fdba74; color:#9a3412;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        เปิดโฟลเดอร์เก็บเอกสาร (Google Drive)
                    </a>
                `;
            }

            // Render individual files
            html += Object.entries(docMap).map(([type, urlOrId]) => {
                if (type === '_folder') return ''; // Already handled
                const fileUrl = window.getDriveUrl(urlOrId, 'file');
                return `
                    <a href="${fileUrl}" target="_blank" class="btn btn-secondary btn-sm" title="${type}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        ${type}
                    </a>
                `;
            }).join('');
            
            return html;
        }
    } catch (e) {
        // 2. Not JSON, handle as a single link or ID
        const targetUrl = window.getDriveUrl(linkStr, 'folder');

        if (targetUrl.startsWith('http')) {
            return `
                <a href="${targetUrl}" target="_blank" class="btn btn-secondary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    เปิดลิงก์โฟลเดอร์เอกสาร
                </a>`;
        }
    }
    
    return '<span style="color:var(--text-muted); font-size:0.8rem;">ไม่พบลิงก์เอกสาร</span>';
}
