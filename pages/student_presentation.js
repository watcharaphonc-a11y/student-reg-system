// ============================
// Student Presentation Page (นำเสนอผลงานของนักศึกษา)
// ============================

pages['student-presentation'] = function () {
    const studentName = MOCK.student ? getStudentDisplayName(MOCK.student) : '';
    const studentMajor = MOCK.student ? MOCK.student.major : '';

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">นำเสนอผลงานของนักศึกษา</h1>
            <p class="page-subtitle">บันทึกข้อมูลการนำเสนอผลงานในการประชุมวิชาการ / การเผยแพร่ผลงาน</p>
        </div>

        <div class="card" style="max-width: 800px; margin: 0 auto;">
            <div class="card-header">
                <h3 class="card-title">แบบฟอร์มบันทึกข้อมูลการนำเสนอผลงาน</h3>
            </div>
            <div class="card-body">
                <form id="presentationForm" onsubmit="window.submitPresentation(event)">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">ชื่อนักศึกษา <span style="color:var(--danger)">*</span></label>
                            <input type="text" id="pres_StudentName" class="form-input" value="${studentName}" required placeholder="ระบุชื่อนักศึกษา">
                        </div>
                        <div>
                            <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">ชื่อการศึกษา/ระดับ <span style="color:var(--danger)">*</span></label>
                            <select id="pres_Level" class="form-select" required>
                                <option value="">-- เลือกระดับ --</option>
                                <option value="ปริญญาโท" ${studentMajor.includes('มหาบัณฑิต') ? 'selected' : ''}>ปริญญาโท</option>
                                <option value="ปริญญาเอก" ${studentMajor.includes('ดุษฎี') ? 'selected' : ''}>ปริญญาเอก</option>
                                <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">ชื่อการประชุม / วารสาร <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="pres_Conference" class="form-input" required placeholder="ระบุชื่อการประชุมวิชาการ หรือวารสาร (เช่น The 10th International Conference...)">
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">บทคัดย่อ (Abstract) <span style="color:var(--danger)">*</span></label>
                        <textarea id="pres_Abstract" class="form-input" required rows="5" placeholder="คัดลอกบทคัดย่อมาวางที่นี่..."></textarea>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">ชื่ออาจารย์ (ที่ปรึกษา/ผู้ร่วมทำวิจัย) <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="pres_Advisor" class="form-input" required placeholder="ระบุชื่ออาจารย์ที่ปรึกษา">
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">วันที่การประชุม / เผยแพร่ <span style="color:var(--danger)">*</span></label>
                            <input type="date" id="pres_Date" class="form-input" required>
                        </div>
                        <div>
                            <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">สถานที่ (ประเทศ) <span style="color:var(--danger)">*</span></label>
                            <input type="text" id="pres_Location" class="form-input" required placeholder="เช่น กรุงเทพฯ, ประเทศไทย">
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">แหล่งทุน (หากมี)</label>
                        <input type="text" id="pres_Funding" class="form-input" placeholder="ระบุแหล่งทุน / ทุนวิจัยสนับสนุน">
                    </div>

                    <div style="margin-bottom: 24px;">
                        <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">ภาพประกอบ / ไฟล์ผลงาน</label>
                        <input type="file" id="pres_Image" class="form-input" style="padding: 10px;" accept="image/*,application/pdf">
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">รองรับไฟล์รูปภาพ (.jpg, .png) หรือ PDF</div>
                    </div>

                    <hr style="border:0; border-top:1px solid var(--border-color); margin: 24px 0;">

                    <div style="display: flex; justify-content: flex-end; gap: 12px;">
                        <button type="button" class="btn btn-secondary" onclick="document.getElementById('presentationForm').reset()">ล้างข้อมูล</button>
                        <button type="submit" class="btn btn-primary" style="gap: 8px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                            บันทึกข้อมูล
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
};

window.submitPresentation = function(e) {
    e.preventDefault();
    
    // แบบฟอร์มจำลอง
    window.showLoading && window.showLoading();
    
    setTimeout(() => {
        window.hideLoading && window.hideLoading();
        
        let modalHtml = `
        <div style="text-align:center; padding:20px;">
            <div style="font-size:4rem; margin-bottom:16px;">🎉</div>
            <h3 style="color:var(--success); margin-bottom:12px;">บันทึกข้อมูลสำเร็จ!</h3>
            <p style="color:var(--text-secondary); margin-bottom:24px;">ข้อมูลการนำเสนอผลงานของคุณถูกส่งเข้าระบบเรียบร้อยแล้ว และอยู่ในระหว่างรอการอนุมัติรับรอง</p>
            <button class="btn btn-primary" onclick="closeModal()">ตกลง</button>
        </div>
        `;
        
        if (typeof openModal === 'function') {
            openModal('บันทึกผลงานสำเร็จ', modalHtml);
            document.getElementById('presentationForm').reset();
        } else {
            alert('บันทึกข้อมูลสำเร็จ');
        }
    }, 1000);
};
