pages['analytics-reports'] = function() {
    return `
    <div class="animate-in">
        <div class="flex" style="justify-content:space-between; align-items:center; margin-bottom: 24px;">
            <h2 class="page-title">สถิติและรายงาน (Analytics & Reports)</h2>
            <div class="header-semester">
                <span>อัปเดตล่าสุด: ${new Date().toLocaleDateString('th-TH')}</span>
            </div>
        </div>

        <!-- 4 Summary Cards -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 24px;">
            <div class="stat-card">
                <div class="stat-icon" style="background:#eef2ff; color:#4f46e5;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>
                <div class="stat-info">
                    <span class="stat-label">นักศึกษาปัจจุบันทั้งหมด</span>
                    <h3 class="stat-value">1,248</h3>
                    <span class="stat-trend trend-up">↑ 5.2% จากปีที่แล้ว</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background:#ecfdf5; color:#10b981;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                </div>
                <div class="stat-info">
                    <span class="stat-label">ศิษย์เก่า (จบการศึกษา)</span>
                    <h3 class="stat-value">8,531</h3>
                    <span class="stat-trend trend-up">↑ 340 คน ในปีนี้</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background:#fff7ed; color:#f97316;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                </div>
                <div class="stat-info">
                    <span class="stat-label">เกรดเฉลี่ยรวม (GPAX)</span>
                    <h3 class="stat-value">3.45</h3>
                    <span class="stat-trend" style="color:var(--text-secondary);">คงที่</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background:#fdf2f8; color:#db2777;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="8" r="7"></circle>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                </div>
                <div class="stat-info">
                    <span class="stat-label">อัตราสำเร็จการศึกษาในเวลา</span>
                    <h3 class="stat-value">89.2%</h3>
                    <span class="stat-trend trend-up">↑ 1.5%</span>
                </div>
            </div>
        </div>

        <!-- Charts Layout -->
        <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr; margin-bottom: 24px;">
            <!-- Bar Chart: Students by Cohort -->
            <div class="card">
                <h3 class="card-title">จำนวนนักศึกษาแยกตามรุ่น (รหัส)</h3>
                <div style="display:flex; justify-content:space-around; align-items:flex-end; height:200px; padding-top:20px; border-bottom: 1px solid var(--border-color); margin-bottom: 10px;">
                    <div style="display:flex; flex-direction:column; align-items:center; width: 40px;">
                        <span style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">180</span>
                        <div style="background:var(--primary-color); width:100%; height:80px; border-radius: 4px 4px 0 0; opacity: 0.7;"></div>
                        <span style="font-size:0.8rem; font-weight:500; margin-top:8px;">รหัส 64</span>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; width: 40px;">
                        <span style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">210</span>
                        <div style="background:var(--primary-color); width:100%; height:110px; border-radius: 4px 4px 0 0; opacity: 0.8;"></div>
                        <span style="font-size:0.8rem; font-weight:500; margin-top:8px;">รหัส 65</span>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; width: 40px;">
                        <span style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">245</span>
                        <div style="background:var(--primary-color); width:100%; height:140px; border-radius: 4px 4px 0 0; opacity: 0.9;"></div>
                        <span style="font-size:0.8rem; font-weight:500; margin-top:8px;">รหัส 66</span>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; width: 40px;">
                        <span style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">285</span>
                        <div style="background:var(--primary-color); width:100%; height:160px; border-radius: 4px 4px 0 0;"></div>
                        <span style="font-size:0.8rem; font-weight:500; margin-top:8px;">รหัส 67</span>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; width: 40px;">
                        <span style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">328</span>
                        <div style="background:var(--secondary-color); width:100%; height:180px; border-radius: 4px 4px 0 0;"></div>
                        <span style="font-size:0.8rem; font-weight:500; margin-top:8px;">รหัส 68</span>
                    </div>
                </div>
            </div>

            <!-- Horizontal Bar Chart: Students by Major -->
            <div class="card">
                <h3 class="card-title">สัดส่วนตามสาขาวิชา (ป.โท)</h3>
                <div style="display:flex; flex-direction:column; gap: 15px; margin-top: 20px;">
                    
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:5px;">
                            <span>การพยาบาลผู้ใหญ่</span>
                            <span style="font-weight:600;">35%</span>
                        </div>
                        <div style="background:var(--bg-color); height:8px; border-radius:4px; overflow:hidden;">
                            <div style="background:var(--primary-color); width:35%; height:100%;"></div>
                        </div>
                    </div>

                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:5px;">
                            <span>การพยาบาลเด็ก</span>
                            <span style="font-weight:600;">22%</span>
                        </div>
                        <div style="background:var(--bg-color); height:8px; border-radius:4px; overflow:hidden;">
                            <div style="background:#10b981; width:22%; height:100%;"></div>
                        </div>
                    </div>

                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:5px;">
                            <span>การบริหารทางการพยาบาล</span>
                            <span style="font-weight:600;">18%</span>
                        </div>
                        <div style="background:var(--bg-color); height:8px; border-radius:4px; overflow:hidden;">
                            <div style="background:#f59e0b; width:18%; height:100%;"></div>
                        </div>
                    </div>

                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:5px;">
                            <span>การพยาบาลเวชปฏิบัติชุมชน</span>
                            <span style="font-weight:600;">15%</span>
                        </div>
                        <div style="background:var(--bg-color); height:8px; border-radius:4px; overflow:hidden;">
                            <div style="background:#8b5cf6; width:15%; height:100%;"></div>
                        </div>
                    </div>

                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:5px;">
                            <span>อื่นๆ</span>
                            <span style="font-weight:600;">10%</span>
                        </div>
                        <div style="background:var(--bg-color); height:8px; border-radius:4px; overflow:hidden;">
                            <div style="background:#94a3b8; width:10%; height:100%;"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>`;
};
