// ============================
// Schedule Page
// ============================
pages.schedule = function() {
    const sch = MOCK.schedule;
    const grid = Array.from({length: sch.timeSlots.length}, () => Array(sch.days.length).fill(null));
    sch.items.forEach(item => {
        for (let s = item.startSlot; s <= item.endSlot; s++) {
            grid[s][item.day] = (s === item.startSlot) ? item : 'span';
        }
    });

    return `
    <div class="animate-in">
        <div class="page-header">
            <h1 class="page-title">ตารางเรียน</h1>
            <p class="page-subtitle">ตารางเรียนประจำภาคเรียนที่ 2/2568</p>
        </div>
        <div class="card animate-in animate-delay-1">
            <div class="card-body" style="overflow-x:auto">
                <div class="schedule-grid">
                    <div class="schedule-header">เวลา</div>
                    ${sch.days.map(d => `<div class="schedule-header">${d}</div>`).join('')}
                    ${sch.timeSlots.map((time, ti) => `
                        <div class="schedule-time">${time}</div>
                        ${sch.days.map((_, di) => {
                            const cell = grid[ti][di];
                            if (cell === 'span') return '';
                            if (cell) {
                                const span = cell.endSlot - cell.startSlot + 1;
                                return `<div class="schedule-cell" style="grid-row:span ${span}">
                                    <div class="schedule-item color-${cell.color}">
                                        <strong>${window.formatDisplayCode(cell.code)}</strong>
                                        <span>${cell.name}</span>
                                        <span style="opacity:0.7;font-size:0.68rem">${cell.room}</span>
                                    </div>
                                </div>`;
                            }
                            return `<div class="schedule-cell"></div>`;
                        }).join('')}
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="card animate-in animate-delay-2" style="margin-top:18px">
            <div class="card-header"><h3 class="card-title">สรุปรายวิชาที่ลงทะเบียน</h3></div>
            <div class="card-body">
                <div class="enrollment-list">
                    ${MOCK.enrolledCourses.map((c,i) => `
                        <div class="enrollment-card">
                            <div style="display:flex;align-items:center;gap:12px">
                                <div style="width:4px;height:36px;border-radius:2px;background:var(--accent-primary);opacity:0.6"></div>
                                <div class="course-info">
                                    <span class="course-code">${window.formatDisplayCode(c.code)}</span>
                                    <span class="course-name">${c.name}</span>
                                </div>
                            </div>
                            <span style="font-size:0.82rem;color:var(--text-muted)">${c.schedule} · ${c.room}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
};
