pages['bulk-data'] = function() {
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">นำเข้า/ส่งออกข้อมูลเชิงลึก (Bulk Data)</h1>
            <p class="page-subtitle">จัดการข้อมูลระบบแบบกลุ่มผ่านไฟล์ CSV</p>
        </div>

        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <!-- Student Data -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">ข้อมูลนักศึกษา</h3>
                </div>
                <div class="card-body">
                    <p style="color:var(--text-secondary); margin-bottom: 20px;">นำเข้าหรือส่งออกรายชื่อและข้อมูลส่วนตัวพื้นฐานของนักศึกษา</p>
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-primary" style="flex:1;" onclick="document.getElementById('importStudentFile').click()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px; vertical-align:middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> 
                            Import CSV
                        </button>
                        <input type="file" id="importStudentFile" style="display:none;" accept=".csv" onchange="alert('อัปโหลดไฟล์ข้อมูลนักศึกษาแล้ว')" />
                        <button class="btn btn-secondary" style="flex:1;" onclick="alert('ดาวน์โหลดข้อมูลนักศึกษาสำเร็จ')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px; vertical-align:middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> 
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>

            <!-- Grades Data -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">ข้อมูลผลการศึกษา (เกรด)</h3>
                </div>
                <div class="card-body">
                    <p style="color:var(--text-secondary); margin-bottom: 20px;">อัปโหลดผลการเรียนของนักเรียน หรือส่งออกเกรดรวมทั้งหมด</p>
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-primary" style="flex:1;" onclick="document.getElementById('importGradeFile').click()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px; vertical-align:middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> 
                            Import CSV
                        </button>
                        <input type="file" id="importGradeFile" style="display:none;" accept=".csv" onchange="alert('อัปโหลดไฟล์เกรดแล้ว สำเร็จ!')" />
                        <button class="btn btn-secondary" style="flex:1;" onclick="alert('ดาวน์โหลดผลการเรียนทั้งหมด สำเร็จ')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px; vertical-align:middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> 
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>

            <!-- Registration Data -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">ข้อมูลการลงทะเบียนเรียน</h3>
                </div>
                <div class="card-body">
                    <p style="color:var(--text-secondary); margin-bottom: 20px;">นำเข้าข้อมูลรายวิชาที่นักศึกษาลงทะเบียนในแต่ละเทอม</p>
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-primary" style="flex:1;" onclick="alert('กำลังเปิดหน้าต่างอัปโหลดการลงทะเบียน')">Import CSV</button>
                        <button class="btn btn-secondary" style="flex:1;" onclick="alert('ดาวน์โหลดข้อมูลการลงทะเบียนเรียนสำเร็จ')">Export CSV</button>
                    </div>
                </div>
            </div>

            <!-- Thesis Tracking Data -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">ข้อมูลความก้าวหน้าวิทยานิพนธ์</h3>
                </div>
                <div class="card-body">
                    <p style="color:var(--text-secondary); margin-bottom: 20px;">จัดการข้อมูลสถานะสอบ เค้าโครง และวันสอบป้องกัน (Milestones)</p>
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-primary" style="flex:1;" onclick="alert('ฟีเจอร์นำเข้าความก้าวหน้ากำลังพัฒนา')">Import CSV</button>
                        <button class="btn btn-secondary" style="flex:1;" onclick="alert('ดาวน์โหลดข้อมูลวิทยานิพนธ์ สำเร็จ')">Export CSV</button>
                    </div>
                </div>
            </div>
            
            <!-- Schedule/Calendar Data -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">ตารางสอนและปฏิทิน</h3>
                </div>
                <div class="card-body">
                    <p style="color:var(--text-secondary); margin-bottom: 20px;">ซิงค์หรืออัปโหลดตารางเรียนตารางสอนรายภาคเรียน</p>
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-outline" style="flex:1;" onclick="alert('ดาวน์โหลด Template ตารางสอนสำเร็จ')">Download Template</button>
                        <button class="btn btn-primary" style="flex:1;" onclick="alert('ฟีเจอร์นำเข้าตารางเรียนกำลังพัฒนา')">Import CSV</button>
                    </div>
                </div>
            </div>

        </div>
    </div>`;
};
