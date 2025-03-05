class HeroSlider {
    constructor() {
        this.slider = document.querySelector('.hero-slider');
        this.slides = Array.from(document.querySelectorAll('.slide'));
        
        // Set initial state
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
        }
        
        // Create dots dynamically
        this.createDots();
        
        this.dots = Array.from(document.querySelectorAll('.slider-dot'));
        if (this.dots.length > 0) {
            this.dots[0].classList.add('active');
        }
        
        this.prevBtn = document.querySelector('.slider-arrow.prev');
        this.nextBtn = document.querySelector('.slider-arrow.next');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.intervalTime = 5000;

        this.init();
    }

    createDots() {
        const dotsContainer = document.querySelector('.slider-nav');
        dotsContainer.innerHTML = ''; // Clear existing dots
        this.slides.forEach(() => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            dotsContainer.appendChild(dot);
        });
    }

    init() {
        if (!this.slider || this.slides.length === 0) return;

        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Add dot click events
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.showSlide(index));
        });

        // Start auto sliding
        this.startSlideShow();

        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.pauseSlideShow());
        this.slider.addEventListener('mouseleave', () => this.startSlideShow());

        // Log initial state
        console.log('Slider initialized with', this.slides.length, 'slides');
    }

    showSlide(index) {
        if (!this.slides.length) return;

        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

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

        // Log slide change
        console.log('Showing slide', this.currentSlide + 1, 'of', this.slides.length);
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    startSlideShow() {
        if (this.slideInterval) return;
        this.slideInterval = setInterval(() => this.nextSlide(), this.intervalTime);
    }

    pauseSlideShow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const slider = new HeroSlider();
});
