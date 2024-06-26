document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.getElementById('chatbot');
    const themeToggle = document.getElementById('theme-toggle');
    const minimizeChatbotBtn = document.getElementById('minimize-chatbot');
    const sendMessageBtn = document.getElementById('send-message');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        chatbot.classList.toggle('dark-mode');
        matchChatboxTheme();
    });

    // Display chatbot and auto-send the initial messages
    chatbot.style.display = 'block';
    sendInitialMessages();

    // Minimize/maximize chatbot functionality
    minimizeChatbotBtn.addEventListener('click', () => {
        chatbot.classList.toggle('minimized');
    });

    // Send message on button click
    sendMessageBtn.addEventListener('click', () => {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            chatbotInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    });

    // Send message on Enter key press
    chatbotInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    // Handle window scroll
    window.addEventListener('scroll', () => {
        chatbot.style.bottom = '20px';
    });

    // Function to send initial messages
    function sendInitialMessages() {
        addMessageToChat('bot', 'Welcome to Righteous Invasion of Truth (R.I.O.T.)');
        setTimeout(() => {
            addMessageToChat('bot', 'Would you like to pay offerings or get pastoral counsel?', true);
        }, 1000);
    }

    // Function to add messages to the chat
    function addMessageToChat(sender, message, withOptions = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);

        if (withOptions) {
            const optionsElement = document.createElement('div');
            optionsElement.classList.add('options');
            const offeringButton = document.createElement('button');
            offeringButton.textContent = 'Pay Offerings';
            offeringButton.addEventListener('click', () => {
                addMessageToChat('user', 'Pay Offerings');
                showBankingMethods();
            });
            const counselButton = document.createElement('button');
            counselButton.textContent = 'Pastoral Counsel';
            counselButton.addEventListener('click', () => {
                addMessageToChat('user', 'Pastoral Counsel');
                startPastoralCounsel();
            });
            optionsElement.appendChild(offeringButton);
            optionsElement.appendChild(counselButton);
            chatbotMessages.appendChild(optionsElement);
        }

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to show banking methods
    function showBankingMethods() {
        addMessageToChat('bot', 'You can pay your offerings using the following methods:');
        addMessageToChat('bot', '1. Bank Transfer\n2. Mobile Money\n3. PayPal');
        setTimeout(() => {
            addMessageToChat('bot', 'If you need further assistance, feel free to ask. The chat will reset soon.');
            setTimeout(() => {
                resetChat();
            }, 5000);
        }, 1000);
    }

    // Function to start pastoral counsel
    function startPastoralCounsel() {
        addMessageToChat('bot', 'Please type your message and our pastoral assistant will respond shortly.');

        sendMessageBtn.addEventListener('click', handleUserMessage);
        chatbotInput.addEventListener('keydown', handleUserMessageOnEnter);
    }

    async function getPastoralCounselResponse(message) {
        const apiKey = 'sk-I-WILL-DISCLOSE-THIS-ON-BACKEND-OR-PRIVATE-REPO';
        const url = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

        console.log('Sending request to OpenAI API...');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: `You are a pastoral counselor. Respond to the following message with empathy and guidance:\n\n${message}`,
                max_tokens: 150,
                n: 1,
                stop: null,
                temperature: 0.9
            })
        });

        console.log('Received response from OpenAI API...');
        if (!response.ok) {
            console.error('Error from OpenAI API:', response.statusText);
            throw new Error('Failed to get response from OpenAI API');
        }

        const data = await response.json();
        console.log('API response data:', data);
        return data.choices[0].text.trim();
    }

    function handleUserMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            chatbotInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            getPastoralCounselResponse(message).then(response => {
                addMessageToChat('bot', response);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }).catch(error => {
                console.error('Error handling user message:', error);
                addMessageToChat('bot', 'Sorry, there was an error processing your request. Please try again later.');
            });
        }
    }

    function handleUserMessageOnEnter(event) {
        if (event.key === 'Enter') {
            handleUserMessage();
        }
    }

    // Function to reset the chat
    function resetChat() {
        while (chatbotMessages.firstChild) {
            chatbotMessages.removeChild(chatbotMessages.firstChild);
        }
        sendInitialMessages();
    }

    // Function to match chatbox theme with body background
    function matchChatboxTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        chatbot.style.backgroundColor = isDarkMode ? '#000000' : '#ffffff';
        chatbot.style.color = isDarkMode ? '#ffffff' : '#000000';
        chatbotMessages.style.backgroundColor = isDarkMode ? '#000000' : '#ffffff';
        chatbotMessages.style.color = isDarkMode ? '#ffffff' : '#000000';
    }
});
