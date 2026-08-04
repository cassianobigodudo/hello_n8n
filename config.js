// ===== Configuração da Aplicação =====
const CONFIG = {
    // URL do webhook do n8n
    WEBHOOK_URL: 'https://cassianobigodudo.app.n8n.cloud/webhook/chat',
    
    // Configurações de timeout
    REQUEST_TIMEOUT: 30000, // 30 segundos
    
    // Mensagens padrão
    LOADING_MESSAGE: 'Zeca está digitando...',
    ERROR_MESSAGE: 'Desculpe, tive um problema para responder. Tente novamente!',
    
    // Configurações de UI
    MAX_MESSAGE_LENGTH: 500,
    AUTO_SCROLL_CHAT: true
};

// Exportar para ES6 modules (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
