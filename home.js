
function openGift() {
    const button = document.querySelector(".tap-button");

    button.textContent = "opening... ♡";
    button.style.transform = "scale(0.95)";
    button.disabled = true;

    setTimeout(() => {
        window.location.href = "./claw.html";
    }, 600);
}


function toggleMusic() {
    const music = document.getElementById("backgroundMusic");
    const button = document.getElementById("musicButton");

    if (music.paused) {
        music.play()
            .then(() => {
                button.textContent = "♫";
                button.classList.add("playing");
            })
            .catch(error => {
                console.error("Musik gagal diputar:", error);
            });
    } else {
        music.pause();
        button.textContent = "♪";
        button.classList.remove("playing");
    }
}
