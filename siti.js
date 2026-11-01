
document.addEventListener("DOMContentLoaded", () => {

    const giftCards = document.querySelectorAll(".gift-card");

    // Animasi saat halaman dibuka
    document.body.classList.add("page-loaded");

    giftCards.forEach((card, index) => {

        // Animasi muncul satu per satu
        card.style.opacity = "0";
        card.style.transform = "translateY(25px)";

        setTimeout(() => {
            card.style.transition = "opacity 0.7s ease, transform 0.7s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 300 + (index * 200));

        // Efek ketika kotak kado diklik
        card.addEventListener("click", (event) => {

            const destination = card.getAttribute("href");

            if (!destination) {
                event.preventDefault();
                return;
            }

            event.preventDefault();

            card.classList.add("gift-opening");

            setTimeout(() => {
                window.location.href = destination;
            }, 450);

        });

    });

});
