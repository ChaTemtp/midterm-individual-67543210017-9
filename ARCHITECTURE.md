1️⃣ Layer Diagram (แสดง 3 ชั้นหลัก)+---------------------------+
|      Presentation Layer    |
|---------------------------|
| - Routes (bookRoutes.js) |
| - Controllers             |
| - Views / Frontend        |
+---------------------------+
             |
             v
+---------------------------+
|       Business Layer       |
|---------------------------|
| - Services (bookService) |
| - Validators              |
+---------------------------+
             |
             v
+---------------------------+
|          Data Layer        |
|---------------------------|
| - Repositories            |
| - Database (SQLite)       |
+---------------------------+

2️⃣ Component Diagram (เชื่อม module แบบละเอียด)
[Frontend: HTML/CSS/JS] 
        |
        v
[bookRoutes.js] --> [bookController.js] --> [bookService.js] --> [bookRepository.js] --> [SQLite database]


3️⃣ Flow Diagram (ตัวอย่าง borrow book)
User clicks "Borrow" button
        |
        v
  API call PATCH /books/:id/borrow
        |
        v
  bookRoutes -> bookController.borrowBook()
        |
        v
  bookService.borrowBook()
        |
        v
  bookRepository.updateStatus(id, 'borrowed')
        |
        v
     SQLite database
        |
        v
  Response success -> Controller -> Frontend updates UI