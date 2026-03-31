// ============================
// Student Profile Page
// ============================
pages['student-profile'] = function () {
    const isAdmin = (window.currentUserRole === 'staff' || window.currentUserRole === 'admin');
    const st = MOCK.student;

    if (!st && !isAdmin) {
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

    if (!st && isAdmin) {
        return `
        <div class="animate-in">
            <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h1 class="page-title">ข้อมูลนักศึกษา</h1>
                    <p class="page-subtitle">กรุณาเลือกนักศึกษาเพื่อดูข้อมูล</p>
                </div>
                <div style="flex-grow: 1; max-width: 400px; margin: 0 20px;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <select id="studentSelector" class="form-input" onchange="changeProfileStudent(this.value)" style="padding-right: 30px;">
                            <option value="">-- เลือกนักศึกษาเพื่อดูข้อมูล --</option>
                            ${(MOCK.students || []).map(s => `
                                <option value="${s.id || s.studentId}">
                                    ${s.studentId || ''} - ${s.prefix || ''}${s.firstName || ''} ${s.lastName || ''}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            </div>
            <div class="card"><div class="card-body" style="text-align:center; padding:60px;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin-bottom:20px; opacity:0.5;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <h3 style="color:var(--text-muted);">กรุณาเลือกนักศึกษา</h3>
                <p style="color:var(--text-muted);">ค้นหาและเลือกรายชื่อนักศึกษาจากรายการด้านบนเพื่อดูรายละเอียด</p>
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
    const personalEmail = st.personalEmail || '-';
    const phone = st.phone || '-';
    const workplace = st.workplace || '-';
    const position = st.position || '-';
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
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap: wrap; gap: 15px;">
            <div>
                <h1 class="page-title">ข้อมูลนักศึกษา</h1>
                <p class="page-subtitle">ข้อมูลส่วนตัวและข้อมูลการศึกษา</p>
            </div>
            
            ${(window.currentUserRole === 'staff' || window.currentUserRole === 'admin' || window.hasPermission('import_student')) ? `
            <div style="flex-grow: 1; max-width: 400px; margin: 0 20px;">
                <div class="form-group" style="margin-bottom: 0;">
                    <select id="studentSelector" class="form-input" onchange="changeProfileStudent(this.value)" style="padding-right: 30px;">
                        <option value="">-- เลือกนักศึกษาเพื่อดูข้อมูล --</option>
                        ${(MOCK.students || []).map(s => `
                            <option value="${s.id || s.studentId}" ${(st && (st.id === s.id || st.studentId === s.studentId)) ? 'selected' : ''}>
                                ${s.studentId || ''} - ${s.prefix || ''}${s.firstName || ''} ${s.lastName || ''}
                            </option>
                        `).join('')}
                    </select>
                </div>
            </div>
            ` : ''}

            <div style="display:flex; gap:10px; align-items: center;">
                ${(window.currentUserRole === 'student') ? `
                <button class="btn btn-primary" onclick="openEditStudentProfile()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    แก้ไขข้อมูล
                </button>
                ` : ''}
                ${(window.hasPermission('export_template') || window.hasPermission('import_student')) ? `
                ${window.hasPermission('export_template') ? `
                <button class="btn btn-secondary" onclick="exportProfileTemplate()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Template
                </button>
                ` : ''}
                ${window.hasPermission('import_student') ? `
                <button class="btn btn-primary" onclick="importProfile()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    นำเข้าข้อมูล
                </button>
                ` : ''}
                ` : ''}
            </div>
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
                        ปีที่เข้าศึกษา ${admissionYear}
                    </div>
                    <div class="profile-meta-item">${getStatusBadge(status)}</div>
                    ${(isAdmin && status !== 'สำเร็จการศึกษา' && status !== 'Graduated') ? `
                    <div class="profile-meta-item">
                        <button class="btn btn-primary btn-sm" onclick="openApproveGraduationModal()" style="background:var(--success); border:none; box-shadow:none; padding:4px 12px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            อนุมัติจบการศึกษา
                        </button>
                    </div>
                    ` : ''}
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
                        <div class="transcript-info-item"><span class="label">อีเมลวิทยาลัย:</span><span>${email}</span></div>
                        <div class="transcript-info-item"><span class="label">อีเมลส่วนตัว:</span><span>${personalEmail}</span></div>
                        <div class="transcript-info-item"><span class="label">โทรศัพท์:</span><span>${phone}</span></div>
                        <div class="transcript-info-item"><span class="label">สถานที่ปฏิบัติงาน:</span><span>${workplace}</span></div>
                        <div class="transcript-info-item"><span class="label">ตำแหน่ง:</span><span>${position}</span></div>
                        <div class="transcript-info-item"><span class="label">ที่อยู่:</span><span>${address}</span></div>
                        <div class="transcript-info-item"><span class="label">บุคคลที่ติดต่อได้:</span><span>${parentName}</span></div>
                        <div class="transcript-info-item"><span class="label">เบอร์โทรติดต่อได้:</span><span>${parentPhone}</span></div>
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
        
        <!-- Degree Audit Section -->
        <div class="card animate-in animate-delay-4" style="margin-top: 24px;">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">แผนการศึกษาของฉัน (My Study Plan)</h3>
            </div>
            <div class="card-body">
                ${generateDegreeAuditHtml(st)}
            </div>
        </div>
        
    </div>`;
};

// ============================
// Degree Audit & Elective Helpers
// ============================
function generateDegreeAuditHtml(student) {
    // Attempt to get the cohort-specific study plan
    const planInfo = typeof window.getStudyPlanForStudent === 'function'
        ? window.getStudyPlanForStudent(student)
        : { title: 'ไม่พบข้อมูลหลักสูตร', data: [] };

    const planData = planInfo.data;

    // Collect passed courses from mock grades for audit checkmarks
    const passedCourses = new Set();
    const studentGrades = student.grades || (window.MOCK && MOCK.grades) || [];

    studentGrades.forEach(term => {
        (term.courses || []).forEach(c => {
            if (['A', 'B+', 'B', 'C+', 'C', 'P', 'S'].includes(c.grade)) {
                passedCourses.add(String(c.code || '').trim());
            }
        });
    });

    if (!planData || planData.length === 0) {
        return `<div style="text-align:center; padding: 20px; color:var(--text-muted);">ไมีมีข้อมูลแผนการศึกษาสำหรับรหัสนักศึกษา/สาขาวิชานี้</div>`;
    }

    let html = `<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">`;

    planData.forEach((semData, semIndex) => {
        html += `
            <div class="card" style="padding: 15px; background:var(--bg-secondary); border: 1px solid var(--border-color);">
                <div style="display:flex; justify-content:space-between; margin-bottom: 12px; font-weight:600; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">
                    <span style="color:var(--text-primary)">${semData.title}</span>
                    <span style="color:var(--text-muted); font-size:0.9rem;">${semData.credits} หน่วยกิต</span>
                </div>
                <ul style="margin:0; padding-left: 0; list-style:none; font-size: 0.9rem; color:var(--text-secondary); line-height: 1.6;">`;

        semData.courses.forEach((courseStr, courseIndex) => {
            // Check if student has explicitly mapped this elective slot in their profile
            let displayCourse = courseStr;
            const slotId = `${semIndex}-${courseIndex}`;
            const isElectiveSlot = displayCourse.includes('วิชาเลือก');

            if (isElectiveSlot && student.electives && student.electives[slotId]) {
                displayCourse = student.electives[slotId];
            }

            const extractCode = displayCourse.split(' ')[0];
            const isPassed = passedCourses.has(extractCode);

            html += `
                <li style="margin-bottom:8px; display:flex; align-items:flex-start; gap:8px;">
                    <div style="margin-top:2px;">
                        ${isPassed
                    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>'}
                    </div>
                    <div style="flex:1;">
                        <span style="${isPassed ? 'color:var(--text-primary); font-weight:500;' : ''}">${displayCourse}</span>
                        ${(isElectiveSlot && !isPassed) ? `
                            <div style="margin-top:4px;">
                                <button class="btn btn-secondary" style="padding:2px 8px; font-size:0.75rem;" onclick="openElectiveSelectionModal(${semIndex}, ${courseIndex})">
                                    ${student.electives && student.electives[slotId] ? 'เปลี่ยนวิชาเลือก' : 'เลือกวิชา'}
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </li>`;
        });

        html += `</ul></div>`;
    });

    html += `</div>`;
    return html;
}

window.openElectiveSelectionModal = function (semIndex, courseIndex) {
    const slotId = `${semIndex}-${courseIndex}`;

    // Extract available electives from MOCK.courses (only where type === 'เลือก' or 'เลือกเสรี')
    const electives = (MOCK.courses || []).filter(c => c.type && c.type.includes('เลือก'));

    let html = `
        <div style="padding:10px;">
            <p style="color:var(--text-muted); margin-bottom:15px;">กรุณาเลือกรายวิชาเลือกเสรีที่คุณต้องการศึกษาในภาคเรียนนี้</p>
            <div class="form-group">
                <label class="form-label">รายวิชาเลือก</label>
                <select id="electiveSelect" class="form-input">
                    <option value="">-- กรุณาเลือก --</option>
                    ${electives.map(c => `<option value="${c.id} ${c.name} ${c.credits || '3'}(x-x-x)">[${c.id}] ${c.name}</option>`).join('')}
                </select>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                <button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button>
                <button class="btn btn-primary" onclick="saveElectiveSelection('${slotId}')">บันทึกวิชาเลือก</button>
            </div>
        </div>
    `;

    openModal('เลือกรายวิชาเลือก (Elective)', html);
};

window.saveElectiveSelection = function (slotId) {
    const selectEl = document.getElementById('electiveSelect');
    if (!selectEl || !selectEl.value) {
        alert('กรุณาเลือกรายวิชาวิชาหนึ่ง');
        return;
    }

    if (MOCK.student) {
        if (!MOCK.student.electives) MOCK.student.electives = {};
        MOCK.student.electives[slotId] = selectEl.value;
    }

    closeModal();
    renderPage();
};

window.exportProfileTemplate = function () {
    const headers = ['รหัสนักศึกษา', 'คำนำหน้า', 'ชื่อ', 'นามสกุล', 'คณะ', 'สาขาวิชา', 'หลักสูตร', 'ปีที่เข้าศึกษา', 'สถานะ', 'อีเมล', 'โทรศัพท์', 'GPA', 'หน่วยกิตสะสม'];
    const sample = ['6801012630', 'นางสาว', 'พิมพ์ใจ', 'รักดี', 'คณะพยาบาลศาสตร์ สถาบันพระบรมราชชนก', 'สาขาวิชาการพยาบาลจิตเวชและสุขภาพจิต', 'พยาบาลศาสตรมหาบัณฑิต (พย.ม.)', '2568', 'กำลังศึกษา', 'pimjai.r@pi.ac.th', '081-234-5678', '3.45', '96'];
    downloadCSVTemplate('template_ข้อมูลนักศึกษา.csv', headers, sample);
};

window.importProfile = function () {
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
            MOCK.student.admissionYear = row['ปีที่เข้าศึกษา'] || MOCK.student.admissionYear;
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

window.changeProfileStudent = function (studentId) {
    if (!studentId) return;
    const selected = (MOCK.students || []).find(s => (s.id || s.studentId) === studentId);
    if (selected) {
        MOCK.student = selected;
        if (typeof window.syncActiveStudentData === 'function') {
            window.syncActiveStudentData();
        }
        renderPage();
    }
};

// ============================
// Edit Profile Modal
// ============================
window.openEditStudentProfile = function () {
    const st = MOCK.student;
    if (!st) return;

    const modalHtml = `
    <div style="padding:10px;">
        <div class="form-group" style="margin-bottom:15px;">
            <label class="form-label">เบอร์โทรศัพท์ (Phone)</label>
            <input type="text" id="editPhone" class="form-input" value="${st.phone || ''}">
        </div>
        <div class="form-group" style="margin-bottom:15px;">
            <label class="form-label">อีเมลส่วนตัว (Personal Email)</label>
            <input type="email" id="editPersonalEmail" class="form-input" value="${st.personalEmail || ''}">
        </div>
        <div class="form-group" style="margin-bottom:15px;">
            <label class="form-label">สถานที่ปฏิบัติงาน (Workplace)</label>
            <input type="text" id="editWorkplace" class="form-input" value="${st.workplace || ''}">
        </div>
        <div class="form-group" style="margin-bottom:15px;">
            <label class="form-label">ตำแหน่ง (Position)</label>
            <input type="text" id="editPosition" class="form-input" value="${st.position || ''}">
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
            <button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button>
            <button class="btn btn-primary" onclick="saveStudentProfileEdit()">บันทึกข้อมูล</button>
        </div>
    </div>
    `;
    openModal('แก้ไขข้อมูลส่วนตัว', modalHtml);
};

window.saveStudentProfileEdit = function () {
    if (MOCK.student) {
        MOCK.student.phone = document.getElementById('editPhone').value;
        MOCK.student.personalEmail = document.getElementById('editPersonalEmail').value;
        MOCK.student.workplace = document.getElementById('editWorkplace').value;
        MOCK.student.position = document.getElementById('editPosition').value;
        closeModal();
        renderPage();
        setTimeout(() => alert('บันทึกข้อมูลส่วนตัวเรียบร้อย (อัปเดตระบบชั่วคราว)'), 300);
    }
};

// ============================
// Graduation Approval
// ============================
window.openApproveGraduationModal = function() {
    const st = MOCK.student;
    if (!st) return;

    const modalHtml = `
    <div style="padding:10px;">
        <p style="margin-bottom:15px; color:var(--text-secondary);">คุณกำลังจะอนุมัติการสำเร็จการศึกษาให้แก่ <strong>${st.prefix || ''}${st.firstName} ${st.lastName}</strong></p>
        
        <div class="form-group" style="margin-bottom:15px;">
            <label class="form-label">ปีที่สำเร็จการศึกษา (พ.ศ.)</label>
            <input type="number" id="gradYear" class="form-input" value="${new Date().getFullYear() + 543}">
        </div>
        
        <div class="form-group" style="margin-bottom:15px;">
            <label class="form-label">สถานที่ปฏิบัติงานหลังบรรจุ/ทำงาน</label>
            <input type="text" id="gradWorkplace" class="form-input" placeholder="เช่น รพ.พุทธชินราช, สสจ.พิษณุโลก" value="${st.workplace || ''}">
        </div>

        <div class="form-group" style="margin-bottom:15px;">
            <label class="form-label">ตำแหน่ง</label>
            <input type="text" id="gradPosition" class="form-input" placeholder="เช่น พยาบาลวิชาชีพ" value="${st.position || ''}">
        </div>

        <div style="background:var(--warning-bg); padding:12px; border-radius:var(--radius-md); border:1px solid var(--warning); margin-bottom:20px;">
            <p style="font-size:0.82rem; color:var(--warning); margin:0;">
                <strong>คำแนะนำ:</strong> การอนุมัติจะเปลี่ยนสถานะนักศึกษาเป็น "สำเร็จการศึกษา" และย้ายข้อมูลไปยังฐานข้อมูลศิษย์เก่าทันที
            </p>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button>
            <button class="btn btn-primary" onclick="submitGraduationApproval()" style="background:var(--success); border:none;">ยืนยันการสำเร็จการศึกษา</button>
        </div>
    </div>
    `;
    openModal('อนุมัติการสำเร็จการศึกษา', modalHtml);
};

window.submitGraduationApproval = function() {
    const gradYear = document.getElementById('gradYear').value;
    const gradWorkplace = document.getElementById('gradWorkplace').value;
    const gradPosition = document.getElementById('gradPosition').value;

    if (!gradYear) {
        alert('กรุณาระบุปีที่สำเร็จการศึกษา');
        return;
    }

    if (MOCK.student) {
        showApiLoading('กำลังบันทึกข้อมูลการสำเร็จการศึกษา...');
        
        // Update local object
        MOCK.student.status = 'สำเร็จการศึกษา';
        MOCK.student.graduationYear = gradYear;
        MOCK.student.workplace = gradWorkplace;
        MOCK.student.position = gradPosition;

        // Sync with main students list
        const idx = MOCK.students.findIndex(s => (s.id || s.studentId) === (MOCK.student.id || MOCK.student.studentId));
        if (idx !== -1) {
            MOCK.students[idx] = { ...MOCK.student };
        }

        // Trigger API Sync
        if (typeof window.syncActiveStudentData === 'function') {
            window.syncActiveStudentData();
        }

        setTimeout(() => {
            hideApiLoading();
            closeModal();
            alert('อนุมัติการสำเร็จการศึกษาเรียบร้อยแล้ว รายชื่อจะถูกย้ายไปยังฐานข้อมูลศิษย์เก่า');
            navigateTo('alumni');
        }, 1000);
    }
};
