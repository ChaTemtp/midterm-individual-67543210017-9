1️⃣ Layer Diagram (แสดง 3 ชั้นหลัก)
<img width="246" height="761" alt="image" src="https://github.com/user-attachments/assets/daef918f-33c2-41e6-8cf1-3361c2a80098" />

2️⃣ Component Diagram (เชื่อม module แบบละเอียด)
<img width="1021" height="329" alt="image" src="https://github.com/user-attachments/assets/a127c06b-09a8-4d15-bf25-7f31147d6cca" />



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
