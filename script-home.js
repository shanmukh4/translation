document.getElementById("translateBtn").addEventListener("click", async function(event) {
    event.preventDefault();

    let textInput = document.getElementById("textInput").value.trim();
    let languageSelect = document.getElementById("languageSelect");
    let targetLang = languageSelect.value;
    let translatedTextBox = document.getElementById("translatedText");

    // Reset previous translation and error message
    translatedTextBox.classList.add("hidden");
    translatedTextBox.textContent = "";

    if (!textInput) {
        alert("⚠️ Please enter some text to translate!");
        return;
    }

    try {
        // Send translation request to the Flask API
        let response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: textInput,
                target_lang: targetLang
            })
        });

        let data = await response.json();

        if (data.error) {
            alert("❌ Error: " + data.error);
        } else {
            // Show the translated text
            translatedTextBox.textContent = data.translated_text;
            translatedTextBox.classList.remove("hidden");
        }
    } catch (error) {
        alert("❌ Translation failed! Please try again.");
    }
});

// Show translated text when "Show Translation" is clicked
document.getElementById("showTranslation").addEventListener("click", function() {
    let translatedTextBox = document.getElementById("translatedText");
    translatedTextBox.classList.toggle("hidden");  // Toggle visibility
});
// Ensure the browser supports SpeechRecognition
if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;  // Stop after a single phrase
    recognition.interimResults = false; // Don't display intermediate results
    recognition.lang = 'en-US'; // Set the language of the speech recognition

    // When speech is recognized, put the result in the input box
    recognition.onresult = function(event) {
        var speechToText = event.results[0][0].transcript;
        document.getElementById('textInput').value = speechToText;  // Automatically fill in the input with recognized text
    };

    // Handle errors
    recognition.onerror = function(event) {
        console.error("Speech Recognition Error: ", event.error);
    };

    // Start listening when the user clicks the button
    document.getElementById("startListening").addEventListener("click", function() {
        recognition.start();  // Start the speech recognition
    });
} else {
    alert("Your browser does not support Speech Recognition");
}
document.addEventListener("DOMContentLoaded", function () {
    let languageSelect = document.getElementById("languageSelect");
    let listenButton = document.getElementById("listenTranslation");

    // Function to toggle listen button visibility
    function toggleListenButton() {
        if (languageSelect.value === "hi") {
            listenButton.style.display = "inline-block"; // Show for Hindi
        } else {
            listenButton.style.display = "none"; // Hide for other languages
        }
    }

    // Call function when language changes
    languageSelect.addEventListener("change", toggleListenButton);

    // Call on page load to apply initial state
    toggleListenButton();

    // Speech synthesis function
    listenButton.addEventListener("click", function () {
        let text = document.getElementById("translatedText").textContent.trim();

        if (!text) {
            alert("No translation available to read.");
            return;
        }

        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = "hi-IN"; // Set language to Hindi

        // Find a Hindi voice
        function setVoice() {
            let voices = speechSynthesis.getVoices();
            let hindiVoice = voices.find(voice => voice.lang === "hi-IN");

            if (hindiVoice) {
                speech.voice = hindiVoice;
            } else {
                console.warn("Hindi voice not available, using default.");
            }

            window.speechSynthesis.speak(speech);
        }

        // Load voices dynamically before speaking
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.onvoiceschanged = setVoice;
        } else {
            setVoice();
        }
    });
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


