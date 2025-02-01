document.addEventListener("DOMContentLoaded", function () {
    const chatbotToggleBtn = document.querySelector(".chatbot-toggle-btn");
    const chatbotBody = document.querySelector(".chatbot-body");
    const chatbotCloseBtn = document.querySelector(".chatbot-close-btn");
    const chatbotSendBtn = document.querySelector(".chatbot-send-btn");
    const chatbotInput = document.querySelector(".chatbot-input");
    const chatbotMessages = document.querySelector(".chatbot-messages");

    // Your Gemini API Key
    const GEMINI_API_KEY = "AIzaSyDZkxNcBFNHtDDEi8h6QASB5bG8PF30ex8";

    // Gemini API Endpoint
    const GEMINI_API_ENDPOINT = "https://genai.googleapis.com/v1beta3/models/text:generate";

    // Toggle chatbot visibility
    chatbotToggleBtn.addEventListener("click", () => {
        chatbotBody.style.display = chatbotBody.style.display === "block" ? "none" : "block";
    });

    chatbotCloseBtn.addEventListener("click", () => {
        chatbotBody.style.display = "none";
    });

    chatbotSendBtn.addEventListener("click", async () => {
        const userInput = chatbotInput.value.trim();
        if (userInput) {
            // Display user's message in chat
            addMessageToChat(userInput, "user-message");

            // Call Gemini API for bot response
            const botResponse = await getGeminiResponse(userInput);
            addMessageToChat(botResponse, "bot-message");

            // Scroll to the bottom of the messages
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            chatbotInput.value = ""; // Clear input
        }
    });

    // Function to call Gemini API
    async function getGeminiResponse(prompt) {  
        try {
            const response = await axios.post(
                GEMINI_API_ENDPOINT,
                {
                    model: "gemini-1", // Specify the model version
                    prompt: prompt,    // User's input
                    temperature: 0.7,  // Controls randomness
                    maxTokens: 150,    // Maximum tokens in response
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${GEMINI_API_KEY}`,
                    },
                }
            );

            return response.data.candidates[0]?.output || "I'm sorry, I couldn't process that.";
        } catch (error) {
            console.error("Error calling Gemini API:", error.response?.data || error.message);
            return "Sorry, I encountered an error. Please try again later.";
        }
    }

    // Helper function to add messages to chat
    function addMessageToChat(message, className) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.classList.add(className);
        chatbotMessages.appendChild(messageDiv);
    }
});
