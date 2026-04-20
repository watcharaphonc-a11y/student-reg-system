pages['analytics-reports'] = function() {
    return `
    <div class="animate-in">
        <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
            <div>
                <h2 class="page-title">สถิติและรายงาน (Analytics & Reports)</h2>
                <p class="page-subtitle">ภาพรวมข้อมูลนักศึกษาและผลการศึกษาเชิงลึก</p>
            </div>
            <div class="header-semester" style="padding: 10px 20px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted)">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>อัปเดตล่าสุด: <span style="color:var(--accent-primary); font-weight: 700;">${new Date().toLocaleDateString('th-TH')}</span></span>
            </div>
        </div>

        <!-- 4 Summary Cards -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
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
                    <span class="stat-change up">↑ 5.2% จากปีที่แล้ว</span>
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
                    <span class="stat-change up">↑ 340 คน ในปีนี้</span>
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
                    <span class="stat-change" style="background:var(--bg-tertiary); color:var(--text-secondary);">คงที่</span>
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
                    <span class="stat-change up">↑ 1.5%</span>
                </div>
            </div>
        </div>

        <!-- Charts Layout -->
        <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr; gap: 28px;">
            <!-- Bar Chart: Students by Cohort -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title" style="display:flex; align-items:center; gap:8px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent-primary)">
                            <rect x="4" y="6" width="16" height="12" rx="2" ry="2"/>
                            <path d="M4 12h16"/>
                        </svg>
                        จำนวนนักศึกษาแยกตามรุ่น (รหัส)
                    </h3>
                </div>
                <div class="card-body">
                    <div style="display:flex; justify-content:space-around; align-items:flex-end; height:240px; padding: 20px 0 10px 0; border-bottom: 2px solid var(--border-color); margin-bottom: 20px;">
                        <div style="display:flex; flex-direction:column; align-items:center; width: 45px; transition: var(--transition-fast);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='none'">
                            <span style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">180</span>
                            <div style="background:var(--accent-gradient); width:100%; height:80px; border-radius: 6px 6px 0 0; opacity: 0.7; box-shadow: var(--shadow-sm);"></div>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:center; width: 45px; transition: var(--transition-fast);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='none'">
                            <span style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">210</span>
                            <div style="background:var(--accent-gradient); width:100%; height:110px; border-radius: 6px 6px 0 0; opacity: 0.8; box-shadow: var(--shadow-sm);"></div>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:center; width: 45px; transition: var(--transition-fast);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='none'">
                            <span style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">245</span>
                            <div style="background:var(--accent-gradient); width:100%; height:140px; border-radius: 6px 6px 0 0; opacity: 0.9; box-shadow: var(--shadow-sm);"></div>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:center; width: 45px; transition: var(--transition-fast);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='none'">
                            <span style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">285</span>
                            <div style="background:var(--accent-gradient); width:100%; height:160px; border-radius: 6px 6px 0 0; box-shadow: var(--shadow-sm);"></div>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:center; width: 45px; transition: var(--transition-fast);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='none'">
                            <span style="font-size:0.85rem; font-weight:800; color:var(--accent-primary); margin-bottom:8px;">328</span>
                            <div style="background:var(--accent-gradient-2); width:100%; height:180px; border-radius: 6px 6px 0 0; box-shadow: var(--shadow-md);"></div>
                        </div>
                    </div>
                    
                    <div style="display:flex; justify-content:space-around; align-items:center; padding: 0 10px;">
                        <span style="font-size:0.9rem; font-weight:600; color:var(--text-secondary);">รหัส 64</span>
                        <span style="font-size:0.9rem; font-weight:600; color:var(--text-secondary);">รหัส 65</span>
                        <span style="font-size:0.9rem; font-weight:600; color:var(--text-secondary);">รหัส 66</span>
                        <span style="font-size:0.9rem; font-weight:600; color:var(--text-secondary);">รหัส 67</span>
                        <span style="font-size:0.9rem; font-weight:700; color:var(--text-primary);">รหัส 68</span>
                    </div>
                </div>
            </div>

            <!-- Horizontal Bar Chart: Students by Major -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">สัดส่วนตามสาขาวิชา (ป.โท)</h3>
                </div>
                <div class="card-body">
                    <div style="display:flex; flex-direction:column; gap: 20px;">
                        
                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:8px;">
                                <span style="font-weight:500;">การพยาบาลผู้ใหญ่</span>
                                <span style="font-weight:700; color:var(--text-primary);">35%</span>
                            </div>
                            <div style="background:var(--bg-tertiary); height:10px; border-radius:5px; overflow:hidden;">
                                <div style="background:var(--accent-gradient); width:35%; height:100%; border-radius:5px;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:8px;">
                                <span style="font-weight:500;">การพยาบาลเด็ก</span>
                                <span style="font-weight:700; color:var(--text-primary);">22%</span>
                            </div>
                            <div style="background:var(--bg-tertiary); height:10px; border-radius:5px; overflow:hidden;">
                                <div style="background:linear-gradient(90deg, #10b981, #059669); width:22%; height:100%; border-radius:5px;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:8px;">
                                <span style="font-weight:500;">การบริหารทางการพยาบาล</span>
                                <span style="font-weight:700; color:var(--text-primary);">18%</span>
                            </div>
                            <div style="background:var(--bg-tertiary); height:10px; border-radius:5px; overflow:hidden;">
                                <div style="background:linear-gradient(90deg, #f59e0b, #d97706); width:18%; height:100%; border-radius:5px;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:8px;">
                                <span style="font-weight:500;">การพยาบาลเวชปฏิบัติชุมชน</span>
                                <span style="font-weight:700; color:var(--text-primary);">15%</span>
                            </div>
                            <div style="background:var(--bg-tertiary); height:10px; border-radius:5px; overflow:hidden;">
                                <div style="background:linear-gradient(90deg, #8b5cf6, #6d28d9); width:15%; height:100%; border-radius:5px;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:8px;">
                                <span style="font-weight:500;">อื่นๆ</span>
                                <span style="font-weight:700; color:var(--text-primary);">10%</span>
                            </div>
                            <div style="background:var(--bg-tertiary); height:10px; border-radius:5px; overflow:hidden;">
                                <div style="background:linear-gradient(90deg, #94a3b8, #64748b); width:10%; height:100%; border-radius:5px;"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>`;
};
