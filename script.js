const correctPassword = "120525";

let enteredPassword = "";

const dots = document.querySelectorAll(".pin-dots span");
const message = document.getElementById("message");


function addNumber(number) {

    // Maksimal 6 angka
    if (enteredPassword.length >= 6) {
        return;
    }

    enteredPassword += number;

    updateDots();

    // Kalau sudah 6 angka
    if (enteredPassword.length === 6) {
        checkPassword();
    }
}


function deleteNumber() {

    enteredPassword =
        enteredPassword.slice(0, -1);

    updateDots();

    message.textContent = "";
}


function updateDots() {

    dots.forEach((dot, index) => {

        if (index < enteredPassword.length) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }

    });

}


function checkPassword() {

    if (enteredPassword === correctPassword) {

        message.textContent =
            "Yayyy! Password benar ♡";

        message.style.color =
            "#a51d2d";


        // PIN benar → masuk HOME
        setTimeout(() => {

            window.location.href = "home.html";

        }, 700);


    } else {

        message.textContent =
            "Eits... salah 🥺";

        message.style.color =
            "#a51d2d";


        setTimeout(() => {

            enteredPassword = "";

            updateDots();

            message.textContent = "";

        }, 1000);

    }

}