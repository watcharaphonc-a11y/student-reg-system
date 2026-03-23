// ============================
// Course Evaluation Page
// ============================
pages.evaluation = function() {
    // กำหนดให้ MOCK.evaluations เป็น array ว่างถ้าไม่มี
    const evals = MOCK.evaluations || [];
    const enrolled = MOCK.enrolledCourses || [];

    // นับสถิติ
    const total = enrolled.length;
    const completed = enrolled.filter(c => evals.some(e => e.courseCode === c.code)).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ประเมินการจัดการเรียนการสอน</h1>
            <p class="page-subtitle">แสดงความคิดเห็นและประเมินผลการสอนของอาจารย์ ภาคฤดูร้อน/2568</p>
        </div>
        
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 24px;">
            <div class="stat-card animate-in animate-delay-1">
                <div class="stat-icon purple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div class="stat-value">${total}</div>
                <div class="stat-label">วิชาทั้งหมดที่ต้องประเมิน</div>
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
                <h3 class="card-title">รายวิชาที่ลงทะเบียนประจำภาคเรียน</h3>
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
                            <tr>
                                <th>รหัสวิชา</th>
                                <th>ชื่อวิชา</th>
                                <th>อาจารย์ผู้สอน</th>
                                <th>สถานะ</th>
                                <th>การดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${enrolled.map(course => {
                                const isEval = evals.find(e => e.courseCode === course.code);
                                return `
                                <tr>
                                    <td style="font-weight:600;color:var(--accent-primary)">${course.code}</td>
                                    <td>${course.name}</td>
                                    <td>${course.instructor}</td>
                                    <td>
                                        ${isEval 
                                            ? '<span class="badge success">ประเมินแล้ว</span>' 
                                            : '<span class="badge warning">รอการประเมิน</span>'}
                                    </td>
                                    <td>
                                        ${isEval
                                            ? `<button class="btn btn-sm" disabled style="opacity:0.5;cursor:not-allowed">ประเมินแล้ว ✓</button>`
                                            : `<button class="btn btn-primary btn-sm" onclick="openEvalModal('${course.code}', '${course.name}', '${course.instructor}')">ประเมินวิชานี้</button>`
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

// Global object to temporarily hold state for the modal
let currentEval = {};

window.openEvalModal = function(code, name, instructor) {
    currentEval = { code, name, instructor, score: 5 };
    
    const modalHtml = `
        <div style="padding:8px">
            <div style="background:var(--bg-tertiary);padding:16px;border-radius:var(--radius-md);margin-bottom:20px;">
                <p style="margin:0 0 8px;font-size:0.9rem;color:var(--text-muted)">กำลังประเมิน:</p>
                <div style="font-weight:600;font-size:1.1rem;color:var(--accent-primary)">${code} ${name}</div>
                <div style="margin-top:4px;font-size:0.95rem;">อาจารย์: ${instructor}</div>
            </div>
            
            <div class="form-group">
                <label class="form-label" style="font-size:1rem;">ความพึงพอใจโดยรวม</label>
                <div style="display:flex;gap:12px;margin:12px 0;" id="starRating">
                    ${[1,2,3,4,5].map(i => `
                        <button type="button" onclick="setEvalScore(${i})" 
                                style="background:none;border:none;font-size:2rem;cursor:pointer;color:var(--warning);transition:transform 0.2s;"
                                onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                            ★
                        </button>
                    `).join('')}
                </div>
                <div id="scoreLabel" style="font-weight:600;color:var(--warning)">พอใจมากที่สุด (5)</div>
            </div>

            <div class="form-group" style="margin-top:24px;">
                <label class="form-label">ข้อเสนอแนะเพิ่มเติม (ถ้ามี)</label>
                <textarea id="evalComment" class="form-textarea" placeholder="สิ่งที่ชอบต่องานสอน หรือสิ่งที่ควรปรับปรุง..." rows="3"></textarea>
            </div>
            
            <button class="btn btn-primary" style="width:100%;margin-top:16px;font-size:1.05rem;" onclick="submitEvaluation()">ส่งแบบประเมิน</button>
        </div>
    `;
    
    openModal('ประเมินการจัดการเรียนการสอน', modalHtml);
    // Initialize stars visually
    window.setEvalScore(5);
};

window.setEvalScore = function(score) {
    currentEval.score = score;
    const labels = ["ต้องปรับปรุง (1)", "พอใช้ (2)", "ปานกลาง (3)", "ดี (4)", "พอใจมากที่สุด (5)"];
    
    const container = document.getElementById('starRating');
    if (!container) return;
    
    const stars = container.querySelectorAll('button');
    stars.forEach((btn, idx) => {
        if (idx < score) {
            btn.style.color = "var(--warning)";
            btn.innerHTML = "★";
        } else {
            btn.style.color = "var(--border-color)";
            btn.innerHTML = "☆";
        }
    });
    
    document.getElementById('scoreLabel').textContent = labels[score - 1];
};

window.submitEvaluation = async function() {
    const comment = document.getElementById('evalComment').value;
    
    showApiLoading('กำลังบันทึกผลการประเมิน...');
    
    const payload = {
        studentId: MOCK.student ? MOCK.student.id : 'Unknown',
        courseCode: currentEval.code,
        courseName: currentEval.name,
        instructor: currentEval.instructor,
        score: currentEval.score,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };

    const res = await postData('submitEvaluation', payload);
    hideApiLoading();

    if (res && res.status === 'success') {
        // Update local mock data to reflect changes immediately
        if (!MOCK.evaluations) MOCK.evaluations = [];
        MOCK.evaluations.push(payload);
        
        closeModal();
        renderPage(); // re-render UI
    } else {
        alert('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง');
    }
};
