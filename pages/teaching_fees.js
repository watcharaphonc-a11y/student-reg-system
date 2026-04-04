// ============================
// Teaching Remuneration (ค่าตอบแทนการสอน) Page
// ============================
pages['teaching-fees'] = function() {
    const sch = MOCK.schedule;
    const items = sch.items || [];
    const rates = MOCK.teachingRateDefaults || [];

    // Calculation Logic
    const teacherStats = {};

    items.forEach(item => {
        if (!item.instructorName) return;
        
        if (!teacherStats[item.instructorName]) {
            teacherStats[item.instructorName] = {
                name: item.instructorName,
                id: item.instructorId,
                totalHours: 0,
                totalAmount: 0,
                type: 'Internal',
                sessions: []
            };

            // Determine Position/Type for display
            const lowerName = item.instructorName.toLowerCase();
            if (lowerName.includes('ดร.') || lowerName.includes('ph.d')) {
                teacherStats[item.instructorName].type = 'อาจารย์ (ดร.)';
                teacherStats[item.instructorName].rateType = 'internal_phd';
            } else if (item.instructorId && (item.instructorId.includes('special') || item.instructorId.startsWith('EXT'))) {
                teacherStats[item.instructorName].type = 'อาจารย์พิเศษ';
                teacherStats[item.instructorName].rateType = 'external_specialist';
            } else {
                teacherStats[item.instructorName].type = 'อาจารย์ (ป.โท)';
                teacherStats[item.instructorName].rateType = 'internal_master';
            }
        }

        const duration = (item.endSlot - item.startSlot + 1);
        teacherStats[item.instructorName].totalHours += duration;
        
        const rateObj = rates.find(r => r.type === teacherStats[item.instructorName].rateType) || { rate: 450 };
        const amount = duration * rateObj.rate;
        teacherStats[item.instructorName].totalAmount += amount;
        
        teacherStats[item.instructorName].sessions.push({
            code: item.code,
            name: item.name,
            day: sch.days[item.day],
            time: `${sch.timeSlots[item.startSlot].split('-')[0]} - ${sch.timeSlots[item.endSlot].split('-')[1]}`,
            hours: duration,
            rate: rateObj.rate,
            amount: amount
        });
    });

    const summaryList = Object.values(teacherStats);
    const totalGrandAmount = summaryList.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalGrandHours = summaryList.reduce((sum, t) => sum + t.totalHours, 0);

    return `
    <div class="animate-in">
        <div class="page-header" style="margin-bottom:30px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <h1 class="page-title" style="font-size:2rem; margin-bottom:5px;">ค่าตอบแทนการสอน</h1>
                    <p class="page-subtitle" style="display:flex; align-items:center; gap:8px;">
                        <span class="badge badge-primary" style="background:var(--accent-primary-light); color:var(--accent-primary); border:none;">
                            ${MOCK.activeSemester || 'ภาคฤดูร้อน/2568'}
                        </span>
                        คำนวณอัตโนมัติจากชั่วโมงสอนจริงในตารางเรียน
                    </p>
                </div>
                <div style="display:flex; gap:12px;">
                    <button class="btn btn-secondary" onclick="window.print()" style="background:white; border:1px solid var(--border-color);">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        ส่งออกเป็น PDF
                    </button>
                    <button class="btn btn-primary" onclick="alert('ส่งข้อมูลเบิกจ่ายเรียบร้อย')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        ยืนยันยอดเบิกจ่าย
                    </button>
                </div>
            </div>
        </div>

        <!-- Premium Summary Section -->
        <div class="grid-4" style="margin-bottom:30px; gap:20px;">
            <div class="card stat-card-glass" style="background:linear-gradient(45deg, #4f46e5, #3b82f6); color:white; border:none; position:relative; overflow:hidden;">
                <div style="position:absolute; right:-10px; top:-10px; opacity:0.1; transform:scale(2);">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div class="card-body">
                    <div style="font-size:0.85rem; opacity:0.9; margin-bottom:8px;">งบประมาณค่าตอบแทนรวม</div>
                    <div style="font-size:1.8rem; font-weight:800;">฿${totalGrandAmount.toLocaleString()}</div>
                    <div style="margin-top:10px; font-size:0.75rem; background:rgba(255,255,255,0.2); display:inline-block; padding:2px 8px; border-radius:12px;">เฉลี่ย ฿${(totalGrandAmount / (summaryList.length || 1)).toLocaleString(undefined, {maximumFractionDigits:0})} / ท่าน</div>
                </div>
            </div>
            <div class="card" style="background:white; border:1px solid var(--border-color); border-bottom:4px solid #10b981;">
                <div class="card-body">
                    <div style="color:var(--text-muted); font-size:0.85rem; margin-bottom:8px;">ชั่วโมงสอนสะสม</div>
                    <div style="font-size:1.8rem; font-weight:800; color:#059669;">${totalGrandHours} <span style="font-size:1rem; font-weight:400;">ชม.</span></div>
                    <div style="margin-top:5px; color:#10b981; font-size:0.75rem;">↑ ภาระงานปกติ</div>
                </div>
            </div>
            <div class="card" style="background:white; border:1px solid var(--border-color); border-bottom:4px solid #f59e0b;">
                <div class="card-body">
                    <div style="color:var(--text-muted); font-size:0.85rem; margin-bottom:8px;">บุคลากรที่ดำเนินการ</div>
                    <div style="font-size:1.8rem; font-weight:800; color:#d97706;">${summaryList.length} <span style="font-size:1rem; font-weight:400;">ท่าน</span></div>
                    <div style="margin-top:5px; color:#f59e0b; font-size:0.75rem;">ครอบคลุมทั้ง 3 หลักสูตร</div>
                </div>
            </div>
            <div class="card" style="background:white; border:1px solid var(--border-color); border-bottom:4px solid #6366f1;">
                <div class="card-body">
                    <div style="color:var(--text-muted); font-size:0.85rem; margin-bottom:8px;">อัตราเฉลี่ยต่อชั่วโมง</div>
                    <div style="font-size:1.8rem; font-weight:800; color:#4f46e5;">฿${(totalGrandAmount / (totalGrandHours || 1)).toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                    <div style="margin-top:5px; color:#6366f1; font-size:0.75rem;">ตามระเบียบปี 2567</div>
                </div>
            </div>
        </div>

        <div class="card animate-in animate-delay-1" style="border-radius:16px; box-shadow:var(--shadow-sm);">
            <div class="card-header" style="padding:20px 24px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3 class="card-title" style="font-size:1.1rem;">รายการเบิกจ่ายค่าตอบแทน</h3>
                </div>
                <div style="position:relative; width:300px;">
                    <input type="text" id="teacherFeeSearch" placeholder="ค้นหาชื่ออาจารย์..." 
                           style="width:100%; padding:10px 15px 10px 35px; border-radius:10px; border:1px solid var(--border-color); font-size:0.9rem;"
                           onkeyup="filterTeacherFees()">
                    <svg style="position:absolute; left:12px; top:11px; color:var(--text-muted);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
            </div>
            <div class="card-body" style="padding:0;">
                <div class="table-wrapper">
                    <table class="data-table" id="teacherFeeTable" style="margin:0;">
                        <thead style="background:#f8fafc;">
                            <tr>
                                <th style="padding:15px 24px; color:#475569; font-weight:600;">รายชื่ออาจารย์</th>
                                <th style="padding:15px 10px; color:#475569; font-weight:600; text-align:center;">ประเภท/วุฒิ</th>
                                <th style="padding:15px 10px; color:#475569; font-weight:600; text-align:center;">ชั่วโมงรวม</th>
                                <th style="padding:15px 24px; color:#475569; font-weight:600; text-align:right;">ยอดรวมสุทธิ</th>
                                <th style="padding:15px 24px; color:#475569; font-weight:600; text-align:center;">สถานะ</th>
                                <th style="padding:15px 24px; color:#475569; font-weight:600; text-align:center;">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${summaryList.length > 0 ? summaryList.map((t, idx) => `
                                <tr data-name="${t.name.toLowerCase()}">
                                    <td style="padding:15px 24px;">
                                        <div style="display:flex; align-items:center; gap:12px;">
                                            <div style="width:36px; height:36px; border-radius:50%; background:var(--accent-primary-light); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; font-weight:700;">
                                                ${t.name.substring(0, 1)}
                                            </div>
                                            <div style="font-weight:600; color:var(--text-primary);">${t.name}</div>
                                        </div>
                                    </td>
                                    <td style="padding:15px 10px; text-align:center;">
                                        <span class="badge" style="background:#f1f5f9; color:#475569; border:none; font-weight:500;">${t.type}</span>
                                    </td>
                                    <td style="padding:15px 10px; text-align:center;">
                                        <span style="font-weight:700; color:#1e293b;">${t.totalHours}</span> <span style="font-size:0.8rem; color:var(--text-muted);">ชม.</span>
                                    </td>
                                    <td style="padding:15px 24px; text-align:right;">
                                        <span style="font-weight:700; color:var(--accent-primary); font-size:1.1rem;">฿${t.totalAmount.toLocaleString()}</span>
                                    </td>
                                    <td style="padding:15px 24px; text-align:center;">
                                        <span class="badge" style="background:rgba(16,185,129,0.1); color:#10b981; border:none;">
                                            <span style="width:6px; height:6px; background:#10b981; border-radius:50%; display:inline-block; margin-right:6px;"></span>
                                            ข้อมูลถูกต้อง
                                        </span>
                                    </td>
                                    <td style="padding:15px 24px; text-align:center;">
                                        <button class="btn btn-secondary" style="padding:6px 16px; font-size:0.85rem; border-radius:8px;" onclick="showFeeDetails('${t.name}')">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            รายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="6" style="text-align:center; padding:50px; color:var(--text-muted);">ไม่พบข้อมูลภาระงานสอน</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

// Filter Function
window.filterTeacherFees = function() {
    const query = document.getElementById('teacherFeeSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#teacherFeeTable tbody tr');
    
    rows.forEach(row => {
        const name = row.dataset.name || '';
        if (name.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
};

window.showFeeDetails = function(teacherName) {
    const sch = MOCK.schedule;
    const items = sch.items || [];
    const rates = MOCK.teachingRateDefaults || [];
    
    // Recalculate sessions with the same logic
    const sessions = [];
    let rateType = 'internal_master';
    const lowerName = teacherName.toLowerCase();
    if (lowerName.includes('ดร.') || lowerName.includes('ph.d')) {
        rateType = 'internal_phd';
    } else if (items.find(i => i.instructorName === teacherName && i.instructorId && (i.instructorId.includes('special') || i.instructorId.startsWith('EXT')))) {
        rateType = 'external_specialist';
    }
    const rateObj = rates.find(r => r.type === rateType) || { rate: 450 };

    items.forEach(item => {
        if (item.instructorName === teacherName) {
            const duration = (item.endSlot - item.startSlot + 1);
            sessions.push({
                code: item.code,
                name: item.name,
                day: sch.days[item.day],
                time: `${sch.timeSlots[item.startSlot].split('-')[0]} - ${sch.timeSlots[item.endSlot].split('-')[1]}`,
                hours: duration,
                rate: rateObj.rate,
                amount: duration * rateObj.rate
            });
        }
    });

    const bodyHtml = `
        <div class="animate-in" style="padding:5px;">
            <div style="display:flex; align-items:center; gap:20px; margin-bottom:25px; padding:20px; background:#f8fafc; border-radius:16px; border:1px solid #e2e8f0;">
                <div style="width:60px; height:60px; border-radius:50%; background:var(--accent-primary); color:white; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:800; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
                    ${teacherName.substring(0, 1)}
                </div>
                <div>
                    <div style="font-size:1.3rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">${teacherName}</div>
                    <div style="display:flex; gap:10px;">
                        <span class="badge" style="background:var(--accent-primary-light); color:var(--accent-primary); border:none;">อัตรา ฿${rateObj.rate}/ชม.</span>
                        <span class="badge" style="background:#f1f5f9; color:#475569; border:none;">${sessions.length} รายการสอน</span>
                    </div>
                </div>
            </div>
            
            <div class="table-wrapper" style="border-radius:12px; border:1px solid var(--border-color);">
                <table class="data-table" style="font-size:0.9rem; margin:0;">
                    <thead style="background:#f8fafc;">
                        <tr>
                            <th style="padding:12px 15px;">รายวิชา</th>
                            <th style="padding:12px 15px; text-align:center;">วัน/เวลา</th>
                            <th style="padding:12px 15px; text-align:center;">ชั่วโมง</th>
                            <th style="padding:12px 15px; text-align:right;">รวมเงิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sessions.map(s => `
                            <tr>
                                <td style="padding:12px 15px;">
                                    <div style="font-weight:700; color:var(--text-primary);">${window.formatDisplayCode(s.code)}</div>
                                    <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.2;">${s.name}</div>
                                </td>
                                <td style="padding:12px 15px; text-align:center;">
                                    <div style="font-weight:600;">${s.day}</div>
                                    <div style="font-size:0.75rem; color:var(--text-muted);">${s.time}</div>
                                </td>
                                <td style="padding:12px 15px; text-align:center;">
                                    <span style="font-weight:600;">${s.hours}</span> ชม.
                                </td>
                                <td style="padding:12px 15px; text-align:right; font-weight:800; color:var(--accent-primary); font-size:1rem;">
                                    ฿${s.amount.toLocaleString()}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot style="background:#f8fafc; border-top:2px solid var(--border-color);">
                        <tr>
                            <td colspan="2" style="text-align:right; padding:15px; font-weight:700;">รวมยอดเบิกจ่ายสุทธิ</td>
                            <td style="text-align:center; padding:15px; font-weight:700;">${sessions.reduce((sum, s) => sum + s.hours, 0)} ชม.</td>
                            <td style="text-align:right; padding:15px; font-weight:800; color:var(--accent-primary); font-size:1.2rem; background:rgba(220,53,69,0.05);">฿${sessions.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
                <button class="btn btn-secondary" onclick="closeModal()">ปิดหน้าต่าง</button>
                <button class="btn btn-primary" onclick="window.print()">พิมพ์ใบเบิกเงิน</button>
            </div>
        </div>
    `;

    openModal('รายละเอียดค่าตอบแทนการสอนรายบุคคล', bodyHtml);
};
