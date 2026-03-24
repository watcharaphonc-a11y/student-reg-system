// ============================
// User Management Page (Super Admin Only)
// ============================

pages['user-management'] = function() {
    // Use real data from Google Sheets
    const finalUsers = (MOCK.users || []).map((u, i) => ({
        id: i + 1,
        username: u.Username || u.username,
        role: u.Role || u.role,
        name: u.Name || u.name,
        email: u.Email || u.email || '-',
        status: u.Status || u.status || 'ใช้งาน'
    }));

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">จัดการผู้ใช้งาน</h1>
            <p class="page-subtitle">จัดการบัญชีผู้ใช้งาน สิทธิ์การเข้าถึง และสถานะการใช้งานระบบ</p>
        </div>

        <div class="card">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">รายชื่อผู้ใช้งานในระบบ</h3>
                <button class="btn btn-primary" onclick="alert('ฟีเจอร์เพิ่มผู้ใช้งานกำลังพัฒนา')">+ เพิ่มผู้ใช้งาน</button>
            </div>
            <div class="card-body">
                <div style="margin-bottom: 20px;">
                    <input type="text" class="form-input" placeholder="ค้นหาผู้ใช้งาน (ชื่อ, อีเมล, บทบาท)..." style="max-width:300px;" onkeyup="filterUsers(this.value)" />
                </div>
                <div style="overflow-x:auto;">
                    <table class="data-table" id="userTable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>อีเมล</th>
                                <th>บทบาท</th>
                                <th>สถานะ</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${finalUsers.map((u, i) => `
                            <tr>
                                <td>${u.id}</td>
                                <td><strong>${u.username}</strong></td>
                                <td>${u.name}</td>
                                <td>${u.email}</td>
                                <td><span class="badge ${u.role==='Super Admin' || u.role==='admin' ?'danger':'info'}">${u.role}</span></td>
                                <td><span class="badge success">${u.status}</span></td>
                                <td>
                                    <div style="display:flex; gap:6px;">
                                        <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="alert('แก้ไขผู้ใช้งาน ${u.username}')">แก้ไข</button>
                                        <button class="btn btn-outline-danger" style="padding:4px 8px; font-size:0.75rem; color:#ef4444; border-color:#ef4444;" onclick="alert('ระงับการใช้งาน ${u.username}')">ระงับ</button>
                                    </div>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

window.filterUsers = function(val) {
    const table = document.getElementById('userTable');
    if (!table) return;
    const rows = table.getElementsByTagName('tr');
    const term = val.toLowerCase();
    
    for (let i = 1; i < rows.length; i++) {
        const text = rows[i].textContent.toLowerCase();
        rows[i].style.display = text.includes(term) ? '' : 'none';
    }
};
