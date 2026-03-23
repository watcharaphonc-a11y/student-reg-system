// ============================
// Announcements Page
// ============================
pages.announcements = function() {
    const typeColors = {
        'สำคัญ': 'danger', 'ผลการเรียน': 'info', 'การเงิน': 'warning',
        'ทุนการศึกษา': 'success', 'กิจกรรม': 'purple', 'ระบบ': 'neutral'
    };
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ประกาศ</h1>
            <p class="page-subtitle">ข่าวสารและประกาศจากมหาวิทยาลัย</p>
        </div>
        <div class="announcement-list">
            ${MOCK.announcements.map((a, i) => `
                <div class="announcement-card animate-in animate-delay-${Math.min(i+1,4)}" onclick="openModal('${a.title}','<div><span class=\\'badge ${typeColors[a.type] || 'neutral'}\\'>${a.type}</span><p style=\\'margin-top:14px;line-height:1.8;color:var(--text-secondary)\\'>${a.content}</p><p style=\\'margin-top:12px;font-size:0.78rem;color:var(--text-muted)\\'>วันที่ประกาศ: ${a.date}</p></div>')">
                    <div class="announcement-icon" style="background:var(--${typeColors[a.type] || 'neutral'}-bg, var(--bg-tertiary))">${a.icon}</div>
                    <div class="announcement-content">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                            <h4>${a.title}</h4>
                            <span class="badge ${typeColors[a.type] || 'neutral'}">${a.type}</span>
                        </div>
                        <p>${a.content.substring(0, 100)}...</p>
                        <div class="announcement-date">📅 ${a.date}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
};

// ============================
// Settings Page
// ============================
pages.settings = function() {
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ตั้งค่า</h1>
            <p class="page-subtitle">จัดการการตั้งค่าบัญชีและระบบ</p>
        </div>
        <div class="grid-2">
            <div>
                <div class="card animate-in animate-delay-1" style="margin-bottom:18px">
                    <div class="card-body">
                        <div class="settings-section">
                            <h3 class="settings-title">ข้อมูลบัญชี</h3>
                            <div class="form-group"><label class="form-label">อีเมล</label><input class="form-input" value="${MOCK.student.email}" /></div>
                            <div class="form-group"><label class="form-label">เบอร์โทรศัพท์</label><input class="form-input" value="${MOCK.student.phone}" /></div>
                            <button class="btn btn-primary">บันทึกการเปลี่ยนแปลง</button>
                        </div>
                    </div>
                </div>
                <div class="card animate-in animate-delay-2">
                    <div class="card-body">
                        <div class="settings-section">
                            <h3 class="settings-title">เปลี่ยนรหัสผ่าน</h3>
                            <div class="form-group"><label class="form-label">รหัสผ่านปัจจุบัน</label><input class="form-input" type="password" placeholder="••••••••" /></div>
                            <div class="form-group"><label class="form-label">รหัสผ่านใหม่</label><input class="form-input" type="password" placeholder="••••••••" /></div>
                            <div class="form-group"><label class="form-label">ยืนยันรหัสผ่านใหม่</label><input class="form-input" type="password" placeholder="••••••••" /></div>
                            <button class="btn btn-primary">เปลี่ยนรหัสผ่าน</button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="card animate-in animate-delay-2" style="margin-bottom:18px">
                    <div class="card-body">
                        <div class="settings-section">
                            <h3 class="settings-title">การแจ้งเตือน</h3>
                            <div class="setting-row">
                                <div class="setting-info"><h4>แจ้งเตือนอีเมล</h4><p>รับข่าวสารผ่านอีเมล</p></div>
                                <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
                            </div>
                            <div class="setting-row">
                                <div class="setting-info"><h4>แจ้งเตือนผลการเรียน</h4><p>แจ้งเตือนเมื่อประกาศเกรด</p></div>
                                <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
                            </div>
                            <div class="setting-row">
                                <div class="setting-info"><h4>แจ้งเตือนค่าธรรมเนียม</h4><p>แจ้งเตือนกำหนดชำระเงิน</p></div>
                                <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
                            </div>
                            <div class="setting-row">
                                <div class="setting-info"><h4>แจ้งเตือนประกาศ</h4><p>แจ้งเตือนข่าวสารใหม่</p></div>
                                <label class="toggle"><input type="checkbox" /><span class="toggle-slider"></span></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card animate-in animate-delay-3">
                    <div class="card-body">
                        <div class="settings-section">
                            <h3 class="settings-title">ธีมและการแสดงผล</h3>
                            <div class="setting-row">
                                <div class="setting-info"><h4>โหมดกลางคืน</h4><p>ใช้ธีมสีเข้ม</p></div>
                                <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
                            </div>
                            <div class="setting-row">
                                <div class="setting-info"><h4>แสดง Animation</h4><p>เปิด/ปิดภาพเคลื่อนไหว</p></div>
                                <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};
