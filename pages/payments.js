// ============================
// Payments Page
// ============================
pages.payments = function() {
    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ค่าธรรมเนียม / การชำระเงิน</h1>
            <p class="page-subtitle">จัดการค่าธรรมเนียมและตรวจสอบสถานะการชำระเงิน</p>
        </div>
        <div class="payments-main-layout">
            <div class="card animate-in animate-delay-1 qr-payment-card">
            <div style="max-width: 100%; margin: 0 auto;">
                <h3 style="margin-bottom: 15px; color: var(--text-primary); font-size: 1.1rem; line-height: 1.3;">ระบบชำระเงินอิเล็กทรอนิกส์ (e-Payment)</h3>
                <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.85rem;">
                    นักศึกษาสามารถตรวจสอบยอดค้างชำระ และทำรายการผ่านระบบ e-Payment ได้โดยตรง
                </p>
                <div style="background: white; padding: 25px; border-radius: var(--radius-md); display: inline-block; margin-bottom: 24px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://e-payment.pi.ac.th/login" alt="QR Code for e-Payment" style="width: 220px; height: 220px; display: block;">
                    <p style="margin-top: 15px; font-size: 0.95rem; color: var(--text-muted); font-weight: 600;">สแกนเพื่อเข้าสู่ระบบ</p>
                </div>
                <div>
                    <a href="https://e-payment.pi.ac.th/login" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; justify-content: center; width: 100%; max-width: 300px; margin: 0 auto; padding: 14px; font-size: 1.15rem; gap: 10px; text-decoration: none;">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        เข้าสู่ระบบ e-Payment
                    </a>
                </div>
            </div>
        </div>

            <!-- Expense Table Reference -->
            <div class="card animate-in animate-delay-4 fee-table-card" style="min-width: 0; outline:none; border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden;">
            <div class="card-header"><h3 class="card-title">🧾 อัตราค่าธรรมเนียมการศึกษา หลักสูตรพยาบาลศาสตรมหาบัณฑิต</h3></div>
            <div class="card-body" style="padding:0">
                <div class="table-wrapper">
                    <table class="data-table" style="font-size: 0.9rem;">
                        <thead>
                            <tr>
                                <th>รายการ</th>
                                <th style="text-align: right; min-width: 120px;">คณะพยาบาลศาสตร์<br><span style="font-size:0.8rem; font-weight:normal; word-break: break-all;">หลักสูตรพยาบาลศาสตร<wbr>มหาบัณฑิต (บาท)</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="background:var(--bg-secondary); font-weight:600;"><td colspan="2">1. ค่าลงทะเบียน</td></tr>
                            <tr><td style="padding-left: 20px;">1.1 ค่าลงทะเบียน (เหมาจ่าย) ภาคการศึกษาที่ 1 และ 2 ภาคละ</td><td class="nowrap" style="text-align: right; font-weight:500;">30,000</td></tr>
                            <tr><td style="padding-left: 20px;">1.2 ค่าลงทะเบียน (เหมาจ่าย) ภาคฤดูร้อน ภาคละ</td><td class="nowrap" style="text-align: right; font-weight:500;">9,000</td></tr>
                            
                            <tr style="background:var(--bg-secondary); font-weight:600;"><td colspan="2">2. ค่าธรรมเนียม</td></tr>
                            <tr><td style="padding-left: 20px;">2.1 ค่าธรรมเนียมพิเศษ (เหมาจ่าย) ภาคการศึกษาที่ 1 และ 2 ภาคละ</td><td class="nowrap" style="text-align: right; font-weight:500;">5,000</td></tr>
                            <tr><td style="padding-left: 20px;">2.2 ค่าธรรมเนียมการสอบประมวลผลความรู้ ครั้งละ</td><td class="nowrap" style="text-align: right; color:var(--text-muted);">-</td></tr>
                            <tr><td style="padding-left: 20px;">2.3 ค่าธรรมเนียมการสอบป้องกันวิทยานิพนธ์/ค้นคว้าอิสระ ครั้งละ</td><td class="nowrap" style="text-align: right; font-weight:500;">10,000</td></tr>
                            <tr><td style="padding-left: 20px;">2.4 ค่าขึ้นทะเบียนนักศึกษาใหม่ (ชำระแรกเข้า)</td><td class="nowrap" style="text-align: right; font-weight:500;">1,000</td></tr>
                            <tr><td style="padding-left: 20px;">2.5 ค่าขึ้นทะเบียนเป็นบัณฑิต</td><td class="nowrap" style="text-align: right; font-weight:500;">2,000</td></tr>
                            <tr><td style="padding-left: 20px;">2.6 ค่ารักษาสถานภาพนักศึกษา</td><td style="text-align: right;"></td></tr>
                            <tr><td style="padding-left: 40px; color:var(--text-muted);">- ภาคการศึกษาที่ 1 และ 2 ภาคละ</td><td class="nowrap" style="text-align: right; font-weight:500;">3,000</td></tr>
                            <tr>
                                <td style="padding-left: 40px; color:var(--text-muted);">
                                    - ภาคฤดูร้อน ภาคละ<br>
                                    <span style="font-size:0.8rem; color:var(--text-muted);">(หมายเหตุ : นักศึกษาที่สอบป้องกันวิทยานิพนธ์/ค้นคว้าอิสระแล้วและรอเผยแพร่วิทยานิพนธ์ ไม่ต้องจ่ายค่ารักษาสถานภาพนักศึกษาในภาคฤดูร้อน)</span>
                                </td>
                                <td class="nowrap" style="text-align: right; vertical-align: top; padding-top: 14px; font-weight:500;">1,500</td>
                            </tr>

                            <tr style="background:var(--bg-secondary); font-weight:600;"><td style="padding-left: 10px;">3. ค่าธรรมเนียมการเทียบโอนรายวิชา วิชาละ</td><td class="nowrap" style="text-align: right; font-weight:500;">500</td></tr>

                            <tr style="background:var(--bg-secondary); font-weight:600;"><td colspan="2">4. ค่าธรรมเนียมอื่นๆ</td></tr>
                            <tr><td style="padding-left: 20px;">4.1 ค่าปรับลงทะเบียนเรียนล่าช้า (นับวันทำการ) วันละ <span style="font-size:0.8rem; color:var(--text-muted);">(ไม่เกิน 3,000 บาทต่อภาคการศึกษา)</span></td><td class="nowrap" style="text-align: right; font-weight:500;">200</td></tr>
                            <tr><td style="padding-left: 20px;">4.2 ค่าปรับส่งเล่มวิทยานิพนธ์ หรือการค้นคว้าอิสระ เกินกำหนด วันละ</td><td class="nowrap" style="text-align: right; font-weight:500;">200</td></tr>
                            <tr><td style="padding-left: 20px;">4.3 ค่าเบี้ยประกันอุบัติเหตุเป็นรายปี</td><td class="nowrap" style="text-align: right; font-size:0.85rem; color:var(--text-muted);">นักศึกษารับผิดชอบ<br>ดำเนินการเอง</td></tr>
                            <tr><td style="padding-left: 20px;">4.4 ค่าธรรมเนียมตรวจบทคัดย่อภาษาอังกฤษ</td><td class="nowrap" style="text-align: right; font-weight:500;">1,000</td></tr>
                            <tr><td style="padding-left: 20px;">4.5 ค่าธรรมเนียมเปลี่ยนแผนการศึกษา/สาขาวิชา ครั้งละ</td><td class="nowrap" style="text-align: right; font-weight:500;">1,000</td></tr>
                            <tr><td style="padding-left: 20px;">4.6 ค่าออกเอกสารทางการศึกษา</td><td style="text-align: right;"></td></tr>
                            <tr><td style="padding-left: 40px; color:var(--text-muted);">4.6.1 ค่าออกบัตรประจำตัวนักศึกษาทดแทนบัตรเก่า ครั้งละ</td><td class="nowrap" style="text-align: right; font-weight:500;">200</td></tr>
                            <tr><td style="padding-left: 40px; color:var(--text-muted);">4.6.2 ค่าออกเอกสารหรือใบรับรองระหว่างการศึกษา</td><td style="text-align: right;"></td></tr>
                            <tr><td style="padding-left: 60px; color:var(--text-muted);">- ภาษาไทย ฉบับละ</td><td class="nowrap" style="text-align: right; font-weight:500;">100</td></tr>
                            <tr><td style="padding-left: 60px; color:var(--text-muted);">- ภาษาอังกฤษ ฉบับละ</td><td class="nowrap" style="text-align: right; font-weight:500;">200</td></tr>
                            <tr><td style="padding-left: 40px; color:var(--text-muted);">4.6.3 ค่าออกเอกสารหลังสำเร็จการศึกษา (ออกทดแทน) ฉบับละ</td><td class="nowrap" style="text-align: right; font-weight:500;">100</td></tr>
                            <tr><td style="padding-left: 40px; color:var(--text-muted);">4.6.4 ค่าออกเอกสารภาษาอังกฤษ หน้าละ</td><td class="nowrap" style="text-align: right; font-weight:500;">200</td></tr>
                            <tr><td style="padding-left: 20px;">4.7 ค่าบริการจัดส่งเอกสาร หรือหนังสือสำคัญทางไปรษณีย์</td><td style="text-align: right;"></td></tr>
                            <tr><td style="padding-left: 40px; color:var(--text-muted);">4.7.1 การจัดส่งภายในประเทศ ครั้งละ</td><td class="nowrap" style="text-align: right; font-weight:500;">100</td></tr>
                            <tr><td style="padding-left: 40px; color:var(--text-muted);">4.7.2 การจัดส่งต่างประเทศ ครั้งละ</td><td class="nowrap" style="text-align: right; font-size:0.85rem; color:var(--text-muted);">ตามอัตราที่จ่ายจริง</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    </div>`;
};
