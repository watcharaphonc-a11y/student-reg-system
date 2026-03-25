// ============================
// Announcements Page
// ============================
pages.announcements = function() {
    const isAdmin = (window.currentUserRole === 'staff' || window.currentUserRole === 'admin');
    const typeColors = {
        'สำคัญ': 'danger', 'ผลการเรียน': 'info', 'การเงิน': 'warning',
        'ทุนการศึกษา': 'success', 'กิจกรรม': 'purple', 'ระบบ': 'neutral',
        'ทั่วไป': 'neutral'
    };

    // Clear notification badge when viewing announcements
    const latestAnn = MOCK.announcements && MOCK.announcements[0];
    if (latestAnn) {
        localStorage.setItem('lastSeenAnnouncementId', latestAnn.id);
        const badge = document.querySelector('.notif-badge');
        if (badge) badge.style.display = 'none';
    }

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <h1 class="page-title">ประกาศ</h1>
                <p class="page-subtitle">ข่าวสารและประกาศจากสถาบันพระบรมราชชนก</p>
            </div>
            ${window.hasPermission('post_announcement') ? `
            <button class="btn btn-primary" onclick="openCreateAnnouncementModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M12 5v14M5 12h14"/></svg>
                สร้างประกาศใหม่
            </button>
            ` : ''}
        </div>
        <div class="announcement-list">
            ${(MOCK.announcements || []).length === 0 ? `
                <div class="card" style="text-align:center; padding:50px;">
                    <p style="color:var(--text-muted);">ยังไม่มีประกาศในขณะนี้</p>
                </div>
            ` : MOCK.announcements.map((a, i) => `
                <div class="announcement-card animate-in animate-delay-${Math.min(i+1,4)}" onclick="viewAnnouncementDetail('${a.id}')">
                    <div class="announcement-icon" style="background:var(--${typeColors[a.type] || 'neutral'}-bg, var(--bg-tertiary))">${a.icon || '📢'}</div>
                    <div class="announcement-content">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                            <h4>${a.title}</h4>
                            <span class="badge ${typeColors[a.type] || 'neutral'}">${a.type}</span>
                        </div>
                        <p>${a.content.substring(0, 100)}${a.content.length > 100 ? '...' : ''}</p>
                        <div class="announcement-date">📅 ${a.date ? new Date(a.date).toLocaleDateString('th-TH') : '-'}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
};

window.viewAnnouncementDetail = function(id) {
    const a = MOCK.announcements.find(x => x.id === id);
    if (!a) return;
    
    const typeColors = {
        'สำคัญ': 'danger', 'ผลการเรียน': 'info', 'การเงิน': 'warning',
        'ทุนการศึกษา': 'success', 'กิจกรรม': 'purple', 'ระบบ': 'neutral',
        'ทั่วไป': 'neutral'
    };

    openModal(a.title, `
        <div>
            <span class="badge ${typeColors[a.type] || 'neutral'}" style="margin-bottom:15px;">${a.type}</span>
            <div style="line-height:1.8; color:var(--text-secondary); white-space: pre-wrap; font-size:1.05rem;">${a.content}</div>
            <div style="margin-top:25px; padding-top:15px; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.85rem; color:var(--text-muted);">📅 วันที่ประกาศ: ${new Date(a.date).toLocaleDateString('th-TH')} ${new Date(a.date).toLocaleTimeString('th-TH')} น.</span>
                <span style="font-size:0.85rem; color:var(--text-muted);">👤 โดย: ${a.author || 'Admin'}</span>
            </div>
            <div style="margin-top:20px; display:flex; justify-content:flex-end;">
                <button class="btn btn-secondary" onclick="closeModal()">ปิดหน้าต่าง</button>
            </div>
        </div>
    `, '700px');
};

window.openCreateAnnouncementModal = function() {
    openModal('สร้างประกาศใหม่', `
        <div style="padding:10px;">
            <div class="form-group">
                <label class="form-label">ประเภทประกาศ</label>
                <select id="annType" class="form-input">
                    <option value="ทั่วไป">ทั่วไป</option>
                    <option value="สำคัญ">สำคัญ (แดง)</option>
                    <option value="ผลการเรียน">ผลการเรียน (ฟ้า)</option>
                    <option value="การเงิน">การเงิน (เหลือง)</option>
                    <option value="ทุนการศึกษา">ทุนการศึกษา (เขียว)</option>
                    <option value="กิจกรรม">กิจกรรม (ม่วง)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">ไอคอน (Emoji)</label>
                <input type="text" id="annIcon" class="form-input" value="📢" placeholder="เช่น 📢, 🚨, 📅">
            </div>
            <div class="form-group">
                <label class="form-label">หัวข้อประกาศ</label>
                <input type="text" id="annTitle" class="form-input" placeholder="ใส่หัวข้อสั้นๆ...">
            </div>
            <div class="form-group">
                <label class="form-label">เนื้อหาประกาศ</label>
                <textarea id="annContent" class="form-input" style="height:200px;" placeholder="ใส่รายละเอียดข่าวสาร..."></textarea>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
                <button class="btn btn-secondary" onclick="closeModal()">ยกเลิก</button>
                <button class="btn btn-primary" onclick="submitAnnouncement()">📣 ยืนยันการประกาศ</button>
            </div>
        </div>
    `, '600px');
};

window.submitAnnouncement = async function() {
    const type = document.getElementById('annType').value;
    const title = document.getElementById('annTitle').value;
    const content = document.getElementById('annContent').value;
    const icon = document.getElementById('annIcon').value;
    
    if (!title || !content) {
        alert('กรุณากรอกหัวข้อและเนื้อหาประกาศ');
        return;
    }
    
    showApiLoading('กำลังส่งประกาศและแจ้งเตือน...');
    try {
        const payload = {
            type, title, content, icon,
            author: window.currentUserData?.name || 'Admin'
        };
        
        const res = await postData('postAnnouncement', payload);
        if (res.status === 'success') {
            alert('📢 ประกาศข่าวสารเรียบร้อยแล้ว!');
            closeModal();
            // Refresh app to get new data
            location.reload();
        } else {
            throw new Error(res.message);
        }
    } catch (e) {
        alert('เกิดข้อผิดพลาด: ' + e.message);
    } finally {
        hideApiLoading();
    }
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
