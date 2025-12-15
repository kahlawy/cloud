function parseXmlQuestions(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");

  // Detect XML parser errors
  const pe = doc.querySelector("parsererror");
  if (pe) {
    // common cause: unescaped & in text/options
    throw new Error("XML parse error (often caused by unescaped '&' -> use &amp;).");
  }

  // Accept multiple possible roots:
  // <quiz><question> OR <questions><question> OR any root containing <question>
  let qNodes = Array.from(doc.querySelectorAll("quiz > question"));
  if (qNodes.length === 0) qNodes = Array.from(doc.querySelectorAll("questions > question"));
  if (qNodes.length === 0) qNodes = Array.from(doc.querySelectorAll("question"));

  if (qNodes.length === 0) {
    throw new Error("No <question> nodes found in questions.xml.");
  }

  const keyOrder = ["A", "B", "C", "D"];

  const parsed = qNodes.map((qn, i) => {
    const id = Number(qn.getAttribute("id") || (i + 1));
    const topic = qn.getAttribute("topic") || "General";
    const difficulty = qn.getAttribute("difficulty") || "Medium";

    const tNode = qn.querySelector("text") || qn.querySelector("questionText") || qn.querySelector("title");
    const question = (tNode ? tNode.textContent : "").trim();
    if (!question) throw new Error(`Question ${id}: missing <text>.`);

    // Options: supports <option key="A">.. OR <choice>.. etc
    let optNodes = Array.from(qn.querySelectorAll("option"));
    if (optNodes.length === 0) optNodes = Array.from(qn.querySelectorAll("choice"));

    if (optNodes.length < 4) {
      throw new Error(`Question ${id}: needs at least 4 options (<option>).</option>`);
    }

    // Take first 4 and sort by key if available
    const optionsSorted = optNodes.slice(0, 4).sort((a, b) => {
      const ka = (a.getAttribute("key") || "").toUpperCase();
      const kb = (b.getAttribute("key") || "").toUpperCase();
      const ia = keyOrder.indexOf(ka);
      const ib = keyOrder.indexOf(kb);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    const options = optionsSorted.map(o => (o.textContent || "").trim());

    // Correct option:
    // Preferred: correct="true"
    let correctIndex = optionsSorted.findIndex(o => (o.getAttribute("correct") || "false").toLowerCase() === "true");

    // Fallback: answer="B" on <question> (if your XML uses that style)
    if (correctIndex === -1) {
      const ans = (qn.getAttribute("answer") || "").toUpperCase().trim();
      if (ans) correctIndex = keyOrder.indexOf(ans);
    }

    if (correctIndex < 0 || correctIndex > 3) {
      throw new Error(`Question ${id}: no correct answer marked. Use correct="true" on one <option>.`);
    }

    const eNode = qn.querySelector("explanation") || qn.querySelector("reason");
    const reason = (eNode ? eNode.textContent : "").trim();

    return { id, topic, difficulty, question, options, correctIndex, reason };
  });

  parsed.sort((a, b) => a.id - b.id);
  return parsed;
}

/* =========================================
   FILE UPLOAD HANDLER (Chrome Compatible)
   ========================================= */
async function loadXmlFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const xmlText = e.target.result;
        const questions = parseXmlQuestions(xmlText);
        resolve(questions);
      } catch (err) {
        reject(new Error(`Failed to parse XML: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

async function loadXml() {

  setSetupMessage("Loading XML files...");

  // List of XML files to attempt loading
  // Add more XML files here if you have them
  const xmlFiles = [
    "questions.xml"
  ];

  let allLoadedQuestions = [];
  let successCount = 0;
  let failCount = 0;

  // Try to load each XML file
  for (const fileName of xmlFiles) {
    try {
      const xmlUrl = new URL(`./${fileName}`, window.location.href).toString();
      const res = await fetch(xmlUrl, { cache: "no-store" });

      if (!res.ok) {
        console.warn(`Could not load ${fileName} (${res.status})`);
        failCount++;
        continue;
      }

      const xmlText = await res.text();

      // Quick sanity check
      if (xmlText.trim().startsWith("<!doctype") || xmlText.trim().startsWith("<html")) {
        console.warn(`${fileName} returned HTML instead of XML`);
        failCount++;
        continue;
      }

      // Parse this XML file
      const questions = parseXmlQuestions(xmlText);
      allLoadedQuestions.push(...questions);
      successCount++;
      console.log(`Loaded ${fileName}: ${questions.length} questions`);

    } catch (err) {
      console.warn(`Failed to load ${fileName}:`, err.message);
      failCount++;
    }
  }

  // If we loaded at least one file successfully
  if (allLoadedQuestions.length > 0) {
    // Remove duplicates based on question text and options
    const uniqueQuestions = [];
    const seenKeys = new Set();

    for (const q of allLoadedQuestions) {
      // Create a unique key based on question text and first option
      const key = `${q.question.toLowerCase().trim()}|${q.options[0].toLowerCase().trim()}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueQuestions.push(q);
      }
    }

    allQuestions = uniqueQuestions;

    const max = allQuestions.length;
    countInput.max = String(max);
    if (Number(countInput.value) > max) countInput.value = String(max);
    countHint.textContent = `Max available: ${max}`;

    setSetupMessage(`Loaded ${max} unique questions from ${successCount} file(s).`);
    console.log(`Total: ${max} unique questions from ${successCount} XML file(s)`);
    return;
  }

  // If all files failed, try LOCAL_XML_DATA fallback
  if (typeof LOCAL_XML_DATA !== 'undefined' && LOCAL_XML_DATA.trim().length > 0) {
    console.warn("All XML files failed, using local fallback.");
    try {
      allQuestions = parseXmlQuestions(LOCAL_XML_DATA);
      const max = allQuestions.length;
      countInput.max = String(max);
      if (Number(countInput.value) > max) countInput.value = String(max);
      countHint.textContent = `Max available: ${max}`;
      setSetupMessage(`Loaded ${max} questions (Local Mode).`);
      return;
    } catch (parseErr) {
      console.error("Local fallback parse error:", parseErr);
    }
  }

  // Complete failure
  allQuestions = [];
  countHint.textContent = "No questions available";
  setSetupMessage("⚠️ Auto-load failed. Please upload an XML file manually using the button above.", true);
  console.error("XML load error: All files failed to load");
}


/* =========================================
   STATE & DOM
   ========================================= */
let allQuestions = [];
let quizQuestions = [];
let currentQIndex = 0;
let score = 0;
let teacherMode = false;
let userAnswers = []; // stores selected index per question
let timerInterval = null;
let secondsLeft = 0;

// Screens
const setupScreen = document.getElementById("setupScreen");
const quizScreen = document.getElementById("quizScreen");

// Setup Inputs
const countInput = document.getElementById("countInput");
const countHint = document.getElementById("countHint");
const timeInput = document.getElementById("timeInput");
const shuffleToggle = document.getElementById("shuffleToggle");
const teacherToggle = document.getElementById("teacherToggle");
const setupMsg = document.getElementById("setupMsg");

// Buttons
const btnStart = document.getElementById("btnStart");
const btnPrev = document.getElementById("btnPrev");
const btnSubmit = document.getElementById("btnSubmit");
const btnNext = document.getElementById("btnNext");
const btnRestart = document.getElementById("btnRestart");

// Quiz Display
const questionedDiv = document.getElementById("questionText");
const optionsGrid = document.getElementById("optionsGrid");
const feedbackBox = document.getElementById("feedbackBox");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const scoreText = document.getElementById("scoreText");
const timerText = document.getElementById("timerText");

/* =========================================
   INIT & LISTENERS
   ========================================= */
window.addEventListener("DOMContentLoaded", () => {
  loadXml(); // Auto-load on start (fallback)
});

// File Upload Handler
const xmlFileInput = document.getElementById("xmlFileInput");
xmlFileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setSetupMessage(`Loading ${file.name}...`);
    const questions = await loadXmlFromFile(file);

    allQuestions = questions;
    const max = allQuestions.length;
    countInput.max = String(max);
    if (Number(countInput.value) > max) countInput.value = String(max);
    countHint.textContent = `Max available: ${max}`;

    setSetupMessage(`✅ Successfully loaded ${max} question${max > 1 ? 's' : ''} from ${file.name}`);
    console.log(`Manual upload: ${max} questions from ${file.name}`);
  } catch (err) {
    setSetupMessage(`❌ Error: ${err.message}`, true);
    console.error("File upload error:", err);
  }
});

btnStart.addEventListener("click", () => {

  if (allQuestions.length === 0) {
    setSetupMessage("Cannot start: No questions loaded.", true);
    return;
  }

  // 1. Config
  const totalWanted = Number(countInput.value) || 10;
  const timeLimitMins = Number(timeInput.value) || 0;
  const doShuffle = shuffleToggle.checked;
  teacherMode = teacherToggle.checked;

  // 2. Prepare set
  let pool = [...allQuestions];
  if (doShuffle) {
    pool.sort(() => Math.random() - 0.5);
  }
  quizQuestions = pool.slice(0, totalWanted);

  // 3. Reset State
  currentQIndex = 0;
  score = 0;
  userAnswers = new Array(quizQuestions.length).fill(-1); // -1 = unattempted

  // 4. Timer
  stopTimer();
  if (timeLimitMins > 0) {
    secondsLeft = timeLimitMins * 60;
    startTimer();
  } else {
    timerText.textContent = "--:--";
  }

  // 5. UI Switch
  setupScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  // 6. Render first
  updateStats();
  renderQuestion();
});

btnRestart.addEventListener("click", () => {
  if (confirm("Are you sure you want to restart?")) {
    stopTimer();
    quizScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
    setSetupMessage("");
  }
});

btnPrev.addEventListener("click", () => {
  if (currentQIndex > 0) {
    currentQIndex--;
    renderQuestion();
  }
});

btnNext.addEventListener("click", () => {
  if (currentQIndex < quizQuestions.length - 1) {
    currentQIndex++;
    renderQuestion();
  } else {
    // Finish
    endQuiz();
  }
});

btnSubmit.addEventListener("click", submitAnswer);

/* =========================================
   CORE LOGIC
   ========================================= */

function renderQuestion() {
  const q = quizQuestions[currentQIndex];

  // Update texts
  questionedDiv.textContent = q.question;
  progressText.textContent = `Question ${currentQIndex + 1} / ${quizQuestions.length}`;
  const pct = ((currentQIndex) / quizQuestions.length) * 100;
  progressFill.style.width = pct + "%";

  // Clear previous options
  optionsGrid.innerHTML = "";
  feedbackBox.textContent = "";
  feedbackBox.className = "feedback"; // reset colors

  // Check if this question is already answered (stored in userAnswers[currentQIndex])
  // But wait, "Submit" flow implies we lock it after answering?
  // Let's assume standard mode: user selects -> clicks Submit -> sees result -> clicks Next.

  const savedAns = userAnswers[currentQIndex];
  const isAnswered = savedAns !== -1;

  // Render Options
  q.options.forEach((optText, idx) => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.dataset.idx = idx;

    // Key letter A/B/C/D
    const keys = ["A", "B", "C", "D"];
    const key = keys[idx] || "?";
    btn.dataset.key = key;

    btn.innerHTML = `
      <div class="letter">${key}</div>
      <div class="text">${escapeHtml(optText)}</div>
    `;

    // Click handler
    if (!isAnswered) {
      btn.addEventListener("click", () => selectOption(idx));
    }

    // Visual State
    // If we already answered, we might want to show Right/Wrong colors immediately
    // IF we are revisiting a question.
    if (isAnswered) {
      // Logic for showing past results
      if (idx === q.correctIndex) {
        btn.classList.add("correct");
      } else if (idx === savedAns) {
        btn.classList.add("wrong");
      } else {
        btn.style.opacity = "0.5";
      }

      // Also restore feedback logic?
      // For simplicity, we only show full feedback flow on the "Submit" action
      // OR if we want persistent feedback when going back:
      if (teacherMode || isAnswered) {
        // Re-display explanation if we are in feedback state
        // (Simple version: just show stored explanation if desired)
      }
    }

    optionsGrid.appendChild(btn);
  });

  // Buttons State
  btnPrev.disabled = (currentQIndex === 0);

  if (isAnswered) {
    btnSubmit.disabled = true; // Cannot re-submit
    btnNext.disabled = false;

    // Show explanation again if answered?
    // Let's just show it if it was wrong + teacherMode, or just always correct logic.
    const isCorrect = (savedAns === q.correctIndex);
    showFeedback(isCorrect, q);

  } else {
    btnSubmit.disabled = true; // Wait for selection
    btnNext.disabled = true;   // Must submit first
  }
}

let selectedTempIndex = -1;

function selectOption(idx) {
  // Visual selection only
  selectedTempIndex = idx;

  const all = optionsGrid.querySelectorAll(".choice");
  all.forEach((el) => {
    el.classList.remove("selected");
    if (Number(el.dataset.idx) === idx) {
      el.classList.add("selected");
    }
  });

  btnSubmit.disabled = false;
}

function submitAnswer() {
  if (selectedTempIndex === -1) return;

  const q = quizQuestions[currentQIndex];

  // Lock answer
  userAnswers[currentQIndex] = selectedTempIndex;

  const isCorrect = (selectedTempIndex === q.correctIndex);
  if (isCorrect) {
    score++;
  }
  updateStats();

  // Highlight result
  const all = optionsGrid.querySelectorAll(".choice");
  all.forEach((el) => {
    const i = Number(el.dataset.idx);
    // Remove pointer events
    el.style.pointerEvents = "none";
    el.classList.remove("selected"); // remove blue outline

    if (i === q.correctIndex) {
      el.classList.add("correct"); // Green
    } else if (i === selectedTempIndex && !isCorrect) {
      el.classList.add("wrong");   // Red
    } else {
      el.style.opacity = "0.6";    // Fade others
    }
  });

  // Show Feedback
  showFeedback(isCorrect, q);

  // Enable Next
  btnSubmit.disabled = true;
  btnNext.disabled = false;
}

function showFeedback(isCorrect, q) {
  if (isCorrect) {
    feedbackBox.textContent = "Correct!";
    feedbackBox.className = "feedback good";
    // If Teacher Mode, maybe show explanation anyway? 
    // Usually Teacher Mode implies showing explanation specifically on error, 
    // OR showing it always. Let's show it always if Teacher Mode is on.
    if (teacherMode && q.reason) {
      feedbackBox.innerHTML = `<strong>Correct!</strong><br/>${escapeHtml(q.reason)}`;
    }
  } else {
    feedbackBox.className = "feedback bad";
    if (teacherMode) {
      // TEACHER MODE: Show explanation and correct answer
      feedbackBox.innerHTML = `<strong>Incorrect.</strong><br/>${escapeHtml(q.reason || "No explanation provided.")}`;
    } else {
      feedbackBox.textContent = "Incorrect.";
    }
  }
}

function endQuiz() {
  stopTimer();
  quizScreen.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:center; min-height:100vh;">
      <div class="setupShell" style="text-align:center;">
        <div class="setupCard">
          <div class="setupHeader" style="justify-content:center;">
             <h1>Quiz Completed</h1>
          </div>
          <div class="setupBody" style="padding:40px;">
             <h2>Your Score: ${score} / ${quizQuestions.length}</h2>
             <p>Time: ${timerText.textContent}</p>
             <button class="btn primary" onclick="location.reload()">Home</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* =========================================
   HELPERS
   ========================================= */
function setSetupMessage(msg, isError = false) {
  setupMsg.textContent = msg;
  setupMsg.style.color = isError ? "var(--d)" : "var(--muted)";
}

function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateStats() {
  scoreText.textContent = score;
}

function startTimer() {
  updateTimerDisplay(); // initial
  timerInterval = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) {
      secondsLeft = 0;
      stopTimer();
      alert("Time's up!");
      endQuiz();
    }
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

function updateTimerDisplay() {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  timerText.textContent = `${m}:${s.toString().padStart(2, '0')}`;
}
