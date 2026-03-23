// ============================
// Thesis Advisor Page
// ============================
pages['thesis-advisor'] = function() {
    const st = MOCK.student;
    const advisors = MOCK.thesisAdvisors || [];

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">อาจารย์ที่ปรึกษาวิทยานิพนธ์</h1>
            <p class="page-subtitle">ข้อมูลอาจารย์ที่ปรึกษาวิทยานิพนธ์ของนักศึกษา</p>
        </div>

        <!-- Current Student Thesis Info -->
        <div class="card animate-in animate-delay-1" style="margin-bottom:18px;">
            <div class="card-header"><h3 class="card-title">ข้อมูลวิทยานิพนธ์ของฉัน</h3></div>
            <div class="card-body">
                <div class="transcript-info">
                    <div class="transcript-info-item"><span class="label">ชื่อนักศึกษา:</span><span>${st ? (st.prefix||'')+(st.firstName||'')+' '+(st.lastName||'') : '-'}</span></div>
                    <div class="transcript-info-item"><span class="label">รหัสนักศึกษา:</span><span>${st ? (st.studentId||st.id||'-') : '-'}</span></div>
                    <div class="transcript-info-item"><span class="label">หัวข้อวิทยานิพนธ์:</span><span>${(MOCK.thesisInfo && MOCK.thesisInfo.title) || 'ยังไม่ได้ระบุ'}</span></div>
                    <div class="transcript-info-item"><span class="label">หัวข้อวิทยานิพนธ์ (EN):</span><span>${(MOCK.thesisInfo && MOCK.thesisInfo.titleEn) || 'Not specified'}</span></div>
                    <div class="transcript-info-item"><span class="label">สถานะ:</span><span>${getStatusBadge((MOCK.thesisInfo && MOCK.thesisInfo.status) || 'อยู่ระหว่างดำเนินการ')}</span></div>
                </div>
            </div>
        </div>

        <!-- Thesis Advisors -->
        <div class="card animate-in animate-delay-2">
            <div class="card-header">
                <h3 class="card-title">อาจารย์ที่ปรึกษาวิทยานิพนธ์</h3>
            </div>
            <div class="card-body">
                ${advisors.length === 0 ? '<div style="text-align:center; padding:30px; color:var(--text-muted);">ยังไม่ได้รับการแต่งตั้งอาจารย์ที่ปรึกษาวิทยานิพนธ์</div>' : ''}
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">
                ${advisors.map(a => `
                    <div style="border:1px solid var(--border-color); border-radius:var(--radius-md); padding:20px; background:var(--bg-secondary);">
                        <div style="display:flex; align-items:center; gap:14px; margin-bottom:14px;">
                            <div style="width:50px;height:50px;border-radius:50%;background:var(--accent-primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1.2rem;">${a.name[0]}</div>
                            <div>
                                <div style="font-weight:600; font-size:1rem;">${a.name}</div>
                                <div style="font-size:0.8rem; color:var(--accent-primary); font-weight:500;">${a.role}</div>
                            </div>
                        </div>
                        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:6px;">
                            <div><span style="color:var(--text-muted);">ตำแหน่งวิชาการ:</span> ${a.position}</div>
                            <div><span style="color:var(--text-muted);">สาขาเชี่ยวชาญ:</span> ${a.expertise}</div>
                            <div><span style="color:var(--text-muted);">อีเมล:</span> ${a.email}</div>
                            <div><span style="color:var(--text-muted);">โทรศัพท์:</span> ${a.phone}</div>
                        </div>
                    </div>
                `).join('')}
                </div>
            </div>
        </div>
    </div>`;
};
