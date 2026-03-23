// ============================
// Mock Data - ข้อมูลจำลอง
// ============================

const MOCK = {
    // ข้อมูลนักศึกษา
    student: {
        id: '6801012630',
        prefix: 'นางสาว',
        firstName: 'พิมพ์ใจ',
        lastName: 'รักดี',
        firstNameEn: 'Pimjai',
        lastNameEn: 'Rakdee',
        faculty: 'คณะพยาบาลศาสตร์ สถาบันพระบรมราชชนก',
        department: 'สาขาวิชาการพยาบาลจิตเวชและสุขภาพจิต',
        program: 'พยาบาลศาสตรมหาบัณฑิต (พย.ม.)',
        year: 1,
        status: 'กำลังศึกษา',
        admissionYear: 2568,
        advisor: 'รศ.ดร.สมศรี ใจสว่าง',
        email: 'pimjai.r@pi.ac.th',
        phone: '081-234-5678',
        dob: '15 มกราคม 2547',
        address: '123/45 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900',
        gpa: 3.45,
        totalCredits: 96,
        requiredCredits: 145,
        parentName: 'นายสมศักดิ์ สุขใจ',
        parentPhone: '089-876-5432',
    },

    // สถิติ Dashboard
    dashboardStats: {
        totalStudents: 12847,
        totalCourses: 342,
        pendingPayments: 15,
        avgGPA: 3.21,
    },

    // รายวิชาทั้งหมด
    courses: [
        { code: '01005000105', name: 'แนวคิดและทฤษฎีทางการพยาบาล', credits: 2, instructor: 'รศ.ดร.สมศรี ใจสว่าง', seats: 30, enrolled: 28, schedule: 'จ. 09:00-12:00', room: 'NB301', type: 'แกน', status: 'เปิด' },
        { code: '01005000106', name: 'ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมฯ', credits: 2, instructor: 'ผศ.ดร.วรินทร ทองดี', seats: 30, enrolled: 30, schedule: 'อ. 13:00-16:00', room: 'NB302', type: 'แกน', status: 'เต็ม' },
        { code: '01005000107', name: 'วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล', credits: 2, instructor: 'รศ.ดร.ปิยะดา สุขใจ', seats: 30, enrolled: 25, schedule: 'พ. 09:00-12:00', room: 'NB303', type: 'แกน', status: 'เปิด' },
        { code: '01005000108', name: 'สถิติประยุกต์ในการวิจัยทางการพยาบาล', credits: 2, instructor: 'อ.ดร.คำนวณ แม่นยำ', seats: 30, enrolled: 25, schedule: 'พฤ. 09:00-12:00', room: 'NB304', type: 'แกน', status: 'เปิด' },
        { code: '0100505101', name: 'การประเมินภาวะสุขภาพขั้นสูง', credits: 1, instructor: 'ผศ.พญ.มณีรัตน์ แสงทอง', seats: 30, enrolled: 30, schedule: 'ศ. 09:00-12:00', room: 'NB305', type: 'เฉพาะสาขา', status: 'เต็ม' },
        { code: '0100505102', name: 'จิตเภสัชวิทยา (Psychopharmacology)', credits: 2, instructor: 'อ.ดร.นพดล รักเรียน', seats: 30, enrolled: 20, schedule: 'พฤ. 13:00-16:00', room: 'NB306', type: 'เฉพาะสาขา', status: 'เปิด' },
    ],

    // รายวิชาที่ลงทะเบียนแล้ว
    enrolledCourses: [
        { code: '01005000105', name: 'แนวคิดและทฤษฎีทางการพยาบาล', credits: 2, instructor: 'รศ.ดร.สมศรี ใจสว่าง', schedule: 'จ. 09:00-12:00', room: 'NB301' },
        { code: '01005000106', name: 'ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมฯ', credits: 2, instructor: 'ผศ.ดร.วรินทร ทองดี', schedule: 'อ. 13:00-16:00', room: 'NB302' },
        { code: '01005000107', name: 'วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล', credits: 2, instructor: 'รศ.ดร.ปิยะดา สุขใจ', schedule: 'พ. 09:00-12:00', room: 'NB303' },
        { code: '01005000108', name: 'สถิติประยุกต์ในการวิจัยทางการพยาบาล', credits: 2, instructor: 'อ.ดร.คำนวณ แม่นยำ', schedule: 'พฤ. 09:00-12:00', room: 'NB304' },
        { code: '0100505101', name: 'การประเมินภาวะสุขภาพขั้นสูง', credits: 1, instructor: 'ผศ.พญ.มณีรัตน์ แสงทอง', schedule: 'ศ. 09:00-12:00', room: 'NB305' },
        { code: '0100505102', name: 'จิตเภสัชวิทยา (Psychopharmacology)', credits: 2, instructor: 'อ.ดร.นพดล รักเรียน', schedule: 'พฤ. 13:00-16:00', room: 'NB306' },
    ],

    // ผลการเรียน
    grades: [
        {
            semester: 'ภาคเรียนที่ 1/2567',
            courses: [
                { code: 'CPE201', name: 'การเขียนโปรแกรมเชิงวัตถุ', credits: 3, grade: 'A', point: 4.00 },
                { code: 'CPE202', name: 'สถาปัตยกรรมคอมพิวเตอร์', credits: 3, grade: 'B+', point: 3.50 },
                { code: 'CPE203', name: 'คณิตศาสตร์ไม่ต่อเนื่อง', credits: 3, grade: 'A', point: 4.00 },
                { code: 'GEN103', name: 'ทักษะภาษาไทย', credits: 3, grade: 'B', point: 3.00 },
                { code: 'GEN104', name: 'พลศึกษา', credits: 1, grade: 'A', point: 4.00 },
            ],
            gpa: 3.65,
            totalCredits: 13,
        },
        {
            semester: 'ภาคเรียนที่ 2/2567',
            courses: [
                { code: 'CPE204', name: 'การออกแบบวงจรดิจิทัล', credits: 3, grade: 'B+', point: 3.50 },
                { code: 'CPE205', name: 'ระบบฝังตัว', credits: 3, grade: 'B', point: 3.00 },
                { code: 'CPE206', name: 'การวิเคราะห์และออกแบบระบบ', credits: 3, grade: 'A', point: 4.00 },
                { code: 'MATH202', name: 'สมการเชิงอนุพันธ์', credits: 3, grade: 'B+', point: 3.50 },
                { code: 'GEN105', name: 'จิตวิทยาทั่วไป', credits: 3, grade: 'A', point: 4.00 },
            ],
            gpa: 3.60,
            totalCredits: 15,
        },
        {
            semester: 'ภาคเรียนที่ 1/2568',
            courses: [
                { code: 'CPE301', name: 'โครงสร้างข้อมูลและอัลกอริทึม', credits: 3, grade: 'A', point: 4.00 },
                { code: 'CPE302', name: 'ระบบปฏิบัติการ', credits: 3, grade: 'B+', point: 3.50 },
                { code: 'CPE303', name: 'เครือข่ายคอมพิวเตอร์', credits: 3, grade: null, point: null },
                { code: 'GEN201', name: 'ภาษาอังกฤษเพื่อการสื่อสาร', credits: 3, grade: null, point: null },
                { code: 'MATH301', name: 'สถิติวิศวกรรม', credits: 3, grade: null, point: null },
            ],
            gpa: null,
            totalCredits: 15,
        },
    ],

    // ตารางเรียน (แถว = เวลา, คอลัมน์ = วัน)
    schedule: {
        timeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'],
        days: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'],
        items: [
            { day: 0, startSlot: 1, endSlot: 3, code: '01005000105', name: 'แนวคิดและทฤษฎีฯ', room: 'NB301', color: 1 },
            { day: 1, startSlot: 5, endSlot: 7, code: '01005000106', name: 'ระบบสุขภาพ ภาวะผู้นำฯ', room: 'NB302', color: 2 },
            { day: 2, startSlot: 1, endSlot: 3, code: '01005000107', name: 'วิจัยเชิงประจักษ์ฯ', room: 'NB303', color: 3 },
            { day: 3, startSlot: 1, endSlot: 3, code: '01005000108', name: 'สถิติประยุกต์ฯ', room: 'NB304', color: 4 },
            { day: 4, startSlot: 1, endSlot: 3, code: '0100505101', name: 'ประเมินสุขภาพฯ', room: 'NB305', color: 5 },
            { day: 3, startSlot: 5, endSlot: 7, code: '0100505102', name: 'จิตเภสัชวิทยา', room: 'NB306', color: 6 },
        ]
    },

    // ค่าธรรมเนียม
    payments: [
        { id: 'PAY-2568-2-001', description: 'ค่าลงทะเบียนเรียน ภาค 2/2568', amount: 21500, dueDate: '15 ม.ค. 2569', status: 'ค้างชำระ', type: 'ค่าเทอม' },
        { id: 'PAY-2568-2-002', description: 'ค่าธรรมเนียมเทคโนโลยี', amount: 2500, dueDate: '15 ม.ค. 2569', status: 'ค้างชำระ', type: 'ค่าธรรมเนียม' },
        { id: 'PAY-2568-1-001', description: 'ค่าลงทะเบียนเรียน ภาค 1/2568', amount: 21500, paidDate: '5 ส.ค. 2568', status: 'ชำระแล้ว', type: 'ค่าเทอม' },
        { id: 'PAY-2568-1-002', description: 'ค่าธรรมเนียมเทคโนโลยี', amount: 2500, paidDate: '5 ส.ค. 2568', status: 'ชำระแล้ว', type: 'ค่าธรรมเนียม' },
        { id: 'PAY-2567-2-001', description: 'ค่าลงทะเบียนเรียน ภาค 2/2567', amount: 20000, paidDate: '10 ม.ค. 2568', status: 'ชำระแล้ว', type: 'ค่าเทอม' },
        { id: 'PAY-2567-1-001', description: 'ค่าลงทะเบียนเรียน ภาค 1/2567', amount: 20000, paidDate: '8 ส.ค. 2567', status: 'ชำระแล้ว', type: 'ค่าเทอม' },
    ],

    // ปฏิทินการศึกษา
    calendarEvents: [
        { date: '2025-06-20', title: 'เปิดภาคการศึกษาที่ 1/2568', type: 'register' },
        { date: '2025-07-24', title: 'พิธีไหว้ครู', type: 'activity' },
        { date: '2025-08-09', title: 'สอบภาษาอังกฤษของสถาบัน ครั้งที่ 1', type: 'exam' },
        { date: '2025-10-12', title: 'วันสุดท้ายภาคการศึกษาที่ 1/2568', type: 'register' },
        { date: '2025-10-31', title: 'เปิดภาคการศึกษาที่ 2/2568', type: 'register' },
        { date: '2025-11-29', title: 'สอบภาษาอังกฤษของสถาบัน ครั้งที่ 2', type: 'exam' },
        { date: '2026-02-26', title: 'วันสุดท้าย ภาคการศึกษาที่ 2/2568', type: 'register' },
        { date: '2026-03-13', title: 'เปิดเรียนภาคฤดูร้อน 2568', type: 'register' },
        { date: '2026-03-18', title: 'วันนี้', type: 'activity' },
        { date: '2026-05-17', title: 'วันสุดท้ายภาคการศึกษาฤดูร้อน 2568', type: 'register' },
        { date: '2026-06-13', title: 'นักศึกษาใหม่รายงานตัวฯ (รหัส 2569)', type: 'activity' },
        { date: '2026-06-19', title: 'เปิดภาคการศึกษาที่ 1/2569', type: 'register' },
        { date: '2026-07-23', title: 'พิธีไหว้ครู (ปีการศึกษา 2569)', type: 'activity' },
        { date: '2026-10-18', title: 'วันสุดท้ายภาคการศึกษาที่ 1/2569', type: 'register' },
        { date: '2026-10-31', title: 'เปิดภาคการศึกษาที่ 2/2569', type: 'register' },
        { date: '2027-02-28', title: 'วันสุดท้าย ภาคการศึกษาที่ 2/2569', type: 'register' },
        { date: '2027-03-19', title: 'เปิดเรียนภาคฤดูร้อน 2569', type: 'register' },
        { date: '2027-05-16', title: 'วันสุดท้ายภาคการศึกษาฤดูร้อน 2569', type: 'register' },
        { date: '2027-06-18', title: 'เปิดภาคการศึกษาที่ 1/2570', type: 'register' }
    ],

    // ประกาศ
    announcements: [
        { id: 1, title: 'กำหนดการลงทะเบียนเรียน ภาคเรียนที่ 2/2568', content: 'นักศึกษาสามารถลงทะเบียนเรียนผ่านระบบออนไลน์ได้ตั้งแต่วันที่ 20-28 กุมภาพันธ์ 2569', date: '15 ก.พ. 2569', type: 'สำคัญ', icon: '📋' },
        { id: 2, title: 'ประกาศผลการเรียน ภาคเรียนที่ 1/2568', content: 'ผลการเรียนภาคเรียนที่ 1/2568 จะประกาศในวันที่ 25 กุมภาพันธ์ 2569 ผ่านระบบทะเบียนออนไลน์', date: '20 ก.พ. 2569', type: 'ผลการเรียน', icon: '📊' },
        { id: 3, title: 'กำหนดการชำระค่าเทอม ภาคเรียนที่ 2/2568', content: 'กำหนดชำระค่าเทอมภายในวันที่ 15 มกราคม 2569 หากชำระล่าช้าจะต้องเสียค่าปรับ', date: '1 ม.ค. 2569', type: 'การเงิน', icon: '💰' },
        { id: 4, title: 'ทุนการศึกษาประจำปีการศึกษา 2568', content: 'เปิดรับสมัครทุนการศึกษาสำหรับนักศึกษาที่มีผลการเรียนดีเด่น GPA 3.50 ขึ้นไป สมัครได้ถึง 30 มีนาคม 2569', date: '1 มี.ค. 2569', type: 'ทุนการศึกษา', icon: '🎓' },
        { id: 5, title: 'กิจกรรมปฐมนิเทศนักศึกษาฝึกงาน', content: 'นักศึกษาชั้นปีที่ 3 ที่จะออกฝึกงานในภาคฤดูร้อน กรุณาเข้าร่วมปฐมนิเทศในวันที่ 20 มีนาคม 2569', date: '10 มี.ค. 2569', type: 'กิจกรรม', icon: '📢' },
        { id: 6, title: 'ปรับปรุงระบบทะเบียนออนไลน์', content: 'ระบบจะปิดปรับปรุงในวันที่ 25 มีนาคม 2569 เวลา 00:00-06:00 น.', date: '18 มี.ค. 2569', type: 'ระบบ', icon: '⚙️' },
    ],

    // กิจกรรมล่าสุด
    recentActivities: [
        { text: 'ลงทะเบียนเรียนวิชา CPE304 วิศวกรรมซอฟต์แวร์', time: '2 ชั่วโมงที่แล้ว', color: 'purple' },
        { text: 'ชำระค่าธรรมเนียมเทคโนโลยี ภาค 1/2568', time: '1 วันที่แล้ว', color: 'green' },
        { text: 'ตรวจสอบผลการเรียน ภาค 1/2568', time: '2 วันที่แล้ว', color: 'blue' },
        { text: 'อัปเดตข้อมูลที่อยู่ปัจจุบัน', time: '1 สัปดาห์ที่แล้ว', color: 'orange' },
        { text: 'ดาวน์โหลดใบแสดงผลการศึกษา', time: '2 สัปดาห์ที่แล้ว', color: 'purple' },
    ],

    // GPA per semester for chart
    gpaHistory: [
        { semester: '1/66', gpa: 3.20 },
        { semester: '2/66', gpa: 3.35 },
        { semester: '1/67', gpa: 3.65 },
        { semester: '2/67', gpa: 3.60 },
        { semester: '1/68', gpa: 3.45 },
    ],
    
    // แบบประเมินการสอน
    evaluations: [
        { courseCode: 'MATH301', score: 5, comment: 'อาจารย์ตั้งใจสอนมากครับ', date: '2026-03-10' }
    ],

    // แผนการศึกษาคณะพยาบาลศาสตร์ 6 สาขา
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

    // เอกสารที่นักศึกษาส่ง (Student Documents)
    studentDocuments: [
        { id: 'DOC-68001', formId: 'PI-GSR-01', formName: 'PI-GSR-01 คำร้องทั่วไป', status: 'อนุมัติแล้ว', submitDate: '15 ก.พ. 2568', lastUpdate: '17 ก.พ. 2568', attachment: null },
        { id: 'DOC-68054', formId: 'PI-GST-06', formName: 'PI-GST-06 แบบขออนุมัติสอบโครงร่างวิทยานิพนธ์และแต่งตั้งคณะกรรมการสอบ', status: 'กำลังดำเนินการ', submitDate: '18 มี.ค. 2568', lastUpdate: '18 มี.ค. 2568', attachment: 'proposal_draft.pdf' }
    ],

    // เอกสารทั้งหมดที่รออนุมัติ (Admin Documents)
    adminDocuments: [
        { id: 'DOC-68054', studentId: '6801012630', studentName: 'นางสาวพิมพ์ใจ รักดี', formName: 'PI-GST-06 แบบขออนุมัติสอบโครงร่างวิทยานิพนธ์และแต่งตั้งคณะกรรมการสอบ', status: 'รออาจารย์ที่ปรึกษาลงนาม', submitDate: '18 มี.ค. 2568', attachment: 'proposal_draft.pdf', nextStep: 'อาจารย์ที่ปรึกษาหลัก' },
        { id: 'DOC-68055', studentId: '6801012111', studentName: 'นายชายน้อย ใจบุญ', formName: 'PI-GSR-06 คำร้องขอลาพักการศึกษา', status: 'รอประธานหลักสูตรลงนาม', submitDate: '19 มี.ค. 2568', attachment: 'medical_certificate.pdf', nextStep: 'ประธานกรรมการบริหารหลักสูตร' }
    ]
};
