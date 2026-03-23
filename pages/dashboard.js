// ============================
// Dashboard Page
// ============================
pages.dashboard = function() {
    const s = MOCK.dashboardStats;
    const students = MOCK.students || [];
    const advisors = MOCK.academicAdvisors || [];
    const totalStudents = students.length > 0 ? students.length : s.totalStudents;
    const totalAdvisors = advisors.length;
    const uniqueCourseNames = new Set((MOCK.enrolledCourses || []).map(c => c.name));
    const totalCourses = uniqueCourseNames.size || s.totalCourses;

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">แดชบอร์ด</h1>
            <p class="page-subtitle">ภาพรวมข้อมูลระบบทะเบียนนักศึกษา</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card animate-in animate-delay-1">
                <div class="stat-icon purple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div class="stat-value">${formatMoney(totalStudents)}</div>
                <div class="stat-label">นักศึกษาทั้งหมด</div>
                <span class="stat-change up">↑ 5.2%</span>
            </div>
            <div class="stat-card animate-in animate-delay-2">
                <div class="stat-icon blue">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div class="stat-value">${totalCourses}</div>
                <div class="stat-label">รายวิชาที่เปิดสอน<br><span style="font-size:0.75rem; color:var(--accent-primary);">ภาคฤดูร้อน/2568</span></div>
                <span class="stat-change up">↑ 3.1%</span>
            </div>
            <div class="stat-card animate-in animate-delay-3">
                <div class="stat-icon orange">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <div class="stat-value">${totalAdvisors}</div>
                <div class="stat-label">อาจารย์ทั้งหมด</div>
                <span class="stat-change up">↑ 1.0%</span>
            </div>
            <div class="stat-card animate-in animate-delay-4">
                <div class="stat-icon green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <div class="stat-value">${s.avgGPA.toFixed(2)}</div>
                <div class="stat-label">GPA เฉลี่ย</div>
                <span class="stat-change up">↑ 0.12</span>
            </div>
        </div>

        </div>

        ${(window.currentUserRole === 'admin' || window.currentUserRole === 'staff') ? `
        <!-- Admin/Staff Search Bar -->
        <div class="admin-search-box animate-in animate-delay-1" style="margin-bottom: 25px; background: white; padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
            <div style="flex: 1; position: relative; min-width: 250px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="dashboardSearchInput" class="form-input" placeholder="ค้นหาข้อมูลนักศึกษา หรืออาจารย์ (ชื่อ, นามสกุล, รหัส, สาขาวิชา)..." style="padding-left: 45px; width: 100%;" oninput="filterDashboardLists()">
            </div>
            <button class="btn btn-primary" onclick="filterDashboardLists()" style="white-space: nowrap; padding: 10px 20px; font-weight: 600;">
                ค้นหาข้อมูล
            </button>
            <span class="badge warning" style="white-space: nowrap; font-size: 0.85rem; padding: 6px 12px; border: 1px solid var(--warning);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                สำหรับบุคลากร/Admin
            </span>
        </div>

        <!-- Student List (Full Width) -->
        <div class="card animate-in animate-delay-2">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:6px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    รายชื่อนักศึกษา
                </h3>
                <span class="badge info" id="studentCountBadge">${totalStudents} คน</span>
            </div>
            <div class="card-body" style="padding:0;">
                <div class="table-wrapper" style="max-height:400px; overflow-y:auto;" id="studentListContainer">
                    ${renderStudentListTable(students)}
                </div>
            </div>
        </div>
        ` : ''}

        ${(window.currentUserRole === 'admin') ? `
        <!-- Teacher List (Full Width) -->
        <div class="card animate-in animate-delay-3">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:6px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    รายชื่ออาจารย์
                </h3>
                <span class="badge info" id="teacherCountBadge">${totalAdvisors} คน</span>
            </div>
            <div class="card-body" style="padding:0;">
                <div class="table-wrapper" style="max-height:400px; overflow-y:auto;" id="teacherListContainer">
                    ${renderTeacherListTable(advisors)}
                </div>
            </div>
        </div>
        ` : ''}

        <div class="grid-2">
            <div class="card animate-in animate-delay-2">
                <div class="card-header">
                    <h3 class="card-title">GPA แต่ละภาคเรียน</h3>
                </div>
                <div class="card-body">
                    <div class="bar-chart" id="gpaChart">
                        ${MOCK.gpaHistory.map(h => `
                            <div class="bar-group">
                                <div class="bar" style="height:${(h.gpa/4)*180}px;background:var(--accent-gradient);">
                                    <span class="bar-value">${h.gpa.toFixed(2)}</span>
                                </div>
                                <span class="bar-label">${h.semester}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="card animate-in animate-delay-3">
                <div class="card-header">
                    <h3 class="card-title">กิจกรรมล่าสุด</h3>
                </div>
                <div class="card-body">
                    <div class="activity-list">
                        ${MOCK.recentActivities.map(a => `
                            <div class="activity-item">
                                <div class="activity-dot ${a.color}"></div>
                                <div>
                                    <div class="activity-text">${a.text}</div>
                                    <div class="activity-time">${a.time}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        <div class="card animate-in animate-delay-4">
            <div class="card-header">
                <h3 class="card-title">รายวิชาที่ลงทะเบียน ภาคเรียนปัจจุบัน</h3>
                <span class="badge info">${MOCK.enrolledCourses.length} วิชา / ${MOCK.enrolledCourses.reduce((s,c)=>s+c.credits,0)} หน่วยกิต</span>
            </div>
            <div class="card-body">
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead><tr><th>รหัสวิชา</th><th>ชื่อวิชา</th><th>หน่วยกิต</th><th>อาจารย์</th><th>เวลาเรียน</th><th>ห้อง</th></tr></thead>
                        <tbody>
                            ${MOCK.enrolledCourses.map(c => `
                                <tr><td style="color:var(--accent-primary-hover);font-weight:600">${c.code}</td><td>${c.name}</td><td style="text-align:center">${c.credits}</td><td>${c.instructor}</td><td>${c.schedule}</td><td>${c.room}</td></tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

// ============================
// Helper: render student table
// ============================
function renderStudentListTable(list) {
    if (!list || list.length === 0) {
        return `<div style="text-align:center; padding:40px; color:var(--text-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin-bottom:10px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <p>ยังไม่มีข้อมูลนักศึกษา</p>
            <p style="font-size:0.82rem;">กรุณานำเข้าข้อมูลผ่านเมนู "ลงทะเบียนนักศึกษาใหม่"</p>
        </div>`;
    }
    return `<table class="data-table" style="font-size:0.85rem;">
        <thead><tr>
            <th>#</th><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>สาขาวิชา</th><th>สถานะ</th><th>จัดการ</th>
        </tr></thead>
        <tbody>
            ${list.map((st, i) => `
                <tr>
                    <td style="color:var(--text-muted);">${i+1}</td>
                    <td style="font-weight:600; color:var(--accent-primary);">${String(st.studentId || st.id || '-')}</td>
                    <td>${st.prefix || ''}${st.firstName || ''} ${st.lastName || ''}</td>
                    <td>${st.department || '-'}</td>
                    <td>${getStatusBadge(st.status || 'กำลังศึกษา')}</td>
                    <td><button class="btn btn-secondary" style="padding:3px 10px; font-size:0.78rem;" onclick="viewStudentProfile('${String(st.studentId || st.id)}')">ดูข้อมูล</button></td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

// ============================
// Helper: render teacher table
// ============================
function renderTeacherListTable(list) {
    if (!list || list.length === 0) {
        return `<div style="text-align:center; padding:40px; color:var(--text-muted);">
            <p>ยังไม่มีข้อมูลอาจารย์</p>
        </div>`;
    }
    return `<table class="data-table" style="font-size:0.85rem;">
        <thead><tr>
            <th>#</th><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th><th>ความเชี่ยวชาญ</th><th>อีเมล</th><th>นศ. ในกำกับ</th>
        </tr></thead>
        <tbody>
            ${list.map((t, i) => `
                <tr>
                    <td style="color:var(--text-muted);">${i+1}</td>
                    <td style="font-weight:600;">${t.name}</td>
                    <td><span class="badge info" style="font-size:0.75rem;">${t.position || '-'}</span></td>
                    <td style="font-size:0.82rem;">${t.expertise || '-'}</td>
                    <td style="font-size:0.82rem;"><a href="mailto:${t.email}" style="color:var(--accent-primary); text-decoration:none;">${t.email || '-'}</a></td>
                    <td style="text-align:center; font-weight:600;">${t.studentCount != null ? t.studentCount : '-'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

// ============================
// Real-time search filter
// ============================
window.filterDashboardLists = function() {
    const input = document.getElementById('dashboardSearchInput');
    const query = input ? input.value.trim().toLowerCase() : '';

    // Filter students
    const allStudents = MOCK.students || [];
    const filteredStudents = query ? allStudents.filter(st => {
        const fullName = `${st.prefix || ''}${st.firstName || ''} ${st.lastName || ''}`.toLowerCase();
        const studentId = String(st.studentId || st.id || '').toLowerCase();
        const dept = String(st.department || '').toLowerCase();
        return fullName.includes(query) || studentId.includes(query) || dept.includes(query);
    }) : allStudents;

    const studentContainer = document.getElementById('studentListContainer');
    if (studentContainer) {
        studentContainer.innerHTML = renderStudentListTable(filteredStudents);
    }
    const studentBadge = document.getElementById('studentCountBadge');
    if (studentBadge) {
        studentBadge.textContent = query ? `${filteredStudents.length} / ${allStudents.length} คน` : `${allStudents.length} คน`;
    }

    // Filter teachers
    const allTeachers = MOCK.academicAdvisors || [];
    const filteredTeachers = query ? allTeachers.filter(t => {
        const name = String(t.name || '').toLowerCase();
        const expertise = String(t.expertise || '').toLowerCase();
        const position = String(t.position || '').toLowerCase();
        return name.includes(query) || expertise.includes(query) || position.includes(query);
    }) : allTeachers;

    const teacherContainer = document.getElementById('teacherListContainer');
    if (teacherContainer) {
        teacherContainer.innerHTML = renderTeacherListTable(filteredTeachers);
    }
    const teacherBadge = document.getElementById('teacherCountBadge');
    if (teacherBadge) {
        teacherBadge.textContent = query ? `${filteredTeachers.length} / ${allTeachers.length} คน` : `${allTeachers.length} คน`;
    }
};

// ============================
// View student profile from dashboard
// ============================
window.viewStudentProfile = function(id) {
    const student = (MOCK.students || []).find(st => String(st.studentId || st.id) === String(id));
    if (student) {
        MOCK.student = student;
        closeModal();
        navigateTo('student-profile');
    }
};
