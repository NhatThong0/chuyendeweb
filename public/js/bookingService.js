// Tải dữ liệu đặt lịch
async function loadBookings() {
    try {
        const response = await fetch("http://localhost:3000/api/bookings");
        const data = await response.json();

        if (data.success) {
            allBookings = data.data;
            applyFilters();
        } else {
            showError("Không thể tải dữ liệu: " + data.message);
        }
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        showError("Không thể kết nối với server. Vui lòng kiểm tra kết nối và thử lại.");
    }
}

// ...copy các hàm API calls khác...
