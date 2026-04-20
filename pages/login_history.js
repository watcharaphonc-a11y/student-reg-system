pages['login-history'] = function() {
    const logs = [
        { time: new Date(Date.now() - 1000 * 60 * 5), user: 'admin_nurse', role: 'Super Admin', ip: '110.164.x.x', status: 'สำเร็จ' },
        { time: new Date(Date.now() - 1000 * 60 * 45), user: '670001', role: 'Student', ip: '124.120.x.x', status: 'สำเร็จ' },
        { time: new Date(Date.now() - 1000 * 60 * 120), user: 'teacher01', role: 'Teacher', ip: '27.55.x.x', status: 'ล้มเหลว (รหัสผ่านผิด)' },
        { time: new Date(Date.now() - 1000 * 60 * 60 * 5), user: '660045', role: 'Student', ip: '49.228.x.x', status: 'สำเร็จ' },
        { time: new Date(Date.now() - 1000 * 60 * 60 * 12), user: 'ajarn_somchai', role: 'Teacher', ip: '184.22.x.x', status: 'สำเร็จ' }
    ];

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
                <h1 class="page-title">ประวัติการเข้าสู่ระบบ (Login History)</h1>
                <p class="page-subtitle">บันทึกประวัติการเข้าใช้งานระบบเพื่อการตรวจสอบความปลอดภัย</p>
            </div>
            <button class="btn btn-outline" onclick="alert('ดาวน์โหลด Audit Log เรียบร้อย')">Download Audit Log</button>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">รายการเข้าสู่ระบบล่าสุด</h3>
            </div>
            <div class="card-body">
                <div style="overflow-x:auto;">
                    <table class="data-table">
                        <thead style="background:#f8fafc;">
                            <tr>
                                <th>วันเวลาที่เข้าสู่ระบบ</th>
                                <th>บัญชีผู้ใช้งาน (Username)</th>
                                <th>ระดับสิทธิ์ (Role)</th>
                                <th>IP Address</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logs.map(log => `
                            <tr>
                                <td>${log.time.toLocaleString('th-TH')}</td>
                                <td><strong>${log.user}</strong></td>
                                <td><span class="badge ${log.role==='Super Admin'?'danger':'info'}">${log.role}</span></td>
                                <td style="font-family:monospace; color:var(--text-secondary);">${log.ip}</td>
                                <td>
                                    <span style="color: ${log.status.includes('ล้มเหลว') ? '#ef4444' : '#10b981'}; font-weight:500;">
                                        ${log.status.includes('ล้มเหลว') ? '❌ ' : '✅ '}${log.status}
                                    </span>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div style="margin-top:20px; text-align:center;">
                    <button class="btn btn-secondary" onclick="alert('กำลังโหลดข้อมูลเพิ่มเติม...')">โหลดเพิ่มเติม...</button>
                </div>
            </div>
        </div>
    </div>`;
};
