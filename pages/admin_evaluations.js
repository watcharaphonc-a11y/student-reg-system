// ============================
// Admin: Manage Evaluations (Per-course questions + Instructor mapping)
// ============================
pages['manage-evals'] = function() {
    const evalQuestions = MOCK.evalQuestions || [];
    const courseInstructors = MOCK.courseInstructors || [];
    const instQuestions = MOCK.evalInstructorQuestions || [];

    // Group questions by course
    const courseQMap = {};
    evalQuestions.forEach(q => {
        const code = String(q.course_code || '').trim();
        if (!courseQMap[code]) courseQMap[code] = [];
        courseQMap[code].push(q);
    });

    // Group instructors by course
    const courseInstMap = {};
    courseInstructors.forEach(ci => {
        const code = String(ci.course_code || '').trim();
        if (!courseInstMap[code]) courseInstMap[code] = { name: ci.course_name || '', instructors: [] };
        courseInstMap[code].instructors.push(ci.instructor_name || '');
    });

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">จัดการแบบประเมิน (Admin)</h1>
            <p class="page-subtitle">จัดการคำถามประเมินรายวิชา, อาจารย์ผู้สอน, และคำถามประเมินอาจารย์</p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap:24px;">
            
            <!-- 1. Per-Course Eval Questions -->
            <div class="card animate-in animate-delay-1">
                <div class="card-header">
                    <h3 class="card-title">คำถามประเมินรายวิชา (EvalQuestions)</h3>
                </div>
                <div class="card-body">
                    <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:12px;">
                        นำเข้าคำถามประเมินแยกตามรายวิชา — CSV: <code>course_code, section, category, question_id, question_text</code>
                    </p>
                    <button class="btn btn-secondary" onclick="downloadEvalTemplate('course_questions')" style="width:100%; margin-bottom:12px; justify-content:center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ดาวน์โหลด Template (.csv)
                    </button>
                    
                    <div style="border-top:1px solid var(--border-color); padding-top:16px;">
                        <input type="file" id="courseQUpload" accept=".csv" style="display:none;" onchange="handleEvalUpload(this, 'course_questions')">
                        <div style="border:2px dashed var(--border-color); border-radius:var(--radius-md); padding:24px; text-align:center; cursor:pointer; background:var(--bg-secondary);"
                             onclick="document.getElementById('courseQUpload').click()">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <div style="color:var(--text-muted); font-size:0.9rem;">คลิก หรือ ลากไฟล์ CSV มาวางที่นี่</div>
                        </div>
                        <div id="courseQPreview" style="margin-top:16px;"></div>
                    </div>

                    ${Object.keys(courseQMap).length > 0 ? `
                    <div style="border-top:1px solid var(--border-color); padding-top:16px; margin-top:16px;">
                        <h5 style="margin-bottom:8px;">คำถามที่มีในระบบ (${evalQuestions.length} ข้อ, ${Object.keys(courseQMap).length} วิชา)</h5>
                        <div style="max-height:200px; overflow-y:auto;">
                            ${Object.entries(courseQMap).map(([code, qs]) => `
                                <div style="padding:8px 12px; background:var(--bg-secondary); border-radius:var(--radius-sm); margin-bottom:6px;">
                                    <span style="font-weight:600; color:var(--accent-primary);">${code}</span>
                                    <span style="color:var(--text-muted); font-size:0.85rem;"> — ${qs.length} คำถาม</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>` : ''}
                </div>
            </div>

            <!-- 2. Course-Instructor Mapping -->
            <div class="card animate-in animate-delay-2">
                <div class="card-header">
                    <h3 class="card-title">อาจารย์ผู้สอนแต่ละวิชา (CourseInstructors)</h3>
                </div>
                <div class="card-body">
                    <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:12px;">
                        นำเข้าข้อมูลอาจารย์ต่อวิชา — CSV: <code>course_code, course_name, instructor_name, group, semester, academic_year</code>
                    </p>
                    <button class="btn btn-secondary" onclick="downloadEvalTemplate('course_instructors')" style="width:100%; margin-bottom:12px; justify-content:center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ดาวน์โหลด Template (.csv)
                    </button>
                    
                    <div style="border-top:1px solid var(--border-color); padding-top:16px;">
                        <input type="file" id="courseInstUpload" accept=".csv" style="display:none;" onchange="handleEvalUpload(this, 'course_instructors')">
                        <div style="border:2px dashed var(--border-color); border-radius:var(--radius-md); padding:24px; text-align:center; cursor:pointer; background:var(--bg-secondary);"
                             onclick="document.getElementById('courseInstUpload').click()">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <div style="color:var(--text-muted); font-size:0.9rem;">คลิก หรือ ลากไฟล์ CSV มาวางที่นี่</div>
                        </div>
                        <div id="courseInstPreview" style="margin-top:16px;"></div>
                    </div>

                    ${Object.keys(courseInstMap).length > 0 ? `
                    <div style="border-top:1px solid var(--border-color); padding-top:16px; margin-top:16px;">
                        <h5 style="margin-bottom:8px;">ข้อมูลอาจารย์ในระบบ (${courseInstructors.length} รายการ)</h5>
                        <div style="max-height:200px; overflow-y:auto;">
                            ${Object.entries(courseInstMap).map(([code, info]) => `
                                <div style="padding:8px 12px; background:var(--bg-secondary); border-radius:var(--radius-sm); margin-bottom:6px;">
                                    <span style="font-weight:600; color:var(--accent-primary);">${code}</span>
                                    <span style="color:var(--text-muted); font-size:0.85rem;"> — ${info.instructors.length} คน</span>
                                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${info.instructors.slice(0,3).join(', ')}${info.instructors.length > 3 ? '...' : ''}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>` : ''}
                </div>
            </div>

            <!-- 3. Instructor Eval Questions -->
            <div class="card animate-in animate-delay-3">
                <div class="card-header">
                    <h3 class="card-title">คำถามประเมินอาจารย์ (EvalInstructorQuestions)</h3>
                </div>
                <div class="card-body">
                    <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:12px;">
                        คำถามที่ใช้ประเมินอาจารย์ทุกท่าน — CSV: <code>question_id, question_text</code>
                    </p>
                    <button class="btn btn-secondary" onclick="downloadEvalTemplate('instructor_questions')" style="width:100%; margin-bottom:12px; justify-content:center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ดาวน์โหลด Template (.csv)
                    </button>
                    
                    <div style="border-top:1px solid var(--border-color); padding-top:16px;">
                        <input type="file" id="instQUpload" accept=".csv" style="display:none;" onchange="handleEvalUpload(this, 'instructor_questions')">
                        <div style="border:2px dashed var(--border-color); border-radius:var(--radius-md); padding:24px; text-align:center; cursor:pointer; background:var(--bg-secondary);"
                             onclick="document.getElementById('instQUpload').click()">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <div style="color:var(--text-muted); font-size:0.9rem;">คลิก หรือ ลากไฟล์ CSV มาวางที่นี่</div>
                        </div>
                        <div id="instQPreview" style="margin-top:16px;"></div>
                    </div>

                    ${instQuestions.length > 0 ? `
                    <div style="border-top:1px solid var(--border-color); padding-top:16px; margin-top:16px;">
                        <h5 style="margin-bottom:8px;">คำถามที่มีในระบบ (${instQuestions.length} ข้อ)</h5>
                        <div style="max-height:150px; overflow-y:auto;">
                            ${instQuestions.map((q,i) => `
                                <div style="padding:6px 12px; font-size:0.85rem; background:var(--bg-secondary); border-radius:var(--radius-sm); margin-bottom:4px;">
                                    ${i+1}. ${q.question_text || q.question}
                                </div>
                            `).join('')}
                        </div>
                    </div>` : ''}
                </div>
            </div>
        </div>
    </div>`;
};

// ============================
// Download CSV Templates
// ============================
window.downloadEvalTemplate = function(type) {
    const BOM = '\uFEFF';
    let headers = [];
    let sampleRows = [];
    let filename = '';

    if (type === 'course_questions') {
        headers = ['course_code', 'section', 'category', 'question_id', 'question_text'];
        sampleRows = [
            ['0100500101', 'โครงสร้างรายวิชา', 'course_structure', '1', 'ผลลัพธ์การเรียนรู้รายวิชาชัดเจน'],
            ['0100500101', 'โครงสร้างรายวิชา', 'course_structure', '2', 'หน่วยกิตของรายวิชามีความเหมาะสม'],
            ['0100500101', 'คำถามก่อนเรียน', 'pre_learning', '1', 'เนื้อหาตอดคล้องกับวัตถุประสงค์'],
            ['0100500101', 'คำถามหลังเรียน', 'post_learning', '1', 'ท่านคิดว่าท่านมีความสามารถตามผลลัพธ์การเรียนรู้'],
            ['0100500101', 'CLO', 'clo', '1', 'CLO4.4 ปฏิบัติเป็นแบบอย่างที่ดีในฐานะผู้นำ'],
            ['0100500101', 'LLO', 'llo', '1', 'CLO5 แสดงออกถึงความซื่อสัตย์และจริยธรรม']
        ];
        filename = 'template_คำถามประเมินรายวิชา.csv';
    } else if (type === 'course_instructors') {
        headers = ['course_code', 'course_name', 'instructor_name', 'group', 'semester', 'academic_year'];
        sampleRows = [
            ['0100500101', 'ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล', 'ดร.สุภาณี ดลังฤทธิ์', '1', '1', '2568'],
            ['0100500101', 'ระบบสุขภาพ ภาวะผู้นำทางการพยาบาล', 'ผศ.ดร.ศิราณี เศรษฐ์วิกุล', '1', '1', '2568']
        ];
        filename = 'template_อาจารย์ผู้สอนรายวิชา.csv';
    } else if (type === 'instructor_questions') {
        headers = ['question_id', 'question_text'];
        sampleRows = [
            ['1', 'เนื้อหาตอดคล้องกับวัตถุประสงค์'],
            ['2', 'เนื้อหาเหมาะสมกับเวลา'],
            ['3', 'สื่อการสอนชัดเจนและตอดคล้องกับเนื้อหา'],
            ['4', 'ชี้แจงผลลัพธ์การเรียนรู้อย่างชัดเจน'],
            ['5', 'การสอนทำให้นักศึกษาบรรลุผลลัพธ์การเรียนรู้'],
            ['6', 'เทคนิคการสอนทำให้นักศึกษาเข้าใจง่าย']
        ];
        filename = 'template_คำถามประเมินอาจารย์.csv';
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

// ============================
// Handle CSV Upload
// ============================
window.handleEvalUpload = function(input, type) {
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        
        if (lines.length < 2) {
            alert('ไฟล์ต้องมีอย่างน้อย 1 แถวหัวตาราง และ 1 แถวข้อมูล');
            return;
        }

        const parsedHeaders = parseCSVLineSimple(lines[0]).map(h => h.trim());
        const dataRows = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = parseCSVLineSimple(lines[i]);
            if (cols.length >= 2) {
                const rowObj = {};
                parsedHeaders.forEach((h, idx) => rowObj[h] = cols[idx] || '');
                dataRows.push(rowObj);
            }
        }

        if (dataRows.length === 0) {
            alert('ไม่พบข้อมูลในไฟล์');
            return;
        }

        // Determine preview container
        let previewId = '';
        if (type === 'course_questions') previewId = 'courseQPreview';
        else if (type === 'course_instructors') previewId = 'courseInstPreview';
        else if (type === 'instructor_questions') previewId = 'instQPreview';

        const html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h5 style="margin:0;">ตัวอย่าง (${dataRows.length} รายการ)</h5>
                <span class="badge success">พบข้อมูล</span>
            </div>
            <div style="max-height:150px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <table class="data-table" style="font-size:0.8rem; margin:0;">
                    <thead style="position:sticky; top:0; background:var(--bg-secondary);">
                        <tr>${parsedHeaders.map(h => `<th>${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${dataRows.slice(0, 10).map(row => `<tr>${parsedHeaders.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`).join('')}
                        ${dataRows.length > 10 ? `<tr><td colspan="${parsedHeaders.length}" style="text-align:center;color:var(--text-muted);">...และอีก ${dataRows.length - 10} รายการ</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
            <button class="btn btn-primary" style="width:100%; margin-top:12px;" onclick="saveEvalImport('${type}', '${encodeURIComponent(JSON.stringify(dataRows))}')">
                ยืนยันการนำเข้าข้อมูล
            </button>
        `;
        
        document.getElementById(previewId).innerHTML = html;
        input.value = '';
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

window.saveEvalImport = function(type, jsonStr) {
    const dataRows = JSON.parse(decodeURIComponent(jsonStr));
    
    if (type === 'course_questions') {
        MOCK.evalQuestions = dataRows;
    } else if (type === 'course_instructors') {
        MOCK.courseInstructors = dataRows;
    } else if (type === 'instructor_questions') {
        MOCK.evalInstructorQuestions = dataRows;
    }

    openModal('สำเร็จ', `
        <div style="text-align:center;padding:20px;">
            <div style="font-size:3rem;margin-bottom:12px">✅</div>
            <h3 style="margin-bottom:8px">นำเข้าข้อมูลสำเร็จ</h3>
            <p style="color:var(--text-muted)">${dataRows.length} รายการถูกอัปเดตเรียบร้อยแล้ว</p>
            <p style="color:var(--text-muted); font-size:0.85rem;">หมายเหตุ: ข้อมูลจะแสดงในเซสชันนี้ กรุณาเพิ่มข้อมูลลง Google Sheets โดยตรงเพื่อให้คงอยู่ถาวร</p>
            <button class="btn btn-primary" style="margin-top:16px" onclick="closeModal(); renderPage();">ตกลง</button>
        </div>
    `);
};
