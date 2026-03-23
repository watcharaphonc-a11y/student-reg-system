// ============================
// Study Plan Page (Faculty of Nursing, PBRI)
// ============================

pages['study-plan'] = function() {
    const plans = MOCK.studyPlans || [];

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">แผนการศึกษา (Study Plan)</h1>
            <p class="page-subtitle">คณะพยาบาลศาสตร์ สถาบันพระบรมราชชนก (การพยาบาลเฉพาะทาง 6 สาขา)</p>
        </div>

        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); margin-bottom: 24px;">
            ${plans.map((plan, index) => `
                <div class="card animate-in animate-delay-${(index%5)+1} hover-scale" 
                     style="cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; border-left: 4px solid ${plan.color};"
                     onclick="openStudyPlanModal('${plan.id}', '${plan.name}')">
                    <div class="card-body" style="display:flex; gap: 16px; align-items:flex-start;">
                        <div style="font-size: 2.5rem; background: var(--bg-tertiary); width: 60px; height: 60px; display:flex; align-items:center; justify-content:center; border-radius: 12px;">
                            ${plan.icon}
                        </div>
                        <div>
                            <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: var(--text-primary); line-height:1.4;">${plan.name}</h3>
                            <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">${plan.description}</p>
                            <div style="margin-top: 12px;">
                                <span class="badge" style="background:var(--bg-tertiary); color:var(--text-secondary)">ดูแผนการศึกษา ➔</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="card animate-in animate-delay-5" style="background: var(--bg-tertiary); text-align:center; padding: 24px;">
            <p>หมายเหตุ: โครงสร้างหลักสูตรและแผนการศึกษาอาจมีการเปลี่ยนแปลงตามประกาศของสถาบันพระบรมราชชนก กรุณาตรวจสอบกับอาจารย์ที่ปรึกษา</p>
        </div>
    </div>`;
};

window.openStudyPlanModal = function(planId, planName) {
    let mockPlanData = [];
    let degreeTitle = "หลักสูตรพยาบาลศาสตรบัณฑิต";
    
    if (planId === 'nursing-pediatric') {
        degreeTitle = "หลักสูตรพยาบาลศาสตรมหาบัณฑิต (ปริญญาโท)";
        // Data derived from provided curriculum images
        mockPlanData = [
            { 
                year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, 
                courses: [
                    '01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', 
                    '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายฯ 2 (2-0-4)', 
                    '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ฯ 2 (2-0-4)', 
                    '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)',
                    '01005030101 ประเมินภาวะสุขภาพเด็กขั้นสูง 2 (1-2-3)',
                    '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, 
                courses: [
                    '01005030102 การพยาบาลเด็กกลุ่มเสี่ยงและภาวะเรื้อรัง 2 (2-0-4)', 
                    '01005030103 การพยาบาลเด็กระยะเฉียบพลันและวิกฤต 2 (2-0-4)', 
                    '01005030104 ปฏิบัติการพยาบาลเด็กกลุ่มเสี่ยงฯ 3 (0-9-3)', 
                    '010050...xx วิชาเลือกเสรี 3 (x-x-x)',
                    '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, 
                courses: [
                    '01005030105 ปฏิบัติการพยาบาลเด็กระยะเฉียบพลันฯ 3 (0-9-3)', 
                    '01005030106 สัมมนาทางการพยาบาลเด็ก 1 (0-2-1)', 
                    '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, 
                courses: [
                    '01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'
                ] 
            },
            { 
                year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, 
                courses: [
                    '01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'
                ] 
            }
        ];
    } else if (planId === 'nursing-community') {
        degreeTitle = "หลักสูตรพยาบาลศาสตรมหาบัณฑิต (ปริญญาโท)";
        // Data derived from provided Community Nurse Practitioner curriculum images
        mockPlanData = [
            { 
                year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 11, 
                courses: [
                    '01005000101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาลฯ 3 (3-0-6)', 
                    '01005000102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', 
                    '0100505105 การประเมินสุขภาพขั้นสูงและเภสัชวิทยาสำหรับการรักษาโรคเบื้องต้น 2 (1-2-3)', 
                    '0100505106 การพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวฯ 2 (2-0-4)',
                    '0100505107 การพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 2 (2-0-4)'
                ] 
            },
            { 
                year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 10, 
                courses: [
                    '01005000103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', 
                    '01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', 
                    '01005000108 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวฯ 3 (0-9-3)', 
                    'xxxxxxxxxxx วิชาเลือก 3 (3-0-6)'
                ] 
            },
            { 
                year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 3, 
                courses: [
                    '0100505109 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการฯ 3 (0-9-3)'
                ] 
            },
            { 
                year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 6, 
                courses: [
                    '01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'
                ] 
            },
            { 
                year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 6, 
                courses: [
                    '01005000117 วิทยานิพนธ์ (Thesis) 6 (0-18-6)'
                ] 
            }
        ];
    } else if (planId === 'nursing-maternal') {
        degreeTitle = "หลักสูตรพยาบาลศาสตรมหาบัณฑิต (ปริญญาโท)";
        // Data derived from provided Midwifery curriculum images
        mockPlanData = [
            { 
                year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, 
                courses: [
                    '01005000101 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', 
                    '01005000102 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมฯ 2 (2-0-4)', 
                    '01005000103 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', 
                    '01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)',
                    '0100502105 พยาธิสรีรวิทยาและเภสัชวิทยาทางการผดุงครรภ์ 2 (2-0-4)',
                    '01005000116 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, 
                courses: [
                    '0100502106 การผดุงครรภ์ในระยะตั้งครรภ์และหลังคลอด 2 (2-0-4)', 
                    '0100502107 การผดุงครรภ์ในระยะคลอด 2 (2-0-4)', 
                    '0100502108 ปฏิบัติการผดุงครรภ์ในระยะตั้งครรภ์และหลังคลอด 3 (0-9-3)', 
                    '01005022xx วิชาเลือก 3 (3-0-6)',
                    '01005000116 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, 
                courses: [
                    '0100502109 ปฏิบัติการผดุงครรภ์ในระยะคลอด 3 (0-9-3)', 
                    '0100502110 สัมมนาทางการผดุงครรภ์ 1 (0-2-1)', 
                    '01005000116 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, 
                courses: [
                    '01005000116 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'
                ] 
            },
            { 
                year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, 
                courses: [
                    '01005000116 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'
                ] 
            }
        ];
    } else if (planId === 'nursing-admin') {
        degreeTitle = "หลักสูตรพยาบาลศาสตรมหาบัณฑิต (ปริญญาโท)";
        // Data derived from provided Nursing Administration curriculum images
        mockPlanData = [
            { 
                year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, 
                courses: [
                    '01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', 
                    '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมฯ 2 (2-0-4)', 
                    '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', 
                    '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)',
                    '0100508101 ภาวะผู้นำและการจัดการคุณภาพองค์กรสุขภาพ 2 (2-0-4)',
                    '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, 
                courses: [
                    '0100508102 การจัดการและพัฒนาทรัพยากรในระบบสุขภาพฯ 2 (2-0-4)', 
                    '0100508103 การจัดการเชิงกลยุทธ์และการตัดสินใจฯ 2 (2-0-4)', 
                    '0100508104 ปฏิบัติการพัฒนาภาวะผู้นำ การจัดการคุณภาพและทรัพยากรสุขภาพ 3 (0-9-3)', 
                    '01005081xx วิชาเลือก 3 (3-0-6)',
                    '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, 
                courses: [
                    '0100508105 ปฏิบัติการจัดการเชิงกลยุทธ์และการตัดสินใจฯ 3 (0-9-3)', 
                    '0100508106 สัมมนาประเด็นคัดสรรในการบริหารทางการพยาบาลฯ 1 (0-2-1)', 
                    '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, 
                courses: [
                    '01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'
                ] 
            },
            { 
                year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, 
                courses: [
                    '01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'
                ] 
            }
        ];
    } else if (planId === 'nursing-mental') {
        degreeTitle = "หลักสูตรพยาบาลศาสตรมหาบัณฑิต (ปริญญาโท)";
        // Data derived from provided Psychiatric and Mental Health Nursing curriculum images
        mockPlanData = [
            { 
                year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 13, 
                courses: [
                    '01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)', 
                    '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมฯ 2 (2-0-4)', 
                    '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', 
                    '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)',
                    '0100505101 การประเมินภาวะสุขภาพขั้นสูง 1 (0-2-3)',
                    '0100505102 จิตเภสัชวิทยา (Psychopharmacology) 2 (2-0-4)',
                    '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, 
                courses: [
                    '0100505103 การส่งเสริมสุขภาพจิตและป้องกันการเจ็บป่วยทางจิตในระดับปฐมภูมิ 2 (2-0-4)', 
                    '0100505104 การพยาบาลจิตเวชเฉียบพลันและฉุกเฉิน ผู้ใช้ยาและสารเสพติด 2 (2-0-4)', 
                    '0100505105 ปฏิบัติการส่งเสริมสุขภาพจิตและป้องกันการเจ็บป่วยทางจิตในระดับปฐมภูมิ 3 (0-9-3)', 
                    '0100500...xxx วิชาเลือก 3 (3-0-6)',
                    '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 5, 
                courses: [
                    '0100505106 ปฏิบัติการพยาบาลจิตเวชเฉียบพลันและฉุกเฉิน ผู้ใช้ยาและสารเสพติด 2 (0-6-x)', 
                    '0100505107 สัมมนาการพยาบาลจิตเวชและสุขภาพจิต 1 (0-2-1)', 
                    '01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'
                ] 
            },
            { 
                year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, 
                courses: [
                    '01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'
                ] 
            },
            { 
                year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, 
                courses: [
                    '01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'
                ] 
            }
        ];
    } else if (planId === 'nursing-adult') {
        degreeTitle = "หลักสูตรพยาบาลศาสตรมหาบัณฑิต (ปริญญาโท)";
        // Data derived from provided Adult and Gerontological Nursing curriculum images
        mockPlanData = [
            { 
                year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 11, 
                courses: [
                    '01005000101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', 
                    '01005000102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', 
                    '0100504105 พยาธิสรีรวิทยาและเภสัชวิทยาทางการพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)', 
                    '0100504106 การพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)'
                ] 
            },
            { 
                year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 10, 
                courses: [
                    '01005000103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', 
                    '01005000104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', 
                    '0100504107 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 1 3 (0-9-3)', 
                    'xxxxxxxxx วิชาเลือก 3 (3-0-6)'
                ] 
            },
            { 
                year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 3, 
                courses: [
                    '0100504108 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 2 3 (0-9-3)'
                ] 
            },
            { 
                year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1 และ 2', credits: 12, 
                courses: [
                    '01005001217 วิทยานิพนธ์ (Thesis) 12 (0-36-12)'
                ] 
            }
        ];
    } else {
        // Generic 4-year undergraduate plan for others
        mockPlanData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 19, courses: ['หมวดวิชาศึกษาทั่วไป 1', 'หมวดวิชาศึกษาทั่วไป 2', 'กายวิภาคศาสตร์และสรีรวิทยา 1', 'การพยาบาลพื้นฐาน 1'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 18, courses: ['หมวดวิชาศึกษาทั่วไป 3', 'กายวิภาคศาสตร์และสรีรวิทยา 2', 'พยาธิสรีรวิทยา', 'การพยาบาลพื้นฐาน 2'] },
            { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 21, courses: ['เภสัชวิทยา', 'การพยาบาลมารดา ทารกฯ 1', 'การพยาบาลเด็ก 1', 'ปฏิบัติการพยาบาลพื้นฐาน'] },
            { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 20, courses: ['การพยาบาลผู้ใหญ่ 1', 'การพยาบาลสุขภาพจิตฯ 1', 'วิทยาการระบาด', 'ปฏิบัติการพยาบาลมารดา ทารกฯ'] },
            { year: 3, sem: 1, title: 'ชั้นปีที่ 3 ภาคการศึกษาที่ 1', credits: 18, courses: ['การพยาบาลผู้ใหญ่ 2', 'การพยาบาลอนามัยชุมชน 1', 'ปฏิบัติการพยาบาลผู้ใหญ่ 1', 'ปฏิบัติการพยาบาลเด็ก'] },
            { year: 3, sem: 2, title: 'ชั้นปีที่ 3 ภาคการศึกษาที่ 2', credits: 19, courses: ['การพยาบาลผู้สูงอายุ', 'การวิจัยทางการพยาบาล', 'การบริหารการพยาบาล', 'ปฏิบัติการพยาบาลอนามัยชุมชน 1'] },
            { year: 4, sem: 1, title: 'ชั้นปีที่ 4 ภาคการศึกษาที่ 1', credits: 15, courses: ['ปฏิบัติการพยาบาลผู้ใหญ่ 2', 'ปฏิบัติการพยาบาลสุขภาพจิตฯ', 'ปฏิบัติการพยาบาลผู้สูงอายุ'] },
            { year: 4, sem: 2, title: 'ชั้นปีที่ 4 ภาคการศึกษาที่ 2', credits: 12, courses: ['ปฏิบัติการบริหารการพยาบาล', 'รวบยอดการพยาบาล', 'เลือกเสรี 1', 'เลือกเสรี 2'] },
        ];
    }

    let html = `

        <div style="padding: 10px;">
            <div style="margin-bottom: 20px;">
                <h4 style="color:var(--accent-primary); margin:0 0 4px 0;">${degreeTitle}</h4>
                <h3 style="margin: 0; font-size: 1.2rem;">${planName}</h3>
            </div>
            
            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
    `;

    mockPlanData.forEach(semData => {
        html += `
            <div class="card" style="padding: 15px; background:var(--bg-secondary);">
                <div style="display:flex; justify-content:space-between; margin-bottom: 10px; font-weight:600; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">
                    <span style="color:var(--text-primary)">${semData.title}</span>
                    <span style="color:var(--text-muted); font-size:0.9rem;">${semData.credits} หน่วยกิต</span>
                </div>
                <ul style="margin:0; padding-left: 20px; font-size: 0.95rem; color:var(--text-secondary); line-height: 1.6;">
                    ${semData.courses.map(c => `<li style="margin-bottom:6px;">${c}</li>`).join('')}
                </ul>
            </div>`;
    });

    html += `
            </div>
            <div style="margin-top: 24px; text-align:center;">
                <button class="btn btn-primary" onclick="closeModal()">ปิดหน้าต่าง</button>
            </div>
        </div>
    `;

    openModal('รายละเอียดแผนการศึกษา', html);
};
