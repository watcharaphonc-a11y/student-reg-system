pages['thesis-reports'] = function() {
    // Generate Mock Data for thesis milestones by Cohort
    const summaryData = [
        { cohort: '64', total: 45, m1: 0, m2: 0, m3: 0, m4: 0, m5: 2, m6: 3, m7: 5, m8: 5, grad: 30 },
        { cohort: '65', total: 52, m1: 2, m2: 5, m3: 10, m4: 15, m5: 10, m6: 5, m7: 3, m8: 2, grad: 0 },
        { cohort: '66', total: 60, m1: 20, m2: 15, m3: 12, m4: 8, m5: 5, m6: 0, m7: 0, m8: 0, grad: 0 },
        { cohort: '67', total: 58, m1: 40, m2: 10, m3: 5, m4: 3, m5: 0, m6: 0, m7: 0, m8: 0, grad: 0 },
    ];

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
                <h1 class="page-title">รายงานสรุปวิทยานิพนธ์</h1>
                <p class="page-subtitle">แสดงสถิติและภาพรวมความก้าวหน้าวิทยานิพนธ์ของนักศึกษาแต่ละรุ่น</p>
            </div>
            <button class="btn btn-secondary" onclick="alert('ดาวน์โหลดรายงาน CSV สำเร็จ')">ดาวน์โหลดรายงาน (CSV)</button>
        </div>

        <!-- 3 Summary Cards -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 24px;">
            <div class="stat-card">
                <div class="stat-icon" style="background:#eef2ff; color:#4f46e5;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                </div>
                <div class="stat-info">
                    <span class="stat-label">นักศึกษาที่กำลังทำวิทยานิพนธ์</span>
                    <h3 class="stat-value">185</h3>
                    <span class="stat-trend trend-down">จากทั้งหมด 215 คน</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background:#ecfdf5; color:#10b981;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                </div>
                <div class="stat-info">
                    <span class="stat-label">ผ่านจริยธรรมการวิจัย (EC) แล้ว</span>
                    <h3 class="stat-value">86</h3>
                    <span class="stat-trend trend-up">คิดเป็น 46.4%</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background:#fef2f2; color:#ef4444;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <div class="stat-info">
                    <span class="stat-label">ไม่มีความก้าวหน้าเกิน 6 เดือน</span>
                    <h3 class="stat-value">12</h3>
                    <span class="stat-trend" style="color:var(--danger-color); cursor:pointer;" onclick="alert('แสดงรายชื่อ 12 คน')">ดูรายชื่อ ▶</span>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">สรุปจำนวนนักศึกษาแต่ละขั้นตอน (แยกตามรหัสรุ่น)</h3>
            </div>
            <div class="card-body">
                <div style="overflow-x:auto;">
                    <table class="data-table">
                        <thead style="background: var(--bg-color);">
                            <tr>
                                <th rowspan="2" style="text-align:center; vertical-align:middle;">รุ่น (รหัส)</th>
                                <th rowspan="2" style="text-align:center; vertical-align:middle;">นศ.ทั้งหมด</th>
                                <th colspan="8" style="text-align:center; border-bottom: 1px solid var(--border-color);">ขั้นตอนวิทยานิพนธ์ (Milestones)</th>
                                <th rowspan="2" style="text-align:center; vertical-align:middle;">จบการศึกษา</th>
                            </tr>
                            <tr>
                                <th style="text-align:center; font-size:0.8rem;" title="เลือกหัวข้อ">M1</th>
                                <th style="text-align:center; font-size:0.8rem;" title="สอบเค้าโครง">M2</th>
                                <th style="text-align:center; font-size:0.8rem;" title="แก้ไขเค้าโครง">M3</th>
                                <th style="text-align:center; font-size:0.8rem; background:#ecfdf5; color:#10b981;" title="จริยธรรมวิจัย (EC)">M4 (EC)</th>
                                <th style="text-align:center; font-size:0.8rem;" title="สอบวิทยานิพนธ์">M5</th>
                                <th style="text-align:center; font-size:0.8rem;" title="แก้ไขวิทยานิพนธ์">M6</th>
                                <th style="text-align:center; font-size:0.8rem;" title="ส่งรูปเล่มสมบูรณ์">M7</th>
                                <th style="text-align:center; font-size:0.8rem;" title="ตีพิมพ์ตีพิมพ์">M8</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${summaryData.map(d => `
                            <tr>
                                <td style="text-align:center;"><strong>${d.cohort}</strong></td>
                                <td style="text-align:center; font-weight:bold;">${d.total}</td>
                                <td style="text-align:center; color:${d.m1>0?'inherit':'#ccc'}">${d.m1}</td>
                                <td style="text-align:center; color:${d.m2>0?'inherit':'#ccc'}">${d.m2}</td>
                                <td style="text-align:center; color:${d.m3>0?'inherit':'#ccc'}">${d.m3}</td>
                                <td style="text-align:center; color:${d.m4>0?'#10b981':'#ccc'}; font-weight:bold;">${d.m4}</td>
                                <td style="text-align:center; color:${d.m5>0?'inherit':'#ccc'}">${d.m5}</td>
                                <td style="text-align:center; color:${d.m6>0?'inherit':'#ccc'}">${d.m6}</td>
                                <td style="text-align:center; color:${d.m7>0?'inherit':'#ccc'}">${d.m7}</td>
                                <td style="text-align:center; color:${d.m8>0?'inherit':'#ccc'}">${d.m8}</td>
                                <td style="text-align:center; color:${d.grad>0?'var(--primary-color)':'#ccc'}; font-weight:bold;">${d.grad}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                        <tfoot style="font-weight:bold; background:#f8fafc;">
                            <tr>
                                <td style="text-align:center;">รวม</td>
                                <td style="text-align:center;">215</td>
                                <td style="text-align:center;">62</td>
                                <td style="text-align:center;">30</td>
                                <td style="text-align:center;">27</td>
                                <td style="text-align:center; color:#10b981;">26</td>
                                <td style="text-align:center;">17</td>
                                <td style="text-align:center;">8</td>
                                <td style="text-align:center;">8</td>
                                <td style="text-align:center;">7</td>
                                <td style="text-align:center; color:var(--primary-color);">30</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

    </div>`;
};
