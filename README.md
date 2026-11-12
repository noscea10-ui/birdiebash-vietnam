# 🏸 Birdie Bash 3D - Phiên Bản Tiếng Việt (Vietnamese Edition)

Game cầu lông 3D siêu cute trên trình duyệt với đầy đủ tính năng:
- 🇻🇳 Giao diện, nút điều khiển và hướng dẫn 100% Tiếng Việt.
- 🦊 Hệ thống nhân vật Việt: **Kim Ngân, Eris, Lam Anh, Cu Tý, Cu Tèo, Bảo Long, Bé Bự, Tuấn Kiệt...**
- 🏟️ 3 Sân thi đấu: **Sân Phước Hòa, Sân Phú Giáo, Sân Bình Dương**.
- 🎙️ Bình luận viên vui nhộn: Cà khịa *"Bạn đánh ngu ghê!!"*, khen ngợi *"Pha đập cầu quá đỉnh!"*.
- 🎮 Chế độ chơi: Đấu với Bot (Tập sự / Chuyên nghiệp / Cao thủ) & Đấu Online qua WebSocket.

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local)

1. Cài đặt thư viện:
   ```bash
   npm install
   ```

2. Khởi động server:
   ```bash
   npm start
   ```

3. Mở trình duyệt và truy cập:
   👉 **http://localhost:3000**

---

## 🌐 Hướng Dẫn Đưa Lên Online (Deploy)

### Cách 1: Đưa lên Render.com (Miễn phí & Dễ nhất)
1. Tải source code lên GitHub hoặc nén thành ZIP.
2. Truy cập [Render.com](https://render.com) -> Chọn **New Web Service**.
3. Kết nối repository GitHub của bạn.
4. Cấu hình:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Bấm **Deploy** -> Render sẽ cấp cho bạn một đường link online (ví dụ: `https://birdiebash-vn.onrender.com`).

### Cách 2: Đưa lên Railway.app
1. Truy cập [Railway.app](https://railway.app) -> Tạo project mới từ GitHub repo hoặc upload source.
2. Railway sẽ tự động nhận diện Node.js và chạy lệnh `npm start`.

### Cách 3: Chạy trên VPS (Ubuntu / Debian / CentOS)
```bash
# Cài đặt Node.js & npm (nếu chưa có)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Giải nén source code và chạy
unzip birdiebash-vietnam.zip -d birdiebash
cd birdiebash
npm install
npm install -g pm2
pm2 start server.js --name "birdiebash"
```

### Cách 4: Chạy bằng Docker
```bash
docker build -t birdiebash .
docker run -p 3000:3000 birdiebash
```
