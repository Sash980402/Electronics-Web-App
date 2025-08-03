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
        this.initFilters();
        this.initSearch();
        this.initSorting();
        this.initEnhancedFilters();
        this.addBrandAttributes();
        this.addComparisonButtons();
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
            
            // Create actions div if it doesn't exist
            let actionsDiv = product.querySelector('.product-actions');
            if (!actionsDiv) {
                actionsDiv = document.createElement('div');
                actionsDiv.className = 'product-actions';
                
                // Move existing add to cart button to actions div
                if (addToCartBtn) {
                    addToCartBtn.parentNode.removeChild(addToCartBtn);
                    actionsDiv.appendChild(addToCartBtn);
                }
                
                // Add comparison button
                const compareBtn = document.createElement('button');
                compareBtn.className = 'compare-btn';
                compareBtn.title = 'Add to Comparison';
                compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
                actionsDiv.appendChild(compareBtn);
                
                // Insert actions div after price
                priceElement.parentNode.insertBefore(actionsDiv, priceElement.nextSibling);
            }
        });
    }

    initEnhancedFilters() {
        // Price range filter
        const priceRange = document.getElementById('priceRange');
        const priceRangeValue = document.getElementById('priceRangeValue');
        
        priceRange.addEventListener('input', (e) => {
            this.priceRange = parseInt(e.target.value);
            priceRangeValue.textContent = `$0 - $${this.priceRange}`;
            this.filterProducts();
        });

        // Brand filter
        const brandSelect = document.getElementById('brandSelect');
        brandSelect.addEventListener('change', (e) => {
            this.selectedBrand = e.target.value;
            this.filterProducts();
        });

        // Rating filter
        const ratingSelect = document.getElementById('ratingSelect');
        ratingSelect.addEventListener('change', (e) => {
            this.minRating = parseFloat(e.target.value);
            this.filterProducts();
        });
    }

    initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.currentCategory = btn.getAttribute('data-category');
                this.filterProducts();
            });
        });
    }

    initSearch() {
        const searchInput = document.getElementById('searchInput');
        
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterProducts();
        });
    }

    initSorting() {
        const sortSelect = document.getElementById('sortSelect');
        
        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortProducts();
        });
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
        
        // Hide all products
        this.products.forEach(product => {
            product.style.display = 'none';
        });
        
        // Show filtered products
        this.filteredProducts.forEach(product => {
            product.style.display = 'block';
        });

        // Add animation to visible products
        this.filteredProducts.forEach((product, index) => {
            setTimeout(() => {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                product.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });

        this.showNoResults();
    }

    showNoResults() {
        const productsGrid = document.getElementById('productsGrid');
        let noResultsMsg = productsGrid.querySelector('.no-results');
        
        if (this.filteredProducts.length === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results';
                noResultsMsg.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
                productsGrid.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
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
        this.updateCartDisplay();
    }

    initCartToggle() {
        const cartToggle = document.getElementById('cartToggle');
        const cartSidebar = document.getElementById('cartSidebar');
        
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.toggle('active');
        });
    }

    initCloseCart() {
        const closeCart = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');
        
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
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
        
        comparisonToggle.addEventListener('click', () => {
            comparisonTool.classList.toggle('active');
        });
    }

    initCloseComparison() {
        const closeComparison = document.getElementById('closeComparison');
        const comparisonTool = document.getElementById('comparisonTool');
        
        closeComparison.addEventListener('click', () => {
            comparisonTool.classList.remove('active');
        });
    }

    initClearComparison() {
        const clearComparison = document.getElementById('clearComparison');
        
        clearComparison.addEventListener('click', () => {
            this.items = [];
            this.updateComparisonDisplay();
        });
    }

    initCompareBtn() {
        const compareBtn = document.getElementById('compareBtn');
        
        compareBtn.addEventListener('click', () => {
            if (this.items.length >= 2) {
                this.showComparisonModal();
            } else {
                alert('Please select at least 2 products to compare');
            }
        });
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
        const modal = document.createElement('div');
        modal.className = 'comparison-modal';
        modal.innerHTML = `
            <div class="comparison-modal-content">
                <div class="comparison-modal-header">
                    <h2>Product Comparison</h2>
                    <button class="close-comparison-modal">&times;</button>
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
        
        const closeBtn = modal.querySelector('.close-comparison-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
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

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = btn.closest('.product-card');
            openQuickView(productCard);
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

    const image = productCard.querySelector('.product-image img').src;
    const title = productCard.querySelector('h3').textContent;
    const description = productCard.querySelector('p').textContent;
    const specs = productCard.querySelector('.product-specs').innerHTML;
    const rating = productCard.querySelector('.product-rating').innerHTML;
    const price = productCard.querySelector('.product-price').textContent;

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
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    
    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
    modal.querySelector('.modal-content').style.opacity = '0';
    
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
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('.product-image img').src;
            
            const product = {
                id: productCard.getAttribute('data-name').toLowerCase().replace(/\s+/g, '-'),
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            cart.addItem(product);
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
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
            const productRating = parseFloat(productCard.getAttribute('data-rating'));
            const productCategory = productCard.getAttribute('data-category');
            const productBrand = productCard.getAttribute('data-brand');
            const productImage = productCard.querySelector('.product-image img').src;
            const productSpecs = productCard.querySelector('.product-specs').innerHTML;
            
            const product = {
                id: productCard.getAttribute('data-name').toLowerCase().replace(/\s+/g, '-'),
                name: productName,
                price: productPrice,
                rating: productRating,
                category: productCategory,
                brand: productBrand,
                image: productImage,
                specs: productSpecs
            };
            
            comparison.addItem(product);
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
    
    // Initialize managers
    productManager = new ProductManager();
    cart = new ShoppingCart();
    comparison = new ProductComparison();
}); 