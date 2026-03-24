// ============================
// Main Application Controller
// (loaded AFTER core.js, data.js, and page scripts)
// ============================

let currentPage = 'dashboard';

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
        const [studentsData, teachersData, usersData, coursesData, enrollmentsData, paymentsData, evaluationsData, documentsData] = await Promise.all([
            fetchData('getStudents'),
            fetchData('getTeachers'),
            fetchData('getUsers'),
            fetchData('getCourses'),
            fetchData('getEnrollments'),
            fetchData('getPayments'),
            fetchData('getEvaluations'),
            fetchData('getDocuments')
        ]);

        // Map and merge real data
        if (studentsData && studentsData.length > 0) {
            MOCK.students = studentsData.map(s => {
                const sId = String(s['รหัสนักศึกษา'] || s.studentId || s.id || '').trim();
                
                // Calculate basic stats for this student from enrollments
                let sTotalPoints = 0;
                let sTotalCredits = 0;
                if (MOCK.enrollments) {
                    MOCK.enrollments
                        .filter(e => String(e['รหัสนักศึกษา'] || e.studentId).trim() === sId)
                        .filter(e => e['เกรด'] && String(e['เกรด']).trim() !== '')
                        .forEach(e => {
                            const point = gradeToPoint(e['เกรด']);
                            const courseCode = e['รหัสวิชา'] || e.courseCode;
                            const course = MOCK.courses ? MOCK.courses.find(c => c.code === courseCode) : null;
                            const creditsRaw = e['หน่วยกิต'] || (course ? course.credits : 0);
                            const credits = parseInt(creditsRaw) || 0;
                            sTotalPoints += (point * credits);
                            sTotalCredits += credits;
                        });
                }

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
                    gpa: sTotalCredits > 0 ? (sTotalPoints / sTotalCredits) : (parseFloat(s['GPA']) || 0),
                    totalCredits: sTotalCredits > 0 ? sTotalCredits : (parseInt(s['หน่วยกิตสะสม']) || 0),
                    requiredCredits: parseInt(s['หน่วยกิตที่ต้องเรียน']) || s.requiredCredits || 132
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

        if (enrollmentsData && enrollmentsData.length > 0) {
            MOCK.enrollments = enrollmentsData;
        }

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
            MOCK.documents = documentsData.map(d => ({
                studentId: d['รหัสนักศึกษา'] || d.studentId,
                senderName: d['ชื่อผู้ส่ง'] || d.senderName,
                documentType: d['ประเภทเอกสาร'] || d.documentType,
                fileName: d['ชื่อไฟล์'] || d.fileName,
                fileUrl: d['ลิงก์เอกสาร'] || d.fileUrl,
                signedFileUrl: d['ลิงก์เอกสารที่ลงนาม'] || d.signedFileUrl,
                date: d['วันที่ส่ง'] || d.date,
                status: d['สถานะ'] || d.status,
                nextStep: d['ผู้รับผิดชอบถัดไป'] || d.nextStep,
                note: d['หมายเหตุ'] || d.note
            }));

            // Sync for Admin view
            MOCK.adminDocuments = MOCK.documents.map((d, index) => ({
                ...d,
                id: 'DOC-A' + (1000 + index),
                formName: d.documentType,
                submitDate: d.date,
                attachment: d.fileName
            })).reverse();
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
                // For Admin/Staff, fallback to latest student ONLY if none selected
                if (!MOCK.student && MOCK.students.length > 0) {
                    MOCK.student = MOCK.students[MOCK.students.length - 1];
                }
                syncActiveStudentData();
            }
        }
    } catch (e) {
        console.error('Failed to load API data, using mock data fallback', e);
    }

    if (typeof hideApiLoading === 'function') {
        hideApiLoading();
    }
    renderPage();
}

window.syncActiveStudentData = function() {
    if (!MOCK.student) return;

    const studentId = String(MOCK.student.studentId || MOCK.student.id).trim();

    // 1. Filter enrollments & courses
    if (MOCK.enrollments && MOCK.courses) {
        const myEnrollments = MOCK.enrollments.filter(e => 
            String(e['รหัสนักศึกษา'] || e.studentId).trim() === studentId
        );
        
        MOCK.enrolledCourses = myEnrollments.map(e => {
            const courseCode = e['รหัสวิชา'] || e.courseCode;
            const course = MOCK.courses.find(c => c.code === courseCode);
            return {
                code: courseCode,
                name: course ? course.name : (e['ชื่อวิชา'] || '-'),
                credits: course ? course.credits : parseInt(e['หน่วยกิต'] || 0),
                instructor: course ? course.instructor : (e['อาจารย์'] || '-'),
                schedule: course ? course.schedule : (e['เวลาเรียน'] || '-'),
                room: course ? course.room : (e['ห้องเรียน'] || '-')
            };
        });

        // 2. Group grades by semester
        const gradesBySem = {};
        myEnrollments
            .filter(e => e['เกรด'] && String(e['เกรด']).trim() !== '')
            .forEach(e => {
                const semName = `${e['ภาคเรียน'] || '1'}/${e['ปีการศึกษา'] || '2568'}`;
                const courseCode = e['รหัสวิชา'] || e.courseCode;
                const course = MOCK.courses.find(c => c.code === courseCode);
                
                if (!gradesBySem[semName]) {
                    gradesBySem[semName] = { 
                        semester: semName, 
                        courses: [],
                        totalPoints: 0,
                        totalCredits: 0,
                        gpa: 0
                    };
                }
                
                const point = gradeToPoint(e['เกรด']);
                const credits = course ? course.credits : parseInt(e['หน่วยกิต'] || 0);
                
                gradesBySem[semName].courses.push({
                    code: courseCode,
                    name: course ? course.name : (e['ชื่อวิชา'] || '-'),
                    credits: credits,
                    grade: e['เกรด'],
                    point: point
                });
                
                gradesBySem[semName].totalPoints += (point * credits);
                gradesBySem[semName].totalCredits += credits;
            });

        MOCK.grades = Object.values(gradesBySem).map(sem => ({
            ...sem,
            gpa: sem.totalCredits > 0 ? (sem.totalPoints / sem.totalCredits) : 0
        })).sort((a, b) => b.semester.localeCompare(a.semester));

        // 3. GPA History
        MOCK.gpaHistory = MOCK.grades.map(g => ({
            semester: g.semester,
            gpa: g.gpa
        })).reverse();
    }

    // 4. Filter payments
    if (MOCK.payments && MOCK.payments.length > 0) {
        MOCK.payments = MOCK.payments.filter(p => 
            String(p['รหัสนักศึกษา'] || p.studentId).trim() === studentId
        );
    }

    // 5. Filter documents
    if (MOCK.documents && MOCK.documents.length > 0) {
        MOCK.studentDocuments = MOCK.documents
            .filter(d => String(d.studentId).trim() === studentId)
            .map((d, index) => ({
                id: 'DOC-S' + (1000 + index),
                formName: d.documentType,
                submitDate: d.date,
                lastUpdate: d.date,
                status: d.status,
                attachment: d.fileName,
                fileUrl: d.fileUrl
            }));
    }
};

bootApp();
