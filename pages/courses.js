// ============================
// Courses Page
// ============================
pages.courses = function() {
    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
                <h1 class="page-title">รายวิชา</h1>
                <p class="page-subtitle">รายวิชาทั้งหมดที่เปิดสอนในภาคเรียนปัจจุบัน</p>
            </div>
            <div style="display:flex;gap:8px; align-items:center;">
                ${(window.currentUserRole === 'staff' || window.currentUserRole === 'admin') ? `
                    <button class="btn btn-secondary" onclick="exportCoursesTemplate()" style="gap:6px; font-size:0.82rem; padding:8px 12px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Template
                    </button>
                    <button class="btn btn-primary" onclick="importCourses()" style="gap:6px; font-size:0.82rem; padding:8px 12px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        นำเข้าข้อมูล
                    </button>
                    <div style="width:1px; height:24px; background:var(--border-color); margin:0 4px;"></div>
                ` : ''}
                <select class="form-select" style="width:auto;padding:8px 12px;font-size:0.82rem" id="courseFilter">
                    <option value="">ทุกประเภท</option>
                    <option value="บังคับ">วิชาบังคับ</option>
                    <option value="เลือก">วิชาเลือก</option>
                    <option value="ศึกษาทั่วไป">ศึกษาทั่วไป</option>
                </select>
            </div>
        </div>
        <div class="card animate-in animate-delay-1">
            <div class="card-body" style="padding:0">
                <div class="table-wrapper">
                    <table class="data-table" id="courseTable">
                        <thead><tr><th>รหัส</th><th>ชื่อวิชา</th><th>หน่วยกิต</th><th>ประเภท</th><th>อาจารย์</th><th>เวลา</th><th>ห้อง</th><th>ที่นั่ง</th><th>สถานะ</th></tr></thead>
                        <tbody>
                            ${MOCK.courses.map(c => `
                                <tr data-type="${c.type}">
                                    <td style="color:var(--accent-primary-hover);font-weight:600">${c.code}</td>
                                    <td>${c.name}</td>
                                    <td style="text-align:center">${c.credits}</td>
                                    <td><span class="badge ${c.type==='บังคับ'?'purple':c.type==='เลือก'?'info':'neutral'}">${c.type}</span></td>
                                    <td>${c.instructor}</td>
                                    <td>${c.schedule}</td>
                                    <td>${c.room}</td>
                                    <td>${c.enrolled}/${c.seats}</td>
                                    <td>${getStatusBadge(c.status)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

window.init_courses = function() {
    const filter = document.getElementById('courseFilter');
    if (filter) {
        filter.addEventListener('change', () => {
            const val = filter.value;
            document.querySelectorAll('#courseTable tbody tr').forEach(row => {
                row.style.display = (!val || row.dataset.type === val) ? '' : 'none';
            });
        });
    }
};

// ============================
// Enrollment Page
// ============================
pages.enrollment = function() {
    const totalCredits = MOCK.enrolledCourses.reduce((s,c) => s+c.credits, 0);
    const availableCourses = MOCK.courses.filter(c => c.status === 'เปิด' && !MOCK.enrolledCourses.find(e => e.code === c.code));
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ลงทะเบียนเรียน</h1>
            <p class="page-subtitle">เลือกรายวิชาเพื่อลงทะเบียนเรียน ภาคฤดูร้อน/2568</p>
        </div>
        <div class="grid-2">
            <div>
                <div class="card animate-in animate-delay-1" style="margin-bottom:18px">
                    <div class="card-header"><h3 class="card-title">รายวิชาที่เปิดให้ลงทะเบียน</h3></div>
                    <div class="card-body">
                        <div class="enrollment-list">
                            ${availableCourses.map(c => `
                                <div class="enrollment-card">
                                    <div class="course-info">
                                        <span class="course-code">${c.code}</span>
                                        <span class="course-name">${c.name}</span>
                                        <span class="course-meta">${c.credits} หน่วยกิต · ${c.instructor} · ${c.schedule}</span>
                                    </div>
                                    <button class="btn btn-primary btn-sm" onclick="addCourseModal('${c.code}','${c.name}',${c.credits})">+ เพิ่ม</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="card animate-in animate-delay-2">
                    <div class="card-header">
                        <h3 class="card-title">ตะกร้ารายวิชา</h3>
                        <span class="badge info">${totalCredits} หน่วยกิต</span>
                    </div>
                    <div class="card-body">
                        <div class="enrollment-list">
                            ${MOCK.enrolledCourses.map(c => `
                                <div class="enrollment-card">
                                    <div class="course-info">
                                        <span class="course-code">${c.code}</span>
                                        <span class="course-name">${c.name}</span>
                                        <span class="course-meta">${c.credits} หน่วยกิต · ${c.schedule}</span>
                                    </div>
                                    <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="removeCourseModal('${c.code}')">✕</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="card-footer">
                        <span style="font-size:0.85rem;color:var(--text-muted)">รวม ${MOCK.enrolledCourses.length} วิชา · ${totalCredits} หน่วยกิต</span>
                        <button class="btn btn-primary" onclick="confirmEnrollment()">ยืนยันลงทะเบียน</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

function addCourseModal(code, name, credits) {
    openModal('เพิ่มรายวิชา', `<p style="margin-bottom:16px">ต้องการเพิ่มวิชา <strong>${code} ${name}</strong> (${credits} หน่วยกิต) ใช่หรือไม่?</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="closeModal()">ยืนยัน</button></div>`);
}

function removeCourseModal(code) {
    openModal('ถอนรายวิชา', `<p style="margin-bottom:16px">ต้องการถอนวิชา <strong>${code}</strong> ใช่หรือไม่?</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button><button class="btn btn-danger" onclick="closeModal()">ถอนรายวิชา</button></div>`);
}

function confirmEnrollment() {
    openModal('ยืนยันการลงทะเบียน', `<div style="text-align:center;padding:12px"><div style="font-size:3rem;margin-bottom:12px">✅</div><p style="margin-bottom:16px">ยืนยันลงทะเบียนทั้งหมด ${MOCK.enrolledCourses.length} วิชา?</p><div style="display:flex;gap:8px;justify-content:center"><button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button><button class="btn btn-primary" onclick="closeModal()">ยืนยัน</button></div></div>`);
}

window.exportCoursesTemplate = function() {
    const headers = ['รหัสวิชา','ชื่อวิชา','หน่วยกิต','ประเภท','อาจารย์ผู้สอน','เวลาเรียน','ห้องเรียน','ที่นั่งรวม','จำนวนผู้เรียน','สถานะ'];
    const sample = ['01005000109','การพยาบาลชุมชนขั้นสูง','2','บังคับ','รศ.ดร.ใจดี มานะ','ศ. 13:00-16:00','NB307','30','0','เปิด'];
    downloadCSVTemplate('template_รายวิชา.csv', headers, sample);
};

window.importCourses = function() {
    handleGenericCSVImport((data) => {
        if (data && data.length > 0) {
            data.forEach(row => {
                const newCourse = {
                    code: row['รหัสวิชา'] || '',
                    name: row['ชื่อวิชา'] || '',
                    credits: parseInt(row['หน่วยกิต']) || 0,
                    type: row['ประเภท'] || 'บังคับ',
                    instructor: row['อาจารย์ผู้สอน'] || '',
                    schedule: row['เวลาเรียน'] || '',
                    room: row['ห้องเรียน'] || '',
                    seats: parseInt(row['ที่นั่งรวม']) || 30,
                    enrolled: parseInt(row['จำนวนผู้เรียน']) || 0,
                    status: row['สถานะ'] || 'เปิด'
                };
                if (newCourse.code && newCourse.name) {
                    MOCK.courses.push(newCourse);
                }
            });
            alert(`นำเข้ารายวิชาสำเร็จ ${data.length} รายการ`);
            renderPage();
        }
    });
};
