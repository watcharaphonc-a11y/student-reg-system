// ============================
// Thesis Tracking Dashboard
// ============================

const THESIS_MILESTONES = [
    { id: 'M1', label: 'แต่งตั้งอาจารย์ที่ปรึกษา', icon: '👤', fields: [] },
    { id: 'M2', label: 'เสนอหัวข้อวิทยานิพนธ์', icon: '📝', fields: [] },
    { id: 'M3', label: 'สอบโครงร่างวิทยานิพนธ์', icon: '🎯', fields: [] },
    { id: 'M4', label: 'พิจารณาจริยธรรมการวิจัย (EC)', icon: '⚖️', fields: [{ id: 'EthicsNo', label: 'เลขรับรอง/อนุมัติ EC', type: 'text' }] },
    { id: 'M5', label: 'เก็บข้อมูล / วิจัย', icon: '🔍', fields: [] },
    { id: 'M6', label: 'วิเคราะห์ / เขียนรายงาน', icon: '📊', fields: [] },
    { id: 'M7', label: 'ตรวจสอบ Plagiarism', icon: '✅', fields: [{ id: 'PlagPercent', label: 'ค่าความออริจินัล (%)', type: 'number' }] },
    { id: 'M8', label: 'สอบป้องกันวิทยานิพนธ์', icon: '🛡️', fields: [{ id: 'Score', label: 'ผลประเมิน/คะแนนสอบ', type: 'text' }] },
    { id: 'M9', label: 'แก้ไขตามกรรมการสอบ', icon: '✍️', fields: [] },
    { id: 'M10', label: 'ส่งเล่มฉบับสมบูรณ์', icon: '📚', fields: [] },
    { id: 'M11', label: 'เผยแพร่ผลงาน (บทความ)', icon: '🌐', fields: [{ id: 'Journal', label: 'ชื่อวารสาร/สถานที่ตีพิมพ์', type: 'text' }] }
];

pages['thesis-tracking'] = function() {
    const role = window.currentUserRole;
    if (role === 'student') return renderStudentThesisTracking();
    if (role === 'admin' || role === 'teacher' || window.isSuperAdmin) return renderAdminThesisTracking();
    return `<div class="card"><div class="card-body" style="text-align:center; padding:40px;">ไม่มีสิทธิ์เข้าถึง</div></div>`;
};

function calculateProgress(progressObj) {
    if (!progressObj) return 0;
    const completed = THESIS_MILESTONES.filter(m => progressObj[`${m.id}_Status`] === 'Complete').length;
    return Math.round((completed / THESIS_MILESTONES.length) * 100);
}

function renderAdminThesisTracking() {
    const trackingData = MOCK.thesisProgress || [];
    // Only show students who are actually in the master's program (or in ThesisProgress sheet)
    // To be comprehensive, we list students from the students table, but if trackingData has records, we use those.
    const studentList = MOCK.students || [];

    // Combine tracking data with student master data
    const combinedData = studentList
        .filter(s => (s.program || '').includes('โท') || (s.program || '').includes('Master'))
        .map(student => {
            const track = trackingData.find(t => t.StudentID === student.studentId) || {};
            return {
                studentId: student.studentId,
                name: student.name || `${student.prefix||''}${student.firstName||''} ${student.lastName||''}`,
                major: student.major || track.Major || '-',
                cohort: student.cohort || track.Cohort || '-',
                advisor: track.AdvisorName || '-',
                progress: calculateProgress(track),
                lastUpdated: track.LastUpdated || '-',
                trackData: track
            };
        });

    const completionCount = combinedData.filter(d => d.progress === 100).length;
    const inProgressCount = combinedData.filter(d => d.progress > 0 && d.progress < 100).length;

    let rowsHTML = combinedData.length === 0 ? 
        '<tr><td colspan="5" style="text-align:center;">ไม่พบข้อมูลนักศึกษาปริญญาโท</td></tr>' :
        combinedData.map(d => `
        <tr>
            <td>
                <div style="font-weight:600;">${d.name}</div>
                <div style="font-size:0.85rem; color:var(--text-secondary);">${d.studentId} • รุ่น ${d.cohort}</div>
            </td>
            <td><div style="font-size:0.9rem;">${d.major}</div></td>
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="flex:1; height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden;">
                        <div style="height:100%; width:${d.progress}%; background:var(--accent-primary); border-radius:4px;"></div>
                    </div>
                    <span style="font-size:0.85rem; font-weight:600; width:40px; text-align:right;">${d.progress}%</span>
                </div>
            </td>
            <td><div style="font-size:0.85rem; color:var(--text-secondary);">${d.lastUpdated === '-' ? '-' : formatThaiDateShort(d.lastUpdated)}</div></td>
            <td>
                <button class="btn btn-sm" onclick='window.openThesisTrackingModal(${JSON.stringify(d).replace(/'/g, "&#39;")})' style="background:var(--accent-primary-light); color:var(--accent-primary); font-weight:600;">
                    อัปเดต / เรียกดู
                </button>
            </td>
        </tr>
    `).join('');

    return `
    <div class="animate-in">
        <div class="page-header" style="margin-bottom:24px;">
            <h1 class="page-title">ติดตามความก้าวหน้าวิทยานิพนธ์ Dashboard</h1>
            <p class="page-subtitle">แสดงภาพรวมและสถานะการทำวิทยานิพนธ์ของนักศึกษาระดับปริญญาโท</p>
        </div>

        <div class="grid-3" style="margin-bottom:24px;">
            <div class="card stat-card-glass" style="background:linear-gradient(45deg, #1e293b, #334155); color:white;">
                <div class="card-body">
                    <h3 style="font-size:1rem; font-weight:500; opacity:0.9; margin:0 0 10px;">นักศึกษาทั้งหมดในระบบ</h3>
                    <div style="font-size:2.5rem; font-weight:700;">${combinedData.length}</div>
                </div>
            </div>
            <div class="card stat-card-glass" style="background:linear-gradient(45deg, #3b82f6, #06b6d4); color:white;">
                <div class="card-body">
                    <h3 style="font-size:1rem; font-weight:500; opacity:0.9; margin:0 0 10px;">กำลังดำเนินการ</h3>
                    <div style="font-size:2.5rem; font-weight:700;">${inProgressCount}</div>
                </div>
            </div>
            <div class="card stat-card-glass" style="background:linear-gradient(45deg, #10b981, #059669); color:white;">
                <div class="card-body">
                    <h3 style="font-size:1rem; font-weight:500; opacity:0.9; margin:0 0 10px;">ผ่านครบ 11 ขั้นตอน</h3>
                    <div style="font-size:2.5rem; font-weight:700;">${completionCount}</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">รายชื่อนักศึกษาและสถานะความก้าวหน้า</h3>
            </div>
            <div class="card-body" style="padding:0;">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ชื่อ-นามสกุล / รหัส</th>
                                <th>สาขาวิชา</th>
                                <th style="width:250px;">ความก้าวหน้ารวม</th>
                                <th>อัปเดตล่าสุด</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHTML}</tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal อัปเดต Milestone -->
    <div id="thesisTrackingModal" class="modal" style="display:none;">
        <div class="modal-content" style="max-width:800px; max-height:90vh; overflow-y:auto;">
            <div class="modal-header">
                <h2>อัปเดตสถานะวิทยานิพนธ์</h2>
                <button class="btn btn-icon" onclick="document.getElementById('thesisTrackingModal').style.display='none'">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body" id="thesisTrackingModalBody">
                <!-- Content injected via JS -->
            </div>
        </div>
    </div>
    `;
}

function renderStudentThesisTracking() {
    const student = MOCK.student || {};
    const trackingData = MOCK.thesisProgress || [];
    const track = trackingData.find(t => t.StudentID === student.studentId) || {};
    const progress = calculateProgress(track);

    let milestonesHTML = THESIS_MILESTONES.map((m, index) => {
        const mStatus = track[`${m.id}_Status`] || 'Pending';
        const mDate = track[`${m.id}_Date`] || '-';
        const mNote = track[`${m.id}_Note`] || '';
        
        let statusColor = '#cbd5e1'; // gray - pending
        let statusIcon = '<circle cx="12" cy="12" r="10" fill="white" stroke="#cbd5e1" stroke-width="2"/>';
        let statusText = 'ยังไม่ดำเนินการ';
        let statusClass = '';

        if (mStatus === 'Complete') {
            statusColor = '#10b981'; // green
            statusIcon = '<circle cx="12" cy="12" r="10" fill="#10b981"/><path d="M8 12.5l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            statusText = 'ผ่านเรียบร้อย';
            statusClass = 'completed';
        } else if (mStatus === 'InProgress') {
            statusColor = '#3b82f6'; // blue
            statusIcon = '<circle cx="12" cy="12" r="10" fill="white" stroke="#3b82f6" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="#3b82f6"/>';
            statusText = 'อยู่ระหว่างดำเนินการ';
            statusClass = 'active';
        }

        // Additional field rendering
        let extraFieldsHtml = '';
        if (m.fields && m.fields.length > 0) {
            extraFieldsHtml = m.fields.map(f => {
                const val = track[`${m.id}_${f.id}`];
                if (val) {
                    return `<div style="font-size:0.8rem; background:rgba(0,0,0,0.03); padding:4px 8px; border-radius:4px; display:inline-block; margin-right:8px; margin-top:6px;"><b>${f.label}:</b> ${val}</div>`;
                }
                return '';
            }).join('');
        }

        return `
        <div style="display:flex; position:relative; margin-bottom:0;" class="timeline-item ${statusClass}">
            <!-- Line connecting dots -->
            ${index < THESIS_MILESTONES.length - 1 ? `<div style="position:absolute; left:21px; top:36px; bottom:-16px; width:2px; background:${mStatus === 'Complete' ? '#10b981' : '#e2e8f0'}; z-index:1;"></div>` : ''}
            
            <div style="display:flex; flex-direction:column; align-items:center; width:44px; margin-right:16px; position:relative; z-index:2; padding-top:10px;">
                <svg width="24" height="24" viewBox="0 0 24 24">${statusIcon}</svg>
            </div>
            
            <div style="flex:1; padding:12px 16px; background:white; border:1px solid ${mStatus === 'InProgress' ? '#bfdbfe' : '#e2e8f0'}; border-radius:12px; margin-bottom:16px; box-shadow: ${mStatus === 'InProgress' ? '0 4px 12px rgba(59,130,246,0.1)' : 'none'}; opacity: ${mStatus === 'Pending' ? 0.7 : 1};">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                            <span style="font-size:1.1rem;">${m.icon}</span>
                            <h4 style="margin:0; font-size:1rem; color:${mStatus === 'InProgress' ? '#1d4ed8' : '#334155'}; font-weight:600;">ขั้นตอนที่ ${index + 1}: ${m.label}</h4>
                        </div>
                        <span style="font-size:0.75rem; font-weight:600; padding:3px 8px; border-radius:10px; background:${statusColor}20; color:${statusColor === '#cbd5e1' ? '#64748b' : statusColor};">${statusText}</span>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:0.8rem; font-weight:500; color:var(--text-secondary);">วันที่ดำเนินการ/ผ่าน</div>
                        <div style="font-size:0.9rem; font-weight:600;">${mDate === '-' ? '-' : formatThaiDateShort(mDate)}</div>
                    </div>
                </div>
                ${extraFieldsHtml}
                ${mNote ? `<div style="margin-top:10px; padding:10px; background:#f8fafc; border-radius:8px; border-left:3px solid #cbd5e1; font-size:0.85rem; color:#475569;">${mNote}</div>` : ''}
            </div>
        </div>
        `;
    }).join('');

    return `
    <div class="animate-in">
        <div class="page-header" style="margin-bottom:24px;">
            <h1 class="page-title">ติดตามความก้าวหน้าวิทยานิพนธ์</h1>
            <p class="page-subtitle">แสดงขั้นตอนความก้าวหน้า (Milestones) ของการทำวิทยานิพนธ์</p>
        </div>

        <div class="card" style="margin-bottom:24px; border:none; background:linear-gradient(135deg, white 0%, #f8fafc 100%);">
            <div class="card-body" style="display:flex; align-items:center; gap:20px; padding:24px;">
                <div style="width:100px; height:100px;">
                    <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform:rotate(-90deg);">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="4"/>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--accent-primary)" stroke-width="4" stroke-dasharray="${progress}, 100" style="transition: stroke-dasharray 1s ease-out;"/>
                    </svg>
                    <div style="position:absolute; margin-top:-65px; margin-left:32px; font-size:1.2rem; font-weight:700; color:var(--accent-primary);">${progress}%</div>
                </div>
                <div>
                    <h3 style="margin:0 0 8px; font-size:1.2rem; color:#1e293b;">ภาพรวมความก้าวหน้า</h3>
                    <p style="margin:0; font-size:0.9rem; color:#64748b; line-height:1.5;">ปัจจุบันคุณผ่านการประเมินแล้ว ${calculateProgress(track) === 100 ? 11 : THESIS_MILESTONES.filter(m => track[`${m.id}_Status`] === 'Complete').length} จาก 11 ขั้นตอน<br>ขั้นตอนถัดไปที่คุณต้องโฟกัสคือ: <b>${THESIS_MILESTONES.find(m => track[`${m.id}_Status`] !== 'Complete')?.label || 'สำเร็จการศึกษา'}</b></p>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3 class="card-title">ไทม์ไลน์วิทยานิพนธ์ 11 ขั้นตอน</h3></div>
            <div class="card-body" style="padding:24px;">
                <div style="max-width:800px; margin:0 auto; padding-left:10px;">
                    ${milestonesHTML}
                </div>
            </div>
        </div>
    </div>
    `;
}

// FORMATTING HELPER
function formatThaiDateShort(dateStr) {
    if (!dateStr || dateStr === '-') return '-';
    // If it's just a regular string that doesn't parse to real date easily, return as is
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; 

    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear() + 543}`;
}

// ADMIN MODAL LOGIC
window.openThesisTrackingModal = function(studentData) {
    // Only Admin allowed to edit
    if (window.currentUserRole !== 'admin' && !window.isSuperAdmin) {
        alert('สิทธิ์การเข้าถึงถูกจำกัด (เฉพาะผู้ดูแลระบบที่มีสิทธิ์อัปเดตความก้าวหน้าได้)');
        return;
    }

    const track = studentData.trackData || {};

    let html = `
    <div style="margin-bottom:20px; padding-bottom:15px; border-bottom:1px solid #e2e8f0;">
        <h3 style="margin:0 0 5px; color:#1e293b; font-size:1.1rem;">นักศึกษา: ${studentData.name}</h3>
        <p style="margin:0; font-size:0.9rem; color:#64748b;">รหัสนักศึกษา: ${studentData.studentId} | สาขา: ${studentData.major}</p>
    </div>
    <form id="thesisMilestoneForm">
        <input type="hidden" id="tm_studentId" value="${studentData.studentId}">
        <input type="hidden" id="tm_studentName" value="${studentData.name}">
        <input type="hidden" id="tm_major" value="${studentData.major}">
        <input type="hidden" id="tm_cohort" value="${studentData.cohort}">
        
        <div style="display:flex; flex-direction:column; gap:16px;">
    `;

    THESIS_MILESTONES.forEach((m, idx) => {
        const cStatus = track[`${m.id}_Status`] || 'Pending';
        const cDate = track[`${m.id}_Date`] || '';
        const cNote = track[`${m.id}_Note`] || '';

        html += `
        <div style="border:1px solid #e2e8f0; border-radius:10px; padding:16px; background:${cStatus==='Complete'?'#f0fdf4':'#ffffff'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:1.2rem;">${m.icon}</span>
                    <h4 style="margin:0; font-size:1rem; color:#334155;">${idx+1}. ${m.label}</h4>
                </div>
                <div style="display:flex; gap:12px; align-items:center;">
                    <select id="${m.id}_Status" class="form-select" style="width:160px; height:36px; padding:0 10px;">
                        <option value="Pending" ${cStatus==='Pending'?'selected':''}>- ยังไม่เริ่ม -</option>
                        <option value="InProgress" ${cStatus==='InProgress'?'selected':''}>กำลังดำเนินการ</option>
                        <option value="Complete" ${cStatus==='Complete'?'selected':''}>✅ ผ่าน / เสร็จสิ้น</option>
                    </select>
                    <input type="date" id="${m.id}_Date" class="form-input" style="width:140px; height:36px;" value="${cDate.includes('T') ? cDate.split('T')[0] : cDate}">
                </div>
            </div>
            
            <div style="display:flex; flex-wrap:wrap; gap:16px;">
                <div style="flex:1; min-width:200px;">
                    <input type="text" id="${m.id}_Note" class="form-input" placeholder="หมายเหตุ / รายละเอียดเพิ่มเติม" value="${cNote}" style="height:36px; font-size:0.85rem;">
                </div>
                ${m.fields ? m.fields.map(f => {
                    const cFieldVal = track[`${m.id}_${f.id}`] || '';
                    return `
                    <div style="width:180px;">
                        <input type="${f.type}" id="${m.id}_${f.id}" class="form-input" placeholder="${f.label}" value="${cFieldVal}" style="height:36px; font-size:0.85rem; border-color:#94a3b8; background:#f8fafc;">
                    </div>
                    `;
                }).join('') : ''}
            </div>
        </div>
        `;
    });

    html += `
        </div>
        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:24px; padding-top:20px; border-top:1px solid #e2e8f0;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('thesisTrackingModal').style.display='none'">ยกเลิก</button>
            <button type="button" class="btn btn-primary" onclick="window.saveThesisMilestones()">บันทึกความก้าวหน้า</button>
        </div>
    </form>
    `;

    document.getElementById('thesisTrackingModalBody').innerHTML = html;
    document.getElementById('thesisTrackingModal').style.display = 'flex';
};

window.saveThesisMilestones = async function() {
    const studentId = document.getElementById('tm_studentId').value;
    const studentName = document.getElementById('tm_studentName').value;
    const major = document.getElementById('tm_major').value;
    const cohort = document.getElementById('tm_cohort').value;

    const milestones = {};
    THESIS_MILESTONES.forEach(m => {
        milestones[`${m.id}_Status`] = document.getElementById(`${m.id}_Status`).value;
        milestones[`${m.id}_Date`] = document.getElementById(`${m.id}_Date`).value;
        milestones[`${m.id}_Note`] = document.getElementById(`${m.id}_Note`).value;
        if(m.fields){
            m.fields.forEach(f => {
                milestones[`${m.id}_${f.id}`] = document.getElementById(`${m.id}_${f.id}`).value;
            });
        }
    });

    const payload = {
        studentId,
        studentName,
        major,
        cohort,
        updatedBy: window.currentUserData?.name || 'Admin',
        milestones
    };

    window.showLoading();
    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'updateThesisMilestone', payload: payload })
        });
        
        const result = await response.json();
        window.hideLoading();
        
        if (result.status === 'success') {
            alert('อัปเดตความก้าวหน้าเรียบร้อยแล้ว');
            document.getElementById('thesisTrackingModal').style.display = 'none';
            // Update MOCK locally to reflect change instantly
            let trackOpt = MOCK.thesisProgress.find(t => t.StudentID === studentId);
            if(trackOpt) {
                Object.assign(trackOpt, milestones);
                trackOpt.LastUpdated = new Date().toISOString();
            } else {
                MOCK.thesisProgress.push({
                    StudentID: studentId,
                    StudentName: studentName,
                    Major: major,
                    Cohort: cohort,
                    LastUpdated: new Date().toISOString(),
                    ...milestones
                });
            }
            window.loadPage('thesis-tracking');
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.message);
        }
    } catch (error) {
        window.hideLoading();
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้: ' + error.message);
    }
};
