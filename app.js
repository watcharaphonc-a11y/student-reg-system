// ============================
// Main Application Controller
// (loaded AFTER core.js, data.js, and page scripts)
// ============================

let currentPage = 'dashboard';
window.apiDataLoaded = false;
window.APP_VERSION = "V.1.2 By Watcharaphon.c";

// Initialize or Restore session
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
    try {
        const { role, userData } = JSON.parse(savedUser);
        window.tempSession = { role, userData };
        // If student, the landing page should be their profile, not the dashboard
        if (role === 'student') {
            currentPage = 'student-profile';
        }
    } catch (e) {
        localStorage.removeItem('currentUser');
    }
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
window.hasPermission = function (actionKey) {
    if (window.isSuperAdmin) return true; // Super Admin always YES
    if (!MOCK.permissions || MOCK.permissions.length === 0) return false;

    const rolePerms = MOCK.permissions.find(p => String(p.Role).toLowerCase() === String(window.currentUserRole).toLowerCase());
    if (!rolePerms) return false;

    return rolePerms[actionKey] === 'YES';
};

function renderPage() {
    if (!pages[currentPage]) {
        console.error('Page not found:', currentPage);
        currentPage = (window.currentUserRole === 'student') ? 'student-profile' : 'dashboard'; 
    }

    // Role-based Access Control: Prevent students from seeing the dashboard
    if (window.currentUserRole === 'student' && currentPage === 'dashboard') {
        currentPage = 'student-profile';
    }

    try {
        contentArea.innerHTML = pages[currentPage]();
        contentArea.scrollTop = 0;
        
        const initFn = window['init_' + currentPage.replace(/-/g, '_')];
        if (initFn) initFn();
    } catch (err) {
        console.error(`Error rendering page ${currentPage}:`, err);
        contentArea.innerHTML = `
            <div class="animate-in" style="padding:40px; text-align:center;">
                <div style="font-size:3rem; margin-bottom:20px;">⚠️</div>
                <h2 style="color:var(--danger-color); margin-bottom:10px;">เกิดข้อผิดพลาดในการแสดงผล</h2>
                <div style="background:#f8f9fa; padding:15px; border-radius:8px; font-family:monospace; font-size:0.85rem; color:var(--danger-color); margin-bottom:20px; text-align:left; overflow-x:auto;">
                    ${err.message}
                </div>
                <button class="btn btn-primary" onclick="navigateTo('dashboard')">กลับหน้าหลัก</button>
            </div>
        `;
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
    // Restore or Check Session
    if (window.currentUserRole) {
        // Session already active, do nothing
    } else if (window.tempSession) {
        // Restore from tempSession (initial script load)
        if (typeof applyLoginState === 'function') {
            applyLoginState(window.tempSession.role, window.tempSession.userData);
        }
        delete window.tempSession;
    } else {
        // Try to restore from localStorage directly or show login
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const { role, userData } = JSON.parse(savedUser);
                if (typeof applyLoginState === 'function') {
                    applyLoginState(role, userData);
                }
            } catch (e) {
                if (typeof renderLoginUI === 'function') renderLoginUI();
            }
        } else {
            if (typeof renderLoginUI === 'function') renderLoginUI();
        }
    }

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
            announcements: announcementsData,
            exams: examsData,
            examCommittees: examCommitteesData,
            evalQuestions: evalQuestionsData,
            courseInstructors: courseInstructorsData,
            evalInstructorQuestions: evalInstructorQuestionsData
        } = allData;

        MOCK.allExams = examsData || []; // Global for admin view

        // Map Students and attach Grades from Enrollments
        if (studentsData && studentsData.length > 0) {
            MOCK.students = studentsData.map(s => {
                const sId = String(s['รหัสนักศึกษา'] || s.studentId || s.id || '').trim();

                // Find enrollments for this student (Robust matching)
                const studentEnrollments = (enrollmentsData || []).filter(e => {
                    const eId = String(e['รหัสนักศึกษา'] || e.student_id || e.studentId || '').trim();
                    return eId === sId && eId !== '';
                });

                if (studentEnrollments.length > 0) {
                    console.log(`[bootApp] Found ${studentEnrollments.length} enrollments for student ${sId}`);
                }
                
                // Group enrollments into student.grades format
                const gradesMap = {};
                studentEnrollments.forEach(e => {
                    const year = parseInt(e['academic_year'] || e['ปีการศึกษา'] || '0');
                    const sem = parseInt(e['semester'] || e['ภาคเรียน'] || '0');
                    const semKey = `${year}_${sem}`;
                    const semName = `ภาคเรียนที่ ${sem}/${year}`;

                    const cGrade = String(e['เกรด'] || e['grade'] || '').trim();
                    const creditsRaw = String(e['หน่วยกิต'] || e['credits'] || '0').trim();
                    const cCredits = parseInt(creditsRaw.split('(')[0]) || 0;

                    let point = 0;
                    const g = cGrade.toUpperCase();
                    if (g === 'A') point = 4.0;
                    else if (g === 'B+') point = 3.5;
                    else if (g === 'B') point = 3.0;
                    else if (g === 'C+') point = 2.5;
                    else if (g === 'C') point = 2.0;
                    else if (g === 'D+') point = 1.5;
                    else if (g === 'D') point = 1.0;
                    else if (g === 'F') point = 0.0;

                    if (!gradesMap[semKey]) {
                        gradesMap[semKey] = { 
                            semester: semName, 
                            year: year,
                            term: sem,
                            gpa: 0, 
                            totalCredits: 0, 
                            gpaCredits: 0,
                            gpaPoints: 0,
                            courses: [] 
                        };
                    }

                    gradesMap[semKey].courses.push({
                        code: String(e['course_code'] || e['รหัสวิชา'] || '-').trim(),
                        name: String(e['course_name'] || e['ชื่อวิชา'] || '-').trim(),
                        credits: cCredits,
                        creditsDisplay: creditsRaw,
                        grade: cGrade,
                        point: point
                    });

                    // All credits count toward total (including Thesis)
                    gradesMap[semKey].totalCredits += cCredits;

                    // Exclude Thesis and non-GPA grades from GPA calculation
                    const courseName = String(e['course_name'] || e['ชื่อวิชา'] || '').trim();
                    const courseCode = String(e['course_code'] || e['รหัสวิชา'] || '').trim();
                    const isThesis = courseName.includes('วิทยานิพนธ์') || 
                                     courseName.toLowerCase().includes('thesis') ||
                                     courseCode.startsWith('1005002') ||
                                     courseCode.startsWith('1005003') ||
                                     courseCode.startsWith('1005004');
                    const isNonGPA = ['P', 'S', 'U', 'W', 'I'].includes(cGrade.toUpperCase());

                    if (!isThesis && !isNonGPA) {
                        gradesMap[semKey].gpaCredits += cCredits;
                        gradesMap[semKey].gpaPoints += (point * cCredits);
                    }
                });

                const finalGrades = Object.values(gradesMap)
                    .sort((a, b) => {
                        if (a.year !== b.year) return a.year - b.year;
                        return a.term - b.term;
                    })
                    .map(g => ({
                        semester: g.semester,
                        year: g.year,
                        term: g.term,
                        totalCredits: g.totalCredits,
                        gpa: g.gpaCredits > 0 ? (g.gpaPoints / g.gpaCredits) : 0,
                        courses: g.courses
                    }));

                // Overall Stats
                const allCourses = finalGrades.flatMap(g => g.courses);
                const overallCredits = allCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
                
                // GPA excludes Thesis and non-GPA grades
                const gpaCourses = allCourses.filter(c => {
                    const isThesis = (c.name || '').includes('วิทยานิพนธ์') || (c.name || '').toLowerCase().includes('thesis') ||
                                     (c.code || '').startsWith('1005002') || (c.code || '').startsWith('1005003') || (c.code || '').startsWith('1005004');
                    const isNonGPA = ['P', 'S', 'U', 'W', 'I'].includes(String(c.grade || '').toUpperCase());
                    return !isThesis && !isNonGPA;
                });
                const overallGpaCredits = gpaCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
                const overallGpaPoints = gpaCourses.reduce((sum, c) => sum + ((c.point || 0) * (c.credits || 0)), 0);
                const overallGpa = overallGpaCredits > 0 ? (overallGpaPoints / overallGpaCredits) : 0;

                return {
                    id: sId || s['เลขประจำตัวประชาชน'] || s['เลขบัตรประชาชน'] || s.id,
                    studentId: sId,
                    citizenId: s['เลขประจำตัวประชาชน'] || s.citizenId || '',
                    prefix: s['คำนำหน้า'] || s.prefix,
                    firstName: s['ชื่อ'] || s.firstName,
                    lastName: s['นามสกุล'] || s.lastName,
                    firstNameEn: s['firstNameEn'] || s['ชื่อ (EN)'] || '',
                    lastNameEn: s['lastNameEn'] || s['นามสกุล (EN)'] || '',
                    faculty: s['คณะ'] || s.faculty,
                    department: s['สาขาวิชา'] || s.department,
                    program: s['หลักสูตร'] || s.program,
                    year: parseInt(s['ชั้นปี'] || s.year) || 1,
                    status: s['สถานะ'] || s.status || 'กำลังศึกษา',
                    admissionYear: s['admissionYear'] || s['ปีการศึกษา'] || s['ปีที่เข้าศึกษา'] || s.admissionYear,
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
                    grades: finalGrades,
                    exams: (examsData || []).filter(ex => String(ex.student_id || '').trim() === sId)
                };
            });
        }

        if (teachersData && teachersData.length > 0) {
            const allMappedTeachers = teachersData.map(t => ({
                name: (t['คำนำหน้า'] || '') + (t['ชื่อ'] ? (' ' + t['ชื่อ']) : '') + (t['นามสกุล'] ? (' ' + t['นามสกุล']) : '') || t.name,
                position: t['ตำแหน่งทางวิชาการ'] || t['ตำแหน่ง'] || t.position || 'อาจารย์',
                expertise: t['ความเชี่ยวชาญ'] || t.expertise || '-',
                email: t['อีเมล'] || t.email || '-',
                phone: t['เบอร์โทร'] || t['โทรศัพท์'] || t.phone || '-',
                studentCount: parseInt(t['นศ. ในที่ปรึกษา'] || t['นศ.ในที่ปรึกษา'] || t.studentCount) || 0,
                faculty: t['คณะ/สังกัด'] || t['คณะ'] || t.faculty || 'คณะพยาบาลศาสตร์',
                username: t['Username'] || t.username,
                password: t['Password'] || t.password,
                type: t['ประเภทอาจารย์'] || t.type || 'อาจารย์ประจำ'
            }));

            // Filter for different roles/views
            MOCK.academicAdvisors = allMappedTeachers.filter(t => t.type === 'อาจารย์ประจำ');
            MOCK.specialLecturers = allMappedTeachers.filter(t => t.type === 'อาจารย์พิเศษ');
            
            // If academic advisors list is empty (e.g. initial setup), fall back to all teachers for compatibility
            if (MOCK.academicAdvisors.length === 0) MOCK.academicAdvisors = allMappedTeachers;
            
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
                id: e.id || e['id'],
                type: e.type || e['type'] || 'course',
                studentId: e.student_id || e['student_id'] || e.studentId,
                courseCode: e.course_code || e['course_code'] || e['รหัสวิชา'] || e.courseCode,
                courseName: e.course_name || e['course_name'],
                instructor: e.instructor || e['instructor'],
                scores: e.scores || e['scores'] || '{}',
                comment: e.comment || e['comment'] || '',
                skipped: e.skipped === 'true' || e.skipped === true,
                date: e.date || e['date'] || ''
            }));
        }

        // Load evaluation questions (per-course)
        if (evalQuestionsData && evalQuestionsData.length > 0) {
            MOCK.evalQuestions = evalQuestionsData;
        }

        // Load course-instructor mapping
        if (courseInstructorsData && courseInstructorsData.length > 0) {
            MOCK.courseInstructors = courseInstructorsData;
        }

        // Load instructor evaluation questions
        if (evalInstructorQuestionsData && evalInstructorQuestionsData.length > 0) {
            MOCK.evalInstructorQuestions = evalInstructorQuestionsData;
        }

        if (documentsData && documentsData.length > 0) {
            MOCK.documents = documentsData.map(d => {
                const sId = String(d['รหัสนักศึกษา'] || d['รหัสประจำตัว'] || d.studentId || d.id || '').trim();
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

            // Populate studentDocuments if student is logged in
            if (window.currentUserRole === 'student' && window.currentUserData) {
                const sId = String(window.currentUserData.username || window.currentUserData.id || '').trim();
                MOCK.studentDocuments = MOCK.documents
                    .filter(d => String(d.studentId || '').trim() === sId)
                    .map(d => ({
                        id: d.id,
                        formName: d.documentType,
                        submitDate: d.date,
                        lastUpdate: d.date,
                        status: d.status,
                        attachment: d.fileName,
                        fileUrl: d.fileUrl,
                        signedFileUrl: d.signedFileUrl,
                        note: d.note
                    }));
            }

            // Sync for Admin view
            MOCK.adminDocuments = MOCK.documents.map((d) => {
                let displayDate = String(d.date || '-');
                try {
                    const dateObj = new Date(d.date);
                    if (!isNaN(dateObj.getTime())) {
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        let year = dateObj.getFullYear();
                        if (year < 2400) year += 543;
                        const hours = String(dateObj.getHours()).padStart(2, '0');
                        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                        displayDate = `${day}/${month}/${year} ${hours}:${minutes} น.`;
                    }
                } catch (e) {}
                
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
 
        // Sync Exam Committees
        if (examCommitteesData && examCommitteesData.length > 0) {
            const grouped = {};
            examCommitteesData.forEach(m => {
                const eId = String(m.ExamID || m['ExamID'] || '').trim();
                const sId = String(m.StudentID || m['StudentID'] || '').trim();
                if (!eId) return;

                if (!grouped[eId]) {
                    const examInfo = (examsData || []).find(ex => String(ex.id).trim() === eId);
                    const student = (studentsData || []).find(s => String(s['รหัสนักศึกษา'] || s.studentId || '').trim() === sId);
                    
                    grouped[eId] = {
                        id: eId,
                        studentId: sId,
                        type: examInfo ? (examInfo.exam_type || 'สอบวิทยานิพนธ์') : 'สอบวิทยานิพนธ์',
                        status: examInfo ? (examInfo.status || 'approved') : 'approved',
                        date: examInfo ? (examInfo.date || '-') : '-',
                        thesisTitle: student ? (student['หัวข้อวิทยานิพนธ์'] || '-') : '-',
                        members: []
                    };
                }
                grouped[eId].members.push({
                    name: (m.Prefix || '') + (m.FirstName || '') + ' ' + (m.LastName || ''),
                    role: m.Role || 'กรรมการ',
                    position: m.Position || '-',
                    affiliation: m.Affiliation || '-'
                });
            });
            MOCK.examCommittees = Object.values(grouped);
            console.log('Exam Committees loaded:', MOCK.examCommittees);
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
                const totalGPA = studentsWithGPA.reduce((acc, s) => acc + parseFloat(s.gpa || 0), 0);
                MOCK.dashboardStats.avgGPA = parseFloat((totalGPA / studentsWithGPA.length).toFixed(2));
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

        // Set sync flags to prevent redundant per-page syncs
        MOCK.adminDocsSyncDone = true;
        MOCK.studentDocumentsSyncDone = true;
        MOCK.studentExamsSyncDone = true;
        MOCK.studentGradesSyncDone = true;
        MOCK.studentPaymentsSyncDone = true;

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

window.syncActiveStudentData = async function () {
    // Refresh student data from Google Sheets
    showApiLoading('กำลังอัปเดตข้อมูล...');
    try {
        const [enrollments, payments, documents, exams] = await Promise.all([
            fetchData('getEnrollments'),
            fetchData('getPayments'),
            fetchData('getDocuments'),
            fetchData('getExams')
        ]);

        // Global Update
        if (exams) MOCK.allExams = exams;

        if (!MOCK.student) return;

        const sId = String(MOCK.student.studentId || MOCK.student.id || '').trim();

        // 1. Sync Grades
        const studentEnrollments = (enrollments || []).filter(e => {
            const rowSId = String(e['รหัสนักศึกษา'] || e['student_id'] || e.studentId || '').trim();
            return rowSId === sId && sId !== '';
        });
        
        console.log(`[syncActiveStudentData] Found ${studentEnrollments.length} enrollments for student ${sId}`);

        const gradesMap = {};
        studentEnrollments.forEach(e => {
            const year = parseInt(e['ปีการศึกษา'] || e['academic_year'] || e.academicYear || '0');
            const sem = parseInt(e['ภาคเรียน'] || e['semester'] || '0');
            const semKey = `${year}_${sem}`;
            const semName = `ภาคเรียนที่ ${sem}/${year}`;

            const cGrade = String(e['เกรด'] || e['grade'] || '').trim();
            const creditsRaw = String(e['หน่วยกิต'] || e['credits'] || '0').trim();
            const cCredits = parseInt(creditsRaw.split('(')[0]) || 0;

            let point = 0;
            const g = cGrade.toUpperCase();
            if (g === 'A') point = 4.0;
            else if (g === 'B+') point = 3.5;
            else if (g === 'B') point = 3.0;
            else if (g === 'C+') point = 2.5;
            else if (g === 'C') point = 2.0;
            else if (g === 'D+') point = 1.5;
            else if (g === 'D') point = 1.0;
            else if (g === 'F') point = 0.0;

            if (!gradesMap[semKey]) {
                gradesMap[semKey] = { 
                    semester: semName, 
                    year: year,
                    term: sem,
                    totalCredits: 0, 
                    gpaCredits: 0, 
                    gpaPoints: 0, 
                    courses: [] 
                };
            }

            let courseName = e['course_name'] || e['ชื่อวิชา'] || '';
            const courseCode = String(e['course_code'] || e['รหัสวิชา'] || '-').trim();
            
            // Critical Fix: If course name is missing in enrollment, look it up in the Master Course list
            if (!courseName || courseName === '-') {
                const masterCourse = (MOCK.courses || []).find(c => String(c.code || c.courseCode || c['รหัสวิชา'] || '').trim() === courseCode);
                if (masterCourse) {
                    courseName = masterCourse.name || masterCourse['ชื่อวิชา'] || '';
                }
            }
            
            // Fallback to '-' if still empty
            if (!courseName) courseName = '-';
            
            gradesMap[semKey].courses.push({
                code: courseCode,
                name: courseName,
                credits: cCredits,
                creditsDisplay: creditsRaw,
                grade: cGrade,
                point: point
            });

            const isThesis = String(courseName).includes('วิทยานิพนธ์') || 
                             String(courseName).toLowerCase().includes('thesis') ||
                             String(courseCode).startsWith('1005002') || 
                             String(courseCode).startsWith('1005003') ||
                             String(courseCode).startsWith('1005004');
            
            const isNonGPA = ['P', 'S', 'U', 'W', 'I'].includes(String(cGrade).toUpperCase());

            // All credits count toward total (including Thesis)
            gradesMap[semKey].totalCredits += cCredits;
            if (!isThesis && !isNonGPA) {
                gradesMap[semKey].gpaCredits += cCredits;
                gradesMap[semKey].gpaPoints += (point * cCredits);
            }
        });

        MOCK.grades = Object.values(gradesMap)
            .sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return a.term - b.term;
            })
            .map(g => ({
                semester: g.semester,
                year: g.year,
                term: g.term,
                totalCredits: g.totalCredits,
                gpa: g.gpaCredits > 0 ? (g.gpaPoints / g.gpaCredits) : 0,
                courses: g.courses
            }));

        // Update student object stats
        const allCourses = MOCK.grades.flatMap(g => g.courses);
        MOCK.student.totalCredits = allCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
        
        // Filter for aggregate GPA calculation
        const gpaCourses = allCourses.filter(c => {
            const isThesis = (c.name || '').includes('วิทยานิพนธ์') || (c.name || '').toLowerCase().includes('thesis');
            const isNonGPA = ['P', 'S', 'U', 'W', 'I'].includes(String(c.grade || '').toUpperCase());
            return !isThesis && !isNonGPA;
        });
        
        const aggregateGPACredits = gpaCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
        const aggregateGPAPoints = gpaCourses.reduce((sum, c) => sum + ((c.point || 0) * (c.credits || 0)), 0);
        
        MOCK.student.gpa = aggregateGPACredits > 0 ? (aggregateGPAPoints / aggregateGPACredits) : 0;
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
                .filter(d => {
                    const dSId = String(d['รหัสนักศึกษา'] || d['studentId'] || d.student_id || '').trim();
                    return dSId === sId && sId !== '';
                })
                .map((d, index) => ({
                    id: d['รหัสติดตาม'] || d['id'] || ('DOC-S' + (1000 + index)),
                    formName: d['ประเภทเอกสาร'] || d.documentType || 'คำร้องทั่วไป',
                    submitDate: d['วันที่ส่ง'] || d.date || '-',
                    lastUpdate: d['วันที่ส่ง'] || d.date || '-',
                    status: d['สถานะ'] || d.status || 'รอตรวจสอบ',
                    attachment: d['ชื่อไฟล์'] || d.fileName || '-',
                    fileUrl: d['ลิงก์เอกสาร'] || d.fileUrl || '',
                    signedFileUrl: d['ลิงก์เอกสารที่ลงนาม'] || d.signedFileUrl || '',
                    note: d['หมายเหตุ'] || d.note || ''
                }));
        }

        // 4. Sync Exams
        if (exams && exams.length > 0) {
            MOCK.studentExams = exams.filter(ex => String(ex.student_id || '').trim() === sId);
            MOCK.student.exams = MOCK.studentExams;
        }
    } catch (err) {
        console.error('Sync student data failed:', err);
    } finally {
        hideApiLoading();
        renderPage();
    }
};

window.refreshAllData = async function() {
    showApiLoading('กำลังอัปเดตข้อมูลทั้งหมดจากเซิร์ฟเวอร์...');
    try {
        await bootApp();
        alert('อัปเดตข้อมูลล่าสุดเรียบร้อยแล้ว');
    } catch (err) {
        console.error('Refresh All Data failed:', err);
        alert('ไม่สามารถอัปเดตข้อมูลได้: ' + err.message);
    } finally {
        hideApiLoading();
    }
};

bootApp();
