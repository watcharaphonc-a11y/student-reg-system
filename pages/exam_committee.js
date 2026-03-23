// ============================
// Examination Committee Page
// ============================
pages['exam-committee'] = function() {
    const committees = MOCK.examCommittees || [];

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">คณะกรรมการสอบ</h1>
            <p class="page-subtitle">ข้อมูลคณะกรรมการสอบวิทยานิพนธ์</p>
        </div>

        ${committees.length === 0 ? `
        <div class="card animate-in animate-delay-1">
            <div class="card-body" style="text-align:center; padding:40px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin-bottom:15px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                <h3 style="color:var(--text-muted);">ยังไม่ได้แต่งตั้งคณะกรรมการสอบ</h3>
                <p style="color:var(--text-muted); font-size:0.9rem;">คณะกรรมการสอบจะถูกแต่งตั้งเมื่อวิทยานิพนธ์พร้อมสอบ</p>
            </div>
        </div>` : ''}

        ${committees.map((exam, idx) => `
        <div class="card animate-in animate-delay-${idx+1}" style="margin-bottom:18px;">
            <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h3 class="card-title">${exam.type}</h3>
                <div style="display:flex; gap:8px; align-items:center;">
                    ${getStatusBadge(exam.status)}
                    <span style="font-size:0.82rem; color:var(--text-muted);">${exam.date || ''}</span>
                </div>
            </div>
            <div class="card-body">
                ${exam.thesisTitle ? `<div style="margin-bottom:16px; padding:12px; background:var(--bg-secondary); border-radius:var(--radius-md); border-left:4px solid var(--accent-primary);">
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">หัวข้อวิทยานิพนธ์</div>
                    <div style="font-weight:500; font-size:0.95rem;">${exam.thesisTitle}</div>
                </div>` : ''}
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width:50px;">#</th>
                                <th>ชื่อ-สกุล</th>
                                <th>ตำแหน่งในคณะกรรมการ</th>
                                <th>ตำแหน่งวิชาการ</th>
                                <th>สังกัด</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${exam.members.map((m, i) => `
                                <tr>
                                    <td style="text-align:center;">${i+1}</td>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:10px;">
                                            <div style="width:32px;height:32px;border-radius:50%;background:${m.role === 'ประธานกรรมการ' ? 'var(--accent-primary)' : 'var(--bg-tertiary)'};display:flex;align-items:center;justify-content:center;color:${m.role === 'ประธานกรรมการ' ? 'white' : 'var(--text-primary)'};font-weight:600;font-size:0.8rem;">${m.name[0]}</div>
                                            <span>${m.name}</span>
                                        </div>
                                    </td>
                                    <td><span class="badge ${m.role === 'ประธานกรรมการ' ? 'success' : m.role === 'กรรมการผู้ทรงคุณวุฒิภายนอก' ? 'warning' : 'neutral'}">${m.role}</span></td>
                                    <td>${m.position}</td>
                                    <td>${m.affiliation}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ${exam.room ? `<div style="margin-top:14px; font-size:0.85rem; color:var(--text-muted);"><strong>ห้องสอบ:</strong> ${exam.room} &nbsp; | &nbsp; <strong>เวลา:</strong> ${exam.time || '-'}</div>` : ''}
            </div>
        </div>
        `).join('')}
    </div>`;
};
