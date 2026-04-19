/* ============================================
   ACTIVE LINK HANDLING
   ============================================ */
function setActiveLink() {
    const currentPath = window.location.pathname;
    let currentPage = currentPath.split('/').pop() || 'index.html';
    
    if (currentPage === '' || currentPage === '/') currentPage = 'index.html';

    const allLinks = document.querySelectorAll('.nav-link, .dropdown-link');
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            
            if (link.classList.contains('dropdown-link')) {
                const parentItem = link.closest('.nav-item');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) parentLink.classList.add('active');
                }
            }
        } else {
            link.classList.remove('active');
        }
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('open');
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .reveal-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   PRODUCT DETAIL DYNAMIC LOADING
   ============================================ */
function loadProductDetails() {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId || typeof productsData === 'undefined' || !productsData[productId]) {
        container.innerHTML = `
            <div style="text-align: center; padding: 100px 0;">
                <h2>Product Not Found</h2>
                <p>Sorry, we couldn't find the product you're looking for.</p>
                <a href="products.html" class="btn btn-primary" style="margin-top: 20px;">Back to Products</a>
            </div>
        `;
        return;
    }

    const product = productsData[productId];

    let specsHtml = '';
    for (const [key, value] of Object.entries(product.additionalInfo)) {
        specsHtml += `
            <div class="spec-item">
                <strong>${key}</strong>
                <span>${value}</span>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="product-hero-grid">
            <div class="product-gallery">
                <img src="${product.image}" alt="${product.title}" class="product-main-img">
            </div>
            <div class="product-detail-info">
                <div class="breadcrumb">
                    <a href="index.html">Home</a> <span>/</span> 
                    <a href="products.html">Products</a> <span>/</span> 
                    <span class="current">${product.title}</span>
                </div>
                <h1>${product.title}</h1>
                <span class="price">${product.price}</span>
                
                <div class="short-desc">${product.shortDescription}</div>
                
                <div style="margin-top: 40px; display: flex; gap: 16px;">
                    <a href="contact.html?product=${product.id}" class="btn btn-primary">Request a Quote</a>
                    <a href="distributors.html" class="btn btn-outline-dark">Find a Dealer</a>
                </div>

                <div class="tabs-header">
                    <div class="tab-btn active" onclick="switchTab('desc')">Description</div>
                    <div class="tab-btn" onclick="switchTab('specs')">Additional Info</div>
                </div>
                
                <div id="descTab" class="tab-content active">
                    <p style="color: var(--text-light); line-height: 1.8;">${product.description}</p>
                </div>
                
                <div id="specsTab" class="tab-content">
                    <div class="specs-list">${specsHtml}</div>
                </div>
            </div>
        </div>
    `;

    renderRelatedProducts(product.category, product.id);
}

function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    if (tabs.length < 2) return;

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    if (tab === 'desc') {
        tabs[0].classList.add('active');
        document.getElementById('descTab').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('specsTab').classList.add('active');
    }
}

function renderRelatedProducts(category, currentId) {
    const grid = document.getElementById('relatedProductsGrid');
    if (!grid) return;

    let relatedHtml = '';
    let count = 0;

    for (const [id, product] of Object.entries(productsData)) {
        if (product.category === category && id !== currentId && count < 3) {
            relatedHtml += `
                <div class="product-card">
                    <div class="product-image"><img src="${product.image}" alt="${product.title}"></div>
                    <div class="product-info">
                        <span class="product-category-tag">${product.category.toUpperCase()}</span>
                        <h4>${product.title}</h4>
                        <a href="product-detail.html?id=${id}" class="btn btn-primary btn-sm" style="margin-top: 15px; width: 100%;">View Details</a>
                    </div>
                </div>
            `;
            count++;
        }
    }

    const section = grid.closest('.section');
    if (count === 0) {
        if (section) section.style.display = 'none';
    } else {
        if (section) section.style.display = 'block';
        grid.innerHTML = relatedHtml;
    }
}

/* ============================================
   STATS COUNTER ANIMATION
   ============================================ */
function animateStats() {
    const statsSection = document.getElementById('statsSection');
    if (!statsSection) return;

    const stats = document.querySelectorAll('.stat-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const suffix = stat.getAttribute('data-suffix') || '';
                    let count = 0;
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 16ms per frame
                    
                    const updateCount = () => {
                        if (count < target) {
                            count += increment;
                            stat.innerText = Math.ceil(count) + suffix;
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.innerText = target + suffix;
                        }
                    };
                    updateCount();
                });
                observer.unobserve(statsSection);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
    initScrollAnimations();
    animateStats();
    
    // Check if on detail page
    if (document.getElementById('productDetailContainer')) {
        loadProductDetails();
    }

    // Header scroll effect
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (header) header.classList.add('scrolled');
        } else {
            if (header) header.classList.remove('scrolled');
        }
    });

    // Mobile menu clicks
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
});
