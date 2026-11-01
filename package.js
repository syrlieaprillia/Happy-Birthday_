// =====================================
// PACKAGE OPEN
// =====================================

function openPackage() {

    const packageBox =
        document.getElementById("package");

    const instruction =
        document.getElementById("instruction");

    const message =
        document.getElementById("openingMessage");


    // Mencegah klik berkali-kali
    if (
        packageBox.classList.contains("opening")
    ) {
        return;
    }


    // Jalankan animasi
    packageBox.classList.add("opening");


    // Ubah tulisan
    instruction.innerHTML =
        "📦 opening your package... ♡";

    message.textContent =
        "there's something special inside... 💌";


    // Tunggu animasi
    setTimeout(() => {

        // Masuk ke halaman PIN
        window.location.href =
            "login.html";

    }, 1500);

}