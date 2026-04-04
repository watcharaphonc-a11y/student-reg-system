// ============================
// Teacher Profile Page
// ============================
pages['teacher-profile'] = function() {
    // If we have a specifically selected teacher to view, or default to logged-in teacher if staff
    let teacher = MOCK.selectedTeacher;
    if (!teacher) {
        if (window.currentUserRole === 'staff') {
            teacher = MOCK.teacher || MOCK.academicAdvisors[0];
        } else {
            teacher = MOCK.academicAdvisors[0];
        }
    }

    if (!teacher) {
        return `
        <div class="animate-in">
            <div class="page-header">
                <h1 class="page-title">ข้อมูลอาจารย์</h1>
                <p class="page-subtitle">ไม่พบข้อมูลอาจารย์ในระบบ</p>
            </div>
            <div class="card"><div class="card-body" style="text-align:center; padding:40px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin-bottom:15px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <h3 style="color:var(--text-muted);">ยังไม่มีข้อมูลอาจารย์</h3>
            </div></div>
        </div>`;
    }

    const initial = teacher.name ? teacher.name[0] : '?';

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:15px;">
            <div>
                <h1 class="page-title">ข้อมูลอาจารย์</h1>
                <p class="page-subtitle">ข้อมูลส่วนตัวและภาระงานสอน</p>
            </div>
            
            <div style="display:flex; gap:12px; align-items: center;">
                ${(window.currentUserRole === 'staff' || window.currentUserRole === 'admin') ? `
                <div style="flex-grow: 1; min-width: 250px;">
                    <select id="teacherSelector" class="form-input" onchange="window.changeProfileTeacher(this.value)" style="padding-right: 30px; height:38px;">
                        <option value="">-- เลือกอาจารย์ --</option>
                        ${(MOCK.academicAdvisors || []).map(t => `
                            <option value="${t.name}" ${(teacher && teacher.name === t.name) ? 'selected' : ''}>
                                ${t.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                ` : ''}

                ${(window.currentUserRole === 'admin') ? `
                <div style="display:flex; gap:10px;">
                    <button class="btn btn-secondary" onclick="exportTeacherTemplate()" style="gap:6px; font-size:0.85rem; height:38px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Template
                    </button>
                    <button class="btn btn-primary" onclick="importTeacherData()" style="gap:6px; font-size:0.85rem; height:38px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        นำเข้าข้อมูล
                    </button>
                </div>
                ` : ''}
            </div>
        </div>

        <div class="profile-header animate-in animate-delay-1">
            <div class="profile-avatar-large" style="background:var(--accent-gradient-blue)">${initial}</div>
            <div class="profile-details">
                <h2>${teacher.name}</h2>
                <div class="student-id" style="background:rgba(59, 130, 246, 0.1); color:var(--accent-secondary);">${teacher.position || 'อาจารย์'}</div>
                <div class="profile-meta">
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        ${teacher.faculty || 'คณะพยาบาลศาสตร์'}
                    </div>
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        ${teacher.expertise || '-'}
                    </div>
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        นักศึกษาในที่ปรึกษา: ${teacher.studentCount || 0} คน
                    </div>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card animate-in animate-delay-2">
                <div class="card-header"><h3 class="card-title">ข้อมูลการติดต่อ</h3></div>
                <div class="card-body">
                    <div class="transcript-info">
                        <div class="transcript-info-item"><span class="label">อีเมล:</span><span><a href="mailto:${teacher.email}">${teacher.email || '-'}</a></span></div>
                        <div class="transcript-info-item"><span class="label">โทรศัพท์:</span><span>${teacher.phone || '-'}</span></div>
                        <div class="transcript-info-item"><span class="label">คณะ/สังกัด:</span><span>${teacher.faculty || '-'}</span></div>
                        <div class="transcript-info-item"><span class="label">เวลาให้คำปรึกษา:</span><span>จันทร์ 10:00 - 12:00</span></div>
                    </div>
                </div>
            </div>
            <div class="card animate-in animate-delay-3">
                <div class="card-header"><h3 class="card-title">ความเชี่ยวชาญ / ผลงาน</h3></div>
                <div class="card-body">
                    <div class="transcript-info">
                        <div class="transcript-info-item"><span class="label">สาขาเชี่ยวชาญ:</span><span>${teacher.expertise || '-'}</span></div>
                        <div class="transcript-info-item"><span class="label">วุฒิการศึกษา:</span><span>ปริญญาเอก (Ph.D.)</span></div>
                    </div>
                    <div style="margin-top:15px; padding-top:15px; border-top:1px dashed var(--border-color);">
                        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">
                            มีผลงานวิจัยตีพิมพ์ในวารสารระดับชาติและนานาชาติอย่างต่อเนื่อง และเป็นผู้เชี่ยวชาญในการให้คำปรึกษาวิทยานิพนธ์ระดับบัณฑิตศึกษา
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Teacher List Selection (If Admin) -->
        ${(window.currentUserRole === 'admin') ? `
        <div class="card animate-in animate-delay-4" style="margin-top:20px;">
            <div class="card-header"><h3 class="card-title">รายชื่ออาจารย์ทั้งหมด</h3></div>
            <div class="card-body" style="padding:0;">
                <div class="table-wrapper" style="max-height:300px; overflow-y:auto;">
                    <table class="data-table">
                        <thead><tr><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th><th>ความเชี่ยวชาญ</th><th>จัดการ</th></tr></thead>
                        <tbody>
                            ${MOCK.academicAdvisors.map(t => `
                                <tr>
                                    <td style="font-weight:600;">${t.name}</td>
                                    <td><span class="badge info">${t.position}</span></td>
                                    <td>${t.expertise}</td>
                                    <td><button class="btn btn-secondary" style="padding:4px 12px; font-size:0.8rem;" onclick="selectTeacher('${t.name}')">เลือกดู</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        ` : ''}
    </div>`;
};

window.selectTeacher = function(name) {
    const teacher = MOCK.academicAdvisors.find(t => t.name === name);
    if (teacher) {
        MOCK.selectedTeacher = teacher;
        renderPage();
    }
};

window.changeProfileTeacher = function(name) {
    if (!name) return;
    const teacher = MOCK.academicAdvisors.find(t => t.name === name);
    if (teacher) {
        MOCK.selectedTeacher = teacher;
        renderPage();
    }
};

window.exportTeacherTemplate = function() {
    const headers = ['ชื่อ-นามสกุล','ตำแหน่ง','ความเชี่ยวชาญ','อีเมล','โทรศัพท์','นศ. ในที่ปรึกษา'];
    const sample = ['รศ.ดร.สมศรี ใจสว่าง','รองศาสตราจารย์','การพยาบาลจิตเวชและสุขภาพจิต','somsri.j@pi.ac.th','02-123-4567 ต่อ 201','8'];
    downloadCSVTemplate('template_ข้อมูลอาจารย์.csv', headers, sample);
};

window.importTeacherData = function() {
    handleGenericCSVImport((data) => {
        if (data && data.length > 0) {
            // Update the selected teacher with the first row of imported data
            const row = data[0];
            if (MOCK.selectedTeacher) {
                MOCK.selectedTeacher.name = row['ชื่อ-นามสกุล'] || MOCK.selectedTeacher.name;
                MOCK.selectedTeacher.position = row['ตำแหน่ง'] || MOCK.selectedTeacher.position;
                MOCK.selectedTeacher.expertise = row['ความเชี่ยวชาญ'] || MOCK.selectedTeacher.expertise;
                MOCK.selectedTeacher.email = row['อีเมล'] || MOCK.selectedTeacher.email;
                MOCK.selectedTeacher.phone = row['โทรศัพท์'] || MOCK.selectedTeacher.phone;
                MOCK.selectedTeacher.studentCount = parseInt(row['นศ. ในที่ปรึกษา']) || MOCK.selectedTeacher.studentCount;
            } else {
                // If none selected, add as new or update first
                MOCK.selectedTeacher = {
                    name: row['ชื่อ-นามสกุล'],
                    position: row['ตำแหน่ง'],
                    expertise: row['ความเชี่ยวชาญ'],
                    email: row['อีเมล'],
                    phone: row['โทรศัพท์'],
                    studentCount: parseInt(row['นศ. ในที่ปรึกษา'])
                };
            }
            alert('นำเข้าข้อมูลอาจารย์สำเร็จ');
            renderPage();
        }
    });
};
