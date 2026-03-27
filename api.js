// ============================
// Google Sheets API Integration
// ============================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRPhkG1zKjpiiUvSU2GzKtTf9z8ejvhFTWlL5Y4wElapv5TEQfWVOnw38iXHYLrM13/exec'.trim();

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

// Upload File (POST with Base64)
// parameters: file (File object), metadata (object with studentId, etc.)
window.uploadFile = async function (file, metadata) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            const base64Data = reader.result;
            const payload = {
                ...metadata,
                fileName: file.name,
                mimeType: file.type,
                base64Data: base64Data
            };

            try {
                const response = await postData('uploadDocument', payload);
                resolve(response);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file); // This converts file to base64 string
    });
};
