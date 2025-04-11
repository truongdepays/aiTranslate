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
translateButton.innerText = 'Translate';
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

// Tạo popup
const popup = document.createElement('div');
popup.style.position = 'fixed';
popup.style.bottom = '60px';
popup.style.right = '20px';
popup.style.width = '500px';
popup.style.backgroundColor = 'white';
popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
popup.style.padding = '15px';
popup.style.borderRadius = '5px';
popup.style.display = 'none';
popup.style.zIndex = '10000';

// Tạo input API Key
const apiKeyInput = document.createElement('input');
apiKeyInput.type = 'text';
apiKeyInput.placeholder = 'Enter Open API Key';
apiKeyInput.style.width = 'calc(100% - 20px)';
apiKeyInput.style.marginBottom = '10px';
apiKeyInput.style.padding = '5px';
apiKeyInput.style.border = '1px solid #ccc';
apiKeyInput.style.borderRadius = '5px';

// Lấy API Key từ storage
apiKeyInput.value = getApiKey();

// Tạo button Save
const saveButton = document.createElement('button');
saveButton.innerText = 'Save';
saveButton.style.marginBottom = '10px';
saveButton.style.width = '100%';
saveButton.style.backgroundColor = 'green';
saveButton.style.color = 'white';
saveButton.style.border = 'none';
saveButton.style.padding = '10px';
saveButton.style.cursor = 'pointer';
saveButton.style.borderRadius = '5px';

// Lưu API Key vào storage
saveButton.addEventListener('click', () => {
    setApiKey(apiKeyInput.value);
    alert('API Key saved!');
});

// Tạo textarea
const textarea = document.createElement('textarea');
textarea.style.width = '100%';
textarea.style.height = '80px';
textarea.placeholder = 'Nhập nội dung...';

// Tạo select chọn ngôn ngữ
const languageSelect = document.createElement('select');
const optionVi = document.createElement('option');
optionVi.value = 'vi';
optionVi.innerText = 'Tiếng Việt';
const optionEn = document.createElement('option');
optionEn.value = 'en';
optionEn.innerText = 'Tiếng Anh';
languageSelect.appendChild(optionVi);
languageSelect.appendChild(optionEn);

// Tạo select chọn model AI
const modelSelect = document.createElement('select');
const option4o = document.createElement('option');
option4o.value = 'gpt-4o';
option4o.innerText = 'GPT-4o';

const option4oMini = document.createElement('option');
option4oMini.value = 'gpt-4o-mini';
option4oMini.innerText = 'GPT-4o Mini';
option4oMini.selected = true; // Mặc định là 4o-mini

modelSelect.appendChild(option4oMini);
modelSelect.appendChild(option4o);

// Tạo button Send
const sendButton = document.createElement('button');
sendButton.innerText = 'Send';
sendButton.style.marginTop = '10px';
sendButton.style.width = '100%';
sendButton.style.backgroundColor = 'blue';
sendButton.style.color = 'white';
sendButton.style.border = 'none';
sendButton.style.padding = '10px';
sendButton.style.cursor = 'pointer';
sendButton.style.borderRadius = '5px';

// Tạo phần hiển thị kết quả
const resultDiv = document.createElement('div');
resultDiv.style.marginTop = '10px';
resultDiv.style.padding = '10px';
resultDiv.style.border = '1px solid #ccc';
resultDiv.style.borderRadius = '5px';
resultDiv.style.backgroundColor = '#333';
resultDiv.style.color = 'white';
resultDiv.style.maxHeight = '300px';
resultDiv.style.overflowY = 'auto';
resultDiv.innerText = 'Translation result will appear here.';

// Xử lý gửi request đến OpenAI
sendButton.addEventListener('click', async () => {
    const apiKey = GM_getValue('open_api_key', '');
    if (!apiKey) {
        alert('Please enter and save an API Key first.');
        return;
    }

    const text = textarea.value.trim();
    if (!text) {
        alert('Please enter text to translate.');
        return;
    }

    const targetLanguage = languageSelect.value;
    const prompt = `Hãy dịch nội dung sau sang ${targetLanguage === 'vi' ? 'tiếng Việt' : 'tiếng Anh'}. Nếu là một từ đơn lẻ, hãy cung cấp nghĩa đầy đủ như một từ điển cambridge. Nếu là một đoạn văn, hãy dịch theo đúng ngữ cảnh:\n\n"${text}"`;

    // Disable nút Send khi đang gửi request
    sendButton.disabled = true;
    sendButton.innerText = "Sending...";

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
        resultDiv.innerText = data.choices?.[0]?.message?.content || 'No response';
    } catch (error) {
        resultDiv.innerText = 'Error occurred while translating.';
        console.error(error);
    }

    // Enable lại nút Send sau khi nhận response
    sendButton.disabled = false;
    sendButton.innerText = "Send";
});


// Gắn sự kiện mở popup
translateButton.addEventListener('click', () => {
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
});

// Gắn các phần tử vào popup
popup.appendChild(apiKeyInput);
popup.appendChild(saveButton);
popup.appendChild(textarea);
popup.appendChild(languageSelect);
popup.appendChild(modelSelect);
popup.appendChild(sendButton);
popup.appendChild(resultDiv);

// Gắn vào body
document.body.appendChild(translateButton);
document.body.appendChild(popup);