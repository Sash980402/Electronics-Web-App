// Enhanced Product Manager with Cart and Comparison
class ProductManager {
    constructor() {
        this.products = Array.from(document.querySelectorAll('.product-card'));
        this.filteredProducts = [...this.products];
        this.currentCategory = 'all';
        this.currentSort = 'name';
        this.searchTerm = '';
        this.priceRange = 2000;
        this.selectedBrand = 'all';
        this.minRating = 0;
        
        // Cart and Comparison state
        this.cart = [];
        this.comparisonItems = [];
        
        this.init();
    }

    init() {
        // Only initialize if we have products
        if (this.products.length > 0) {
            this.initFilters();
            this.initSearch();
            this.initSorting();
            this.initEnhancedFilters();
            this.addBrandAttributes();
            this.addComparisonButtons();
        }
    }

    addBrandAttributes() {
        // Add brand attributes to all products
        const brands = ['samsung', 'lg', 'bosch', 'whirlpool', 'sony', 'philips'];
        this.products.forEach((product, index) => {
            const brand = brands[index % brands.length];
            product.setAttribute('data-brand', brand);
        });
    }

    addComparisonButtons() {
        this.products.forEach(product => {
            const priceElement = product.querySelector('.product-price');
            const addToCartBtn = product.querySelector('.add-to-cart-btn');
            
            if (!priceElement) return;
            
            // Check if actions div already exists
            let actionsDiv = product.querySelector('.product-actions');
            if (!actionsDiv) {
                actionsDiv = document.createElement('div');
                actionsDiv.className = 'product-actions';
                
                // Move existing add to cart button to actions div
                if (addToCartBtn) {
                    addToCartBtn.parentNode.removeChild(addToCartBtn);
                    actionsDiv.appendChild(addToCartBtn);
                }
                
                // Insert actions div after price
                priceElement.parentNode.insertBefore(actionsDiv, priceElement.nextSibling);
            }
            
            // Only add comparison button if it doesn't exist
            if (!actionsDiv.querySelector('.compare-btn')) {
                const compareBtn = document.createElement('button');
                compareBtn.className = 'compare-btn';
                compareBtn.title = 'Add to Comparison';
                compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
                actionsDiv.appendChild(compareBtn);
            }
        });
    }

    initEnhancedFilters() {
        // Price range filter
        const priceRange = document.getElementById('priceRange');
        const priceRangeValue = document.getElementById('priceRangeValue');
        
        if (priceRange && priceRangeValue) {
            priceRange.addEventListener('input', (e) => {
                this.priceRange = parseInt(e.target.value);
                priceRangeValue.textContent = `$0 - $${this.priceRange}`;
                this.filterProducts();
            });
        }

        // Brand filter
        const brandSelect = document.getElementById('brandSelect');
        if (brandSelect) {
            brandSelect.addEventListener('change', (e) => {
                this.selectedBrand = e.target.value;
                this.filterProducts();
            });
        }

        // Rating filter
        const ratingSelect = document.getElementById('ratingSelect');
        if (ratingSelect) {
            ratingSelect.addEventListener('change', (e) => {
                this.minRating = parseFloat(e.target.value);
                this.filterProducts();
            });
        }
    }

    initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentCategory = btn.getAttribute('data-category');
                    this.filterProducts();
                });
            });
        }
    }

    initSearch() {
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterProducts();
            });
        }
    }

    initSorting() {
        const sortSelect = document.getElementById('sortSelect');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortProducts();
            });
        }
    }

    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            const category = product.getAttribute('data-category');
            const name = product.getAttribute('data-name').toLowerCase();
            const price = parseFloat(product.getAttribute('data-price'));
            const rating = parseFloat(product.getAttribute('data-rating'));
            const brand = product.getAttribute('data-brand');
            
            // Category filter
            const categoryMatch = this.currentCategory === 'all' || category === this.currentCategory;
            
            // Search filter
            const searchMatch = this.searchTerm === '' || name.includes(this.searchTerm);
            
            // Price filter
            const priceMatch = price <= this.priceRange;
            
            // Brand filter
            const brandMatch = this.selectedBrand === 'all' || brand === this.selectedBrand;
            
            // Rating filter
            const ratingMatch = rating >= this.minRating;
            
            return categoryMatch && searchMatch && priceMatch && brandMatch && ratingMatch;
        });

        this.sortProducts();
        this.updateDisplay();
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            const nameA = a.getAttribute('data-name').toLowerCase();
            const nameB = b.getAttribute('data-name').toLowerCase();
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            const ratingA = parseFloat(a.getAttribute('data-rating'));
            const ratingB = parseFloat(b.getAttribute('data-rating'));

            switch (this.currentSort) {
                case 'name':
                    return nameA.localeCompare(nameB);
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'rating':
                    return ratingB - ratingA;
                default:
                    return 0;
            }
        });
    }

    updateDisplay() {
        const productsGrid = document.getElementById('productsGrid');
        
        if (!productsGrid) {
            return;
        }
        
        // Hide all products first
        this.products.forEach(product => {
            product.style.display = 'none';
        });
        
        // Show filtered products
        this.filteredProducts.forEach(product => {
            product.style.display = 'block';
        });
        
        // Show no results message if needed
        if (this.filteredProducts.length === 0) {
            this.showNoResults();
        }
    }

    showNoResults() {
        const productsGrid = document.getElementById('productsGrid');
        
        if (!productsGrid) {
            return;
        }
        
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        
        // Clear existing content and add no results message
        productsGrid.innerHTML = '';
        productsGrid.appendChild(noResults);
    }
}

// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = [];
        this.init();
    }

    init() {
        this.initCartToggle();
        this.initCloseCart();
        this.initCheckout();
        this.updateCartDisplay();
    }

    initCartToggle() {
        const cartToggle = document.getElementById('cartToggle');
        const cartSidebar = document.getElementById('cartSidebar');
        
        if (cartToggle && cartSidebar) {
            cartToggle.addEventListener('click', () => {
                cartSidebar.classList.toggle('active');
            });
        }
    }

    initCloseCart() {
        const closeCart = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');
        
        if (closeCart && cartSidebar) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }
    }

    initCheckout() {
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length === 0) {
                    this.showNotification('Your cart is empty!');
                    return;
                }
                
                this.processCheckout();
            });
        }
    }

    processCheckout() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create checkout modal
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        modal.innerHTML = `
            <div class="checkout-modal-content">
                <div class="checkout-header">
                    <h2><i class="fas fa-credit-card"></i> Checkout</h2>
                    <button class="close-checkout">&times;</button>
                </div>
                <div class="checkout-body">
                    <div class="order-summary">
                        <h3>Order Summary</h3>
                        <div class="order-items">
                            ${this.items.map(item => `
                                <div class="order-item">
                                    <img src="${item.image}" alt="${item.name}">
                                    <div class="order-item-details">
                                        <h4>${item.name}</h4>
                                        <p>$${item.price} x ${item.quantity}</p>
                                    </div>
                                    <div class="order-item-total">
                                        $${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-total">
                            <span>Total:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <form class="checkout-form" id="checkoutForm">
                        <div class="form-section">
                            <h3>Shipping Information</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName">First Name *</label>
                                    <input type="text" id="firstName" name="firstName" required>
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Last Name *</label>
                                    <input type="text" id="lastName" name="lastName" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address *</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number *</label>
                                <input type="tel" id="phone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="address">Address *</label>
                                <input type="text" id="address" name="address" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="city">City *</label>
                                    <input type="text" id="city" name="city" required>
                                </div>
                                <div class="form-group">
                                    <label for="state">State *</label>
                                    <input type="text" id="state" name="state" required>
                                </div>
                                <div class="form-group">
                                    <label for="zipCode">ZIP Code *</label>
                                    <input type="text" id="zipCode" name="zipCode" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Payment Information</h3>
                            <div class="form-group">
                                <label for="cardNumber">Card Number *</label>
                                <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expiryDate">Expiry Date *</label>
                                    <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required>
                                </div>
                                <div class="form-group">
                                    <label for="cvv">CVV *</label>
                                    <input type="text" id="cvv" name="cvv" placeholder="123" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="cardName">Name on Card *</label>
                                <input type="text" id="cardName" name="cardName" required>
                            </div>
                        </div>
                        
                        <div class="checkout-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.checkout-modal').remove()">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-lock"></i>
                                Pay $${total.toFixed(2)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 1rem;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-checkout');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Handle form submission
        const checkoutForm = modal.querySelector('#checkoutForm');
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment();
        });
    }

    processPayment() {
        // Simulate payment processing
        const loadingModal = document.createElement('div');
        loadingModal.className = 'loading-modal';
        loadingModal.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <h3>Processing Payment...</h3>
                <p>Please wait while we process your order.</p>
            </div>
        `;
        
        loadingModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            color: white;
            text-align: center;
        `;
        
        document.body.appendChild(loadingModal);
        
        // Simulate processing delay
        setTimeout(() => {
            loadingModal.remove();
            this.showOrderConfirmation();
        }, 2000);
    }

    showOrderConfirmation() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderNumber = 'ORD-' + Date.now().toString().slice(-6);
        
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase. Your order has been successfully processed.</p>
                
                <div class="order-details">
                    <h3>Order Details</h3>
                    <p><strong>Order Number:</strong> ${orderNumber}</p>
                    <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
                    <p><strong>Items:</strong> ${this.items.length}</p>
                </div>
                
                <div class="confirmation-actions">
                    <button class="btn btn-primary" onclick="this.closest('.confirmation-modal').remove(); cart.clearCart();">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 1rem;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                this.clearCart();
            }
        });
    }

    clearCart() {
        this.items = [];
        this.updateCartDisplay();
        const cartSidebar = document.getElementById('cartSidebar');
        cartSidebar.classList.remove('active');
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.updateCartDisplay();
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems || !cartCount || !cartTotal) {
            return;
        }
        
        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        cartItems.innerHTML = '';
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="cart.removeItem('${item.id}')">&times;</button>
            `;
            cartItems.appendChild(itemElement);
        });
        
        // Update total
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// Product Comparison Management
class ProductComparison {
    constructor() {
        this.items = [];
        this.maxItems = 4;
        this.init();
    }

    init() {
        this.initComparisonToggle();
        this.initCloseComparison();
        this.initClearComparison();
        this.initCompareBtn();
        this.updateComparisonDisplay();
    }

    initComparisonToggle() {
        const comparisonToggle = document.getElementById('comparisonToggle');
        const comparisonTool = document.getElementById('comparisonTool');
        
        if (comparisonToggle && comparisonTool) {
            comparisonToggle.addEventListener('click', () => {
                comparisonTool.classList.toggle('active');
            });
        }
    }

    initCloseComparison() {
        const closeComparison = document.getElementById('closeComparison');
        const comparisonTool = document.getElementById('comparisonTool');
        
        if (closeComparison && comparisonTool) {
            closeComparison.addEventListener('click', () => {
                comparisonTool.classList.remove('active');
            });
        }
    }

    initClearComparison() {
        const clearComparison = document.getElementById('clearComparison');
        
        if (clearComparison) {
            clearComparison.addEventListener('click', () => {
                this.items = [];
                this.updateComparisonDisplay();
            });
        }
    }

    initCompareBtn() {
        const compareBtn = document.getElementById('compareBtn');
        
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                if (this.items.length >= 2) {
                    this.showComparisonModal();
                } else {
                    alert('Please select at least 2 products to compare');
                }
            });
        }
    }

    addItem(product) {
        if (this.items.length >= this.maxItems) {
            alert(`You can only compare up to ${this.maxItems} products at a time`);
            return;
        }
        
        if (this.items.find(item => item.id === product.id)) {
            alert('This product is already in your comparison list');
            return;
        }
        
        this.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            rating: product.rating,
            category: product.category,
            brand: product.brand,
            image: product.image,
            specs: product.specs
        });
        
        this.updateComparisonDisplay();
        this.showNotification(`${product.name} added to comparison!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateComparisonDisplay();
    }

    updateComparisonDisplay() {
        const comparisonItems = document.getElementById('comparisonItems');
        const comparisonCount = document.getElementById('comparisonCount');
        
        if (!comparisonItems || !comparisonCount) {
            return;
        }
        
        comparisonCount.textContent = this.items.length;
        
        comparisonItems.innerHTML = '';
        
        if (this.items.length === 0) {
            comparisonItems.innerHTML = '<p class="empty-comparison">No products selected for comparison</p>';
            return;
        }
        
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'comparison-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="comparison-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>
                <button class="remove-comparison" onclick="comparison.removeItem('${item.id}')">&times;</button>
            `;
            comparisonItems.appendChild(itemElement);
        });
    }

    showComparisonModal() {
        // Remove any existing comparison modals first
        const existingModal = document.querySelector('.comparison-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'comparison-modal';
        modal.innerHTML = `
            <div class="comparison-modal-content">
                <div class="comparison-modal-header">
                    <h2>Product Comparison</h2>
                    <button class="close-comparison-modal" id="closeComparisonModal">&times;</button>
                </div>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                ${this.items.map(item => `<th>${item.name}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Price</td>
                                ${this.items.map(item => `<td>$${item.price}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Rating</td>
                                ${this.items.map(item => `<td>${item.rating} ★</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Brand</td>
                                ${this.items.map(item => `<td>${item.brand}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Category</td>
                                ${this.items.map(item => `<td>${item.category}</td>`).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add multiple ways to close the modal
        const closeBtn = modal.querySelector('.close-comparison-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
        }
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Store reference for potential programmatic closing
        this.currentModal = modal;
    }

    closeComparisonModal() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
        // Also remove any other comparison modals that might exist
        const existingModals = document.querySelectorAll('.comparison-modal');
        existingModals.forEach(modal => modal.remove());
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'comparison-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-balance-scale"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// Quick View Modal
function initQuickView() {
    const modal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');

    if (!modal || !closeModal) {
        return;
    }

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = btn.closest('.product-card');
            if (productCard) {
                openQuickView(productCard);
            }
        });
    });

    closeModal.addEventListener('click', () => {
        closeQuickView();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQuickView();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeQuickView();
        }
    });
}

function openQuickView(productCard) {
    const modal = document.getElementById('quickViewModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalSpecs = document.getElementById('modalSpecs');
    const modalRating = document.getElementById('modalRating');
    const modalPrice = document.getElementById('modalPrice');

    if (!modal || !modalImage || !modalTitle || !modalDescription || !modalSpecs || !modalRating || !modalPrice) {
        return;
    }

    const image = productCard.querySelector('.product-image img')?.src || '';
    const title = productCard.querySelector('h3')?.textContent || '';
    const description = productCard.querySelector('p')?.textContent || '';
    const specs = productCard.querySelector('.product-specs')?.innerHTML || '';
    const rating = productCard.querySelector('.product-rating')?.innerHTML || '';
    const price = productCard.querySelector('.product-price')?.textContent || '';

    modalImage.src = image;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalSpecs.innerHTML = specs;
    modalRating.innerHTML = rating;
    modalPrice.textContent = price;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }
    }, 10);
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    
    if (!modal) {
        return;
    }

    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
    }
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 200);
}

// Add to Cart Functionality
function initAddToCart() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            if (!productCard) return;
            
            const productName = productCard.querySelector('h3')?.textContent || '';
            const productPriceText = productCard.querySelector('.product-price')?.textContent || '';
            const productImage = productCard.querySelector('.product-image img')?.src || '';
            
            const productPrice = parseFloat(productPriceText.replace('$', '').replace(',', '')) || 0;
            
            const product = {
                id: productCard.getAttribute('data-name')?.toLowerCase().replace(/\s+/g, '-') || '',
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            if (cart) {
                cart.addItem(product);
            }
        }
    });
}

// Comparison Functionality
function initComparison() {
    document.addEventListener('click', (e) => {
        const compareBtn = e.target.closest('.compare-btn');
        if (compareBtn) {
            e.preventDefault();
            const productCard = compareBtn.closest('.product-card');
            if (!productCard) return;
            
            const productName = productCard.querySelector('h3')?.textContent || '';
            const productPriceText = productCard.querySelector('.product-price')?.textContent || '';
            const productImage = productCard.querySelector('.product-image img')?.src || '';
            const productSpecs = productCard.querySelector('.product-specs')?.innerHTML || '';
            
            const productPrice = parseFloat(productPriceText.replace('$', '').replace(',', '')) || 0;
            const productRating = parseFloat(productCard.getAttribute('data-rating')) || 0;
            const productCategory = productCard.getAttribute('data-category') || '';
            const productBrand = productCard.getAttribute('data-brand') || '';
            
            const product = {
                id: productCard.getAttribute('data-name')?.toLowerCase().replace(/\s+/g, '-') || '',
                name: productName,
                price: productPrice,
                rating: productRating,
                category: productCategory,
                brand: productBrand,
                image: productImage,
                specs: productSpecs
            };
            
            if (comparison) {
                comparison.addItem(product);
            }
        }
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

// Loading Animations
function initLoadingAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Mobile Navigation
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Global instances
let productManager, cart, comparison;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNavigation();
    initNavbarScroll();
    initLoadingAnimations();
    initQuickView();
    initComparison();
    initAddToCart();
    
    // Initialize managers
    productManager = new ProductManager();
    cart = new ShoppingCart();
    comparison = new ProductComparison();
}); 