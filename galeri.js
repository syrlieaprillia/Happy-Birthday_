
const STORAGE_KEY = "sitiGalleryPhotos";

const galleryGrid = document.getElementById("gallery-grid");
const emptyState = document.getElementById("empty-state");
const totalPhotos = document.getElementById("total-photos");

const lightbox = document.getElementById("lightbox");
const previewImage = document.getElementById("preview-image");
const previewDate = document.getElementById("preview-date");

let photos = [];
let currentPhotoIndex = null;

// AMBIL FOTO DARI LOCAL STORAGE
function loadPhotos() {
    try {
        photos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        if (!Array.isArray(photos)) {
            photos = [];
        }
    } catch (error) {
        console.error("Gagal membaca foto:", error);
        photos = [];
    }

    renderGallery();
}

// TAMPILKAN FOTO
function renderGallery() {
    galleryGrid.innerHTML = "";

    totalPhotos.textContent = `${photos.length} photos`;

    if (photos.length === 0) {
        emptyState.style.display = "block";
        galleryGrid.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    galleryGrid.style.display = "grid";

    photos.forEach((photo, index) => {
        const card = document.createElement("div");
        card.className = "photo-card";

        const image = document.createElement("img");
        image.src = photo.image;
        image.alt = `Photobox photo ${index + 1}`;
        image.loading = "lazy";

        const caption = document.createElement("p");
        caption.textContent = `little moment no. ${index + 1} ♡`;

        card.appendChild(image);
        card.appendChild(caption);

        card.addEventListener("click", () => {
            openPreview(index);
        });

        galleryGrid.appendChild(card);
    });
}

// BUKA PREVIEW
function openPreview(index) {
    currentPhotoIndex = index;
    updatePreview();

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

// UPDATE PREVIEW
function updatePreview() {
    const photo = photos[currentPhotoIndex];

    if (!photo) return;

    previewImage.src = photo.image;

    if (photo.date) {
        const date = new Date(photo.date);

        previewDate.textContent = isNaN(date.getTime())
            ? "A little memory ♡"
            : date.toLocaleString("id-ID", {
                dateStyle: "long",
                timeStyle: "short"
            });
    } else {
        previewDate.textContent = "A little memory ♡";
    }
}

// DOWNLOAD FOTO
document.getElementById("download-preview")
    .addEventListener("click", () => {

        const photo = photos[currentPhotoIndex];

        if (!photo) return;

        const link = document.createElement("a");
        link.href = photo.image;
        link.download = `our-memory-${currentPhotoIndex + 1}.jpg`;

        document.body.appendChild(link);
        link.click();
        link.remove();
    });

// HAPUS FOTO
document.getElementById("delete-preview")
    .addEventListener("click", () => {

        if (currentPhotoIndex === null) return;

        const confirmDelete = confirm(
            "Are you sure you want to delete this memory?"
        );

        if (!confirmDelete) return;

        photos.splice(currentPhotoIndex, 1);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(photos)
        );

        closePreview();
        renderGallery();
    });

// TUTUP PREVIEW
function closePreview() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    currentPhotoIndex = null;
}

document.getElementById("close-lightbox")
    .addEventListener("click", closePreview);

// KLIK BACKGROUND UNTUK TUTUP
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closePreview();
    }
});

// KEYBOARD ESC
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("active")) {
        closePreview();
    }
});

// JALANKAN
loadPhotos();

// UPDATE JIKA DATA LOCAL STORAGE BERUBAH DI TAB LAIN
window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
        loadPhotos();
    }
});
