/**
 * Page: Manage Schedule (Administrative)
 * Allows importing and managing teaching schedules.
 */

pages['manage-schedule'] = function () {
    return `
        <div class="animate-in">
            <div class="page-header">
                <div class="header-content">
                    <h1 class="page-title">จัดการตารางเรียน</h1>
                    <p class="page-subtitle">จัดการข้อมูลรายวิชา วันเวลาเรียน และอาจารย์ผู้สอน</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-outline" onclick="window.downloadScheduleTemplate()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ดาวน์โหลดเทมเพลต
                    </button>
                    <button class="btn btn-primary" onclick="window.showImportTab()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/></svg>
                        นำเข้าข้อมูล (CSV)
                    </button>
                </div>
            </div>

            <div class="card" style="margin-bottom:24px; padding:0;">
                <div class="tabs-header" style="padding: 0 24px; border-bottom: 1px solid var(--border-color); display: flex;">
                    <button class="tab-btn active" data-tab="list" onclick="window.switchScheduleTab('list')">รายการตารางเรียน</button>
                    <button class="tab-btn" data-tab="import" onclick="window.switchScheduleTab('import')">นำเข้าข้อมูล</button>
                </div>

                <div id="scheduleTabContent" style="padding: 24px;">
                    <!-- Content will be injected here -->
                </div>
            </div>
        </div>
    `;
};

window.switchScheduleTab = function(tab) {
    const container = document.getElementById('scheduleTabContent');
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'list') {
        renderScheduleList(container);
    } else {
        renderScheduleImport(container);
    }
};

window.showImportTab = function() {
    window.switchScheduleTab('import');
};

function renderScheduleList(container) {
    const items = MOCK.schedule.items || [];
    
    if (items.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 0; color:var(--text-muted);">
                <div style="font-size:3rem; margin-bottom:16px;">📅</div>
                <h3>ยังไม่มีข้อมูลตารางเรียน</h3>
                <p>กรุณานำเข้าข้อมูลจากไฟล์ CSV เพื่อเริ่มใช้งาน</p>
                <button class="btn btn-primary" style="margin-top:16px;" onclick="window.showImportTab()">นำเข้าข้อมูลตอนนี้</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div style="margin-bottom:20px; display:flex; gap:12px; align-items:center;">
            <div class="search-box" style="flex:1;">
                <input type="text" id="scheduleSearch" placeholder="ค้นหารหัสวิชา, ชื่อวิชา หรืออาจารย์..." class="form-control" onkeyup="window.filterScheduleTable()">
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted);">
                ทั้งหมด <span id="scheduleCount">${items.length}</span> รายการ
            </div>
        </div>
        <div class="table-container">
            <table class="table" id="scheduleMainTable">
                <thead>
                    <tr>
                        <th>รหัสวิชา</th>
                        <th>ชื่อวิชา</th>
                        <th>วัน</th>
                        <th>เวลา (คาบ)</th>
                        <th>ห้อง</th>
                        <th>อาจารย์ผู้สอน</th>
                        <th style="text-align:center;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((item, idx) => `
                        <tr data-index="${idx}">
                            <td style="font-weight:600; color:var(--accent-primary);">${item.code}</td>
                            <td>${item.name}</td>
                            <td>${MOCK.schedule.days[item.day] || item.day}</td>
                            <td>คาบ ${item.startSlot + 1} - ${item.endSlot + 1}</td>
                            <td>${item.room || '-'}</td>
                            <td>
                                <div style="font-weight:500;">${item.instructorName}</div>
                                <div style="font-size:0.75rem; color:var(--text-muted);">${item.instructorId}</div>
                            </td>
                            <td style="text-align:center;">
                                <button class="btn btn-icon btn-outline-danger" onclick="window.deleteScheduleItem(${idx})" title="ลบ">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

window.filterScheduleTable = function() {
    const query = document.getElementById('scheduleSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#scheduleMainTable tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    document.getElementById('scheduleCount').textContent = visibleCount;
};

function renderScheduleImport(container) {
    container.innerHTML = `
        <div style="max-width:800px; margin:0 auto;">
            <div class="alert alert-info" style="margin-bottom:24px;">
                <h4 style="margin-bottom:8px;">คำแนะนำการนำเข้าข้อมูล</h4>
                <ul style="font-size:0.9rem; margin-left:20px; color:var(--info-color-dark);">
                    <li>ใช้ไฟล์นามสกุล .csv เท่านั้น (Encoding เป็น UTF-8)</li>
                    <li><strong>Day</strong>: 0=จันทร์, 1=อังคาร, 2=พุธ, 3=พฤหัสฯ, 4=ศุกร์, 5=เสาร์, 6=อาทิตย์</li>
                    <li><strong>StartSlot/EndSlot</strong>: 0-11 (อ้างอิงตามตาราง 12 คาบ)</li>
                    <li><strong>InstructorID</strong>: รหัสอาจารย์ต้องตรงกับในระบบเพื่อใช้คำนวณค่าสอน</li>
                </ul>
            </div>

            <div id="dropZone" style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 48px; text-align: center; cursor: pointer; transition: all 0.2s;" 
                 onover="this.style.borderColor='var(--accent-primary)'" 
                 onleave="this.style.borderColor='var(--border-color)'"
                 onclick="window.handleGenericCSVImport(window.previewScheduleImport)">
                <div style="font-size:3rem; margin-bottom:16px;">📁</div>
                <h3 style="margin-bottom:8px;">คลิกเพื่อเลือกไฟล์ CSV</h3>
                <p style="color:var(--text-muted);">หรือลากไฟล์มาวางที่นี่</p>
            </div>

            <div id="importPreview" style="margin-top:32px; display:none;">
                <h3 style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
                    ตรวจสอบข้อมูลก่อนนำเข้า
                    <button class="btn btn-primary" onclick="window.submitScheduleImport()">
                        ยืนยันการนำเข้า (<span id="previewCount">0</span> รายการ)
                    </button>
                </h3>
                <div class="table-container" style="max-height:400px;">
                    <table class="table" id="previewTable">
                        <thead>
                            <tr id="previewHeaders"></tr>
                        </thead>
                        <tbody id="previewBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

let pendingImportData = null;

window.previewScheduleImport = function(data, headers) {
    pendingImportData = data;
    const previewArea = document.getElementById('importPreview');
    const headersRow = document.getElementById('previewHeaders');
    const body = document.getElementById('previewBody');
    const countLabel = document.getElementById('previewCount');

    headersRow.innerHTML = headers.map(h => `<th>${h}</th>`).join('');
    body.innerHTML = data.slice(0, 10).map(row => `
        <tr>
            ${headers.map(h => `<td>${row[h] || '-'}</td>`).join('')}
        </tr>
    `).join('') + (data.length > 10 ? `<tr><td colspan="${headers.length}" style="text-align:center; color:var(--text-muted);">... และอีก ${data.length - 10} รายการ ...</td></tr>` : '');

    countLabel.textContent = data.length;
    previewArea.style.display = 'block';
    
    // Smooth scroll to preview
    previewArea.scrollIntoView({ behavior: 'smooth' });
};

window.submitScheduleImport = async function() {
    if (!pendingImportData) return;

    const confirmClear = confirm(`ยืนยันการนำเข้าข้อมูล ${pendingImportData.length} รายการ?\n\nต้องการลบข้อมูลตารางเดิมทิ้งก่อนหรือไม่? (กด OK เพื่อลบของเดิม, Cancel เพื่อเพิ่มหน้าของเดิม)`);

    try {
        showApiLoading('กำลังส่งข้อมูลไปยังเซิร์ฟเวอร์...');
        const result = await postData('importSchedule', {
            schedules: pendingImportData,
            clearExisting: confirmClear
        });

        if (result.status === 'success') {
            alert('นำเข้าข้อมูลตารางเรียนสำเร็จแล้ว!');
            // Reload page to refresh MOCK
            window.location.reload();
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        alert('เกิดข้อผิดพลาดในการนำเข้า: ' + err.message);
    } finally {
        hideApiLoading();
    }
};

window.downloadScheduleTemplate = function() {
    const headers = ['CourseCode', 'CourseName', 'Day', 'StartSlot', 'EndSlot', 'Room', 'InstructorID', 'InstructorName', 'Color', 'Semester', 'AcademicYear', 'Section'];
    const sample = ['NSG601', 'Advanced Nursing Science', '0', '0', '2', 'R401', 'teacher-01', 'ผศ.ดร.พนา รัตน์', 'blue', '1', '2568', 'A'];
    window.downloadCSVTemplate('schedule_template.csv', headers, sample);
};

window.deleteScheduleItem = async function(index) {
    if (!confirm('ยืนยันคุณต้องการลบรายการนี้ใช่หรือไม่? (การลบจะมีผลทันทีในระบบ)')) return;
    
    // In a real system, we'd delete from the sheet. 
    // Here we can re-import the existing list without this item or add a 'deleteRow' API.
    // For simplicity, let's filter and re-import with clearExisting=true
    const items = [...MOCK.schedule.items];
    items.splice(index, 1);

    try {
        showApiLoading('กำลังลบข้อมูล...');
        // Map back to API format (CSV headers)
        const schedules = items.map(it => ({
            CourseCode: it.code,
            CourseName: it.name,
            Day: it.day,
            StartSlot: it.startSlot,
            EndSlot: it.endSlot,
            Room: it.room,
            InstructorID: it.instructorId,
            InstructorName: it.instructorName,
            Color: it.color,
            Semester: it.semester,
            AcademicYear: it.academicYear,
            Section: it.section
        }));

        const result = await postData('importSchedule', {
            schedules: schedules,
            clearExisting: true
        });

        if (result.status === 'success') {
            MOCK.schedule.items = items;
            renderScheduleList(document.getElementById('scheduleTabContent'));
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        alert('เกิดข้อผิดพลาดในการลบ: ' + err.message);
    } finally {
        hideApiLoading();
    }
};

window.init_manage_schedule = function() {
    window.switchScheduleTab('list');
};
