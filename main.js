// PhD Thesis Navigation and Interaction Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeProgressBar();
    initializeBackToTop();
    initializeAnimations();
    initializeTooltips();
    makeTablesResponsive();
    initializeImageHandling();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav ul');
    const navLinks = document.querySelectorAll('.nav a');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Set active navigation link
    setActiveNavLink();
    
    // Smooth scrolling for internal links
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Progress bar functionality
function initializeProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    if (progressBar) {
        function updateProgressBar() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
        
        window.addEventListener('scroll', updateProgressBar);
        updateProgressBar(); // Initial call
    }
}

// Back to top button
function initializeBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        function toggleBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        }
        
        window.addEventListener('scroll', toggleBackToTop);
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Animation initialization
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and images
    document.querySelectorAll('.card, .image-container img').forEach(el => {
        observer.observe(el);
    });
    
    // Staggered animation for lists
    document.querySelectorAll('ul li, ol li').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Enhanced tooltip functionality
function initializeTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            if (tooltipText) {
                // Adjust tooltip position if it goes off-screen
                const rect = tooltipText.getBoundingClientRect();
                if (rect.left < 0) {
                    tooltipText.style.left = '0';
                    tooltipText.style.marginLeft = '0';
                } else if (rect.right > window.innerWidth) {
                    tooltipText.style.left = 'auto';
                    tooltipText.style.right = '0';
                    tooltipText.style.marginLeft = '0';
                }
            }
        });
    });
}

// Utility functions for dynamic content
function createBreadcrumb(items) {
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    
    const breadcrumbContent = items.map((item, index) => {
        if (index === items.length - 1) {
            return `<span class="current">${item.text}</span>`;
        } else {
            return `<a href="${item.url}">${item.text}</a><span class="separator">›</span>`;
        }
    }).join('');
    
    breadcrumb.innerHTML = breadcrumbContent;
    return breadcrumb;
}

// Enhanced table functionality
function makeTablesResponsive() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.style.overflowX = 'auto';
        wrapper.style.marginBottom = '1rem';
        
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
}

// Image lazy loading and optimization
function initializeImageHandling() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Search functionality (if needed for thesis defense)
function initializeSearch() {
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value.toLowerCase();
            searchContent(query);
        }, 300));
    }
}

function searchContent(query) {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const content = card.textContent.toLowerCase();
        if (content.includes(query) || query === '') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Publications filtering functionality
function filterPublications(category) {
    const publications = document.querySelectorAll('.publication-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#e5e7eb';
        btn.style.color = '#374151';
    });
    
    event.target.classList.add('active');
    event.target.style.background = 'var(--primary-color)';
    event.target.style.color = 'white';
    
    // Filter publications
    publications.forEach(pub => {
        const citations = parseInt(pub.dataset.citations);
        const year = parseInt(pub.dataset.year);
        const categories = pub.dataset.category.split(' ');
        
        let shouldShow = false;
        
        switch(category) {
            case 'all':
                shouldShow = true;
                break;
            case 'high-impact':
                shouldShow = citations >= 10;
                break;
            case 'recent':
                shouldShow = year >= 2022;
                break;
            case 'core':
                shouldShow = categories.includes('core');
                break;
        }
        
        if (shouldShow) {
            pub.style.display = 'block';
            pub.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            pub.style.display = 'none';
        }
    });
}

// Add CSS animation for publications
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .publication-item {
        animation: fadeIn 0.5s ease-in-out;
    }
    
    .filter-btn.active {
        background: var(--primary-color) !important;
        color: white !important;
    }
    
    .filter-btn:hover {
        background: var(--secondary-color) !important;
        color: white !important;
        transform: translateY(-1px);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize responsive tables on load
document.addEventListener('DOMContentLoaded', function() {
    makeTablesResponsive();
    initializeImageHandling();
});