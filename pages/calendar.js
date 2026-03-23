// ============================
// Academic Calendar Page
// ============================

// Store current calendar state globally
window._calMonth = new Date().getMonth(); // current month (0-indexed)
window._calYear = new Date().getFullYear();

window.buildCalendarHTML = function(year, month) {
    const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const dayNames = ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const now = new Date();
    const todayDay = (now.getFullYear() === year && now.getMonth() === month) ? now.getDate() : -1;

    let days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: daysInPrevMonth - i, otherMonth: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const events = (MOCK.calendarEvents || []).filter(e => e.date === dateStr);
        days.push({ day: d, today: d === todayDay, events });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, otherMonth: true });
    }

    // Filter events for the "กำหนดการสำคัญ" list (only current month)
    const monthEvents = (MOCK.calendarEvents || []).filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });

    // Build month options
    const monthOptions = monthNames.map((m, i) =>
        `<option value="${i}" ${i === month ? 'selected' : ''}>${m}</option>`
    ).join('');

    // Build year options (2568-2570 BE = 2025-2027 CE)
    const yearOptions = [];
    for (let y = 2025; y <= 2027; y++) {
        yearOptions.push(`<option value="${y}" ${y === year ? 'selected' : ''}>${y + 543}</option>`);
    }

    return `
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
                <button class="btn" style="padding:6px 12px; background:var(--bg-tertiary); border:1px solid var(--border-color); color:var(--text-primary); font-size:1.1rem;" onclick="calNavigate(-1)" title="เดือนก่อนหน้า">‹</button>
                <div style="display:flex; gap:8px; align-items:center;">
                    <select class="form-select" id="calMonthSelect" onchange="calSelectChanged()" style="min-width:130px; padding:6px 10px; font-size:0.95rem;">
                        ${monthOptions}
                    </select>
                    <select class="form-select" id="calYearSelect" onchange="calSelectChanged()" style="min-width:100px; padding:6px 10px; font-size:0.95rem;">
                        ${yearOptions.join('')}
                    </select>
                </div>
                <button class="btn" style="padding:6px 12px; background:var(--bg-tertiary); border:1px solid var(--border-color); color:var(--text-primary); font-size:1.1rem;" onclick="calNavigate(1)" title="เดือนถัดไป">›</button>
                <button class="btn" style="padding:6px 12px; background:var(--accent-primary); color:white; border:none; font-size:0.85rem; border-radius:var(--radius-md);" onclick="calGoToday()">วันนี้</button>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
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
        </div>`;
};

window.buildEventListHTML = function(year, month) {
    const monthEvents = (MOCK.calendarEvents || []).filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });

    if (monthEvents.length === 0) {
        return `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.9rem;">ไม่มีกำหนดการในเดือนนี้</div>`;
    }

    return `<div class="activity-list">
        ${monthEvents.map(e => `
            <div class="activity-item">
                <div class="activity-dot ${e.type === 'exam' ? 'orange' : e.type === 'holiday' ? 'green' : e.type === 'register' ? 'purple' : 'blue'}"></div>
                <div>
                    <div class="activity-text">${e.title}</div>
                    <div class="activity-time">${e.date}</div>
                </div>
            </div>
        `).join('')}
    </div>`;
};

pages.calendar = function() {
    const year = window._calYear;
    const month = window._calMonth;
    const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ปฏิทินการศึกษา</h1>
            <p class="page-subtitle">ปฏิทินกิจกรรมและกำหนดการสำคัญ</p>
        </div>
        <div class="calendar-layout-container">
            <div class="card animate-in animate-delay-1" id="calendarCard">
                ${buildCalendarHTML(year, month)}
            </div>
            <div class="card animate-in animate-delay-2" id="calendarEventList">
                <div class="card-header"><h3 class="card-title">กำหนดการสำคัญ — ${monthNames[month]} ${year + 543}</h3></div>
                <div class="card-body">
                    ${buildEventListHTML(year, month)}
                </div>
            </div>
        </div>
    </div>`;
};

// Navigation helpers — update only the calendar card & event list, not full page
window.calNavigate = function(dir) {
    window._calMonth += dir;
    if (window._calMonth > 11) { window._calMonth = 0; window._calYear++; }
    if (window._calMonth < 0) { window._calMonth = 11; window._calYear--; }
    calRefresh();
};

window.calSelectChanged = function() {
    window._calMonth = parseInt(document.getElementById('calMonthSelect').value);
    window._calYear = parseInt(document.getElementById('calYearSelect').value);
    calRefresh();
};

window.calGoToday = function() {
    const now = new Date();
    window._calMonth = now.getMonth();
    window._calYear = now.getFullYear();
    calRefresh();
};

window.calRefresh = function() {
    const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const card = document.getElementById('calendarCard');
    const eventList = document.getElementById('calendarEventList');
    if (card) {
        card.innerHTML = buildCalendarHTML(window._calYear, window._calMonth);
    }
    if (eventList) {
        eventList.innerHTML = `
            <div class="card-header"><h3 class="card-title">กำหนดการสำคัญ — ${monthNames[window._calMonth]} ${window._calYear + 543}</h3></div>
            <div class="card-body">
                ${buildEventListHTML(window._calYear, window._calMonth)}
            </div>`;
    }
};
