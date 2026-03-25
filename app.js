// ============================
// Main Application Controller
// (loaded AFTER core.js, data.js, and page scripts)
// ============================

let currentPage = 'dashboard';
window.apiDataLoaded = false;
window.APP_VERSION = "V.1.2 By Watcharaphon.c";

// Initialize Login UI if not logged in
if (!localStorage.getItem('currentUser')) {
    if (typeof renderLoginUI === 'function') renderLoginUI();
}

// DOM Elements
const contentArea = document.getElementById('contentArea');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const modalCloseBtn = document.getElementById('modalClose');

// ====== Navigation ======
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) navigateTo(page);
    });
});

function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`[data-page="${page}"]`);
    if (activeNav) activeNav.classList.add('active');
    renderPage();
    sidebar.classList.remove('mobile-open');
}

/**
 * check if current user role has permission for an action
 */
window.hasPermission = function(actionKey) {
    if (window.currentUserRole === 'admin' && window.currentUserData?.name === 'Super Admin') return true; // Super Admin always YES
    if (!MOCK.permissions || MOCK.permissions.length === 0) return false;
    
    const rolePerms = MOCK.permissions.find(p => String(p.Role).toLowerCase() === String(window.currentUserRole).toLowerCase());
    if (!rolePerms) return false;
    
    return rolePerms[actionKey] === 'YES';
};

function renderPage() {
    if (pages[currentPage]) {
        contentArea.innerHTML = pages[currentPage]();
        contentArea.scrollTop = 0;
        // Initialize page-specific JS
        const initFn = window['init_' + currentPage.replace(/-/g, '_')];
        if (initFn) initFn();
    } else {
        contentArea.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <h3>ไม่พบหน้านี้</h3>
                <p>กรุณาเลือกเมนูจาก Sidebar</p>
            </div>`;
    }
}

// ====== Notification Bell ======
const notifBtn = document.getElementById('notifBtn');
if (notifBtn) {
    notifBtn.addEventListener('click', () => {
        navigateTo('announcements');
        const badge = document.querySelector('.notif-badge');
        if (badge) badge.style.display = 'none';
        
        const latestId = MOCK.announcements && MOCK.announcements[0]?.id;
        if (latestId) localStorage.setItem('lastSeenAnnouncementId', latestId);
    });
}

// ====== Sidebar Toggle ======
sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
mobileMenuBtn.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));

// ====== Modal close button ======
modalCloseBtn.addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// ====== Boot ======
async function bootApp() {
    if (typeof showApiLoading === 'function') {
        showApiLoading('กำลังโหลดข้อมูลเบื้องต้น...');
    }
    try {
        // Fetch all necessary data from Google Sheets API
        const allData = await fetchData('getAllData');
        if (!allData || allData.status === 'error') throw new Error(allData?.message || 'Failed to fetch data');

        const { 
            users: usersData, 
            students: studentsData, 
            teachers: teachersData, 
            courses: coursesData, 
            enrollments: enrollmentsData, 
            payments: paymentsData, 
            evaluations: evaluationsData, 
            documents: documentsData,
            announcements: announcementsData
        } = allData;

        // Map Students and attach Grades from Enrollments
        if (studentsData && studentsData.length > 0) {
            MOCK.students = studentsData.map(s => {
                const sId = String(s['รหัสนักศึกษา'] || s.studentId || s.id || '').trim();
                
                // Find enrollments for this student
                const studentEnrollments = (enrollmentsData || []).filter(e => String(e['รหัสนักศึกษา'] || e.studentId).trim() === sId);
                
                // Group enrollments into student.grades format
                const gradesMap = {};
                studentEnrollments.forEach(e => {
                    const year = e['academic_year'] || e['ปีการศึกษา'] || '-';
                    const sem = e['semester'] || e['ภาคเรียน'] || '-';
                    const semName = `ภาคเรียนที่ ${sem}/${year}`;
                    
                    const cGrade = String(e['grade'] || e['เกรด'] || '').trim();
                    const creditsRaw = String(e['credits'] || e['หน่วยกิต'] || '0');
                    const cCredits = parseInt(creditsRaw.split('(')[0]) || 0;
                    
                    let point = 0;
                    switch(cGrade) {
                        case 'A': point = 4.0; break;
                        case 'B+': point = 3.5; break;
                        case 'B': point = 3.0; break;
                        case 'C+': point = 2.5; break;
                        case 'C': point = 2.0; break;
                        case 'D+': point = 1.5; break;
                        case 'D': point = 1.0; break;
                        case 'F': point = 0.0; break;
                    }
                    
                    if (!gradesMap[semName]) {
                        gradesMap[semName] = { semester: semName, gpa: 0, totalCredits: 0, totalPoints: 0, courses: [] };
                    }
                    
                    gradesMap[semName].courses.push({
                        code: e['course_code'] || e['รหัสวิชา'] || '-',
                        name: e['course_name'] || e['ชื่อวิชา'] || '-',
                        credits: cCredits,
                        grade: cGrade,
                        point: point
                    });
                    
                    gradesMap[semName].totalCredits += cCredits;
                    gradesMap[semName].totalPoints += (point * cCredits);
                });
                
                const finalGrades = Object.values(gradesMap).map(g => ({
                    semester: g.semester,
                    totalCredits: g.totalCredits,
                    gpa: g.totalCredits > 0 ? (g.totalPoints / g.totalCredits) : 0,
                    courses: g.courses
                })).sort((a,b) => b.semester.localeCompare(a.semester));

                // Overall Stats
                const allCourses = finalGrades.flatMap(g => g.courses);
                const overallCredits = allCourses.reduce((sum, c) => sum + c.credits, 0);
                const overallPoints = allCourses.reduce((sum, c) => sum + (c.point * c.credits), 0);
                const overallGpa = overallCredits > 0 ? (overallPoints / overallCredits) : 0;

                return {
                    id: sId || s['เลขประจำตัวประชาชน'] || s['เลขบัตรประชาชน'] || s.id,
                    studentId: sId,
                    citizenId: s['เลขประจำตัวประชาชน'] || s.citizenId || '',
                    prefix: s['คำนำหน้า'] || s.prefix,
                    firstName: s['ชื่อ'] || s.firstName,
                    lastName: s['นามสกุล'] || s.lastName,
                    faculty: s['คณะ'] || s.faculty,
                    department: s['สาขาวิชา'] || s.department,
                    program: s['หลักสูตร'] || s.program,
                    year: parseInt(s['ชั้นปี'] || s.year) || 1,
                    status: s['สถานะ'] || s.status || 'กำลังศึกษา',
                    admissionYear: s['ปีการศึกษา'] || s['ปีที่เข้าศึกษา'] || s.admissionYear,
                    advisor: s['อาจารย์ที่ปรึกษา'] || s.advisor || '-',
                    email: s['อีเมล'] || s.email || '-',
                    personalEmail: s['อีเมลส่วนตัว'] || s.personalEmail || '-',
                    phone: s['โทรศัพท์'] || s.phone || '-',
                    workplace: s['สถานที่ปฏิบัติงาน'] || s.workplace || '-',
                    position: s['ตำแหน่ง'] || s.position || '-',
                    dob: s['วันเกิด'] || s.dob || '-',
                    address: s['ที่อยู่'] || s.address || '-',
                    parentName: s['ผู้ปกครอง'] || s.parentName || '-',
                    parentPhone: s['เบอร์ผู้ปกครอง'] || s.parentPhone || '-',
                    gpa: overallGpa,
                    totalCredits: overallCredits,
                    requiredCredits: parseInt(s['หน่วยกิตที่ต้องเรียน']) || s.requiredCredits || 36,
                    grades: finalGrades
                };
            });
        }

        if (teachersData && teachersData.length > 0) {
            MOCK.academicAdvisors = teachersData.map(t => ({
                name: (t['คำนำหน้า'] || '') + (t['ชื่อ'] ? (' ' + t['ชื่อ']) : '') + (t['นามสกุล'] ? (' ' + t['นามสกุล']) : '') || t.name,
                position: t['ตำแหน่งทางวิชาการ'] || t['ตำแหน่ง'] || t.position || 'อาจารย์',
                expertise: t['ความเชี่ยวชาญ'] || t.expertise || '-',
                email: t['อีเมล'] || t.email || '-',
                phone: t['เบอร์โทร'] || t['โทรศัพท์'] || t.phone || '-',
                studentCount: parseInt(t['นศ. ในที่ปรึกษา'] || t['นศ.ในที่ปรึกษา'] || t.studentCount) || 0,
                faculty: t['คณะ/สังกัด'] || t['คณะ'] || t.faculty || 'คณะพยาบาลศาสตร์',
                username: t['Username'] || t.username,
                password: t['Password'] || t.password
            }));
            MOCK.thesisAdvisors = [...MOCK.academicAdvisors];
        }

        if (usersData && usersData.length > 0) {
            MOCK.users = usersData.map(u => ({
                ...u, // Keep all dynamic fields
                username: u['Username'] || u.username,
                password: u['Password'] || u.password,
                name: u['Name'] || u.name,
                role: u['Role'] || u.role,
                status: u['Status'] || u.status || 'ใช้งาน'
            }));
            console.log('Successfully loaded Users from Sheet:', MOCK.users);
        } else {
            console.warn('No users found in Google Sheets data.');
        }

        if (coursesData && coursesData.length > 0) {
            MOCK.courses = coursesData.map(c => ({
                code: c['รหัสวิชา'] || c.code,
                name: c['ชื่อวิชา'] || c.name,
                credits: parseInt(c['หน่วยกิต'] || c.credits) || 0,
                instructor: c['อาจารย์ผู้สอน'] || c.instructor || '-',
                seats: parseInt(c['จำนวนรับ'] || c.seats) || 30,
                enrolled: parseInt(c['ลงทะเบียนแล้ว'] || c.enrolled) || 0,
                schedule: c['วัน-เวลาเรียน'] || c.schedule || '-',
                room: c['ห้องเรียน'] || c.room || '-',
                type: c['หมวดหมู่'] || c.type || 'แกน',
                status: c['สถานะ'] || c.status || 'เปิด'
            }));
        }

        // MOCK.enrollments is now handled within student mapping in bootApp
        // if (enrollmentsData && enrollmentsData.length > 0) {
        //     MOCK.enrollments = enrollmentsData;
        // }

        if (paymentsData && paymentsData.length > 0) {
            MOCK.payments = paymentsData.map(p => ({
                id: p['รหัสอ้างอิง'] || p.id,
                description: p['รายการ'] || p.description,
                amount: parseFloat(p['จำนวนเงิน'] || p.amount) || 0,
                dueDate: p['วันที่ครบกำหนด'] || p.dueDate,
                paidDate: p['วันที่ชำระ'] || p.paidDate,
                status: p['สถานะ'] || p.status,
                type: p['ประเภท'] || p.type
            }));
        }

        if (evaluationsData && evaluationsData.length > 0) {
            MOCK.evaluations = evaluationsData.map(e => ({
                courseCode: e['รหัสวิชา'] || e.courseCode,
                score: parseFloat(e['คะแนน (1-5)'] || e.score) || 5,
                comment: e['ความคิดเห็น'] || e.comment || '',
                date: e['วันที่ประเมิน'] || e.date || ''
            }));
        }

        if (documentsData && documentsData.length > 0) {
            MOCK.documents = documentsData.map(d => {
                const sId = d['รหัสนักศึกษา'] || d['รหัสประจำตัว'] || d.studentId || d.id;
                const name = d['ชื่อผู้ส่ง'] || d['ชื่อ-นามสกุล'] || d.senderName;
                const type = d['ประเภทเอกสาร'] || d['ประเภท'] || d.documentType;
                const dateRaw = d['วันที่ส่ง'] || d['วันที่'] || d.date;
                const trackId = d['รหัสติดตาม'] || d.id;
                
                return {
                    studentId: sId || 'Unknown',
                    senderName: name || 'Unknown',
                    documentType: type || 'คำร้องทั่วไป',
                    fileName: d['ชื่อไฟล์'] || d.fileName || 'document.pdf',
                    fileUrl: d['ลิงก์เอกสาร'] || d.fileUrl || '',
                    signedFileUrl: d['ลิงก์เอกสารที่ลงนาม'] || d.signedFileUrl || '',
                    date: dateRaw,
                    status: d['สถานะ'] || d.status || 'รอตรวจสอบ',
                    nextStep: d['ผู้รับผิดชอบถัดไป'] || d.nextStep || 'เจ้าหน้าที่งานทะเบียน',
                    note: d['หมายเหตุ'] || d.note || '',
                    id: trackId || ('DOC-' + new Date().getTime())
                };
            });

            // Sync for Admin view
            MOCK.adminDocuments = MOCK.documents.map((d, index) => {
                // Determine a nice display date
                let displayDate = String(d.date || '-');
                try {
                    const dateObj = new Date(d.date);
                    if (!isNaN(dateObj.getTime())) {
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        let year = dateObj.getFullYear();
                        // Thai Buddhist Year conversion (AD to BE)
                        if (year < 2400) year += 543;
                        
                        const hours = String(dateObj.getHours()).padStart(2, '0');
                        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                        displayDate = `${day}/${month}/${year} ${hours}:${minutes} น.`;
                    }
                } catch (e) {
                    console.warn('Date formatting failed:', e);
                }

                return {
                    ...d,
                    formName: d.documentType,
                    submitDate: displayDate,
                    attachment: d.fileName
                };
            }).reverse();
        }

        if (announcementsData && announcementsData.length > 0) {
            MOCK.announcements = announcementsData.map(a => ({
                id: a['รหัสประกาศ'] || a.id,
                type: a['ประเภท'] || a.type || 'ทั่วไป',
                title: a['หัวข้อ'] || a.title || 'ไม่มีหัวข้อ',
                content: a['เนื้อหา'] || a.content || '',
                date: a['วันที่ประกาศ'] || a.date || '',
                icon: a['ไอคอน'] || a.icon || '📢',
                author: a['ผู้ประกาศ'] || a.author || 'Admin'
            }));
            
            // Notification Badge Logic
            const lastSeen = localStorage.getItem('lastSeenAnnouncementId');
            const latestId = MOCK.announcements[0]?.id;
            if (latestId && lastSeen !== latestId) {
                const badge = document.querySelector('.notif-badge');
                if (badge) {
                    badge.style.display = 'block';
                    badge.textContent = '!'; // Or calculate count
                }
            }
        }

        // Calculate Dashboard Stats from Real Data
        MOCK.dashboardStats = {
            totalStudents: MOCK.students ? MOCK.students.length : 0,
            totalTeachers: MOCK.academicAdvisors ? MOCK.academicAdvisors.length : 0,
            totalCourses: MOCK.courses ? MOCK.courses.length : 0,
            pendingPayments: MOCK.payments ? MOCK.payments.filter(p => p.status === 'ค้างชำระ').length : 0,
            avgGPA: 0
        };

        if (MOCK.students && MOCK.students.length > 0) {
            const studentsWithGPA = MOCK.students.filter(s => s.gpa > 0);
            if (studentsWithGPA.length > 0) {
                const totalGPA = studentsWithGPA.reduce((acc, s) => acc + s.gpa, 0);
                MOCK.dashboardStats.avgGPA = (totalGPA / studentsWithGPA.length).toFixed(2);
            }
        }

        // Maintain or Update current mock references based on logged in user
        if (studentsData && studentsData.length > 0) {
            if (window.currentUserRole === 'student' && window.currentUserData && window.currentUserData.id) {
                const myId = String(window.currentUserData.id).trim();
                const myName = window.currentUserData.name ? String(window.currentUserData.name).trim() : '';

                let me = (MOCK.students || []).find(s =>
                    String(s.id || '').trim() === myId ||
                    String(s.studentId || '').trim() === myId ||
                    String(s.citizenId || '').trim() === myId
                );
                
                // Fallback name matching if ID fails (case-insensitive contains)
                if (!me && myName) {
                    const normMyName = myName.toLowerCase();
                    me = (MOCK.students || []).find(s => {
                        const sFull = String(s.name || '').toLowerCase();
                        const sParts = String(`${s.firstName || ''} ${s.lastName || ''}`).toLowerCase();
                        return (sFull && sFull.includes(normMyName)) || (sParts && sParts.includes(normMyName)) || normMyName.includes(sParts);
                    });
                }
                
                MOCK.student = me || null; // Force null if no match to prevent leakage
                syncActiveStudentData();
            } else {
                // Admin/Staff - No auto-selection of mock students.
                // Reset active student context to ensure we only see real data selected by admin
                MOCK.student = null;
                syncActiveStudentData();
            }
        }
        MOCK.permissions = allData.permissions || [];
        
        window.apiDataLoaded = true;
    } catch (e) {
        console.error('Failed to load API data:', e);
        window.apiDataLoaded = 'error'; // Indicate error state
        if (typeof showError === 'function') {
            showError(`การเชื่อมต่อผิดพลาด: ${e.message || e}\nกรุณาตรวจสอบการตั้งค่า Apps Script (Deployment) หรือสิทธิ์การเข้าถึง`);
        }
    }

    if (typeof hideApiLoading === 'function') {
        hideApiLoading();
    }
    renderPage();
}

window.syncActiveStudentData = async function() {
    if (!MOCK.student) return;
    
    // Refresh student data from Google Sheets
    showApiLoading('กำลังอัปเดตข้อมูลนักศึกษา...');
    try {
        const [enrollments, payments, documents] = await Promise.all([
            fetchData('getEnrollments'),
            fetchData('getPayments'),
            fetchData('getDocuments')
        ]);
        
        const sId = String(MOCK.student.studentId || MOCK.student.id || '').trim();

        // 1. Sync Grades
        const studentEnrollments = (enrollments || []).filter(e => {
            const rowSId = String(e['student_id'] || e['รหัสนักศึกษา'] || e.studentId || '').trim();
            return rowSId === sId;
        });
        const gradesMap = {};
        studentEnrollments.forEach(e => {
            const year = e['academic_year'] || e['ปีการศึกษา'] || '-';
            const sem = e['semester'] || e['ภาคเรียน'] || '-';
            const semName = `ภาคเรียนที่ ${sem}/${year}`;
            
            const cGrade = String(e['grade'] || e['เกรด'] || '').trim();
            const creditsRaw = String(e['credits'] || e['หน่วยกิต'] || '0');
            const cCredits = parseInt(creditsRaw.split('(')[0]) || 0;
            
            let point = 0;
            switch(cGrade) {
                case 'A': point = 4.0; break;
                case 'B+': point = 3.5; break;
                case 'B': point = 3.0; break;
                case 'C+': point = 2.5; break;
                case 'C': point = 2.0; break;
                case 'D+': point = 1.5; break;
                case 'D': point = 1.0; break;
                case 'F': point = 0.0; break;
            }
            
            if (!gradesMap[semName]) {
                gradesMap[semName] = { semester: semName, gpa: 0, totalCredits: 0, totalPoints: 0, courses: [] };
            }
            
            gradesMap[semName].courses.push({
                code: e['course_code'] || e['รหัสวิชา'] || '-',
                name: e['course_name'] || e['ชื่อวิชา'] || '-',
                credits: cCredits,
                grade: cGrade,
                point: point
            });
            
            gradesMap[semName].totalCredits += cCredits;
            gradesMap[semName].totalPoints += (point * cCredits);
        });
        
        MOCK.grades = Object.values(gradesMap).map(g => ({
            semester: g.semester,
            totalCredits: g.totalCredits,
            gpa: g.totalCredits > 0 ? (g.totalPoints / g.totalCredits) : 0,
            courses: g.courses
        })).sort((a,b) => b.semester.localeCompare(a.semester));

        // Update student object stats
        const allCourses = MOCK.grades.flatMap(g => g.courses);
        MOCK.student.totalCredits = allCourses.reduce((sum, c) => sum + c.credits, 0);
        const overallPoints = allCourses.reduce((sum, c) => sum + (c.point * c.credits), 0);
        MOCK.student.gpa = MOCK.student.totalCredits > 0 ? (overallPoints / MOCK.student.totalCredits) : 0;
        MOCK.student.grades = MOCK.grades;

        // 2. Sync Payments
        if (payments && payments.length > 0) {
            MOCK.studentPayments = payments
                .filter(p => String(p['รหัสนักศึกษา'] || p.studentId || '').trim() === sId)
                .map(p => ({
                    id: p['รหัสอ้างอิง'] || p.id,
                    description: p['รายการ'] || p.description,
                    amount: parseFloat(p['จำนวนเงิน'] || p.amount) || 0,
                    status: p['สถานะ'] || p.status,
                    date: p['วันที่'] || p.paidDate || p.dueDate
                }));
        }

        // 3. Sync Documents
        if (documents && documents.length > 0) {
            MOCK.studentDocuments = documents
                .filter(d => String(d['รหัสนักศึกษา'] || d.studentId || '').trim() === sId)
                .map((d, index) => ({
                    id: 'DOC-S' + (1000 + index),
                    formName: d['ประเภทเอกสาร'] || d.documentType,
                    submitDate: d['วันที่ส่ง'] || d.date,
                    lastUpdate: d['วันที่ส่ง'] || d.date,
                    status: d['สถานะ'] || d.status,
                    attachment: d['ชื่อไฟล์'] || d.fileName,
                    fileUrl: d['ลิงก์เอกสาร'] || d.fileUrl,
                    signedFileUrl: d['ลิงก์เอกสารที่ลงนาม'] || d.signedFileUrl,
                    note: d['หมายเหตุ'] || d.note
                }));
        }
    } catch (err) {
        console.error('Sync student data failed:', err);
    } finally {
        hideApiLoading();
        renderPage();
    }
};

bootApp();
