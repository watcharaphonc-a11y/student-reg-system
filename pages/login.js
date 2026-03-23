// ============================
// Authentication & Login Control
// ============================

function renderLoginUI() {
    const loginHtml = `
    <div class="login-container animate-in">
        <div class="login-card">
            <div class="login-header">
                <div class="logo-icon" style="margin: 0 auto 15px auto; width: 56px; height: 56px; background: var(--accent-gradient); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <h2>เข้าสู่ระบบ</h2>
                <p class="page-subtitle">ระบบทะเบียนนักศึกษา สถาบันพระบรมราชชนก</p>
            </div>
            
            <div class="login-tabs">
                <button class="login-tab active" data-role="student" onclick="switchLoginTab('student')">นักศึกษา</button>
                <button class="login-tab" data-role="staff" onclick="switchLoginTab('staff')">บุคลากร</button>
                <button class="login-tab" data-role="admin" onclick="switchLoginTab('admin')">Super Admin</button>
            </div>
            
            <div id="loginError" class="login-error" style="display: none; color: #ef4444; background: #fef2f2; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-size: 0.9rem; font-weight: 500;"></div>
            
            <div class="login-form" id="loginFormStudent">
                <div class="form-group">
                    <label class="form-label">เลขประจำตัวประชาชน (13 หลัก)</label>
                    <input type="text" id="studentIdInput" class="form-input" placeholder="เลขบัตรประชาชน 13 หลัก" maxlength="13" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                </div>
                <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 1rem; margin-top: 10px;" onclick="handleLogin('student')">เข้าสู่ระบบ</button>
            </div>
            
            <div class="login-form" id="loginFormStaff" style="display: none;">
                <div class="form-group">
                    <label class="form-label">อีเมลสถาบัน</label>
                    <input type="email" id="staffEmailInput" class="form-input" placeholder="ชื่อ.นามสกุล@pi.ac.th">
                </div>
                <div class="form-group">
                    <label class="form-label">รหัสผ่าน (6 หลัก)</label>
                    <input type="password" id="staffPassInput" class="form-input" placeholder="ตัวเลข 6 หลัก" maxlength="6" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                </div>
                <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 1rem; margin-top: 10px;" onclick="handleLogin('staff')">เข้าสู่ระบบ</button>
            </div>
            
            <div class="login-form" id="loginFormAdmin" style="display: none;">
                <div class="form-group">
                    <label class="form-label">รหัสผ่าน Super Admin (6 หลัก)</label>
                    <input type="password" id="adminPassInput" class="form-input" placeholder="ตัวเลข 6 หลัก" maxlength="6" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:5px; text-align:right;">(รหัสผ่านเริ่มต้น: 999999)</div>
                </div>
                <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 1rem; margin-top: 10px;" onclick="handleLogin('admin')">เข้าสู่ระบบ</button>
            </div>

        </div>
    </div>
    `;

    const overlay = document.createElement('div');
    overlay.id = 'loginOverlay';
    overlay.className = 'login-overlay';
    overlay.innerHTML = loginHtml;
    document.body.appendChild(overlay);
}

function switchLoginTab(role) {
    document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.login-tab[data-role="${role}"]`).classList.add('active');

    document.querySelectorAll('.login-form').forEach(f => f.style.display = 'none');

    let targetForm = document.getElementById('loginForm' + role.charAt(0).toUpperCase() + role.slice(1));
    targetForm.style.display = 'block';
    document.getElementById('loginError').style.display = 'none';
}

function showError(msg) {
    const errEl = document.getElementById('loginError');
    errEl.textContent = msg;
    errEl.style.display = 'block';
}

function handleLogin(role) {
    if (role === 'student') {
        const id = document.getElementById('studentIdInput').value;
        if (id.length !== 13) {
            return showError("กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก");
        }

        // Find matching student by ID or Username
        const studentRecord = (MOCK.students || []).find(s => String(s.id) === id || String(s.username) === id || String(s.studentId) === id);
        const userRecord = (MOCK.users || []).find(u => String(u.username) === id && u.role && (u.role.toLowerCase() === 'student' || u.role === 'นักศึกษา'));

        if (studentRecord || userRecord) {
            const name = studentRecord ? ((studentRecord.firstName && studentRecord.lastName) ? studentRecord.firstName + ' ' + studentRecord.lastName : studentRecord.name || id) : (userRecord.name || id);
            performLogin('student', { id: id, name: name });
        } else {
            return showError("ไม่พบข้อมูลนักศึกษาในระบบ หรือบัญชียังไม่ถูกสร้าง");
        }

    } else if (role === 'staff') {
        const email = document.getElementById('staffEmailInput').value;
        const pass = document.getElementById('staffPassInput').value;
        if (!email) {
            return showError("กรุณากรอกอีเมล/ชื่อผู้ใช้");
        }
        if (pass.length === 0) {
            return showError("กรุณากรอกรหัสผ่าน");
        }

        // Find matching staff by Username/Email and Password
        const userRecord = (MOCK.users || []).find(u => String(u.username) === email && String(u.password) === pass);
        const teacherRecord = (MOCK.academicAdvisors || []).find(t => String(t.email) === email && String(t.password) === pass);

        if (userRecord || teacherRecord) {
            const roleName = userRecord ? userRecord.role : (teacherRecord.position || 'บุคลากร');
            const name = userRecord ? userRecord.name : teacherRecord.name;
            performLogin('staff', { email: email, name: name, roleName: roleName });
        } else {
            return showError("ชือผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง");
        }

    } else if (role === 'admin') {
        const pass = document.getElementById('adminPassInput').value;
        if (pass.length === 0) {
            return showError("กรุณากรอกรหัสผ่าน");
        }

        // Find matching admin by Password
        const adminUser = (MOCK.users || []).find(u => u.role && (u.role.toLowerCase() === 'admin' || u.role.toLowerCase() === 'super admin') && String(u.password) === pass);

        if (adminUser) {
            performLogin('admin', { name: adminUser.name || 'ผู้ดูแลระบบ', roleName: 'Super Admin' });
        } else {
            return showError("รหัสผ่านไม่ถูกต้อง");
        }
    }
}

function performLogin(role, userData) {
    window.currentUserRole = role;
    window.isAdmin = (role === 'admin' || role === 'staff');

    // Update Layout Profile Info
    const userNameEl = document.querySelector('.user-name');
    const userRoleEl = document.querySelector('.user-role');
    const userAvatarEl = document.querySelector('.user-avatar');

    const roleMap = {
        'student': 'นักศึกษา',
        'staff': userData.roleName || 'เจ้าหน้าที่',
        'admin': 'Super Admin'
    };

    const displayName = userData.name || userData.id;
    if (userNameEl) userNameEl.textContent = displayName;
    if (userRoleEl) userRoleEl.textContent = roleMap[role];
    if (userAvatarEl) userAvatarEl.textContent = displayName.charAt(0).toUpperCase();

    // Cleanup UI
    document.getElementById('loginOverlay').remove();
    document.querySelector('.app').style.display = 'flex';

    // Enforce role-based access to sidebar items
    applyRolePermissions(role);

    // Force a re-render of current view (often dashboard)
    if (typeof navigateTo === 'function') {
        navigateTo('dashboard');
    }

    // Inject Logout Button into header if not present
    if (!document.getElementById('logoutBtn')) {
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            const logoutHtml = `
            <button class="header-btn" id="logoutBtn" aria-label="Logout" onclick="performLogout()" style="color:#ef4444; margin-left:10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span class="nav-label" style="display:none;">ออกจากระบบ</span>
            </button>`;
            headerRight.insertAdjacentHTML('beforeend', logoutHtml);
        }
    }
}

window.performLogout = function () {
    window.currentUserRole = null;
    window.isAdmin = false;
    document.querySelector('.app').style.display = 'none';
    renderLoginUI();
};

function applyRolePermissions(role) {
    const allNavItems = document.querySelectorAll('.nav-item');

    // Reset all to visible first
    allNavItems.forEach(el => el.style.display = 'flex');

    if (role === 'student') {
        // Strictly allow only what was requested for Students
        const allowedIds = [
            'nav-dashboard', // Keeping dashboard as default landing, though not explicitly in list
            'nav-student-profile',
            'nav-courses',
            'nav-study-plan',
            'nav-grades',
            'nav-schedule',
            'nav-eval-course',
            'nav-eval-instructor',
            'nav-transcript',
            'nav-thesis-advisor',
            'nav-academic-advisor',
            'nav-exam-committee',
            'nav-payments',
            'nav-petitions-student',
            'nav-documents-status',
            'nav-calendar',
            'nav-announcements',
            'nav-settings'
            // 'nav-user-management' is NOT in allowedIds, so it will be hidden
        ];

        allNavItems.forEach(el => {
            if (!allowedIds.includes(el.id)) {
                el.style.display = 'none';
            }
        });
    } else if (role === 'staff') {
        // Staff/Teacher/Dean role items
        const restrictedForStaff = [
            'nav-teacher-registration', // Usually for Super Admin
            'nav-manage-evals', // Usually for Super Admin
            'nav-user-management' // Super Admin only
        ];
        allNavItems.forEach(el => {
            if (restrictedForStaff.includes(el.id)) {
                el.style.display = 'none';
            }
        });
    }
    // Super Admin sees everything (all visible by default)
}

// Ensure Login UI kicks off on script load
renderLoginUI();
