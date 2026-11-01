
const capsuleContainer = document.getElementById("capsuleContainer");
const leverButton = document.getElementById("leverButton");
const prizeChute = document.getElementById("prizeChute");
const resultMessage = document.getElementById("resultMessage");
const emptyMessage = document.getElementById("emptyMessage");

const openedCount = document.getElementById("openedCount");
const progressFill = document.getElementById("progressFill");

const modal = document.getElementById("birthdayModal");
const modalCapsule = document.getElementById("modalCapsule");
const modalNumber = document.getElementById("modalNumber");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const closeModal = document.getElementById("closeModal");
const nextButton = document.getElementById("nextButton");

const machine = document.querySelector(".machine");

const TOTAL = 20;

let opened = 0;
let isSpinning = false;
let waitingToOpen = false;
let currentCapsule = null;
let redirectTimer = null;

const colors = [
    "#ff6590", "#55baf5", "#ffc638", "#bd8af5",
    "#ff9d52", "#ff82c8", "#68c8f5"
];

const capsuleEmojis = [
    "💗", "🎀", "🌸", "💌", "🧸",
    "✨", "💕", "🎁", "🌷", "💖",
    "🍰", "🦋", "💐", "⭐", "🌈",
    "💝", "🐰", "🩷", "💞", "🎂"
];

// ===================================
// 20 UCAPAN ULANG TAHUN
// ===================================

const birthdayMessages = [
    {
        title: "Happy Birthday! 🎂",
        message: "Selamat ulang tahun! Selamat naik level, semoga tahun ini bukan cuma umur yang bertambah, tapi juga saldo, kebahagiaan, dan kesabaran."
    },
    {
        title: "A Little Reminder 🎀",
        message: "Selamat bertambah usia. Semoga di umur yang baru ini, lebih banyak hal baik yang datang. Maaf kalau selama ini hidup nggak selalu berjalan sesuai harapan. Semoga kamu tetap kuat, bahkan di hari-hari ketika rasanya ingin menyerah."
    },
    {
        title: "You Are Strong 🌸",
        message: "Selamat ulang tahun untuk diri yang sudah bertahan sejauh ini. Terima kasih karena masih mau berjuang meskipun banyak hal yang harus dipendam sendiri. Semoga tahun ini tidak terlalu banyak air mata dan lebih banyak alasan untuk bahagia."
    },
    {
        title: "More Happiness 💌",
        message: "Semoga kali ini lebih banyak bahagia daripada kecewa."
    },
    {
        title: "Better Things ✨",
        message: "Semoga semua yang hilang diganti dengan yang lebih baik."
    },
    {
        title: "Surrounded by Love 🧸",
        message: "Semoga kamu selalu dikelilingi orang-orang yang tulus."
    },
    {
        title: "Keep Growing 💕",
        message: "Bertambah dewasa, semoga semakin kuat menghadapi dunia"
    },
    {
        title: "Keep Smiling 🎁",
        message: "Semoga selalu ada alasan untuk tetap tersenyum."
    },
    {
        title: "Beautiful Future 🌷",
        message: "Semoga masa depan lebih indah dari masa lalu."
    },
    {
        title: "More Money! 💖",
        message: "Semoga makin tua makin kaya, bukan makin banyak cicilan."
    },
    {
        title: "No More Drama 🍰",
        message: "Semoga tahun ini banyak duit, bukan banyak drama."
    },
    {
        title: "You Are Enough 🦋",
        message: "Jangan pernah merasa kurang, kamu sudah lebih dari cukup."
    },
    {
        title: "Strong Girl 💐",
        message: "Tetap jadi perempuan kuat, tapi jangan lupa istirahat."
    },
    {
        title: "Happiness Finds You ⭐",
        message: "Semoga bahagia selalu menemukan jalan pulang ke kamu."
    },
    {
        title: "Always Wishing You Well 🌈",
        message: "Aku mungkin tidak selalu ada di setiap ceritamu, tapi aku selalu berharap yang terbaik untukmu."
    },
    {
        title: "Never Lose Your Way 💝",
        message: "Sejauh apa pun perjalananmu, semoga kamu tidak pernah kehilangan arah."
    },

    // Empat ucapan lama sementara dipertahankan
    {
        title: "More Adventures 🐰",
        message: "Semoga tahun ini penuh petualangan baru, tempat-tempat menyenangkan, cerita lucu, dan kenangan yang suatu hari akan kamu ceritakan sambil tertawa."
    },
    {
        title: "Choose Happiness 🩷",
        message: "Semoga kamu menemukan kebahagiaan dalam hal-hal sederhana: langit yang cantik, lagu favorit, makanan kesukaan, dan waktu bersama orang tersayang."
    },
    {
        title: "A Hug for You 💞",
        message: "Semoga semua kecemasanmu perlahan digantikan ketenangan. Kamu boleh berjalan perlahan. Yang penting, jangan lupa menyayangi dirimu sendiri."
    },
    {
        title: "Your Special Day 🎂",
        message: "Selamat ulang tahun sekali lagi! Semoga umur barumu dipenuhi kesehatan, keberuntungan, rezeki, cinta, dan banyak alasan untuk tersenyum. Aku harap kamu menyukai semua kejutan ini! 💗"
    }
];

const positions = [
    [3, 5], [27, 3], [52, 5], [76, 7],
    [13, 21], [39, 19], [65, 21], [84, 27],
    [1, 39], [25, 39], [49, 38], [73, 43],
    [12, 58], [37, 57], [61, 59], [82, 62],
    [3, 77], [28, 77], [54, 78], [76, 79]
];

// ===================================
// MEMBUAT 20 KAPSUL
// ===================================

function createCapsules() {
    capsuleContainer.innerHTML = "";

    positions.forEach((position, index) => {
        const capsule = document.createElement("div");

        capsule.className = "capsule";
        capsule.style.left = position[0] + "%";
        capsule.style.top = position[1] + "%";

        capsule.style.setProperty(
            "--capsule-color",
            colors[index % colors.length]
        );

        capsule.style.transform =
            `rotate(${Math.random() * 30 - 15}deg)`;

        capsule.dataset.id = index;

        capsuleContainer.appendChild(capsule);
    });
}

// ===================================
// MEMUTAR MESIN CLAW
// ===================================

function spinMachine() {
    if (
        isSpinning ||
        waitingToOpen ||
        opened >= TOTAL
    ) {
        return;
    }

    const capsules = capsuleContainer.querySelectorAll(".capsule");

    if (capsules.length === 0) return;

    isSpinning = true;
    leverButton.disabled = true;

    machine.classList.add("spinning");
    resultMessage.textContent = "Mengambil kapsul kejutan... ♡";

    setTimeout(() => {
        machine.classList.remove("spinning");

        const availableCapsules =
            capsuleContainer.querySelectorAll(".capsule");

        const selected = availableCapsules[
            Math.floor(Math.random() * availableCapsules.length)
        ];

        if (!selected) {
            isSpinning = false;
            leverButton.disabled = false;
            return;
        }

        const id = Number(selected.dataset.id);
        const color = selected.style.getPropertyValue("--capsule-color");

        selected.remove();

        const prize = document.createElement("button");
        prize.className = "prize-capsule";
        prize.type = "button";
        prize.setAttribute("aria-label", "Buka kapsul kejutan");
        prize.style.setProperty("--capsule-color", color);
        prize.textContent = capsuleEmojis[id];

        prize.addEventListener("click", () => {
            openCapsule(id, prize);
        });

        prizeChute.querySelectorAll(".prize-capsule")
            .forEach(item => item.remove());

        prizeChute.appendChild(prize);
        emptyMessage.style.display = "none";

        currentCapsule = prize;
        waitingToOpen = true;
        isSpinning = false;

        resultMessage.textContent =
            "Klik kapsul di bawah untuk membuka ucapanmu! 💌";

    }, 1000);
}

// ===================================
// MEMBUKA KAPSUL
// ===================================

function openCapsule(id, capsuleElement) {
    if (!waitingToOpen || !capsuleElement) return;

    waitingToOpen = false;
    capsuleElement.disabled = true;
    capsuleElement.classList.add("capsule-opening");

    const birthday = birthdayMessages[id];

    opened++;

    openedCount.textContent = opened;
    progressFill.style.width = `${opened / TOTAL * 100}%`;

    modalCapsule.textContent = capsuleEmojis[id];
    modalNumber.textContent =
        `BIRTHDAY SURPRISE #${opened} / ${TOTAL}`;

    modalTitle.textContent = birthday.title;
    modalMessage.textContent = birthday.message;

    if (opened >= TOTAL) {
        nextButton.textContent = "Menuju birthday cake 🎂";
    } else {
        nextButton.textContent = "Buka kejutan berikutnya 💌";
    }

    modal.classList.add("show");
    document.body.classList.add("modal-open");

    resultMessage.textContent = "Satu kejutan berhasil dibuka! ♡";
}

// ===================================
// MENUTUP UCAPAN DAN MELANJUTKAN
// ===================================

function continueGame() {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");

    if (opened >= TOTAL) {
        resultMessage.textContent =
            "Semua kapsul terbuka! Menuju birthday cake... 🎂";

        leverButton.disabled = true;

        redirectTimer = setTimeout(() => {
            window.location.href = "./cake.html";
        }, 1800);

        return;
    }

    if (currentCapsule) {
        currentCapsule.remove();
        currentCapsule = null;
    }

    emptyMessage.style.display = "flex";

    resultMessage.textContent =
        "Siap untuk kejutan berikutnya? Putar tuas! ♡";

    leverButton.disabled = false;
}

// ===================================
// EVENT TOMBOL
// ===================================

leverButton.addEventListener("click", spinMachine);

nextButton.addEventListener("click", continueGame);

closeModal.addEventListener("click", () => {
    continueGame();
});

// ===================================
// TUTUP MODAL DENGAN ESCAPE
// ===================================

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
        continueGame();
    }
});

// ===================================
// MULAI PERMAINAN
// ===================================

createCapsules();
