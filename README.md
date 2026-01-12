# Library Management System - Layered Architecture

## 📋 Project Information
- **Student Name:** [นายไตรภพ ก๋องใจ]
- **Student ID:** [67543210017-9]
- **Course:** ENGSE207 Software Architecture

## 🏗️ Architecture Style
Layered Architecture (3-tier)

## 📂 Project Structure
<img width="1208" height="122" alt="image" src="https://github.com/user-attachments/assets/6d069da8-9684-4460-ad5e-eb4e6f46b4d7" />

[อธิบายโครงสร้างโฟลเดอร์]
## monolithic ##
<img width="233" height="397" alt="image" src="https://github.com/user-attachments/assets/eea81185-9d36-4e67-a521-22e851ab8b7a" />


## Layered ##
<img width="240" height="772" alt="image" src="https://github.com/user-attachments/assets/d8a26660-2c23-430c-994e-100a852e0ebc" />


## 🎯 Refactoring Summary

### ปัญหาของ Monolithic (เดิม):
- โค้ดทั้งหมดอยู่ในไฟล์เดียว ทำให้ดูแลยาก
- การแก้ไขฟีเจอร์หนึ่งอาจกระทบส่วนอื่นโดยไม่ตั้งใจ
- การ scale ระบบทำได้ยาก

### วิธีแก้ไขด้วย Layered Architecture:
- แยกโค้ดออกเป็น **Presentation / Business / Data** layer
- Controller ทำหน้าที่รับ request และส่ง response
- Service ประมวลผล logic และ validate
- Repository ติดต่อฐานข้อมูล SQLite
- Middleware จัดการ error และ response format

### ประโยชน์ที่ได้รับ:
- แก้ไขและเพิ่มฟีเจอร์ง่ายขึ้น
- ทดสอบโค้ดแต่ละชั้นได้ง่าย
- เข้าใจ flow ของระบบง่ายขึ้น
 
## 🚀 How to Run

\`\`\`bash
# 1. Clone repository
git clone [https://github.com/ChaTemtp/midterm-individual-67543210017-9]

# 2. Install dependencies
# npm install

# 3. Run server
# npm start

# 4. Test API
# Open browser: http://localhost:3000
\`\`\`

## 📝 API Endpoints
[ระบุ API endpoints ทั้งหมด]

# Method	   URL	                   Description
 GET	      /api/books	               ดึงหนังสือทั้งหมด
 GET	      /api/books/:id	    ดึงหนังสือ 1 เล่มตาม ID
 POST	   /api/books	                เพิ่มหนังสือใหม่
 PUT	    /api/books/:id	           แก้ไขข้อมูลหนังสือ
 PATCH	    /api/books/:id/borrow	   ยืมหนังสือ
 PATCH	    /api/books/:id/return	   คืนหนังสือ
 DELETE	    /api/books/:id	        ลบหนังสือ

