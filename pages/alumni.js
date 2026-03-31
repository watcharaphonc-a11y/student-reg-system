// ============================
// Alumni (ศิษย์เก่า) Page
// ============================

pages.alumni = function() {
    const students = MOCK.students || [];
    const alumni = students.filter(s => s.status === 'สำเร็จการศึกษา' || s.status === 'Graduated');
    
    // Stats
    const totalAlumni = alumni.length;
    const departments = [...new Set(alumni.map(s => s.department))].filter(Boolean);

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
                <h1 class="page-title">ฐานข้อมูลศิษย์เก่า (Alumni)</h1>
                <p class="page-subtitle">รายชื่อผู้สำเร็จการศึกษาและข้อมูลการทำงาน</p>
            </div>
            <div style="display:flex; gap:10px;">
                 <div class="search-box" style="display:flex; min-width:250px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="alumniSearch" placeholder="ค้นหาชื่อ หรือ รหัสนักศึกษา..." onkeyup="filterAlumniTable()">
                </div>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 24px;">
            <div class="stat-card">
                <div class="stat-icon purple">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <div class="stat-value">${totalAlumni}</div>
                <div class="stat-label">ศิษย์เก่าทั้งหมด</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div class="stat-value">${departments.length}</div>
                <div class="stat-label">สาขาวิชาที่มีผู้จบ</div>
            </div>
        </div>

        <div class="card animate-in animate-delay-1">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">รายชื่อผู้สำเร็จการศึกษา</h3>
                <div style="display:flex; gap:10px;">
                    <select class="form-input" style="margin:0; width:180px;" onchange="filterAlumniTable()" id="filterAlumniYear">
                         <option value="">-- ทุกปีที่จบ --</option>
                         ${[...new Set(alumni.map(s => s.graduationYear))].sort((a,b)=>b-a).map(y => `<option value="${y}">${y || 'ไม่ระบุ'}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="card-body" style="padding:0">
                <div class="table-wrapper">
                    <table class="data-table" id="alumniTable">
                        <thead>
                            <tr>
                                <th>รหัสนักศึกษา</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>สาขาวิชา</th>
                                <th>ปีที่จบ</th>
                                <th>สถานที่ทำงาน</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${alumni.length > 0 ? alumni.map(s => `
                                <tr>
                                    <td style="font-weight:600; color:var(--accent-primary);">${s.studentId || s.id}</td>
                                    <td>${s.prefix || ''}${s.firstName} ${s.lastName}</td>
                                    <td>${s.department || '-'}</td>
                                    <td style="text-align:center;">${s.graduationYear || '-'}</td>
                                    <td>
                                        <div style="font-weight:500;">${s.workplace || '-'}</div>
                                        <div style="font-size:0.75rem; color:var(--text-muted);">${s.position || ''}</div>
                                    </td>
                                    <td>
                                        <button class="btn btn-secondary btn-sm" onclick="viewAlumniProfile('${s.id || s.studentId}')">
                                            ดูข้อมูล
                                        </button>
                                    </td>
                                </tr>
                            `).join('') : `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">ยังไม่มีข้อมูลศิษย์เก่าในระบบ</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

window.filterAlumniTable = function() {
    const searchText = document.getElementById('alumniSearch').value.toLowerCase();
    const yearFilter = document.getElementById('filterAlumniYear').value;
    const table = document.getElementById('alumniTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let row of rows) {
        if (row.cells.length < 6) continue;
        const idText = row.cells[0].textContent.toLowerCase();
        const nameText = row.cells[1].textContent.toLowerCase();
        const yearText = row.cells[3].textContent;
        
        const matchesSearch = idText.includes(searchText) || nameText.includes(searchText);
        const matchesYear = !yearFilter || yearText === yearFilter;
        
        row.style.display = (matchesSearch && matchesYear) ? '' : 'none';
    }
};

window.viewAlumniProfile = function(studentId) {
    // Switch to student profile and select this student
    if (typeof window.changeProfileStudent === 'function') {
        window.changeProfileStudent(studentId);
        navigateTo('student-profile');
    }
};
