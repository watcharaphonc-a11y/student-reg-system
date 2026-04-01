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
                <p class="page-subtitle">ตรวจสอบและอนุมัติรายชื่อผู้สมัครเรียน</p>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" onclick="bootApp()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    รีเฟรชข้อมูล
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
            <div class="card">
                <div class="card-body">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">ผู้สมัครทั้งหมด</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-primary);">${stats.total}</div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">รอตรวจสอบ</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--warning);">${stats.pending}</div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">ผ่านการคัดเลือก</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--success);">${stats.accepted}</div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">ลงทะเบียนแล้ว</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary-color);">${stats.enrolled}</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">รายชื่อผู้สมัคร</h3>
                <div style="display:flex; gap:10px;">
                    <select id="statusFilter" class="form-select" style="min-width:150px; margin-bottom:0;" onchange="filterApplicants(this.value)">
                        <option value="ALL">ทุกสถานะ</option>
                        <option value="Pending">Pending (รอตรวจสอบ)</option>
                        <option value="Reviewing">Reviewing (กำลังตรวจ)</option>
                        <option value="Interview">Interview (สัมภาษณ์)</option>
                        <option value="Accepted">Accepted (ผ่าน)</option>
                        <option value="Rejected">Rejected (ไม่ผ่าน)</option>
                        <option value="Enrolled">Enrolled (เข้าศึกษาแล้ว)</option>
                    </select>
                </div>
            </div>
            <div class="card-body" style="padding:0;">
                <div style="overflow-x:auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>วันที่สมัคร</th>
                                <th>ID</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>หลักสูตร/สาขา</th>
                                <th>สถานะ</th>
                                <th style="text-align:right">ดำเนินการ</th>
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
    if (data.length === 0) {
        return `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">ไม่มีข้อมูลผู้สมัคร</td></tr>`;
    }

    return data.map(app => {
        let statusBadge = '';
        switch(app.Status) {
            case 'Pending':   statusBadge = '<span class="badge info">Pending</span>'; break;
            case 'Reviewing': statusBadge = '<span class="badge warning">Reviewing</span>'; break;
            case 'Interview': statusBadge = '<span class="badge warning" style="background:#8b5cf6">Interview</span>'; break;
            case 'Accepted':  statusBadge = '<span class="badge success">Accepted</span>'; break;
            case 'Rejected':  statusBadge = '<span class="badge danger">Rejected</span>'; break;
            case 'Enrolled':  statusBadge = '<span class="badge success" style="background:var(--primary-color)">Enrolled</span>'; break;
            default:          statusBadge = `<span class="badge secondary">${app.Status}</span>`;
        }

        return `
        <tr class="animate-in" data-status="${app.Status}">
            <td>${app.Date || '-'}</td>
            <td><code style="font-size:0.8rem;">${app.ApplicationID}</code></td>
            <td>
                <div style="font-weight:600;">${app.Prefix}${app.FirstName} ${app.LastName}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${app.Email}</div>
            </td>
            <td>
                <div style="font-size:0.85rem;">${app.Program || '-'}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${app.Major || '-'}</div>
            </td>
            <td>${statusBadge}</td>
            <td style="text-align:right">
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.75rem" onclick="viewApplicantDetail('${app.ApplicationID}')">ดูรายละเอียด</button>
            </td>
        </tr>
        `;
    }).join('');
}

window.filterApplicants = function(status) {
    const rows = document.querySelectorAll('#applicantsList tr');
    rows.forEach(row => {
        if (status === 'ALL' || row.dataset.status === status) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
};

window.viewApplicantDetail = function(appId) {
    const app = MOCK.applicants.find(a => a.ApplicationID === appId);
    if (!app) return;

    let actionButtons = '';
    if (app.Status !== 'Enrolled') {
        actionButtons = `
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:20px; padding-top:15px; border-top:1px solid var(--border-color);">
                <button class="btn btn-secondary" onclick="updateAppStatus('${appId}', 'Reviewing')">กำลังตรวจ (Reviewing)</button>
                <button class="btn btn-secondary" onclick="updateAppStatus('${appId}', 'Interview')">นัดสัมภาษณ์ (Interview)</button>
                <button class="btn success" style="background:var(--success); color:white; border:none;" onclick="updateAppStatus('${appId}', 'Accepted')">รับเข้าศึกษา (Accepted)</button>
                <button class="btn danger" style="background:var(--danger); color:white; border:none;" onclick="updateAppStatus('${appId}', 'Rejected')">ปฏิเสธ (Rejected)</button>
                ${app.Status === 'Accepted' ? `<button class="btn btn-primary" style="flex:1; margin-left:auto;" onclick="openEnrollModal('${appId}')">ลงทะเบียนเป็นนักศึกษาใหม่</button>` : ''}
            </div>
        `;
    } else {
        actionButtons = `
            <div style="margin-top:20px; padding:15px; background:var(--bg-secondary); border-radius:var(--radius-md); text-align:center; color:var(--success);">
                ✅ ลงทะเบียนเป็นนักศึกษาเรียบร้อยแล้ว
            </div>
        `;
    }

    const content = `
    <div style="max-height:80vh; overflow-y:auto; padding-right:5px;">
        <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:20px;">
            <div>
                <h4 style="font-size:0.9rem; color:var(--accent-primary); margin-bottom:10px;">ข้อมูลพื้นฐาน</h4>
                <div class="transcript-info">
                    <div class="transcript-info-item"><span class="label">ชื่อ (TH):</span><span>${app.Prefix}${app.FirstName} ${app.LastName}</span></div>
                    <div class="transcript-info-item"><span class="label">ชื่อ (EN):</span><span>${app.FirstNameEn} ${app.LastNameEn}</span></div>
                    <div class="transcript-info-item"><span class="label">เลขบัตรฯ:</span><span>${app.IdCard}</span></div>
                    <div class="transcript-info-item"><span class="label">ID:</span><span>${app.ApplicationID}</span></div>
                    <div class="transcript-info-item"><span class="label">วันที่สมัคร:</span><span>${app.Date}</span></div>
                    <div class="transcript-info-item"><span class="label">สถานะ:</span><span>${app.Status}</span></div>
                </div>
                
                <h4 style="font-size:0.9rem; color:var(--accent-primary); margin-top:15px; margin-bottom:10px;">การติดต่อ</h4>
                <div class="transcript-info">
                    <div class="transcript-info-item"><span class="label">อีเมล:</span><span>${app.Email}</span></div>
                    <div class="transcript-info-item"><span class="label">เบอร์โทร:</span><span>${app.Phone}</span></div>
                    <div class="transcript-info-item"><span class="label">ที่อยู่:</span><span>${app.Address || '-'}</span></div>
                </div>
            </div>
            <div>
                <h4 style="font-size:0.9rem; color:var(--accent-primary); margin-bottom:10px;">ข้อมูลการศึกษาและงาน</h4>
                <div class="transcript-info">
                    <div class="transcript-info-item"><span class="label">หลักสูตรที่สมัคร:</span><span>${app.Program}</span></div>
                    <div class="transcript-info-item"><span class="label">สาขาที่สมัคร:</span><span>${app.Major}</span></div>
                    <div class="transcript-info-item"><span class="label">จบจาก:</span><span>${app.PrevSchool}</span></div>
                    <div class="transcript-info-item"><span class="label">สาขาเดิม:</span><span>${app.PrevMajor}</span></div>
                    <div class="transcript-info-item"><span class="label">เกรดเฉลี่ย:</span><span>${app.PrevGPA}</span></div>
                    <div class="transcript-info-item"><span class="label">ประสบการณ์:</span><span>${app.WorkExperience || '-'}</span></div>
                    <div class="transcript-info-item"><span class="label">แหล่งทุน:</span><span>${app.FundingType}</span></div>
                </div>

                <div style="margin-top:15px; padding:15px; background:var(--bg-secondary); border-radius:var(--radius-md);">
                    <h5 style="margin-bottom:8px">เอกสารแนบ</h5>
                    ${app.DocumentsLink ? `<a href="${app.DocumentsLink}" target="_blank" class="btn btn-secondary" style="width:100%; display:inline-block; text-align:center;">📁 เปิดโฟลเดอร์เอกสาร</a>` : '<div style="color:var(--text-muted); font-size:0.85rem;">ไม่มีเอกสารแนบ</div>'}
                </div>
            </div>
        </div>
        ${actionButtons}
    </div>
    `;

    openModal('รายละเอียดผู้สมัคร', content);
};

window.updateAppStatus = async function(id, status) {
    if (!confirm(`ยืนยันการเปลี่ยนสถานะผู้สมัครเป็น ${status}?`)) return;
    
    showApiLoading('กำลังบันทึกสถานะ...');
    const res = await postData('updateApplicantStatus', { id, status });
    hideApiLoading();

    if (res.status === 'success') {
        closeModal();
        bootApp(); // Refresh data
    } else {
        alert('เกิดข้อผิดพลาด: ' + res.message);
    }
};

window.openEnrollModal = function(appId) {
    const app = MOCK.applicants.find(a => a.ApplicationID === appId);
    const nextId = '68' + Math.floor(Math.random() * 10000000).toString().padStart(8, '0');
    
    const content = `
    <div style="padding:10px;">
        <p style="margin-bottom:15px;">กรุณาระบุรหัสนักศึกษาและรหัสผ่านเริ่มต้นสำหรับนักศึกษาใหม่</p>
        <div class="form-group">
            <label class="form-label">รหัสนักศึกษา</label>
            <input type="text" id="enroll_studentId" class="form-input" value="${nextId}">
        </div>
        <div class="form-group">
            <label class="form-label">รหัสผ่านเริ่มต้น</label>
            <input type="text" id="enroll_password" class="form-input" value="123456">
        </div>
        <div style="margin-top:20px; display:flex; gap:10px;">
            <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">ยกเลิก</button>
            <button class="btn btn-primary" style="flex:1" onclick="submitEnroll('${appId}')">ยืนยันการลงทะเบียน</button>
        </div>
    </div>
    `;
    openModal('ลงทะเบียนนักศึกษาใหม่', content);
};

window.submitEnroll = async function(id) {
    const studentId = document.getElementById('enroll_studentId').value;
    const password = document.getElementById('enroll_password').value;

    if (!studentId) { alert('กรุณาระบุรหัสนักศึกษา'); return; }

    showApiLoading('กำลังสร้างข้อมูลนักศึกษาใหม่...');
    const res = await postData('enrollApplicant', { id, studentId, password });
    hideApiLoading();

    if (res.status === 'success') {
        openModal('ลงทะเบียนสำเร็จ!', `
            <div style="text-align:center; padding:20px;">
                <div style="font-size:3rem; margin-bottom:15px;">🎊</div>
                <h3>ลงทะเบียนสำเร็จ!</h3>
                <p>นักศึกษาคนใหม่: <strong>${studentId}</strong></p>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-top:5px;">ข้อมูลถูกสร้างในสารบบนักศึกษาและผู้ใช้งานเรียบร้อยแล้ว</p>
                <button class="btn btn-primary" style="margin-top:20px; width:100%;" onclick="closeModal(); bootApp();">ตกลง</button>
            </div>
        `);
    } else {
        alert('เกิดข้อผิดพลาด: ' + res.message);
    }
};
