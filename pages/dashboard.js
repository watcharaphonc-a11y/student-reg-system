// ============================
// Dashboard Page (Merged with Analytics)
// ============================
pages.dashboard = function() {
    // 1. Data Preparation
    const allStudents = MOCK.students || [];
    const activeStudents = allStudents.filter(s => s.status !== 'สำเร็จการศึกษา' && s.status !== 'Graduated' && s.status !== 'พ้นสภาพ');
    const alumniStudents = allStudents.filter(s => s.status === 'สำเร็จการศึกษา' || s.status === 'Graduated');
    const advisors = MOCK.academicAdvisors || [];
    const enrolledCourses = MOCK.enrolledCourses || [];
    const uniqueCourseNames = new Set(enrolledCourses.map(c => c.name));
    
    const s = MOCK.dashboardStats || { totalStudents: 0, totalAlumni: 0, totalTeachers: 0, totalCourses: 0, avgGPA: 0 };
    
    const totalStudents = activeStudents.length || s.totalStudents;
    const totalAlumni = alumniStudents.length || s.totalAlumni;
    const totalAdvisors = advisors.length || s.totalTeachers;
    const totalCourses = uniqueCourseNames.size || s.totalCourses || (MOCK.courses ? MOCK.courses.length : 0);
    const avgGpa = Number(s.avgGPA || 0).toFixed(2);

    // Analytics Data Processing (from analytics_reports.js)
    let cohorts = {};
    let majors = {};
    let genderStats = { male: 0, female: 0, maleCount: 0, femaleCount: 0 };
    let atRiskStudents = [];

    if (activeStudents.length > 0) {
        // Cohorts
        activeStudents.forEach(st => {
            let id = st.studentId || st.id || "";
            let cohort = String(id).trim().substring(0, 2);
            if(cohort && !isNaN(cohort) && cohort.length === 2) {
                cohorts[cohort] = (cohorts[cohort] || 0) + 1;
            }
        });

        // Majors
        activeStudents.forEach(st => {
            let major = st.department || st.major || st.program || 'อื่นๆ';
            if (major.includes('ผู้ใหญ่')) major = 'การพยาบาลผู้ใหญ่';
            else if (major.includes('เด็ก')) major = 'การพยาบาลเด็ก';
            else if (major.includes('บริหาร')) major = 'การบริหารการพยาบาล';
            else if (major.includes('ชุมชน')) major = 'การพยาบาลชุมชน';
            else if (major.includes('จิตเวช')) major = 'การพยาบาลจิตเวช';
            else major = 'อื่นๆ';
            majors[major] = (majors[major] || 0) + 1;
        });

        // Gender
        let maleCount = activeStudents.filter(st => (st.gender || '').includes('ชาย')).length;
        let femaleCount = activeStudents.filter(st => (st.gender || '').includes('หญิง')).length;
        let totalG = maleCount + femaleCount;
        if (totalG > 0) {
            genderStats = {
                male: Math.round((maleCount / totalG) * 100),
                female: Math.round((femaleCount / totalG) * 100),
                maleCount,
                femaleCount
            };
        }

        // At Risk (GPA < 2.5)
        atRiskStudents = allStudents.filter(st => {
            const g = parseFloat(st.gpa || 0);
            return g > 0 && g < 2.5;
        }).slice(0, 5);
    }

    // Default Tab
    if (!window._dashboardActiveTab) window._dashboardActiveTab = 'overview';

    // 2. Render UI
    return `
    <div class="animate-in">
        <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
            <div>
                <h1 class="page-title">แดชบอร์ด</h1>
                <p class="page-subtitle">ภาพรวมข้อมูลระบบและการวิเคราะห์สถิติ</p>
            </div>
            <div class="header-semester" style="margin-bottom: 5px;">
                อัปเดตล่าสุด: <span style="font-weight: 700; color: var(--accent-primary);">${new Date().toLocaleDateString('th-TH')}</span>
            </div>
        </div>

        <!-- Unified Summary Cards -->
        <div class="stats-grid">
            <div class="stat-card animate-in animate-delay-1">
                <div class="stat-icon purple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div class="stat-info">
                    <div class="stat-value">${totalStudents}</div>
                    <div class="stat-label">นักศึกษาปัจจุบัน</div>
                </div>
                <span class="stat-change up" style="position: absolute; right: 15px; top: 15px;">↑ 5.2%</span>
            </div>
            <div class="stat-card animate-in animate-delay-2">
                <div class="stat-icon blue">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div class="stat-info">
                    <div class="stat-value">${totalCourses}</div>
                    <div class="stat-label">วิชาที่เปิดสอน</div>
                </div>
            </div>
            <div class="stat-card animate-in animate-delay-3">
                <div class="stat-icon orange">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div class="stat-info">
                    <div class="stat-value">${totalAdvisors}</div>
                    <div class="stat-label">อาจารย์/บุคลากร</div>
                </div>
            </div>
            <div class="stat-card animate-in animate-delay-4">
                <div class="stat-icon pink">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <div class="stat-info">
                    <div class="stat-value">${totalAlumni}</div>
                    <div class="stat-label">ศิษย์เก่า (Alumni)</div>
                </div>
            </div>
            <div class="stat-card animate-in animate-delay-5">
                <div class="stat-icon green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <div class="stat-info">
                    <div class="stat-value">${avgGpa}</div>
                    <div class="stat-label">GPAX เฉลี่ย</div>
                </div>
            </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs" style="margin-bottom: 24px;">
            <button class="tab-btn ${window._dashboardActiveTab === 'overview' ? 'active' : ''}" onclick="switchDashboardTab('overview')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;"><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/></svg>
                ภาพรวม (Overview)
            </button>
            <button class="tab-btn ${window._dashboardActiveTab === 'data' ? 'active' : ''}" onclick="switchDashboardTab('data')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                จัดการข้อมูล (Data Management)
            </button>
        </div>

        <!-- Tab Content -->
        <div id="dashboardTabContent">
            ${window._dashboardActiveTab === 'overview' ? renderDashboardOverview(cohorts, majors, genderStats, atRiskStudents) : renderDashboardData(activeStudents, advisors)}
        </div>

        <!-- Footer Activity (Always show) -->
        <div class="card animate-in animate-delay-4" style="margin-top: 24px;">
            <div class="card-header">
                <h3 class="card-title">กิจกรรมล่าสุดในระบบ</h3>
            </div>
            <div class="card-body" style="padding: 10px 22px;">
                <div class="activity-list">
                    ${(MOCK.recentActivities || []).slice(0, 5).map(a => `
                        <div class="activity-item">
                            <div class="activity-dot ${a.color || 'purple'}"></div>
                            <div>
                                <div class="activity-text">${a.text || '-'}</div>
                                <div class="activity-time">${a.time || '-'}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
};

// ============================
// Sub-renderers for Tabs
// ============================

function renderDashboardOverview(cohorts, majors, genderStats, atRiskStudents) {
    // Process Cohorts HTML
    let sortedCohorts = Object.keys(cohorts).sort();
    let maxCohort = Math.max(...Object.values(cohorts), 1);
    let cohortHtml = sortedCohorts.map(c => {
        let count = cohorts[c];
        let height = (count / maxCohort) * 150;
        return `
            <div style="display:flex; flex-direction:column; align-items:center; gap:8px; width:45px;">
                <span style="font-size:0.75rem; font-weight:700;">${count}</span>
                <div style="background:var(--accent-gradient); width:100%; height:${height}px; border-radius:4px 4px 0 0;"></div>
                <span style="font-size:0.75rem; color:var(--text-muted);">รุ่น ${c}</span>
            </div>
        `;
    }).join('');

    // Process Majors HTML
    let majorHtml = Object.keys(majors).sort((a,b) => majors[b] - majors[a]).map(m => {
        let count = majors[m];
        let total = Object.values(majors).reduce((a,b)=>a+b, 0);
        let pct = Math.round((count/total)*100);
        return `
            <div style="margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:5px;">
                    <span>${m}</span>
                    <span style="font-weight:700;">${count} คน (${pct}%)</span>
                </div>
                <div style="height:8px; background:var(--bg-tertiary); border-radius:4px; overflow:hidden;">
                    <div style="width:${pct}%; height:100%; background:var(--accent-gradient);"></div>
                </div>
            </div>
        `;
    }).join('');

    return `
    <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
        <!-- Students by Cohort -->
        <div class="card animate-in">
            <div class="card-header"><h3 class="card-title">จำนวนนักศึกษาแยกตามรุ่น</h3></div>
            <div class="card-body">
                <div style="display:flex; justify-content:space-around; align-items:flex-end; height:180px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
                    ${cohortHtml || '<div style="color:var(--text-muted);">ไม่มีข้อมูล</div>'}
                </div>
            </div>
        </div>

        <!-- Students by Major -->
        <div class="card animate-in animate-delay-1">
            <div class="card-header"><h3 class="card-title">สัดส่วนตามสาขาวิชา</h3></div>
            <div class="card-body">
                ${majorHtml || '<div style="color:var(--text-muted);">ไม่มีข้อมูล</div>'}
            </div>
        </div>

        <!-- Gender & Early Warning -->
        <div style="display:flex; flex-direction:column; gap:24px;">
            <div class="card animate-in animate-delay-2">
                <div class="card-header"><h3 class="card-title">สัดส่วนนักศึกษา (เพศ)</h3></div>
                <div class="card-body">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-weight:600; font-size:0.9rem;">
                        <span style="color:var(--info);">ชาย ${genderStats.male}%</span>
                        <span style="color:var(--danger);">หญิง ${genderStats.female}%</span>
                    </div>
                    <div style="height:15px; display:flex; border-radius:10px; overflow:hidden; background:var(--bg-tertiary);">
                        <div style="width:${genderStats.male}%; background:var(--info);"></div>
                        <div style="width:${genderStats.female}%; background:var(--accent-primary);"></div>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.75rem; color:var(--text-muted);">
                        <span>${genderStats.maleCount} คน</span>
                        <span>${genderStats.femaleCount} คน</span>
                    </div>
                </div>
            </div>

            <div class="card animate-in animate-delay-3" style="border-left: 4px solid var(--danger);">
                <div class="card-header" style="background: rgba(220, 38, 38, 0.05);">
                    <h3 class="card-title" style="color:var(--danger);">นักศึกษาที่ควรเฝ้าระวัง (GPA < 2.5)</h3>
                </div>
                <div class="card-body" style="padding:0;">
                    ${atRiskStudents.length === 0 ? '<div style="padding:20px; text-align:center; color:var(--text-muted);">ไม่พบข้อมูล</div>' : 
                        atRiskStudents.map(st => `
                            <div style="display:flex; justify-content:space-between; padding:12px 20px; border-bottom:1px solid var(--border-color); cursor:pointer;" onclick="viewStudentProfile('${st.studentId}')">
                                <div>
                                    <div style="font-weight:600; font-size:0.9rem;">${st.prefix}${st.firstName} ${st.lastName}</div>
                                    <div style="font-size:0.72rem; color:var(--text-muted);">${st.studentId} • ${st.department}</div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="color:var(--danger); font-weight:700;">${Number(st.gpa).toFixed(2)}</div>
                                    <div style="font-size:0.65rem; color:var(--text-muted);">GPAX</div>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        </div>
    </div>`;
}

function renderDashboardData(activeStudents, advisors) {
    return `
    <div class="animate-in">
        <!-- Search Bar -->
        <div class="admin-search-box" style="margin-bottom: 24px; background: white; padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
            <div style="flex: 1; position: relative; min-width: 250px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="dashboardSearchInput" class="form-input" placeholder="ค้นหาชื่อ, รหัสนักศึกษา, สาขาวิชา หรืออาจารย์..." style="padding-left: 45px; width: 100%;" oninput="filterDashboardLists()">
            </div>
            <button class="btn btn-primary" onclick="filterDashboardLists()">ค้นหา</button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr; gap:24px;">
            <!-- Student Table -->
            <div class="card">
                <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 class="card-title">รายชื่อนักศึกษา</h3>
                    <span class="badge info" id="studentCountBadge">${activeStudents.length} คน</span>
                </div>
                <div class="card-body" style="padding:0;">
                    <div class="table-wrapper" style="max-height:450px; overflow-y:auto;" id="studentListContainer">
                        ${renderStudentListTable(activeStudents)}
                    </div>
                </div>
            </div>

            <!-- Teacher Table -->
            <div class="card">
                <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 class="card-title">รายชื่ออาจารย์</h3>
                    <span class="badge info" id="teacherCountBadge">${advisors.length} คน</span>
                </div>
                <div class="card-body" style="padding:0;">
                    <div class="table-wrapper" style="max-height:450px; overflow-y:auto;" id="teacherListContainer">
                        ${renderTeacherListTable(advisors)}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// ============================
// Actions & Handlers
// ============================

window.switchDashboardTab = function(tab) {
    window._dashboardActiveTab = tab;
    // Re-render only the dashboard
    const content = pages.dashboard();
    document.getElementById('contentArea').innerHTML = content;
    // Update active tab button classes
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(tab === 'overview' ? 'ภาพรวม' : 'จัดการข้อมูล')) {
            btn.classList.add('active');
        }
    });
};

window.filterDashboardLists = function() {
    const input = document.getElementById('dashboardSearchInput');
    const query = input ? input.value.trim().toLowerCase() : '';

    const allStudents = MOCK.students || [];
    const filteredStudents = query ? allStudents.filter(st => {
        const fullName = `${st.prefix || ''}${st.firstName || ''} ${st.lastName || ''}`.toLowerCase();
        const studentId = String(st.studentId || st.id || '').toLowerCase();
        const dept = String(st.department || '').toLowerCase();
        return fullName.includes(query) || studentId.includes(query) || dept.includes(query);
    }) : allStudents.filter(s => s.status !== 'สำเร็จการศึกษา' && s.status !== 'Graduated' && s.status !== 'พ้นสภาพ');

    const studentContainer = document.getElementById('studentListContainer');
    if (studentContainer) studentContainer.innerHTML = renderStudentListTable(filteredStudents);
    
    const studentBadge = document.getElementById('studentCountBadge');
    if (studentBadge) studentBadge.textContent = `${filteredStudents.length} คน`;

    const allTeachers = MOCK.academicAdvisors || [];
    const filteredTeachers = query ? allTeachers.filter(t => {
        const name = String(t.name || '').toLowerCase();
        const expertise = String(t.expertise || '').toLowerCase();
        const position = String(t.position || '').toLowerCase();
        return name.includes(query) || expertise.includes(query) || position.includes(query);
    }) : allTeachers;

    const teacherContainer = document.getElementById('teacherListContainer');
    if (teacherContainer) teacherContainer.innerHTML = renderTeacherListTable(filteredTeachers);
    
    const teacherBadge = document.getElementById('teacherCountBadge');
    if (teacherBadge) teacherBadge.textContent = `${filteredTeachers.length} คน`;
};

// Helpers
function renderStudentListTable(list) {
    if (!list || list.length === 0) return '<div style="padding:40px; text-align:center; color:var(--text-muted);">ไม่พบข้อมูล</div>';
    return `<table class="data-table" style="font-size:0.85rem;">
        <thead><tr><th>#</th><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>สาขาวิชา</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
        <tbody>
            ${list.map((st, i) => `
                <tr>
                    <td>${i+1}</td>
                    <td style="font-weight:600; color:var(--accent-primary);">${st.studentId || st.id}</td>
                    <td>${st.prefix || ''}${st.firstName} ${st.lastName}</td>
                    <td>${st.department || '-'}</td>
                    <td>${getStatusBadge(st.status || 'กำลังศึกษา')}</td>
                    <td><button class="btn btn-secondary btn-sm" onclick="viewStudentProfile('${st.studentId || st.id}')">ดูข้อมูล</button></td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

function renderTeacherListTable(list) {
    if (!list || list.length === 0) return '<div style="padding:40px; text-align:center; color:var(--text-muted);">ไม่พบข้อมูล</div>';
    return `<table class="data-table" style="font-size:0.85rem;">
        <thead><tr><th>#</th><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th><th>ความเชี่ยวชาญ</th><th>นศ. ในกำกับ</th></tr></thead>
        <tbody>
            ${list.map((t, i) => `
                <tr>
                    <td>${i+1}</td>
                    <td style="font-weight:600;">${t.name}</td>
                    <td><span class="badge info" style="font-size:0.75rem;">${t.position || '-'}</span></td>
                    <td style="font-size:0.82rem;">${t.expertise || '-'}</td>
                    <td style="text-align:center; font-weight:600;">${t.studentCount || 0}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

window.viewStudentProfile = function(id) {
    const student = (MOCK.students || []).find(st => String(st.studentId || st.id) === String(id));
    if (student) {
        MOCK.student = student;
        if (typeof window.syncActiveStudentData === 'function') window.syncActiveStudentData();
        navigateTo('student-profile');
    }
};
