/**
 * Graduate Admission Portal - Logic
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQNw9pI0QCc__UjR4JhmR8r3seti_EqmWhO9TS2t6tHCowqoK2UBKVZkxQveX_iNut/exec';

let currentStep = 1;
const totalSteps = 5;

// Document list configuration
const REQUIRED_DOCUMENTS = [
    { id: 'degree', title: 'สำเนาปริญญาบัตร / ใบรับรองการสำเร็จการศึกษา', required: true },
    { id: 'transcript', title: 'สำเนาใบรับรองผลการศึกษา (Transcript)', required: true },
    { id: 'license', title: 'สำเนาใบอนุญาตประกอบวิชาชีพการพยาบาล', required: true },
    { id: 'experience', title: 'หนังสือรับรองประสบการณ์การทำงาน', required: true },
    { id: 'idcard', title: 'สำเนาบัตรประจำตัวประชาชน', required: true },
    { id: 'house_reg', title: 'สำเนาทะเบียนบ้าน', required: true },
    { id: 'medical', title: 'ใบรับรองแพทย์', required: true },
    { id: 'payment', title: 'หลักฐานการโอนเงินค่าธรรมเนียมสมัคร (500 บาท)', required: true }
];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderDocumentList();
    setupEventListeners();
    updateStepUI();
}

function renderDocumentList() {
    const list = document.getElementById('document-list');
    list.innerHTML = REQUIRED_DOCUMENTS.map(doc => `
        <div class="doc-row">
            <div class="doc-info">
                <span class="doc-title">${doc.title} ${doc.required ? '<span style="color:var(--primary);">*</span>' : ''}</span>
                <span class="doc-status" id="status-${doc.id}">ยังไม่ได้แนบไฟล์</span>
            </div>
            <input type="file" id="file-${doc.id}" data-type="${doc.title}" style="display: none;" onchange="updateFileStatus('${doc.id}', this)">
            <button type="button" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;" onclick="document.getElementById('file-${doc.id}').click()">
                แนบไฟล์
            </button>
        </div>
    `).join('');
}

function updateFileStatus(id, input) {
    const statusLabel = document.getElementById(`status-${id}`);
    if (input.files && input.files[0]) {
        statusLabel.textContent = `✅ ${input.files[0].name}`;
        statusLabel.style.color = 'var(--primary)';
    } else {
        statusLabel.textContent = 'ยังไม่ได้แนบไฟล์';
        statusLabel.style.color = 'var(--text-muted)';
    }
}

function setupEventListeners() {
    // Photo preview
    const photoInput = document.getElementById('photo-input');
    photoInput.addEventListener('change', (e) => {
        const preview = document.getElementById('photo-preview');
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                preview.innerHTML = `<img src="${event.target.result}" alt="Photo Preview">`;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Navigation
    document.getElementById('next-btn').addEventListener('click', nextStep);
    document.getElementById('prev-btn').addEventListener('click', prevStep);

    // Form submission
    document.getElementById('admission-form').addEventListener('submit', handleFormSubmit);

    // ID Card formatting
    document.getElementById('id-card').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = '';
        if (value.length > 0) {
            formatted += value.substring(0, 1);
            if (value.length > 1) formatted += '-' + value.substring(1, 5);
            if (value.length > 5) formatted += '-' + value.substring(5, 10);
            if (value.length > 10) formatted += '-' + value.substring(10, 12);
            if (value.length > 12) formatted += '-' + value.substring(12, 13);
        }
        e.target.value = formatted;
    });
}

function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepUI();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI();
    }
}

function updateStepUI() {
    // Update sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
        if (parseInt(section.dataset.section) === currentStep) {
            section.classList.add('active');
        }
    });

    // Update stepper
    document.querySelectorAll('.step-item').forEach(item => {
        const stepNum = parseInt(item.dataset.step);
        item.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            item.classList.add('active');
        } else if (stepNum < currentStep) {
            item.classList.add('completed');
        }
    });

    // Update buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
    const section = document.querySelector(`.form-section[data-section="${step}"]`);
    const inputs = section.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.style.borderColor = 'var(--primary)';
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) {
        alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
    }

    // Special validation for documents (Step 5)
    if (step === 5 && isValid) {
        for (const doc of REQUIRED_DOCUMENTS) {
            if (doc.required) {
                const fileInput = document.getElementById(`file-${doc.id}`);
                if (!fileInput.files || !fileInput.files[0]) {
                    alert(`กรุณาแนบไฟล์: ${doc.title}`);
                    return false;
                }
            }
        }
    }

    return isValid;
}

function addEducation() {
    const list = document.getElementById('education-list');
    const firstItem = list.querySelector('.education-item');
    const newItem = firstItem.cloneNode(true);
    
    newItem.querySelectorAll('input').forEach(input => input.value = '');
    
    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-secondary';
    removeBtn.style.marginTop = '10px';
    removeBtn.style.color = 'var(--primary)';
    removeBtn.textContent = 'ลบรายการนี้';
    removeBtn.onclick = () => newItem.remove();
    
    newItem.appendChild(removeBtn);
    list.appendChild(newItem);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    if (!confirm('ยืนยันการส่งใบสมัครหรือไม่?')) return;

    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    loading.style.display = 'flex';

    try {
        const formData = new FormData(e.target);
        const payload = {};
        formData.forEach((value, key) => {
            if (!key.endsWith('[]')) {
                payload[key] = key === 'IdCard' ? value.replace(/-/g, '') : value;
            }
        });

        // Split Name if FullName was used
        if (payload.FullName) {
            const names = payload.FullName.split(' ');
            payload.FirstName = names[0];
            payload.LastName = names.slice(1).join(' ');
        }

        // Phase 1: Initialize Application
        loadingText.innerText = 'กำลังสร้างรหัสการสมัคร...';
        const initResult = await callAPI('initializeApplication', payload);
        
        if (initResult.status !== 'success') throw new Error(initResult.message);
        
        const { appId, folderId } = initResult;

        // Phase 2: Upload Files
        const filesToUpload = [];
        
        // Profile Photo
        const photoInput = document.getElementById('photo-input');
        if (photoInput.files[0]) {
            filesToUpload.push({ file: photoInput.files[0], type: 'รูปถ่าย' });
        }

        // Documents
        REQUIRED_DOCUMENTS.forEach(doc => {
            const input = document.getElementById(`file-${doc.id}`);
            if (input.files[0]) {
                filesToUpload.push({ file: input.files[0], type: doc.title });
            }
        });

        for (let i = 0; i < filesToUpload.length; i++) {
            const item = filesToUpload[i];
            loadingText.innerText = `กำลังอัปโหลดไฟล์ (${i + 1}/${filesToUpload.length}): ${item.type}`;
            
            const base64 = await fileToBase64(item.file);
            const fileName = `${payload.FirstName}_${payload.LastName}_${item.type}.${item.file.name.split('.').pop()}`;

            await callAPI('uploadApplicationFile', {
                appId,
                folderId,
                fileName,
                mimeType: item.file.type,
                docType: item.type,
                base64Data: base64
            });
        }

        // Finalize
        loading.style.display = 'none';
        document.getElementById('admission-form').style.display = 'none';
        document.getElementById('stepper').style.display = 'none';
        document.getElementById('result-app-id').textContent = appId;
        document.getElementById('success-card').style.display = 'block';

    } catch (error) {
        console.error(error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
        loading.style.display = 'none';
    }
}

async function callAPI(action, payload) {
    const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action, payload })
    });
    return response.json();
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
