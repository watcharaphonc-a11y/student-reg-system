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
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, courses: ['01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมทางการพยาบาล 2 (2-0-4)', '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '01005030101 ประเมินภาวะสุขภาพเด็กขั้นสูง 2 (1-2-3)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, courses: ['01005030102 การพยาบาลเด็กกลุ่มเสี่ยงและภาวะเรื้อรัง 2 (2-0-4)', '01005030103 การพยาบาลเด็กระยะเฉียบพลันและวิกฤต 2 (2-0-4)', '01005030104 ปฏิบัติการพยาบาลเด็กกลุ่มเสี่ยงและภาวะเรื้อรัง 3 (0-9-3)', '010050xxxx วิชาเลือกเสรี 3 (3-0-6)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, courses: ['01005030105 ปฏิบัติการพยาบาลเด็กระยะเฉียบพลันและวิกฤต 3 (0-9-3)', '01005030106 สัมมนาทางการพยาบาลเด็ก 1 (0-2-1)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] },
            { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] }
        ];
    } else if (planId === 'nursing-community') {
        if (is2565Cohort) {
            mockPlanData = [
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 11, courses: ['01005000101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', '01005000102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '0100505105 การประเมินสุขภาพขั้นสูงและเภสัชวิทยาสำหรับการรักษาโรคเบื้องต้น 2 (1-2-3)', '0100505106 การพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวที่มีปัญหาสุขภาพซับซ้อน 2 (2-0-4)', '0100505107 การพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 2 (2-0-4)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 3', credits: 5, courses: ['01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100505109 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 8, courses: ['01005000103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000108 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวที่มีปัญหาสุขภาพซับซ้อน 3 (0-9-3)', 'xxxxxxxxxxx วิชาเลือก 3 (3-0-6)'] },
                { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 6, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'] },
                { year: 3, sem: 1, title: 'ชั้นปีที่ 3 ภาคการศึกษาที่ 1', credits: 6, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'] }
            ];
        } else {
            mockPlanData = [
                { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 11, courses: ['01005000101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', '01005000102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '0100505105 การประเมินสุขภาพขั้นสูงและเภสัชวิทยาสำหรับการรักษาโรคเบื้องต้น 2 (1-2-3)', '0100505106 การพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวที่มีปัญหาสุขภาพซับซ้อน 2 (2-0-4)', '0100505107 การพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 2 (2-0-4)'] },
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 10, courses: ['01005000103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '01005000108 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวที่มีปัญหาสุขภาพซับซ้อน 3 (0-9-3)', 'xxxxxxxxxxx วิชาเลือก 3 (3-0-6)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 3, courses: ['0100505109 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 6, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'] },
                { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 6, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'] }
            ];
        }
    } else if (planId === 'nursing-maternal') {
        mockPlanData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, courses: ['01005000101 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', '01005000102 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมทางการพยาบาล 2 (2-0-4)', '01005000103 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100502105 พยาธิสรีรวิทยาและเภสัชวิทยาทางการผดุงครรภ์ 2 (2-0-4)', '01005000116 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, courses: ['0100502106 การผดุงครรภ์ในระยะตั้งครรภ์และหลังคลอด 2 (2-0-4)', '0100502107 การผดุงครรภ์ในระยะคลอด 2 (2-0-4)', '0100502108 ปฏิบัติการผดุงครรภ์ในระยะตั้งครรภ์และหลังคลอด 3 (0-9-3)', '01005022xx วิชาเลือก 3 (3-0-6)', '01005000116 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, courses: ['0100502109 ปฏิบัติการผดุงครรภ์ในระยะคลอด 3 (0-9-3)', '0100502110 สัมมนาทางการผดุงครรภ์ 1 (0-2-1)', '01005000116 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, courses: ['01005000116 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] },
            { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, courses: ['01005000116 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] }
        ];
    } else if (planId === 'nursing-admin') {
        mockPlanData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, courses: ['01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมทางการพยาบาล 2 (2-0-4)', '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100508101 ภาวะผู้นำและการจัดการคุณภาพองค์กรสุขภาพ 2 (2-0-4)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, courses: ['0100508102 การจัดการและพัฒนาทรัพยากรในระบบสุขภาพและสารสนเทศทางสุขภาพ 2 (2-0-4)', '0100508103 การจัดการเชิงกลยุทธ์และการตัดสินใจทางการเงินและงบประมาณ 2 (2-0-4)', '0100508104 ปฏิบัติการพัฒนาภาวะผู้นำ การจัดการคุณภาพและทรัพยากรสุขภาพ 3 (0-9-3)', '01005081xx วิชาเลือก 3 (3-0-6)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, courses: ['0100508105 ปฏิบัติการจัดการเชิงกลยุทธ์และการตัดสินใจทางสุขภาพ 3 (0-9-3)', '0100508106 สัมมนาประเด็นคัดสรรในการบริหารทางการพยาบาลและการจัดการสุขภาพ 1 (0-2-1)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
            { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] },
            { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, courses: ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'] }
        ];
    } else if (planId === 'nursing-mental') {
        mockPlanData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 13, courses: ['01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมทางการพยาบาล 2 (2-0-4)', '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100505101 การประเมินภาวะสุขภาพขั้นสูง 1 (0-2-3)', '0100505102 จิตเภสัชวิทยา (Psychopharmacology) 2 (2-0-4)', '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'] },
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
    
    // Fallbacks and Info
    const studentId = st.studentId || st.id || '---------';
    const studentPrefix = st.prefix || '';
    const studentFirstName = st.firstName || '';
    const studentLastName = st.lastName || '';
    const studentProgramRaw = st.program || '';
    const studentProgram = studentProgramRaw.includes('หลักสูตร') ? studentProgramRaw.replace('หลักสูตร', '').trim() : studentProgramRaw;
    const admissionYear = st.admissionYear || '----';
    const departmentName = st.department || '';

    const planId = getPlanIdFromDept(departmentName);
    const mockPlanData = getStudyPlanCoursesData(planId, admissionYear);

    // Data-Centric Rendering: Loop through actual grades grouped by semester in app.js
    let totalPointsGPA = 0;
    let totalCreditsGPA = 0;
    let totalCreditsEarned = 0;
    let semesterHtmlRows = '';

    // Collect all plan courses for matching
    const allPlanCourses = mockPlanData.flatMap(sem => sem.courses.map(c => parseCourseString(c)));

    studentGrades.forEach(semGroup => {
        let semCreditsTotal = 0;
        let semCreditsGPA = 0;
        let semPointsGPA = 0;
        let coursesHtml = '';

        (semGroup.courses || []).forEach(g => {
            const gCode = String(g.code || '').trim();
            const gName = String(g.name || '').trim();
            const gCred = Number(g.credits || 0);
            const gGrade = String(g.grade || '').trim();
            const gPoint = Number(g.point || 0);

            // Use raw credit string from sheet (e.g. "3(3-0-6)") if available
            const rawDisplay = String(g.creditsDisplay || '').trim();
            let creditsText = '';
            if (rawDisplay && rawDisplay.includes('(')) {
                // Sheet already has format like "3(3-0-6)"
                creditsText = rawDisplay;
            } else {
                // Fallback: try to find format from study plan
                const planMatch = allPlanCourses.find(pc => 
                    String(pc.code).replace(/[^0-9]/g, '') === gCode.replace(/[^0-9]/g, '') ||
                    String(pc.name).replace(/[^ก-๙A-Za-z]/g, '') === gName.replace(/[^ก-๙A-Za-z]/g, '')
                );
                const displayFormat = planMatch ? (planMatch.format || '') : '';
                creditsText = gCred + (displayFormat ? '(' + displayFormat + ')' : '');
            }

            if (gGrade && gGrade !== 'W' && gGrade !== 'I') {
                // All credits count toward total (including Thesis)
                semCreditsTotal += gCred;
                totalCreditsEarned += gCred;

                // Exclude Thesis and P/S/U from GPA only
                const isThesis = gName.includes('วิทยานิพนธ์') || 
                                 gName.toLowerCase().includes('thesis') ||
                                 gCode.startsWith('1005002') ||
                                 gCode.startsWith('1005003') ||
                                 gCode.startsWith('1005004');
                const isNonGPAGrade = ['P', 'S', 'U'].includes(gGrade);

                if (!isThesis && !isNonGPAGrade) {
                    semCreditsGPA += gCred;
                    semPointsGPA += (gCred * gPoint);
                    totalCreditsGPA += gCred;
                    totalPointsGPA += (gCred * gPoint);
                }
            }

            coursesHtml += `
                <tr>
                    <td class="center">${gCode}</td>
                    <td>${gName}</td>
                    <td class="center">${creditsText}</td>
                    <td class="center">${gGrade}</td>
                </tr>
            `;
        });

        const semGPA = semCreditsGPA > 0 ? (semPointsGPA / semCreditsGPA).toFixed(2) : '0.00';
        const cumGPAAtEnd = totalCreditsGPA > 0 ? (totalPointsGPA / totalCreditsGPA).toFixed(2) : '0.00';

        // Format Semester Title like in screenshot: "ภาคการศึกษาที่ 2 ปีการศึกษา 2565"
        const formattedSemTitle = `ภาคการศึกษาที่ ${semGroup.term} ปีการศึกษา ${semGroup.year}`;

        semesterHtmlRows += `
            <tr>
                <td colspan="4" class="center" style="font-weight:700;background:#f9f9f9;padding:10px;">${formattedSemTitle}</td>
            </tr>
            ${coursesHtml}
            <tr>
                <td colspan="4" class="center" style="font-weight:700; font-size:0.85rem; padding:8px; border-bottom:2px solid #eee;">
                    หน่วยกิต ${semCreditsTotal} คะแนนเฉลี่ย ${semGPA} หน่วยกิตสะสม ${totalCreditsEarned} คะแนนเฉลี่ย ${cumGPAAtEnd}
                </td>
            </tr>
        `;
    });

    const cumulativeGPACalculated = totalCreditsGPA > 0 ? (totalPointsGPA / totalCreditsGPA).toFixed(2) : '0.00';

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
                <img src="assets/logo_faculty.png" alt="โลโก้คณะพยาบาลศาสตร์" style="width:70px;height:70px;object-fit:contain;margin-right:20px;">
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
                    <div style="margin-bottom:8px;">รวมหน่วยกิตตลอดปีการศึกษา: ${totalCreditsEarned}</div>
                    <div>รวมหน่วยกิตสะสมตลอดหลักสูตร: ${totalCreditsEarned}</div>
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


