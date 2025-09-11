// ==UserScript==
// @name         AI Translator
// @namespace    http://tampermonkey.net/
// @version      2025-03-31
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @match        file:///*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @grant   GM_getValue
// @grant   GM_setValue
// ==/UserScript==

if (window.self !== window.top) {
    console.log("Tampermonkey script blocked inside iframe.");
    return;
}

// Hàm lưu API Key vào Tampermonkey storage
function setApiKey(value) {
    GM_setValue('open_api_key', value);
}

// Hàm lấy API Key từ Tampermonkey storage
function getApiKey() {
    return GM_getValue('open_api_key', '');
}

// Tạo button Translate
const translateButton = document.createElement('button');
translateButton.textContent = 'Translate';
translateButton.style.position = 'fixed';
translateButton.style.bottom = '20px';
translateButton.style.right = '20px';
translateButton.style.backgroundColor = 'blue';
translateButton.style.color = 'white';
translateButton.style.border = 'none';
translateButton.style.padding = '10px 15px';
translateButton.style.cursor = 'pointer';
translateButton.style.borderRadius = '5px';
translateButton.style.zIndex = '10000';

// Tạo popup với UI hiện đại và scroll tối ưu
const popup = document.createElement('div');
popup.style.position = 'fixed';
popup.style.bottom = '70px';
popup.style.right = '20px';
popup.style.width = '450px';
popup.style.maxHeight = '85vh';
popup.style.backgroundColor = '#ffffff';
popup.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
popup.style.padding = '0';
popup.style.borderRadius = '16px';
popup.style.display = 'none';
popup.style.zIndex = '10000';
popup.style.border = '1px solid #e1e5e9';
popup.style.overflow = 'hidden';
popup.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
popup.style.fontSize = '14px';
popup.style.transition = 'all 0.3s ease';

// Header của popup (fixed)
const popupHeader = document.createElement('div');
popupHeader.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
popupHeader.style.color = 'white';
popupHeader.style.padding = '16px 20px';
popupHeader.style.fontWeight = '600';
popupHeader.style.fontSize = '16px';
popupHeader.style.flexShrink = '0';
popupHeader.style.borderTopLeftRadius = '16px';
popupHeader.style.borderTopRightRadius = '16px';
popupHeader.textContent = '🌐 AI Translator';

// Body của popup (scrollable)
const popupBody = document.createElement('div');
popupBody.style.padding = '20px';
popupBody.style.overflow = 'auto';
popupBody.style.flex = '1';
popupBody.style.minHeight = '0';

// Tạo input API Key với design đẹp
const apiKeyInput = document.createElement('input');
apiKeyInput.type = 'password';
apiKeyInput.placeholder = 'Enter OpenAI API Key';
apiKeyInput.style.width = '100%';
apiKeyInput.style.marginBottom = '16px';
apiKeyInput.style.padding = '12px 16px';
apiKeyInput.style.border = '2px solid #e1e5e9';
apiKeyInput.style.borderRadius = '8px';
apiKeyInput.style.fontSize = '14px';
apiKeyInput.style.fontFamily = 'inherit';
apiKeyInput.style.outline = 'none';
apiKeyInput.style.transition = 'border-color 0.2s ease';
apiKeyInput.style.boxSizing = 'border-box';

// Focus effects cho API input
apiKeyInput.addEventListener('focus', () => {
    apiKeyInput.style.borderColor = '#667eea';
    apiKeyInput.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
});
apiKeyInput.addEventListener('blur', () => {
    apiKeyInput.style.borderColor = '#e1e5e9';
    apiKeyInput.style.boxShadow = 'none';
});

// Lấy API Key từ storage
apiKeyInput.value = getApiKey();

// Tạo button Save với style đẹp
const saveButton = document.createElement('button');
saveButton.textContent = '💾 Save API Key';
saveButton.style.marginBottom = '16px';
saveButton.style.width = '100%';
saveButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
saveButton.style.color = 'white';
saveButton.style.border = 'none';
saveButton.style.padding = '12px 20px';
saveButton.style.cursor = 'pointer';
saveButton.style.borderRadius = '8px';
saveButton.style.fontSize = '14px';
saveButton.style.fontWeight = '500';
saveButton.style.fontFamily = 'inherit';
saveButton.style.transition = 'all 0.2s ease';
saveButton.style.boxSizing = 'border-box';

// Hover effects cho save button
saveButton.addEventListener('mouseenter', () => {
    saveButton.style.transform = 'translateY(-1px)';
    saveButton.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
});
saveButton.addEventListener('mouseleave', () => {
    saveButton.style.transform = 'translateY(0)';
    saveButton.style.boxShadow = 'none';
});

// Lưu API Key vào storage
saveButton.addEventListener('click', () => {
    setApiKey(apiKeyInput.value);
    alert('API Key saved!');
});

// Style chung cho textarea
const textareaBaseStyle = {
    width: '100%',
    minHeight: '80px',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    marginBottom: '12px'
};

// Tạo textarea content
const textareaContent = document.createElement('textarea');
textareaContent.placeholder = '📝 Nhập đoạn văn bản cần dịch...';
textareaContent.id = 'content';
Object.assign(textareaContent.style, textareaBaseStyle);

// Tạo textarea word
const textareaWord = document.createElement('textarea');
textareaWord.placeholder = '🔤 Nhập từ cần tra nghĩa...';
textareaWord.id = 'word';
Object.assign(textareaWord.style, textareaBaseStyle);

// Focus effects cho textareas
[textareaContent, textareaWord].forEach(textarea => {
    textarea.addEventListener('focus', () => {
        textarea.style.borderColor = '#667eea';
        textarea.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
    });
    textarea.addEventListener('blur', () => {
        textarea.style.borderColor = '#e1e5e9';
        textarea.style.boxShadow = 'none';
    });
});

// Style chung cho select
const selectBaseStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    marginBottom: '12px'
};

// Container cho 2 select
const selectContainer = document.createElement('div');
selectContainer.style.display = 'flex';
selectContainer.style.gap = '12px';
selectContainer.style.marginBottom = '12px';

// Tạo select chọn ngôn ngữ
const languageSelect = document.createElement('select');
Object.assign(languageSelect.style, selectBaseStyle);
languageSelect.style.width = '50%';
languageSelect.style.marginBottom = '0';

const optionVi = document.createElement('option');
optionVi.value = 'vi';
optionVi.textContent = '🇻🇳 Tiếng Việt';
const optionEn = document.createElement('option');
optionEn.value = 'en';
optionEn.textContent = '🇺🇸 English';
languageSelect.appendChild(optionVi);
languageSelect.appendChild(optionEn);

// Tạo select chọn model AI
const modelSelect = document.createElement('select');
Object.assign(modelSelect.style, selectBaseStyle);
modelSelect.style.width = '50%';
modelSelect.style.marginBottom = '0';

const option4oMini = document.createElement('option');
option4oMini.value = 'gpt-4o-mini';
option4oMini.textContent = '⚡ GPT-4o Mini';
option4oMini.selected = true;

const option4o = document.createElement('option');
option4o.value = 'gpt-4o';
option4o.textContent = '🚀 GPT-4o';

modelSelect.appendChild(option4oMini);
modelSelect.appendChild(option4o);

selectContainer.appendChild(languageSelect);
selectContainer.appendChild(modelSelect);

// Focus effects cho selects
[languageSelect, modelSelect].forEach(select => {
    select.addEventListener('focus', () => {
        select.style.borderColor = '#667eea';
        select.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
    });
    select.addEventListener('blur', () => {
        select.style.borderColor = '#e1e5e9';
        select.style.boxShadow = 'none';
    });
});

// Tạo button Send với style đẹp
const sendButton = document.createElement('button');
sendButton.textContent = '🚀 Translate Now';
sendButton.style.marginTop = '16px';
sendButton.style.width = '100%';
sendButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
sendButton.style.color = 'white';
sendButton.style.border = 'none';
sendButton.style.padding = '14px 20px';
sendButton.style.cursor = 'pointer';
sendButton.style.borderRadius = '8px';
sendButton.style.fontSize = '15px';
sendButton.style.fontWeight = '600';
sendButton.style.fontFamily = 'inherit';
sendButton.style.transition = 'all 0.2s ease';
sendButton.style.boxSizing = 'border-box';

// Hover effects cho send button
sendButton.addEventListener('mouseenter', () => {
    sendButton.style.transform = 'translateY(-1px)';
    sendButton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
});
sendButton.addEventListener('mouseleave', () => {
    sendButton.style.transform = 'translateY(0)';
    sendButton.style.boxShadow = 'none';
});

// Tạo phần hiển thị kết quả với scroll tối ưu
const resultDiv = document.createElement('div');
resultDiv.style.marginTop = '16px';
resultDiv.style.padding = '16px';
resultDiv.style.border = '2px solid #e1e5e9';
resultDiv.style.borderRadius = '12px';
resultDiv.style.backgroundColor = '#f8fafc';
resultDiv.style.color = '#334155';
resultDiv.style.minHeight = '200px';
resultDiv.style.maxHeight = 'none';
resultDiv.style.fontSize = '14px';
resultDiv.style.lineHeight = '1.6';
resultDiv.style.fontFamily = 'inherit';
resultDiv.style.whiteSpace = 'pre-wrap';
resultDiv.style.wordWrap = 'break-word';
resultDiv.style.overflowWrap = 'break-word';
// Tạo placeholder content an toàn cho resultDiv
const resultDivPlaceholder = document.createElement('div');
resultDivPlaceholder.style.color = '#94a3b8';
resultDivPlaceholder.style.textAlign = 'center';
resultDivPlaceholder.style.padding = '20px';
resultDivPlaceholder.textContent = '🌟 Translation result will appear here...';
resultDiv.appendChild(resultDivPlaceholder);

// Tạo Shadow DOM để CSS isolation hoàn toàn
const shadowHost = document.createElement('div');
shadowHost.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    z-index: 2147483647 !important;
    pointer-events: none !important;
    width: 100% !important;
    height: 100% !important;
`;

const shadow = shadowHost.attachShadow({ mode: 'closed' });

// CSS hoàn toàn isolated trong Shadow DOM
const shadowStyle = document.createElement('style');
shadowStyle.textContent = `
    /* Reset all styles */
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
        box-sizing: border-box;
    }

    /* Main popup container */
    .ai-translator-popup {
        position: fixed;
        bottom: 70px;
        right: 20px;
        width: 450px;
        max-height: 85vh;
        background-color: #ffffff;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        padding: 0;
        border-radius: 16px;
        display: none;
        z-index: 10000;
        border: 1px solid #e1e5e9;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        transition: all 0.3s ease;
        flex-direction: column;
        pointer-events: auto;
    }

    /* Header */
    .ai-translator-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 20px;
        font-weight: 600;
        font-size: 16px;
        flex-shrink: 0;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
    }

    /* Body */
    .ai-translator-body {
        padding: 20px;
        overflow: auto;
        flex: 1;
        min-height: 0;
    }

    /* Scrollbar */
    .ai-translator-body::-webkit-scrollbar {
        width: 6px;
    }
    .ai-translator-body::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
    }
    .ai-translator-body::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
    }
    .ai-translator-body::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }

    /* Form elements */
    .ai-translator-input {
        width: 100%;
        margin-bottom: 16px;
        padding: 12px 16px;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
        background: white;
    }

    .ai-translator-input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .ai-translator-textarea {
        width: 100%;
        min-height: 80px;
        padding: 12px 16px;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        resize: vertical;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
        margin-bottom: 12px;
        background: white;
    }

    .ai-translator-textarea:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .ai-translator-select {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        background-color: white;
        cursor: pointer;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
        margin-bottom: 12px;
    }

    .ai-translator-select:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .ai-translator-select-container {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
    }

    .ai-translator-select-container .ai-translator-select {
        width: 50%;
        margin-bottom: 0;
    }

    .ai-translator-button {
        width: 100%;
        padding: 12px 20px;
        cursor: pointer;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        font-family: inherit;
        transition: all 0.2s ease;
        box-sizing: border-box;
        border: none;
        margin-bottom: 16px;
    }

    .ai-translator-button:hover {
        transform: translateY(-1px);
    }

    .ai-translator-button-save {
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
    }

    .ai-translator-button-save:hover {
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }

    .ai-translator-button-send {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        margin-top: 16px;
        padding: 14px 20px;
        font-size: 15px;
        font-weight: 600;
    }

    .ai-translator-button-send:hover {
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .ai-translator-result {
        margin-top: 16px;
        padding: 16px;
        border: 2px solid #e1e5e9;
        border-radius: 12px;
        background-color: #f8fafc;
        color: #334155;
        min-height: 200px;
        font-size: 14px;
        line-height: 1.6;
        font-family: inherit;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    /* Floating button */
    .ai-translator-floating {
        position: absolute;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 10px 16px;
        cursor: pointer;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        z-index: 10001;
        display: none;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        pointer-events: auto;
    }

    .ai-translator-floating:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
`;

shadow.appendChild(shadowStyle);

// Tái tạo tất cả elements trong Shadow DOM
const shadowPopup = document.createElement('div');
shadowPopup.className = 'ai-translator-popup';

const shadowHeader = document.createElement('div');
shadowHeader.className = 'ai-translator-header';
shadowHeader.textContent = '🌐 AI Translator';

const shadowBody = document.createElement('div');
shadowBody.className = 'ai-translator-body';

// Recreate all form elements with new classes
const shadowApiInput = document.createElement('input');
shadowApiInput.type = 'password';
shadowApiInput.placeholder = 'Enter OpenAI API Key';
shadowApiInput.className = 'ai-translator-input';
shadowApiInput.value = getApiKey();

const shadowSaveButton = document.createElement('button');
shadowSaveButton.textContent = '💾 Save API Key';
shadowSaveButton.className = 'ai-translator-button ai-translator-button-save';

const shadowTextareaContent = document.createElement('textarea');
shadowTextareaContent.placeholder = '📝 Nhập đoạn văn bản cần dịch...';
shadowTextareaContent.className = 'ai-translator-textarea';

const shadowTextareaWord = document.createElement('textarea');
shadowTextareaWord.placeholder = '🔤 Nhập từ cần tra nghĩa...';
shadowTextareaWord.className = 'ai-translator-textarea';

const shadowSelectContainer = document.createElement('div');
shadowSelectContainer.className = 'ai-translator-select-container';

const shadowLanguageSelect = document.createElement('select');
shadowLanguageSelect.className = 'ai-translator-select';
const shadowOptionVi = document.createElement('option');
shadowOptionVi.value = 'vi';
shadowOptionVi.textContent = '🇻🇳 Tiếng Việt';
const shadowOptionEn = document.createElement('option');
shadowOptionEn.value = 'en';
shadowOptionEn.textContent = '🇺🇸 English';
shadowLanguageSelect.appendChild(shadowOptionVi);
shadowLanguageSelect.appendChild(shadowOptionEn);

const shadowModelSelect = document.createElement('select');
shadowModelSelect.className = 'ai-translator-select';
const shadowOption4oMini = document.createElement('option');
shadowOption4oMini.value = 'gpt-4o-mini';
shadowOption4oMini.textContent = '⚡ GPT-4o Mini';
shadowOption4oMini.selected = true;
const shadowOption4o = document.createElement('option');
shadowOption4o.value = 'gpt-4o';
shadowOption4o.textContent = '🚀 GPT-4o';
shadowModelSelect.appendChild(shadowOption4oMini);
shadowModelSelect.appendChild(shadowOption4o);

shadowSelectContainer.appendChild(shadowLanguageSelect);
shadowSelectContainer.appendChild(shadowModelSelect);

const shadowSendButton = document.createElement('button');
shadowSendButton.textContent = '🚀 Translate Now';
shadowSendButton.className = 'ai-translator-button ai-translator-button-send';

const shadowResultDiv = document.createElement('div');
shadowResultDiv.className = 'ai-translator-result';

// Tạo placeholder content an toàn
const resultPlaceholder = document.createElement('div');
resultPlaceholder.style.color = '#94a3b8';
resultPlaceholder.style.textAlign = 'center';
resultPlaceholder.style.padding = '20px';
resultPlaceholder.textContent = '🌟 Translation result will appear here...';
shadowResultDiv.appendChild(resultPlaceholder);

// Floating button trong Shadow DOM
const shadowFloatingButton = document.createElement('button');
shadowFloatingButton.textContent = '🌐 Translate';
shadowFloatingButton.className = 'ai-translator-floating';

// Assemble Shadow DOM structure
shadowBody.appendChild(shadowApiInput);
shadowBody.appendChild(shadowSaveButton);
shadowBody.appendChild(shadowTextareaContent);
shadowBody.appendChild(shadowTextareaWord);
shadowBody.appendChild(shadowSelectContainer);
shadowBody.appendChild(shadowSendButton);
shadowBody.appendChild(shadowResultDiv);

shadowPopup.appendChild(shadowHeader);
shadowPopup.appendChild(shadowBody);

shadow.appendChild(shadowPopup);
shadow.appendChild(shadowFloatingButton);

// Add shadow host to document
document.body.appendChild(shadowHost);

// Update all event listeners to use shadow elements
shadowSaveButton.addEventListener('click', () => {
    setApiKey(shadowApiInput.value);
    alert('API Key saved!');
});

// Xử lý gửi request đến OpenAI với shadow elements
shadowSendButton.addEventListener('click', async () => {
    const apiKey = GM_getValue('open_api_key', '');
    if (!apiKey) {
        alert('Please enter and save an API Key first.');
        return;
    }

    const textContent = shadowTextareaContent.value.trim()
    const textWord = shadowTextareaWord.value.trim()
    if (!textContent && !textWord) {
        alert('Please enter word or content');
        return;
    }

    let prompt = ''
    const targetLanguage = shadowLanguageSelect.value;
    const isVietnamese = targetLanguage === 'vi';

    if (textWord && textContent) {
        prompt = `Bạn là một chuyên gia dịch thuật và giảng dạy ngôn ngữ. Hãy phân tích và dịch theo format sau:

🔤 **BẢN DỊCH**
Dịch câu: "${textContent}" sang ${isVietnamese ? 'tiếng Việt' : 'English'}

📖 **PHÂN TÍCH TỪ VỰNG: "${textWord}"**
- Nghĩa chính:
- Loại từ:
- Phát âm:
- Trong ngữ cảnh này:
- Ví dụ khác:

📝 **PHÂN TÍCH NGỮ PHÁP**
- Cấu trúc câu:
- Thì/Thể:
- Điểm chú ý:

💡 **GHI CHÚ**
- Tip ghi nhớ:
- Lưu ý văn hóa (nếu có):`;
    }

    if (!textWord && textContent) {
        prompt = `Bạn là một chuyên gia dịch thuật. Hãy dịch và phân tích theo format sau:

🔤 **BẢN DỊCH**
"${textContent}" → ${isVietnamese ? 'Tiếng Việt' : 'English'}

📝 **PHÂN TÍCH NGỮ PHÁP**
- Cấu trúc câu:
- Thì/Thể sử dụng:
- Từ vựng chính:
- Điểm ngữ pháp đáng chú ý:

💡 **GIẢI THÍCH**
- Tại sao dịch như vậy:
- Các cách diễn đạt khác: `;
    }

    if (textWord && !textContent) {
        prompt = `Bạn là một từ điển Cambridge AI. Hãy phân tích từ "${textWord}" theo format sau:

📖 **TỪ ĐIỂN: "${textWord}"**

**Nghĩa chính:**
• [Loại từ] Định nghĩa chính
• [Loại từ] Định nghĩa phụ (nếu có)

**Phát âm:** /phiên âm IPA/

**Dịch sang ${isVietnamese ? 'tiếng Việt' : 'English'}:**
• Nghĩa 1
• Nghĩa 2 (nếu có)

**Ví dụ:**
• Example 1 → Dịch
• Example 2 → Dịch

**Collocations (Từ đi cùng):**
• Common phrases...

**Synonyms:** từ đồng nghĩa
**Antonyms:** từ trái nghĩa (nếu có)`;
    }

    //const prompt = `Hãy dịch nội dung sau sang ${targetLanguage === 'vi' ? 'tiếng Việt' : 'tiếng Anh'}. Nếu là một từ đơn lẻ, hãy cung cấp nghĩa đầy đủ như một từ điển cambridge. Nếu là một đoạn văn, hãy dịch theo đúng ngữ cảnh:\n\n"${text}"`;

    // Disable nút Send khi đang gửi request
    shadowSendButton.disabled = true;
    shadowSendButton.textContent = "⏳ Translating...";
    shadowSendButton.style.opacity = "0.6";

    // Hiển thị loading trong result (an toàn)
    shadowResultDiv.textContent = '';
    const loadingDiv = document.createElement('div');
    loadingDiv.style.color = '#94a3b8';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.padding = '20px';
    loadingDiv.textContent = '⏳ Đang dịch... vui lòng chờ';
    shadowResultDiv.appendChild(loadingDiv);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
    },
        body: JSON.stringify({
            model: GM_getValue('gpt_model', 'gpt-4o-mini'),
            messages: [{
                role: 'user',
                content: [{
                    type: 'text',
                    text: prompt
                }]
            }],
            response_format: { type: 'text' },
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            store: false
        })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No response';

    // Hiển thị kết quả an toàn (không dùng innerHTML)
    shadowResultDiv.textContent = '';

    // Xử lý content với line breaks an toàn
    const contentLines = content.split('\n');
    contentLines.forEach((line, index) => {
        const lineElement = document.createElement('div');
        lineElement.textContent = line || '\u00A0'; // Non-breaking space cho dòng trống
        shadowResultDiv.appendChild(lineElement);
    });

    // Auto scroll trong shadow popup body để thấy result
    setTimeout(() => {
        shadowBody.scrollTop = shadowBody.scrollHeight;
    }, 200);

} catch (error) {
    shadowResultDiv.textContent = '';
    const errorDiv = document.createElement('div');
    errorDiv.style.color = '#ef4444';
    errorDiv.textContent = '❌ Error occurred while translating.';
    shadowResultDiv.appendChild(errorDiv);
    console.error(error);
}

    // Enable lại nút Send sau khi nhận response
    shadowSendButton.disabled = false;
    shadowSendButton.textContent = "🚀 Translate Now";
    shadowSendButton.style.opacity = "1";
});


// Gắn sự kiện mở shadow popup
translateButton.addEventListener('click', () => {
    if (shadowPopup.style.display === 'none' || shadowPopup.style.display === '') {
        shadowPopup.style.display = 'flex';
    } else {
        shadowPopup.style.display = 'none';
    }
});

// Gắn các phần tử vào popup với cấu trúc mới
popup.appendChild(popupHeader);
popupBody.appendChild(apiKeyInput);
popupBody.appendChild(saveButton);
popupBody.appendChild(textareaContent);
popupBody.appendChild(textareaWord);
popupBody.appendChild(selectContainer);
popupBody.appendChild(sendButton);
popupBody.appendChild(resultDiv);
popup.appendChild(popupBody);

// Tạo floating button với design hiện đại
const floatingTranslateButton = document.createElement('button');
floatingTranslateButton.textContent = '🌐 Translate';
floatingTranslateButton.style.position = 'absolute';
floatingTranslateButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
floatingTranslateButton.style.color = 'white';
floatingTranslateButton.style.border = 'none';
floatingTranslateButton.style.padding = '10px 16px';
floatingTranslateButton.style.cursor = 'pointer';
floatingTranslateButton.style.borderRadius = '20px';
floatingTranslateButton.style.fontSize = '13px';
floatingTranslateButton.style.fontWeight = '500';
floatingTranslateButton.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
floatingTranslateButton.style.zIndex = '10001';
floatingTranslateButton.style.display = 'none';
floatingTranslateButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
floatingTranslateButton.style.transition = 'all 0.2s ease';
floatingTranslateButton.style.backdropFilter = 'blur(10px)';

// Hover effects cho floating button
floatingTranslateButton.addEventListener('mouseenter', () => {
    floatingTranslateButton.style.transform = 'translateY(-2px) scale(1.05)';
    floatingTranslateButton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
});
floatingTranslateButton.addEventListener('mouseleave', () => {
    floatingTranslateButton.style.transform = 'translateY(0) scale(1)';
    floatingTranslateButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
});

// Biến lưu text được chọn
let selectedText = '';

// Xử lý sự kiện chọn text với shadow floating button
document.addEventListener('mouseup', (event) => {
    console.log('mouseup event triggered');

    // Delay nhỏ để đảm bảo selection đã hoàn tất
    setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();

        console.log('Selected text:', text);

        if (text.length > 0 && selection.rangeCount > 0) {
            selectedText = text;

            try {
                // Lấy vị trí của selection
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                console.log('Selection rect:', rect);

                // Định vị shadow floating button gần với text được chọn
                const left = rect.left + window.scrollX;
                const top = rect.bottom + window.scrollY + 5;

                shadowFloatingButton.style.left = left + 'px';
                shadowFloatingButton.style.top = top + 'px';
                shadowFloatingButton.style.display = 'block';

                console.log('Shadow floating button positioned at:', { left, top });

                // Auto hide sau 5 giây nếu không click
                setTimeout(() => {
                    if (shadowFloatingButton.style.display === 'block') {
                        shadowFloatingButton.style.display = 'none';
                        console.log('Auto-hiding shadow floating button');
                    }
                }, 5000);
            } catch (error) {
                console.error('Error positioning shadow floating button:', error);
            }
        } else {
            shadowFloatingButton.style.display = 'none';
            console.log('No text selected, hiding shadow button');
        }
    }, 100);
});

// Ẩn shadow floating button khi click vào chỗ khác
document.addEventListener('click', (event) => {
    if (event.target !== shadowFloatingButton) {
        shadowFloatingButton.style.display = 'none';
        console.log('Hiding shadow floating button due to outside click');
    }
});

// Xử lý click vào shadow floating button
shadowFloatingButton.addEventListener('click', (event) => {
    console.log('Shadow floating translate button clicked');
    event.preventDefault();
    event.stopPropagation();

    // Mở shadow popup
    shadowPopup.style.display = 'flex';

    // Điền text đã chọn vào shadow textarea content
    shadowTextareaContent.value = selectedText;

    // Ẩn shadow floating button
    shadowFloatingButton.style.display = 'none';

    // Clear selection
    window.getSelection().removeAllRanges();

    // Focus vào shadow textarea content
    shadowTextareaContent.focus();

    console.log('Shadow popup opened with selected text:', selectedText);
});

// Đảm bảo script chạy sau khi DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScript);
} else {
    initializeScript();
}

function initializeScript() {
    console.log('AI Translator script initialized');
}

// Chỉ gắn translate button cũ (để backward compatibility)
document.body.appendChild(translateButton);

// Tất cả UI elements khác đã được tạo trong Shadow DOM để tránh CSS conflicts
