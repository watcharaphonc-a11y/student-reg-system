# ระบบทะเบียนนักศึกษาและบริการนักศึกษา (Student Registration & Services System)

สร้างเว็บแอปพลิเคชันระบบทะเบียนนักศึกษาครบวงจร ด้วย **Vite + React** พร้อม UI สวยงามทันสมัย รองรับภาษาไทย

## Proposed Changes

### Design System & Layout

#### [NEW] [index.css](file:///c:/Users/Nat_O/.gemini/antigravity/playground/perihelion-einstein/src/index.css)
- CSS variables สำหรับ color palette (dark theme + accent สี indigo/violet)
- Google Fonts: **Noto Sans Thai** + **Inter** สำหรับภาษาไทยและอังกฤษ
- Global reset, responsive utilities, animation keyframes

#### [NEW] [App.jsx](file:///c:/Users/Nat_O/.gemini/antigravity/playground/perihelion-einstein/src/App.jsx)
- Main layout: Sidebar + Header + Content area
- React Router สำหรับ navigation ระหว่างหน้า

---

### Components

#### [NEW] `src/components/Sidebar.jsx`
- เมนูนำทางหลักพร้อม icon (Lucide React)
- เมนูทั้งหมด:
  1. 📊 แดชบอร์ด (Dashboard)
  2. 👤 ข้อมูลนักศึกษา (Student Profile)
  3. 📋 ลงทะเบียนนักศึกษาใหม่ (New Registration)
  4. 📚 รายวิชา (Courses)
  5. ✏️ ลงทะเบียนเรียน (Enrollment)
  6. 📅 ตารางเรียน (Schedule)
  7. ⭐ ประเมินการสอน (Course Evaluation)
  8. 📊 ผลการเรียน/เกรด (Grades)
  9. 💰 ค่าธรรมเนียม/การชำระเงิน (Fees & Payments)
  9. 📜 ใบแสดงผลการศึกษา (Transcript)
  10. 🗓 ปฏิทินการศึกษา (Academic Calendar)
  11. 📢 ประกาศ (Announcements)
  12. 📄 ส่งเอกสารออนไลน์ (Student Documents)
  13. ✍️ อนุมัติเอกสาร (Admin Approvals)
  14. ⚙️ ตั้งค่า (Settings)
- Collapse/expand animation, active state highlight

#### [NEW] `src/components/Header.jsx`
- Search bar, notification bell, user avatar dropdown

#### [NEW] `src/components/StatCard.jsx` / `DataTable.jsx` / `Modal.jsx`
- Reusable UI components สำหรับใช้ทุกหน้า

---

### Pages (ทั้งหมด 11 หน้า)

#### [NEW] `src/pages/Dashboard.jsx`
- สรุปภาพรวม: จำนวนนักศึกษา, รายวิชา, รอชำระเงิน, GPA เฉลี่ย
- กิจกรรมล่าสุด, ประกาศสำคัญ, กราฟ bar/line chart

#### [NEW] `src/pages/StudentProfile.jsx`
- ข้อมูลส่วนตัว, รูปโปรไฟล์, ข้อมูลการศึกษา, ที่อยู่, ผู้ปกครอง

#### [NEW] `src/pages/NewRegistration.jsx`
- ฟอร์มลงทะเบียนนักศึกษาใหม่แบบ multi-step wizard

#### [NEW] `src/pages/Courses.jsx`
- ตารางรายวิชาทั้งหมดพร้อม search/filter, หน่วยกิต, อาจารย์

#### [NEW] `src/pages/Enrollment.jsx`
- เลือกรายวิชาลงทะเบียน, ตะกร้ารายวิชา, ยืนยันลงทะเบียน

#### [NEW] `src/pages/Grades.jsx`
- ผลการเรียนแยกตามภาคเรียน, GPA สะสม, กราฟผลการเรียน

#### [NEW] `src/pages/Schedule.js`
- ตารางเรียนรายสัปดาห์แบบ calendar view, แยกสีตามรายวิชา

#### [NEW] `src/pages/Evaluation.js`
- รายการวิชาที่ต้องประเมินการสอนในภาคเรียนปัจจุบัน
- ฟอร์มประเมินอาจารย์ผู้สอนและการจัดการเรียนการสอน (Rating 1-5 และข้อเสนอแนะ)

#### [NEW] `src/pages/Payments.jsx`
- รายการค่าธรรมเนียม, สถานะการชำระ, ประวัติการชำระ

#### [NEW] `src/pages/Transcript.jsx`
- ใบแสดงผลการศึกษาอย่างเป็นทางการ, ปุ่มพิมพ์/ดาวน์โหลด

#### [NEW] `src/pages/AcademicCalendar.jsx`
- ปฏิทินการศึกษาปี/ภาคเรียน พร้อม events

#### [NEW] `src/pages/Announcements.jsx`
- ข่าวประกาศ, ประเภทข่าว, วันที่, รายละเอียด

#### [NEW] `src/pages/Settings.jsx`
- ตั้งค่าบัญชี, เปลี่ยนรหัสผ่าน, การแจ้งเตือน, ธีม

#### [NEW] `src/pages/DocumentsStudent.jsx` (ส่งเอกสารออนไลน์)
- เมนูสำหรับนักศึกษา
- ฟอร์มแบบฟอร์มเอกสารออนไลน์, อัปโหลดไฟล์ PDF/รูปภาพ
- ตารางติดตามสถานะเอกสาร (รออนุมัติ, กำลังดำเนินการ, อนุมัติแล้ว, ปฏิเสธ)

#### [NEW] `src/pages/DocumentsAdmin.jsx` (อนุมัติเอกสาร)
- เมนูสำหรับอาจารย์/ผู้บริหาร/เจ้าหน้าที่
- รายการเอกสารที่รออนุมัติ
- ระบบดาวน์โหลดเอกสาร (เพื่อเซ็น) และอัปโหลดกลับเข้าระบบ
- ส่งต่อให้ขั้นต่อไปเพื่อดำเนินการอนุมัติ

---

### Data & Utilities

#### [NEW] `src/data/mockData.js`
- Mock data สำหรับนักศึกษา, รายวิชา, เกรด, ตารางเรียน, การชำระเงิน, ประกาศ, ปฏิทิน — ทั้งหมดเป็นข้อมูลภาษาไทย

---

### Tech Stack

| Technology | Purpose |
|---|---|
| Vite + React | Framework |
| React Router | Routing |
| Lucide React | Icons |
| Recharts | Charts/Graphs |
| CSS Variables | Theming (Dark mode) |
| Noto Sans Thai + Inter | Fonts |

## Verification Plan

### Browser Verification
- เปิดเว็บแอปด้วย `npm run dev` แล้วตรวจสอบผ่าน browser tool ว่า:
  1. ทุกเมนูคลิกแล้วนำทางไปหน้าที่ถูกต้อง
  2. DataTable ทำงานถูกต้อง
  3. Charts แสดงผลใน Dashboard
  4. ฟอร์มลงทะเบียนทำงานได้
  5. UI สวยงาม responsive
