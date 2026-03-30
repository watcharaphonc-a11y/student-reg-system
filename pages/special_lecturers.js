// ============================
// Special Lecturers Database Page
// ============================

pages['special-lecturers'] = function() {
    const lecturers = MOCK.specialLecturers || [];
    const searchTerm = (window._specialLecturerSearch || '').toLowerCase();
    
    const filtered = lecturers.filter(t => 
        (t.name || '').toLowerCase().includes(searchTerm) || 
        (t.expertise || '').toLowerCase().includes(searchTerm) ||
        (t.position || '').toLowerCase().includes(searchTerm)
    );

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
                <h1 class="page-title">ฐานข้อมูลอาจารย์พิเศษ</h1>
                <p class="page-subtitle">จัดการข้อมูลอาจารย์พิเศษประเมินรายวิชาระดับบัณฑิตศึกษา</p>
            </div>
            ${(window.currentUserRole === 'admin' || window.currentUserRole === 'staff') ? `
            <button class="btn btn-primary" onclick="navigateTo('teacher-registration')" style="gap:8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                เพิ่มอาจารย์พิเศษ
            </button>
            ` : ''}
        </div>

        <div class="card animate-in animate-delay-1" style="margin-bottom:24px;">
            <div class="card-body">
                <div style="display:flex; gap:16px; align-items:center;">
                    <div style="flex:1; position:relative;">
                        <input type="text" class="form-input" placeholder="ค้นหาตามชื่อ, ความเชี่ยวชาญ หรือตำแหน่ง..." 
                               value="${window._specialLecturerSearch || ''}"
                               onkeyup="window._specialLecturerSearch=this.value; if(event.key==='Enter') renderPage();"
                               style="padding-left:40px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" 
                             style="position:absolute; left:12px; top:50%; transform:translateY(-50%);">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </div>
                    <button class="btn btn-secondary" onclick="renderPage()">ค้นหา</button>
                </div>
            </div>
        </div>

        <div class="card animate-in animate-delay-2">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">รายชื่ออาจารย์พิเศษ (${filtered.length} ท่าน)</h3>
                <div class="badge info">อาจารย์พิเศษจะถูกนำไปใช้ในหน้าประเมินรายวิชา</div>
            </div>
            <div class="card-body" style="padding:0;">
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>ตำแหน่ง/วุฒิ</th>
                                <th>ความเชี่ยวชาญ</th>
                                <th>การติดต่อ</th>
                                <th>การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filtered.map((t, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:10px;">
                                            <div style="width:32px;height:32px;border-radius:50%;background:var(--accent-gradient-blue);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:0.8rem;">${t.name[0]}</div>
                                            <div style="font-weight:600;">${t.name}</div>
                                        </div>
                                    </td>
                                    <td><span class="badge info">${t.position}</span></td>
                                    <td>${t.expertise}</td>
                                    <td style="font-size:0.82rem; color:var(--text-muted);">
                                        <div>📧 ${t.email}</div>
                                        <div>📱 ${t.phone}</div>
                                    </td>
                                    <td>
                                        <button class="btn btn-secondary btn-sm" onclick="viewLecturerProfile('${t.username || t.name}')">ดูโปรไฟล์</button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${filtered.length === 0 ? `<tr><td colspan="6" style="text-align:center; padding:40px; color:var(--text-muted);">ไม่พบข้อมูลอาจารย์พิเศษ</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

window.viewLecturerProfile = function(username) {
    const teacher = (MOCK.specialLecturers || []).find(t => t.username === username || t.name === username);
    if (teacher) {
        MOCK.selectedTeacher = teacher;
        navigateTo('teacher-profile');
    }
};
