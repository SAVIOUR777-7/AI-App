const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');

// Backend URL
const API_URL = 'http://localhost:5000/api/chat';

// Append message to chat
function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    div.innerHTML = `
        <span class="sender-label">${isUser ? 'You:' : 'AI:'}</span>
        ${text}
    `;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show loading indicator
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'message bot-message loading';
    loading.id = 'loading';
    loading.textContent = 'AI is thinking...';
    chatContainer.appendChild(loading);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Remove loading indicator
function removeLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.remove();
}

// Send message to backend
async function sendMessage(message) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        return data.reply || 'Sorry, I did not understand that.';
    } catch (error) {
        console.error('Error:', error);
        return '⚠️ Connection error. Please ensure the backend is running.';
    }
}

// Form submit handler
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    userInput.value = '';

    // Get AI response
    showLoading();
    const reply = await sendMessage(message);
    removeLoading();
    addMessage(reply, false);
});
