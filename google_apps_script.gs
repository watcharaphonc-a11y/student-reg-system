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
  DOCUMENTS: 'Documents',
  ANNOUNCEMENTS: 'Announcements',
  PERMISSIONS: 'Permissions',
  EXAMS: 'Exams'
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
      case 'getAnnouncements':
        data = getSheetData(SHEETS.ANNOUNCEMENTS);
        break;
      case 'getAllData':
        data = {
          users: getSheetData(SHEETS.USERS),
          students: getSheetData(SHEETS.STUDENTS),
          teachers: getSheetData(SHEETS.TEACHERS),
          courses: getSheetData(SHEETS.COURSES),
          enrollments: getSheetData(SHEETS.ENROLLMENTS),
          payments: getSheetData(SHEETS.PAYMENTS),
          evaluations: getSheetData(SHEETS.EVALUATIONS),
          documents: getSheetData(SHEETS.DOCUMENTS),
          announcements: getSheetData(SHEETS.ANNOUNCEMENTS),
          permissions: getSheetData(SHEETS.PERMISSIONS),
          exams: getSheetData(SHEETS.EXAMS)
        };
        break;
      case 'getPermissions':
        data = getSheetData(SHEETS.PERMISSIONS);
        break;
      case 'getExams':
        data = getSheetData(SHEETS.EXAMS);
        break;
      default:
        return createResponse({ status: 'error', message: 'Unknown action' });
    }
    console.log(`Action ${action} completed successfully`);
    return createResponse(data);
  } catch (err) {
    console.error(`doGet Error (${action}):`, err);
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
      case 'updateDocumentStatus':
        return updateDocumentStatus(payload);
      case 'importGrades':
        return importGradesBatch(payload);
      case 'postAnnouncement':
        return postAnnouncement(payload);
      case 'updatePermission':
        return updatePermission(payload);
      case 'updateExam':
        return updateExamResult(payload);
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
  
  const headers = values[0].map(h => String(h).trim());
  const rows = values.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * UTILITY: Run this once to fix missing Tracking IDs in the Documents sheet
 */
function fixMissingIds() {
  const sheet = SS.getSheetByName(SHEETS.DOCUMENTS);
  if (!sheet) return;
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim());
  const idCol = headers.indexOf('รหัสติดตาม');
  
  if (idCol === -1) {
    setupInitialSheets();
    return fixMissingIds(); // Try again after setup
  }
  
  for (let i = 1; i < values.length; i++) {
    if (!values[i][idCol]) {
      const newId = 'DOC-FIX-' + new Date().getTime() + '-' + i;
      sheet.getRange(i + 1, idCol + 1).setValue(newId);
    }
  }
  SpreadsheetApp.getUi().alert('✅ แก้ไขรหัสติดตาม (Tracking ID) เสร็จเรียบร้อยแล้ว!\n\nกรุณากลับไปที่หน้าเว็บแล้วกด REFRESH (F5) 1 ครั้งเพื่อใช้งาน');
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
  
  // 3. Save to Sheets (Check if update or new)
  const docId = payload.id;
  const sheet = SS.getSheetByName(SHEETS.DOCUMENTS);
  
  if (docId && sheet) {
    // UPDATE existing row
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idCol = headers.indexOf('รหัสติดตาม');
    
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][idCol] == docId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex > 0) {
      // Find 'ลิงก์เอกสารที่ลงนาม' column
      const signedCol = headers.indexOf('ลิงก์เอกสารที่ลงนาม') + 1;
      if (signedCol > 0) {
        sheet.getRange(rowIndex, signedCol).setValue(fileUrl);
      }
      
      // Update status too
      const statusCol = headers.indexOf('สถานะ') + 1;
      if (statusCol > 0) {
        sheet.getRange(rowIndex, statusCol).setValue('ลงนามเรียบร้อยแล้ว');
      }
      
    return createResponse({ status: 'success', id: docId, fileUrl: fileUrl, action: 'update' });
    } else {
      console.warn(`uploadDocumentToDrive: docId ${docId} provided but not found in sheet.`);
    }
  }

  // NEW Row
  const newId = 'DOC-' + new Date().getTime();
  const newRowPayload = {
    'รหัสติดตาม': newId,
    'รหัสนักศึกษา': payload.studentId || '',
    'ชื่อผู้ส่ง': payload.senderName || '',
    'ประเภทเอกสาร': payload.documentType || 'ทั่วไป',
    'ชื่อไฟล์': payload.fileName || '',
    'ลิงก์เอกสาร': fileUrl,
    'วันที่ส่ง': new Date().toLocaleString('th-TH'),
    'สถานะ': 'รอตรวจสอบ'
  };
  console.log('Inserting new document row:', newRowPayload);
  appendRow(SHEETS.DOCUMENTS, newRowPayload);
  
  return createResponse({ status: 'success', id: newId, fileUrl: fileUrl, action: 'insert' });
}

/**
 * Helper: Update Document Status in Sheets
 */
function updateDocumentStatus(payload) {
  console.log('updateDocumentStatus payload:', payload);
  const sheet = SS.getSheetByName(SHEETS.DOCUMENTS);
  if (!sheet) return createResponse({ status: 'error', message: 'Documents sheet not found' });
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim());
  const rows = values.slice(1);
  
  console.log('Cleaned Headers:', headers);
  
  // Find row by ID
  let rowIndex = -1;
  const idCol = headers.indexOf('รหัสติดตาม');
  
  if (idCol !== -1 && payload.id) {
    for (let i = 0; i < rows.length; i++) {
        // Use loose equality and trim to match strings/numbers
        if (String(rows[i][idCol]).trim() == String(payload.id).trim()) {
          rowIndex = i + 2;
          console.log(`Match found by ID at row ${rowIndex}`);
          break;
        }
    }
  }
  
  // Fallback to studentId + documentType if ID not found
  if (rowIndex === -1) {
    console.log('ID match failed, attempting fallback match...');
    const sIdCol = headers.indexOf('รหัสนักศึกษา');
    const typeCol = headers.indexOf('ประเภทเอกสาร');
    
    if (sIdCol !== -1 && typeCol !== -1) {
        // Use studentId and documentName to find. 
        // We look for the MOST RECENT row (bottom-up) to avoid duplicates
        for (let i = rows.length - 1; i >= 0; i--) {
          const sId = String(rows[i][sIdCol]).trim();
          const type = String(rows[i][typeCol]).trim();
          const targetSId = String(payload.studentId).trim();
          const targetType = String(payload.documentType).trim();
          
          if (sId == targetSId && type == targetType) {
            rowIndex = i + 2;
            console.log(`Match found by fallback at row ${rowIndex}`);
            break;
          }
        }
    }
  }
  
  if (rowIndex === -1) {
    const debugInfo = `ID: ${payload.id}, Student: ${payload.studentId}, Type: ${payload.documentType}. Available Headers: ${headers.join(',')}`;
    console.error('Document not found:', debugInfo);
    return createResponse({ status: 'error', message: `ไม่พบข้อมูลเอกสารในระบบ (Document not found).\n\nรายละเอียด: ${debugInfo}\n\nคำแนะนำ: กรุณา Refresh หน้าเว็บ 1 ครั้งแล้วลองใหม่` });
  }
  
  // Update fields
  const updateMap = {
    'สถานะ': payload.status,
    'ผู้รับผิดชอบถัดไป': payload.nextStep,
    'หมายเหตุ': payload.note
  };
  
  if (payload.signedFileUrl) {
    updateMap['ลิงก์เอกสารที่ลงนาม'] = payload.signedFileUrl;
  }
  
  Object.keys(updateMap).forEach(headerName => {
    const colIndex = headers.indexOf(headerName) + 1;
    if (colIndex > 0) {
      sheet.getRange(rowIndex, colIndex).setValue(updateMap[headerName]);
    }
  });
  
  return createResponse({ status: 'success' });
}

/**
 * Helper: Import Grades in Batch
 */
function importGradesBatch(payload) {
  const sheet = SS.getSheetByName(SHEETS.ENROLLMENTS);
  if (!sheet) return createResponse({ status: 'error', message: 'Enrollments sheet not found' });
  
  const data = payload.grades; // Array of objects
  if (!data || !Array.isArray(data)) return createResponse({ status: 'error', message: 'Invalid grades data' });
  
  const sheetData = sheet.getDataRange().getValues();
  const headers = sheetData[0].map(h => String(h).trim());
  const rows = sheetData.slice(1);
  
  const sIdIdx = headers.indexOf('รหัสนักศึกษา');
  const cCodeIdx = headers.indexOf('รหัสวิชา');
  const semIdx = headers.indexOf('ภาคเรียน');
  const yearIdx = headers.indexOf('ปีการศึกษา');
  
  if (sIdIdx === -1) return createResponse({ status: 'error', message: 'Enrollments sheet headers missing "รหัสนักศึกษา"' });
  
  // Helper to get value using multiple possible keys
  const getVal = (item, thKey, enKey) => item[thKey] || item[enKey] || '';

  const newRows = [];
  const updates = []; // {row, values}

  data.forEach(item => {
    const sId = String(getVal(item, 'รหัสนักศึกษา', 'student_id')).trim();
    const cCode = String(getVal(item, 'รหัสวิชา', 'course_code')).trim();
    const sem = String(getVal(item, 'ภาคเรียน', 'semester')).trim();
    const year = String(getVal(item, 'ปีการศึกษา', 'academic_year')).trim();
    
    if (!sId) return;

    let existingRowIdx = -1;
    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i][sIdIdx]).trim() === sId && 
          String(rows[i][cCodeIdx]).trim() === cCode && 
          String(rows[i][semIdx]).trim() === sem && 
          String(rows[i][yearIdx]).trim() === year) {
        existingRowIdx = i + 2; // +1 for slice, +1 for 1-based range
        break;
      }
    }

    const rowValues = headers.map(h => {
      // Map common Thai headers to possible EN keys
      if (h === 'รหัสนักศึกษา') return sId;
      if (h === 'รหัสวิชา') return cCode;
      if (h === 'ชื่อวิชา') return getVal(item, 'ชื่อวิชา', 'course_name');
      if (h === 'หน่วยกิต') return getVal(item, 'หน่วยกิต', 'credits');
      if (h === 'ภาคเรียน') return sem;
      if (h === 'ปีการศึกษา') return year;
      if (h === 'เกรด') return getVal(item, 'เกรด', 'grade');
      return item[h] || '';
    });

    if (existingRowIdx > 0) {
      updates.push({ row: existingRowIdx, values: rowValues });
    } else {
      newRows.push(rowValues);
    }
  });

  // Execute updates
  updates.forEach(u => {
    sheet.getRange(u.row, 1, 1, headers.length).setValues([u.values]);
  });
  
  // Execute appends
  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length).setValues(newRows);
  }
  
  return createResponse({ status: 'success', count: data.length });
}

/**
 * Post a new announcement
 */
function postAnnouncement(payload) {
  setupInitialSheets();
  const sheet = SS.getSheetByName(SHEETS.ANNOUNCEMENTS);
  if (!sheet) return createResponse({ status: 'error', message: 'Announcements sheet not found' });
  
  const announcementId = 'ANN-' + new Date().getTime();
  const dateStr = new Date().toISOString();
  
  const row = [
    announcementId,
    payload.type || 'ทั่วไป',
    payload.title || 'ไม่มีหัวข้อ',
    payload.content || '',
    dateStr,
    payload.icon || '📢',
    payload.author || 'Admin'
  ];
  
  sheet.appendRow(row);
  return createResponse({ status: 'success', id: announcementId });
}

/**
 * Update a specific permission
 */
function updatePermission(payload) {
  const sheet = SS.getSheetByName(SHEETS.PERMISSIONS);
  if (!sheet) return createResponse({ status: 'error', message: 'Permissions sheet not found' });
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const roleIdx = headers.indexOf('Role');
  const actionIdx = headers.indexOf(payload.actionKey);
  
  if (actionIdx === -1) return createResponse({ status: 'error', message: 'Action not found: ' + payload.actionKey });
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][roleIdx]).toLowerCase() === String(payload.role).toLowerCase()) {
      sheet.getRange(i + 1, actionIdx + 1).setValue(payload.value ? 'YES' : 'NO');
      return createResponse({ status: 'success' });
    }
  }
  
  return createResponse({ status: 'error', message: 'Role not found' });
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
    [SHEETS.ENROLLMENTS]: ['รหัสนักศึกษา', 'รหัสวิชา', 'ชื่อวิชา', 'หน่วยกิต', 'ภาคเรียน', 'ปีการศึกษา', 'เกรด'],
    [SHEETS.PAYMENTS]: ['รหัสนักศึกษา', 'รายการ', 'จำนวนเงิน', 'สถานะ', 'วันที่'],
    [SHEETS.EVALUATIONS]: ['รหัสวิชา', 'คะแนน', 'ข้อคิดเห็น', 'วันที่'],
    [SHEETS.DOCUMENTS]: ['รหัสติดตาม', 'รหัสนักศึกษา', 'ชื่อผู้ส่ง', 'ประเภทเอกสาร', 'ชื่อไฟล์', 'ลิงก์เอกสาร', 'วันที่ส่ง', 'สถานะ', 'ผู้รับผิดชอบถัดไป', 'ลิงก์เอกสารที่ลงนาม', 'หมายเหตุ'],
    [SHEETS.ANNOUNCEMENTS]: ['รหัสประกาศ', 'ประเภท', 'หัวข้อ', 'เนื้อหา', 'วันที่ประกาศ', 'ไอคอน', 'ผู้ประกาศ'],
    [SHEETS.PERMISSIONS]: ['Role', 'import_student', 'export_template', 'manage_users', 'post_announcement', 'delete_data'],
    [SHEETS.EXAMS]: ['student_id', 'exam_type', 'status', 'score', 'date', 'note']
  };

  const defaultPermissions = [
    ['admin', 'YES', 'YES', 'YES', 'YES', 'YES'],
    ['teacher', 'NO', 'YES', 'NO', 'YES', 'NO'],
    ['student', 'NO', 'NO', 'NO', 'NO', 'NO']
  ];

  Object.keys(defaultHeaders).forEach(sheetName => {
    let sheet = SS.getSheetByName(sheetName);
    if (!sheet) {
      sheet = SS.insertSheet(sheetName);
      sheet.appendRow(defaultHeaders[sheetName]);
      
      // Special initialization for Permissions
      if (sheetName === SHEETS.PERMISSIONS) {
        defaultPermissions.forEach(p => sheet.appendRow(p));
      }
    } else {
      // Check if we need to add missing columns
      if (sheetName === SHEETS.DOCUMENTS || sheetName === SHEETS.PERMISSIONS) {
        const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        defaultHeaders[sheetName].forEach(h => {
          if (currentHeaders.indexOf(h) === -1) {
            sheet.getRange(1, sheet.getLastColumn() + 1).setValue(h);
          }
        });
      }
    }
  });

  // Add a sample admin if Users sheet was just created
  const userSheet = SS.getSheetByName(SHEETS.USERS);
  if (userSheet.getLastRow() === 1) {
    userSheet.appendRow(['admin', '999999', 'Super Admin', 'admin', 'ใช้งาน']);
  }
}

/**
 * Helper: Create a standardized JSON response for Apps Script
 */
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Update or Insert an Exam Result
 */
function updateExamResult(payload) {
  const sheet = SS.getSheetByName(SHEETS.EXAMS);
  if (!sheet) return createResponse({ status: 'error', message: 'Exams sheet not found' });
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim());
  const rows = values.slice(1);
  
  const sIdIdx = headers.indexOf('student_id');
  const typeIdx = headers.indexOf('exam_type');
  
  if (sIdIdx === -1 || typeIdx === -1) {
    // If headers missing, just append if it's the first data
    if (values.length === 1 && values[0].length === 0) {
       sheet.appendRow(['student_id', 'exam_type', 'status', 'score', 'date', 'note']);
       return updateExamResult(payload);
    }
    return createResponse({ status: 'error', message: 'Exams sheet headers missing' });
  }
  
  let rowIndex = -1;
  const sId = String(payload.student_id).trim();
  const type = String(payload.exam_type).trim();
  
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][sIdIdx]).trim() === sId && String(rows[i][typeIdx]).trim() === type) {
      rowIndex = i + 2;
      break;
    }
  }
  
  const rowData = headers.map(h => payload[h] || '');
  
  if (rowIndex !== -1) {
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  return createResponse({ status: 'success' });
}
