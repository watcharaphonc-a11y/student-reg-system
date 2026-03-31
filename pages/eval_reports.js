// ============================
// Evaluation Reports Dashboard (Admin/Staff only)
// ============================

pages['eval-reports'] = function() {
    // 1. Base Data Collections
    const evals = MOCK.evaluations || [];
    const courses = MOCK.courses || [];
    const allEvalQuestions = MOCK.evalQuestions || [];
    const instructorQuestions = MOCK.evalInstructorQuestions || [];
    const courseInstructors = MOCK.courseInstructors || [];

    // Pre-calculate basic stats
    const totalEvals = evals.length;
    const courseEvalsCount = evals.filter(e => e.type === 'course').length;
    const instructorEvalsCount = evals.filter(e => e.type === 'instructor' && !e.skipped).length;

    // Filter Controls HTML
    const uniqueCourses = [...new Set(evals.map(e => e.courseCode))].filter(c => c);
    
    // Create UI Structure
    return `
    <div class="animate-in">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
                <h1 class="page-title">รายงานผลการประเมิน</h1>
                <p class="page-subtitle">รายงานสรุปผลสัมฤทธิ์ระดับรายวิชาและการประเมินผู้สอน มคอ.5 (AUN-QA v4)</p>
            </div>
            <div style="display:flex; gap:12px;">
                <select id="evalReportCourseFilter" class="form-control" style="width:250px;" onchange="renderEvalReports()">
                    <option value="all">-- ทุกรายวิชา (All Courses) --</option>
                    ${uniqueCourses.map(code => {
                        const name = (courses.find(c => c.code === code) || {}).name || '';
                        return `<option value="${code}">${window.formatDisplayCode(code)} ${name}</option>`;
                    }).join('')}
                </select>
                <button class="btn btn-primary" onclick="printEvalReport()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    พิมพ์รายงาน
                </button>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 24px;">
            <div class="stat-card">
                <div class="stat-icon purple"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div>
                <div class="stat-value" id="statTotalEvals">${totalEvals}</div>
                <div class="stat-label">ชุดประเมินทั้งหมด</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg></div>
                <div class="stat-value" id="statCourseEvals">${courseEvalsCount}</div>
                <div class="stat-label">ประเมินรายวิชาแล้ว</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg></div>
                <div class="stat-value" id="statInstructorEvals">${instructorEvalsCount}</div>
                <div class="stat-label">ประเมินผู้สอนแล้ว</div>
            </div>
        </div>

        <!-- Render Target for Filtered Content -->
        <div id="evalReportsContainer">
            <!-- Populated via renderEvalReports() -->
        </div>
    </div>
    
    <style>
        .report-section {
            background: white;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: var(--shadow-sm);
        }
        .report-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid var(--bg-tertiary);
        }
        .report-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
        }
        .score-bar-container {
            width: 100%;
            height: 12px;
            background: var(--bg-tertiary);
            border-radius: 6px;
            margin-top: 8px;
            overflow: hidden;
        }
        .score-bar {
            height: 100%;
            border-radius: 6px;
            transition: width 0.5s ease;
        }
        .data-table th {
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.5px;
        }
        @media print {
            .sidebar, .header, select, button { display: none !important; }
            .app { padding: 0 !important; }
            .main-content { margin: 0 !important; width: 100% !important; }
            .report-section { box-shadow: none; border: 1px solid #ddd; break-inside: avoid; }
        }
    </style>
    
    <script>
        // Trigger initial render after short delay to ensure DOM is ready
        setTimeout(renderEvalReports, 100);
    </script>
    `;
};

// Global render function
window.renderEvalReports = function() {
    const container = document.getElementById('evalReportsContainer');
    const courseFilterStr = document.getElementById('evalReportCourseFilter') ? document.getElementById('evalReportCourseFilter').value : 'all';
    
    if (!container) return; // Prevent run if page navigated away

    const evals = MOCK.evaluations || [];
    
    // Determine which evaluations to process
    let filteredEvals = evals;
    if (courseFilterStr !== 'all') {
        filteredEvals = evals.filter(e => e.courseCode === courseFilterStr);
    }

    // Update Top Stats
    const selTotal = filteredEvals.length;
    const selCourse = filteredEvals.filter(e => e.type === 'course').length;
    const selInst = filteredEvals.filter(e => e.type === 'instructor' && !e.skipped).length;
    
    if(document.getElementById('statTotalEvals')) document.getElementById('statTotalEvals').textContent = selTotal;
    if(document.getElementById('statCourseEvals')) document.getElementById('statCourseEvals').textContent = selCourse;
    if(document.getElementById('statInstructorEvals')) document.getElementById('statInstructorEvals').textContent = selInst;

    // --- Data Aggregations ---
    
    // 1. Course Satisfaction (CLO/LLO and Structure)
    let courseScoreSums = {};
    let courseScoreCounts = {};
    let allComments = [];

    // 2. Instructor Performance
    let instScoreSums = {}; // format: { instId: { qId: sum } }
    let instScoreCounts = {};

    filteredEvals.forEach(e => {
        // Collect comments
        if (e.comment && String(e.comment).trim() !== '') {
            allComments.push({
                type: e.type,
                course: e.courseCode,
                instructor: e.instructor || '-',
                text: e.comment,
                date: e.date
            });
        }

        let scoresDict = {};
        try {
            scoresDict = typeof e.scores === 'string' ? JSON.parse(e.scores) : e.scores;
        } catch (err) { console.error('Error parsing scores', e); }

        if (e.type === 'course') {
            for (let qId in scoresDict) {
                if (!courseScoreSums[qId]) { courseScoreSums[qId] = 0; courseScoreCounts[qId] = 0; }
                courseScoreSums[qId] += parseFloat(scoresDict[qId] || 0);
                courseScoreCounts[qId]++;
            }
        } else if (e.type === 'instructor' && !e.skipped) {
            let iId = e.instructor;
            if (!instScoreSums[iId]) { instScoreSums[iId] = {}; instScoreCounts[iId] = {}; }
            
            for (let qId in scoresDict) {
                if (!instScoreSums[iId][qId]) { instScoreSums[iId][qId] = 0; instScoreCounts[iId][qId] = 0; }
                instScoreSums[iId][qId] += parseFloat(scoresDict[qId] || 0);
                instScoreCounts[iId][qId]++;
            }
        }
    });

    // Resolve course questions
    const courseQuestionsToRender = [];
    Object.keys(courseScoreSums).forEach(qId => {
        const qData = (MOCK.evalQuestions || []).find(q => String(q.question_id) === String(qId)) || { question_text: 'ระบบ: คำถามข้อ ' + qId, section: 'ทั่วไป' };
        courseQuestionsToRender.push({
            id: qId,
            text: qData.question_text,
            section: qData.section || qData.category || 'ทั่วไป',
            avg: (courseScoreSums[qId] / courseScoreCounts[qId]).toFixed(2),
            count: courseScoreCounts[qId]
        });
    });

    // Group by section for UI
    const courseSections = {};
    courseQuestionsToRender.forEach(q => {
        if (!courseSections[q.section]) courseSections[q.section] = { name: q.section, totalAvg: 0, items: [] };
        courseSections[q.section].items.push(q);
    });
    
    // Resolve instructor questions
    let instHtml = '';
    const instQuestionsDict = {};
    (MOCK.evalInstructorQuestions || []).forEach(q => { instQuestionsDict[String(q.question_id)] = q.question_text; });

    Object.keys(instScoreSums).forEach(instId => {
        const teacher = (MOCK.academicAdvisors || []).find(t => String(t.username) === instId) || { name: instId };
        
        let iRows = '';
        let totalSum = 0;
        let totalCount = 0;

        Object.keys(instScoreSums[instId]).forEach(qId => {
            const avg = (instScoreSums[instId][qId] / instScoreCounts[instId][qId]).toFixed(2);
            const qtext = instQuestionsDict[qId] || 'ข้อ ' + qId;
            totalSum += parseFloat(avg);
            totalCount++;
            
            let color = 'var(--success)';
            if (avg < 3.5) color = 'var(--warning)';
            if (avg < 2.5) color = 'var(--danger)';

            iRows += `
                <tr>
                    <td style="font-size:0.9rem;">${qtext}</td>
                    <td style="text-align:center; font-weight:600;">${avg}</td>
                    <td style="width:200px;">
                        <div class="score-bar-container" style="margin:0;">
                            <div class="score-bar" style="width:${(avg/5)*100}%; background:${color};"></div>
                        </div>
                    </td>
                </tr>
            `;
        });

        const overallAvg = totalCount > 0 ? (totalSum / totalCount).toFixed(2) : '0.00';

        instHtml += `
            <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 12px 0; color:var(--text-primary); display:flex; justify-content:space-between;">
                    <span>อาจารย์: ${teacher.name}</span>
                    <span class="badge ${overallAvg >= 3.5 ? 'success' : 'warning'}">เฉลี่ยรวม: ${overallAvg}/5.00</span>
                </h4>
                <table class="data-table">
                    <thead><tr><th>หัวข้อการประเมิน</th><th style="width:100px;text-align:center;">คะแนนเฉลี่ย</th><th>กราฟ</th></tr></thead>
                    <tbody>${iRows}</tbody>
                </table>
            </div>
        `;
    });

    if(!instHtml) instHtml = '<div style="color:var(--text-muted); text-align:center; padding:20px;">ไม่มีข้อมูลการประเมินอาจารย์</div>';

    // Build the final HTML layout
    let html = '';
    
    // --- 1. AUN-QA Course Achievement Matrix ---
    html += `
        <div class="report-section animate-in animate-delay-2">
            <div class="report-header">
                <div class="stat-icon purple" style="width:36px; height:36px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20v-6M6 20V10M18 20V4"/></svg></div>
                <div>
                    <h2 class="report-title">รายงานผลสัมฤทธิ์รายวิชา (Course Achievement)</h2>
                    <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">ตามเกณฑ์ AUN-QA v4 ด้านโครงสร้างหลักสูตร, CLO และ LLO</p>
                </div>
            </div>
    `;
    
    if (Object.keys(courseSections).length === 0) {
        html += '<div style="color:var(--text-muted); text-align:center; padding:20px;">ไม่มีข้อมูลผลประเมินรายวิชาในส่วนนี้</div>';
    } else {
        Object.keys(courseSections).forEach(secKey => {
            const sec = courseSections[secKey];
            sec.items.sort((a,b) => parseInt(a.id) - parseInt(b.id)); // sort by ID if possible
            
            // Calc section avg
            let secSum = 0; sec.items.forEach(i => secSum += parseFloat(i.avg));
            sec.totalAvg = (secSum / sec.items.length).toFixed(2);

            let secColor = 'var(--primary)';
            if (secKey.toLowerCase().includes('clo') || secKey.toLowerCase().includes('llo') || secKey.includes('ผลลัพธ์')) secColor = 'var(--success)';

            html += `
                <div style="margin-bottom: 24px;">
                    <h4 style="margin: 0 0 12px 0; color:var(--text-primary); display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed var(--border-color); padding-bottom:8px;">
                        <span>หมวดหมู่: <span style="color:${secColor}">${sec.name}</span></span>
                        <span style="font-size:0.9rem; font-weight:600; color:var(--text-muted);">คะแนนเฉลี่ยหมวด: <strong>${sec.totalAvg}</strong>/5.00</span>
                    </h4>
                    <table class="data-table">
                        <thead><tr><th style="width:50px;">ข้อ</th><th>รายละเอียด</th><th style="width:100px;text-align:center;">เฉลี่ย</th><th style="width:150px;">อัตราความสำเร็จ</th></tr></thead>
                        <tbody>
                            ${sec.items.map(item => {
                                let color = 'var(--success)';
                                if (parseFloat(item.avg) < 3.5) color = 'var(--warning)';
                                if (parseFloat(item.avg) < 2.5) color = 'var(--danger)';
                                return `
                                <tr>
                                    <td style="color:var(--text-muted);">${item.id}</td>
                                    <td style="font-size:0.95rem;">${item.text}</td>
                                    <td style="text-align:center; font-weight:700;">${item.avg}</td>
                                    <td>
                                        <div class="score-bar-container" style="margin:0; height:8px;">
                                            <div class="score-bar" style="width:${(item.avg/5)*100}%; background:${color};"></div>
                                        </div>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        });
    }
    html += `</div>`;


    // --- 2. Instructor Performance ---
    html += `
        <div class="report-section animate-in animate-delay-3">
            <div class="report-header">
                <div class="stat-icon orange" style="width:36px; height:36px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                <div>
                    <h2 class="report-title">รายงานประเมินคุณภาพอาจารย์ผู้สอน (Instructor Performance)</h2>
                    <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">ตามเกณฑ์ AUN-QA v4 ด้านศักยภาพของบุคลากรสายวิชาการ</p>
                </div>
            </div>
            ${instHtml}
        </div>
    `;

    // --- 3. Qualitative Feedback (CQI) ---
    html += `
        <div class="report-section animate-in animate-delay-4">
            <div class="report-header">
                <div class="stat-icon green" style="width:36px; height:36px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <div>
                    <h2 class="report-title">สรุปข้อเสนอแนะเพื่อการพัฒนา (Qualitative Feedback)</h2>
                    <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">ข้อมูลสนับสนุนสำหรับกระบวนการ Continuous Quality Improvement (CQI)</p>
                </div>
            </div>
            ${allComments.length === 0 ? '<div style="color:var(--text-muted); text-align:center; padding:20px;">ไม่มีข้อมูลข้อเสนอแนะ</div>' : `
            <table class="data-table">
                <thead><tr><th style="width:120px;">รหัสวิชา</th><th style="width:150px;">อาจารย์ผู้สอน</th><th>ข้อเสนอแนะ</th><th style="width:120px;">วันที่</th></tr></thead>
                <tbody>
                    ${allComments.map(c => `
                        <tr>
                            <td style="font-weight:600; color:var(--accent-primary)">${c.course}</td>
                            <td>${c.instructor !== '-' ? (MOCK.academicAdvisors.find(a=>a.username===c.instructor)?.name || c.instructor) : '-'}</td>
                            <td style="white-space:pre-wrap; font-size:0.95rem;">${c.text}</td>
                            <td style="font-size:0.85rem; color:var(--text-muted);">${c.date ? new Date(c.date).toLocaleDateString('th-TH') : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            `}
        </div>
    `;

    container.innerHTML = html;
};

window.printEvalReport = function() {
    window.print();
};
