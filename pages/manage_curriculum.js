pages['manage-curriculum'] = function() {
    // Check if programs exist, if not import from MOCK
    if (!MOCK.programsData) {
        MOCK.programsData = (MOCK.programs || []).map((p, i) => ({
            id: 'M' + (i + 1).toString().padStart(3, '0'),
            name: p.name,
            degree: 'พยาบาลศาสตรมหาบัณฑิต (พย.ม.)',
            status: 'เปิดสอน'
        }));
    }

    const programs = MOCK.programsData;

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
                <h1 class="page-title">จัดการรายละเอียดหลักสูตร</h1>
                <p class="page-subtitle">ตั้งค่ารายชื่อหลักสูตรและระบุสาขาวิชาที่เปิดสอนในระบบ</p>
            </div>
            <button class="btn btn-primary" onclick="addCurriculumMajor()">+ เพิ่มสาขาวิชา</button>
        </div>

        <div class="card">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">สาขาวิชาที่เปิดสอน (ป.โท)</h3>
                <input type="text" class="form-input" id="currSearch" placeholder="ค้นหาสาขาวิชา..." style="width:250px; padding:6px 12px;" onkeyup="filterCurriculum()" />
            </div>
            <div class="card-body">
                <div style="overflow-x:auto;">
                    <table class="data-table" id="curriculumTable">
                        <thead>
                            <tr>
                                <th style="width:100px;">รหัสสาขา</th>
                                <th>ชื่อสาขาวิชา</th>
                                <th>ชื่อปริญญา (ย่อ)</th>
                                <th style="text-align:center;">สถานะ</th>
                                <th style="text-align:center; width:150px;">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${programs.length > 0 ? programs.map((p, index) => `
                            <tr>
                                <td>${p.id}</td>
                                <td><strong>${p.name}</strong></td>
                                <td>${p.degree}</td>
                                <td style="text-align:center;">
                                    <span class="badge ${p.status==='เปิดสอน'?'success':'danger'}">${p.status}</span>
                                </td>
                                <td style="text-align:center;">
                                    <div style="display:flex; justify-content:center; gap:6px;">
                                        <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="editCurriculumMajor(${index})">แก้ไข</button>
                                        <button class="btn btn-outline-danger" style="padding:4px 8px; font-size:0.75rem; color:#ef4444; border-color:#ef4444;" onclick="deleteCurriculumMajor(${index})">ลบ</button>
                                    </div>
                                </td>
                            </tr>
                            `).join('') : `<tr><td colspan="5" style="text-align:center; padding: 20px;">ไม่มีข้อมูลสาขาวิชา</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

window.filterCurriculum = function() {
    const table = document.getElementById('curriculumTable');
    if (!table) return;
    const rows = table.getElementsByTagName('tr');
    const term = document.getElementById('currSearch').value.toLowerCase();
    
    for (let i = 1; i < rows.length; i++) {
        if(rows[i].cells.length <= 1) continue; // Skip empty message row
        const text = rows[i].textContent.toLowerCase();
        rows[i].style.display = text.includes(term) ? '' : 'none';
    }
};

window.addCurriculumMajor = function() {
    const newName = prompt('ระบุชื่อสาขาวิชาใหม่:');
    if (!newName || newName.trim() === '') return;

    MOCK.programsData.push({
        id: 'M' + (MOCK.programsData.length + 1).toString().padStart(3, '0'),
        name: newName.trim(),
        degree: 'พยาบาลศาสตรมหาบัณฑิต (พย.ม.)',
        status: 'เปิดสอน'
    });
    
    // Sync with original MOCK.programs for other parts of the app
    if(MOCK.programs) MOCK.programs.push({ name: newName.trim() });
    
    renderPage();
};

window.editCurriculumMajor = function(index) {
    const p = MOCK.programsData[index];
    const newName = prompt('แก้ไขชื่อสาขาวิชา:', p.name);
    if (!newName || newName.trim() === '') return;

    // Optional status toggle
    const newStatus = confirm(`ต้องการให้สาขา "${newName}" มีสถานะ 'เปิดสอน' หรือไม่?\n(กด OK = เปิดสอน, Cancel = ปิดรับ)`) ? 'เปิดสอน' : 'ปิดรับ';

    MOCK.programsData[index].name = newName.trim();
    MOCK.programsData[index].status = newStatus;
    
    // Sync
    if(MOCK.programs && MOCK.programs[index]) MOCK.programs[index].name = newName.trim();
    
    renderPage();
};

window.deleteCurriculumMajor = function(index) {
    const p = MOCK.programsData[index];
    if (confirm(`ยื่นยันการลบสาขาวิชา "${p.name}" ออกจากระบบ?\n(การกระทำนี้จำลองการลบเท่านั้น)`)) {
        MOCK.programsData.splice(index, 1);
        if(MOCK.programs) MOCK.programs.splice(index, 1);
        renderPage();
    }
};
