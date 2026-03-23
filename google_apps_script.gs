/**
 * Google Apps Script for Student Registration System
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any code and paste this code.
 * 4. Click 'Save' and then 'Deploy' > 'New Deployment'.
 * 5. Choose 'Web App', set 'Execute as: Me' and 'Who has access: Anyone'.
 * 6. Copy the Web App URL and paste it into Script_URL / api.js in your project.
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();

// Configure Sheet Names
const SHEETS = {
  USERS: 'Users',
  STUDENTS: 'Students',
  TEACHERS: 'Teachers',
  COURSES: 'Courses',
  ENROLLMENTS: 'Enrollments',
  PAYMENTS: 'Payments',
  EVALUATIONS: 'Evaluations',
  DOCUMENTS: 'Documents'
};

/**
 * Handle GET Requests
 */
function doGet(e) {
  const action = e.parameter.action;
  let data = [];
  
  try {
    switch (action) {
      case 'getUsers':
        data = getSheetData(SHEETS.USERS);
        break;
      case 'getStudents':
        data = getSheetData(SHEETS.STUDENTS);
        break;
      case 'getTeachers':
        data = getSheetData(SHEETS.TEACHERS);
        break;
      case 'getCourses':
        data = getSheetData(SHEETS.COURSES);
        break;
      case 'getEnrollments':
        data = getSheetData(SHEETS.ENROLLMENTS);
        break;
      case 'getPayments':
        data = getSheetData(SHEETS.PAYMENTS);
        break;
      case 'getEvaluations':
        data = getSheetData(SHEETS.EVALUATIONS);
        break;
      case 'getDocuments':
        data = getSheetData(SHEETS.DOCUMENTS);
        break;
      default:
        return createResponse({ status: 'error', message: 'Unknown action' });
    }
    return createResponse(data);
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * Handle POST Requests
 */
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const payload = request.payload;
    
    switch (action) {
      case 'registerStudent':
        appendRow(SHEETS.STUDENTS, payload);
        // Also add to Users sheet for login
        appendRow(SHEETS.USERS, {
          Username: payload.username || payload.studentId || payload.idCard,
          Password: payload.password || '123456',
          Name: payload.name || (payload.firstName + ' ' + payload.lastName),
          Role: 'student',
          Status: 'ใช้งาน'
        });
        break;
      case 'registerTeacher':
        appendRow(SHEETS.TEACHERS, payload);
        // Also add to Users sheet for login
        appendRow(SHEETS.USERS, {
          Username: payload.username || payload.email,
          Password: payload.password || '111111',
          Name: payload.name || (payload.firstName + ' ' + payload.lastName),
          Role: 'staff',
          Status: 'ใช้งาน'
        });
        break;
      case 'registerCourse':
        appendRow(SHEETS.COURSES, payload);
        break;
      case 'uploadDocument':
        return uploadDocumentToDrive(payload);
      default:
        return createResponse({ status: 'error', message: 'Unknown POST action' });
    }
    
    return createResponse({ status: 'success' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * Helper: Get data from sheet as JSON
 */
function getSheetData(sheetName) {
  const sheet = SS.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
}

/**
 * Helper: Append a new row to a sheet
 */
function appendRow(sheetName, payload) {
  let sheet = SS.getSheetByName(sheetName);
  
  // Create sheet if not exists
  if (!sheet) {
    sheet = SS.insertSheet(sheetName);
    const headers = Object.keys(payload);
    sheet.appendRow(headers);
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(h => payload[h] || '');
  
  sheet.appendRow(newRow);
}

/**
 * Helper: Upload Base64 File to Google Drive
 */
function uploadDocumentToDrive(payload) {
  // 1. Get or Create Folder for Documents
  let folder;
  const folderName = "Student_Documents";
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(folderName);
  }
  
  // 2. Decode and create file
  let data = payload.base64Data;
  if (data && data.indexOf(',') > -1) {
    data = data.split(',')[1];
  }
  
  const blob = Utilities.newBlob(Utilities.base64Decode(data), payload.mimeType || 'application/pdf', payload.fileName || 'document.pdf');
  const file = folder.createFile(blob);
  
  // Set sharing to anyone with the link can view
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  const fileUrl = file.getUrl();
  
  // 3. Save to Sheets
  appendRow(SHEETS.DOCUMENTS, {
    'รหัสนักศึกษา': payload.studentId || '',
    'ชื่อผู้ส่ง': payload.senderName || '',
    'ประเภทเอกสาร': payload.documentType || 'ทั่วไป',
    'ชื่อไฟล์': payload.fileName || '',
    'ลิงก์เอกสาร': fileUrl,
    'วันที่ส่ง': new Date().toLocaleString('th-TH'),
    'สถานะ': 'รอตรวจสอบ'
  });
  
  return createResponse({ status: 'success', fileUrl: fileUrl });
}

/**
 * Helper: Create JSON Output
 */
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once to initialize all sheets
 */
function setupInitialSheets() {
  const defaultHeaders = {
    [SHEETS.USERS]: ['Username', 'Password', 'Name', 'Role', 'Status'],
    [SHEETS.STUDENTS]: ['คำนำหน้า','ชื่อ (ไทย)','นามสกุล (ไทย)','ชื่อ (EN)','นามสกุล (EN)','เลขบัตรประชาชน','รหัสนักศึกษา','วันเกิด (YYYY-MM-DD)','เพศ','อีเมล','E-mail ของสถาบัน','เบอร์โทร','สาขาวิชา','ปีการศึกษาที่เข้า','ที่อยู่','Username','Password'],
    [SHEETS.TEACHERS]: ['คำนำหน้า','ชื่อ','นามสกุล','ตำแหน่งทางวิชาการ','ความเชี่ยวชาญ','อีเมล','เบอร์โทร','คณะ/สังกัด','นศ. ในกำกับ','Username','Password'],
    [SHEETS.COURSES]: ['รหัสวิชา', 'ชื่อวิชา', 'หน่วยกิต', 'กลุ่ม', 'อาจารย์ผู้สอน'],
    [SHEETS.ENROLLMENTS]: ['รหัสนักศึกษา', 'รหัสวิชา', 'ภาคเรียน', 'ปีการศึกษา', 'เกรด'],
    [SHEETS.PAYMENTS]: ['รหัสนักศึกษา', 'รายการ', 'จำนวนเงิน', 'สถานะ', 'วันที่'],
    [SHEETS.EVALUATIONS]: ['รหัสวิชา', 'คะแนน', 'ข้อคิดเห็น', 'วันที่'],
    [SHEETS.DOCUMENTS]: ['รหัสนักศึกษา', 'ชื่อผู้ส่ง', 'ประเภทเอกสาร', 'ชื่อไฟล์', 'ลิงก์เอกสาร', 'วันที่ส่ง', 'สถานะ']
  };

  Object.keys(defaultHeaders).forEach(sheetName => {
    let sheet = SS.getSheetByName(sheetName);
    if (!sheet) {
      sheet = SS.insertSheet(sheetName);
      sheet.appendRow(defaultHeaders[sheetName]);
    }
  });

  // Add a sample admin if Users sheet was just created
  const userSheet = SS.getSheetByName(SHEETS.USERS);
  if (userSheet.getLastRow() === 1) {
    userSheet.appendRow(['admin', '999999', 'Super Admin', 'admin', 'ใช้งาน']);
  }
}
