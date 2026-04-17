// ============================
// Other Evaluations Pages (แบบประเมินอื่นๆ)
// ============================

// --- ชุดคำถามจำลอง (สามารถมาแก้ไขหรือเพิ่มเติมได้ในภายหลัง) ---

const EVAL_QUESTIONS = {
    'curriculum': [
        "โครงสร้างหลักสูตรมีความทันสมัยและตอบสนองต่อความต้องการของสังคม",
        "การจัดตารางสอนและรายวิชามีความเหมาะสมและสอดคล้องกับแผนการศึกษา",
        "กระบวนการรับฟังความคิดเห็นของนักศึกษาเพื่อนำไปพัฒนาหลักสูตรมีประสิทธิภาพ",
        "ความพร้อมของคู่มือและเอกสารแนะนำการศึกษาของหลักสูตร",
        "การบริหารจัดการและการประสานงานของประธาน/กรรมการหลักสูตร"
    ],
    'facilities': [
        "ความพร้อมและคุณภาพของห้องเรียนและอุปกรณ์โสตทัศนูปกรณ์",
        "ความเพียงพอของหนังสือ ตำรา และฐานข้อมูลออนไลน์ในห้องสมุด",
        "ความเสถียรและความรวดเร็วของระบบเครือข่ายอินเทอร์เน็ต (Wi-Fi) ของคณะ/มหาวิทยาลัย",
        "ความเพียงพอและสภาพแวดล้อมของพื้นที่นั่งอ่านหนังสือ หรือพื้นที่ทำงานกลุ่ม (Co-working space)",
        "ความสะอาดและสุขอนามัยของสิ่งอำนวยความสะดวก (เช่น ห้องน้ำ โรงอาหาร)"
    ],
    'services': [
        "ความรวดเร็ว ถูกต้อง และเป็นมิตรในการให้บริการของเจ้าหน้าที่สายสนับสนุน",
        "ประสิทธิภาพและเสถียรภาพของระบบสารสนเทศ (เช่น ระบบลงทะเบียน ระบบคำร้อง)",
        "การเข้าถึงและการให้ความช่วยเหลือในด้านสวัสดิการและทุนการศึกษา",
        "การประชาสัมพันธ์ข่าวสารและกิจกรรมต่างๆ ของคณะ/มหาวิทยาลัยมีความชัดเจนและทั่วถึง",
        "ช่องทางการร้องเรียนหรือข้อเสนอแนะมีความสะดวกและได้รับการตอบสนอง"
    ],
    'learning-outcomes': [
        "ความสามารถในการประยุกต์ใช้ความรู้เชิงทฤษฎีสู่การปฏิบัติและการทำงานวิจัย",
        "ทักษะการคิดวิเคราะห์ สังเคราะห์ และการแก้ปัญหาที่ซับซ้อนอย่างเป็นระบบ",
        "ทักษะการสื่อสาร การนำเสนอ และการใช้เทคโนโลยีสารสนเทศอย่างเหมาะสม",
        "ความสามารถในการทำงานร่วมกับผู้อื่นและการปรับตัวในสภาพแวดล้อมที่หลากหลาย",
        "ความรับผิดชอบต่อหน้าที่ จรรยาบรรณทางวิชาชีพ และจริยธรรมการวิจัย"
    ],
    'leadership': [
        "ความสามารถในการเป็นผู้นำกลุ่มและการเคารพ/รับฟังความคิดเห็นของผู้ร่วมงาน",
        "ความกล้าแสดงออกและการนำเสนอแนวคิดเชิงนำหรือริเริ่มสร้างสรรค์สิ่งใหม่",
        "ความรับผิดชอบในการตัดสินใจและการมีวุฒิภาวะในการแก้ไขปัญหาความขัดแย้ง",
        "ความสามารถในการสร้างแรงบันดาลใจและกระตุ้นให้เกิดการทำงานเป็นทีมที่มีประสิทธิภาพ",
        "ความเสียสละและการคำนึงถึงประโยชน์ส่วนรวมมากกว่าประโยชน์ส่วนตน"
    ]
};

// --- ฟังก์ชันสร้างหน้าจอแบบประเมินแบบ Generic ---
function renderGenericEvaluationForm(evalId, title, subtitle, questions) {
    const questionRows = questions.map((q, idx) => `
        <div style="padding:16px 20px; border-bottom:1px solid var(--border-color); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:16px;">
            <div style="flex:1; min-width:300px; font-size:0.95rem; color:var(--text-primary);">
                <b>${idx+1}.</b> ${q}
            </div>
            <div style="display:flex; gap:12px; justify-content:flex-end; min-width:260px;">
                ${[5, 4, 3, 2, 1].map(score => `
                    <label style="display:flex; flex-direction:column; align-items:center; cursor:pointer;" title="คะแนน ${score}">
                        <input type="radio" name="q_${evalId}_${idx}" value="${score}" required style="accent-color:var(--accent-primary); width:18px; height:18px;">
                        <span style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">${score}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');

    return `
    <div class="animate-in">
        <div class="page-header" style="margin-bottom:24px;">
            <h1 class="page-title">${title}</h1>
            <p class="page-subtitle">${subtitle}</p>
        </div>

        <div class="card" style="max-width:900px; margin:0 auto;">
            <div class="card-header" style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 class="card-title">แบบสอบถามระดับความพึงพอใจ</h3>
                    <div style="font-size:0.8rem; color:var(--text-secondary);">
                        <span style="margin-right:12px;">🔴 1 = น้อยที่สุด</span>
                        <span style="margin-right:12px;">🟡 2 = น้อย</span>
                        <span style="margin-right:12px;">🟢 3 = ปานกลาง</span>
                        <span style="margin-right:12px;">🔵 4 = มาก</span>
                        <span>🟣 5 = มากที่สุด</span>
                    </div>
                </div>
            </div>
            <div class="card-body" style="padding:0;">
                <form id="form_${evalId}" onsubmit="window.submitGenericEvaluation(event, '${evalId}', '${title}')">
                    <div style="display:flex; flex-direction:column;">
                        ${questionRows}
                    </div>
                    
                    <div style="padding:20px; background:#f8fafc; border-top:1px solid var(--border-color);">
                        <label class="form-label" style="font-weight:600; margin-bottom:8px; display:block;">ข้อเสนอแนะเพิ่มเติม (ถ้ามี)</label>
                        <textarea id="comment_${evalId}" class="form-input" rows="3" placeholder="ระบุข้อเสนอแนะหรือความคิดเห็นเพิ่มเติมเพื่อการพัฒนา..."></textarea>
                    </div>

                    <div style="padding:20px; display:flex; justify-content:flex-end; gap:12px; border-top:1px solid var(--border-color);">
                        <button type="button" class="btn btn-secondary" onclick="document.getElementById('form_${evalId}').reset()">ล้างข้อมูล</button>
                        <button type="submit" class="btn btn-primary" style="gap:8px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            ส่งผลการประเมิน
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}

window.submitGenericEvaluation = function(e, evalId, title) {
    e.preventDefault();
    
    // แบบจำลองการส่งข้อมูล (Mock Processing)
    window.showLoading && window.showLoading();
    
    setTimeout(() => {
        window.hideLoading && window.hideLoading();
        
        let modalHtml = `
        <div style="text-align:center; padding:20px;">
            <div style="font-size:3.5rem; margin-bottom:16px;">🙏</div>
            <h3 style="color:var(--success); margin-bottom:12px;">ขอบคุณสำหรับการประเมิน!</h3>
            <p style="color:var(--text-secondary); margin-bottom:24px; line-height:1.6;">
                ผลการประเมิน <b>${title}</b> ของคุณถูกส่งเข้าสู่ระบบเรียบร้อยแล้ว<br>
                ข้อมูลของคุณจะถูกนำไปใช้เพื่อการพัฒนาและปรับปรุงให้ดียิ่งขึ้น
            </p>
            <button class="btn btn-primary" onclick="window.closeModalAndRedirect()">ตกลง</button>
        </div>
        `;
        
        if (typeof openModal === 'function') {
            openModal('ส่งผลการประเมินสำเร็จ', modalHtml);
            document.getElementById(`form_${evalId}`).reset();
        } else {
            alert('ส่งผลการประเมินสำเร็จ');
        }
    }, 800);
};

window.closeModalAndRedirect = function() {
    if (typeof closeModal === 'function') closeModal();
    navigateTo('dashboard');
};

// --- การสร้างเมนูหน้าประเมินเชื่อมกับ Routing ---

// 2. ประเมินความพึงพอใจต่อการบริหารหลักสูตร
pages['eval-curriculum'] = function () {
    return renderGenericEvaluationForm('curriculum', "ประเมินความพึงพอใจต่อการบริหารหลักสูตร", "กรุณาประเมินระดับความพึงพอใจต่อภาพรวมของการบริหารหลักสูตร", EVAL_QUESTIONS['curriculum']);
};

// 3. ประเมินความพึงพอใจต่อสิ่งสนับสนุนการเรียนรู้
pages['eval-facilities'] = function () {
    return renderGenericEvaluationForm('facilities', "ประเมินความพึงพอใจต่อสิ่งสนับสนุนการเรียนรู้", "แบบประเมินทรัพยากร ห้องสมุด ระบบอินเทอร์เน็ต คอมพิวเตอร์ และสถานที่", EVAL_QUESTIONS['facilities']);
};

// 4. ประเมินความพึงพอใจต่อการบริการนักศึกษา
pages['eval-services'] = function () {
    return renderGenericEvaluationForm('services', "ประเมินความพึงพอใจต่อการบริการนักศึกษา", "ประเมินการบริการของเจ้าหน้าที่ การให้คำปรึกษา และสวัสดิการมหาวิทยาลัย", EVAL_QUESTIONS['services']);
};

// 5. ประเมินผลลัพธ์การเรียนรู้ระดับหลักสูตร
pages['eval-learning-outcomes'] = function () {
    return renderGenericEvaluationForm('learning-outcomes', "ประเมินผลลัพธ์การเรียนรู้ (หลักสูตร)", "ประเมินพัฒนาการของตนเองตามเกณฑ์มาตรฐานผลลัพธ์การเรียนรู้ (PLOs)", EVAL_QUESTIONS['learning-outcomes']);
};

// 6. แบบประเมินอัตลักษณ์ผู้นำ
pages['eval-leadership'] = function () {
    return renderGenericEvaluationForm('leadership', "แบบประเมินอัตลักษณ์ผู้นำ", "แบบประเมินทักษะและพฤติกรรมสะท้อนความเป็นผู้นำของนักศึกษา", EVAL_QUESTIONS['leadership']);
};
