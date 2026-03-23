// ============================
// Grades Page
// ============================
pages.grades = function() {
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ผลการเรียน / เกรด</h1>
            <p class="page-subtitle">ผลการเรียนแยกตามภาคเรียน</p>
        </div>
        <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
            <div class="stat-card animate-in animate-delay-1" style="text-align:center">
                <div class="gpa-circle" style="width:100px;height:100px;margin-bottom:8px">
                    <div class="gpa-circle-inner" style="width:78px;height:78px">
                        <div class="gpa-value" style="font-size:1.4rem">${MOCK.student.gpa.toFixed(2)}</div>
                        <div class="gpa-label">GPA สะสม</div>
                    </div>
                </div>
            </div>
            <div class="stat-card animate-in animate-delay-2">
                <div class="stat-icon green"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                <div class="stat-value">${MOCK.student.totalCredits}</div>
                <div class="stat-label">หน่วยกิตสะสม</div>
            </div>
            <div class="stat-card animate-in animate-delay-3">
                <div class="stat-icon blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
                <div class="stat-value">${MOCK.student.requiredCredits - MOCK.student.totalCredits}</div>
                <div class="stat-label">หน่วยกิตคงเหลือ</div>
            </div>
        </div>
        ${MOCK.grades.map((sem, i) => `
            <div class="card animate-in animate-delay-${Math.min(i+2,4)}" style="margin-bottom:18px">
                <div class="card-header">
                    <h3 class="card-title">${sem.semester}</h3>
                    <span class="badge ${sem.gpa ? (sem.gpa >= 3.5 ? 'success' : sem.gpa >= 3.0 ? 'info' : 'warning') : 'neutral'}">
                        ${sem.gpa ? `GPA: ${sem.gpa.toFixed(2)}` : 'รอผลการเรียน'}
                    </span>
                </div>
                <div class="card-body" style="padding:0">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>รหัสวิชา</th><th>ชื่อวิชา</th><th>หน่วยกิต</th><th>เกรด</th><th>คะแนน</th></tr></thead>
                            <tbody>
                                ${sem.courses.map(c => `
                                    <tr>
                                        <td style="color:var(--accent-primary-hover);font-weight:600">${c.code}</td>
                                        <td>${c.name}</td>
                                        <td style="text-align:center">${c.credits}</td>
                                        <td><span class="badge ${c.grade==='A'?'success':c.grade==='B+'||c.grade==='B'?'info':c.grade?'warning':'neutral'}">${c.grade || 'รอผล'}</span></td>
                                        <td>${c.point !== null ? c.point.toFixed(2) : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>`;
};
