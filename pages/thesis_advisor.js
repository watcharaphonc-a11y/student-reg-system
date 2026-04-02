// ============================
// Thesis Advisor Page
// ============================
pages['thesis-advisor'] = function() {
    const st = MOCK.student;
    const isAdmin = (window.currentUserRole === 'staff' || window.currentUserRole === 'admin');
    
    // Group all possible thesis teachers
    const allTeachers = MOCK.teachers || [];
    // If not categorized, just use all teachers as potential advisors
    const thesisTeachers = allTeachers.filter(t => (t.type || '').includes('Thesis') || (t.position || '').includes('อาจารย์') || (t.type || '') === 'อาจารย์ประจำ');
    
    // Active UI Filter State
    const activeAdvisorName = window.activeAdvisorName || null;
    
    // Helper for robust name matching
    const isMainMatch = (val, target) => {
        if (!val || !target) return false;
        const v = String(val).replace(/\s+/g, '').replace(/ผศ\.ดร\.|ดร\.|รศ\.ดร\.|พญ\.|นพ\.|นาง|นาย|นางสาว/g, '');
        const t = String(target).replace(/\s+/g, '').replace(/ผศ\.ดร\.|ดร\.|รศ\.ดร\.|พญ\.|นพ\.|นาง|นาย|นางสาว/g, '');
        return v.includes(t) || t.includes(v);
    };

    // Students filtered by active advisor
    const filteredStudents = (MOCK.students || []).filter(s => {
        if (!activeAdvisorName || activeAdvisorName === '-') return true;
        return isMainMatch(s.thesisAdvisor, activeAdvisorName);
    });

    // Content for Student Detail
    const assignedName = (st && st.thesisAdvisor) ? String(st.thesisAdvisor).trim() : '';
    const advisorsInfo = (assignedName === '-' || !assignedName) 
        ? [] 
        : thesisTeachers.filter(t => {
            return assignedName.includes(t.name);
        });

    // Content for Advisor Summary (if no student selected)
    const activeTeacher = activeAdvisorName ? thesisTeachers.find(t => t.name === activeAdvisorName) : null;
    const studentsOfTeacher = activeAdvisorName ? (MOCK.students || []).filter(s => isMainMatch(s.thesisAdvisor, activeAdvisorName)) : [];

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; margin-bottom:25px;">
            <div>
                <h1 class="page-title">อาจารย์ที่ปรึกษาวิทยานิพนธ์</h1>
                <p class="page-subtitle">จัดการและติดตามสถานะการแต่งตั้งอาจารย์ที่ปรึกษา</p>
            </div>

            ${isAdmin ? `
            <div style="display:flex; gap:10px; flex-grow: 1; max-width: 700px; justify-content: flex-end;">
                <!-- Level 1: Advisor Selector -->
                <div style="flex:1; min-width:250px;">
                    <label class="form-label" style="color:var(--text-secondary); font-weight:700;">1. เลือกชื่ออาจารย์ (FILTER BY ADVISOR)</label>
                    ${renderSearchableSelect('advisorSearchSelect', 
                        thesisTeachers.map(t => ({ value: t.name, label: t.name })), 
                        activeAdvisorName, 
                        '-- เลือกชื่ออาจารย์ --'
                    )}
                </div>
                
                <!-- Level 2: Student Selector (Filtered by Advisor) -->
                <div style="flex:1.2;">
                    <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">2. เลือกนักศึกษา (Select Student)</label>
                    <select class="form-input" onchange="changeProfileStudent(this.value)" style="height:42px;">
                        <option value="">-- ${activeAdvisorName ? 'เลือกคนในความดูแล' : 'เลือกนักศึกษา'} --</option>
                        ${filteredStudents.map(s => `
                            <option value="${s.id || s.studentId}" ${st && (st.id === s.id || st.studentId === s.studentId) ? 'selected' : ''}>
                                ${s.studentId || ''} - ${s.prefix || ''}${s.firstName || ''} ${s.lastName || ''}
                            </option>
                        `).join('')}
                    </select>
                </div>
            </div>
            ` : ''}
        </div>

        ${isAdmin ? `
        <div style="margin-bottom:20px; display:flex; justify-content:flex-end;">
            <button class="btn btn-primary" onclick="${st ? 'openEditStudentProfile()' : 'alert(\'กรุณาเลือกนักศึกษาก่อนแต่งตั้งครับ\')'}" style="gap:8px; opacity:${st ? 1 : 0.6};">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
                แต่งตั้ง/แก้ไขอาจารย์ที่ปรึกษา
            </button>
        </div>
        ` : ''}

        ${(isAdmin && !st && activeAdvisorName && activeTeacher) ? `
        <!-- Advisor Summary View -->
        <div class="animate-in animate-delay-1">
            <div class="card" style="margin-bottom:25px; border-left:5px solid var(--accent-primary);">
                <div class="card-body" style="display:flex; align-items:center; gap:25px; padding:25px;">
                    <div style="width:70px; height:70px; border-radius:50%; background:linear-gradient(135deg, var(--accent-primary), #c026d3); display:flex; align-items:center; justify-content:center; color:white; font-size:1.8rem; font-weight:800;">${(activeTeacher.name || 'T')[0]}</div>
                    <div style="flex:1;">
                        <div style="font-size:1.4rem; font-weight:800; color:var(--text-primary);">${activeAdvisorName}</div>
                        <div style="color:var(--text-muted); font-weight:500; margin-bottom:8px;">สาขาเชี่ยวชาญ: ${activeTeacher.Expertise || activeTeacher.expertise || '-'}</div>
                        <button class="btn btn-secondary btn-sm" onclick="window.openBulkAssignAdvisor('${activeAdvisorName}', 'thesisAdvisor')" style="padding:6px 12px; font-size:0.8rem; gap:6px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                            มอบหมายนักศึกษาเพิ่ม (Bulk Assign)
                        </button>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:0.7rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">นักศึกษาในความดูแล</div>
                        <div style="font-size:2rem; font-weight:900; color:var(--accent-primary); line-height:1;">${studentsOfTeacher.length} <span style="font-size:1rem; font-weight:600;">คน</span></div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3 class="card-title">รายชื่อนักศึกษาในความดูแลของ ${activeAdvisorName}</h3></div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>รหัสนักศึกษา</th>
                                    <th>ชื่อ-สกุล</th>
                                    <th>หลักสูตร</th>
                                    <th>สถานะ</th>
                                    <th style="text-align:center;">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${studentsOfTeacher.map(s => `
                                    <tr>
                                        <td style="font-weight:600;">${s.studentId || ''}</td>
                                        <td>${s.prefix || ''}${s.firstName || ''} ${s.lastName || ''}</td>
                                        <td>${s.program || '-'}</td>
                                        <td>${getStatusBadge(s.status || 'กำลังศึกษา')}</td>
                                        <td style="text-align:center;">
                                            <button class="btn btn-ghost btn-sm" onclick="changeProfileStudent('${s.id || s.studentId}')" style="color:var(--accent-primary); font-weight:700;">ดูข้อมูล</button>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${studentsOfTeacher.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--text-muted);">ยังไม่มีนักศึกษาในความดูแล</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        ` : `
        
        <!-- Default Student Detail View -->
        ${!st ? `
            <div class="card animate-in animate-delay-1"><div class="card-body" style="text-align:center; padding:80px; color:var(--text-muted);">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:20px; opacity:0.3;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <h3 style="font-weight:600;">กรุณาเลือกนักศึกษาเพื่อดูข้อมูล</h3>
                <p style="font-size:0.9rem;">คุณสามารถเลือกดูตามชื่ออาจารย์ที่ปรึกษา หรือค้นหารายชื่อนักศึกษาโดยตรงจากด้านบน</p>
            </div></div>
        ` : `
        <div class="card animate-in animate-delay-1" style="margin-bottom:18px;">
            <div class="card-header"><h3 class="card-title">ข้อมูลวิทยานิพนธ์</h3></div>
            <div class="card-body">
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:20px;">
                    <div><span style="color:var(--text-muted); font-size:0.85rem;">ชื่อนักศึกษา:</span> <div style="font-weight:600;">${st.prefix || ''}${st.firstName || ''} ${st.lastName || ''}</div></div>
                    <div><span style="color:var(--text-muted); font-size:0.85rem;">รหัสนักศึกษา:</span> <div style="font-weight:600;">${st.studentId || st.id || '-'}</div></div>
                    <div style="grid-column: 1 / -1;"><span style="color:var(--text-muted); font-size:0.85rem;">หัวข้อวิทยานิพนธ์:</span> <div style="font-weight:600; line-height:1.5;">${st.thesisInfo?.title || 'ยังไม่ได้ระบุหัวข้อ'}</div></div>
                    <div style="grid-column: 1 / -1;"><span style="color:var(--text-muted); font-size:0.85rem;">Thesis Topic (EN):</span> <div style="font-weight:600; font-style:italic; line-height:1.5;">${st.thesisInfo?.titleEn || 'Not specified'}</div></div>
                    <div><span style="color:var(--text-muted); font-size:0.85rem;">สถานะวิทยานิพนธ์:</span> <div>${getStatusBadge(st.thesisInfo?.status || 'อยู่ระหว่างดำเนินการ')}</div></div>
                </div>
            </div>
        </div>

        <div class="card animate-in animate-delay-2">
            <div class="card-header"><h3 class="card-title">อาจารย์ที่ปรึกษาวิทยานิพนธ์ที่แต่งตั้ง</h3></div>
            <div class="card-body">
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
                ${advisorsInfo.map(a => `
                    <div style="border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; background:var(--bg-secondary); display:flex; align-items:center; gap:15px;">
                        <div style="width:45px; height:45px; border-radius:50%; background:var(--accent-primary); display:flex; align-items:center; justify-content:center; color:white; font-weight:700;">${(a.name || 'T')[0]}</div>
                        <div>
                            <div style="font-weight:600;">${a.name}</div>
                            <div style="font-size:0.8rem; color:var(--text-muted);">${a.position || '-'}</div>
                        </div>
                    </div>
                `).join('')}
                ${advisorsInfo.length === 0 ? '<div style="text-align:center; padding:30px; color:var(--text-muted); width:100%;">ยังไม่ได้รับการแต่งตั้งอาจารย์ที่ปรึกษาวิทยานิพนธ์</div>' : ''}
                </div>
            </div>
        </div>
        `}
        `}
    </div>`;
};
