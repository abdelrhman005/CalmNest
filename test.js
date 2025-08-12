// خلي هنا API Key بتاعك من OpenRouter
const API_KEY = "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";



document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});

// متغير لتتبع وقت آخر طلب لمنع إرسال رسائل بسرعة كبيرة
let lastRequestTime = 0;

async function sendMessage() {
    const input = document.getElementById("userInput");
    const messageText = input.value.trim();
    if (!messageText) return;

    const now = Date.now();
    if (now - lastRequestTime < 2000) { // ثانيتين بين كل طلب
        addMessage("⚠️ يرجى الانتظار قليلاً قبل إرسال رسالة جديدة", "bot");
        return;
    }
    lastRequestTime = now;

    addMessage(messageText, "user");
    input.value = "";

    const typingMessage = addMessage("...", "bot typing");

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
           body: JSON.stringify({
   				 model: "deepseek/deepseek-r1",
    			messages: [
        		{ 
            		role: "system", 
            		content: "أنت مساعد نفسي ودود ومتخصص في دعم الصحة النفسية، تستمع للمستخدم وتقدم نصائح مهدئة وبسيطة، مع لغة لطيفة وداعمة." 
       			},
        		{ role: "user", content: messageText }]})
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.status}`);
        }

        const data = await response.json();
        typingMessage.remove();

        const botReply = data.choices?.[0]?.message?.content || "لم أفهم ما تقصده.";
        addMessage(botReply, "bot");

    } catch (error) {
        typingMessage.remove();
        console.error("Error details:", error);

        let errorMessage = "حدث خطأ في الاتصال بالخادم";
        if (error.message.includes("API Error")) {
            errorMessage = "مشكلة في الخدمة: " + error.message.split("API Error: ")[1];
        } else if (error.name === "TypeError") {
            errorMessage = "مشكلة في الاتصال بالإنترنت";
        }

        addMessage(errorMessage, "bot");
    }
}

function addMessage(text, className) {
    const messages = document.getElementById("messages");
    const message = document.createElement("div");
    message.className = `message ${className}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
}


let isWaitingResponse = false;

async function sendMessage() {
    if (isWaitingResponse) return;  // ما تبعتش رسالة جديدة قبل الرد

    const input = document.getElementById("userInput");
    const messageText = input.value.trim();
    if (!messageText) return;

    isWaitingResponse = true;
    toggleInput(false);

    addMessage(messageText, "user");
    input.value = "";

    const typingMessage = addMessage("...", "bot typing");

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1",
                messages: [{ role: "user", content: messageText }]
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.status}`);
        }

        const data = await response.json();
        typingMessage.remove();

        const botReply = data.choices?.[0]?.message?.content || "لم أفهم ما تقصده.";
        addMessage(botReply, "bot");

    } catch (error) {
        typingMessage.remove();
        addMessage("حدث خطأ في الاتصال بالخادم", "bot");
        console.error(error);
    } finally {
        isWaitingResponse = false;
        toggleInput(true);
    }
}

function toggleInput(enabled) {
    document.getElementById("sendBtn").disabled = !enabled;
    document.getElementById("userInput").disabled = !enabled;
}

function toggleChat() {
  const chat = document.querySelector('.chat-container');
  chat.classList.toggle('hidden');
}
