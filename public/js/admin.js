// Biến global
let allBookings = [];
let currentPage = 1;
const itemsPerPage = 10;

// Định dạng ngày giờ
function formatDate(dateString) {
    const options = {
        weekday: "long",
        year: "numeric", 
        month: "long",
        day: "numeric"
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
}

function formatTime(timeString) {
    return timeString;
}

// Khởi tạo các event listeners
function initializeEventListeners() {
    // Hiển thị ngày hiện tại
    document.getElementById("currentDate").textContent = formatDate(new Date());

    // Form edit booking
    document.getElementById("editForm").addEventListener("submit", handleEditSubmit);

    // Bộ lọc
    document.getElementById("searchInput").addEventListener("input", applyFilters);
    document.getElementById("statusFilter").addEventListener("change", applyFilters);
    document.getElementById("dateFilter").addEventListener("change", applyFilters);
    document.getElementById("refreshBtn").addEventListener("click", handleRefresh);

    // Click bên ngoài modal
    window.onclick = handleOutsideClick;
}

// ...copy tất cả các hàm còn lại từ script cũ...

// Khởi tạo khi DOM đã load
document.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners();
    loadBookings();
});
