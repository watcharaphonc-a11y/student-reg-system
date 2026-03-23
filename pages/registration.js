// ============================
// New Registration Page (Multi-step Wizard)
// ============================
let regData = {}; // เก็บข้อมูลการลงทะเบียน

pages['new-registration'] = function() {
    const stepLabels = ['ข้อมูลส่วนตัว', 'ข้อมูลการศึกษา', 'ที่อยู่/ผู้ปกครอง', 'ยืนยัน'];
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ลงทะเบียนนักศึกษาใหม่</h1>
            <p class="page-subtitle">กรอกข้อมูลเพื่อลงทะเบียนเข้าเป็นนักศึกษาใหม่</p>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="steps" id="regSteps">
                    ${stepLabels.map((label, i) => `
                        <div class="step ${i+1 < registrationStep ? 'completed' : ''} ${i+1 === registrationStep ? 'active' : ''}" data-step="${i+1}">
                            <div class="step-circle">${i+1 < registrationStep ? '✓' : i+1}</div>
                            <span class="step-label">${label}</span>
                        </div>
                        ${i < stepLabels.length-1 ? `<div class="step-line ${i+1 < registrationStep ? 'completed' : ''}"></div>` : ''}
                    `).join('')}
                </div>
                <div id="regForm">${renderRegStep(registrationStep)}</div>
                <div style="display:flex;justify-content:space-between;margin-top:24px;">
                    <button class="btn btn-secondary" onclick="regPrev()" ${registrationStep===1?'disabled style="opacity:0.4"':''}>← ก่อนหน้า</button>
                    ${registrationStep < 4 
                        ? `<button class="btn btn-primary" onclick="regNext()">ถัดไป →</button>`
                        : `<button class="btn btn-primary" onclick="regSubmit()">✓ ยืนยันลงทะเบียน</button>`
                    }
                </div>
            </div>
        </div>
    </div>`;
};

function renderRegStep(step) {
    if (step === 1) return `
        <div class="form-row"><div class="form-group"><label class="form-label">คำนำหน้า</label><select id="reg_prefix" class="form-select"><option>นาย</option><option>นางสาว</option><option>นาง</option></select></div><div class="form-group"><label class="form-label">เลขบัตรประชาชน</label><input id="reg_idCard" class="form-input" placeholder="x-xxxx-xxxxx-xx-x" value="${regData.idCard||''}"/></div></div>
        <div class="form-row"><div class="form-group"><label class="form-label">ชื่อ (ไทย)</label><input id="reg_firstName" class="form-input" placeholder="ชื่อ" value="${regData.firstName||''}"/></div><div class="form-group"><label class="form-label">นามสกุล (ไทย)</label><input id="reg_lastName" class="form-input" placeholder="นามสกุล" value="${regData.lastName||''}"/></div></div>
        <div class="form-row"><div class="form-group"><label class="form-label">ชื่อ (อังกฤษ)</label><input id="reg_firstNameEn" class="form-input" placeholder="First Name" value="${regData.firstNameEn||''}"/></div><div class="form-group"><label class="form-label">นามสกุล (อังกฤษ)</label><input id="reg_lastNameEn" class="form-input" placeholder="Last Name" value="${regData.lastNameEn||''}"/></div></div>
        <div class="form-row"><div class="form-group"><label class="form-label">วันเกิด</label><input id="reg_dob" class="form-input" type="date" value="${regData.dob||''}"/></div><div class="form-group"><label class="form-label">เพศ</label><select id="reg_gender" class="form-select"><option>ชาย</option><option>หญิง</option></select></div></div>
        <div class="form-row"><div class="form-group"><label class="form-label">อีเมล</label><input id="reg_email" class="form-input" type="email" placeholder="email@example.com" value="${regData.email||''}"/></div><div class="form-group"><label class="form-label">เบอร์โทรศัพท์</label><input id="reg_phone" class="form-input" placeholder="0xx-xxx-xxxx" value="${regData.phone||''}"/></div></div>`;
    if (step === 2) return `
        <div class="form-row"><div class="form-group"><label class="form-label">คณะ</label><select id="reg_faculty" class="form-select"><option>คณะวิศวกรรมศาสตร์</option><option>คณะวิทยาศาสตร์</option><option>คณะบริหารธุรกิจ</option><option>คณะมนุษยศาสตร์</option><option>คณะนิติศาสตร์</option></select></div><div class="form-group"><label class="form-label">ภาควิชา</label><select id="reg_department" class="form-select"><option>วิศวกรรมคอมพิวเตอร์</option><option>วิศวกรรมไฟฟ้า</option><option>วิศวกรรมโยธา</option><option>วิศวกรรมเครื่องกล</option></select></div></div>
        <div class="form-row"><div class="form-group"><label class="form-label">หลักสูตร</label><select id="reg_program" class="form-select"><option>วิศวกรรมศาสตรบัณฑิต (วศ.บ.) 4 ปี</option><option>วิศวกรรมศาสตรบัณฑิต (วศ.บ.) ต่อเนื่อง</option></select></div><div class="form-group"><label class="form-label">ประเภทการรับเข้า</label><select id="reg_admissionType" class="form-select"><option>สอบตรง</option><option>TCAS รอบ 1</option><option>TCAS รอบ 2</option><option>TCAS รอบ 3</option><option>รับตรง</option></select></div></div>
        <div class="form-row"><div class="form-group"><label class="form-label">สถานศึกษาเดิม</label><input id="reg_prevSchool" class="form-input" placeholder="ชื่อโรงเรียน" value="${regData.prevSchool||''}"/></div><div class="form-group"><label class="form-label">GPA มัธยมปลาย</label><input id="reg_prevGPA" class="form-input" placeholder="x.xx" value="${regData.prevGPA||''}"/></div></div>`;
    if (step === 3) return `
        <div class="form-group"><label class="form-label">ที่อยู่ปัจจุบัน</label><textarea id="reg_address" class="form-textarea" placeholder="บ้านเลขที่, ถนน, ซอย">${regData.address||''}</textarea></div>
        <hr style="border-color:var(--border-color);margin:20px 0" />
        <h4 style="margin-bottom:14px;font-size:0.95rem">ข้อมูลผู้ปกครอง</h4>
        <div class="form-row"><div class="form-group"><label class="form-label">ชื่อ-สกุลผู้ปกครอง</label><input id="reg_parentName" class="form-input" placeholder="ชื่อ-สกุล" value="${regData.parentName||''}"/></div><div class="form-group"><label class="form-label">ความสัมพันธ์</label><select id="reg_parentRel" class="form-select"><option>บิดา</option><option>มารดา</option><option>ผู้ปกครอง</option></select></div></div>
        <div class="form-row"><div class="form-group"><label class="form-label">เบอร์โทรผู้ปกครอง</label><input id="reg_parentPhone" class="form-input" placeholder="0xx-xxx-xxxx" value="${regData.parentPhone||''}"/></div><div class="form-group"><label class="form-label">อาชีพผู้ปกครอง</label><input id="reg_parentJob" class="form-input" placeholder="อาชีพ" value="${regData.parentJob||''}"/></div></div>`;
    if (step === 4) return `
        <div style="text-align:center;padding:20px 0">
            <div style="width:64px;height:64px;border-radius:50%;background:var(--success-bg);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.8rem;color:var(--success)">✓</div>
            <h3 style="margin-bottom:8px;font-size:1.1rem">ตรวจสอบข้อมูลก่อนยืนยัน</h3>
            <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:24px">กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนกดปุ่มยืนยัน</p>
            <div class="card" style="text-align:left;max-width:500px;margin:0 auto">
                <div class="card-body">
                    <div class="transcript-info">
                        <div class="transcript-info-item"><span class="label">ชื่อ-สกุล:</span><span>${regData.prefix||''}${regData.firstName||'-'} ${regData.lastName||'-'}</span></div>
                        <div class="transcript-info-item"><span class="label">อีเมล:</span><span>${regData.email||'-'}</span></div>
                        <div class="transcript-info-item"><span class="label">คณะ:</span><span>${regData.faculty||'-'}</span></div>
                        <div class="transcript-info-item"><span class="label">ภาควิชา:</span><span>${regData.department||'-'}</span></div>
                        <div class="transcript-info-item"><span class="label">หลักสูตร:</span><span>${regData.program||'-'}</span></div>
                    </div>
                </div>
            </div>
        </div>`;
    return '';
}

function saveStepData(step) {
    if (step === 1) {
        regData.prefix = document.getElementById('reg_prefix').value;
        regData.idCard = document.getElementById('reg_idCard').value;
        regData.firstName = document.getElementById('reg_firstName').value;
        regData.lastName = document.getElementById('reg_lastName').value;
        regData.firstNameEn = document.getElementById('reg_firstNameEn').value;
        regData.lastNameEn = document.getElementById('reg_lastNameEn').value;
        regData.dob = document.getElementById('reg_dob').value;
        regData.gender = document.getElementById('reg_gender').value;
        regData.email = document.getElementById('reg_email').value;
        regData.phone = document.getElementById('reg_phone').value;
    } else if (step === 2) {
        regData.faculty = document.getElementById('reg_faculty').value;
        regData.department = document.getElementById('reg_department').value;
        regData.program = document.getElementById('reg_program').value;
        regData.admissionType = document.getElementById('reg_admissionType').value;
        regData.prevSchool = document.getElementById('reg_prevSchool').value;
        regData.prevGPA = document.getElementById('reg_prevGPA').value;
    } else if (step === 3) {
        regData.address = document.getElementById('reg_address').value;
        regData.parentName = document.getElementById('reg_parentName').value;
        regData.parentRel = document.getElementById('reg_parentRel').value;
        regData.parentPhone = document.getElementById('reg_parentPhone').value;
        regData.parentJob = document.getElementById('reg_parentJob').value;
    }
}

function regNext() {
    saveStepData(registrationStep);
    if (registrationStep < 4) { registrationStep++; renderPage(); }
}

function regPrev() {
    saveStepData(registrationStep);
    if (registrationStep > 1) { registrationStep--; renderPage(); }
}

async function regSubmit() {
    showApiLoading('กำลังบันทึกข้อมูลการลงทะเบียน...');
    
    // เตรียมข้อมูลเพื่อส่งไปบันทึก
    const payload = {
        studentId: '68' + Math.floor(Math.random() * 10000000).toString().padStart(8, '0'), // จำลองเลขประจำตัวนักศึกษาใหม่
        prefix: regData.prefix,
        firstName: regData.firstName,
        lastName: regData.lastName,
        firstNameEn: regData.firstNameEn,
        lastNameEn: regData.lastNameEn,
        faculty: regData.faculty,
        department: regData.department,
        program: regData.program,
        year: 1,
        status: 'กำลังศึกษา',
        admissionYear: new Date().getFullYear() + 543,
        advisor: 'รอการจัดสรร',
        email: regData.email,
        phone: regData.phone,
        dob: regData.dob,
        address: regData.address,
        parentName: regData.parentName,
        parentPhone: regData.parentPhone
    };

    const res = await postData('registerStudent', payload);
    hideApiLoading();

    if (res && res.status === 'success') {
        openModal('สำเร็จ!', `<div style="text-align:center;padding:20px"><div style="font-size:3rem;margin-bottom:12px">🎉</div><h3 style="margin-bottom:8px">ลงทะเบียนนักศึกษาใหม่สำเร็จ</h3><p style="color:var(--text-muted)">รหัสนักศึกษาใหม่: <strong>${payload.studentId}</strong></p><p style="color:var(--text-muted);font-size:0.85rem;margin-top:8px">ข้อมูลถูกบันทึกลงในฐานข้อมูล (Google Sheets) แล้ว</p><button class="btn btn-primary" style="margin-top:16px" onclick="closeModal();registrationStep=1;regData={};navigateTo('dashboard')">กลับหน้าหลัก</button></div>`);
    } else {
        openModal('เกิดข้อผิดพลาด', `<div style="text-align:center;padding:20px"><div style="font-size:3rem;margin-bottom:12px">❌</div><h3 style="margin-bottom:8px">ไม่สามารถบันทึกข้อมูลได้</h3><p style="color:var(--danger)">${res ? res.message : 'Network Error'}</p><button class="btn btn-secondary" style="margin-top:16px" onclick="closeModal()">ปิด</button></div>`);
    }
}

