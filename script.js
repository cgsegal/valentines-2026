const imageFiles = [
    { file: "IMG_0626.jpeg", caption: "Reunited at last!" },
    { file: "IMG_2303.jpeg", caption: "Bebe with my baby" },
    { file: "IMG_3017.jpeg", caption: "Hot cocoa to keep us warm with our glizzies!" },
    { file: "IMG_3530.JPG", caption: "Jumpscare I look weird there!" },
    { file: "IMG_4477.JPG", caption: "So happy to be together in California!" },
    { file: "IMG_4906.JPG", caption: "Romantic dinner with my beautiful girl" },
    { file: "IMG_5069.JPG", caption: "Ahhhh it's so cold on this boat! Good thing Victoria's so hot" },
    { file: "IMG_5789.JPG", caption: "Howdy cutie" },
    { file: "IMG_5962.JPG", caption: "Nobody bats better than my girlfriend" },
    { file: "IMG_7979.JPG", caption: "I'm just a background character to my beautiful girlfriend and that's ok" },
    { file: "IMG_9816.jpeg", caption: "And finally our first London trip of many to come :)" }
];

let currentSlide = 0;
let slides = [];
let slidesBuilt = false;
let visitedSlides = new Set();

function prettifyCaption(filename) {
    const name = filename.replace(/\.[^/.]+$/, "");
    // Replace underscores/hyphens and common camera prefixes with spaces
    return name.replace(/[_-]/g, ' ').replace(/^IMG_?/i, '').trim();
}

function buildSlides() {
    const container = document.getElementById('slides');
    if (!container) return;
    container.innerHTML = '';

    if (imageFiles.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'slide active';
        const p = document.createElement('p');
        p.textContent = 'No images found in the images/ folder.';
        empty.appendChild(p);
        container.appendChild(empty);
        slides = document.querySelectorAll('.slide');
        slidesBuilt = true;
        return;
    }

    imageFiles.forEach((item, i) => {
        // Support either a string or an object { file, caption }
        const file = (typeof item === 'string') ? item : (item.file || '');
        const slide = document.createElement('div');
        slide.className = 'slide' + (i === 0 ? ' active' : '');

    const img = document.createElement('img');
    img.src = `images/${file}`;
    img.alt = `Memory ${i + 1}`;
    // Improve load performance and make large galleries friendlier
    img.loading = 'lazy';

    const caption = document.createElement('p');
    caption.className = 'caption';
    const captionText = (typeof item === 'string') ? prettifyCaption(file) : (item.caption || prettifyCaption(file));
    caption.textContent = captionText || `Memory ${i + 1}`;

    // Add data attribute to help editing/debugging in the DOM
    slide.setAttribute('data-file', file);

        slide.appendChild(img);
        slide.appendChild(caption);
        container.appendChild(slide);
    });

    slides = document.querySelectorAll('.slide');
    slidesBuilt = true;
}

function startSlideshow() {
    document.getElementById("title-screen").classList.remove("active");
    document.getElementById("slideshow-screen").classList.add("active");
    if (!slidesBuilt) {
        buildSlides();
        currentSlide = 0;
        showSlide(currentSlide);
    }

    // Reset visited state and hide itinerary button when starting
    visitedSlides.clear();
    const btn = document.getElementById('open-itinerary-btn');
    if (btn) btn.style.display = 'none';
}

function showSlide(index) {
    if (!slidesBuilt) return;
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) slide.classList.add('active');
    });

    // Track that this slide was visited; reveal itinerary button when all slides seen
    visitedSlides.add(index);
    const btn = document.getElementById('open-itinerary-btn');
    if (btn) {
        if (visitedSlides.size === slides.length && slides.length > 0) {
            btn.style.display = 'inline-block';
        } else {
            btn.style.display = 'none';
        }
    }
}

function nextSlide() {
    if (!slidesBuilt) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    if (!slidesBuilt) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Open the itinerary in the same tab
function openItinerary() {
    // Navigate to the itinerary page in the same tab/window
    window.location.href = 'itinerary.html';
}