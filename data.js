// ============================
// Data Model & State Management
// ============================

const MOCK = {
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
        { Role: 'admin', 'nav-dashboard': 'YES', 'nav-student-profile': 'YES', 'nav-teacher-profile': 'YES', 'nav-special-lecturers': 'YES', 'nav-alumni': 'YES', 'nav-new-registration': 'YES', 'nav-teacher-registration': 'YES', 'nav-courses': 'YES', 'nav-study-plan': 'YES', 'nav-grades': 'YES', 'nav-schedule': 'YES', 'nav-eval-course': 'YES', 'nav-eval-instructor': 'YES', 'nav-transcript': 'YES', 'nav-exams': 'YES', 'nav-graduation': 'YES', 'nav-thesis-advisor': 'YES', 'nav-thesis-topic': 'YES', 'nav-academic-advisor': 'YES', 'nav-exam-committee': 'YES', 'nav-payments': 'YES', 'nav-petitions-student': 'YES', 'nav-documents-status': 'YES', 'nav-documents-admin': 'YES', 'nav-manage-evals': 'YES', 'nav-eval-reports': 'YES', 'nav-calendar': 'YES', 'nav-announcements': 'YES', 'nav-settings': 'YES', 'nav-user-management': 'YES', 'nav-admission': 'YES' },
        { Role: 'teacher', 'nav-dashboard': 'YES', 'nav-student-profile': 'YES', 'nav-teacher-profile': 'YES', 'nav-special-lecturers': 'YES', 'nav-alumni': 'YES', 'nav-new-registration': 'YES', 'nav-teacher-registration': 'YES', 'nav-courses': 'YES', 'nav-study-plan': 'YES', 'nav-grades': 'YES', 'nav-schedule': 'YES', 'nav-eval-course': 'YES', 'nav-eval-instructor': 'YES', 'nav-transcript': 'YES', 'nav-exams': 'YES', 'nav-graduation': 'YES', 'nav-thesis-advisor': 'YES', 'nav-thesis-topic': 'YES', 'nav-academic-advisor': 'YES', 'nav-exam-committee': 'YES', 'nav-payments': 'YES', 'nav-petitions-student': 'YES', 'nav-documents-status': 'YES', 'nav-documents-admin': 'YES', 'nav-manage-evals': 'YES', 'nav-eval-reports': 'YES', 'nav-calendar': 'YES', 'nav-announcements': 'YES', 'nav-settings': 'YES', 'nav-user-management': 'NO', 'nav-admission': 'NO' },
        { Role: 'student', 'nav-dashboard': 'NO', 'nav-student-profile': 'YES', 'nav-teacher-profile': 'NO', 'nav-special-lecturers': 'NO', 'nav-alumni': 'NO', 'nav-new-registration': 'NO', 'nav-teacher-registration': 'NO', 'nav-courses': 'NO', 'nav-study-plan': 'YES', 'nav-grades': 'YES', 'nav-schedule': 'YES', 'nav-eval-course': 'YES', 'nav-eval-instructor': 'YES', 'nav-transcript': 'YES', 'nav-exams': 'YES', 'nav-graduation': 'YES', 'nav-thesis-advisor': 'YES', 'nav-thesis-topic': 'YES', 'nav-academic-advisor': 'YES', 'nav-exam-committee': 'YES', 'nav-payments': 'YES', 'nav-petitions-student': 'YES', 'nav-documents-status': 'YES', 'nav-documents-admin': 'NO', 'nav-manage-evals': 'NO', 'nav-eval-reports': 'NO', 'nav-calendar': 'YES', 'nav-announcements': 'YES', 'nav-settings': 'YES', 'nav-user-management': 'NO', 'nav-admission': 'NO' }
    ],
    
    // รายชื่อผู้สมัคร (Mock สำหรับ Dev)
    applicants: [
        { ApplicationID: 'APP-1700000001', Status: 'Pending', Date: '2026-03-20', Prefix: 'นางสาว', FirstName: 'นภา', LastName: 'สดใส', FirstNameEn: 'Napha', LastNameEn: 'Sodsai', IdCard: '1-1234-56789-01-2', Dob: '1998-05-12', Gender: 'หญิง', Email: 'napha@email.com', Phone: '081-111-2222', Program: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต', Major: 'การพยาบาลเด็ก', PrevSchool: 'ม.เชียงใหม่', PrevMajor: 'พยาบาลศาสตร์', PrevGPA: '3.65', FundingType: 'ทุนส่วนตัว' },
        { ApplicationID: 'APP-1700000002', Status: 'Reviewing', Date: '2026-03-21', Prefix: 'นาย', FirstName: 'สมชาย', LastName: 'หมายคง', FirstNameEn: 'Somchai', LastNameEn: 'Maikhong', IdCard: '1-2222-33333-44-5', Dob: '1995-12-05', Gender: 'ชาย', Email: 'somchai@email.com', Phone: '082-333-4444', Program: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต', Major: 'การพยาบาลเวชปฏิบัติชุมชน', PrevSchool: 'ม.พะเยา', PrevMajor: 'พยาบาลศาสตร์', PrevGPA: '3.42', FundingType: 'ทุนต้นสังกัด' },
        { ApplicationID: 'APP-1700000003', Status: 'Accepted', Date: '2026-03-15', Prefix: 'นางสาว', FirstName: 'วันดี', LastName: 'มีสุข', FirstNameEn: 'Wandee', LastNameEn: 'Meesook', IdCard: '1-3333-44444-55-6', Dob: '1997-04-20', Gender: 'หญิง', Email: 'wandee@email.com', Phone: '083-444-5555', Program: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต', Major: 'การบริหารการพยาบาล', PrevSchool: 'ม.ขอนแก่น', PrevMajor: 'พยาบาลศาสตร์', PrevGPA: '3.80', FundingType: 'ทุนอื่นๆ' }
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
        items: []
    },

    // ค่าธรรมเนียม (จาก API)
    payments: [],

    // ปฏิทินการศึกษา
    calendarEvents: [],

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

    // แบบฟอร์มคำร้องออนไลน์ (Document Templates)
    documentTemplates: [
        { id: 'PI-GSR-01', name: 'PI-GSR-01 คำร้องทั่วไป', type: 'general' },
        { id: 'PI-GSR-02', name: 'PI-GSR-02 คำร้องขอผ่อนผันการชำระค่าธรรมเนียมการศึกษา', type: 'general' },
        { id: 'PI-GSR-03', name: 'PI-GSR-03 คำร้องขอเทียบโอนรายวิชา', type: 'general' },
        { id: 'PI-GSR-04', name: 'PI-GSR-04 คำร้องขอเพิ่ม/ ถอน/ ยกเลิกรายวิชาเรียน', type: 'general' },
        { id: 'PI-GSR-05', name: 'PI-GSR-05 คำร้องขอขยายเวลาการศึกษา', type: 'general' },
        { id: 'PI-GSR-06', name: 'PI-GSR-06 คำร้องขอลาพักการศึกษา', type: 'leave' },
        { id: 'PI-GSR-07', name: 'PI-GSR-07 คำร้องขอรักษาสภาพการเป็นนักศึกษา', type: 'general' },
        { id: 'PI-GSR-08', name: 'PI-GSR-08 คำร้องขอลาออก', type: 'leave' },
        { id: 'PI-GSR-09', name: 'PI-GSR-09 คำร้องขอกลับเข้าเป็นนักศึกษา', type: 'general' },
        { id: 'PI-GSR-10', name: 'PI-GSR-10 คำร้องขอสำเร็จการศึกษา', type: 'general' },
        { id: 'PI-GST-01', name: 'PI-GST-01 แบบขออนุมัติแต่งตั้งอาจารย์ที่ปรึกษาวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-02', name: 'PI-GST-02 แบบขออนุมัติหัวข้อวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-03', name: 'PI-GST-03 แบบตรวจสอบโครงร่างวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-04', name: 'PI-GST-04 แบบขอตรวจการคัดลอกผลงาน (Plagiarism)', type: 'thesis' },
        { id: 'PI-GST-05', name: 'PI-GST-05 รายงานต้นฉบับแสดงผลการตรวจสอบการคัดลอกผลงาน (Originality Report) จากเล่มโครงร่างวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-06', name: 'PI-GST-06 แบบขออนุมัติสอบโครงร่างวิทยานิพนธ์และแต่งตั้งคณะกรรมการสอบ', type: 'exam' },
        { id: 'PI-GST-07', name: 'PI-GST-07 แบบประเมินผลการสอบโครงร่างวิทยานิพนธ์', type: 'exam' },
        { id: 'PI-GST-08', name: 'PI-GST-08 แบบแจ้งผลการสอบโครงร่างวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-09', name: 'PI-GST-09 แบบรายงานแก้ไขและอนุมัติโครงร่างวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-10', name: 'PI-GST-10 แบบขอหนังสือเชิญผู้เชี่ยวชาญพิจารณาเครื่องมือการวิจัย', type: 'thesis' },
        { id: 'PI-GST-11', name: 'PI-GST-11 แบบขอหนังสือลงพื้นที่เพื่อเก็บข้อมูลการวิจัย', type: 'thesis' },
        { id: 'PI-GST-12', name: 'PI-GST-12 แบบขอหนังสือขออนุญาตใช้/ ดัดแปลงเครื่องมือวิจัย', type: 'thesis' },
        { id: 'PI-GST-13', name: 'PI-GST-13 แบบตรวจสอบวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-14', name: 'PI-GST-14 รายงานต้นฉบับแสดงผลการตรวจสอบการคัดลอกผลงาน (Originality Report) จากเล่มวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-15', name: 'PI-GST-15 แบบตรวจสอบคุณสมบัติของผู้ขอสอบวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-16', name: 'PI-GST-16 แบบขออนุมัติสอบวิทยานิพนธ์และแต่งตั้งคณะกรรมการสอบ', type: 'exam' },
        { id: 'PI-GST-17', name: 'PI-GST-17 แบบประเมินผลการสอบวิทยานิพนธ์', type: 'exam' },
        { id: 'PI-GST-18', name: 'PI-GST-18 แบบแจ้งผลการสอบวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-19', name: 'PI-GST-19 แบบสรุปการปรับปรุงแก้ไขวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-20', name: 'PI-GST-20 แบบรายงานการปรับปรุงแก้ไขวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-21', name: 'PI-GST-21 แบบขออนุมัติเปลี่ยนแปลงอาจารย์ที่ปรึกษาวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-22', name: 'PI-GST-22 แบบขออนุมัติเปลี่ยนแปลงคณะกรรมการสอบวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-23', name: 'PI-GST-23 แบบประเมินความก้าวหน้าการทำวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-24', name: 'PI-GST-24 แบบคำร้องขอขยายเวลาแก้ไขวิทยานิพนธ์', type: 'thesis' },
        { id: 'PI-GST-25', name: 'PI-GST-25 แบบหนังสือยินยอมมอบลิขสิทธิ์', type: 'thesis' },
        { id: 'PI-GST-26', name: 'PI-GST-26 แบบขอส่งวิทยานิพนธ์ฉบับสมบูรณ์', type: 'thesis' },
        { id: 'PI-GST-27', name: 'PI-GST-27 แบบข้อมูลการเผยแพร่ผลงานวิทยานิพนธ์', type: 'thesis' }
    ],

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
    thesisTopicHistory: []
};
