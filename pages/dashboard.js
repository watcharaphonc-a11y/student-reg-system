// ============================
// Dashboard Page
// ============================
pages.dashboard = function() {
    const s = MOCK.dashboardStats;
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
                <div class="stat-value">${formatMoney(s.totalStudents)}</div>
                <div class="stat-label">นักศึกษาทั้งหมด</div>
                <span class="stat-change up">↑ 5.2%</span>
            </div>
            <div class="stat-card animate-in animate-delay-2">
                <div class="stat-icon blue">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div class="stat-value">${s.totalCourses}</div>
                <div class="stat-label">รายวิชาที่เปิดสอน</div>
                <span class="stat-change up">↑ 3.1%</span>
            </div>
            <div class="stat-card animate-in animate-delay-3">
                <div class="stat-icon orange">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <div class="stat-value">${s.pendingPayments}</div>
                <div class="stat-label">รอชำระเงิน</div>
                <span class="stat-change down">↓ 2.4%</span>
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
