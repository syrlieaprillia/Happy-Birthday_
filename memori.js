
// DAFTAR 24 FOTO
const memories = [
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
    "8.jpeg",
    "9.jpeg",
    "10.jpeg",
    "11.jpeg",
    "12.jpeg",
    "13.jpeg",
    "14.jpeg",
    "15.jpeg",
    "16.jpeg",
    "17.jpeg",
    "18.jpeg",
    "19.jpeg",
    "20.jpeg",
    "21.jpeg",
    "22.jpeg",
    "23.jpeg",
    "24.jpeg"
];

const grid = document.getElementById("memory-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const closeButton = document.getElementById("close-lightbox");

let currentIndex = 0;

// MEMBUAT 24 FOTO TANPA TULISAN
memories.forEach((photo, index) => {
    const card = document.createElement("div");
    card.className = "memory-card";

    const image = document.createElement("img");
    image.src = `memori/${photo}`;
    image.alt = `Our memory ${index + 1}`;
    image.loading = "lazy";

    card.appendChild(image);

    card.addEventListener("click", () => {
        openLightbox(index);
    });

    grid.appendChild(card);
});

// BUKA FOTO BESAR
function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

// UPDATE FOTO
function updateLightbox() {
    lightboxImage.src = `memori/${memories[currentIndex]}`;
    lightboxImage.alt = `Our memory ${currentIndex + 1}`;

    if (lightboxCaption) {
        lightboxCaption.textContent = "";
    }

    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${memories.length}`;
    }
}

// FOTO SEBELUMNYA
prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + memories.length) % memories.length;
    updateLightbox();
});

// FOTO SELANJUTNYA
nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % memories.length;
    updateLightbox();
});

// TUTUP LIGHTBOX
function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

closeButton.addEventListener("click", closeLightbox);

// KLIK AREA GELAP UNTUK MENUTUP
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// NAVIGASI KEYBOARD
document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % memories.length;
        updateLightbox();
    }

    if (event.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + memories.length) % memories.length;
        updateLightbox();
    }
});
