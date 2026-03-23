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
            <div style="display:flex;gap:8px">
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
