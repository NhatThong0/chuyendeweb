const express = require("express");
// const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path"); // <- cần để xử lý đường dẫn file

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public")); // Thư mục public phục vụ static files (HTML, CSS, JS)

// ✅ Trả về trang home.html khi truy cập root "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html")); // ← Đảm bảo home.html nằm trong public/
});

// MongoDB
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const mongoURI = "mongodb+srv://nhatthong:j6EECGEiJc222oLo@nhatthong.jrdblvv.mongodb.net/hairSalonBooking?retryWrites=true&w=majority&appName=nhatthong";


const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
      console.log("✅ Đã kết nối MongoDB Atlas");
    }
    return client.db("hairSalonBooking");
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB Atlas:", err);
    process.exit(1);
  }
}


// ------------------ API ------------------

// Tạo mới đặt lịch
app.post("/api/bookings", async (req, res) => {
  try {
    console.log(">>> SERVER NHẬN:", req.body);
    const db = await connectDB();
    const bookings = db.collection("bookings");

    const bookingData = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
      date: req.body.date,
      time: req.body.time,
      notes: req.body.notes,
      status: "", // Để trống ban đầu
      createdAt: new Date(),
    };

    const result = await bookings.insertOne(bookingData);
    res.status(201).json({
      success: true,
      message: "Đặt lịch thành công",
      bookingId: result.insertedId,
    });
  } catch (err) {
    console.error("Lỗi tạo đặt lịch:", err);
    res.status(500).json({ success: false, message: "Lỗi tạo đặt lịch" });
  }
});

// Lấy tất cả lịch
app.get("/api/bookings", async (req, res) => {
  try {
    const db = await connectDB();
    const bookings = db.collection("bookings");

    const data = await bookings.find({}).sort({ date: -1, time: 1 }).toArray();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Lỗi lấy danh sách:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy danh sách" });
  }
});

// Lấy theo ID
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const bookings = db.collection("bookings");

    const booking = await bookings.findOne({ _id: new ObjectId(req.params.id) });
    if (!booking) return res.status(404).json({ success: false, message: "Không tìm thấy" });

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error("Lỗi lấy theo ID:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy chi tiết" });
  }
});

// Hủy đặt lịch
app.put("/api/bookings/:id/cancel", async (req, res) => {
  try {
    const db = await connectDB();
    const bookings = db.collection("bookings");

    const result = await bookings.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "cancelled" } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lịch" });
    }

    res.status(200).json({ success: true, message: "Đã hủy lịch" });
  } catch (err) {
    console.error("Lỗi hủy:", err);
    res.status(500).json({ success: false, message: "Lỗi khi hủy lịch" });
  }
});

// Cập nhật trạng thái
app.put("/api/bookings/:id/status", async (req, res) => {
  try {
    const db = await connectDB();
    const bookings = db.collection("bookings");

    const { status } = req.body;
    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const result = await bookings.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lịch" });
    }

    res.status(200).json({ success: true, message: "Đã cập nhật trạng thái" });
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật" });
  }
});

// Cập nhật toàn bộ thông tin lịch
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const bookings = db.collection("bookings");

    const updated = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
      date: req.body.date,
      time: req.body.time,
      notes: req.body.notes,
      status: req.body.status,
      updatedAt: new Date(),
    };

    const result = await bookings.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updated }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lịch" });
    }

    res.status(200).json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    res.status(500).json({ success: false, message: "Lỗi cập nhật" });
  }
});

// Xóa lịch
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const bookings = db.collection("bookings");

    const result = await bookings.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lịch" });
    }

    res.status(200).json({ success: true, message: "Đã xóa lịch" });
  } catch (err) {
    console.error("Lỗi xóa:", err);
    res.status(500).json({ success: false, message: "Lỗi xóa" });
  }
});

// Thống kê
app.get("/api/bookings/stats/count", async (req, res) => {
  try {
    const db = await connectDB();
    const bookings = db.collection("bookings");

    const stats = await bookings.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]).toArray();

    const result = { total: 0, confirmed: 0, cancelled: 0, completed: 0 };
    stats.forEach(stat => {
      if (stat._id) {
        result[stat._id] = stat.count;
        result.total += stat.count;
      }
    });

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Lỗi thống kê:", err);
    res.status(500).json({ success: false, message: "Lỗi thống kê" });
  }
});

// ------------------ START ------------------
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});

// nhatthong432
//  mk mongodb cld : XbYGyh6TXNxzEPfs