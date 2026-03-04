// --- DOM Elements ---
const filterButtons = document.querySelectorAll('.filter-buttons button');
const galleryItems = document.querySelectorAll('.gallery-item');
// Note: We need to convert NodeList to Array for indexing
let visibleItems = Array.from(galleryItems); 

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;

// --- Filter Logic ---
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        visibleItems = []; // Reset visible items list

        galleryItems.forEach(item => {
            // Check if item matches filter or if filter is 'all'
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hide');
                // Add animation class for smooth entry (optional)
                item.style.animation = 'fadeIn 0.5s ease forwards'; 
                visibleItems.push(item);
            } else {
                item.classList.add('hide');
                item.style.animation = 'none';
            }
        });
    });
});

// --- Lightbox Logic ---
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        if (!item.classList.contains('hide')) {
            // Find the index of clicked item within the currently visible items
            currentIndex = visibleItems.indexOf(item);
            showImage(currentIndex);
            lightbox.classList.add('active');
        }
    });
});

function showImage(index) {
    // Wrap around logic
    if (index >= visibleItems.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = visibleItems.length - 1;
    } else {
        currentIndex = index;
    }
    
    // Get image source. Note: img is now inside the gallery-item div
    const imgSrc = visibleItems[currentIndex].querySelector('img').getAttribute('src');
    lightboxImg.setAttribute('src', imgSrc);
}

// Next / Prev Button Clicks
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent lightbox from closing
    showImage(currentIndex + 1);
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
});

// Close Lightbox functions
const closeLightbox = () => {
    lightbox.classList.remove('active');
    // Clear image src after closing to prevent flicker on next open
    setTimeout(() => lightboxImg.setAttribute('src', ''), 300);
};

closeBtn.addEventListener('click', closeLightbox);

// Close on outside click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'Escape') closeLightbox();
});

// Optional: Simple fade in animation for filters
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);