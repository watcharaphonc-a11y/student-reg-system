// ============================
// Thesis Advisor Appointment Page
// 5-Step Workflow: Student -> Main -> Co-1 -> Co-2 -> Confirm & Topic
// ============================

pages['thesis-advisor'] = function () {
    // Persistent state for the current 5-step flow
    if (!window._thesisFlow) {
        window._thesisFlow = {
            step: 1,
            studentId: '',
            main: '-',
            coInternal: '-',
            coExternal: '-',
            topicTh: '',
            topicEn: ''
        };
    }
    
    const flow = window._thesisFlow;
    const students = MOCK.students || [];
    const internalTeachers = (MOCK.teachers || []).filter(t => 
        (t.type || '').includes('Thesis') || (t.position || '').includes('อาจารย์') || (t.type || '') === 'อาจารย์ประจำ'
    );
    const externalTeachers = MOCK.specialLecturers || [];
    
    // Helper to get name from ID/Value
    const getName = (list, val) => {
        if (!val || val === '-') return '-';
        const found = list.find(l => (l.id || l.studentId || l.name) === val);
        return found ? (found.name || `${found.prefix || ''}${found.firstName} ${found.lastName}`) : val;
    };

    const studentName = getName(students, flow.studentId);
    
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">จัดการอาจารย์ที่ปรึกษาวิทยานิพนธ์</h1>
            <p class="page-subtitle">ขั้นตอนการแต่งตั้งทีมที่ปรึกษาและกำหนดหัวข้อวิทยานิพนธ์เบื้องต้น</p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 350px; gap:25px; align-items: start;">
            
            <!-- Left: Step Content -->
            <div class="card" style="border:none; box-shadow:0 10px 30px -5px rgba(0,0,0,0.1);">
                <div class="card-body" style="padding:0;">
                    
                    <!-- Progress Bar -->
                    <div style="display:flex; border-bottom:1px solid var(--border-color); background:var(--bg-light);">
                        ${[1, 2, 3, 4, 5].map(s => `
                            <div style="flex:1; padding:15px; text-align:center; position:relative; border-right:1px solid var(--border-color); transition:all 0.3s;
                                ${flow.step === s ? 'background:white; border-bottom:3px solid var(--accent-primary);' : 'opacity:0.6;'}">
                                <div style="font-size:0.7rem; font-weight:700; color:var(--text-muted); margin-bottom:4px;">STEP ${s}</div>
                                <div style="font-size:0.85rem; font-weight:600; color:${flow.step === s ? 'var(--accent-primary)' : 'inherit'};">
                                    ${s === 1 ? 'เลือกนักศึกษา' : s === 2 ? 'ที่ปรึกษาหลัก' : s === 3 ? 'ร่วม (1)' : s === 4 ? 'ร่วม (2)' : 'ลงหัวข้อ'}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Step Content Areas -->
                    <div style="padding:40px;">
                        
                        <!-- Step 1: Select Student -->
                        <div style="display:${flow.step === 1 ? 'block' : 'none'}">
                            <h3 style="margin-bottom:20px; font-size:1.3rem;">1. เลือกนักศึกษา</h3>
                            <div class="form-group">
                                <label class="form-label">ค้นหารายชื่อนักศึกษาที่ต้องการแต่งตั้ง</label>
                                ${renderSearchableSelect('thesisStudentSelect', 
                                    students.map(s => ({ value: s.id || s.studentId, label: `${s.studentId} - ${s.prefix || ''}${s.firstName} ${s.lastName}` })), 
                                    flow.studentId, 
                                    '--- ค้นหารหัสนักศึกษา หรือ ชื่อ ---'
                                )}
                            </div>
                            <div style="margin-top:25px; padding:15px; background:rgba(37, 99, 235, 0.05); border-radius:12px; display:flex; gap:12px; align-items:center;">
                                <div style="font-size:1.5rem;">💡</div>
                                <div style="font-size:0.9rem; color:var(--text-secondary); line-height:1.4;">
                                    ระบบจะดึงข้อมูลที่ปรึกษาและหัวข้อเดิมที่มีอยู่ในระบบมาแสดงให้ตรวจสอบโดยอัตโนมัติ
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: Main Advisor -->
                        <div style="display:${flow.step === 2 ? 'block' : 'none'}">
                            <h3 style="margin-bottom:20px; font-size:1.3rem;">2. เลือกอาจารย์ที่ปรึกษาหลัก</h3>
                            <div class="form-group">
                                <label class="form-label">รายชื่ออาจารย์ภายใน สบช. (ประธานที่ปรึกษา)</label>
                                ${renderSearchableSelect('mainAdvisorSelect', 
                                    internalTeachers.map(t => ({ value: t.name, label: t.name })), 
                                    flow.main === '-' ? '' : flow.main, 
                                    '--- ค้นหาชื่ออาจารย์ ---'
                                )}
                            </div>
                        </div>

                        <!-- Step 3: Co-Internal -->
                        <div style="display:${flow.step === 3 ? 'block' : 'none'}">
                            <h3 style="margin-bottom:20px; font-size:1.3rem;">3. เลือกอาจารย์ที่ปรึกษาร่วม (1)</h3>
                            <div class="form-group">
                                <label class="form-label">รายชื่ออาจารย์ภายใน สบช.</label>
                                ${renderSearchableSelect('coInternalSelect', 
                                    internalTeachers.map(t => ({ value: t.name, label: t.name })), 
                                    flow.coInternal === '-' ? '' : flow.coInternal, 
                                    '--- ค้นหาชื่ออาจารย์ (ถ้ามี) ---'
                                )}
                            </div>
                        </div>

                        <!-- Step 4: Co-External -->
                        <div style="display:${flow.step === 4 ? 'block' : 'none'}">
                            <h3 style="margin-bottom:20px; font-size:1.3rem;">4. เลือกอาจารย์ที่ปรึกษาร่วม (2)</h3>
                            <div class="form-group">
                                <label class="form-label">รายชื่ออาจารย์ภายนอก / ผู้เชี่ยวชาญ</label>
                                ${renderSearchableSelect('coExternalSelect', 
                                    externalTeachers.map(t => ({ value: t.name, label: t.name })), 
                                    flow.coExternal === '-' ? '' : flow.coExternal, 
                                    '--- ค้นหาชื่ออาจารย์ภายนอก (ถ้ามี) ---'
                                )}
                            </div>
                        </div>

                        <!-- Step 5: Confirmation & Topic -->
                        <div style="display:${flow.step === 5 ? 'block' : 'none'}">
                            <h3 style="margin-bottom:20px; font-size:1.3rem;">5. กำหนดหัวข้อวิทยานิพนธ์</h3>
                            <div class="form-group">
                                <label class="form-label">ชื่อหัวข้อวิทยานิพนธ์ (ภาษาไทย)</label>
                                <textarea class="form-input" rows="2" placeholder="ระบุชื่อหัวข้อวิทยานิพนธ์ภาษาไทย" 
                                    onchange="window._thesisFlow.topicTh = this.value">${flow.topicTh}</textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">ชื่อหัวข้อวิทยานิพนธ์ (ภาษาอังกฤษ)</label>
                                <textarea class="form-input" rows="2" placeholder="Specify Thesis Title in English" 
                                    onchange="window._thesisFlow.topicEn = this.value">${flow.topicEn}</textarea>
                            </div>
                            <div style="margin-top:10px; font-size:0.85rem; color:var(--text-muted);">
                                * เมื่อบันทึกแล้ว นักศึกษาจะสามารถแจ้งขอเปลี่ยนแปลงหัวข้อได้ภายหลังทางหน้าเว็บ
                            </div>
                        </div>

                        <!-- Navigation Buttons -->
                        <div style="margin-top:25px; display:flex; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:20px;">
                            <button class="btn btn-secondary" onclick="window.thesisPrevStep()" ${flow.step === 1 ? 'disabled' : ''}>
                                ย้อนกลับ
                            </button>
                            
                            ${flow.step < 5 ? `
                                <button class="btn btn-primary" onclick="window.thesisNextStep()" ${!flow.studentId ? 'disabled' : ''}>
                                    ถัดไป
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:8px;"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            ` : `
                                <button class="btn btn-primary" onclick="window.saveThesisAssignments()" style="background:var(--success-color); border:none; padding:10px 30px;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:8px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                    ยืนยันการบันทึก
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Summary Sidebar -->
            <div class="sticky-top" style="top:20px;">
                <div class="card" style="border:none; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05); border-left:4px solid var(--accent-primary);">
                    <div class="card-header"><h3 class="card-title">สรุปข้อมูลการแต่งตั้ง</h3></div>
                    <div class="card-body">
                        <div style="margin-bottom:20px;">
                            <label style="font-size:0.7rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; display:block; margin-bottom:5px;">นักศึกษา</label>
                            <div style="font-weight:700; color:var(--accent-primary); font-size:1.05rem;">${studentName}</div>
                        </div>
                        
                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px; padding:15px; background:var(--bg-light); border-radius:12px; border:1px solid var(--border-color);">
                            <div>
                                <label style="font-size:0.65rem; color:var(--text-muted); display:block; margin-bottom:2px;">ที่ปรึกษาหลัก (1)</label>
                                <div style="font-size:0.85rem; font-weight:600;">${flow.main}</div>
                            </div>
                            <div>
                                <label style="font-size:0.65rem; color:var(--text-muted); display:block; margin-bottom:2px;">ที่ปรึกษาร่วม (1)</label>
                                <div style="font-size:0.85rem; font-weight:600;">${flow.coInternal}</div>
                            </div>
                            <div>
                                <label style="font-size:0.65rem; color:var(--text-muted); display:block; margin-bottom:2px;">ที่ปรึกษาร่วม (2)</label>
                                <div style="font-size:0.85rem; font-weight:600;">${flow.coExternal}</div>
                            </div>
                        </div>

                        ${flow.topicTh ? `
                        <div style="margin-bottom:20px;">
                            <label style="font-size:0.7rem; color:var(--text-muted); display:block; margin-bottom:5px;">หัวข้อวิทยานิพนธ์</label>
                            <div style="font-size:0.8rem; background:#fff; padding:12px; border:1px dashed var(--border-color); border-radius:8px; font-style:italic; line-height:1.4;">${flow.topicTh}</div>
                        </div>
                        ` : ''}

                        <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.5; padding-top:15px; border-top:1px solid var(--border-color); margin-bottom:20px;">
                            <p><strong>กฎเกณฑ์:</strong> กำหนดที่ปรึกษาได้ไม่เกิน 3 ท่าน โดยเป็นประธาน 1 ท่าน และกรรมการร่วมไม่เกิน 2 ท่าน</p>
                        </div>

                        ${flow.step === 5 ? `
                        <button class="btn btn-primary" style="width:100%; height:45px; font-weight:700; background:var(--success-color); border:none; box-shadow:0 4px 12px rgba(16, 185, 129, 0.2);" 
                                onclick="window.saveThesisAssignments()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:8px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                            ยืนยันการบันทึก
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>

        </div>
    </div>
    `;
};

// ====== Navigation & Interaction Functions ======

window.init_thesis_advisor = function() {
    // Override the global SearchableSelect callback for this page
    window.onSearchSelectChange = function(id, val) {
        if (id === 'thesisStudentSelect') window.selectThesisStudent(val);
        if (id === 'mainAdvisorSelect') window.selectMainAdvisor(val);
        if (id === 'coInternalSelect') window.selectCoInternal(val);
        if (id === 'coExternalSelect') window.selectCoExternal(val);
    };
};

window.thesisNextStep = function() {
    if (window._thesisFlow.step < 5) {
        window._thesisFlow.step++;
        renderPage();
    }
};

window.thesisPrevStep = function() {
    if (window._thesisFlow.step > 1) {
        window._thesisFlow.step--;
        renderPage();
    }
};

window.selectThesisStudent = function(val) {
    const st = (MOCK.students || []).find(s => String(s.id || s.studentId) === String(val));
    window._thesisFlow = {
        ...window._thesisFlow,
        studentId: val,
        main: st?.mainAdvisor || '-',
        coInternal: st?.coAdvisorInternal || '-',
        coExternal: st?.coAdvisorExternal || '-',
        topicTh: st?.thesisTopic || st?.thesisInfo?.title || '',
        topicEn: st?.thesisInfo?.titleEn || ''
    };
    renderPage();
};

window.selectMainAdvisor = function(val) {
    window._thesisFlow.main = val || '-';
    renderPage();
};

window.selectCoInternal = function(val) {
    window._thesisFlow.coInternal = val || '-';
    renderPage();
};

window.selectCoExternal = function(val) {
    window._thesisFlow.coExternal = val || '-';
    renderPage();
};

window.saveThesisAssignments = async function() {
    const flow = window._thesisFlow;
    if (!flow.studentId || flow.main === '-') {
        showToast('กรุณาเลือกนักศึกษาและอาจารย์ที่ปรึกษาหลักให้ครบถ้วน', 'warning');
        return;
    }

    if (!flow.topicTh) {
        if (!confirm('คุณยังไม่ได้ระบุหัวข้อวิทยานิพนธ์ ต้องการบันทึกข้อมูลทีมที่ปรึกษาโดยไม่ระบุหัวข้อหรือไม่?')) return;
    }

    showApiLoading('กำลังบันทึกข้อมูลการแต่งตั้ง...');
    try {
        const payload = {
            mainAdvisor: flow.main,
            coAdvisorInternal: flow.coInternal,
            coAdvisorExternal: flow.coExternal,
            thesisTopic: flow.topicTh
        };
        
        const res = await window.api.updateStudentDetail(flow.studentId, payload);
        
        if (res.status === 'success') {
            showToast('บันทึกข้อมูลการแต่งตั้งและหัวข้อวิทยานิพนธ์เรียบร้อยแล้ว', 'success');
            
            // Update MOCK locally for immediate UI update
            const stIdx = MOCK.students.findIndex(s => String(s.id || s.studentId) === String(flow.studentId));
            if (stIdx !== -1) {
                MOCK.students[stIdx].mainAdvisor = flow.main;
                MOCK.students[stIdx].coAdvisorInternal = flow.coInternal;
                MOCK.students[stIdx].coAdvisorExternal = flow.coExternal;
                MOCK.students[stIdx].thesisTopic = flow.topicTh;
                if (!MOCK.students[stIdx].thesisInfo) MOCK.students[stIdx].thesisInfo = {};
                MOCK.students[stIdx].thesisInfo.title = flow.topicTh;
                MOCK.students[stIdx].thesisInfo.titleEn = flow.topicEn;
            }
            
            // Success State: Clear flow and reset to step 1
            window._thesisFlow = null;
            renderPage();
        } else {
            throw new Error(res.message);
        }
    } catch (err) {
        showToast('เกิดข้อผิดพลาดในการบันทึก: ' + err.message, 'error');
    } finally {
        hideApiLoading();
    }
};
