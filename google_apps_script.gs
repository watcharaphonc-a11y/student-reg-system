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
  EVALUATIONS: 'Evaluations'
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
    [SHEETS.EVALUATIONS]: ['รหัสวิชา', 'คะแนน', 'ข้อคิดเห็น', 'วันที่']
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
