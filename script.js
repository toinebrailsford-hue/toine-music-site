const FORM_ENDPOINT = "https://formspree.io/f/xaqgldoa";

const prompts = [
  "What name should I put on this project?",
  "What email should I use to follow up?",
  "What type of music are you making?",
  "Drop your top three favorite artists right now.",
  "Name two songs that live close to the sound you want.",
  "Do you already have demos, voice notes, stems, or references? If yes, paste a link below or describe what you have.",
  "Where can I see your current brand: Instagram, TikTok, YouTube, website, or press links?",
  "What do you need most: production, recording, vocal engineering, guitar, mixing feedback, or full direction?",
  "What is your ideal timeline and budget range?",
  "What is the one thing you want people to feel when they hear this record?"
];

const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const demoLink = document.querySelector("#demoLink");

let step = 0;
const answers = [];
let intakeSent = false;

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
  submitIntake();
  chatInput.disabled = true;
  chatInput.placeholder = "Intake complete";
}

function getAnswer(questionStart) {
  const match = answers.find((item) => item.question.startsWith(questionStart));
  return match ? match.answer : "";
}

async function submitIntake() {
  if (intakeSent) return;
  intakeSent = true;

  addMessage("Sending this intake to TOINE now...");

  const formattedAnswers = answers
    .map((item, index) => `${index + 1}. ${item.question}\n${item.answer}`)
    .join("\n\n");

  const formData = new FormData();
  formData.append("_subject", "New TOINE project intake");
  formData.append("source", "TOINE chatbot intake");
  formData.append("name", getAnswer("What name"));
  formData.append("email", getAnswer("What email"));
  formData.append("demo_link", demoLink.value.trim());
  formData.append("message", formattedAnswers);

  answers.forEach((item) => {
    formData.append(item.question, item.answer);
  });

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Form submission failed");

    addMessage("Done. Your intake has been sent. TOINE will follow up after reviewing the project.");
  } catch (error) {
    addMessage(
      "I could not send this automatically. Please use the booking form below or email TOINE directly with these details."
    );
  }
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

demoLink.addEventListener("change", () => {
  const value = demoLink.value.trim();
  if (!value) return;

  addMessage(`Demo link added: ${value}`, "user");
});

window.addEventListener("load", () => {
  addMessage("Peace. I’m going to ask a few questions so TOINE can hear where the project is headed.");
  window.setTimeout(askNext, 500);
});
