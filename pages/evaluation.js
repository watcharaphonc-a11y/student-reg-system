// ============================
// Course Evaluation Page (ประเมินการจัดการเรียนการสอนของรายวิชา)
// ============================
pages['eval-course'] = function() {
    const evals = MOCK.evaluations || [];
    const enrolled = MOCK.enrolledCourses || [];
    const total = enrolled.length;
    const completed = enrolled.filter(c => evals.some(e => e.courseCode === c.code && e.type === 'course')).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ประเมินการจัดการเรียนการสอนของรายวิชา</h1>
            <p class="page-subtitle">ประเมินคุณภาพของรายวิชา เนื้อหา สื่อการเรียน และการจัดการเรียนการสอน</p>
        </div>
        
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 24px;">
            <div class="stat-card animate-in animate-delay-1">
                <div class="stat-icon purple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div class="stat-value">${total}</div>
                <div class="stat-label">รายวิชาทั้งหมด</div>
            </div>
            <div class="stat-card animate-in animate-delay-2">
                <div class="stat-icon green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div class="stat-value" style="color:var(--success)">${completed}</div>
                <div class="stat-label">ประเมินแล้ว</div>
            </div>
            <div class="stat-card animate-in animate-delay-3">
                <div class="stat-icon orange">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="stat-value" style="color:var(--warning)">${pending}</div>
                <div class="stat-label">รอการประเมิน</div>
            </div>
        </div>

        <div class="card animate-in animate-delay-4">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3 class="card-title">รายวิชาที่ลงทะเบียน — ภาคฤดูร้อน/2568</h3>
                <div style="display:flex;align-items:center;gap:12px;font-size:0.9rem;">
                    <span style="color:var(--text-muted)">ความคืบหน้า:</span>
                    <div style="width:100px;height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;">
                        <div style="width:${percent}%;height:100%;background:var(--success);border-radius:4px;"></div>
                    </div>
                    <span style="font-weight:600">${percent}%</span>
                </div>
            </div>
            <div class="card-body" style="padding:0">
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr><th>รหัสวิชา</th><th>ชื่อวิชา</th><th>หน่วยกิต</th><th>สถานะ</th><th>การดำเนินการ</th></tr>
                        </thead>
                        <tbody>
                            ${enrolled.map(course => {
                                const isEval = evals.find(e => e.courseCode === course.code && e.type === 'course');
                                return `
                                <tr>
                                    <td style="font-weight:600;color:var(--accent-primary)">${course.code}</td>
                                    <td>${course.name}</td>
                                    <td style="text-align:center">${course.credits || '-'}</td>
                                    <td>
                                        ${isEval 
                                            ? '<span class="badge success">ประเมินแล้ว</span>' 
                                            : '<span class="badge warning">รอการประเมิน</span>'}
                                    </td>
                                    <td>
                                        ${isEval
                                            ? `<button class="btn btn-sm" disabled style="opacity:0.5;cursor:not-allowed">ประเมินแล้ว ✓</button>`
                                            : `<button class="btn btn-primary btn-sm" onclick="openCourseEvalModal('${course.code}', '${course.name}', '${course.instructor || '-'}')">ประเมินรายวิชา</button>`
                                        }
                                    </td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
};

// ============================
// Instructor Evaluation Page (ประเมินอาจารย์ผู้สอน)
// ============================
pages['eval-instructor'] = function() {
    const evals = MOCK.evaluations || [];
    const enrolled = MOCK.enrolledCourses || [];
    
    // Evaluate per-instructor-per-course
    const evalItems = enrolled.filter(c => c.availableInstructors && c.availableInstructors.length > 0);
    
    let totalInstructors = 0;
    let completedInstructors = 0;

    evalItems.forEach(item => {
        item.availableInstructors.forEach(ins => {
            totalInstructors++;
            if (evals.some(e => e.instructor === ins && e.courseCode === item.code && e.type === 'instructor')) {
                completedInstructors++;
            }
        });
    });
    
    const pendingInstructors = totalInstructors - completedInstructors;

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ประเมินอาจารย์ผู้สอน</h1>
            <p class="page-subtitle">แสดงรายการวิชาและรายชื่ออาจารย์ผู้สอนทั้งหมด ให้นักศึกษาเลือกประเมินเฉพาะอาจารย์ที่ตนเองเรียนด้วย</p>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 24px;">
            <div class="stat-card animate-in animate-delay-1">
                <div class="stat-icon purple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div class="stat-value">${totalInstructors}</div>
                <div class="stat-label">รายการประเมินทั้งหมด</div>
            </div>
            <div class="stat-card animate-in animate-delay-2">
                <div class="stat-icon green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div class="stat-value" style="color:var(--success)">${completedInstructors}</div>
                <div class="stat-label">ประเมินแล้ว</div>
            </div>
            <div class="stat-card animate-in animate-delay-3">
                <div class="stat-icon orange">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="stat-value" style="color:var(--warning)">${pendingInstructors}</div>
                <div class="stat-label">รอการประเมิน</div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr; gap:20px;">
        ${evalItems.map((item, idx) => {
            return `
            <div class="card animate-in animate-delay-${Math.min(idx+2,4)}">
                <div class="card-body">
                    <div style="margin-bottom:16px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <span style="font-weight:600; font-size:1.15rem; color:var(--accent-primary);">${item.code}</span>
                        <span style="font-size:1.1rem; margin-left:8px;">${item.name}</span>
                        <p style="margin:4px 0 0; font-size:0.85rem; color:var(--text-muted)">เลือกประเมินเฉพาะอาจารย์ที่ท่านเรียนด้วยในวิชานี้</p>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:12px;">
                    ${item.availableInstructors.map(ins => {
                        const isEval = evals.find(e => e.instructor === ins && e.courseCode === item.code && e.type === 'instructor');
                        return `
                        <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:var(--bg-secondary); border-radius:var(--radius-sm); border: 1px solid ${isEval ? 'var(--success)' : 'transparent'};">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div style="width:40px;height:40px;border-radius:50%;background:${isEval ? 'var(--success)' : 'var(--border-color)'};display:flex;align-items:center;justify-content:center;color:${isEval ? 'white' : 'var(--text-muted)'};font-weight:600;font-size:1rem;">${ins[0]}</div>
                                <div>
                                    <div style="font-weight:600; font-size:0.95rem; color:${isEval ? 'var(--success)' : 'inherit'};">${ins}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
                                        ${isEval ? '<span style="color:var(--success)">✓ ทำการประเมินแล้ว</span>' : 'ยังไม่ได้ประเมิน'}
                                    </div>
                                </div>
                            </div>
                            <div>
                                ${isEval 
                                    ? `<button class="btn btn-sm" disabled style="opacity:0.5; background:var(--success); color:white; border:none; cursor:not-allowed;">ประเมินแล้ว</button>`
                                    : `<button class="btn btn-primary btn-sm" onclick="openInstructorEvalModal('${ins.replace(/'/g,"\\'")}', '${item.code}', '${item.name.replace(/'/g,"\\'")}')">ทำแบบประเมิน</button>`
                                }
                            </div>
                        </div>`;
                    }).join('')}
                    </div>
                </div>
            </div>`;
        }).join('')}
        </div>
    </div>`;
};

// ============================
// Shared Evaluation Modal Logic
// ============================
let currentEval = {};

// Dynamic criteria from MOCK data (can be imported via CSV)
function getCourseEvalCriteria() {
    return (MOCK.courseEvalQuestions || [
        { id: 1, question: 'ความเหมาะสมของเนื้อหารายวิชา' },
        { id: 2, question: 'ความชัดเจนของวัตถุประสงค์รายวิชา' },
        { id: 3, question: 'ความเหมาะสมของสื่อการเรียนการสอน' },
        { id: 4, question: 'ความเหมาะสมของวิธีการวัดผลประเมินผล' },
        { id: 5, question: 'ความพึงพอใจโดยรวมต่อรายวิชา' }
    ]).map(q => q.question);
}

function getInstructorEvalCriteria() {
    return (MOCK.instructorEvalQuestions || [
        { id: 1, question: 'การเตรียมความพร้อมในการสอน' },
        { id: 2, question: 'ความสามารถในการถ่ายทอดความรู้' },
        { id: 3, question: 'การเปิดโอกาสให้ผู้เรียนมีส่วนร่วม' },
        { id: 4, question: 'การให้คำปรึกษานอกเวลาเรียน' },
        { id: 5, question: 'ความตรงต่อเวลาในการสอน' },
        { id: 6, question: 'ความพึงพอใจโดยรวมต่ออาจารย์ผู้สอน' }
    ]).map(q => q.question);
}

window.openCourseEvalModal = function(code, name, instructor) {
    currentEval = { code, name, instructor, type: 'course', scores: {} };
    const criteria = getCourseEvalCriteria();
    
    const modalHtml = `
        <div style="padding:8px">
            <div style="background:var(--bg-tertiary);padding:16px;border-radius:var(--radius-md);margin-bottom:20px;">
                <p style="margin:0 0 4px;font-size:0.82rem;color:var(--text-muted)">ประเมินรายวิชา:</p>
                <div style="font-weight:600;font-size:1.1rem;color:var(--accent-primary)">${code} ${name}</div>
                <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">อาจารย์ผู้สอน: ${instructor}</div>
            </div>
            ${criteria.map((c, i) => `
                <div style="margin-bottom:16px;">
                    <label style="font-size:0.9rem; font-weight:500; display:block; margin-bottom:6px;">${i+1}. ${c}</label>
                    <div style="display:flex;gap:6px;" id="evalStars_${i}">
                        ${[1,2,3,4,5].map(s => `
                            <button type="button" onclick="setEvalCriteriaScore(${i},${s})" 
                                    style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--border-color);transition:transform 0.15s;"
                                    onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">☆</button>
                        `).join('')}
                        <span id="evalScoreLabel_${i}" style="font-size:0.8rem; color:var(--text-muted); margin-left:8px; align-self:center;"></span>
                    </div>
                </div>
            `).join('')}
            <div class="form-group" style="margin-top:8px;">
                <label class="form-label">ข้อเสนอแนะเพิ่มเติม</label>
                <textarea id="evalComment" class="form-textarea" placeholder="สิ่งที่ควรปรับปรุงหรือข้อเสนอแนะ..." rows="3"></textarea>
            </div>
            <button class="btn btn-primary" style="width:100%;margin-top:16px;font-size:1rem;" onclick="submitCourseEval()">ส่งแบบประเมินรายวิชา</button>
        </div>
    `;
    openModal('ประเมินการจัดการเรียนการสอน', modalHtml);
};

window.openInstructorEvalModal = function(instructor, courseCode, courseName) {
    currentEval = { instructor, courseCode, courseName, type: 'instructor', scores: {} };
    const criteria = getInstructorEvalCriteria();
    
    const modalHtml = `
        <div style="padding:8px">
            <div style="background:var(--bg-tertiary);padding:16px;border-radius:var(--radius-md);margin-bottom:20px;">
                <p style="margin:0 0 4px;font-size:0.82rem;color:var(--text-muted)">ประเมินอาจารย์ผู้สอน:</p>
                <div style="font-weight:600;font-size:1.1rem;color:var(--accent-primary)">${instructor}</div>
                <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">วิชาที่สอน: ${courseCode} ${courseName}</div>
            </div>
            ${criteria.map((c, i) => `
                <div style="margin-bottom:16px;">
                    <label style="font-size:0.9rem; font-weight:500; display:block; margin-bottom:6px;">${i+1}. ${c}</label>
                    <div style="display:flex;gap:6px;" id="evalStars_${i}">
                        ${[1,2,3,4,5].map(s => `
                            <button type="button" onclick="setEvalCriteriaScore(${i},${s})" 
                                    style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--border-color);transition:transform 0.15s;"
                                    onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">☆</button>
                        `).join('')}
                        <span id="evalScoreLabel_${i}" style="font-size:0.8rem; color:var(--text-muted); margin-left:8px; align-self:center;"></span>
                    </div>
                </div>
            `).join('')}
            <div class="form-group" style="margin-top:8px;">
                <label class="form-label">ข้อเสนอแนะเพิ่มเติม</label>
                <textarea id="evalComment" class="form-textarea" placeholder="สิ่งที่ชอบในการสอน หรือสิ่งที่ควรปรับปรุง..." rows="3"></textarea>
            </div>
            <button class="btn btn-primary" style="width:100%;margin-top:16px;font-size:1rem;" onclick="submitInstructorEval()">ส่งแบบประเมินอาจารย์</button>
        </div>
    `;
    openModal('ประเมินอาจารย์ผู้สอน', modalHtml);
};

const scoreLabels = ["ต้องปรับปรุง", "พอใช้", "ปานกลาง", "ดี", "ดีมาก"];

window.setEvalCriteriaScore = function(criteriaIdx, score) {
    currentEval.scores[criteriaIdx] = score;
    const container = document.getElementById('evalStars_' + criteriaIdx);
    if (!container) return;
    const stars = container.querySelectorAll('button');
    stars.forEach((btn, idx) => {
        btn.style.color = idx < score ? 'var(--warning)' : 'var(--border-color)';
        btn.innerHTML = idx < score ? '★' : '☆';
    });
    const label = document.getElementById('evalScoreLabel_' + criteriaIdx);
    if (label) label.textContent = scoreLabels[score - 1] + ' (' + score + ')';
};

window.submitCourseEval = async function() {
    const comment = document.getElementById('evalComment').value;
    showApiLoading('กำลังบันทึกผลการประเมินรายวิชา...');
    
    const payload = {
        type: 'course',
        studentId: MOCK.student ? (MOCK.student.studentId || MOCK.student.id) : 'Unknown',
        courseCode: currentEval.code,
        courseName: currentEval.name,
        instructor: currentEval.instructor, // Saved explicitly
        scores: currentEval.scores,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };

    await postData('submitEvaluation', payload);
    hideApiLoading();

    // Save locally regardless of API result
    if (!MOCK.evaluations) MOCK.evaluations = [];
    MOCK.evaluations.push(payload);
    closeModal();
    renderPage();
};

window.submitInstructorEval = async function() {
    const comment = document.getElementById('evalComment').value;
    showApiLoading('กำลังบันทึกผลการประเมินอาจารย์...');
    
    const payload = {
        type: 'instructor',
        studentId: MOCK.student ? (MOCK.student.studentId || MOCK.student.id) : 'Unknown',
        instructor: currentEval.instructor,
        courseCode: currentEval.courseCode,
        courseName: currentEval.courseName,
        scores: currentEval.scores,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };

    await postData('submitEvaluation', payload);
    hideApiLoading();

    // Save locally regardless of API result
    if (!MOCK.evaluations) MOCK.evaluations = [];
    MOCK.evaluations.push(payload);
    closeModal();
    renderPage();
};
