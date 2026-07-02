const prompts = [
  "What name should I put on this project?",
  "What type of music are you making?",
  "Drop your top three favorite artists right now.",
  "Name two songs that live close to the sound you want.",
  "Do you already have demos, voice notes, stems, or references?",
  "Where can I see your current brand: Instagram, TikTok, YouTube, website, or press links?",
  "What do you need most: production, recording, vocal engineering, guitar, mixing feedback, or full direction?",
  "What is your ideal timeline and budget range?",
  "What is the one thing you want people to feel when they hear this record?"
];

const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const demoUpload = document.querySelector("#demoUpload");

let step = 0;
const answers = [];

function addMessage(text, type = "bot") {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  chatLog.append(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function askNext() {
  if (step < prompts.length) {
    addMessage(prompts[step]);
    return;
  }

  addMessage(
    "Good. This gives me enough to recommend the right next step: a discovery call, a session, a production block, or a mix review."
  );
  addMessage("When this goes live, these answers can send straight to your inbox, CRM, booking calendar, or AI assistant.");
  chatInput.disabled = true;
  chatInput.placeholder = "Intake complete";
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();

  if (!value) return;

  addMessage(value, "user");
  answers.push({ question: prompts[step], answer: value });
  chatInput.value = "";
  step += 1;

  window.setTimeout(askNext, 350);
});

demoUpload.addEventListener("change", () => {
  const file = demoUpload.files[0];
  if (!file) return;

  addMessage(`Demo attached: ${file.name}`, "user");
  addMessage("Perfect. In the live version, this can upload to cloud storage and attach to your project intake.");
});

window.addEventListener("load", () => {
  addMessage("Peace. I’m going to ask a few questions so TOINE can hear where the project is headed.");
  window.setTimeout(askNext, 500);
});
