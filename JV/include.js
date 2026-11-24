// include.js - nạp header.html / footer.html vào các trang
// Cách dùng: đặt <div data-include="header.html"></div> ở nơi muốn chèn
async function loadIncludes() {
    const slots = document.querySelectorAll('[data-include]');
    await Promise.all([...slots].map(async slot => {
        try {
            const res = await fetch(slot.dataset.include);
            if (!res.ok) throw new Error(res.status);
            // thay thẳng placeholder bằng nội dung (giữ nguyên position: sticky của .task-menu)
            slot.outerHTML = await res.text();
        } catch (err) {
            console.error('Không nạp được', slot.dataset.include, err);
        }
    }));
    // header vừa được chèn xong -> cập nhật lại số trên giỏ hàng
    if (typeof updateCartCount === 'function') updateCartCount();
}
document.addEventListener('DOMContentLoaded', loadIncludes);
