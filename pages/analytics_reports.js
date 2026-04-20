pages['analytics-reports'] = function() {
    // 1. Prepare Real Data from MOCK
    let totalStudents = 1248;
    let alumni = 8531;
    let avgGpa = "3.45";
    let gradRate = "89.2%";
    
    let cohorts = { '64': 180, '65': 210, '66': 245, '67': 285, '68': 328 };
    let majors = { 'การพยาบาลผู้ใหญ่': 35, 'การพยาบาลเด็ก': 22, 'การบริหารทางการพยาบาล': 18, 'การพยาบาลเวชปฏิบัติชุมชน': 15, 'อื่นๆ': 10 };

    if (window.MOCK && window.MOCK.students && window.MOCK.students.length > 0) {
        let students = window.MOCK.students;
        
        let activeStudents = students.filter(s => {
            let st = s.status || s.Status;
            return st !== 'สำเร็จการศึกษา' && st !== 'พ้นสภาพ';
        });
        if (activeStudents.length > 0) totalStudents = activeStudents.length;
        
        let alumniCount = window.MOCK.statusStudents ? 
            window.MOCK.statusStudents.filter(s => s.status === 'สำเร็จการศึกษา').length :
            students.filter(s => (s.status || s.Status) === 'สำเร็จการศึกษา').length;
            
        if (alumniCount > 0) alumni = alumniCount;
        
        let validGpas = students.map(s => parseFloat(s.gpa || s.GPAX || s.gpax)).filter(g => !isNaN(g) && g > 0);
        if (validGpas.length > 0) {
            avgGpa = (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2);
        }
        
        // Cohorts calc
        if (activeStudents.length > 0) {
            let cohortCounts = {};
            activeStudents.forEach(s => {
                let id = s.studentId || s.id || s.StudentID || "";
                let cohort = id.toString().substring(0, 2);
                if(cohort && !isNaN(cohort) && cohort.length === 2) {
                    cohortCounts[cohort] = (cohortCounts[cohort] || 0) + 1;
                }
            });
            if (Object.keys(cohortCounts).length > 0) {
                cohorts = cohortCounts;
            }

            // Majors calc
            let majorCounts = {};
            activeStudents.forEach(s => {
                let major = s.major || s.Major || s.program || s.department || 'อื่นๆ';
                if (major.includes('ผู้ใหญ่')) major = 'การพยาบาลผู้ใหญ่';
                else if (major.includes('เด็ก')) major = 'การพยาบาลเด็ก';
                else if (major.includes('บริหาร')) major = 'การบริหารทางการพยาบาล';
                else if (major.includes('ชุมชน')) major = 'การพยาบาลเวชปฏิบัติชุมชน';
                else if (major.includes('จิตเวช')) major = 'การพยาบาลจิตเวช';
                else if (major.includes('ผดุงครรภ์')) major = 'การผดุงครรภ์';
                else major = 'อื่นๆ';
                
                majorCounts[major] = (majorCounts[major] || 0) + 1;
            });
            
            if (Object.keys(majorCounts).length > 0) {
                let total = Object.values(majorCounts).reduce((a,b)=>a+b,0);
                majors = {};
                for(let m in majorCounts) {
                    majors[m] = Math.round((majorCounts[m]/total)*100);
                }
            }
        }
    }

    // 2. Generate Charts HTML
    let sortedCohorts = Object.keys(cohorts).sort();
    if (sortedCohorts.length > 5) sortedCohorts = sortedCohorts.slice(-5);
    
    let maxCohort = Math.max(...Object.values(cohorts));
    if (maxCohort === 0) maxCohort = 1;
    
    let cohortBarsHtml = sortedCohorts.map((cohort, idx) => {
        let count = cohorts[cohort];
        let height = Math.max(30, (count / maxCohort) * 180); // max height 180px
        let isLast = idx === sortedCohorts.length - 1;
        return `
            <div style="display:flex; flex-direction:column; align-items:center; width: 50px; transition: var(--transition-fast);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='none'">
                <span style="font-size:0.85rem; font-weight:${isLast ? '800' : '700'}; color:${isLast ? 'var(--accent-primary)' : 'var(--text-secondary)'}; margin-bottom:8px;">${count}</span>
                <div style="background:${isLast ? 'var(--accent-gradient-2)' : 'var(--accent-gradient)'}; width:100%; height:${height}px; border-radius: 6px 6px 0 0; opacity: ${isLast ? '1' : '0.8'}; box-shadow: var(--shadow-sm);"></div>
            </div>
        `;
    }).join('');
    
    let cohortLabelsHtml = sortedCohorts.map((cohort, idx) => {
        let isLast = idx === sortedCohorts.length - 1;
        return `<span style="font-size:0.9rem; font-weight:${isLast ? '700' : '600'}; color:${isLast ? 'var(--text-primary)' : 'var(--text-secondary)'}; width: 50px; text-align: center;">รหัส ${cohort}</span>`;
    }).join('');

    let sortedMajors = Object.keys(majors).sort((a,b) => majors[b] - majors[a]);
    let majorColors = [
        'var(--accent-gradient)',
        'linear-gradient(90deg, #10b981, #059669)',
        'linear-gradient(90deg, #f59e0b, #d97706)',
        'linear-gradient(90deg, #8b5cf6, #6d28d9)',
        'linear-gradient(90deg, #ec4899, #db2777)',
        'linear-gradient(90deg, #94a3b8, #64748b)'
    ];
    let majorHtml = sortedMajors.map((m, i) => {
        let pct = majors[m];
        if (pct === 0) return '';
        let color = majorColors[i % majorColors.length];
        return `
            <div>
                <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:8px;">
                    <span style="font-weight:500;">${m}</span>
                    <span style="font-weight:700; color:var(--text-primary);">${pct}%</span>
                </div>
                <div style="background:var(--bg-tertiary); height:12px; border-radius:6px; overflow:hidden;">
                    <div style="background:${color}; width:${pct}%; height:100%; border-radius:6px;"></div>
                </div>
            </div>
        `;
    }).join('');


    // 3. Render
    return `
    <div class="animate-in">
        <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 32px;">
            <div>
                <h2 class="page-title">สถิติและรายงาน (Analytics & Reports)</h2>
                <p class="page-subtitle">ภาพรวมข้อมูลนักศึกษาและผลการศึกษาเชิงลึกจากระบบ</p>
            </div>
            <div class="header-semester" style="padding: 10px 20px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm); background: var(--bg-card);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted)">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>อัปเดตล่าสุด: <span style="color:var(--accent-primary); font-weight: 700;">${new Date().toLocaleDateString('th-TH')}</span></span>
            </div>
        </div>

        <!-- 4 Summary Cards -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
            <div class="stat-card" style="padding: 24px 20px;">
                <div class="stat-icon" style="background:#eef2ff; color:#4f46e5;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>
                <div class="stat-info" style="flex:1;">
                    <span class="stat-label">นักศึกษาปัจจุบันทั้งหมด</span>
                    <h3 class="stat-value" style="margin: 4px 0;">${totalStudents.toLocaleString()}</h3>
                    <span class="stat-change up" style="display:inline-block;">↑ 5.2% จากปีที่แล้ว</span>
                </div>
            </div>

            <div class="stat-card" style="padding: 24px 20px;">
                <div class="stat-icon" style="background:#ecfdf5; color:#10b981;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                </div>
                <div class="stat-info" style="flex:1;">
                    <span class="stat-label">ศิษย์เก่า (จบการศึกษา)</span>
                    <h3 class="stat-value" style="margin: 4px 0;">${alumni.toLocaleString()}</h3>
                    <span class="stat-change up" style="display:inline-block;">↑ 340 คน ในปีนี้</span>
                </div>
            </div>

            <div class="stat-card" style="padding: 24px 20px;">
                <div class="stat-icon" style="background:#fff7ed; color:#f97316;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                </div>
                <div class="stat-info" style="flex:1;">
                    <span class="stat-label">เกรดเฉลี่ยรวม (GPAX)</span>
                    <h3 class="stat-value" style="margin: 4px 0;">${avgGpa}</h3>
                    <span class="stat-change" style="background:var(--bg-tertiary); color:var(--text-secondary); display:inline-block;">คงที่</span>
                </div>
            </div>

            <div class="stat-card" style="padding: 24px 20px;">
                <div class="stat-icon" style="background:#fdf2f8; color:#db2777;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="8" r="7"></circle>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                </div>
                <div class="stat-info" style="flex:1;">
                    <span class="stat-label">อัตราสำเร็จการศึกษาในเวลา</span>
                    <h3 class="stat-value" style="margin: 4px 0;">${gradRate}</h3>
                    <span class="stat-change up" style="display:inline-block;">↑ 1.5%</span>
                </div>
            </div>
        </div>

        <!-- Charts Layout -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 32px;">
            <!-- Bar Chart: Students by Cohort -->
            <div class="card" style="display:flex; flex-direction:column;">
                <div class="card-header">
                    <h3 class="card-title" style="display:flex; align-items:center; gap:8px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent-primary)">
                            <rect x="4" y="6" width="16" height="12" rx="2" ry="2"/>
                            <path d="M4 12h16"/>
                        </svg>
                        จำนวนนักศึกษาแยกตามรุ่น (รหัส)
                    </h3>
                </div>
                <div class="card-body" style="flex:1; display:flex; flex-direction:column; padding: 30px;">
                    <div style="display:flex; justify-content:space-around; align-items:flex-end; height:240px; padding: 0 10px; border-bottom: 2px solid var(--border-color); margin-bottom: 20px;">
                        ${cohortBarsHtml}
                    </div>
                    
                    <div style="display:flex; justify-content:space-around; align-items:center; padding: 0 10px;">
                        ${cohortLabelsHtml}
                    </div>
                </div>
            </div>

            <!-- Horizontal Bar Chart: Students by Major -->
            <div class="card" style="display:flex; flex-direction:column;">
                <div class="card-header">
                    <h3 class="card-title" style="display:flex; align-items:center; gap:8px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--success)">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/>
                        </svg>
                        สัดส่วนตามสาขาวิชา (ป.โท)
                    </h3>
                </div>
                <div class="card-body" style="flex:1; display:flex; flex-direction:column; justify-content:center; padding: 30px;">
                    <div style="display:flex; flex-direction:column; gap: 24px;">
                        ${majorHtml}
                    </div>
                </div>
            </div>
        </div>

    </div>`;
};
