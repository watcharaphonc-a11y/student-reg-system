// ============================
// Google Sheets API Integration
// ============================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzbLUUvV4ziuEwlyoyKPifh3Tfnvtbhew9Yo2PNezzzguwADXxOzgLT0UMTmgwG3CjC/exec'.trim();

// Loading overlay to block UI during API calls
function showApiLoading(message = 'กำลังโหลดข้อมูล...') {
    let loader = document.getElementById('apiLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'apiLoader';
        loader.innerHTML = `
            <div style="background:var(--bg-card);padding:24px 32px;border-radius:var(--radius-lg);display:flex;align-items:center;gap:16px;box-shadow:var(--shadow-lg);border:1px solid var(--accent-primary)">
                <div class="loader-spinner" style="width:24px;height:24px;border:3px solid var(--border-color);border-top-color:var(--accent-primary);border-radius:50%;animation:spin 1s linear infinite"></div>
                <span id="apiLoaderMsg" style="font-weight:600">${message}</span>
            </div>
            <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
        `;
        loader.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);';
        document.body.appendChild(loader);
    } else {
        document.getElementById('apiLoaderMsg').textContent = message;
        loader.style.display = 'flex';
    }
}

function hideApiLoading() {
    const loader = document.getElementById('apiLoader');
    if (loader) loader.style.display = 'none';
}

// Fetch Data (GET)
// parameters: action (e.g. 'getStudents', 'getCourses')
async function fetchData(action) {
    if (!SCRIPT_URL || SCRIPT_URL.includes('your-script-url')) {
        console.error('API Error: SCRIPT_URL is not configured correctly in api.js');
        return null;
    }
    try {
        const url = `${SCRIPT_URL}?action=${action}`;
        console.log(`Fetching from: ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`API Error (${action}):`, error);
        throw error; // Re-throw so bootApp can catch the failure
    }
}

// Post Data (POST)
// parameters: action (e.g. 'registerStudent'), payload (object with data)
async function postData(action, payload) {
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: action, payload: payload })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { status: 'error', message: error.toString() };
    }
}

// Upload Single File (Robust for large files)
window.uploadFile = async function (file, metadata) {
    const MAX_FILE_SIZE = 40 * 1024 * 1024; // 40MB limit per file (approx 53MB in base64)
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`ไฟล์ "${file.name}" มีขนาดใหญ่เกินไป (${(file.size / (1024 * 1024)).toFixed(2)}MB) ระบบรองรับสูงสุด 40MB ต่อไฟล์ กรุณาลดขนาดไฟล์ก่อนส่งครับ`);
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const payload = {
                    ...metadata,
                    fileName: file.name,
                    mimeType: file.type,
                    base64Data: reader.result
                };
                const result = await postData('uploadDocument', payload, 300000); // 5 minute timeout
                resolve(result);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Generic POST helper with custom timeout
// WARNING: To avoid CORS Preflight (OPTIONS) which GAS doesn't support,
// we send as 'text/plain' or 'application/x-www-form-urlencoded'
async function postData(action, payload, timeoutMs = 120000) {
    console.log(`[API] Starting action: ${action} with timeout ${timeoutMs/1000}s`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        console.warn(`[API] Timeout reached for ${action}`);
        controller.abort();
    }, timeoutMs);

    try {
        // We use text/plain to avoid OPTIONS preflight request
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({ action: action, payload: payload }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log(`[API] Response received for ${action}, status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`[API] Data parsed for ${action}:`, data);
        return data;
    } catch (err) {
        clearTimeout(timeoutId);
        console.error(`[API] Error in ${action}:`, err);
        
        if (err.name === 'AbortError') {
            throw new Error(`การเชื่อมต่อหมดเวลา (Timeout) หลังจากรอ ${timeoutMs/1000} วินาที อาจเกิดจากไฟล์มีขนาดใหญ่หรืออินเทอร์เน็ตไม่เสถียรครับ`);
        }
        throw err;
    }
}
