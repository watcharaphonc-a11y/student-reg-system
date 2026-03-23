// ============================
// Academic Calendar Page
// ============================
pages.calendar = function() {
    // Generate March 2026 calendar
    const year = 2026, month = 2; // 0-indexed: March = 2
    const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const dayNames = ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'];
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = 18;

    let days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: daysInPrevMonth - i, otherMonth: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const events = MOCK.calendarEvents.filter(e => e.date === dateStr);
        days.push({ day: d, today: d === today, events });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, otherMonth: true });
    }

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ปฏิทินการศึกษา</h1>
            <p class="page-subtitle">ปฏิทินกิจกรรมและกำหนดการสำคัญ ภาคฤดูร้อน/2568</p>
        </div>
        <div class="card animate-in animate-delay-1" style="margin-bottom:18px">
            <div class="card-header">
                <h3 class="card-title">${monthNames[month]} ${year + 543}</h3>
                <div style="display:flex;gap:8px">
                    <span class="badge" style="background:rgba(239,68,68,0.15);color:#f87171">สอบ</span>
                    <span class="badge" style="background:rgba(99,102,241,0.15);color:#818cf8">ทะเบียน</span>
                    <span class="badge" style="background:rgba(34,197,94,0.15);color:#4ade80">วันหยุด</span>
                    <span class="badge" style="background:rgba(245,158,11,0.15);color:#fbbf24">กิจกรรม</span>
                </div>
            </div>
            <div class="card-body">
                <div class="calendar-grid">
                    ${dayNames.map(d => `<div class="calendar-day-header">${d}</div>`).join('')}
                    ${days.map(d => `
                        <div class="calendar-day ${d.otherMonth ? 'other-month' : ''} ${d.today ? 'today' : ''}">
                            <div class="calendar-day-number">${d.day}</div>
                            ${(d.events || []).map(e => `<div class="calendar-event event-${e.type}">${e.title}</div>`).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="card animate-in animate-delay-2">
            <div class="card-header"><h3 class="card-title">กำหนดการสำคัญ</h3></div>
            <div class="card-body">
                <div class="activity-list">
                    ${MOCK.calendarEvents.map(e => `
                        <div class="activity-item">
                            <div class="activity-dot ${e.type === 'exam' ? 'orange' : e.type === 'holiday' ? 'green' : e.type === 'register' ? 'purple' : 'blue'}"></div>
                            <div>
                                <div class="activity-text">${e.title}</div>
                                <div class="activity-time">${e.date}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
};
