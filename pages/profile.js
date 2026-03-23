// ============================
// Student Profile Page
// ============================
pages['student-profile'] = function() {
    const st = MOCK.student;
    if (!st) {
        return `
        <div class="animate-in">
            <div class="page-header">
                <h1 class="page-title">ข้อมูลนักศึกษา</h1>
                <p class="page-subtitle">ไม่พบข้อมูลนักศึกษา กรุณาลงทะเบียนก่อน</p>
            </div>
            <div class="card"><div class="card-body" style="text-align:center; padding:40px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin-bottom:15px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <h3 style="color:var(--text-muted);">ยังไม่มีข้อมูลนักศึกษา</h3>
                <p style="color:var(--text-muted); font-size:0.9rem;">กรุณาลงทะเบียนนักศึกษาใหม่ก่อนเข้าใช้งานหน้านี้</p>
            </div></div>
        </div>`;
    }

    // Safe property access with defaults
    const studentId = st.studentId || st.id || '-';
    const prefix = st.prefix || '';
    const firstName = st.firstName || '';
    const lastName = st.lastName || '';
    const firstNameEn = st.firstNameEn || '-';
    const lastNameEn = st.lastNameEn || '-';
    const faculty = st.faculty || '-';
    const department = st.department || '-';
    const program = st.program || '-';
    const year = st.year || '-';
    const status = st.status || 'กำลังศึกษา';
    const admissionYear = st.admissionYear || '-';
    const advisor = st.advisor || '-';
    const email = st.email || '-';
    const phone = st.phone || '-';
    const dob = st.dob || '-';
    const address = st.address || '-';
    const parentName = st.parentName || '-';
    const parentPhone = st.parentPhone || '-';
    const gpa = typeof st.gpa === 'number' ? st.gpa : 0;
    const totalCredits = typeof st.totalCredits === 'number' ? st.totalCredits : 0;
    const requiredCredits = typeof st.requiredCredits === 'number' ? st.requiredCredits : 1;
    const creditPercent = Math.round((totalCredits / requiredCredits) * 100);
    const initial = firstName ? firstName[0] : '?';

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
                <h1 class="page-title">ข้อมูลนักศึกษา</h1>
                <p class="page-subtitle">ข้อมูลส่วนตัวและข้อมูลการศึกษา</p>
            </div>
            ${(window.currentUserRole === 'student') ? `
            <div style="display:flex; gap:10px;">
                <button class="btn btn-primary" onclick="openEditStudentProfile()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    แก้ไขข้อมูล
                </button>
            </div>
            ` : ''}
            ${(window.currentUserRole === 'staff' || window.currentUserRole === 'admin') ? `
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" onclick="exportProfileTemplate()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Template
                </button>
                <button class="btn btn-primary" onclick="importProfile()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    นำเข้าข้อมูล
                </button>
            </div>
            ` : ''}
        </div>
        <div class="profile-header animate-in animate-delay-1">
            <div class="profile-avatar-large">${initial}</div>
            <div class="profile-details">
                <h2>${prefix}${firstName} ${lastName}</h2>
                <div class="student-id">รหัสนักศึกษา: ${studentId}</div>
                <div class="profile-meta">
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        ${faculty}
                    </div>
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        ${department}
                    </div>
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ชั้นปีที่ ${year}
                    </div>
                    <div class="profile-meta-item">${getStatusBadge(status)}</div>
                </div>
            </div>
        </div>
        <div class="grid-2">
            <div class="card animate-in animate-delay-2">
                <div class="card-header"><h3 class="card-title">ข้อมูลส่วนตัว</h3></div>
                <div class="card-body">
                    <div class="transcript-info">
                        <div class="transcript-info-item"><span class="label">ชื่อ-สกุล (EN):</span><span>${firstNameEn} ${lastNameEn}</span></div>
                        <div class="transcript-info-item"><span class="label">วันเกิด:</span><span>${dob}</span></div>
                        <div class="transcript-info-item"><span class="label">อีเมล:</span><span>${email}</span></div>
                        <div class="transcript-info-item"><span class="label">โทรศัพท์:</span><span>${phone}</span></div>
                        <div class="transcript-info-item"><span class="label">ที่อยู่:</span><span>${address}</span></div>
                        <div class="transcript-info-item"><span class="label">ผู้ปกครอง:</span><span>${parentName}</span></div>
                        <div class="transcript-info-item"><span class="label">เบอร์ผู้ปกครอง:</span><span>${parentPhone}</span></div>
                    </div>
                </div>
            </div>
            <div class="card animate-in animate-delay-3">
                <div class="card-header"><h3 class="card-title">ข้อมูลการศึกษา</h3></div>
                <div class="card-body">
                    <div style="text-align:center;margin-bottom:20px;">
                        <div class="gpa-circle">
                            <div class="gpa-circle-inner">
                                <div class="gpa-value">${gpa.toFixed(2)}</div>
                                <div class="gpa-label">GPA สะสม</div>
                            </div>
                        </div>
                    </div>
                    <div class="transcript-info">
                        <div class="transcript-info-item"><span class="label">หลักสูตร:</span><span>${program}</span></div>
                        <div class="transcript-info-item"><span class="label">ปีที่เข้าศึกษา:</span><span>${admissionYear}</span></div>
                        <div class="transcript-info-item"><span class="label">อาจารย์ที่ปรึกษา:</span><span>${advisor}</span></div>
                    </div>
                    <div style="margin-top:18px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.82rem">
                            <span>หน่วยกิตสะสม</span><span>${totalCredits} / ${requiredCredits}</span>
                        </div>
                        <div class="progress-bar"><div class="progress-fill" style="width:${creditPercent}%"></div></div>
                        <div style="text-align:right;font-size:0.72rem;color:var(--text-muted);margin-top:4px">${creditPercent}%</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

window.exportProfileTemplate = function() {
    const headers = ['รหัสนักศึกษา','คำนำหน้า','ชื่อ','นามสกุล','คณะ','สาขาวิชา','หลักสูตร','ชั้นปี','สถานะ','อีเมล','โทรศัพท์','GPA','หน่วยกิตสะสม'];
    const sample = ['6801012630','นางสาว','พิมพ์ใจ','รักดี','คณะพยาบาลศาสตร์ สถาบันพระบรมราชชนก','สาขาวิชาการพยาบาลจิตเวชและสุขภาพจิต','พยาบาลศาสตรมหาบัณฑิต (พย.ม.)','1','กำลังศึกษา','pimjai.r@pi.ac.th','081-234-5678','3.45','96'];
    downloadCSVTemplate('template_ข้อมูลนักศึกษา.csv', headers, sample);
};

window.importProfile = function() {
    handleGenericCSVImport((data) => {
        if (data && data.length > 0) {
            const row = data[0]; // Take first row to update current student
            MOCK.student.studentId = row['รหัสนักศึกษา'] || MOCK.student.studentId;
            MOCK.student.prefix = row['คำนำหน้า'] || MOCK.student.prefix;
            MOCK.student.firstName = row['ชื่อ'] || MOCK.student.firstName;
            MOCK.student.lastName = row['นามสกุล'] || MOCK.student.lastName;
            MOCK.student.faculty = row['คณะ'] || MOCK.student.faculty;
            MOCK.student.department = row['สาขาวิชา'] || MOCK.student.department;
            MOCK.student.program = row['หลักสูตร'] || MOCK.student.program;
            MOCK.student.year = parseInt(row['ชั้นปี']) || MOCK.student.year;
            MOCK.student.status = row['สถานะ'] || MOCK.student.status;
            MOCK.student.email = row['อีเมล'] || MOCK.student.email;
            MOCK.student.phone = row['โทรศัพท์'] || MOCK.student.phone;
            MOCK.student.gpa = parseFloat(row['GPA']) || MOCK.student.gpa;
            MOCK.student.totalCredits = parseInt(row['หน่วยกิตสะสม']) || MOCK.student.totalCredits;
            
            alert('นำเข้าข้อมูลนักศึกษาสำเร็จ');
            renderPage();
        }
    });
};

// ============================
// Edit Profile Modal
// ============================
window.openEditStudentProfile = function() {
    const st = MOCK.student;
    if (!st) return;

    const modalHtml = `
    <div style="padding:10px;">
        <div class="form-group">
            <label class="form-label">เบอร์โทรศัพท์</label>
            <input type="text" id="editPhone" class="form-input" value="${st.phone || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">อีเมลติดต่อ</label>
            <input type="email" id="editEmail" class="form-input" value="${st.email || ''}">
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
            <button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button>
            <button class="btn btn-primary" onclick="saveStudentProfileEdit()">บันทึกข้อมูล</button>
        </div>
    </div>
    `;
    openModal('แก้ไขข้อมูลส่วนตัว', modalHtml);
};

window.saveStudentProfileEdit = function() {
    if (MOCK.student) {
        MOCK.student.phone = document.getElementById('editPhone').value;
        MOCK.student.email = document.getElementById('editEmail').value;
        closeModal();
        renderPage();
        setTimeout(() => alert('บันทึกข้อมูลส่วนตัวเรียบร้อย (อัปเดตระบบชั่วคราว)'), 300);
    }
};
