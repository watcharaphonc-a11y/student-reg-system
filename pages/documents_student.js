// ============================
// Student Documents Page
// ============================
pages['documents-student'] = function() {
    const templates = MOCK.documentTemplates || [];
    const docs = MOCK.studentDocuments || [];

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ส่งเอกสารออนไลน์</h1>
            <p class="page-subtitle">ยื่นคำร้องและติดตามสถานะเอกสารออนไลน์</p>
        </div>

        <div class="grid-2">
            <!-- Form Submission Area -->
            <div class="card animate-in animate-delay-1">
                <div class="card-header">
                    <h3 class="card-title">ยื่นคำร้องใหม่</h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        
                        <!-- Row 1 -->
                        <div class="form-group">
                            <label class="form-label">ประเภทเอกสาร <span style="color:var(--danger-color)">*</span></label>
                            <div style="display:flex; gap:10px;">
                                <label style="flex:1; display:flex; align-items:center; gap:8px; padding:8px 12px; border:1px solid var(--accent-primary); border-radius:var(--radius-md); cursor:pointer; background:rgba(var(--accent-primary-rgb), 0.05);" id="lblDocNew" onclick="selectDocType('new')">
                                    <input type="radio" name="docType" value="new" checked style="accent-color: var(--accent-primary);">
                                    <span>📄 ส่งเอกสารใหม่</span>
                                </label>
                                <label style="flex:1; display:flex; align-items:center; gap:8px; padding:8px 12px; border:1px solid var(--border-color); border-radius:var(--radius-md); cursor:pointer;" id="lblDocRevise" onclick="selectDocType('revise')">
                                    <input type="radio" name="docType" value="revise" style="accent-color: var(--accent-primary);">
                                    <span>✏️ ส่งเอกสารแก้ไข</span>
                                </label>
                            </div>
                        </div>

                        <!-- Hidden Row: Reference Document -->
                        <div class="form-group" id="refDocGroup" style="grid-column: 1 / -1; display: none;">
                            <label class="form-label" style="display:flex; align-items:center; gap:8px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                <span>อ้างอิงเอกสารชุดเดิม</span>
                                <span style="font-size:0.85rem;font-weight:normal;color:var(--text-muted);">— เลือกเอกสารที่ต้องการแก้ไข</span>
                            </label>
                            <div style="position:relative;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" class="form-input" id="refDocSearch" placeholder="ค้นหาเอกสารเก่า (รหัส, ชื่อ, หัวเรื่อง)..." style="padding-left:38px;" onkeyup="searchRefDocs()">
                            </div>
                            <div id="refDocResults" style="margin-top:10px; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:15px; text-align:center; color:var(--text-muted); font-size:0.9rem; background:var(--bg-secondary);">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom:8px;"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"></path><polyline points="22 7 12 13 2 7"></polyline><line x1="16" y1="21" x2="22" y2="15"></line><line x1="16" y1="15" x2="22" y2="21"></line></svg><br>ไม่พบเอกสารที่ตรงกัน
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">ชื่อนักศึกษา</label>
                            <input type="text" class="form-input" style="background-color:var(--bg-tertiary); color:var(--text-muted);" value="${MOCK.student ? MOCK.student.prefix + MOCK.student.firstName + ' ' + MOCK.student.lastName : ''}" readonly>
                        </div>

                        <!-- Row 2 -->
                        <div class="form-group">
                            <label class="form-label">รหัสนักศึกษา</label>
                            <input type="text" class="form-input" style="background-color:var(--bg-tertiary); color:var(--text-muted);" value="${MOCK.student ? (MOCK.student.studentId || MOCK.student.id) : ''}" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">รุ่นที่</label>
                            <input type="text" class="form-input" placeholder="เช่น 15">
                        </div>

                        <!-- Row 3 -->
                        <div class="form-group">
                            <label class="form-label">หัวเรื่อง / แบบฟอร์ม <span style="color:var(--danger-color)">*</span></label>
                            <select class="form-select" id="docTemplateForm">
                                <option value="">-- กรุณาเลือกแบบฟอร์ม --</option>
                                ${templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">สาขาวิชา <span style="color:var(--danger-color)">*</span></label>
                            <select class="form-select" id="docMajor">
                                <option value="">-- กรุณาเลือกสาขาวิชา --</option>
                                ${MOCK.programs ? MOCK.programs.map(p => `<option value="${p.id}" ${MOCK.student && MOCK.student.faculty && MOCK.student.faculty.includes(p.name) ? 'selected' : ''}>${p.name}</option>`).join('') : ''}
                            </select>
                        </div>

                        <!-- Row 4 -->
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label class="form-label">จุดประสงค์ / รายละเอียด</label>
                            <input type="text" class="form-input" id="docNote" placeholder="อธิบายจุดประสงค์ของเอกสารโดยย่อ">
                        </div>

                        <!-- Row 5 -->
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label class="form-label">แนบไฟล์เอกสาร <span style="color:var(--danger-color)">*</span> <span style="font-size:0.85rem;font-weight:normal;color:var(--text-muted);">(PDF, Word, รูปภาพ)</span></label>
                            <div style="border: 2px dashed var(--border-color); padding: 30px; text-align: center; border-radius: var(--radius-md); background: var(--bg-tertiary); cursor: pointer; transition: all 0.2s;" onclick="document.getElementById('docFile').click()" onmouseover="this.style.borderColor='var(--accent-primary)'" onmouseout="this.style.borderColor='var(--border-color)'">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom: 10px;">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></path>
                                </svg>
                                <p style="font-size: 0.95rem; font-weight: 500; color: var(--accent-primary);" id="fileNameDisplay">คลิกเพื่อเลือกไฟล์ <span style="color: var(--text-muted); font-weight: normal;">หรือลากไฟล์มาวาง</span></p>
                                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">รองรับ PDF, DOC, DOCX, JPG, PNG - สูงสุด 5 ไฟล์</p>
                                <input type="file" id="docFile" style="display: none;" onchange="updateDocFileName(this)">
                            </div>
                        </div>

                    </div>
                </div>
                <div class="card-footer" style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                    <button class="btn" style="background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color);" onclick="document.getElementById('docTemplateForm').value=''; document.getElementById('docNote').value=''; document.getElementById('docFile').value=''; updateDocFileName(document.getElementById('docFile'));">ล้างข้อมูล</button>
                    <button class="btn btn-primary" onclick="submitStudentDocument()" style="display:flex; align-items:center; gap:8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        ส่งเอกสาร
                    </button>
                </div>
            </div>

            <!-- Documents Tracking Table -->
            <div class="card animate-in animate-delay-2">
                <div class="card-header">
                    <h3 class="card-title">ประวัติการส่งเอกสารและสถานะ</h3>
                </div>
                <div class="card-body" style="padding: 0;">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>รหัสเอกสาร</th>
                                    <th>แบบฟอร์มคำร้อง</th>
                                    <th>วันที่ส่ง</th>
                                    <th>สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${docs.length === 0 ? `<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">ไม่มีร่ายการส่งเอกสาร</td></tr>` : ''}
                                ${docs.map(d => {
                                    let badgeClass = 'neutral';
                                    if (d.status.includes('อนุมัติ')) badgeClass = 'success';
                                    if (d.status.includes('ปฏิเสธ')) badgeClass = 'danger';
                                    if (d.status.includes('รอ') || d.status.includes('กำลัง')) badgeClass = 'warning';
                                    
                                    return `
                                    <tr>
                                        <td style="font-weight:600; color:var(--accent-primary)">${d.id}</td>
                                        <td>
                                            <div style="font-weight:500;">${d.formName}</div>
                                            ${d.attachment ? `<div style="font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:4px; margin-top:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>${d.attachment}</div>` : ''}
                                        </td>
                                        <td>${d.submitDate}</td>
                                        <td><span class="badge ${badgeClass}">${d.status}</span></td>
                                    </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

window.selectedRefDocId = null;

window.searchRefDocs = function() {
    const query = document.getElementById('refDocSearch').value.toLowerCase();
    const resultsContainer = document.getElementById('refDocResults');
    const docs = MOCK.studentDocuments || [];
    
    const emptyState = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom:8px;"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"></path><polyline points="22 7 12 13 2 7"></polyline><line x1="16" y1="21" x2="22" y2="15"></line><line x1="16" y1="15" x2="22" y2="21"></line></svg><br>ไม่พบเอกสารที่ตรงกัน`;
    
    if (!query) {
        resultsContainer.innerHTML = emptyState;
        return;
    }
    
    const matched = docs.filter(d => 
        (d.id && d.id.toLowerCase().includes(query)) || 
        (d.formName && d.formName.toLowerCase().includes(query))
    );
    
    if (matched.length === 0) {
        resultsContainer.innerHTML = emptyState;
    } else {
        resultsContainer.innerHTML = `<div style="display:flex; flex-direction:column; gap:8px;">` + 
            matched.map(d => `
                <div style="padding:10px; border:1px solid var(--border-color); border-radius:var(--radius-sm); cursor:pointer; text-align:left; background:var(--bg-primary); transition:all 0.2s;" onclick="selectRefDoc('${d.id}', '${d.formName}')" onmouseover="this.style.borderColor='var(--accent-primary)'" onmouseout="this.style.borderColor='var(--border-color)'">
                    <div style="font-weight:600; color:var(--accent-primary); font-size:0.9rem;">${d.id} <span style="color:var(--text-muted); font-weight:normal; font-size:0.8rem; margin-left:8px;">${d.submitDate}</span></div>
                    <div style="font-size:0.85rem; color:var(--text-primary); margin-top:4px;">${d.formName}</div>
                </div>
            `).join('') + `</div>`;
    }
};

window.selectRefDoc = function(id, name) {
    window.selectedRefDocId = id;
    document.getElementById('refDocSearch').value = id + ' - ' + name;
    document.getElementById('refDocResults').innerHTML = `<div style="color:var(--success); font-size:0.9rem; font-weight:500;">✅ เลือกเอกสารอ้างอิง: ${id} แล้ว</div>`;
};

window.selectDocType = function(type) {
    const lblNew = document.getElementById('lblDocNew');
    const lblRevise = document.getElementById('lblDocRevise');
    const refGroup = document.getElementById('refDocGroup');
    
    // We can use a simple hack for rgb colors if the CSS variable is not raw RGB
    const activeBg = 'rgba(239, 68, 68, 0.05)'; // Using red theme color roughly
    const activeBorder = 'var(--accent-primary)';
    
    if (type === 'new') {
        lblNew.style.background = activeBg;
        lblNew.style.borderColor = activeBorder;
        lblRevise.style.background = 'transparent';
        lblRevise.style.borderColor = 'var(--border-color)';
        if(refGroup) refGroup.style.display = 'none';
        window.selectedRefDocId = null;
    } else {
        lblRevise.style.background = activeBg;
        lblRevise.style.borderColor = activeBorder;
        lblNew.style.background = 'transparent';
        lblNew.style.borderColor = 'var(--border-color)';
        if(refGroup) {
            refGroup.style.display = 'block';
            window.searchRefDocs();
        }
    }
};

window.updateDocFileName = function(input) {
    const display = document.getElementById('fileNameDisplay');
    if (input.files && input.files.length > 0) {
        display.textContent = input.files[0].name;
        display.style.color = 'var(--text-primary)';
        display.style.fontWeight = '600';
    } else {
        display.textContent = 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่';
        display.style.color = 'var(--text-muted)';
        display.style.fontWeight = 'normal';
    }
};

window.toggleAttachmentReq = function() {
    // Just a UI helper, could be used to toggle required star if data had it
};

window.submitStudentDocument = function() {
    const formId = document.getElementById('docTemplateForm').value;
    const fileInput = document.getElementById('docFile');
    const noteRaw = document.getElementById('docNote').value;
    const docType = document.querySelector('input[name="docType"]:checked').value;
    
    let note = noteRaw;
    if (docType === 'revise' && window.selectedRefDocId) {
        note = `[แก้ไขอ้างอิง ${window.selectedRefDocId}] ` + noteRaw;
    }

    if (!formId) {
        alert('กรุณาเลือกแบบฟอร์มคำร้อง');
        return;
    }

    const template = MOCK.documentTemplates.find(t => t.id === formId);
    if (!template) return;

    let fileName = null;
    if (fileInput.files && fileInput.files.length > 0) {
        fileName = fileInput.files[0].name;
    } else {
        alert('กรุณาแนบไฟล์เอกสารในระบบ');
        return;
    }

    showApiLoading('กำลังส่งเอกสารเข้าระบบ...');
    
    setTimeout(() => {
        // Generate mock ID
        const docId = 'DOC-68' + Math.floor(Math.random() * 900 + 100);
        const today = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        
        const newDoc = {
            id: docId,
            formId: formId,
            formName: template.name,
            status: 'รอการตรวจสอบ',
            submitDate: today,
            lastUpdate: today,
            attachment: fileName
        };
        
        MOCK.studentDocuments.unshift(newDoc);
        
        // Also push to Admin view
        MOCK.adminDocuments.unshift({
            id: docId,
            studentId: MOCK.student ? (MOCK.student.studentId || MOCK.student.id) : 'Unknown',
            studentName: MOCK.student ? (MOCK.student.prefix + MOCK.student.firstName + ' ' + MOCK.student.lastName) : 'Unknown',
            formName: template.name,
            status: 'รอตรวจสอบเอกสาร',
            submitDate: today,
            attachment: fileName,
            nextStep: 'เจ้าหน้าที่ทะเบียน'
        });

        hideApiLoading();
        alert('ส่งเอกสารสำเร็จ รหัสติดตาม: ' + docId);
        renderPage(); // Reload the current page to show in the table
    }, 800);
};
