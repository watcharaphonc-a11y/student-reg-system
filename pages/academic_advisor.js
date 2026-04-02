// ============================
// Academic Advisor Page
// ============================
pages['academic-advisor'] = function() {
    const st = MOCK.student;
    
    // Filter advisors to only show those assigned to the student
    const assignedName = (st && st.advisor) ? String(st.advisor).trim() : '';
    const allAcademicAdvisors = MOCK.teachers ? MOCK.teachers.filter(t => (t.Type || t['ประเภทบคลากร']) === 'Academic' || (t.position || '').includes('อาจารย์')) : [];
    
    // The specific advisor(s) for the current student
    const myAdvisors = (assignedName === '-' || !assignedName)
        ? []
        : allAcademicAdvisors.filter(t => {
            const fullName = (t.Prefix || '') + (t.FirstName || '') + ' ' + (t.LastName || '');
            return assignedName.includes(fullName);
        });

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">อาจารย์ที่ปรึกษาด้านวิชาการ</h1>
            <p class="page-subtitle">ข้อมูลอาจารย์ที่ปรึกษาด้านวิชาการประจำหลักสูตร</p>
        </div>

        ${(window.currentUserRole === 'staff' || window.currentUserRole === 'admin') ? `
        <div style="margin-bottom:20px; display:flex; justify-content:flex-end;">
            <button class="btn btn-primary" onclick="openEditStudentProfile()" style="gap:8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
                แต่งตั้ง/แก้ไขอาจารย์ที่ปรึกษา
            </button>
        </div>
        ` : ''}

        <!-- My Academic Advisor -->
        <div class="card animate-in animate-delay-1" style="margin-bottom:18px;">
            <div class="card-header"><h3 class="card-title">อาจารย์ที่ปรึกษาของฉัน</h3></div>
            <div class="card-body">
                ${myAdvisors.length > 0 ? `
                <div style="display:flex; align-items:center; gap:20px; padding:10px 0;">
                    <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg, var(--accent-primary), #e74c3c);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1.5rem;">${myAdvisors[0].name[0]}</div>
                    <div>
                        <div style="font-weight:700; font-size:1.15rem;">${myAdvisors[0].name}</div>
                        <div style="font-size:0.85rem; color:var(--accent-primary); font-weight:500;">${myAdvisors[0].position}</div>
                        <div style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">📧 ${myAdvisors[0].email} &nbsp; 📱 ${myAdvisors[0].phone}</div>
                    </div>
                </div>` : '<div style="text-align:center; padding:30px; color:var(--text-muted);">ยังไม่ได้รับการแต่งตั้งอาจารย์ที่ปรึกษา</div>'}
            </div>
        </div>

        <!-- Consultation Schedule -->
        <div class="card animate-in animate-delay-2" style="margin-bottom:18px;">
            <div class="card-header"><h3 class="card-title">ตารางให้คำปรึกษา</h3></div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>วัน</th>
                                <th>เวลา</th>
                                <th>สถานที่</th>
                                <th>หมายเหตุ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(MOCK.consultationSchedule || []).map(s => `
                                <tr>
                                    <td>${s.day}</td>
                                    <td>${s.time}</td>
                                    <td>${s.location}</td>
                                    <td>${s.note || '-'}</td>
                                </tr>
                            `).join('')}
                            ${(MOCK.consultationSchedule || []).length === 0 ? '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">ยังไม่มีตารางให้คำปรึกษา</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- All Academic Advisors in Program -->
        <div class="card animate-in animate-delay-3">
            <div class="card-header"><h3 class="card-title">อาจารย์ที่ปรึกษาทั้งหมดในหลักสูตร</h3></div>
            <div class="card-body">
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
                ${allAcademicAdvisors.map(a => `
                    <div style="border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; background:var(--bg-secondary);">
                        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
                            <div style="width:42px;height:42px;border-radius:50%;background:var(--accent-primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:1rem;">${(a.FirstName||'A')[0]}</div>
                            <div>
                                <div style="font-weight:600;">${(a.Prefix||'')+(a.FirstName||'')+' '+(a.LastName||'')}</div>
                                <div style="font-size:0.8rem; color:var(--text-muted);">${a.position || a.Position || '-'}</div>
                            </div>
                        </div>
                        <div style="font-size:0.82rem; display:flex; flex-direction:column; gap:4px;">
                            <div><span style="color:var(--text-muted);">สาขาเชี่ยวชาญ:</span> ${a.Expertise || a.expertise || '-'}</div>
                            <div><span style="color:var(--text-muted);">อีเมล:</span> ${a.Email || a.email || '-'}</div>
                            <div><span style="color:var(--text-muted);">โทรศัพท์:</span> ${a.Phone || a.phone || '-'}</div>
                        </div>
                    </div>
                `).join('')}
                </div>
            </div>
        </div>
    </div>`;
};
