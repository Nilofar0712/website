const slider = document.querySelector('.menu-slider');

// Adjust scroll amount based on screen size
function getScrollAmount() {
    return window.innerWidth > 768 ?
        document.querySelector('.menu-item').offsetWidth :
        document.querySelector('.menu-item').offsetWidth + 15;
}

function scrollLeft() {
    slider.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth'
    });
}

function scrollRight() {
    slider.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth'
    });
}

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
        scrollRight();
    } else if (touchEndX > touchStartX + threshold) {
        scrollLeft();
    }
}