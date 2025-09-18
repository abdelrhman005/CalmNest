const quizData = [
  {
    question: "How do you feel right now?",
    options: [
      { text: "Happy", img: "pic/feelings/image 2.png" },
      { text: "Calm", img: "pic/feelings/image 4.png" },
      { text: "Anxious", img: "pic/feelings/image 5.png" },
      { text: "Sad", img: "pic/feelings/image 3.png" },
      { text: "Stressed", img: "pic/feelings/image 7.png" }
    ]
  },
  {
    question: "How is your energy level today?",
    options: [
      { text: "Very high", img: "pic/feelings/thunder.png" },
      { text: "Normal", img: "pic/feelings/neutral-face.png" },
      { text: "Low", img: "pic/feelings/communications.png" },
    ]
  },
   {
   question: "How well did you sleep last night?",
   options: [
     { text: "Very well", img: "pic/feelings/sleep.png" },
     { text: "Okay", img: "pic/feelings/sleep-mode.png" },
     { text: "Poorly", img: "pic/feelings/stress.png" },
   ]
  },
     {
   question: "What activity would help you the most right now?",
   options: [
     { text: "Meditation", img: "pic/feelings/yoga.png" },
     { text: "Breathing exercise", img: "pic/feelings/breathing (1).png" },
     { text: "Journaling ", img: "pic/feelings/notebook.png" },
   ]
  },
  
];

let currentQuestion = 0;
let answers = [];

const quizBox = document.getElementById("quiz-box");

function loadQuestion() {
  const q = quizData[currentQuestion];
  quizBox.innerHTML = `
    <p class="question">${q.question}</p>
    ${q.options.map(opt => `
      <div class="option" onclick="selectOption('${opt.text}')">
        ${opt.text} <img src="${opt.img}" alt="${opt.text}" style="height:30px;">
      </div>
    `).join("")}
  `;
}


function selectOption(answer) {
  answers.push({ question: quizData[currentQuestion].question, answer });
  
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizBox.innerHTML = `
    <h2>Your Answers saved 🩵</h2>
	<button class="quizBtn">Next Step 🚀</button>

  `;
}

// أول سؤال
loadQuestion();

console.log(answers)