document.addEventListener('DOMContentLoaded', () => {
    const newsSection = {
        init() {
            this.filterButtons = document.querySelectorAll('.filter-btn');
            this.newsCards = document.querySelectorAll('.news-card');
            this.loadMoreBtn = document.querySelector('.load-more');
            this.visibleCards = 3;
            this.currentFilter = 'all';

            this.bindEvents();
            this.updateVisibility();
        },

        bindEvents() {
            // Filter buttons click events
            this.filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleFilterClick(e.target);
                });
            });

            // Load more button click event
            if (this.loadMoreBtn) {
                this.loadMoreBtn.addEventListener('click', () => {
                    this.loadMore();
                });
            }

            // Intersection Observer for animation
            this.setupIntersectionObserver();
        },

        handleFilterClick(clickedBtn) {
            // Remove active class from all buttons
            this.filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            clickedBtn.classList.add('active');
            
            // Update current filter
            this.currentFilter = clickedBtn.dataset.filter;
            
            // Reset visible cards count
            this.visibleCards = 3;
            
            // Update cards visibility with animation
            this.updateVisibility(true);
        },

        updateVisibility(animate = false) {
            let visibleCount = 0;
            
            this.newsCards.forEach((card, index) => {
                const shouldBeVisible = (this.currentFilter === 'all' || card.dataset.category === this.currentFilter) 
                    && visibleCount < this.visibleCards;

                if (shouldBeVisible) {
                    if (animate) {
                        card.style.animation = 'none';
                        card.offsetHeight; // Trigger reflow
                        card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.2}s`;
                    }
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Update load more button visibility
            this.updateLoadMoreButton(visibleCount);
        },

        updateLoadMoreButton(visibleCount) {
            if (!this.loadMoreBtn) return;

            const totalVisible = Array.from(this.newsCards).filter(card => 
                this.currentFilter === 'all' || card.dataset.category === this.currentFilter
            ).length;

            if (visibleCount < totalVisible) {
                this.loadMoreBtn.style.display = 'inline-flex';
            } else {
                this.loadMoreBtn.style.display = 'none';
            }
        },

        loadMore() {
            this.visibleCards += 3;
            this.updateVisibility(true);
        },

        setupIntersectionObserver() {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                        observer.unobserve(entry.target);
                    }
                });
            }, options);

            this.newsCards.forEach(card => {
                observer.observe(card);
            });
        }
    };

    // Initialize news section
    newsSection.init();
});
