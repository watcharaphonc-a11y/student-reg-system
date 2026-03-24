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

    // สาขาวิชา (Programs/Majors) - Keep for form rendering
    programs: [
        { name: 'การพยาบาลผู้ใหญ่และผู้สูงอายุ' },
        { name: 'การพยาบาลเด็ก' },
        { name: 'การผดุงครรภ์' },
        { name: 'การพยาบาลจิตเวชและสุขภาพจิต' },
        { name: 'การพยาบาลอนามัยชุมชน' },
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

    // แผนการศึกษาคณะพยาบาลศาสตร์
    studyPlans: [
        {
            id: 'nursing-maternal',
            name: 'สาขาวิชาการผดุงครรภ์ (ป.โท)',
            icon: '👩‍👧‍👦',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นการวิเคราะห์ วิจัย และปฏิบัติการผดุงครรภ์ขั้นสูง ทั้งในภาวะปกติและเสี่ยงสูง',
            color: 'var(--accent-primary)'
        },
        {
            id: 'nursing-pediatric',
            name: 'สาขาวิชาการพยาบาลเด็ก (ป.โท)',
            icon: '👶',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นการวิเคราะห์ ปฏิบัติการพยาบาลขั้นสูง และทำวิจัยเพื่อสุขภาพเด็ก',
            color: 'var(--success)'
        },
        {
            id: 'nursing-adult',
            name: 'สาขาวิชาการพยาบาลผู้ใหญ่และผู้สูงอายุ (ป.โท)',
            icon: '🧓',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นการวิจัยเชิงประจักษ์ ปฏิบัติการพยาบาลขั้นสูงสำหรับผู้ใหญ่และผู้สูงอายุ',
            color: 'var(--warning)'
        },
        {
            id: 'nursing-mental',
            name: 'สาขาวิชาการพยาบาลจิตเวชและสุขภาพจิต (ป.โท)',
            icon: '🧠',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นวิทยาเขตบำบัด จิตเภสัชวิทยา และการพยาบาลจิตเวชฉุกเฉิน',
            color: 'var(--danger-color)'
        },
        {
            id: 'nursing-community',
            name: 'สาขาวิชาการพยาบาลเวชปฏิบัติชุมชน (ป.โท)',
            icon: '🏡',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นการวิเคราะห์และพัฒนาระบบสุขภาพชุมชน การรักษาโรคเบื้องต้น',
            color: '#10b981'
        },
        {
            id: 'nursing-admin',
            name: 'สาขาวิชาการบริหารทางการพยาบาล (ป.โท)',
            icon: '🏢',
            description: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต เน้นสร้างภาวะผู้นำ การจัดการคุณภาพองค์กร และกลยุทธ์สาธารณสุข',
            color: '#8b5cf6'
        }
    ],

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
    examCommittees: []
};
