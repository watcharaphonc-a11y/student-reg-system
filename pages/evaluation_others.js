// ============================
// Other Evaluations Pages (แบบประเมินอื่นๆ)
// ============================

function renderEvaluationPlaceholder(title, subtitle) {
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">${title}</h1>
            <p class="page-subtitle">${subtitle}</p>
        </div>

        <div class="card">
            <div class="card-body" style="text-align: center; padding: 60px 20px;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <h3 style="color:var(--text-primary); margin-bottom:12px; font-size:1.3rem;">อยู่ระหว่างการจัดทำแบบฟอร์ม / อัปเดตคำถาม</h3>
                <p style="color:var(--text-secondary); max-width:500px; margin:0 auto; line-height:1.6;">
                    แบบประเมินนี้กำลังอยู่ในช่วงการพัฒนาหรือรอผู้ดูแลระบบเพิ่มชุดคำถาม <br>กรุณาตรวจสอบอีกครั้งในภายหลัง
                </p>
                <div style="margin-top:24px;">
                    <button class="btn btn-secondary" onclick="navigateTo('dashboard')">กลับหน้าหลัก</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

// 2. ประเมินความพึงพอใจต่อการบริหารหลักสูตร
pages['eval-curriculum'] = function () {
    return renderEvaluationPlaceholder(
        "ประเมินความพึงพอใจต่อการบริหารหลักสูตร",
        "กรุณาประเมินระดับความพึงพอใจต่อภาพรวมของการบริหารหลักสูตร"
    );
};

// 3. ประเมินความพึงพอใจต่อสิ่งสนับสนุนการเรียนรู้
pages['eval-facilities'] = function () {
    return renderEvaluationPlaceholder(
        "ประเมินความพึงพอใจต่อสิ่งสนับสนุนการเรียนรู้",
        "แบบประเมินห้องสมุด ระบบอินเทอร์เน็ต คอมพิวเตอร์ และสถานที่"
    );
};

// 4. ประเมินความพึงพอใจต่อการบริการนักศึกษา
pages['eval-services'] = function () {
    return renderEvaluationPlaceholder(
        "ประเมินความพึงพอใจต่อการบริการนักศึกษา",
        "ประเมินการบริการของเจ้าหน้าที่ การให้คำปรึกษา และสวัสดิการ"
    );
};

// 5. ประเมินผลลัพธ์การเรียนรู้ระดับหลักสูตร
pages['eval-learning-outcomes'] = function () {
    return renderEvaluationPlaceholder(
        "ประเมินผลลัพธ์การเรียนรู้ (หลักสูตร)",
        "ประเมินตามเกณฑ์มาตรฐานผลลัพธ์การเรียนรู้ (PLOs)"
    );
};

// 6. แบบประเมินอัตลักษณ์ผู้นำ
pages['eval-leadership'] = function () {
    return renderEvaluationPlaceholder(
        "แบบประเมินอัตลักษณ์ผู้นำ",
        "แบบประเมินทักษะและพฤติกรรมสะท้อนความเป็นผู้นำของนักศึกษา"
    );
};
