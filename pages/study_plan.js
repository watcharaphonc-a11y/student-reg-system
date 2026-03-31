// ============================
// Study Plan Page (Faculty of Nursing, PBRI)
// ============================

window.getStudyPlanForStudent = function(student) {
    if (!student) return { title: "ไม่พบข้อมูล", data: [] };
    
    // Determine admission cohort from student ID (e.g., '65', '66')
    const studentIdStr = String(student.studentId || student.id || '');
    const cohort = studentIdStr.substring(0, 2);
    const cohortNum = parseInt(cohort);
    
    // Admission Sequence logic:
    // 65xx: Start 2565 S2
    // 66xx+: Start [2500+cohort] S1
    const startYear = 2500 + cohortNum;
    const startSem = (cohortNum === 65) ? 2 : 1;
    
    const isLegacy65 = (cohortNum === 65);
    const isNewCurriculum = (cohortNum >= 66);

    // Current relative period calculation
    const curY = window.CURRENT_ACADEMIC_YEAR || 2568;
    const curS = window.CURRENT_SEMESTER || 1;
    
    let totalSems = 0;
    if (curY === startYear) {
        totalSems = Math.max(1, curS - startSem + 1);
    } else if (curY > startYear) {
        totalSems = (3 - startSem + 1) + (curY - startYear - 1) * 3 + curS;
    }
    
    // Convert back to relative Year/Sem for matching
    let relY = 1;
    let relS = startSem;
    for (let i = 1; i < totalSems; i++) {
        relS++;
        if (relS > 3) { relS = 1; relY++; }
    }
    
    // Determine major from department string
    const dept = String(student.department || '').toLowerCase();
    const programId = student.program || '';
    
    let planData = [];
    let degreeTitle = "หลักสูตรพยาบาลศาสตรมหาบัณฑิต (ปริญญาโท)";

    // Cohort 66+ (New Curriculum - 2 Years / 5 Semesters)
    if (isNewCurriculum) {
        // Shared Core Courses (8 credits)
        const coreS1 = [
            '01005000105 แนวคิดและทฤษฎีทางการพยาบาล 2 (2-0-4)',
            '01005000106 ระบบสุขภาพ ภาวะผู้นำ กฎหมายและจริยธรรมทางการพยาบาล 2 (2-0-4)',
            '01005000107 วิจัยและการใช้หลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)',
            '01005000108 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)'
        ];
        
        // Thesis (12 credits)
        const thesisS1 = ['01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'];
        const thesisS2 = ['01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'];
        const thesisS3 = ['01005000117 วิทยานิพนธ์ (Thesis) 2 (0-6-2)'];
        const thesisS4 = ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'];
        const thesisS5 = ['01005000117 วิทยานิพนธ์ (Thesis) 3 (0-9-3)'];
        
        // Elective
        const electiveS2 = ['010050...xx วิชาเลือกเสรี 3 (x-x-x)'];

        // Branch Specifics
        let branchS1 = [];
        let branchS2 = [];
        let branchS3 = [];

        if (dept.includes('ผู้ใหญ่') || programId === 'nursing-adult') {
            branchS1 = ['0100504101 ประเมินภาวะสุขภาพผู้ใหญ่และผู้สูงอายุขั้นสูง 2 (1-2-3)'];
            branchS2 = [
                '0100504102 การพยาบาลผู้ใหญ่และผู้สูงอายุกลุ่มเสี่ยงและภาวะเรื้อรัง 2 (2-0-4)',
                '0100504103 การพยาบาลผู้ใหญ่และผู้สูงอายุระยะเฉียบพลันและวิกฤต 2 (2-0-4)',
                '0100504104 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุกลุ่มเสี่ยงและภาวะเรื้อรัง 3 (0-9-3)'
            ];
            branchS3 = [
                '0100504105 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุระยะเฉียบพลันและวิกฤต 3 (0-9-3)',
                '0100504106 สัมมนาทางการพยาบาลผู้ใหญ่และผู้สูงอายุ 1 (0-2-1)'
            ];
        } else if (dept.includes('เด็ก') || programId === 'nursing-pediatric') {
            branchS1 = ['0100503101 ประเมินภาวะสุขภาพเด็กขั้นสูง 2 (1-2-3)'];
            branchS2 = [
                '0100503102 การพยาบาลเด็กกลุ่มเสี่ยงและภาวะเรื้อรัง 2 (2-0-4)',
                '0100503103 การพยาบาลเด็กระยะเฉียบพลันและวิกฤต 2 (2-0-4)',
                '0100503104 ปฏิบัติการพยาบาลเด็กกลุ่มเสี่ยงและภาวะเรื้อรัง 3 (0-9-3)'
            ];
            branchS3 = [
                '0100503105 ปฏิบัติการพยาบาลเด็กระยะเฉียบพลันและวิกฤต 3 (0-9-3)',
                '0100503106 สัมมนาทางการพยาบาลเด็ก 1 (0-2-1)'
            ];
        } else if (dept.includes('ผดุงครรภ์') || programId === 'nursing-maternal') {
            branchS1 = ['0100506101 ประเมินภาวะสุขภาพขั้นสูงสำหรับการผดุงครรภ์ 2 (1-2-3)'];
            branchS2 = [
                '0100506102 การผดุงครรภ์มารดาและทารกที่มีภาวะแทรกซ้อน 2 (2-0-4)',
                '0100506103 การผดุงครรภ์มารดาและทารกภาวะวิกฤต 2 (2-0-4)',
                '0100506104 ปฏิบัติการผดุงครรภ์มารดาและทารกที่มีภาวะแทรกซ้อน 3 (0-9-3)'
            ];
            branchS3 = [
                '0100506105 ปฏิบัติการผดุงครรภ์มารดาและทารกภาวะวิกฤต 3 (0-9-3)',
                '0100506106 สัมมนาการผดุงครรภ์ 1 (0-2-1)'
            ];
        } else if (dept.includes('จิตเวช') || programId === 'nursing-mental') {
            branchS1 = ['0100507101 ประเมินภาวะสุขภาพจิตและจิตเวชขั้นสูง 2 (1-2-3)'];
            branchS2 = [
                '0100507102 การพยาบาลจิตเวชและสุขภาพจิตกลุ่มเสี่ยง 2 (2-0-4)',
                '0100507103 การพยาบาลจิตเวชและสุขภาพจิตระยะเฉียบพลันและวิกฤต 2 (2-0-4)',
                '0100507104 ปฏิบัติการพยาบาลจิตเวชและสุขภาพจิตกลุ่มเสี่ยง 3 (0-9-3)'
            ];
            branchS3 = [
                '0100507105 ปฏิบัติการพยาบาลจิตเวชและสุขภาพจิตระยะเฉียบพลัน 3 (0-9-3)',
                '0100507106 สัมมนาทางการพยาบาลจิตเวชและสุขภาพจิต 1 (0-2-1)'
            ];
        } else if (dept.includes('ชุมชน') || programId === 'nursing-community') {
            branchS1 = ['0100509101 ประเมินภาวะสุขภาพชุมชนขั้นสูง 2 (1-2-3)'];
            branchS2 = [
                '0100509102 การพยาบาลเวชปฏิบัติชุมชนโรคเรื้อรัง 2 (2-0-4)',
                '0100509103 การพยาบาลเวชปฏิบัติชุมชนระยะเฉียบพลัน 2 (2-0-4)',
                '0100509104 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชน 1 3 (0-9-3)'
            ];
            branchS3 = [
                '0100509105 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชน 2 3 (0-9-3)',
                '0100509106 สัมมนาทางการพยาบาลเวชปฏิบัติชุมชน 1 (0-2-1)'
            ];
        } else if (dept.includes('บริหาร') || programId === 'nursing-admin') {
            branchS1 = ['0100508101 การประเมินและการจัดการองค์กรพยาบาลขั้นสูง 2 (1-2-3)'];
            branchS2 = [
                '0100508102 นโยบายและการจัดการระบบสุขภาพ 2 (2-0-4)',
                '0100508103 การบริหารทางการพยาบาล 2 (2-0-4)',
                '0100508104 ปฏิบัติการบริหารทางการพยาบาล 1 3 (0-9-3)'
            ];
            branchS3 = [
                '0100508105 ปฏิบัติการบริหารทางการพยาบาล 2 3 (0-9-3)',
                '0100508106 สัมมนาการบริหารทางการพยาบาล 1 (0-2-1)'
            ];
        } else {
            // Default/Other
            branchS1 = ['0100500XXX วิชาเฉพาะสาขา 1 2 (1-2-3)'];
            branchS2 = [
                '0100500XXX วิชาเฉพาะสาขา 2 2 (2-0-4)',
                '0100500XXX วิชาเฉพาะสาขา 3 2 (2-0-4)',
                '0100500XXX ปฏิบัติการเฉพาะสาขา 1 3 (0-9-3)'
            ];
            branchS3 = [
                '0100500XXX ปฏิบัติการเฉพาะสาขา 2 3 (0-9-3)',
                '0100500XXX สัมมนาเฉพาะสาขา 1 (0-2-1)'
            ];
        }

        planData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, courses: [...coreS1, ...branchS1, ...thesisS1] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 12, courses: [...branchS2, ...electiveS2, ...thesisS2] },
            { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 6, courses: [...branchS3, ...thesisS3] },
            { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 3, courses: [...thesisS4] },
            { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 3, courses: [...thesisS5] }
        ];

    } else {
        // Legacy Cohort 65 - Logic preserved but simplified for readability
        const isAdult = dept.includes('ผู้ใหญ่') || programId === 'nursing-adult';
        if (isAdult) {
            planData = [
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 11, courses: ['0100500101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', '0100500102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '0100504105 พยาธิสรีรวิทยาและเภสัชวิทยาทางการพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)', '0100504106 การพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 5, courses: ['0100500104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100504107 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 1 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 8, courses: ['0100500103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '0100504108 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 2 3 (0-9-3)', '0100500115 การวิจัยเชิงคุณภาพ 3 (3-0-6)'] },
                { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 4, courses: ['xxxxxxx วิชาเลือกเสรี 3 (x-x-x)', '0100500217 วิทยานิพนธ์ 1 (0-3-1)'] },
                { year: 2, sem: 3, title: 'ชั้นปีที่ 2 ภาคฤดูร้อน', credits: 3, courses: ['0100500217 วิทยานิพนธ์ 2 (0-3-1)'] },
                { year: 3, sem: 1, title: 'ชั้นปีที่ 3 ภาคการศึกษาที่ 1', credits: 3, courses: ['0100500217 วิทยานิพนธ์ 3 (0-3-1)'] }
            ];
        } else {
            // Default Legacy
            planData = [
                { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, courses: ['01005000101 ระบบสุขภาพ ภาวะผู้นำ 3 (3-0-6)', '01005000102 ทฤษฎีและแนวคิด 2 (2-0-4)', '01005000103 วิชาแกนสาขา 1 2 (2-0-4)', '01005000104 สถิติประยุกต์ 2 (1-2-3)', 'xxxxxxxxxxx วิชาเลือกเสรี 3 (3-0-6)'] },
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 9, courses: ['0100500104 วิจัยและหลักฐานเชิงประจักษ์ 2 (2-0-4)', '0100500105 ปฏิบัติการพยาบาล 1 3 (0-9-3)', '0100500106 สัมมนา 1 (0-2-1)', '0100500107 วิชาเลือกเสรี 3 (3-0-6)'] }
            ];
        }
    }
    
    return { 
        title: degreeTitle, 
        data: planData, 
        relYear: relY, 
        relSem: relS,
        startYear: startYear,
        startSem: startSem
    };
};

pages['study-plan'] = function() {
    const plans = MOCK.studyPlans || [];

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
                <h1 class="page-title">แผนการศึกษา (Study Plan)</h1>
                <p class="page-subtitle">แสดงรายละเอียดวิชาเรียนในแต่ละภาคการศึกษา (หลักสูตร 2 ปี / 5 ภาคการศึกษา)</p>
            </div>
            ${(window.currentUserRole === 'staff' || window.currentUserRole === 'admin') ? `
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" onclick="exportStudyPlanTemplate()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Template
                </button>
                <button class="btn btn-primary" onclick="importStudyPlan()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    นำเข้าแผนการศึกษา
                </button>
            </div>
            ` : ''}
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
                                <span class="badge" style="background:var(--bg-tertiary); color:var(--text-secondary)">ระดับบัณฑิตศึกษา</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="card animate-in animate-delay-5" style="background: var(--bg-tertiary); text-align:center; padding: 24px;">
            <p>หมายเหตุ: แผนการศึกษาอาจมีการเปลี่ยนแปลงตามความเหมาะสมของสภาพการณ์ปัจจุบัน โปรดปรึกษาอาจารย์ที่ปรึกษาอย่างสม่ำเสมอ</p>
        </div>
    </div>`;
};

window.openStudyPlanModal = function(planId, planName) {
    // Create a mock student profile to get the newest (Cohort 66+) curriculum for preview
    const mockStudent = { studentId: '660000', program: planId };
    const planInfo = window.getStudyPlanForStudent(mockStudent);
    
    let mockPlanData = planInfo.data;
    let degreeTitle = planInfo.title;

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
                <button class="btn btn-primary" onclick="closeModal()">รับทราบและปิด</button>
            </div>
        </div>
    `;

    openModal('รายละเอียดแผนการจัดการเรียนรู้', html);
};

window.exportStudyPlanTemplate = function() {
    const headers = ['ID','ชื่อแผนการศึกษา','ไอคอน','รายละเอียด','โค้ดสี'];
    const sample = ['nursing-gen','สาขาวิชาพยาบาลศาสตร์ทั่วไป (ป.โท)','🏥','แสดงแผนการศึกษาในหลักสูตรพยาบาลศาสตรมหาบัณฑิตที่มีการปรับปรุงล่าสุด','var(--accent-primary)'];
    downloadCSVTemplate('template_แผนการศึกษา.csv', headers, sample);
};

window.importStudyPlan = function() {
    handleGenericCSVImport((data) => {
        if (data && data.length > 0) {
            data.forEach(row => {
                const newPlan = {
                    id: row['ID'] || ('plan-' + Math.random().toString(36).substr(2, 9)),
                    name: row['ชื่อแผนการศึกษา'] || '',
                    icon: row['ไอคอน'] || '🏥',
                    description: row['รายละเอียด'] || '',
                    color: row['โค้ดสี'] || 'var(--accent-primary)'
                };
                if (newPlan.name) {
                    MOCK.studyPlans.push(newPlan);
                }
            });
            alert(`นำเข้าแผนการศึกษาสำเร็จจำนวน ${data.length} รายการ`);
            renderPage();
        }
    });
};
