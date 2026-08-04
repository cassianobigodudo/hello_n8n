// ===== Initialize on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
});

// ===== Chat Functionality =====
function initializeChat() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatStatus = document.getElementById('chatStatus');
    const chatBox = document.querySelector('.chat-box');
    
    if (!messageInput || !sendBtn) {
        console.error('Chat elements not found');
        return;
    }
    
    // Focus input on load
    messageInput.focus();
    
    // Send message on button click
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
            messageInput.value = '';
            messageInput.focus();
        }
    });
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = messageInput.value.trim();
            if (message) {
                sendMessage(message);
                messageInput.value = '';
            }
        }
    });
    
    // Auto-focus input when clicking chat area
    chatBox.addEventListener('click', () => {
        messageInput.focus();
    });
    
    async function sendMessage(message) {
        // Show user message
        const userDiv = document.createElement('div');
        userDiv.className = 'message user-message';
        userDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHtml(message)}</p>
            </div>
            <div class="message-avatar">👤</div>
        `;
        chatMessages.appendChild(userDiv);
        
        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Disable send button
        sendBtn.disabled = true;
        messageInput.disabled = true;
        chatStatus.textContent = 'Mandy está digitando...';
        chatStatus.className = '';
        
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message system-message';
        loadingDiv.id = 'loading-message';
        loadingDiv.innerHTML = `
            <div class="message-avatar">📚</div>
            <div class="message-content">
                <div class="loading-indicator">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        try {
            // Send to webhook
            const response = await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mensagem: message }),
                timeout: CONFIG.REQUEST_TIMEOUT
            });
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            
            // Remove loading indicator
            loadingDiv.remove();
            
            // Show bot response
            const botDiv = document.createElement('div');
            botDiv.className = 'message system-message';
            botDiv.innerHTML = `
                <div class="message-avatar">📚</div>
                <div class="message-content">
                    <p><strong>Mandy:</strong> ${escapeHtml(text)}</p>
                </div>
            `;
            chatMessages.appendChild(botDiv);
            
            chatStatus.textContent = '✓';
            chatStatus.className = 'success';
            
            // Clear status after 2 seconds
            setTimeout(() => {
                chatStatus.textContent = '';
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            
            // Remove loading indicator
            loadingDiv.remove();
            
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message system-message';
            errorDiv.innerHTML = `
                <div class="message-avatar">📚</div>
                <div class="message-content">
                    <p><strong>Mandy:</strong> Ops! Tive um problema pra responder agora, mas não desista não! 😅 Tenta de novo?</p>
                </div>
            `;
            chatMessages.appendChild(errorDiv);
            
            chatStatus.textContent = '✗ Erro ao enviar';
            chatStatus.className = 'error';
        } finally {
            sendBtn.disabled = false;
            messageInput.disabled = false;
            
            // Scroll to bottom
            setTimeout(() => {
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 100);
            
            messageInput.focus();
        }
    }
}

// ===== Utility: Escape HTML =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Console Message =====
console.log('%c📚 Livraria Saberes', 
    'font-size: 20px; color: #d4af37; font-weight: bold;');
console.log('%c🎉 Converse com Mandy, sua assistente apaixonada por livros!', 
    'font-size: 14px; color: #8b7355;');
console.log('%c' + '='.repeat(50), 'color: #ddd;');

let sessionId = localStorage.getItem('session_id');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem('session_id', sessionId);
}

// e envia em TODA requisição
await fetch('https://cassianobigodudo.app.n8n.cloud/webhook/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: sessionId,
    mensagem: textoDoUsuario
  })
});
