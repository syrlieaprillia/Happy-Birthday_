
const audio = document.getElementById("audio-player");
const vinyl = document.getElementById("vinyl");
const playBtn = document.getElementById("play-btn");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const tonearm = document.getElementById("tonearm");
const vinylLabel = document.getElementById("vinyl-label");

const records = {
    lilie: {
        title: "Lilie",
        artist: "Your first vinyl ♡",
        file: "musik/lilie.mp3",
        label: "L"
    },
    debby: {
        title: "Debby",
        artist: "Your second vinyl ♡",
        file: "musik/debby.mp3",
        label: "D"
    }
};

let currentSong = null;

// Pilih piringan
document.querySelectorAll(".record-card").forEach(card => {
    card.addEventListener("click", () => {
        const song = card.dataset.song;
        playSong(song);
    });
});

// Memutar lagu
function playSong(song) {
    const selected = records[song];

    if (!selected) return;

    // Jika lagu yang sama diklik saat sedang diputar
    if (currentSong === song && !audio.paused) {
        pauseMusic();
        return;
    }

    // Jika lagu berbeda, ganti musik
    if (currentSong !== song) {
        audio.pause();
        audio.src = selected.file;
        audio.load();

        currentSong = song;

        songTitle.textContent = selected.title;
        artistName.textContent = selected.artist;
        vinylLabel.textContent = selected.label;

        document.querySelectorAll(".record-card").forEach(card => {
            card.classList.toggle(
                "active",
                card.dataset.song === song
            );
        });
    }

    audio.play()
        .then(() => {
            updatePlayer(true);
        })
        .catch(error => {
            console.error("Musik gagal diputar:", error);
            alert("Musik tidak dapat diputar. Periksa file musik dan formatnya.");
        });
}

// Play
function playMusic() {
    if (!currentSong) {
        playSong("lilie");
        return;
    }

    audio.play()
        .then(() => updatePlayer(true))
        .catch(error => console.error(error));
}

// Pause
function pauseMusic() {
    audio.pause();
    updatePlayer(false);
}

// Update tampilan player
function updatePlayer(isPlaying) {
    vinyl.classList.toggle("playing", isPlaying);
    tonearm.classList.toggle("active", isPlaying);

    playBtn.textContent = isPlaying ? "Ⅱ" : "▶";
}

// Tombol Play/Pause
playBtn.addEventListener("click", () => {
    if (!currentSong) {
        playSong("lilie");
    } else if (audio.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
});

// Format waktu
function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// Durasi lagu
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

// Update progress
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    progress.value = (audio.currentTime / audio.duration) * 100;

    currentTime.textContent = formatTime(audio.currentTime);
});

// Geser progress untuk mencari bagian lagu
progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// Ketika lagu selesai
audio.addEventListener("ended", () => {
    updatePlayer(false);
    progress.value = 0;
    currentTime.textContent = "0:00";
});
