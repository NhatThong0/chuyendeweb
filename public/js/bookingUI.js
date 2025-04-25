// Hiển thị modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

// Đóng modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Hiển thị thông báo lỗi
function showError(message) {
    alert("Lỗi: " + message);
}

// Hiển thị thông báo thành công 
function showMessage(message) {
    alert(message);
}

// Xử lý click bên ngoài modal
function handleOutsideClick(event) {
    const modals = document.getElementsByClassName("modal");
    for (let i = 0; i < modals.length; i++) {
        if (event.target === modals[i]) {
            modals[i].style.display = "none";
        }
    }
}
