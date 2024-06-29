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

    sendMessageBtn.addEventListener('click', () => {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            chatbotInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    });

    chatbotInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessageBtn.click();
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
        addMessageToChat('bot', 'Tithes Account: 1234567890', false);
        addMessageToChat('bot', 'Altars Account: 0987654321', false);
        addMessageToChat('bot', 'Would you like to reset the chat?', true);
    }

    function showMobileMoneyOptions() {
        addMessageToChat('bot', 'Please use the following Lipa na M-Pesa details:', false);
        addMessageToChat('bot', 'Agent Number: 5550777', false);
        addMessageToChat('bot', 'Would you like to reset the chat?', true);
    }

    function startPastoralCounsel() {
        addMessageToChat('bot', 'Starting pastoral counsel session...', false);
        // Here you would integrate with the ChatGPT API using your API key to start the session
        // Example:
        // fetch('/start-pastoral-counsel', { method: 'POST' })
        //     .then(response => response.json())
        //     .then(data => addMessageToChat('bot', data.message, false));
    }

    function matchChatboxTheme() {
        const bodyStyles = window.getComputedStyle(document.body);
        const bodyBackgroundColor = bodyStyles.backgroundColor;
        document.getElementById('chatbot-body').style.backgroundColor = bodyBackgroundColor;
    }
});
