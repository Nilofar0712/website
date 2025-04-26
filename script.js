document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const addToast = new bootstrap.Toast(document.getElementById('added-to-cart-toast'));
    const removeToast = new bootstrap.Toast(document.getElementById('removed-from-cart-toast'));
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    let cartDropdown = null;

    // Initialize dropdown only if element exists
    const desktopCartDropdownEl = document.getElementById('desktopCartDropdown');
    if (desktopCartDropdownEl) {
        cartDropdown = new bootstrap.Dropdown(desktopCartDropdownEl);
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    function updateCartDropdown() {
        const containers = document.querySelectorAll('.cart-items-container');
        const totalAmountElements = document.querySelectorAll('.cart-total-amount');

        if (cart.length === 0) {
            containers.forEach(el => {
                el.innerHTML = '<div class="px-3 py-2 text-muted">Your cart is empty</div>';
            });
            totalAmountElements.forEach(el => {
                el.textContent = '0';
            });
            return;
        }

        let html = '';
        let totalAmount = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;

            html += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <h6>${item.name}</h6>
                        <small>₹${item.price} × ${item.quantity} = ₹${itemTotal}</small>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                        <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        containers.forEach(el => {
            el.innerHTML = html;
        });

        totalAmountElements.forEach(el => {
            el.textContent = totalAmount;
        });

        setupCartInteractions();
    }

    function setupCartInteractions() {
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                updateQuantity(id, -1);
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                updateQuantity(id, 1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                removeItem(id);
                removeToast.show();
            });
        });
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = parseInt(card.getAttribute('data-price'));

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDropdown();
            addToast.show();
        });
    });

    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;

            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
                removeToast.show();
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDropdown();
        }
    }

    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDropdown();
    }

    // Close cart dropdown handler
    const closeCart = document.querySelector('.close-cart');
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            if (cartDropdown) {
                cartDropdown.hide();
            }
        });
    }

    // Checkout button handlers
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                alert('Proceeding to checkout!');
            }
        });
    }

    const mobileCheckoutBtn = document.getElementById('mobileCheckoutBtn');
    if (mobileCheckoutBtn) {
        mobileCheckoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                alert('Proceeding to checkout!');
            }
        });
    }

    const mobileCartButton = document.getElementById('mobileCartButton');
    if (mobileCartButton) {
        mobileCartButton.addEventListener('click', function() {
            updateCartDropdown();
            cartModal.show();
        });
    }

    // Initialize cart on page load
    updateCartCount();
    updateCartDropdown();
});