const QUESTIONS = window.QUIZ_QUESTIONS || [];
if (QUESTIONS.length !== 100) {
  console.warn("Expected 100 questions. Current:", QUESTIONS.length);
}

const elQ = document.getElementById("questionText");
const elGrid = document.getElementById("optionsGrid");
const elProgressText = document.getElementById("progressText");
const elProgressFill = document.getElementById("progressFill");
const elScoreText = document.getElementById("scoreText");
const elFeedback = document.getElementById("feedbackBox");

const btnSubmit = document.getElementById("btnSubmit");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const btnRestart = document.getElementById("btnRestart");

let idx = 0; // current question index
let selectedIndex = null; // 0..3
let submitted = false;

const answers = new Array(QUESTIONS.length).fill(null); // store user selections
let score = 0;

function setProgress() {
  const current = idx + 1;
  elProgressText.textContent = `Question ${current} / ${QUESTIONS.length}`;
  elProgressFill.style.width = `${Math.round((current / QUESTIONS.length) * 100)}%`;
  elScoreText.textContent = `Score: ${score}`;
}

function resetFeedback() {
  elFeedback.className = "feedback";
  elFeedback.textContent = "";
}

function renderQuestion() {
  const q = QUESTIONS[idx];
  if (!q) return;

  submitted = false;
  selectedIndex = answers[idx]; // restore if user went back
  btnSubmit.disabled = (selectedIndex === null);
  btnNext.disabled = true;
  btnPrev.disabled = (idx === 0);

  resetFeedback();
  setProgress();

  elQ.textContent = q.question;

  const letters = ["A","B","C","D"];
  elGrid.innerHTML = "";

  q.options.forEach((opt, i) => {
    const choice = document.createElement("div");
    choice.className = "choice";
    choice.dataset.key = letters[i];
    choice.setAttribute("role","button");
    choice.setAttribute("tabindex","0");
    choice.setAttribute("aria-label", `Option ${letters[i]}`);

    if (selectedIndex === i) choice.classList.add("selected");

    choice.innerHTML = `
      <div class="letter">${letters[i]}</div>
      <div class="text">${escapeHtml(opt)}</div>
    `;

    choice.addEventListener("click", () => {
      if (submitted) return;
      selectOption(i);
    });

    choice.addEventListener("keydown", (e) => {
      if (submitted) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectOption(i);
      }
    });

    elGrid.appendChild(choice);
  });
}

function selectOption(i) {
  selectedIndex = i;
  answers[idx] = i;

  // update UI selection
  [...elGrid.querySelectorAll(".choice")].forEach((c, k) => {
    c.classList.toggle("selected", k === i);
  });

  btnSubmit.disabled = false;
}

function submitAnswer() {
  if (submitted) return;
  const q = QUESTIONS[idx];
  if (selectedIndex === null) return;

  submitted = true;

  // mark correct/wrong
  const cards = [...elGrid.querySelectorAll(".choice")];
  cards.forEach((c, i) => {
    c.classList.remove("correct","wrong");
    if (i === q.correctIndex) c.classList.add("correct");
    if (i === selectedIndex && i !== q.correctIndex) c.classList.add("wrong");
  });

  const isCorrect = (selectedIndex === q.correctIndex);

  // calculate score only once per question (handle going back)
  // We'll recompute score simply from answers each submit:
  score = computeScore();
  elScoreText.textContent = `Score: ${score}`;

  elFeedback.className = `feedback ${isCorrect ? "good" : "bad"}`;
  elFeedback.innerHTML = isCorrect
    ? `✅ Correct. <span class="small-muted">(${q.reason})</span>`
    : `❌ Wrong. Correct is <b>${["A","B","C","D"][q.correctIndex]}</b>. <span class="small-muted">(${q.reason})</span>`;

  btnNext.disabled = false;

  // If last question -> show final summary on Next click
  if (idx === QUESTIONS.length - 1) {
    btnNext.textContent = "Finish";
  } else {
    btnNext.textContent = "Next";
  }
}

function computeScore() {
  let s = 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    if (answers[i] !== null && answers[i] === q.correctIndex) s++;
  }
  return s;
}

function nextQuestion() {
  if (!submitted) return;

  if (idx === QUESTIONS.length - 1) {
    showFinal();
    return;
  }
  idx++;
  renderQuestion();
}

function prevQuestion() {
  if (idx === 0) return;
  idx--;
  renderQuestion();
}

function restart() {
  idx = 0;
  selectedIndex = null;
  submitted = false;
  answers.fill(null);
  score = 0;
  btnNext.textContent = "Next";
  renderQuestion();
}

function showFinal() {
  const total = QUESTIONS.length;
  const correct = computeScore();
  const wrong = answers.filter(a => a !== null).length - correct;
  const unanswered = answers.filter(a => a === null).length;
  const percent = Math.round((correct / total) * 100);

  elQ.textContent = "Quiz Finished!";
  elGrid.innerHTML = "";

  elFeedback.className = "feedback good";
  elFeedback.innerHTML = `
    <b>Final Result</b><br>
    Correct: <b>${correct}</b> • Wrong: <b>${wrong}</b> • Unanswered: <b>${unanswered}</b><br>
    Score: <b>${percent}%</b>
  `;

  btnSubmit.disabled = true;
  btnNext.disabled = true;
  btnPrev.disabled = false;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// Buttons
btnSubmit.addEventListener("click", submitAnswer);
btnNext.addEventListener("click", nextQuestion);
btnPrev.addEventListener("click", prevQuestion);
btnRestart.addEventListener("click", restart);

// Init
renderQuestion();
