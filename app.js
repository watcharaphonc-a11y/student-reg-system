// ============================
// Main Application Controller
// (loaded AFTER core.js, data.js, and page scripts)
// ============================

let currentPage = 'dashboard';

// DOM Elements
const contentArea = document.getElementById('contentArea');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const modalCloseBtn = document.getElementById('modalClose');

// ====== Navigation ======
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) navigateTo(page);
    });
});

function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`[data-page="${page}"]`);
    if (activeNav) activeNav.classList.add('active');
    renderPage();
    sidebar.classList.remove('mobile-open');
}

function renderPage() {
    if (pages[currentPage]) {
        contentArea.innerHTML = pages[currentPage]();
        contentArea.scrollTop = 0;
        // Initialize page-specific JS
        const initFn = window['init_' + currentPage.replace(/-/g, '_')];
        if (initFn) initFn();
    } else {
        contentArea.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <h3>ไม่พบหน้านี้</h3>
                <p>กรุณาเลือกเมนูจาก Sidebar</p>
            </div>`;
    }
}

// ====== Sidebar Toggle ======
sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
mobileMenuBtn.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));

// ====== Modal close button ======
modalCloseBtn.addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// ====== Boot ======
async function bootApp() {
    if (typeof showApiLoading === 'function') {
        showApiLoading('กำลังโหลดข้อมูลเบื้องต้น...');
    }
    try {
        // Fetch all necessary data from Google Sheets API
        const [studentsData, coursesData, enrollmentsData, paymentsData, evaluationsData] = await Promise.all([
            fetchData('getStudents'),
            fetchData('getCourses'),
            fetchData('getEnrollments'),
            fetchData('getPayments'),
            fetchData('getEvaluations')
        ]);
        
        // Merge real data with mock if exists
        if (studentsData && studentsData.length > 0) MOCK.students = studentsData;
        if (coursesData && coursesData.length > 0) MOCK.courses = coursesData;
        if (enrollmentsData && enrollmentsData.length > 0) MOCK.enrollments = enrollmentsData;
        if (paymentsData && paymentsData.length > 0) MOCK.payments = paymentsData;
        if (evaluationsData && evaluationsData.length > 0) MOCK.evaluations = evaluationsData;
        
        // Update current mock student reference to the last registered student if any real data exists
        if (studentsData && studentsData.length > 0) {
            MOCK.student = studentsData[studentsData.length - 1]; // Use latest student
        }
    } catch (e) {
        console.error('Failed to load API data, using mock data fallback', e);
    }
    
    if (typeof hideApiLoading === 'function') {
        hideApiLoading();
    }
    renderPage();
}

bootApp();
