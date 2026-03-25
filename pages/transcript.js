// ============================
// Transcript Page
// ============================

function getPlanIdFromDept(deptName) {
    if (!deptName) return 'nursing-adult';
    if (deptName.includes('เด็ก')) return 'nursing-pediatric';
    if (deptName.includes('ชุมชน')) return 'nursing-community';
    if (deptName.includes('ผดุงครรภ์')) return 'nursing-maternal';
    if (deptName.includes('ผู้ใหญ่')) return 'nursing-adult';
    if (deptName.includes('บริหาร')) return 'nursing-admin';
    if (deptName.includes('จิตเวช')) return 'nursing-mental';
    return 'generic';
}

function getStudyPlanCoursesData(planId, admissionYear) {
    const is2565Cohort = String(admissionYear) === '2565';
    let mockPlanData = [];
    if (planId === 'nursing-pediatric') {
        mockPlanData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, courses: ['01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายฯ 2 (2-0-4)', '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ฯ 2 (2-0-4)', '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '01005030101 ประเมินภาวะสุขภาพเด็กขั้นสูง 2 (1-2-3)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, courses: ['01005030102 การพยาบาลเด็กกลุ่มเสี่ยงและภาวะเรื้อรัง 2 (2-0-4)', '01005030103 การพยาบาลเด็กระยะเฉียบพลันและวิกฤต 2 (2-0-4)', '01005030104 ปฏิบัติการพยาบาลเด็กกลุ่มเสี่ยงฯ 3 (0-9-3)', '010050xxxx วิชาเลือกเสรี 3 (3-0-6)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, courses: ['01005030105 ปฏิบัติการพยาบาลเด็กระยะเฉียบพลันฯ 3 (0-9-3)', '01005030106 สัมมนาทางการพยาบาลเด็ก 1 (0-2-1)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] },
            { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] }
        ];
    } else if (planId === 'nursing-community') {
        if (is2565Cohort) {
            mockPlanData = [
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 11, courses: ['01005000101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาลฯ 3 (3-0-6)', '01005000102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '0100505105 การประเมินสุขภาพขั้นสูงและเภสัชวิทยาสำหรับการรักษาโรคเบื้องต้น 2 (1-2-3)', '0100505106 การพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวฯ 2 (2-0-4)', '0100505107 การพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 2 (2-0-4)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 3', credits: 5, courses: ['01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100505109 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการฯ 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 8, courses: ['01005000103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000108 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวฯ 3 (0-9-3)', 'xxxxxxxxxxx วิชาเลือก 3 (3-0-6)'] },
                { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 6, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'] },
                { year: 3, sem: 1, title: 'ชั้นปีที่ 3 ภาคการศึกษาที่ 1', credits: 6, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'] }
            ];
        } else {
            mockPlanData = [
                { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 11, courses: ['01005000101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาลฯ 3 (3-0-6)', '01005000102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '0100505105 การประเมินสุขภาพขั้นสูงและเภสัชวิทยาสำหรับการรักษาโรคเบื้องต้น 2 (1-2-3)', '0100505106 การพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวฯ 2 (2-0-4)', '0100505107 การพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 2 (2-0-4)'] },
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 10, courses: ['01005000103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '01005000108 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวฯ 3 (0-9-3)', 'xxxxxxxxxxx วิชาเลือก 3 (3-0-6)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 3, courses: ['0100505109 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการฯ 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 6, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'] },
                { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 6, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'] }
            ];
        }
    } else if (planId === 'nursing-maternal') {
        mockPlanData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, courses: ['01005000101 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', '01005000102 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมฯ 2 (2-0-4)', '01005000103 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100502105 พยาธิสรีรวิทยาและเภสัชวิทยาทางการผดุงครรภ์ 2 (2-0-4)', '01005000116 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, courses: ['0100502106 การผดุงครรภ์ในระยะตั้งครรภ์และหลังคลอด 2 (2-0-4)', '0100502107 การผดุงครรภ์ในระยะคลอด 2 (2-0-4)', '0100502108 ปฏิบัติการผดุงครรภ์ในระยะตั้งครรภ์และหลังคลอด 3 (0-9-3)', '01005022xx วิชาเลือก 3 (3-0-6)', '01005000116 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, courses: ['0100502109 ปฏิบัติการผดุงครรภ์ในระยะคลอด 3 (0-9-3)', '0100502110 สัมมนาทางการผดุงครรภ์ 1 (0-2-1)', '01005000116 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, courses: ['01005000116 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] },
            { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, courses: ['01005000116 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] }
        ];
    } else if (planId === 'nursing-admin') {
        mockPlanData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, courses: ['01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมฯ 2 (2-0-4)', '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100508101 ภาวะผู้นำและการจัดการคุณภาพองค์กรสุขภาพ 2 (2-0-4)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, courses: ['0100508102 การจัดการและพัฒนาทรัพยากรในระบบสุขภาพฯ 2 (2-0-4)', '0100508103 การจัดการเชิงกลยุทธ์และการตัดสินใจฯ 2 (2-0-4)', '0100508104 ปฏิบัติการพัฒนาภาวะผู้นำ การจัดการคุณภาพและทรัพยากรสุขภาพ 3 (0-9-3)', '01005081xx วิชาเลือก 3 (3-0-6)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, courses: ['0100508105 ปฏิบัติการจัดการเชิงกลยุทธ์และการตัดสินใจฯ 3 (0-9-3)', '0100508106 สัมมนาประเด็นคัดสรรในการบริหารทางการพยาบาลฯ 1 (0-2-1)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] },
            { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] }
        ];
    } else if (planId === 'nursing-mental') {
        mockPlanData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 13, courses: ['01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมฯ 2 (2-0-4)', '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100505101 การประเมินภาวะสุขภาพขั้นสูง 1 (0-2-3)', '0100505102 จิตเภสัชวิทยา (Psychopharmacology) 2 (2-0-4)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, courses: ['0100505103 การส่งเสริมสุขภาพจิตและป้องกันการเจ็บป่วยทางจิตในระดับปฐมภูมิ 2 (2-0-4)', '0100505104 การพยาบาลจิตเวชเฉียบพลันและฉุกเฉิน ผู้ใช้ยาและสารเสพติด 2 (2-0-4)', '0100505105 ปฏิบัติการส่งเสริมสุขภาพจิตและป้องกันการเจ็บป่วยทางจิตในระดับปฐมภูมิ 3 (0-9-3)', '0100500xxx วิชาเลือก 3 (3-0-6)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 5, courses: ['0100505106 ปฏิบัติการพยาบาลจิตเวชเฉียบพลันและฉุกเฉิน ผู้ใช้ยาและสารเสพติด 2 (0-6-x)', '0100505107 สัมมนาการพยาบาลจิตเวชและสุขภาพจิต 1 (0-2-1)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] },
            { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] }
        ];
    } else if (planId === 'nursing-adult') {
        if (is2565Cohort) {
            mockPlanData = [
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 11, courses: ['01005000101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', '01005000102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '0100504105 พยาธิสรีรวิทยาและเภสัชวิทยาทางการพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)', '0100504106 การพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 3', credits: 5, courses: ['01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100504107 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 1 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 8, courses: ['01005000103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '010050xxxx การเรียนการสอนทางการพยาบาล/การวิจัยเชิงคุณภาพ 3 (3-0-6)', '0100504108 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 2 3 (0-9-3)'] },
                { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 6, courses: ['01005001217 วิทยานิพนธ์ 6 (0-18-6)'] },
                { year: 3, sem: 1, title: 'ชั้นปีที่ 3 ภาคการศึกษาที่ 1', credits: 6, courses: ['01005001217 วิทยานิพนธ์ 6 (0-18-6)'] }
            ];
        } else {
            mockPlanData = [
                { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 11, courses: ['01005000101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', '01005000102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '0100504105 พยาธิสรีรวิทยาและเภสัชวิทยาทางการพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)', '0100504106 การพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)'] },
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 10, courses: ['01005000103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100504107 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 1 3 (0-9-3)', 'xxxxxxxxx วิชาเลือก 3 (3-0-6)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 3, courses: ['0100504108 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 2 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1 และ 2', credits: 12, courses: ['01005001217 วิทยานิพนธ์ (Thesis) 12 (0-36-12)'] }
            ];
        }
    } else {
        mockPlanData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 19, courses: ['GEN101 หมวดวิชาศึกษาทั่วไป 1 3 (3-0)', 'ANA101 กายวิภาคศาสตร์และสรีรวิทยา 1 3 (3-0)', 'NUR101 การพยาบาลพื้นฐาน 1 3 (3-0)'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 18, courses: ['GEN102 หมวดวิชาศึกษาทั่วไป 2 3 (3-0)', 'PATH101 พยาธิสรีรวิทยา 3 (3-0)', 'NUR102 การพยาบาลพื้นฐาน 2 3 (3-0)'] },
        ];
    }
    return mockPlanData;
}

function parseCourseString(str) {
    const match = str.match(/^([A-Za-z0-9x]+)\s+(.+?)\s+(\d+)\s*\((.+?)\)$/);
    if (match) {
        return { code: match[1], name: match[2], credits: parseInt(match[3]) || 0, format: match[4] };
    }
    const looseMatch = str.match(/^([A-Za-z0-9x]+)\s+(.*?)$/);
    if (looseMatch) {
        return { code: looseMatch[1], name: looseMatch[2], credits: 0, format: '' };
    }
    return { code: '', name: str, credits: 0, format: '' };
}

pages.transcript = function() {
    const st = MOCK.student || {};
    const studentGrades = st.grades || MOCK.grades || [];
    const gradesFlat = studentGrades.flatMap(s => s.courses || []);
    
    // Fallbacks
    const studentId = st.id || st.studentId || st.student_id || '---------';
    const studentPrefix = st.prefix || '';
    const studentFirstName = st.firstName || st.name || '';
    const studentLastName = st.lastName || '';
    const studentProgramRaw = st.program || '';
    const studentProgram = studentProgramRaw.includes('หลักสูตร') ? studentProgramRaw.replace('หลักสูตร', '').trim() : studentProgramRaw;
    const admissionYear = st.admissionYear || '----';
    const departmentName = st.department || '';

    const planId = getPlanIdFromDept(departmentName);
    const mockPlanData = getStudyPlanCoursesData(planId, admissionYear);

    const usedGradeIndices = new Set();
    const resolvedPlan = mockPlanData.map(sem => {
        return {
            ...sem,
            resolvedCourses: sem.courses.map(courseStr => {
                const parsed = parseCourseString(courseStr);
                const isElective = parsed.name.includes('วิชาเลือก') || (parsed.code || '').includes('xxxx');
                let matchedIdx = -1;
                
                if (!isElective) {
                    const cCode = parsed.code || '';
                    const cName = parsed.name || '';
                    const cleanCode = String(cCode).replace(/[^Aa-zZ0-9]/g, '');
                    const cleanCodeSuffix = cleanCode.substring(Math.max(0, cleanCode.length - 5));
                    
                    matchedIdx = gradesFlat.findIndex((g, idx) => {
                        if (!g || !g.code || usedGradeIndices.has(idx)) return false;
                        const gCodeClean = String(g.code).replace(/[^Aa-zZ0-9]/g, '');
                        const gName = String(g.name || '').toLowerCase();
                        const curName = String(cName).toLowerCase();
                        return gCodeClean.endsWith(cleanCodeSuffix) || (curName && gName && (curName.includes(gName) || gName.includes(curName)));
                    });
                    
                    if (matchedIdx !== -1) usedGradeIndices.add(matchedIdx);
                }
                return { parsed, isElective, matchedIdx };
            })
        };
    });

    // Pass 2: Match electives
    resolvedPlan.forEach(sem => {
        sem.resolvedCourses.forEach(entry => {
            if (entry.isElective) {
                const matchedIdx = gradesFlat.findIndex((g, idx) => !usedGradeIndices.has(idx) && g.grade);
                if (matchedIdx !== -1) {
                    usedGradeIndices.add(matchedIdx);
                    entry.matchedIdx = matchedIdx;
                    const g = gradesFlat[matchedIdx];
                    entry.parsed.code = g.code || entry.parsed.code;
                    entry.parsed.name = g.name || entry.parsed.name;
                    entry.parsed.credits = g.credits || entry.parsed.credits;
                }
            }
        });
    });

    let totalPoints = 0;
    let totalCredits = 0;
    let semesterHtmlRows = '';

    resolvedPlan.forEach(semPlan => {
        let semCredits = 0;
        let semPoints = 0;
        let hasGradesInSem = false;
        let coursesHtml = '';

        semPlan.resolvedCourses.forEach(entry => {
            const { parsed, matchedIdx } = entry;
            const cCode = parsed.code || '-';
            const cName = parsed.name || '-';
            const cCred = parsed.credits || '-';
            const cFormat = parsed.format || '';

            const matchingGrade = matchedIdx !== -1 ? gradesFlat[matchedIdx] : null;
            const gradeVal = matchingGrade ? matchingGrade.grade : '';
            const gradePoint = matchingGrade ? (matchingGrade.point || 0) : 0;

            if (gradeVal && gradeVal !== 'W' && gradeVal !== 'I' && !isNaN(cCred) && cCred !== '-') {
                semCredits += Number(cCred);
                semPoints += (Number(cCred) * gradePoint);
                totalCredits += Number(cCred);
                totalPoints += (Number(cCred) * gradePoint);
                hasGradesInSem = true;
            }

            coursesHtml += `
                <tr>
                    <td class="center">${cCode}</td>
                    <td>${cName}</td>
                    <td class="center">${cCred !== '-' ? cCred + '(' + cFormat + ')' : cCred}</td>
                    <td class="center">${gradeVal}</td>
                </tr>
            `;
        });

        const semGPA = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : '0.00';
        const cumGPAAtEnd = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

        let semTitle = semPlan.title || '';
        if (semTitle.includes('ภาค')) {
            semTitle = semTitle.substring(semTitle.indexOf('ภาค'));
        }
        
        const admissionYearInt = parseInt(admissionYear) || new Date().getFullYear() + 543;
        const termAcademicYear = admissionYearInt + ((semPlan.year || 1) - 1);
        if (!semTitle.includes('ปีการศึกษา')) {
            semTitle += ` ปีการศึกษา ${termAcademicYear}`;
        }

        semesterHtmlRows += `
            <tr>
                <td colspan="4" class="center" style="font-weight:700;background:#f9f9f9;">${semTitle}</td>
            </tr>
            ${coursesHtml}
        `;
        
        semesterHtmlRows += `
            <tr>
                <td colspan="4" class="center" style="font-weight:700;">
                    หน่วยกิต ${semCredits} คะแนนเฉลี่ย ${semGPA} หน่วยกิตสะสม ${totalCredits} คะแนนเฉลี่ย ${cumGPAAtEnd}
                </td>
            </tr>
        `;
    });

    const cumulativeGPACalculated = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
                <h1 class="page-title">ใบแสดงผลการศึกษา</h1>
                <p class="page-subtitle">รายงานผลการเรียนแบบเป็นทางการ</p>
            </div>
            <button class="btn btn-primary" onclick="window.print()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                พิมพ์ / ดาวน์โหลด
            </button>
        </div>
        
        <div class="report-paper animate-in animate-delay-1" id="printable-transcript">
            <div class="report-header">
                <div style="width:70px;height:70px;background:var(--accent-gradient);border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:bold;margin-right:20px;">
                    พย.
                </div>
                <div class="report-header-text">
                    <div style="font-size:1.2rem;margin-bottom:4px;">คณะพยาบาลศาสตร์ สถาบันพระบรมราชชนก</div>
                    <div style="font-size:1rem;font-weight:600;">ระบบทะเบียนและประมวลผลการศึกษา</div>
                </div>
            </div>
            
            <div class="report-title-center">
                <div>รายงานผลการเรียนนักศึกษารายปีการศึกษา</div>
                <div>หลักสูตร${studentProgram}</div>
                <div>${departmentName}</div>
                <div>ปีการศึกษา ${admissionYear}</div>
                <div style="margin-top:10px;">รหัสนักศึกษา ${studentId} ชื่อ-สกุลนักศึกษา ${studentPrefix}${studentFirstName} ${studentLastName}</div>
            </div>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th style="width:15%">รหัสวิชา</th>
                        <th style="width:60%">รายวิชา</th>
                        <th style="width:12%">หน่วยกิต</th>
                        <th style="width:13%">ระดับคะแนน</th>
                    </tr>
                </thead>
                <tbody>
                    ${semesterHtmlRows}
                </tbody>
            </table>
            
            <div class="report-footer" style="padding:0 20px;">
                <div>
                    <div style="margin-bottom:8px;">คะแนนเฉลี่ยตลอดปีการศึกษา: ${cumulativeGPACalculated}</div>
                    <div>คะแนนเฉลี่ยสะสมตลอดหลักสูตร: ${cumulativeGPACalculated}</div>
                </div>
                <div>
                    <div style="margin-bottom:8px;">รวมหน่วยกิตตลอดปีการศึกษา: ${totalCredits}</div>
                    <div>รวมหน่วยกิตสะสมตลอดหลักสูตร: ${totalCredits}</div>
                </div>
            </div>
            
            <div class="report-legend">
                <strong>หมายเหตุ</strong>
                <div class="report-legend-grid">
                    <div>A : ดีเยี่ยม</div>
                    <div>B+ : ดีมาก</div>
                    <div>B : ดี</div>
                    <div>C+ : ค่อนข้างดี</div>
                    <div>C : พอใช้</div>
                    <div>D+ : อ่อน</div>
                    <div>D : อ่อนมาก</div>
                    <div>F : ตก</div>
                    <div>S : พึงพอใจ</div>
                    <div>U : ไม่พึงพอใจ</div>
                    <div>I : ยังไม่สมบูรณ์</div>
                    <div>W : ถอนรายวิชา</div>
                    <div style="grid-column: span 2;">AU : เรียนโดยไม่เข้ารับการประเมิน</div>
                    <div>IP : มีความก้าวหน้า</div>
                    <div>X : ไม่รายงาน</div>
                    <div>P : มีความก้าวหน้า</div>
                    <div>N : ไม่มีความก้าวหน้า</div>
                </div>
            </div>
        </div>
    </div>`;
};


