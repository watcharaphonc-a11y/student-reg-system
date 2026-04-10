// ============================
// Data Model & State Management
// ============================

const MOCK = {
    // ===== Global Active Semester =====
    activeYear: localStorage.getItem('activeYear') || '2568',
    activeSemester: localStorage.getItem('activeSemester') || 'ภาคฤดูร้อน',
    // Teaching Fees filter state (defaults to active semester on page load)
    selectedFeeYear: null,
    selectedFeeSemester: null,

    // ข้อมูลนักศึกษา (จาก API)
    student: null,
    students: [],

    // สถิติ Dashboard
    dashboardStats: {
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        pendingPayments: 0,
        avgGPA: 0,
    },
    permissions: [
        { Role: 'admin', 'nav-dashboard': 'YES', 'nav-student-profile': 'YES', 'nav-teacher-profile': 'YES', 'nav-special-lecturers': 'YES', 'nav-alumni': 'YES', 'nav-new-registration': 'YES', 'nav-teacher-registration': 'YES', 'nav-courses': 'YES', 'nav-study-plan': 'YES', 'nav-grades': 'YES', 'nav-schedule': 'YES', 'nav-eval-course': 'YES', 'nav-eval-instructor': 'YES', 'nav-transcript': 'YES', 'nav-exams': 'YES', 'nav-graduation': 'YES', 'nav-thesis-advisor': 'YES', 'nav-thesis-topic': 'YES', 'nav-academic-advisor': 'YES', 'nav-exam-committee': 'YES', 'nav-payments': 'YES', 'nav-petitions-student': 'YES', 'nav-documents-status': 'YES', 'nav-documents-admin': 'YES', 'nav-manage-evals': 'YES', 'nav-eval-reports': 'YES', 'nav-calendar': 'YES', 'nav-announcements': 'YES', 'nav-settings': 'YES', 'nav-user-management': 'YES', 'nav-menu-permissions': 'YES', 'nav-admission': 'YES', 'nav-teaching-fees': 'YES' },
        { Role: 'staff', 'nav-dashboard': 'YES', 'nav-student-profile': 'YES', 'nav-teacher-profile': 'YES', 'nav-special-lecturers': 'YES', 'nav-alumni': 'YES', 'nav-new-registration': 'YES', 'nav-teacher-registration': 'YES', 'nav-courses': 'YES', 'nav-study-plan': 'YES', 'nav-grades': 'YES', 'nav-schedule': 'YES', 'nav-eval-course': 'YES', 'nav-eval-instructor': 'YES', 'nav-transcript': 'YES', 'nav-exams': 'YES', 'nav-graduation': 'YES', 'nav-thesis-advisor': 'YES', 'nav-thesis-topic': 'YES', 'nav-academic-advisor': 'YES', 'nav-exam-committee': 'YES', 'nav-payments': 'YES', 'nav-petitions-student': 'YES', 'nav-documents-status': 'YES', 'nav-documents-admin': 'YES', 'nav-manage-evals': 'YES', 'nav-eval-reports': 'YES', 'nav-calendar': 'YES', 'nav-announcements': 'YES', 'nav-settings': 'YES', 'nav-user-management': 'NO', 'nav-menu-permissions': 'NO', 'nav-admission': 'NO', 'nav-teaching-fees': 'YES' },
        { Role: 'student', 'nav-dashboard': 'NO', 'nav-student-profile': 'YES', 'nav-teacher-profile': 'NO', 'nav-special-lecturers': 'NO', 'nav-alumni': 'NO', 'nav-new-registration': 'NO', 'nav-teacher-registration': 'NO', 'nav-courses': 'NO', 'nav-study-plan': 'YES', 'nav-grades': 'YES', 'nav-schedule': 'YES', 'nav-eval-course': 'YES', 'nav-eval-instructor': 'YES', 'nav-transcript': 'YES', 'nav-exams': 'YES', 'nav-graduation': 'YES', 'nav-thesis-advisor': 'YES', 'nav-thesis-topic': 'YES', 'nav-academic-advisor': 'YES', 'nav-exam-committee': 'YES', 'nav-payments': 'YES', 'nav-petitions-student': 'YES', 'nav-documents-status': 'YES', 'nav-documents-admin': 'NO', 'nav-manage-evals': 'NO', 'nav-eval-reports': 'NO', 'nav-calendar': 'YES', 'nav-announcements': 'YES', 'nav-settings': 'YES', 'nav-user-management': 'NO', 'nav-menu-permissions': 'NO', 'nav-admission': 'NO', 'nav-teaching-fees': 'NO' }
    ],
    
    applicants: [
        { 
            ApplicationID: 'APP-1700000001', Status: 'Pending', Date: '2026-03-20', 
            Prefix: 'นางสาว', FirstName: 'นภา', LastName: 'สดใส', FirstNameEn: 'Napha', LastNameEn: 'Sodsai', 
            IdCard: '1-1234-56789-01-2', Dob: '1998-05-12', Age: '25', Religion: 'พุทธ', Nationality: 'ไทย',
            Email: 'napha@email.com', Phone: '081-111-2222', PhoneHome: '02-123-4567', PhoneWork: '',
            Program: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต', Major: 'การพยาบาลเด็ก', 
            Address: '123 ม.4 ต.ช้างเผือก อ.เมือง จ.เชียงใหม่',
            EducationHistory: JSON.stringify([{degree:'ป.ตรี', inst:'ม.เชียงใหม่', major:'พยาบาลศาสตร์', year:'2560', gpa:'3.65'}]),
            TrainingHistory: JSON.stringify([{name:'การช่วยฟื้นคืนชีพขั้นสูง', inst:'รพ.นครพิงค์', dur:'2 วัน', year:'2565'}]),
            WorkStatus: 'ทำงานแล้ว',
            WorkHistory: JSON.stringify([{inst:'รพ.มหาราชนครเชียงใหม่', pos:'พยาบาลวิชาชีพ', dur:'3 ปี', start:'2561', end:'2564'}]),
            CurrentWorkplace: 'โรงพยาบาลเชียงใหม่ราษฎร์',
            ResearchTopic: 'การศึกษาพฤติกรรมการดูแลสุขภาพของเด็กที่มีโรคประจำตัวเรื้อรังในเขตพื้นที่ภาคเหนือ',
            DocumentsLink: 'https://drive.google.com/drive/my-drive'
        },
        { 
            ApplicationID: 'APP-1700000002', Status: 'Interview', Date: '2026-03-21', 
            Prefix: 'นาย', FirstName: 'สมชาย', LastName: 'หมายคง', FirstNameEn: 'Somchai', LastNameEn: 'Maikhong', 
            IdCard: '1-2222-33333-44-5', Dob: '1995-12-05', Age: '28', Religion: 'พุทธ', Nationality: 'ไทย',
            Email: 'somchai@email.com', Phone: '082-333-4444', PhoneHome: '', PhoneWork: '038-777-888',
            Program: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต', Major: 'การพยาบาลเวชปฏิบัติชุมชน', 
            Address: '45/1 ถ.สุขุมวิท อ.เมือง จ.ชลบุรี',
            EducationHistory: JSON.stringify([{degree:'ป.ตรี', inst:'ม.บูรพา', major:'พยาบาลศาสตร์', year:'2558', gpa:'3.42'}]),
            TrainingHistory: '[]',
            WorkStatus: 'ทำงานแล้ว',
            WorkHistory: JSON.stringify([{inst:'สสจ.ชลบุรี', pos:'นักวิชาการสาธารณสุข', dur:'5 ปี', start:'2559', end:'2564'}]),
            CurrentWorkplace: 'สถานีอนามัยบางแสน',
            ResearchTopic: 'การพัฒนาระบบการดูแลผู้สูงอายุติดบ้านติดเตียงในระดับชุมชนเมือง',
            DocumentsLink: JSON.stringify({
                '_folder': 'https://drive.google.com/drive/my-drive',
                'ปพ.1': 'https://drive.google.com/drive/my-drive',
                'สำเนาบัตรประชาชน': 'https://drive.google.com/drive/my-drive'
            })
        }
    ],

    // สาขาวิชา (Programs/Majors) - Keep for form rendering
    programs: [
        { name: 'การพยาบาลผู้ใหญ่และผู้สูงอายุ' },
        { name: 'การพยาบาลเด็ก' },
        { name: 'การผดุงครรภ์' },
        { name: 'การพยาบาลจิตเวชและสุขภาพจิต' },
        { name: 'การพยาบาลเวชปฏิบัติชุมชน' },
        { name: 'การบริหารทางการพยาบาล' }
    ],

    // รายวิชาทั้งหมด (จาก API)
    courses: [],

    // รายวิชาที่ลงทะเบียนแล้ว (จาก API)
    enrolledCourses: [],

    // ผลการเรียน (จาก API)
    grades: [],

    // ตารางเรียน 
    schedule: {
        timeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'],
        days: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'],
        items: [
            { day: 0, startSlot: 0, endSlot: 2, code: 'NSG601', name: 'Advanced Nursing Science', room: 'R401', color: 'blue', instructorId: 'teacher-01', instructorName: 'ผศ.ดร.พนา รัตน์' },
            { day: 1, startSlot: 4, endSlot: 7, code: 'NSG602', name: 'Nursing Research', room: 'R402', color: 'green', instructorId: 'teacher-02', instructorName: 'รศ.ดร.สมศรี ใจสว่าง' },
            { day: 2, startSlot: 0, endSlot: 3, code: 'NSG603', name: 'Clinical Pharmacology', room: 'R405', color: 'purple', instructorId: 'teacher-01', instructorName: 'ผศ.ดร.พนา รัตน์' },
            { day: 3, startSlot: 1, endSlot: 3, code: 'NSG604', name: 'Community Health', room: 'R101', color: 'orange', instructorId: 'teacher-03', instructorName: 'ดร.มานะ อดทน' }
        ]
    },

    // อัตราค่าสอนเริ่มต้น (ต่อชั่วโมง)
    teachingRateDefaults: [
        { type: 'internal_phd', label: 'อาจารย์ภายใน (ปริญญาเอก)', rate: 600 },
        { type: 'internal_master', label: 'อาจารย์ภายใน (ปริญญาโท)', rate: 450 },
        { type: 'external_specialist', label: 'อาจารย์พิเศษ/ผู้เชี่ยวชาญ', rate: 1000 },
    ],

    // ค่าธรรมเนียม (จาก API)
    payments: [],

    // ปฏิทินการศึกษา
    // ปฏิทินการศึกษา 2568
    calendarEvents: [
        // Semester 1/2568
        { date: '2025-06-02', title: 'ชำระค่าลงทะเบียน (65-67)', type: 'register', cohort: '65,66,67' },
        { date: '2025-06-15', title: 'วันสุดท้ายชำระค่าลงทะเบียน (65-67)', type: 'register', cohort: '65,66,67' },
        { date: '2025-02-01', title: 'ชำระค่าลงทะเบียน (68) รอบ 1', type: 'register', cohort: '68' },
        { date: '2025-02-12', title: 'วันสุดท้ายชำระค่าลงทะเบียน (68) รอบ 1', type: 'register', cohort: '68' },
        { date: '2025-05-05', title: 'ชำระค่าลงทะเบียน (68) รอบ 2', type: 'register', cohort: '68' },
        { date: '2025-05-17', title: 'วันสุดท้ายชำระค่าลงทะเบียน (68) รอบ 2', type: 'register', cohort: '68' },
        
        { date: '2025-05-26', title: 'Research Camp', type: 'activity', cohort: '65,66,67' },
        { date: '2025-05-28', title: 'Research Camp (จบ)', type: 'activity', cohort: '65,66,67' },
        
        { date: '2025-05-31', title: 'สอบประมวลความรู้ รอบ 1', type: 'exam', cohort: '67' },
        { date: '2025-06-01', title: 'สอบประมวลความรู้ (จบ)', type: 'exam', cohort: '67' },
        
        { date: '2025-06-07', title: 'ปฐมนิเทศ/เตรียมความพร้อม (68)', type: 'activity', cohort: '67,68' },
        { date: '2025-06-08', title: 'ปฐมนิเทศ (68) จบ', type: 'activity', cohort: '67,68' },
        
        { date: '2025-06-20', title: 'เปิดภาคการศึกษาที่ 1/2568', type: 'activity', cohort: 'all' },
        
        { date: '2025-06-21', title: 'นำเสนอความก้าวหน้า Draft (65)', type: 'thesis', cohort: '65' },
        { date: '2025-06-22', title: 'นำเสนอความก้าวหน้า Draft (65) จบ', type: 'thesis', cohort: '65' },
        { date: '2025-06-27', title: 'นำเสนอความก้าวหน้า Draft (66)', type: 'thesis', cohort: '66' },
        { date: '2025-06-28', title: 'นำเสนอความก้าวหน้า Draft (66) จบ', type: 'thesis', cohort: '66' },
        { date: '2025-06-29', title: 'นำเสนอความก้าวหน้า Draft (67)', type: 'thesis', cohort: '67' },
        { date: '2025-06-30', title: 'นำเสนอความก้าวหน้า Draft (67) จบ', type: 'thesis', cohort: '67' },
        
        { date: '2025-07-24', title: 'พิธีไหว้ครู', type: 'activity', cohort: 'all' },
        { date: '2025-08-09', title: 'สอบภาษาอังกฤษสถาบัน ครั้งที่ 1', type: 'exam', cohort: 'all' },
        
        { date: '2025-09-26', title: 'นำเสนอความก้าวหน้า Final (65)', type: 'thesis', cohort: '65' },
        { date: '2025-09-28', title: 'นำเสนอความก้าวหน้า Final (65) จบ', type: 'thesis', cohort: '65' },
        { date: '2025-10-01', title: 'นำเสนอความก้าวหน้า Final (66)', type: 'thesis', cohort: '66' },
        { date: '2025-10-05', title: 'นำเสนอความก้าวหน้า Final (66) จบ', type: 'thesis', cohort: '66' },
        { date: '2025-10-10', title: 'นำเสนอความก้าวหน้า Final (67)', type: 'thesis', cohort: '67' },
        { date: '2025-10-12', title: 'นำเสนอความก้าวหน้า Final (67) จบ', type: 'thesis', cohort: '67' },
        
        { date: '2025-10-12', title: 'ปิดภาคการศึกษาที่ 1/2568', type: 'activity', cohort: 'all' },
        
        // Semester 2/2568
        { date: '2025-10-13', title: 'ชำระค่าลงทะเบียน/รักษาสภาพ ภาค 2', type: 'register', cohort: 'all' },
        { date: '2025-10-30', title: 'วันสุดท้ายชำระค่าลงทะเบียน ภาค 2', type: 'register', cohort: 'all' },
        { date: '2025-10-31', title: 'เปิดภาคการศึกษาที่ 2/2568', type: 'activity', cohort: 'all' },
        
        { date: '2025-11-01', title: 'นำเสนอความก้าวหน้า Draft (65) (2/68)', type: 'thesis', cohort: '65' },
        { date: '2025-11-02', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '65' },
        { date: '2025-11-08', title: 'นำเสนอความก้าวหน้า Draft (66) (2/68)', type: 'thesis', cohort: '66' },
        { date: '2025-11-09', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '66' },
        { date: '2025-11-15', title: 'นำเสนอความก้าวหน้า Draft (67) (2/68)', type: 'thesis', cohort: '67' },
        { date: '2025-11-16', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '67' },
        
        { date: '2025-11-24', title: 'สอบประมวลความรู้ ครั้งที่ 2', type: 'exam', cohort: 'all' },
        { date: '2025-12-27', title: 'สอบภาษาอังกฤษสถาบัน (ผู้จะสำเร็จ 68)', type: 'exam', cohort: 'all' },
        
        { date: '2026-02-06', title: 'นำเสนอความก้าวหน้า Final (65-66) (2/68)', type: 'thesis', cohort: '65,66' },
        { date: '2026-02-08', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '65,66' },
        { date: '2026-02-13', title: 'นำเสนอความก้าวหน้า Final (67) (2/68)', type: 'thesis', cohort: '67' },
        { date: '2026-02-15', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '67' },
        
        { date: '2026-02-22', title: 'ปิดภาคการศึกษาที่ 2/2568', type: 'activity', cohort: 'all' },
        
        // Summer/2568
        { date: '2026-02-23', title: 'ชำระค่าลงทะเบียน/รักษาสภาพ (ฤดูร้อน)', type: 'register', cohort: 'all' },
        { date: '2026-03-12', title: 'วันสุดท้ายชำระค่าลงทะเบียน (ฤดูร้อน)', type: 'register', cohort: 'all' },
        { date: '2026-03-13', title: 'เปิดภาคการศึกษาฤดูร้อน/2568', type: 'activity', cohort: 'all' },
        { date: '2026-05-17', title: 'ปิดภาคการศึกษาฤดูร้อน/2568', type: 'activity', cohort: 'all' },
        
        // Vacation & Next Year
        { date: '2026-05-18', title: 'ปิดหลักสูตร/ปิดภาคเรียน (Vacation)', type: 'holiday', cohort: 'all' },
        { date: '2026-06-18', title: 'ปิดภาคเรียน (วันสุดท้าย)', type: 'holiday', cohort: 'all' },
        { date: '2026-05-22', title: 'Research Camp (2568)', type: 'activity', cohort: 'all' },
        { date: '2026-05-24', title: 'Research Camp (จบ)', type: 'activity', cohort: 'all' },
        { date: '2026-05-31', title: 'สอบประมวลความรู้ (จบ)', type: 'exam', cohort: 'all' },
        { date: '2026-06-19', title: 'เปิดภาคการศึกษาที่ 1/2569', type: 'activity', cohort: 'all' },

        // Semester 1/2569 (2026 CE)
        { date: '2026-06-01', title: 'ชำระค่าลงทะเบียน (65-68)', type: 'register', cohort: '65,66,67,68' },
        { date: '2026-06-18', title: 'วันสุดท้ายชำระค่าลงทะเบียน (65-68)', type: 'register', cohort: '65,66,67,68' },
        
        { date: '2026-05-22', title: 'Research Camp (Online)', type: 'activity', cohort: '65,66,67,68' },
        { date: '2026-05-24', title: 'Research Camp (จบ)', type: 'activity', cohort: '65,66,67,68' },
        
        { date: '2026-05-30', title: 'สอบประมวลความรู้', type: 'exam', cohort: 'all' },
        { date: '2026-05-31', title: 'สอบประมวลความรู้ (จบ)', type: 'exam', cohort: 'all' },
        
        { date: '2026-06-13', title: 'รายงานตัว/ปฐมนิเทศ (69)', type: 'activity', cohort: '69' },
        { date: '2026-06-14', title: 'รายงานตัว/ปฐมนิเทศ (69) จบ', type: 'activity', cohort: '69' },
        
        { date: '2026-06-19', title: 'เปิดภาคการศึกษาที่ 1/2569', type: 'activity', cohort: 'all' },
        
        { date: '2026-06-20', title: 'นำเสนอความก้าวหน้า Draft (65,68)', type: 'thesis', cohort: '65,68' },
        { date: '2026-06-21', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '65,68' },
        { date: '2026-06-27', title: 'นำเสนอความก้าวหน้า Draft (66)', type: 'thesis', cohort: '66' },
        { date: '2026-06-28', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '66' },
        { date: '2026-07-04', title: 'นำเสนอความก้าวหน้า Draft (67)', type: 'thesis', cohort: '67' },
        { date: '2026-07-05', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '67' },
        
        { date: '2026-07-11', title: 'สอบหัวข้อวิทยานิพนธ์ (68)', type: 'thesis', cohort: '68' },
        { date: '2026-07-12', title: 'สอบหัวข้อวิทยานิพนธ์ (68) จบ', type: 'thesis', cohort: '68' },
        
        { date: '2026-07-23', title: 'พิธีไหว้ครู (2569)', type: 'activity', cohort: 'all' },
        { date: '2026-08-15', title: 'สอบภาษาอังกฤษสถาบัน ครั้งที่ 1', type: 'exam', cohort: 'all' },
        { date: '2026-08-16', title: 'สอบภาษาอังกฤษสถาบัน (จบ)', type: 'exam', cohort: 'all' },
        
        { date: '2026-09-02', title: 'นำเสนอความก้าวหน้า Final (65,68)', type: 'thesis', cohort: '65,68' },
        { date: '2026-09-03', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '65,68' },
        { date: '2026-10-10', title: 'นำเสนอความก้าวหน้า Final (66)', type: 'thesis', cohort: '66' },
        { date: '2026-10-11', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '66' },
        { date: '2026-10-17', title: 'นำเสนอความก้าวหน้า Final (67)', type: 'thesis', cohort: '67' },
        { date: '2026-10-18', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '67' },
        
        { date: '2026-10-18', title: 'ปิดภาคการศึกษาที่ 1/2569', type: 'activity', cohort: 'all' },
        
        // Semester 2/2569
        { date: '2026-10-19', title: 'ชำระค่าลงทะเบียน/รักษาสภาพ ภาค 2', type: 'register', cohort: 'all' },
        { date: '2026-10-30', title: 'วันสุดท้ายชำระค่าลงทะเบียน ภาค 2', type: 'register', cohort: 'all' },
        { date: '2026-10-31', title: 'เปิดภาคการศึกษาที่ 2/2569', type: 'activity', cohort: 'all' },
        
        { date: '2026-11-01', title: 'นำเสนอความก้าวหน้า Draft (65,68) (2/69)', type: 'thesis', cohort: '65,68' },
        { date: '2026-11-02', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '65,68' },
        { date: '2026-11-08', title: 'นำเสนอความก้าวหน้า Draft (66) (2/69)', type: 'thesis', cohort: '66' },
        { date: '2026-11-09', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '66' },
        { date: '2026-11-22', title: 'นำเสนอความก้าวหน้า Draft (67) (2/69)', type: 'thesis', cohort: '67' },
        { date: '2026-11-23', title: 'นำเสนอความก้าวหน้า (จบ)', type: 'thesis', cohort: '67' },
        
        { date: '2026-12-26', title: 'สอบภาษาอังกฤษสถาบัน ครั้งที่ 2', type: 'exam', cohort: 'all' },
        
        { date: '2027-02-21', title: 'ปิดภาคการศึกษาที่ 2/2569', type: 'activity', cohort: 'all' },
        
        // Summer/2569 (2027 CE)
        { date: '2027-02-22', title: 'ชำระค่าลงทะเบียน/รักษาสภาพ (ฤดูร้อน)', type: 'register', cohort: 'all' },
        { date: '2027-03-14', title: 'วันสุดท้ายชำระค่าลงทะเบียน (ฤดูร้อน)', type: 'register', cohort: 'all' },
        { date: '2027-03-15', title: 'เปิดภาคการศึกษาฤดูร้อน/2569', type: 'activity', cohort: 'all' },
        { date: '2027-05-16', title: 'ปิดภาคการศึกษาฤดูร้อน/2569', type: 'activity', cohort: 'all' },
    ],

    // ประกาศ
    announcements: [],

    // กิจกรรมล่าสุด
    recentActivities: [],

    // GPA History for chart
    gpaHistory: [],

    // แบบประเมินการสอน (จาก API)
    evaluations: [],

    // คำถามประเมินแยกตามวิชา (จาก API — EvalQuestions sheet)
    evalQuestions: [],

    // อาจารย์ที่สอนแต่ละวิชา (จาก API — CourseInstructors sheet)
    courseInstructors: [],

    // คำถามประเมินอาจารย์ (จาก API — EvalInstructorQuestions sheet)
    evalInstructorQuestions: [],

    // แผนการศึกษาคณะพยาบาลศาสตร์
    studyPlans: [
        {
            id: 'nursing-maternal',
            name: 'สาขาวิชาการผดุงครรภ์ (ป.โท)',
            icon: '👩‍👧‍👦',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นการวิเคราะห์ วิจัย และปฏิบัติการผดุงครรภ์ขั้นสูง ทั้งในภาวะปกติและเสี่ยงสูง',
            color: 'var(--accent-primary)',
            requiredCredits: 36
        },
        {
            id: 'nursing-pediatric',
            name: 'สาขาวิชาการพยาบาลเด็ก (ป.โท)',
            icon: '👶',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นการวิเคราะห์ ปฏิบัติการพยาบาลขั้นสูง และทำวิจัยเพื่อสุขภาพเด็ก',
            color: 'var(--success)',
            requiredCredits: 36
        },
        {
            id: 'nursing-adult',
            name: 'สาขาวิชาการพยาบาลผู้ใหญ่และผู้สูงอายุ (ป.โท)',
            icon: '🧓',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นการวิจัยเชิงประจักษ์ ปฏิบัติการพยาบาลขั้นสูงสำหรับผู้ใหญ่และผู้สูงอายุ',
            color: 'var(--warning)',
            requiredCredits: 36
        },
        {
            id: 'nursing-mental',
            name: 'สาขาวิชาการพยาบาลจิตเวชและสุขภาพจิต (ป.โท)',
            icon: '🧠',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นวิทยาเขตบำบัด จิตเภสัชวิทยา และการพยาบาลจิตเวชฉุกเฉิน',
            color: '#ec4899',
            requiredCredits: 36
        },
        {
            id: 'nursing-community',
            name: 'สาขาวิชาการพยาบาลเวชปฏิบัติชุมชน (ป.โท)',
            icon: '🏡',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นการวิเคราะห์และพัฒนาระบบสุขภาพชุมชน การรักษาโรคเบื้องต้น',
            color: '#10b981',
            requiredCredits: 36
        },
        {
            id: 'nursing-admin',
            name: 'สาขาวิชาการบริหารทางการพยาบาล (ป.โท)',
            icon: '🏢',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นสร้างภาวะผู้นำ การจัดการคุณภาพองค์กร และกลยุทธ์สาธารณสุข',
            color: '#8b5cf6',
            requiredCredits: 36
        }
    ],

    // รายการคำร้องขอสำเร็จการศึกษา
    graduationRequests: [],

    // แบบฟอร์มคำร้องออนไลน์ (Document Templates - loaded from API)
    documentTemplates: [],

    // เอกสารที่นักศึกษาส่ง (จาก API)
    studentDocuments: [],

    // เอกสารทั้งหมดที่รออนุมัติ (จาก API)
    adminDocuments: [],

    // ข้อมูลวิทยานิพนธ์ (จาก API)
    thesisInfo: {
        title: '-',
        titleEn: '-',
        status: '-'
    },

    // อาจารย์ที่ปรึกษาวิทยานิพนธ์ (จาก API)
    thesisAdvisors: [],

    // อาจารย์ที่ปรึกษาด้านวิชาการ (จาก API)
    academicAdvisors: [],

    // ตารางให้คำปรึกษา
    consultationSchedule: [],

    // คณะกรรมการสอบ (จาก API)
    examCommittees: [],

    // ประวัติการแจ้งหัวข้อวิทยานิพนธ์
    thesisTopicHistory: [],

    // ติดตามความก้าวหน้าวิทยานิพนธ์ (จาก API — ThesisProgress sheet)
    thesisProgress: []
};
