document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Sample news data - In a real application, this would come from an API
    const newsItems = [
        {
            title: "Campagne de Distribution de Moustiquaires 2025",
            excerpt: "Le PNLP lance une nouvelle campagne de distribution de moustiquaires imprégnées dans la région de Dakar...",
            date: "2025-03-05",
            image: "images/news1.jpg"
        },
        {
            title: "Formation des Agents de Santé",
            excerpt: "Programme de formation intensive sur les nouveaux protocoles de traitement du paludisme...",
            date: "2025-03-04",
            image: "images/news2.jpg"
        },
        {
            title: "Résultats de la Campagne 2024",
            excerpt: "Les efforts de lutte contre le paludisme montrent des résultats encourageants avec une baisse de 30% des cas...",
            date: "2025-03-03",
            image: "images/news3.jpg"
        }
    ];

    // Populate news section
    const newsGrid = document.querySelector('.news-grid');
    newsItems.forEach(item => {
        const article = document.createElement('article');
        article.className = 'news-item';
        article.innerHTML = `
            <div class="news-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="news-content">
                <h3>${item.title}</h3>
                <p>${item.excerpt}</p>
                <small>${new Date(item.date).toLocaleDateString('fr-FR')}</small>
            </div>
        `;
        newsGrid.appendChild(article);
    });

    // Animate stats on scroll
    const stats = document.querySelectorAll('.stat-card .number');
    const animateStats = () => {
        stats.forEach(stat => {
            const value = parseFloat(stat.textContent.replace(/,/g, ''));
            let current = 0;
            const increment = value / 50;
            const updateCount = () => {
                if (current < value) {
                    current += increment;
                    stat.textContent = Math.round(current).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = value.toLocaleString();
                }
            };
            updateCount();
        });
    };

    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.quick-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('header');

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
});
