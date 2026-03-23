// ============================
// Student Profile Page
// ============================
pages['student-profile'] = function() {
    const st = MOCK.student;
    const creditPercent = Math.round((st.totalCredits / st.requiredCredits) * 100);
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ข้อมูลนักศึกษา</h1>
            <p class="page-subtitle">ข้อมูลส่วนตัวและข้อมูลการศึกษา</p>
        </div>
        <div class="profile-header animate-in animate-delay-1">
            <div class="profile-avatar-large">${st.firstName[0]}</div>
            <div class="profile-details">
                <h2>${st.prefix}${st.firstName} ${st.lastName}</h2>
                <div class="student-id">รหัสนักศึกษา: ${st.id}</div>
                <div class="profile-meta">
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        ${st.faculty}
                    </div>
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        ${st.department}
                    </div>
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ชั้นปีที่ ${st.year}
                    </div>
                    <div class="profile-meta-item">${getStatusBadge(st.status)}</div>
                </div>
            </div>
        </div>
        <div class="grid-2">
            <div class="card animate-in animate-delay-2">
                <div class="card-header"><h3 class="card-title">ข้อมูลส่วนตัว</h3></div>
                <div class="card-body">
                    <div class="transcript-info">
                        <div class="transcript-info-item"><span class="label">ชื่อ-สกุล (EN):</span><span>${st.firstNameEn} ${st.lastNameEn}</span></div>
                        <div class="transcript-info-item"><span class="label">วันเกิด:</span><span>${st.dob}</span></div>
                        <div class="transcript-info-item"><span class="label">อีเมล:</span><span>${st.email}</span></div>
                        <div class="transcript-info-item"><span class="label">โทรศัพท์:</span><span>${st.phone}</span></div>
                        <div class="transcript-info-item"><span class="label">ที่อยู่:</span><span>${st.address}</span></div>
                        <div class="transcript-info-item"><span class="label">ผู้ปกครอง:</span><span>${st.parentName}</span></div>
                        <div class="transcript-info-item"><span class="label">เบอร์ผู้ปกครอง:</span><span>${st.parentPhone}</span></div>
                    </div>
                </div>
            </div>
            <div class="card animate-in animate-delay-3">
                <div class="card-header"><h3 class="card-title">ข้อมูลการศึกษา</h3></div>
                <div class="card-body">
                    <div style="text-align:center;margin-bottom:20px;">
                        <div class="gpa-circle">
                            <div class="gpa-circle-inner">
                                <div class="gpa-value">${st.gpa.toFixed(2)}</div>
                                <div class="gpa-label">GPA สะสม</div>
                            </div>
                        </div>
                    </div>
                    <div class="transcript-info">
                        <div class="transcript-info-item"><span class="label">หลักสูตร:</span><span>${st.program}</span></div>
                        <div class="transcript-info-item"><span class="label">ปีที่เข้าศึกษา:</span><span>${st.admissionYear}</span></div>
                        <div class="transcript-info-item"><span class="label">อาจารย์ที่ปรึกษา:</span><span>${st.advisor}</span></div>
                    </div>
                    <div style="margin-top:18px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.82rem">
                            <span>หน่วยกิตสะสม</span><span>${st.totalCredits} / ${st.requiredCredits}</span>
                        </div>
                        <div class="progress-bar"><div class="progress-fill" style="width:${creditPercent}%"></div></div>
                        <div style="text-align:right;font-size:0.72rem;color:var(--text-muted);margin-top:4px">${creditPercent}%</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};
