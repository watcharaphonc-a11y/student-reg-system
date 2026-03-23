// ============================
// Payments Page
// ============================
pages.payments = function() {
    const pending = MOCK.payments.filter(p => p.status === 'ค้างชำระ');
    const paid = MOCK.payments.filter(p => p.status === 'ชำระแล้ว');
    const totalPending = pending.reduce((s,p) => s + p.amount, 0);

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ค่าธรรมเนียม / การชำระเงิน</h1>
            <p class="page-subtitle">จัดการค่าธรรมเนียมและตรวจสอบสถานะการชำระเงิน</p>
        </div>
        <div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
            <div class="stat-card animate-in animate-delay-1">
                <div class="stat-icon orange"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                <div class="stat-value" style="color:var(--danger)">฿${formatMoney(totalPending)}</div>
                <div class="stat-label">ยอಡค้างชำระ</div>
            </div>
            <div class="stat-card animate-in animate-delay-2">
                <div class="stat-icon green"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <div class="stat-value" style="color:var(--success)">฿${formatMoney(paid.reduce((s,p)=>s+p.amount,0))}</div>
                <div class="stat-label">ชำระแล้วทั้งหมด</div>
            </div>
        </div>
        ${pending.length > 0 ? `
        <div class="card animate-in animate-delay-2" style="margin-bottom:18px;border-color:rgba(239,68,68,0.3)">
            <div class="card-header" style="background:var(--danger-bg)">
                <h3 class="card-title" style="color:var(--danger)">⚠ รายการค้างชำระ</h3>
                <button class="btn btn-primary btn-sm" onclick="openModal('ชำระเงิน','<div style=\\'text-align:center;padding:16px\\'><p style=\\'margin-bottom:16px\\'>ยอดชำระ: <strong>฿${formatMoney(totalPending)}</strong></p><div class=\\'form-group\\'><label class=\\'form-label\\'>เลือกช่องทางชำระ</label><select class=\\'form-select\\'><option>โอนผ่านธนาคาร</option><option>พร้อมเพย์</option><option>บัตรเครดิต</option><option>เคาน์เตอร์เซอร์วิส</option></select></div><button class=\\'btn btn-primary\\' onclick=\\'closeModal()\\'>ดำเนินการชำระ</button></div>')">ชำระเงิน</button>
            </div>
            <div class="card-body" style="padding:0">
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead><tr><th>เลขที่</th><th>รายการ</th><th>ประเภท</th><th>จำนวน (บาท)</th><th>กำหนดชำระ</th><th>สถานะ</th></tr></thead>
                        <tbody>
                            ${pending.map(p => `<tr><td style="font-weight:600">${p.id}</td><td>${p.description}</td><td><span class="badge neutral">${p.type}</span></td><td style="font-weight:600">฿${formatMoney(p.amount)}</td><td>${p.dueDate}</td><td>${getStatusBadge(p.status)}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>` : ''}
        <div class="card animate-in animate-delay-3">
            <div class="card-header"><h3 class="card-title">ประวัติการชำระเงิน</h3></div>
            <div class="card-body" style="padding:0">
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead><tr><th>เลขที่</th><th>รายการ</th><th>ประเภท</th><th>จำนวน (บาท)</th><th>วันที่ชำระ</th><th>สถานะ</th></tr></thead>
                        <tbody>
                            ${paid.map(p => `<tr><td style="font-weight:600">${p.id}</td><td>${p.description}</td><td><span class="badge neutral">${p.type}</span></td><td>฿${formatMoney(p.amount)}</td><td>${p.paidDate}</td><td>${getStatusBadge(p.status)}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};
