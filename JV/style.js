// ------------------- Cập nhật số lượng trên biểu tượng giỏ -------------------
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.gio-hang span');
    if (cartCount) cartCount.textContent = total;
}

// ------------------- Lưu / thêm vào giỏ hàng -------------------
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.name === product.name);
    if (index >= 0) {
        cart[index].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
}

// ------------------- Gắn sự kiện nút "Thêm vào giỏ" -------------------
function initAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Tìm phần tử chứa thông tin sản phẩm (có thể là .san-pham hoặc .ttin-nvat)
            let productElem = button.closest('.san-pham');
            if (!productElem) {
                productElem = button.closest('.ttin-nvat');
            }
            if (!productElem) return;

            const name = productElem.querySelector('.name').textContent.trim();
            const priceText = productElem.querySelector('.price').textContent.trim().replace(/[^\d]/g, '');
            const imageElem = productElem.querySelector('img') || document.querySelector('.sp img');
            const image = imageElem ? imageElem.getAttribute('src') : '';

            const product = {
                name: name,
                price: parseInt(priceText),
                image: image
            };

            addToCart(product);
        });
    });
}


// ------------------- Hiển thị danh sách giỏ hàng -------------------
function renderCart(containerSelector = '.product-list') {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${item.image}" alt="">
            <div class="product-name">${item.name}</div>
            <div class="product-price">${item.price.toLocaleString()} ₫</div>
            <div class="product-quantity">
                <div class="button decrease" data-index="${index}">&lt;</div>
                <div class="slg">${item.quantity}</div>
                <div class="button increase" data-index="${index}">&gt;</div>
            </div>
            <div class="product-delete" data-index="${index}">Xóa</div>
        `;

        container.appendChild(productDiv);
        container.appendChild(document.createElement('br'));
    });

    // Thêm phần xác nhận và tổng tiền
    const xacNhanDiv = document.createElement('div');
    xacNhanDiv.className = 'xac-nhan';
    xacNhanDiv.innerHTML = `
        <div class="tong-tien">Tổng tiền: ${total.toLocaleString()} ₫</div>
        <a href="#" class="a">Thanh Toán</a>
    `;
    container.appendChild(xacNhanDiv);

    attachCartEventListeners();
    handleThanhToan(); // gắn sự kiện thanh toán lại mỗi lần render
}

// ------------------- Gắn sự kiện Tăng / Giảm / Xoá -------------------
function attachCartEventListeners() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    document.querySelectorAll('.button.decrease').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(button.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                saveCart(cart);
                renderCart();
            }
        });
    });

    document.querySelectorAll('.button.increase').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(button.dataset.index);
            cart[index].quantity += 1;
            saveCart(cart);
            renderCart();
        });
    });

    document.querySelectorAll('.product-delete').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(button.dataset.index);
            cart.splice(index, 1);
            saveCart(cart);
            renderCart();
        });
    });
}

// ------------------- Xử lý nút Thanh Toán (hiển thị popup) -------------------
function handleThanhToan() {
    const thanhToanBtn = document.querySelector('.a');
    const popup = document.getElementById('success-popup');

    if (thanhToanBtn) {
        thanhToanBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (popup) {
                popup.style.display = "flex";
            }

            // Xoá giỏ hàng
            localStorage.removeItem("cart");

            setTimeout(() => {
                if (popup) popup.style.display = "none";
                renderCart();
                updateCartCount();
            }, 3000);
        });
    }
}

// ------------------- Khởi tạo -------------------
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    initAddToCartButtons();
    renderCart();
});










