const cake = document.getElementById("cake");
const music = document.getElementById("birthdayMusic");
const instruction = document.getElementById("instruction");

let finished = false;
let musicStarted = false;
let waitingForMusic = false;

// ================================
// 1. KUE GOYANG OTOMATIS 2 DETIK
// ================================

function startCake() {
    cake.classList.add("dancing");
    instruction.textContent = "A little birthday magic ♡";

    setTimeout(() => {
        cake.classList.remove("dancing");
        instruction.textContent = "Happy 20th Birthday! ♡";

        playBirthdayMusic();
    }, 2000);
}

// ================================
// 2. PUTAR MUSIK
// ================================

async function playBirthdayMusic() {
    if (finished || musicStarted) return;

    music.pause();
    music.currentTime = 0;
    music.volume = 1;

    try {
        await music.play();

        musicStarted = true;
        waitingForMusic = false;

        instruction.textContent = "Happy 20th Birthday! ♡";

    } catch (error) {
        waitingForMusic = true;

        instruction.textContent =
            "Tap a candle to play birthday song ♡";

        console.log("Autoplay diblokir browser:", error);
    }
}

// ================================
// 3. MATIKAN LILIN SATU PER SATU
// ================================

const candles = document.querySelectorAll(".candle");

candles.forEach(candle => {
    candle.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();

        if (finished || candle.classList.contains("extinguished")) {
            return;
        }

        // Jika browser memblokir autoplay,
        // klik lilin juga akan mencoba memutar musik.
        if (waitingForMusic && !musicStarted) {
            try {
                await music.play();
                musicStarted = true;
                waitingForMusic = false;
            } catch (error) {
                console.log("Musik belum bisa diputar:", error);
            }
        }

        // Matikan api lilin
        candle.classList.add("extinguished");

        // Efek asap
        const smoke = document.createElement("span");
        smoke.className = "smoke";
        smoke.textContent = "〰";

        candle.appendChild(smoke);

        setTimeout(() => {
            smoke.remove();
        }, 1000);

        // Hitung lilin yang masih menyala
        const remaining = document.querySelectorAll(
            ".candle:not(.extinguished)"
        ).length;

        // ================================
        // 4. SEMUA LILIN SUDAH MATI
        // ================================

        if (remaining === 0) {
            finished = true;

            instruction.textContent = "Happy Birthday! ♡";

            // Hentikan musik
            music.pause();
            music.currentTime = 0;

            // Pindah ke piring.html
            setTimeout(() => {
                window.location.href = "piring.html";
            }, 800);
        }
    });
});

// ================================
// 5. MULAI SAAT HALAMAN DIBUKA
// ================================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startCake, {
        once: true
    });
} else {
    startCake();
}