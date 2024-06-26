document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const chatbot = document.getElementById('chatbot');
    const chatbotHeader = document.getElementById('chatbot-header');
    const closeChatbot = document.getElementById('close-chatbot');
    const sendMessage = document.getElementById('send-message');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    chatbotHeader.addEventListener('click', () => {
        chatbot.style.display = 'flex';
    });

    closeChatbot.addEventListener('click', () => {
        chatbot.style.display = 'none';
    });

    sendMessage.addEventListener('click', async () => {
        const message = chatbotInput.value;
        if (message.trim()) {
            addMessageToChat('You', message);
            chatbotInput.value = '';
            const response = await getChatbotResponse(message);
            addMessageToChat('Pastor', response);
        }
    });

    function addMessageToChat(sender, message) {
        const messageElem = document.createElement('div');
        messageElem.textContent = '${sender}: ${message}';
        chatbotMessages.appendChild(messageElem);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function getChatbotResponse(message) {
        const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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' // Replace with your actual OpenAI API key
            },
            body: JSON.stringify({
                prompt: 'As a pastoral service provider, respond to the following query: ${message}',
                max_tokens: 150
            })
        });
        const data = await response.json();
        return data.choices[0].text.trim();
    }
});
