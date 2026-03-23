// ============================
// Transcript Page
// ============================
pages.transcript = function() {
    const st = MOCK.student;
    const allGrades = MOCK.grades.flatMap(s => s.courses.filter(c => c.grade));
    const totalGradeCredits = allGrades.reduce((s,c) => s + c.credits, 0);
    const totalPoints = allGrades.reduce((s,c) => s + (c.point * c.credits), 0);
    const cumulativeGPA = totalGradeCredits > 0 ? (totalPoints / totalGradeCredits).toFixed(2) : '0.00';

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
                <h1 class="page-title">ใบแสดงผลการศึกษา</h1>
                <p class="page-subtitle">Transcript of Academic Records</p>
            </div>
            <button class="btn btn-primary" onclick="window.print()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                พิมพ์ / ดาวน์โหลด
            </button>
        </div>
        <div class="transcript animate-in animate-delay-1">
            <div class="transcript-header">
                <h2>🎓 มหาวิทยาลัยเทคโนโลยีแห่งประเทศไทย</h2>
                <p>Thailand University of Technology</p>
                <p style="margin-top:8px;font-weight:600">ใบแสดงผลการศึกษา (Transcript)</p>
            </div>
            <div class="transcript-info" style="margin-bottom:28px">
                <div class="transcript-info-item"><span class="label">รหัสนักศึกษา:</span><span>${st.id}</span></div>
                <div class="transcript-info-item"><span class="label">ชื่อ-สกุล:</span><span>${st.prefix}${st.firstName} ${st.lastName}</span></div>
                <div class="transcript-info-item"><span class="label">Name:</span><span>${st.firstNameEn} ${st.lastNameEn}</span></div>
                <div class="transcript-info-item"><span class="label">คณะ:</span><span>${st.faculty}</span></div>
                <div class="transcript-info-item"><span class="label">ภาควิชา:</span><span>${st.department}</span></div>
                <div class="transcript-info-item"><span class="label">หลักสูตร:</span><span>${st.program}</span></div>
                <div class="transcript-info-item"><span class="label">ปีที่เข้า:</span><span>${st.admissionYear}</span></div>
                <div class="transcript-info-item"><span class="label">สถานะ:</span><span>${st.status}</span></div>
            </div>
            ${MOCK.grades.filter(s => s.gpa !== null).map(sem => `
                <h4 style="margin:20px 0 10px;font-size:0.9rem;color:var(--accent-primary-hover)">${sem.semester}</h4>
                <table class="data-table" style="margin-bottom:8px">
                    <thead><tr><th>รหัส</th><th>ชื่อวิชา</th><th>หน่วยกิต</th><th>เกรด</th><th>คะแนน</th></tr></thead>
                    <tbody>
                        ${sem.courses.filter(c=>c.grade).map(c => `<tr><td>${c.code}</td><td>${c.name}</td><td style="text-align:center">${c.credits}</td><td style="text-align:center;font-weight:600">${c.grade}</td><td style="text-align:center">${c.point.toFixed(2)}</td></tr>`).join('')}
                    </tbody>
                </table>
                <div style="text-align:right;font-size:0.82rem;color:var(--text-muted);margin-bottom:16px">GPA ภาคเรียน: <strong style="color:var(--text-primary)">${sem.gpa.toFixed(2)}</strong> · หน่วยกิตรวม: ${sem.totalCredits}</div>
            `).join('')}
            <div style="border-top:2px solid var(--border-color);padding-top:20px;margin-top:20px;display:flex;justify-content:space-between;align-items:center">
                <div>
                    <div style="font-size:0.88rem;font-weight:700">เกรดเฉลี่ยสะสม (GPAX): <span style="color:var(--accent-primary-hover);font-size:1.1rem">${cumulativeGPA}</span></div>
                    <div style="font-size:0.82rem;color:var(--text-muted)">หน่วยกิตสะสม: ${totalGradeCredits} / ${st.requiredCredits}</div>
                </div>
            </div>
        </div>
    </div>`;
};
