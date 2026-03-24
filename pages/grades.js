// ============================
// Grades Page
// ============================

// Utility to download CSV
window.downloadGradeTemplate = function() {
    // Headers matching the user's provided image
    const csvContent = "student_id,academic_year,semester,course_code,course_name,credits,grade\n65100502001,2565,2,100500101,ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ,3(3-0-6),A\n65100502001,2565,2,100500102,ทฤษฎีและแนวคิดทางการพยาบาล,2(2-0-4),A\n65100502004,2565,2,100500101,ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ,3(3-0-6),A";
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "term_grade_import_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.openGradeImportModal = function() {
    const modalHtml = `
        <div style="margin-bottom:15px;text-align:center;">
            <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:15px;">
                ดาวน์โหลดแบบฟอร์ม (CSV) เพื่อดูรูปแบบการนำเข้าข้อมูล
            </p>
            <button class="btn" style="background-color:var(--bg-secondary);" onclick="downloadGradeTemplate()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                ดาวน์โหลด Template (CSV)
            </button>
        </div>
        
        <div class="form-group" style="margin-top:20px;">
            <label class="form-label">เลือกไฟล์ CSV ที่ต้องการนำเข้า</label>
            <input type="file" id="gradeCsvFile" class="form-input" accept=".csv" />
        </div>
        
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:25px;">
            <button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button>
            <button class="btn btn-primary" onclick="processGradeImport()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                อัปโหลดและบันทึก
            </button>
        </div>
    `;
    openModal("นำเข้าผลการเรียน (Import Grades)", modalHtml);
};

window.processGradeImport = function() {
    const fileInput = document.getElementById('gradeCsvFile');
    if (!fileInput.files.length) {
        alert("กรุณาเลือกไฟล์ CSV");
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = async function(e) {
        showApiLoading('กำลังประมวลผลและบันทึกข้อมูลเกรดลง Google Sheet...');
        const text = e.target.result;
        const lines = text.split('\n');
        
        const gradesToUpload = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if(!line) continue;
            
            const cols = line.split(',');
            if (cols.length >= 7) {
                const sId = cols[0].trim();
                const aYear = cols[1].trim();
                const sem = cols[2].trim();
                const cCode = cols[3].trim();
                const cName = cols[4].trim();
                const creditsRaw = cols[5].trim();
                const cGrade = cols[6].trim();
                
                // Add to upload array (Matching GAS Enrollments headers)
                gradesToUpload.push({
                    'รหัสนักศึกษา': sId,
                    'รหัสวิชา': cCode,
                    'ชื่อวิชา': cName,
                    'หน่วยกิต': creditsRaw, // Keep raw string for credits
                    'ภาคเรียน': sem,
                    'ปีการศึกษา': aYear,
                    'เกรด': cGrade
                });
            }
        }
        
        if (gradesToUpload.length === 0) {
            hideApiLoading();
            alert('ไม่พบข้อมูลในไฟล์ หรือรูปแบบไฟล์ไม่ถูกต้อง');
            return;
        }

        try {
            const result = await postData('importGrades', { grades: gradesToUpload });
            hideApiLoading();
            
            if (result && result.status === 'success') {
                closeModal();
                alert(`นำเข้าข้อมูลสำเร็จ (บันทึกลง Sheet ทั้งหมด ${result.count} รายการ)`);
                
                // Trigger global sync to refresh all data
                if (typeof window.syncActiveStudentData === 'function') {
                    await window.syncActiveStudentData();
                } else {
                    location.reload(); // Fallback if sync is not available yet
                }
                renderPage();
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (result ? result.message : 'Unknown Error'));
            }
        } catch (err) {
            hideApiLoading();
            console.error('Import Error:', err);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + err.message);
        }
    };
    reader.readAsText(file);
};

window.filterGradesBySemester = function(selectEl) {
    const selectedVal = selectEl.value;
    const cards = document.querySelectorAll('.grade-semester-card');
    cards.forEach(card => {
        if (selectedVal === 'all') {
            card.style.display = 'block';
        } else {
            if (card.getAttribute('data-semester') === selectedVal) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
};

window.gradesViewMode = 'overview'; // Default for Admin/Staff

window.changeGradesViewMode = function(mode) {
    window.gradesViewMode = mode;
    renderPage();
};

window.selectStudentForGrades = function(studentId) {
    const selected = (MOCK.students || []).find(s => (s.id || s.studentId) === studentId);
    if (selected) {
        MOCK.student = selected;
        if (typeof window.syncActiveStudentData === 'function') {
            window.syncActiveStudentData();
        }
        window.gradesViewMode = 'detail';
        renderPage();
    }
};

pages.grades = function() {
    const role = window.currentUserRole;
    
    if (role === 'student') {
        return renderStudentGradesDetail(MOCK.student, MOCK.grades);
    } else {
        // Admin or Staff
        if (window.gradesViewMode === 'detail' && MOCK.student) {
            return `
                <div class="animate-in">
                    <div style="margin-bottom: 20px;">
                        <button class="btn btn-secondary" onclick="changeGradesViewMode('overview')" style="gap:6px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                            กลับไปหน้าภาพรวม
                        </button>
                    </div>
                    ${renderStudentGradesDetail(MOCK.student, MOCK.grades)}
                </div>
            `;
        } else {
            return renderAdminGradesOverview();
        }
    }
};

function renderStudentGradesDetail(st, grades) {
    if (!st) return `<div class="card"><div class="card-body">ไม่พบข้อมูลนักศึกษา</div></div>`;
    
    // Recalculate global GPA from all grades for accurate summary
    const allValidCourses = (grades || []).flatMap(s => (s.courses || []).filter(c => c.grade));
    const totalGradePts = allValidCourses.reduce((sum, c) => sum + (c.point * (c.credits || 0)), 0);
    const totalActiveCreds = allValidCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const calculatedGpa = totalActiveCreds > 0 ? (totalGradePts / totalActiveCreds) : 0;
    
    const requiredCredits = st.requiredCredits || 0;
    const remaining = requiredCredits - totalActiveCreds;

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
                <h1 class="page-title">ผลการเรียน / เกรด</h1>
                <p class="page-subtitle">แสดงข้อมูลของ: ${st.prefix || ''}${st.firstName || ''} ${st.lastName || ''} (${st.studentId || st.id})</p>
            </div>
            ${(window.currentUserRole === 'staff' || window.currentUserRole === 'admin') ? `
            <div style="display:flex; gap:10px;">
                <div style="min-width: 250px;">
                    <select class="form-input" onchange="selectStudentForGrades(this.value)" style="margin:0;">
                        <option value="">-- สลับนักศึกษา --</option>
                        ${(MOCK.students || []).map(s => `<option value="${s.id}" ${s.id === st.id ? 'selected' : ''}>${s.studentId} - ${s.firstName} ${s.lastName}</option>`).join('')}
                    </select>
                </div>
                <button class="btn btn-primary" onclick="openGradeImportModal()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    นำเข้าข้อมูล
                </button>
            </div>
            ` : ''}
        </div>
        
        <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
            <div class="stat-card animate-in animate-delay-1" style="text-align:center">
                <div class="gpa-circle" style="width:100px;height:100px;margin-bottom:8px;margin-left:auto;margin-right:auto;">
                    <div class="gpa-circle-inner" style="width:78px;height:78px">
                        <div class="gpa-value" style="font-size:1.4rem;${calculatedGpa > 0 ? 'color:var(--accent-primary)' : ''}">${calculatedGpa.toFixed(2)}</div>
                        <div class="gpa-label">GPA สะสม</div>
                    </div>
                </div>
            </div>
            <div class="stat-card animate-in animate-delay-2">
                <div class="stat-icon green"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                <div class="stat-value">${totalActiveCreds}</div>
                <div class="stat-label">หน่วยกิตสะสม</div>
            </div>
            <div class="stat-card animate-in animate-delay-3">
                <div class="stat-icon blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
                <div class="stat-value">${remaining >= 0 ? remaining : 0}</div>
                <div class="stat-label">หน่วยกิตคงเหลือ</div>
            </div>
        </div>
        
        ${grades.length > 0 ? `
            <div class="card animate-in animate-delay-1" style="margin-bottom:20px;padding:15px 20px;">
                <div style="display:flex;align-items:center;gap:15px;flex-wrap:wrap;">
                    <label style="font-weight:600;min-width:max-content;display:flex;align-items:center;gap:8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                        เลือกดูภาคการศึกษา:
                    </label>
                    <div style="max-width:300px;flex:1;">
                        <select class="form-input" style="margin:0;" onchange="filterGradesBySemester(this)">
                            <option value="all">แสดงทั้งหมด</option>
                            ${grades.map(sem => `<option value="${sem.semester}">${sem.semester}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
        ` : ''}

        ${grades.length === 0 ? `
            <div class="card animate-in animate-delay-2">
                <div class="card-body" style="text-align:center; padding:40px; color:var(--text-muted);">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px;"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    <h3>ยังไม่มีข้อมูลผลการเรียน</h3>
                    <p style="font-size:0.85rem;">ข้อมูลจะแสดงเมื่อมีผลการเรียนจากระบบ</p>
                </div>
            </div>
        ` : ''}
        
        ${grades.map((sem, i) => `
            <div class="card animate-in animate-delay-${Math.min(i+2,4)} grade-semester-card" data-semester="${sem.semester}" style="margin-bottom:18px">
                <div class="card-header">
                    <h3 class="card-title">${sem.semester}</h3>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <span class="badge info">${sem.totalCredits} หน่วยกิต</span>
                        <span class="badge ${sem.gpa ? (sem.gpa >= 3.5 ? 'success' : sem.gpa >= 3.0 ? 'info' : 'warning') : 'neutral'}">
                            ${sem.gpa ? `GPA: ${sem.gpa.toFixed(2)}` : 'รอผลการเรียน'}
                        </span>
                    </div>
                </div>
                <div class="card-body" style="padding:0">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>รหัสวิชา</th><th>ชื่อวิชา</th><th>หน่วยกิต</th><th>เกรด</th><th>คะแนน</th></tr></thead>
                            <tbody>
                                ${(sem.courses || []).map(c => `
                                    <tr>
                                        <td style="color:var(--accent-primary-hover);font-weight:600">${c.code}</td>
                                        <td>${c.name}</td>
                                        <td style="text-align:center">${c.credits}</td>
                                        <td><span class="badge ${c.grade==='A'?'success':c.grade==='B+'||c.grade==='B'?'info':c.grade?'warning':'neutral'}">${c.grade || 'รอผล'}</span></td>
                                        <td>${c.point !== null && c.point !== undefined ? c.point.toFixed(2) : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>`;
}

function renderAdminGradesOverview() {
    const students = MOCK.students || [];
    const validGPAs = students.map(s => s.gpa).filter(g => g > 0);
    const avgGPA = validGPAs.length > 0 ? (validGPAs.reduce((a,b)=>a+b, 0) / validGPAs.length) : 0;
    const maxGPA = validGPAs.length > 0 ? Math.max(...validGPAs) : 0;
    
    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
                <h1 class="page-title">ภาพรวมผลการเรียนนักศึกษา</h1>
                <p class="page-subtitle">แสดงสถิติและรายชื่อนักศึกษาทั้งหมดในระบบ</p>
            </div>
            <button class="btn btn-primary" onclick="openGradeImportModal()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                นำเข้าข้อมูลเกรดใหม่
            </button>
        </div>

        <div class="stats-grid">
            <div class="stat-card animate-in animate-delay-1">
                <div class="stat-icon purple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div class="stat-value">${students.length}</div>
                <div class="stat-label">นักศึกษาทั้งหมด</div>
            </div>
            <div class="stat-card animate-in animate-delay-2">
                <div class="stat-icon blue">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <div class="stat-value">${avgGPA.toFixed(2)}</div>
                <div class="stat-label">GPA เฉลี่ยของชั้นเรียน</div>
            </div>
            <div class="stat-card animate-in animate-delay-3">
                <div class="stat-icon green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div class="stat-value">${maxGPA.toFixed(2)}</div>
                <div class="stat-label">GPA สูงสุด</div>
            </div>
        </div>

        <div class="card animate-in animate-delay-2" style="margin-top: 25px;">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">รายชื่อนักศึกษาตามลำดับผลการเรียน</h3>
                <div style="max-width: 300px;">
                    <input type="text" class="form-input" placeholder="ค้นหาชื่อ หรือรหัสนักศึกษา..." oninput="filterGradesOverview(this.value)" style="margin:0;">
                </div>
            </div>
            <div class="card-body" style="padding:0;">
                <div class="table-wrapper" style="max-height: 500px; overflow-y: auto;">
                    <table class="data-table" id="gradesOverviewTable">
                        <thead>
                            <tr>
                                <th>รหัสนักศึกษา</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>สาขาวิชา</th>
                                <th style="text-align:center;">หน่วยกิต</th>
                                <th style="text-align:center;">GPA สะสม</th>
                                <th style="text-align:center;">การดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.sort((a,b)=>b.gpa - a.gpa).map(st => `
                                <tr class="grade-row" data-search="${st.studentId} ${st.firstName} ${st.lastName}">
                                    <td style="font-weight:600; color:var(--accent-primary);">${st.studentId || st.id}</td>
                                    <td>${st.prefix || ''}${st.firstName || ''} ${st.lastName || ''}</td>
                                    <td>${st.department || '-'}</td>
                                    <td style="text-align:center;">${st.totalCredits || 0}</td>
                                    <td style="text-align:center;">
                                        <span class="badge ${st.gpa >= 3.5 ? 'success' : st.gpa >= 3.0 ? 'info' : st.gpa > 0 ? 'warning' : 'neutral'}">
                                            ${st.gpa ? st.gpa.toFixed(2) : '0.00'}
                                        </span>
                                    </td>
                                    <td style="text-align:center;">
                                        <button class="btn btn-secondary btn-sm" onclick="selectStudentForGrades('${st.id}')">
                                            ดูรายละเอียดรายภาค
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
}

window.filterGradesOverview = function(query) {
    const q = query.toLowerCase();
    const rows = document.querySelectorAll('#gradesOverviewTable .grade-row');
    rows.forEach(row => {
        const text = row.getAttribute('data-search').toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
    });
};

