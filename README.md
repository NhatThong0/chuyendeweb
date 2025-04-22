✅ Bước 1: Tạo MongoDB Atlas Cluster
Truy cập: https://www.mongodb.com/cloud/atlas

Đăng nhập → chọn "Create" cluster miễn phí (Shared Cluster).

Chọn khu vực (ví dụ: AWS - Singapore hoặc gần bạn).

Đặt tên (tuỳ ý) → nhấn Create Cluster.

✅ Bước 2: Tạo database và collection
Vào cluster → Browse Collections

Nhấn Add My Own Data → tạo database ví dụ hairSalonBooking, collection bookings.

✅ Bước 3: Tạo user để kết nối
Vào tab Database Access

Nhấn + ADD NEW DATABASE USER

Username: ví dụ admin

Password: YourSecurePassword

Role: chọn Read and Write to Any Database

Nhấn Add User

✅ Bước 4: Mở quyền truy cập IP
Vào tab Network Access

Nhấn ADD IP ADDRESS

Chọn ALLOW ACCESS FROM ANYWHERE (0.0.0.0/0) → Confirm

✅ Bước 5: Lấy URI kết nối
Vào tab Clusters → nhấn Connect → Connect your application

Copy đoạn connection string, ví dụ:
const uri = "mongodb+srv://<db_username>:<db_password>@nhatthong.jrdblvv.mongodb.net/?retryWrites=true&w=majority&appName=nhatthong";
* Chú ý Thay thế <db_password> bằng mật khẩu cho người dùng cơ sở dữ liệu <db_username> 
