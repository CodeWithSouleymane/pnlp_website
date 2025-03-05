class HeroSlider {
    constructor() {
        this.slider = document.querySelector('.hero-slider');
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.slideCount = this.slides.length;
        
        // Set initial state
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
        }
        
        // Create UI elements
        this.createDots();
        this.createProgressBar();
        
        this.dots = Array.from(document.querySelectorAll('.slider-dot'));
        if (this.dots.length > 0) {
            this.dots[0].classList.add('active');
        }
        
        this.prevBtn = document.querySelector('.slider-arrow.prev');
        this.nextBtn = document.querySelector('.slider-arrow.next');
        this.progressBar = document.querySelector('.slider-progress-bar');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.intervalTime = 5000;
        this.touchStartX = 0;
        this.touchEndX = 0;

        // Bind methods to maintain context
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.init();
    }

    createDots() {
        const dotsContainer = document.querySelector('.slider-nav');
        dotsContainer.innerHTML = ''; // Clear existing dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Slide ${index + 1}`);
            dot.setAttribute('role', 'button');
            dotsContainer.appendChild(dot);
        });
    }

    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.classList.add('slider-progress');
        
        const progressBar = document.createElement('div');
        progressBar.classList.add('slider-progress-bar');
        
        progressContainer.appendChild(progressBar);
        this.slider.appendChild(progressContainer);
    }

    init() {
        if (!this.slider || this.slides.length === 0) return;

        // Add ARIA labels for accessibility
        this.slider.setAttribute('role', 'region');
        this.slider.setAttribute('aria-label', 'Image Slider');
        
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${this.slideCount}`);
        });

        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.prevBtn.setAttribute('aria-label', 'Previous slide');
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            this.nextBtn.setAttribute('aria-label', 'Next slide');
        }
        
        // Add dot click events
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.showSlide(index));
        });

        // Add keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard);

        // Add touch events
        this.slider.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.slider.addEventListener('touchmove', this.handleTouchMove, { passive: true });
        this.slider.addEventListener('touchend', this.handleTouchEnd);

        // Start auto sliding
        this.startSlideShow();

        // Pause on hover or focus
        this.slider.addEventListener('mouseenter', () => this.pauseSlideShow());
        this.slider.addEventListener('mouseleave', () => this.startSlideShow());
        this.slider.addEventListener('focusin', () => this.pauseSlideShow());
        this.slider.addEventListener('focusout', () => this.startSlideShow());

        // Preload next image
        this.preloadNextImage();
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.prevSlide();
                break;
            case 'ArrowRight':
                this.nextSlide();
                break;
            case 'Space':
                e.preventDefault();
                this.slideInterval ? this.pauseSlideShow() : this.startSlideShow();
                break;
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.pauseSlideShow();
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        const touchDiff = this.touchStartX - this.touchEndX;
        const minSwipeDistance = 50;

        if (Math.abs(touchDiff) > minSwipeDistance) {
            if (touchDiff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }

        this.startSlideShow();
    }

    preloadNextImage() {
        const nextIndex = (this.currentSlide + 1) % this.slideCount;
        const nextSlide = this.slides[nextIndex];
        const bgImage = window.getComputedStyle(nextSlide).backgroundImage;
        
        if (bgImage && bgImage !== 'none') {
            const img = new Image();
            img.src = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
        }
    }

    showSlide(index) {
        if (!this.slides.length) return;

        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Reset progress bar
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }

        // Update current slide index
        this.currentSlide = index;

        // Handle wrap around
        if (this.currentSlide >= this.slides.length) {
            this.currentSlide = 0;
        }
        if (this.currentSlide < 0) {
            this.currentSlide = this.slides.length - 1;
        }

        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');

        // Update ARIA labels
        this.slides[this.currentSlide].setAttribute('aria-hidden', 'false');
        this.dots[this.currentSlide].setAttribute('aria-current', 'true');

        // Preload next image
        this.preloadNextImage();

        // Announce slide change to screen readers
        this.announceSlideChange();
    }

    announceSlideChange() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('class', 'sr-only');
        announcement.textContent = `Showing slide ${this.currentSlide + 1} of ${this.slideCount}`;
        
        this.slider.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    startSlideShow() {
        if (this.slideInterval) return;
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.intervalTime);

        // Start progress bar animation
        if (this.progressBar) {
            this.progressBar.style.transition = `width ${this.intervalTime}ms linear`;
            this.progressBar.style.width = '100%';
        }
    }

    pauseSlideShow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;

            // Pause progress bar
            if (this.progressBar) {
                const width = window.getComputedStyle(this.progressBar).width;
                this.progressBar.style.transition = 'none';
                this.progressBar.style.width = width;
            }
        }
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const slider = new HeroSlider();
});
