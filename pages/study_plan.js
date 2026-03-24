// ============================
// Study Plan Page (Faculty of Nursing, PBRI)
// ============================

// ============================
// Study Plan Page (Faculty of Nursing, PBRI)
// ============================

window.getStudyPlanForStudent = function(student) {
    if (!student) return { title: "ไม่พบข้อมูล", data: [] };
    
    // Determine admission cohort from student ID (e.g., '65', '66')
    const studentIdStr = String(student.studentId || student.id || '');
    const cohort = studentIdStr.substring(0, 2);
    const isCohort65 = (cohort === '65');
    
    // Determine major from department string
    const dept = String(student.department || '').toLowerCase();
    
    let planData = [];
    let degreeTitle = "หลักสูตรพยาบาลศาสตรมหาบัณฑิต (ปริญญาโท)";
    
    if (dept.includes('ผู้ใหญ่') || student.program === 'nursing-adult') {
        if (isCohort65) {
            planData = [
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 11, courses: ['0100500101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', '0100500102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '0100504105 พยาธิสรีรวิทยาและเภสัชวิทยาทางการพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)', '0100504106 การพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 5, courses: ['0100500104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100504107 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 1 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 8, courses: ['0100500103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '0100504108 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 2 3 (0-9-3)', '0100500115 การวิจัยเชิงคุณภาพ 3 (3-0-6)'] },
                { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 4, courses: ['xxxxxxx วิชาเลือกเสรี 3 (x-x-x)', '0100500217 วิทยานิพนธ์ 1 (0-3-1)'] } // Added generic elective to fulfill requirement
            ];
        } else {
            // Cohort 66+ (starts Y1S1)
            planData = [
                { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 11, courses: ['0100500101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', '0100500102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '0100504105 พยาธิสรีรวิทยาและเภสัชวิทยาทางการพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)', '0100504106 การพยาบาลผู้ใหญ่และผู้สูงอายุ 3 (3-0-6)'] },
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 10, courses: ['0100500104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '0100504107 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 1 3 (0-9-3)', '0100500103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '0100500110 การเรียนการสอนทางการพยาบาล 3 (3-0-6)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 3, courses: ['0100504108 ปฏิบัติการพยาบาลผู้ใหญ่และผู้สูงอายุ 2 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 4, courses: ['xxxxxxx วิชาเลือกเสรี 3 (x-x-x)', '0100500217 วิทยานิพนธ์ 1 (0-3-1)'] }
            ];
        }
    } else if (dept.includes('ชุมชน') || student.program === 'nursing-community') {
        if (isCohort65) {
            planData = [
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 11, courses: ['100500101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', '100500102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '100509105 การประเมินสุขภาพขั้นสูงและเภสัชวิทยาสำหรับการรักษาโรคเบื้องต้น 2 (1-2-3)', '100509106 การพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัว ที่มีปัญหาสุขภาพซับซ้อน 2 (2-0-4)', '100509107 การพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 2 (2-0-4)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 5, courses: ['100500104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '100509108 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวที่มีปัญหาสุขภาพซับซ้อน 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 8, courses: ['0100500103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '0100504109 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 3 (0-9-3)', '0100500110 การเรียนการสอนทางการพยาบาล 3 (3-0-6)'] },
                { year: 2, sem: 2, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 2', credits: 4, courses: ['xxxxxxx วิชาเลือกเสรี 3 (x-x-x)', '0100500217 วิทยานิพนธ์ 1 (0-3-1)'] }
            ];
        } else {
            planData = [
                { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 11, courses: ['100500101 ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล จริยธรรมและกฎหมายสุขภาพ 3 (3-0-6)', '100500102 ทฤษฎีและแนวคิดทางการพยาบาล 2 (2-0-4)', '100509105 การประเมินสุขภาพขั้นสูงและเภสัชวิทยาสำหรับการรักษาโรคเบื้องต้น 2 (1-2-3)', '100509106 การพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัว ที่มีปัญหาสุขภาพซับซ้อน 2 (2-0-4)', '100509107 การพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 2 (2-0-4)'] },
                { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 10, courses: ['100500104 สถิติประยุกต์ในการวิจัยทางการพยาบาล 2 (1-2-3)', '100509108 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนในการดูแลบุคคลและครอบครัวที่มีปัญหาสุขภาพซับซ้อน 3 (0-9-3)', '0100500103 วิจัยและหลักฐานเชิงประจักษ์ทางการพยาบาล 2 (2-0-4)', '0100500110 การเรียนการสอนทางการพยาบาล 3 (3-0-6)'] },
                { year: 1, sem: 3, title: 'ชั้นปีที่ 1 ภาคฤดูร้อน', credits: 3, courses: ['0100504109 ปฏิบัติการพยาบาลเวชปฏิบัติชุมชนกับการพัฒนาระบบบริการสุขภาพชุมชน 3 (0-9-3)'] },
                { year: 2, sem: 1, title: 'ชั้นปีที่ 2 ภาคการศึกษาที่ 1', credits: 4, courses: ['xxxxxxx วิชาเลือกเสรี 3 (x-x-x)', '0100500217 วิทยานิพนธ์ 1 (0-3-1)'] }
            ];
        }
    } else {
        // Fallback generic plan
        planData = [
            { year: 1, sem: 1, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 1', credits: 12, courses: ['01005000101 ระบบสุขภาพ ภาวะผู้นำ 3 (3-0-6)', '01005000102 ทฤษฎีและแนวคิด 2 (2-0-4)', '01005000103 วิชาแกนสาขา 1 2 (2-0-4)', '01005000104 สถิติประยุกต์ 2 (1-2-3)', 'xxxxxxxxxxx วิชาเลือกเสรี 3 (3-0-6)'] },
            { year: 1, sem: 2, title: 'ชั้นปีที่ 1 ภาคการศึกษาที่ 2', credits: 9, courses: ['0100500104 วิจัยและหลักฐานเชิงประจักษ์ 2 (2-0-4)', '0100500105 ปฏิบัติการพยาบาล 1 3 (0-9-3)', '0100500106 สัมมนา 1 (0-2-1)', '0100500107 วิชาเลือกเสรี 3 (3-0-6)'] }
        ];
    }
    
    return { title: degreeTitle, data: planData };
};

pages['study-plan'] = function() {
    const plans = MOCK.studyPlans || [];

    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
                <h1 class="page-title">แผนการศึกษา (Study Plan)</h1>
                <p class="page-subtitle">คณะพยาบาลศาสตร์ สถาบันพระบรมราชชนก (การพยาบาลเฉพาะทาง 6 สาขา)</p>
            </div>
            ${(window.currentUserRole === 'staff' || window.currentUserRole === 'admin') ? `
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" onclick="exportStudyPlanTemplate()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Template
                </button>
                <button class="btn btn-primary" onclick="importStudyPlan()" style="gap:6px; font-size:0.85rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    นำเข้าข้อมูล
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
                <button class="btn btn-primary" onclick="closeModal()">ปิดหน้าต่าง</button>
            </div>
        </div>
    `;

    openModal('รายละเอียดแผนการศึกษา', html);
};

window.exportStudyPlanTemplate = function() {
    const headers = ['ID','ชื่อแผนการศึกษา','ไอคอน','คำอธิบาย','รหัสสี'];
    const sample = ['nursing-gen','สาขาวิชาพยาบาลศาสตร์ทั่วไป (ป.ตรี)','🏥','หลักสูตรพยาบาลศาสตรบัณฑิตเน้นการดูแลสุขภาพขั้นพื้นฐานและวิชาชีพ','var(--accent-primary)'];
    downloadCSVTemplate('template_แผนการศึกษา.csv', headers, sample);
};

window.importStudyPlan = function() {
    handleGenericCSVImport((data) => {
        if (data && data.length > 0) {
            data.forEach(row => {
                const newPlan = {
                    id: row['ID'] || ('plan-' + Math.random().toString(36).substr(2, 9)),
                    name: row['ชื่อแผนการศึกษา'] || '',
                    icon: row['ไอคอน'] || '📖',
                    description: row['คำอธิบาย'] || '',
                    color: row['รหัสสี'] || 'var(--accent-primary)'
                };
                if (newPlan.name) {
                    MOCK.studyPlans.push(newPlan);
                }
            });
            alert(`นำเข้าแผนการศึกษาสำเร็จ ${data.length} รายการ`);
            renderPage();
        }
    });
};
