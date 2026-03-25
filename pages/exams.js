// ============================
// Exam Results Page
// ============================

const EXAM_TYPES = [
    'ความรู้ภาษาอังกฤษ',
    'หัวข้อวิทยานิพนธ์',
    'ประมวลความรู้',
    'โครงร่างวิทยานิพนธ์',
    'ป้องกันวิทยานิพนธ์'
];

pages.exams = function() {
    const role = window.currentUserRole;
    
    if (role === 'student') {
        return renderStudentExams(MOCK.student);
    } else {
        return renderAdminExams();
    }
};

function renderStudentExams(st) {
    if (!st) return `<div class="card"><div class="card-body">ไม่พบข้อมูลนักศึกษา</div></div>`;
    
    const exams = st.exams || [];
    
    let rowsHtml = '';
    EXAM_TYPES.forEach(type => {
        const found = exams.find(ex => ex.exam_type === type);
        const status = found ? found.status : 'ยังไม่มีข้อมูล';
        const score = found ? found.score : '-';
        const date = found ? found.date : '-';
        const note = found ? found.note : '-';
        
        let statusClass = 'status-pending';
        if (status === 'ผ่าน' || status === 'Pass') statusClass = 'status-active';
        else if (status === 'ไม่ผ่าน' || status === 'Fail') statusClass = 'status-inactive';

        rowsHtml += `
            <tr>
                <td style="font-weight:600;">${type}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${score}</td>
                <td>${date}</td>
                <td style="font-size:0.85rem;color:var(--text-secondary);">${note}</td>
            </tr>
        `;
    });

    return `
        <div class="animate-in">
            <div class="page-header">
                <h1 class="page-title">ผลการสอบ</h1>
                <p class="page-subtitle">แสดงสถานะและคะแนนการสอบวัดความรู้และวิทยานิพนธ์</p>
            </div>
            
            <div class="card animate-in animate-delay-1">
                <div class="card-header">
                    <h3 class="card-title">สรุปผลการสอบ: ${st.firstName} ${st.lastName}</h3>
                </div>
                <div class="card-body" style="padding:0;">
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ประเภทการสอบ</th>
                                    <th>สถานะ</th>
                                    <th>คะแนน/ผล</th>
                                    <th>วันที่สอบ</th>
                                    <th>หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="card animate-in animate-delay-2" style="margin-top:20px;border-left:4px solid var(--primary-color);">
                <div class="card-body">
                    <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">
                        * หากมีข้อสงสัยเกี่ยวกับข้อมูลผลการสอบ กรุณาติดต่อฝ่ายทะเบียนหรือที่ปรึกษาวิทยานิพนธ์ของท่าน
                    </p>
                </div>
            </div>
        </div>
    `;
}

function renderAdminExams() {
    const students = MOCK.students || [];
    const selectedId = window.selectedExamStudentId || (students[0] ? students[0].id : null);
    const selectedStudent = students.find(s => s.id === selectedId);
    
    let studentOptions = students.map(s => `
        <option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>
            ${s.studentId} - ${s.firstName} ${s.lastName}
        </option>
    `).join('');

    let editRowsHtml = '';
    if (selectedStudent) {
        const exams = selectedStudent.exams || [];
        EXAM_TYPES.forEach(type => {
            const found = exams.find(ex => ex.exam_type === type) || {};
            const status = found.status || '';
            const score = found.score || '';
            const date = found.date || '';
            const note = found.note || '';

            editRowsHtml += `
                <tr data-type="${type}">
                    <td style="font-weight:600;">${type}</td>
                    <td>
                        <select class="form-control status-select" style="min-width:100px;">
                            <option value="" ${!status ? 'selected' : ''}>- เลือกสถานะ -</option>
                            <option value="ผ่าน" ${status === 'ผ่าน' ? 'selected' : ''}>ผ่าน (Pass)</option>
                            <option value="ไม่ผ่าน" ${status === 'ไม่ผ่าน' ? 'selected' : ''}>ไม่ผ่าน (Fail)</option>
                            <option value="รอผล" ${status === 'รอผล' ? 'selected' : ''}>รอผล (Pending)</option>
                            <option value="ยังไม่สอบ" ${status === 'ยังไม่สอบ' ? 'selected' : ''}>ยังไม่สอบ</option>
                        </select>
                    </td>
                    <td><input type="text" class="form-control score-input" value="${score}" placeholder="เช่น 70/100"></td>
                    <td><input type="date" class="form-control date-input" value="${date}"></td>
                    <td><input type="text" class="form-control note-input" value="${note}" placeholder="ระบุหมายเหตุ..."></td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="saveIndividualExam('${selectedId}', '${type}', this)">บันทึก</button>
                    </td>
                </tr>
            `;
        });
    }

    return `
        <div class="animate-in">
            <div class="page-header">
                <h1 class="page-title">จัดการผลการสอบ</h1>
                <p class="page-subtitle">สำหรับอาจารย์และเจ้าหน้าที่จัดการข้อมูลการสอบ</p>
            </div>

            <div class="card animate-in animate-delay-1" style="margin-bottom:20px;">
                <div class="card-body">
                    <div class="grid-2" style="align-items: flex-end;">
                        <div class="form-group" style="margin-bottom:0;">
                            <label class="form-label">เลือกนักศึกษาที่ต้องการส่งผลสอบ</label>
                            <select class="form-control" onchange="window.selectedExamStudentId = this.value; renderPage();">
                                <option value="">-- เลือกนักศึกษา --</option>
                                ${studentOptions}
                            </select>
                        </div>
                        <div style="display:flex;gap:10px;">
                            <button class="btn btn-secondary" onclick="alert('ฟีเจอร์นำเข้าแบบ Batch กำลังพัฒนา...')">นำเข้า CSV</button>
                        </div>
                    </div>
                </div>
            </div>

            ${selectedStudent ? `
                <div class="card animate-in animate-delay-2">
                    <div class="card-header">
                        <h3 class="card-title">แก้ไขผลสอบ: ${selectedStudent.firstName} ${selectedStudent.lastName}</h3>
                    </div>
                    <div class="card-body" style="padding:0;">
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th style="width:20%">ประเภทการสอบ</th>
                                        <th style="width:15%">สถานะ</th>
                                        <th style="width:15%">คะแนน/ผล</th>
                                        <th style="width:15%">วันที่สอบ</th>
                                        <th style="width:25%">หมายเหตุ</th>
                                        <th style="width:10%">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${editRowsHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="card"><div class="card-body" style="text-align:center;color:var(--text-secondary);">กรุณาเลือกนักศึกษาเพื่อจัดการข้อมูล</div></div>
            `}
        </div>
    `;
}

window.saveIndividualExam = async function(studentId, type, btn) {
    const row = btn.closest('tr');
    const payload = {
        action: 'updateExam',
        payload: {
            student_id: studentId,
            exam_type: type,
            status: row.querySelector('.status-select').value,
            score: row.querySelector('.score-input').value,
            date: row.querySelector('.date-input').value,
            note: row.querySelector('.note-input').value
        }
    };
    
    btn.disabled = true;
    btn.textContent = '...กำลังบันทึก';
    
    try {
        const res = await callApi(payload);
        if (res.status === 'success') {
            showToast('บันทึกผลการสอบเรียบร้อยแล้ว', 'success');
            // Refresh data
            if (typeof window.syncActiveStudentData === 'function') {
                await window.syncActiveStudentData();
            }
            renderPage();
        } else {
            throw new Error(res.message);
        }
    } catch (e) {
        showToast('เกิดข้อผิดพลาด: ' + e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'บันทึก';
    }
};

async function callApi(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.json();
}
