// ============================
// Teacher Remuneration (Teaching Fees) Page
// ============================
pages['teaching-fees'] = function() {
    const sch = MOCK.schedule;
    const items = sch.items || [];
    const teachers = MOCK.academicAdvisors || [];
    const rates = MOCK.teachingRateDefaults || [];

    // Calculation Logic
    const teacherStats = {};

    items.forEach(item => {
        if (!item.instructorName) return;
        
        if (!teacherStats[item.instructorName]) {
            teacherStats[item.instructorName] = {
                name: item.instructorName,
                totalHours: 0,
                totalAmount: 0,
                sessions: []
            };
        }

        const duration = (item.endSlot - item.startSlot + 1); // slots are 1 hour each based on MOCK.schedule.timeSlots
        teacherStats[item.instructorName].totalHours += duration;
        
        // Determine Rate
        let rateObj = rates.find(r => r.type === 'internal_master'); // Default
        const lowerName = item.instructorName.toLowerCase();
        if (lowerName.includes('ดร.') || lowerName.includes('ph.d')) {
            rateObj = rates.find(r => r.type === 'internal_phd');
        } else if (item.instructorId && item.instructorId.includes('special')) {
            rateObj = rates.find(r => r.type === 'external_specialist');
        }

        const amount = duration * (rateObj ? rateObj.rate : 450);
        teacherStats[item.instructorName].totalAmount += amount;
        
        teacherStats[item.instructorName].sessions.push({
            code: item.code,
            name: item.name,
            day: sch.days[item.day],
            time: `${sch.timeSlots[item.startSlot].split('-')[0]} - ${sch.timeSlots[item.endSlot].split('-')[1]}`,
            hours: duration,
            rate: rateObj ? rateObj.rate : 450,
            amount: amount
        });
    });

    const summaryList = Object.values(teacherStats);
    const totalGrandAmount = summaryList.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalGrandHours = summaryList.reduce((sum, t) => sum + t.totalHours, 0);

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:25px;">
            <div>
                <h1 class="page-title">รายงานค่าสอนอาจารย์</h1>
                <p class="page-subtitle">คำนวณค่าตอบแทนตามชั่วโมงสอนจริงในตารางเรียน</p>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" onclick="window.print()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    พิมพ์รายงาน
                </button>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid-3" style="margin-bottom:25px;">
            <div class="card" style="background:var(--accent-gradient-blue); color:white; border:none;">
                <div class="card-body">
                    <div style="opacity:0.8; font-size:0.9rem; margin-bottom:5px;">งบประมาณค่าสอนรวม</div>
                    <div style="font-size:1.8rem; font-weight:800;">฿${totalGrandAmount.toLocaleString()}</div>
                </div>
            </div>
            <div class="card" style="background:linear-gradient(135deg, #10b981, #059669); color:white; border:none;">
                <div class="card-body">
                    <div style="opacity:0.8; font-size:0.9rem; margin-bottom:5px;">จำนวนชั่วโมงสอนทั้งหมด</div>
                    <div style="font-size:1.8rem; font-weight:800;">${totalGrandHours} ชม.</div>
                </div>
            </div>
            <div class="card" style="background:linear-gradient(135deg, #f59e0b, #d97706); color:white; border:none;">
                <div class="card-body">
                    <div style="opacity:0.8; font-size:0.9rem; margin-bottom:5px;">จำนวนอาจารย์ผู้สอน</div>
                    <div style="font-size:1.8rem; font-weight:800;">${summaryList.length} ท่าน</div>
                </div>
            </div>
        </div>

        <div class="card animate-in animate-delay-1">
            <div class="card-header"><h3 class="card-title">สรุปค่าตอบแทนรายบุคคล</h3></div>
            <div class="card-body" style="padding:0;">
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ชื่อ-นามสกุล</th>
                                <th style="text-align:center;">ชั่วโมงรวม</th>
                                <th style="text-align:right;">ยอดเงินสุทธิ</th>
                                <th style="text-align:center;">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${summaryList.length > 0 ? summaryList.map((t, idx) => `
                                <tr>
                                    <td style="font-weight:600; color:var(--text-primary);">${t.name}</td>
                                    <td style="text-align:center;">${t.totalHours} ชม.</td>
                                    <td style="text-align:right; font-weight:700; color:var(--accent-primary);">฿${t.totalAmount.toLocaleString()}</td>
                                    <td style="text-align:center;">
                                        <button class="btn btn-secondary" style="padding:4px 12px; font-size:0.8rem;" onclick="showFeeDetails('${t.name}')">ดูรายละเอียด</button>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">ไม่พบข้อมูลภาระงานสอนในภาคเรียนนี้</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

window.showFeeDetails = function(teacherName) {
    const sch = MOCK.schedule;
    const items = sch.items || [];
    const rates = MOCK.teachingRateDefaults || [];
    
    // Recalculate sessions for this specific teacher
    const sessions = [];
    items.forEach(item => {
        if (item.instructorName === teacherName) {
            const duration = (item.endSlot - item.startSlot + 1);
            let rateObj = rates.find(r => r.type === 'internal_master');
            const lowerName = item.instructorName.toLowerCase();
            if (lowerName.includes('ดร.') || lowerName.includes('ph.d')) {
                rateObj = rates.find(r => r.type === 'internal_phd');
            } else if (item.instructorId && item.instructorId.includes('special')) {
                rateObj = rates.find(r => r.type === 'external_specialist');
            }

            sessions.push({
                code: item.code,
                name: item.name,
                day: sch.days[item.day],
                time: `${sch.timeSlots[item.startSlot].split('-')[0]} - ${sch.timeSlots[item.endSlot].split('-')[1]}`,
                hours: duration,
                rate: rateObj ? rateObj.rate : 450,
                amount: duration * (rateObj ? rateObj.rate : 450)
            });
        }
    });

    const bodyHtml = `
        <div style="padding:10px;">
            <div style="margin-bottom:20px; padding:15px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <div style="font-size:0.9rem; color:#64748b; margin-bottom:5px;">อาจารย์ผู้สอน</div>
                <div style="font-size:1.2rem; font-weight:800; color:var(--text-primary);">${teacherName}</div>
            </div>
            
            <div class="table-wrapper">
                <table class="data-table" style="font-size:0.9rem;">
                    <thead>
                        <tr>
                            <th>รหัสวิชา</th>
                            <th>วัน/เวลา</th>
                            <th style="text-align:center;">ชั่วโมง</th>
                            <th style="text-align:right;">อัตรา/ชม.</th>
                            <th style="text-align:right;">รวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sessions.map(s => `
                            <tr>
                                <td><div style="font-weight:600;">${window.formatDisplayCode(s.code)}</div><div style="font-size:0.75rem; color:var(--text-muted);">${s.name}</div></td>
                                <td>${s.day}<br><span style="font-size:0.8rem; color:var(--text-muted);">${s.time}</span></td>
                                <td style="text-align:center;">${s.hours}</td>
                                <td style="text-align:right;">฿${s.rate.toLocaleString()}</td>
                                <td style="text-align:right; font-weight:700;">฿${s.amount.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background:#f1f5f9; font-weight:800;">
                            <td colspan="2" style="text-align:right;">รวมทั้งสิ้น</td>
                            <td style="text-align:center;">${sessions.reduce((sum, s) => sum + s.hours, 0)} ชม.</td>
                            <td></td>
                            <td style="text-align:right; color:var(--accent-primary);">฿${sessions.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;

    openModal('รายละเอียดภาระงานและค่าสอน', bodyHtml);
};
