
/* =========================================
   PHOTOBOX — SITI'S SPECIAL DAY
========================================= */

const camera = document.getElementById("camera");
const placeholder = document.getElementById("camera-placeholder");

const startCameraButton = document.getElementById("start-camera");
const takePhotoButton = document.getElementById("take-photo");

const countdownElement = document.getElementById("countdown");
const flashElement = document.getElementById("flash");

const cameraStatus = document.getElementById("camera-status");
const cameraHint = document.getElementById("camera-hint");
const captureStatus = document.getElementById("capture-status");

const resultSection = document.getElementById("result-section");
const resultContent = document.getElementById("result-content");
const resultButtons = document.getElementById("result-buttons");

const downloadButton = document.getElementById("download-photo");
const retakeButton = document.getElementById("retake-photo");

const templateCards = document.querySelectorAll(".template-card");

const galleryStorageKey = "sitiGalleryPhotos";

let cameraStream = null;
let selectedTemplate = "classic";
let photoStripData = null;
let isCapturing = false;
let capturedPhotos = [];


/* =========================================
   TEMPLATE DATA
========================================= */

const templates = {
    classic: {
        background: "#eee2ca",
        text: "#72543e",
        accent: "#ad8965",
        title: "A LITTLE MOMENT",
        subtitle: "SITI'S PHOTO DIARY",
        footer: "captured with love",
        decoration: "vintage"
    },

    cherry: {
        background: "#f9dce0",
        text: "#a23e55",
        accent: "#d66c7f",
        title: "CHERRY ON TOP",
        subtitle: "SITI'S SWEET MOMENTS",
        footer: "sweet memories forever",
        decoration: "cherry"
    },

    lilac: {
        background: "#e9e0ef",
        text: "#776087",
        accent: "#b49ac7",
        title: "SECRET GARDEN",
        subtitle: "A DAY FULL OF MAGIC",
        footer: "blooming memories",
        decoration: "garden"
    }
};


/* =========================================
   TEMPLATE SELECTION
========================================= */

templateCards.forEach(card => {
    card.addEventListener("click", () => {

        if (isCapturing) return;

        templateCards.forEach(item => {
            item.classList.remove("active");
        });

        card.classList.add("active");

        selectedTemplate = card.dataset.template;

        if (!templates[selectedTemplate]) {
            selectedTemplate = "classic";
        }

        captureStatus.textContent =
            `${templates[selectedTemplate].title} selected ♡`;
    });
});


/* =========================================
   CAMERA
========================================= */

async function startCamera() {

    try {

        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("Browser tidak mendukung kamera.");
        }

        cameraStatus.textContent = "Connecting camera...";

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        camera.srcObject = cameraStream;
        camera.muted = true;

        await camera.play();

        camera.style.display = "block";
        placeholder.style.display = "none";

        cameraStatus.textContent = "Camera is ready ♡";

        cameraHint.textContent =
            "Get ready to take your pictures!";

        startCameraButton.disabled = true;
        startCameraButton.textContent = "Camera Ready";

        takePhotoButton.disabled = false;

    } catch (error) {

        console.error(error);

        cameraStatus.textContent = "Camera could not be opened";

        cameraHint.textContent =
            "Please allow camera access in your browser.";

        alert(
            "Kamera tidak dapat dibuka. Pastikan izin kamera diberikan dan buka website melalui localhost atau HTTPS."
        );
    }
}


function stopCamera() {

    if (cameraStream) {

        cameraStream.getTracks().forEach(track => {
            track.stop();
        });

        cameraStream = null;
    }

    camera.srcObject = null;
}


/* =========================================
   WAIT HELPER
========================================= */

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/* =========================================
   COUNTDOWN
========================================= */

async function countdown() {

    for (let number = 3; number >= 1; number--) {

        countdownElement.textContent = number;
        countdownElement.classList.add("show");

        await wait(900);
    }

    countdownElement.textContent = "SMILE!";

    await wait(600);

    countdownElement.classList.remove("show");
    countdownElement.textContent = "";
}


/* =========================================
   SHUTTER SOUND
========================================= */

function playShutterSound() {

    try {

        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) return;

        const audioContext = new AudioContext();

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "square";

        oscillator.frequency.setValueAtTime(
            1000,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            300,
            audioContext.currentTime + 0.12
        );

        gain.gain.setValueAtTime(
            0.15,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.15
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);

        oscillator.onended = () => audioContext.close();

    } catch (error) {

        console.warn("Sound unavailable:", error);
    }
}


/* =========================================
   FLASH
========================================= */

async function flashScreen() {

    flashElement.classList.add("active");

    await wait(180);

    flashElement.classList.remove("active");
}


/* =========================================
   CAPTURE PHOTO
========================================= */

function capturePhoto() {

    if (!cameraStream || camera.readyState < 2) {
        throw new Error("Kamera belum siap.");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const width = camera.videoWidth;
    const height = camera.videoHeight;

    canvas.width = width;
    canvas.height = height;

    // Mirror agar hasil sama dengan preview kamera
    context.translate(width, 0);
    context.scale(-1, 1);

    context.drawImage(
        camera,
        0,
        0,
        width,
        height
    );

    return canvas.toDataURL("image/jpeg", 0.92);
}


/* =========================================
   TAKE THREE PHOTOS
========================================= */

async function takePhotos() {

    if (isCapturing || !cameraStream) return;

    isCapturing = true;
    capturedPhotos = [];

    takePhotoButton.disabled = true;
    startCameraButton.disabled = true;

    try {

        for (let i = 0; i < 3; i++) {

            captureStatus.textContent =
                `Get ready for photo ${i + 1} of 3 ♡`;

            await countdown();

            playShutterSound();

            await flashScreen();

            const photo = capturePhoto();

            capturedPhotos.push(photo);

            captureStatus.textContent =
                `Photo ${i + 1} of 3 captured! ♡`;

            await wait(700);
        }

        captureStatus.textContent =
            "Creating your photo strip...";

        photoStripData = await createPhotoStrip(
            capturedPhotos,
            selectedTemplate
        );

        saveToGallery(photoStripData);

        showResult(photoStripData);

    } catch (error) {

        console.error(error);

        alert(
            "Terjadi kesalahan saat mengambil foto. Silakan coba lagi."
        );

        takePhotoButton.disabled = false;

    } finally {

        isCapturing = false;

        startCameraButton.disabled = false;
    }
}


/* =========================================
   CANVAS HELPERS
========================================= */

function roundedRect(ctx, x, y, w, h, r) {

    ctx.beginPath();

    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);

    ctx.quadraticCurveTo(
        x + w, y,
        x + w, y + r
    );

    ctx.lineTo(x + w, y + h - r);

    ctx.quadraticCurveTo(
        x + w, y + h,
        x + w - r, y + h
    );

    ctx.lineTo(x + r, y + h);

    ctx.quadraticCurveTo(
        x, y + h,
        x, y + h - r
    );

    ctx.lineTo(x, y + r);

    ctx.quadraticCurveTo(
        x, y,
        x + r, y
    );

    ctx.closePath();
}


function drawText(
    ctx,
    text,
    x,
    y,
    size,
    color,
    font = "serif"
) {

    ctx.fillStyle = color;
    ctx.font = `${size}px ${font}`;
    ctx.textAlign = "center";

    ctx.fillText(text, x, y);
}


function loadPhoto(photo) {

    return new Promise((resolve, reject) => {

        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = reject;

        image.src = photo;
    });
}


function drawCover(ctx, image, x, y, w, h) {

    const ratio = Math.max(
        w / image.width,
        h / image.height
    );

    const sw = w / ratio;
    const sh = h / ratio;

    const sx = (image.width - sw) / 2;
    const sy = (image.height - sh) / 2;

    ctx.drawImage(
        image,
        sx, sy, sw, sh,
        x, y, w, h
    );
}


/* =========================================
   CHERRY DECORATION
========================================= */

function drawCherry(ctx, x, y, scale = 1) {

    ctx.save();

    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.strokeStyle = "#66845b";
    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(0, 5);
    ctx.quadraticCurveTo(12, -30, 28, -35);

    ctx.moveTo(0, 5);
    ctx.quadraticCurveTo(-15, -25, -28, -30);

    ctx.stroke();

    ctx.fillStyle = "#bd4059";

    ctx.beginPath();

    ctx.arc(-10, 10, 15, 0, Math.PI * 2);
    ctx.arc(19, 10, 15, 0, Math.PI * 2);

    ctx.fill();

    ctx.fillStyle = "#f7a2ae";

    ctx.beginPath();

    ctx.arc(-15, 4, 4, 0, Math.PI * 2);
    ctx.arc(14, 4, 4, 0, Math.PI * 2);

    ctx.fill();

    ctx.restore();
}


/* =========================================
   FLOWER DECORATION
========================================= */

function drawFlower(
    ctx,
    x,
    y,
    scale = 1,
    color = "#d5a9c4"
) {

    ctx.save();

    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = color;

    for (let i = 0; i < 6; i++) {

        const angle = (Math.PI * 2 / 6) * i;

        ctx.beginPath();

        ctx.ellipse(
            Math.cos(angle) * 17,
            Math.sin(angle) * 17,
            10,
            16,
            angle,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.fillStyle = "#e9c978";

    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}


/* =========================================
   VINTAGE DECORATION
========================================= */

function drawFilmDecoration(ctx, width, height) {

    for (let i = 0; i < 1800; i++) {

        ctx.fillStyle = "rgba(115, 82, 49, 0.07)";

        ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            2,
            2
        );
    }

    for (let y = 80; y < height - 50; y += 75) {

        ctx.fillStyle = "#c9b18f";

        roundedRect(ctx, 22, y, 24, 38, 6);
        ctx.fill();

        roundedRect(ctx, width - 46, y, 24, 38, 6);
        ctx.fill();
    }

    ctx.strokeStyle = "#9e7e5e";
    ctx.lineWidth = 3;

    ctx.strokeRect(
        65,
        55,
        width - 130,
        height - 110
    );
}


/* =========================================
   CREATE PHOTO STRIP
========================================= */

async function createPhotoStrip(photos, templateName) {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 720;
    canvas.height = 2050;

    const W = canvas.width;
    const H = canvas.height;

    const template = templates[templateName] || templates.classic;

    // Background
    ctx.fillStyle = template.background;
    ctx.fillRect(0, 0, W, H);


    /* VINTAGE FILM */

    if (template.decoration === "vintage") {

        drawFilmDecoration(ctx, W, H);
    }


    /* CHERRY CRUSH */

    if (template.decoration === "cherry") {

        const tile = 42;

        for (let y = 0; y < H; y += tile) {

            for (let x = 0; x < W; x += tile) {

                if (
                    (Math.floor(x / tile) +
                    Math.floor(y / tile)) % 2 === 0
                ) {

                    ctx.fillStyle = "rgba(255,255,255,0.23)";

                    ctx.fillRect(x, y, tile, tile);
                }
            }
        }

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 12;

        ctx.strokeRect(
            35, 35,
            W - 70,
            H - 70
        );

        drawCherry(ctx, 100, 110, 1.3);
        drawCherry(ctx, 610, 110, 1.3);

        drawCherry(ctx, 100, 1930, 1.3);
        drawCherry(ctx, 610, 1930, 1.3);
    }


    /* SECRET GARDEN */

    if (template.decoration === "garden") {

        ctx.strokeStyle = "#b49ac7";
        ctx.lineWidth = 5;

        ctx.strokeRect(
            35, 35,
            W - 70,
            H - 70
        );

        ctx.strokeStyle = "rgba(119,96,135,0.5)";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            48, 48,
            W - 96,
            H - 96
        );

        drawFlower(ctx, 95, 100, 1.3, "#d7a8bd");
        drawFlower(ctx, 625, 100, 1.3, "#bba6d3");

        drawFlower(ctx, 95, 1940, 1.3, "#bba6d3");
        drawFlower(ctx, 625, 1940, 1.3, "#d7a8bd");
    }


    // Header
    drawText(
        ctx,
        template.title,
        W / 2,
        145,
        43,
        template.text
    );

    drawText(
        ctx,
        template.subtitle,
        W / 2,
        195,
        23,
        template.accent,
        "sans-serif"
    );

    ctx.strokeStyle = template.accent;
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(180, 225);
    ctx.lineTo(540, 225);

    ctx.stroke();


    // Load photos
    const loadedPhotos = await Promise.all(
        photos.map(loadPhoto)
    );


    // Photo positions
    const photoX = 105;
    const photoW = 510;
    const photoH = 390;
    const photoGap = 48;
    const startY = 285;


    // Draw each photo
    loadedPhotos.forEach((photo, index) => {

        const y = startY + index * (photoH + photoGap);


        // Shadow
        ctx.save();

        ctx.shadowColor = "rgba(70,45,50,0.22)";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;

        ctx.fillStyle = "#fffaf3";

        roundedRect(
            ctx,
            photoX - 12,
            y - 12,
            photoW + 24,
            photoH + 24,
            12
        );

        ctx.fill();

        ctx.restore();


        // Photo
        ctx.save();

        roundedRect(
            ctx,
            photoX,
            y,
            photoW,
            photoH,
            8
        );

        ctx.clip();

        drawCover(
            ctx,
            photo,
            photoX,
            y,
            photoW,
            photoH
        );

        ctx.restore();


        // Photo border
        ctx.strokeStyle = template.accent;
        ctx.lineWidth = 3;

        roundedRect(
            ctx,
            photoX,
            y,
            photoW,
            photoH,
            8
        );

        ctx.stroke();


        // Photo number
        drawText(
            ctx,
            `PHOTO 0${index + 1}`,
            W / 2,
            y + photoH + 32,
            18,
            template.text,
            "sans-serif"
        );


        // Side decorations
        if (template.decoration === "vintage") {

            drawText(
                ctx, "✦",
                75, y + 25,
                28, template.accent
            );

            drawText(
                ctx, "✦",
                645, y + photoH - 10,
                28, template.accent
            );
        }

        if (template.decoration === "cherry") {

            drawCherry(ctx, 75, y + 35, 0.55);
            drawCherry(ctx, 645, y + photoH - 15, 0.55);
        }

        if (template.decoration === "garden") {

            drawFlower(ctx, 75, y + 30, 0.65);

            drawFlower(
                ctx,
                645,
                y + photoH - 15,
                0.65,
                "#bba6d3"
            );
        }

    });


    // Footer
    drawText(
        ctx,
        template.footer,
        W / 2,
        1705,
        27,
        template.text
    );

    drawText(
        ctx,
        "♡  SITI'S SPECIAL DAY  ♡",
        W / 2,
        1755,
        20,
        template.accent,
        "sans-serif"
    );

    drawText(
        ctx,
        "MADE WITH LOVE",
        W / 2,
        1840,
        16,
        template.text,
        "sans-serif"
    );

    return canvas.toDataURL("image/jpeg", 0.95);
}


/* =========================================
   SAVE TO GALLERY
========================================= */

function saveToGallery(imageData) {

    try {

        let galleryPhotos = JSON.parse(
            localStorage.getItem(galleryStorageKey) || "[]"
        );

        if (!Array.isArray(galleryPhotos)) {
            galleryPhotos = [];
        }

        const newPhoto = {
            id: Date.now(),
            image: imageData,
            template: selectedTemplate,
            date: new Date().toISOString()
        };

        galleryPhotos.unshift(newPhoto);

        // Maksimal 8 photo strips
        galleryPhotos = galleryPhotos.slice(0, 8);

        localStorage.setItem(
            galleryStorageKey,
            JSON.stringify(galleryPhotos)
        );

    } catch (error) {

        console.error("Gallery storage error:", error);

        alert(
            "Foto berhasil dibuat, tetapi penyimpanan Gallery gagal. Coba hapus beberapa data browser."
        );
    }
}


/* =========================================
   SHOW RESULT
========================================= */

function showResult(imageData) {

    resultSection.style.display = "block";

    resultContent.innerHTML = "";

    const image = document.createElement("img");

    image.id = "result-image";
    image.src = imageData;
    image.alt = "Siti's photo strip";

    resultContent.appendChild(image);

    resultButtons.style.display = "flex";

    captureStatus.textContent =
        "Your photo strip is ready! ♡";

    takePhotoButton.disabled = true;

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================
   DOWNLOAD
========================================= */

function downloadPhoto() {

    if (!photoStripData) return;

    const link = document.createElement("a");

    link.href = photoStripData;

    link.download =
        `Siti-Photobox-${Date.now()}.jpg`;

    document.body.appendChild(link);

    link.click();

    link.remove();
}


/* =========================================
   RETAKE
========================================= */

function retakePhoto() {

    photoStripData = null;
    capturedPhotos = [];

    resultSection.style.display = "none";
    resultContent.innerHTML = "";

    takePhotoButton.disabled = !cameraStream;

    captureStatus.textContent =
        "Ready for another photo? ♡";

    cameraHint.textContent =
        "Let's take some more memories!";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   BUTTON EVENTS
========================================= */

startCameraButton.addEventListener(
    "click",
    startCamera
);

takePhotoButton.addEventListener(
    "click",
    takePhotos
);

downloadButton.addEventListener(
    "click",
    downloadPhoto
);

retakeButton.addEventListener(
    "click",
    retakePhoto
);


/* =========================================
   INITIAL STATE
========================================= */

takePhotoButton.disabled = true;

resultSection.style.display = "none";
resultButtons.style.display = "none";

countdownElement.textContent = "";

cameraStatus.textContent =
    "Camera is not connected";

captureStatus.textContent =
    "Choose your favorite frame ♡";


/* =========================================
   STOP CAMERA WHEN LEAVING PAGE
========================================= */

window.addEventListener("pagehide", stopCamera);
