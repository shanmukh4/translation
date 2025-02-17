document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let fileInput = document.getElementById("fileInput");
    let errorMessage = document.getElementById("errorMessage");
    let translatedTextBox = document.getElementById("docTranslatedText");

    // Reset error message
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

    // Check if a file is selected
    if (!fileInput.files.length) {
        errorMessage.textContent = "⚠️ Please choose a file before submitting!";
        errorMessage.classList.remove("hidden");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("target_lang", document.getElementById("docLanguageSelect").value);

    try {
        let response = await fetch("/translate-document", {
            method: "POST",
            body: formData
        });

        let data = await response.json();
        if (data.error) {
            errorMessage.textContent = "❌ Error: " + data.error;
            errorMessage.classList.remove("hidden");
        } else {
            translatedTextBox.textContent = "✅ Translated Text: " + data.translated_text;
            translatedTextBox.classList.remove("hidden");
        }
    } catch (error) {
        errorMessage.textContent = "❌ Failed to fetch translation. Please try again!";
        errorMessage.classList.remove("hidden");
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    // Load saved theme
    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
        themeToggle.textContent = "☀️";
    }

    // Toggle theme
    themeToggle.addEventListener("click", function () {
        body.classList.toggle("light-mode");

        if (body.classList.contains("light-mode")) {
            themeToggle.textContent = "☀️";
            localStorage.setItem("theme", "light");
        } else {
            themeToggle.textContent = "🌙";
            localStorage.setItem("theme", "dark");
        }
    });
});

