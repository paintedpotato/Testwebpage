document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.getElementById('chatbot');
    const themeToggle = document.getElementById('theme-toggle');
    const minimizeChatbotBtn = document.getElementById('minimize-chatbot');
    const sendMessageBtn = document.getElementById('send-message');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        chatbot.classList.toggle('dark-mode');
        matchChatboxTheme();
    });

    chatbot.style.display = 'block';
    sendInitialMessages();

    minimizeChatbotBtn.addEventListener('click', () => {
        chatbot.classList.toggle('minimized');
    });

    sendMessageBtn.addEventListener('click', handleUserMessage);

    chatbotInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleUserMessage();
        }
    });

    window.addEventListener('scroll', () => {
        chatbot.style.bottom = '20px';
    });

    function sendInitialMessages() {
        addMessageToChat('bot', 'Welcome to Righteous Invasion of Truth (R.I.O.T.)');
        setTimeout(() => {
            addMessageToChat('bot', 'Would you like to pay offerings or get pastoral counsel?', true);
        }, 1000);
    }

    function addMessageToChat(sender, message, withOptions = false) {
        console.log(`Adding message from ${sender}: ${message}`);
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
                showOfferingOptions();
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

    function showOfferingOptions() {
        addMessageToChat('bot', 'How would you like to pay your offerings?', false);

        const optionsElement = document.createElement('div');
        optionsElement.classList.add('options');

        const bankButton = document.createElement('button');
        bankButton.textContent = 'Bank';
        bankButton.addEventListener('click', () => {
            addMessageToChat('user', 'Bank');
            showBankOptions();
        });

        const mobileMoneyButton = document.createElement('button');
        mobileMoneyButton.textContent = 'Mobile Money';
        mobileMoneyButton.addEventListener('click', () => {
            addMessageToChat('user', 'Mobile Money');
            showMobileMoneyOptions();
        });

        optionsElement.appendChild(bankButton);
        optionsElement.appendChild(mobileMoneyButton);
        chatbotMessages.appendChild(optionsElement);

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showBankOptions() {
        addMessageToChat('bot', 'Please use the following Equity bank accounts:', false);
        addMessageToChat('bot', 'Tithes and First Fruits:', false);
        addMessageToChat('bot', 'Bank: Equity Bank', false);
        addMessageToChat('bot', 'Branch: Golden Jubilee', false);
        addMessageToChat('bot', 'Account Name: Righteous Invasion of Truth', false);
        addMessageToChat('bot', 'TZS Account: 3004211271428', false);
        addMessageToChat('bot', 'USD Account: 3004211271430', false);
        addMessageToChat('bot', 'All Offerings:', false);
        addMessageToChat('bot', 'Bank: Equity Bank', false);
        addMessageToChat('bot', 'Branch: Golden Jubilee', false);
        addMessageToChat('bot', 'Account Name: RIOT-House of Bread', false);
        addMessageToChat('bot', 'TZS Account: 3004211263462', false);
        addMessageToChat('bot', 'USD Account: 3004211263465', false);
        addMessageToChat('bot', 'Would you like to reset the chat?', true);
    }

    function showMobileMoneyOptions() {
        addMessageToChat('bot', 'Please use the following Lipa na M-Pesa details:', false);
        addMessageToChat('bot', 'Agent Number: 5550777', false);
        addMessageToChat('bot', 'House of Bread Church', false);
        addMessageToChat('bot', 'Would you like to reset the chat?', true);
    }

    function startPastoralCounsel() {
        addMessageToChat('bot', 'Please type your message and our pastoral assistant will respond shortly.');

        sendMessageBtn.removeEventListener('click', handleUserMessage);
        chatbotInput.removeEventListener('keydown', handleUserMessageOnEnter);

        sendMessageBtn.addEventListener('click', handlePastoralMessage);
        chatbotInput.addEventListener('keydown', handlePastoralMessageOnEnter);
    }

    async function getPastoralCounselResponse(message) {
        const apiKey = 'YOUR_OPEN_API_KEY';
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

    function handlePastoralMessage() {
        console.log('Handling pastoral message...');
        const message = chatbotInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            chatbotInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            getPastoralCounselResponse(message).then(response => {
                console.log('Response from OpenAI:', response);
                addMessageToChat('bot', response);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }).catch(error => {
                console.error('Error handling pastoral message:', error);
                addMessageToChat('bot', 'Sorry, there was an error processing your request. Please try again later.');
            });
        }
    }

    function handlePastoralMessageOnEnter(event) {
        if (event.key === 'Enter') {
            handlePastoralMessage();
        }
    }

    function matchChatboxTheme() {
        const bodyStyles = window.getComputedStyle(document.body);
        const bodyBackgroundColor = bodyStyles.backgroundColor;
        document.getElementById('chatbot-body').style.backgroundColor = bodyBackgroundColor;
    }

    function handleUserMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            chatbotInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            // Simulate bot response for regular chat
            setTimeout(() => {
                addMessageToChat('bot', 'This is a simulated response.');
            }, 1000);
        }
    }

    function handleUserMessageOnEnter(event) {
        if (event.key === 'Enter') {
            handleUserMessage();
        }
    }
});
