// ============================
// Admin: Manage Evaluations
// ============================
pages['manage-evals'] = function() {
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">จัดการแบบประเมิน (Admin)</h1>
            <p class="page-subtitle">จัดการคำถามสำหรับแบบประเมินรายวิชาและแบบประเมินอาจารย์ผู้สอน</p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap:24px;">
            
            <!-- Course Evaluations Manage -->
            <div class="card animate-in animate-delay-1">
                <div class="card-header">
                    <h3 class="card-title">แบบประเมินรายวิชา</h3>
                </div>
                <div class="card-body">
                    <div style="margin-bottom:20px;">
                        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:12px;">
                            นำเข้าข้อมูลคำถามสำหรับประเมินผลรายวิชาผ่านไฟล์ CSV
                        </p>
                        <button class="btn btn-secondary" onclick="downloadEvalTemplate('course')" style="width:100%; margin-bottom:12px; justify-content:center;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            ดาวน์โหลด Template (.csv) - ประเมินรายวิชา
                        </button>
                    </div>
                    
                    <div style="border-top:1px solid var(--border-color); padding-top:20px;">
                        <h4 style="font-size:0.95rem; margin-bottom:12px;">อัปโหลดคำถามใหม่</h4>
                        <input type="file" id="courseEvalUpload" accept=".csv" style="display:none;" onchange="handleEvalUpload(this, 'course')">
                        <div style="border:2px dashed var(--border-color); border-radius:var(--radius-md); padding:24px; text-align:center; cursor:pointer; background:var(--bg-secondary); transition:all 0.2s;"
                             onclick="document.getElementById('courseEvalUpload').click()"
                             ondragover="event.preventDefault(); this.style.borderColor='var(--accent-primary)';"
                             ondragleave="this.style.borderColor='var(--border-color)';"
                             ondrop="event.preventDefault(); this.style.borderColor='var(--border-color)'; document.getElementById('courseEvalUpload').files = event.dataTransfer.files; handleEvalUpload(document.getElementById('courseEvalUpload'), 'course');">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <div style="color:var(--text-muted); font-size:0.9rem;">คลิก หรือ ลากไฟล์ CSV มาวางที่นี่</div>
                        </div>
                        <div id="courseEvalPreview" style="margin-top:16px;"></div>
                    </div>
                </div>
            </div>

            <!-- Instructor Evaluations Manage -->
            <div class="card animate-in animate-delay-2">
                <div class="card-header">
                    <h3 class="card-title">แบบประเมินอาจารย์ผู้สอน</h3>
                </div>
                <div class="card-body">
                    <div style="margin-bottom:20px;">
                        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:12px;">
                            นำเข้าข้อมูลคำถามสำหรับประเมินผลอาจารย์ผู้สอนผ่านไฟล์ CSV
                        </p>
                        <button class="btn btn-secondary" onclick="downloadEvalTemplate('instructor')" style="width:100%; margin-bottom:12px; justify-content:center;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            ดาวน์โหลด Template (.csv) - ประเมินอาจารย์
                        </button>
                    </div>
                    
                    <div style="border-top:1px solid var(--border-color); padding-top:20px;">
                        <h4 style="font-size:0.95rem; margin-bottom:12px;">อัปโหลดคำถามใหม่</h4>
                        <input type="file" id="instructorEvalUpload" accept=".csv" style="display:none;" onchange="handleEvalUpload(this, 'instructor')">
                        <div style="border:2px dashed var(--border-color); border-radius:var(--radius-md); padding:24px; text-align:center; cursor:pointer; background:var(--bg-secondary); transition:all 0.2s;"
                             onclick="document.getElementById('instructorEvalUpload').click()"
                             ondragover="event.preventDefault(); this.style.borderColor='var(--accent-primary)';"
                             ondragleave="this.style.borderColor='var(--border-color)';"
                             ondrop="event.preventDefault(); this.style.borderColor='var(--border-color)'; document.getElementById('instructorEvalUpload').files = event.dataTransfer.files; handleEvalUpload(document.getElementById('instructorEvalUpload'), 'instructor');">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <div style="color:var(--text-muted); font-size:0.9rem;">คลิก หรือ ลากไฟล์ CSV มาวางที่นี่</div>
                        </div>
                        <div id="instructorEvalPreview" style="margin-top:16px;"></div>
                    </div>
                </div>
            </div>

        </div>
    </div>`;
};

window.downloadEvalTemplate = function(type) {
    const BOM = '\uFEFF';
    let headers = ['id', 'question'];
    let sampleRows = [];
    let filename = '';

    if (type === 'course') {
        sampleRows = [
            ['1', 'ความเหมาะสมของเนื้อหารายวิชา'],
            ['2', 'ความชัดเจนของวัตถุประสงค์รายวิชา'],
            ['3', 'ความเหมาะสมของสื่อการเรียนการสอน'],
            ['4', 'ความเหมาะสมของวิธีการวัดผลประเมินผล'],
            ['5', 'ความพึงพอใจโดยรวมต่อรายวิชา']
        ];
        filename = 'template_ประเมินรายวิชา.csv';
    } else {
        sampleRows = [
            ['1', 'การเตรียมความพร้อมในการสอน'],
            ['2', 'ความสามารถในการถ่ายทอดความรู้'],
            ['3', 'การเปิดโอกาสให้ผู้เรียนมีส่วนร่วม'],
            ['4', 'การให้คำปรึกษานอกเวลาเรียน'],
            ['5', 'ความตรงต่อเวลาในการสอน'],
            ['6', 'ความพึงพอใจโดยรวมต่ออาจารย์ผู้สอน']
        ];
        filename = 'template_ประเมินอาจารย์.csv';
    }

    let csvContent = BOM + headers.join(',') + '\n' + sampleRows.map(row => '"' + row.join('","') + '"').join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

window.handleEvalUpload = function(input, type) {
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        
        if (lines.length < 2) {
            alert('ไฟล์ต้องมีอย่างน้อย 1 แถวหัวตาราง (id, question) และ 1 แถวข้อมูล');
            return;
        }

        const questionsList = [];
        for (let i = 1; i < lines.length; i++) {
            // Simple split by comma, ignoring commas inside quotes could be complex but assuming basic format for prototype
            const cols = parseCSVLineSimple(lines[i]);
            if (cols.length >= 2) {
                questionsList.push({
                    id: cols[0],
                    question: cols[1]
                });
            }
        }

        if (questionsList.length === 0) {
            alert('ไม่พบข้อมูลคำถามในไฟล์');
            return;
        }

        // Preview Table
        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h5 style="margin:0;">ตัวอย่างคำถาม (${questionsList.length} ข้อ)</h5>
                <span class="badge success">พบข้อมูล</span>
            </div>
            <div style="max-height:150px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <table class="data-table" style="font-size:0.8rem; margin:0;">
                    <thead style="position:sticky; top:0; background:var(--bg-secondary);">
                        <tr><th style="width:40px;">ID</th><th>ตัวชี้วัด / คำถาม</th></tr>
                    </thead>
                    <tbody>
                        ${questionsList.map(q => `<tr><td>${q.id}</td><td>${q.question}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
            <button class="btn btn-primary" style="width:100%; margin-top:12px;" onclick="saveImportedQuestions('${type}', '${encodeURIComponent(JSON.stringify(questionsList))}')">
                ยืนยันการนำเข้าข้อมูล
            </button>
        `;
        
        document.getElementById(type + 'EvalPreview').innerHTML = html;
        input.value = ''; // Reset input
    };
    reader.readAsText(file, 'UTF-8');
};

function parseCSVLineSimple(line) {
    const result = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuote = !inQuote; }
        else if (ch === ',' && !inQuote) { result.push(current.trim().replace(/^"|"$/g, '')); current = ''; }
        else { current += ch; }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
}

window.saveImportedQuestions = function(type, jsonStr) {
    const questionsList = JSON.parse(decodeURIComponent(jsonStr));
    
    // Save to MOCK data so it reflects system-wide in this session
    if (type === 'course') {
        MOCK.courseEvalQuestions = questionsList;
    } else {
        MOCK.instructorEvalQuestions = questionsList;
    }

    document.getElementById(type + 'EvalPreview').innerHTML = `
        <div style="padding:12px; background:rgba(40,167,69,0.1); color:var(--success); border-radius:var(--radius-md); text-align:center; font-weight:500;">
            ✓ นำเข้าข้อมูลระบบคำถามสำเร็จ
        </div>
    `;

    setTimeout(() => {
        document.getElementById(type + 'EvalPreview').innerHTML = '';
        openModal('สำเร็จ', '<div style="text-align:center;padding:20px;"><div style="font-size:3rem;margin-bottom:12px">✅</div><h3 style="margin-bottom:8px">นำเข้าข้อมูลสำเร็จ</h3><p style="color:var(--text-muted)">คำถามแบบประเมินถูกอัปเดตเรียบร้อยแล้ว</p><button class="btn btn-primary" style="margin-top:16px" onclick="closeModal()">ตกลง</button></div>');
    }, 500);
};
