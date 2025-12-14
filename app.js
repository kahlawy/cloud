/* Virtualization Exam (100 MCQs) - Bootstrap 5 UI
   Teacher mode:
   - OFF: show only status (Correct/Wrong/Unanswered)
   - ON : show correct answer + reason (and your choice)
*/

const QUESTIONS = [
  // ===== STORAGE (1-25) =====
  {id:1, topic:"STORAGE", difficulty:"EASY", q:"Which storage type is directly attached to a physical server and typically not shared over the network?", options:["NAS","SAN","Local storage","IP SAN"], answerIndex:2, reason:"Local storage is directly attached to the host and not inherently shared."},
  {id:2, topic:"STORAGE", difficulty:"EASY", q:"Which option is MOST associated with file-level shared access?", options:["SAN","NAS","Fibre Channel","Block LUN"], answerIndex:1, reason:"NAS provides file-level access (e.g., NFS/SMB) and shared directories."},
  {id:3, topic:"STORAGE", difficulty:"EASY", q:"Which approach is typically block-based?", options:["NAS","SAN","SMB share","NFS export"], answerIndex:1, reason:"SAN commonly exposes block devices (LUNs) to hosts."},
  {id:4, topic:"STORAGE", difficulty:"MEDIUM", q:"Which statement about a datastore is NOT correct?", options:["A datastore is a manageable logical storage unit","A datastore corresponds to a storage device/logical unit","A datastore carries VM services such as disk creation","A datastore can contain multiple storage devices"], answerIndex:3, reason:"In the taught model, a datastore maps to a single logical unit/device, not multiple devices inside it."},
  {id:5, topic:"STORAGE", difficulty:"MEDIUM", q:"Thin provisioning primarily helps by:", options:["Encrypting VM disks","Allocating capacity on-demand to improve utilization","Increasing CPU scheduling fairness","Reducing broadcast domains"], answerIndex:1, reason:"Thin provisioning delays physical space allocation until data is actually written."},
  {id:6, topic:"STORAGE", difficulty:"MEDIUM", q:"Which is a typical advantage of shared storage in virtualization clusters?", options:["VM files are accessible only to one host","Supports features like live migration/HA by shared access","Eliminates the need for hypervisors","Prevents VLAN tagging"], answerIndex:1, reason:"Shared VM disk visibility across hosts enables cluster features like migration/HA."},
  {id:7, topic:"STORAGE", difficulty:"MEDIUM", q:"NAS commonly provides a shared directory via:", options:["NFS/SMB","FCoE frames","PCIe pass-through","MAC learning"], answerIndex:0, reason:"NAS exposes shared folders, typically over NFS or SMB."},
  {id:8, topic:"STORAGE", difficulty:"HARD", q:"During datastore migration, what is the critical safety condition?", options:["Datastore must be empty","All hosts must be powered off","No VM files are actively in use during the migration","Datastore must be local storage"], answerIndex:2, reason:"Active use of VM files risks inconsistency/corruption during migration."},
  {id:9, topic:"STORAGE", difficulty:"MEDIUM", q:"Which is MOST cost-effective for SAN over standard Ethernet/TCP-IP infrastructure?", options:["Fibre Channel","iSCSI","SAS backplane","USB-attached storage"], answerIndex:1, reason:"iSCSI uses Ethernet and TCP/IP, avoiding specialized Fibre Channel fabrics."},
  {id:10, topic:"STORAGE", difficulty:"EASY", q:"Which feature lets you revert a VM disk state to a previous point in time?", options:["Template","Snapshot","Trunk link","VLAN"], answerIndex:1, reason:"Snapshots capture point-in-time VM state for rollback."},

  // (… لتقليل طول الرسالة: أكمل بقية الأسئلة بنفس قائمة الـ 100 التي عندك)
  // IMPORTANT: ضع هنا بقية الأسئلة حتى Q100.
];

// ---------- DOM ----------
const quizEl = document.getElementById("quiz");
const submitBtn = document.getElementById("btnSubmit");
const retryBtn = document.getElementById("btnRetry");
const expandBtn = document.getElementById("btnExpandAll");
const collapseBtn = document.getElementById("btnCollapseAll");

const resultBox = document.getElementById("resultBox");
const answeredPill = document.getElementById("answeredPill");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const difficultySelect = document.getElementById("difficultySelect");

const timerToggle = document.getElementById("timerToggle");
const timerPill = document.getElementById("timerPill");

const teacherToggle = document.getElementById("teacherToggle");
const TEACHER_KEY = "vx_teacher_mode";

let userAnswers = new Map(); // qid -> answerIndex
let locked = false;

// teacher mode (persist)
let teacherMode = localStorage.getItem(TEACHER_KEY) === "1";
teacherToggle.checked = teacherMode;
teacherToggle.addEventListener("change", () => {
  if (locked) { teacherToggle.checked = teacherMode; return; }
  teacherMode = teacherToggle.checked;
  localStorage.setItem(TEACHER_KEY, teacherMode ? "1" : "0");
});

// timer
let timerInterval = null;
let secondsLeft = 0;

function formatTime(sec){
  const m = String(Math.floor(sec/60)).padStart(2,"0");
  const s = String(sec%60).padStart(2,"0");
  return `${m}:${s}`;
}

function setTimer(enabled){
  clearInterval(timerInterval);
  timerInterval = null;

  if(!enabled){
    secondsLeft = 0;
    timerPill.textContent = "Timer: Off";
    return;
  }

  secondsLeft = 60 * 60;
  timerPill.textContent = `Timer: ${formatTime(secondsLeft)}`;

  timerInterval = setInterval(() => {
    secondsLeft--;
    timerPill.textContent = `Timer: ${formatTime(secondsLeft)}`;
    if(secondsLeft <= 0){
      clearInterval(timerInterval);
      timerInterval = null;
      timerPill.textContent = "Timer: 00:00";
      gradeQuiz(true);
    }
  }, 1000);
}

timerToggle.addEventListener("change", () => {
  if(locked) { timerToggle.checked = false; return; }
  setTimer(timerToggle.checked);
});

// ---------- Filtering ----------
function getFilteredQuestions(){
  const term = (searchInput.value || "").trim().toLowerCase();
  const topic = filterSelect.value;
  const diff = difficultySelect.value;

  return QUESTIONS.filter(q=>{
    const matchTerm =
      !term ||
      q.q.toLowerCase().includes(term) ||
      q.options.some(o => o.toLowerCase().includes(term)) ||
      q.reason.toLowerCase().includes(term);

    const matchTopic = (topic === "ALL") || (q.topic === topic);
    const matchDiff = (diff === "ALL") || (q.difficulty === diff);

    return matchTerm && matchTopic && matchDiff;
  });
}

function updateAnsweredPill(){
  answeredPill.textContent = `Answered: ${userAnswers.size} / ${QUESTIONS.length}`;
}

// ---------- Render ----------
function badgeClassForTopic(topic){
  switch(topic){
    case "STORAGE": return "text-bg-info";
    case "NETWORK": return "text-bg-warning";
    case "VMS": return "text-bg-primary";
    case "KVM": return "text-bg-success";
    case "XEN": return "text-bg-secondary";
    default: return "text-bg-dark";
  }
}

function badgeClassForDiff(d){
  if(d==="EASY") return "text-bg-success";
  if(d==="MEDIUM") return "text-bg-warning";
  if(d==="HARD") return "text-bg-danger";
  return "text-bg-dark";
}

function render(){
  const list = getFilteredQuestions();
  quizEl.innerHTML = "";

  if(list.length === 0){
    quizEl.innerHTML = `
      <div class="card card-glass shadow-soft">
        <div class="card-body">
          <div class="text-white-50">No questions match your filters.</div>
        </div>
      </div>
    `;
    return;
  }

  for(const q of list){
    const chosen = userAnswers.get(q.id);

    const card = document.createElement("div");
    card.className = "card card-glass shadow-soft question-card";
    card.dataset.qid = String(q.id);

    const header = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start gap-3">
          <div class="flex-grow-1">
            <div class="d-flex flex-wrap gap-2 mb-2">
              <span class="badge rounded-pill text-bg-dark border border-white border-opacity-10 mono-badge">Q${q.id}</span>
              <span class="badge rounded-pill ${badgeClassForTopic(q.topic)}">${q.topic}</span>
              <span class="badge rounded-pill ${badgeClassForDiff(q.difficulty)}">${q.difficulty}</span>
            </div>
            <h5 class="mb-0">${escapeHtml(q.q)}</h5>
          </div>
        </div>

        <div class="mt-3 vstack gap-2" data-options></div>

        <details class="mt-3">
          <summary class="small-muted">Explanation (shown after submit)</summary>
          <div class="feedback-box mt-2" data-feedback>
            <span class="text-white-50">Submit to see feedback.</span>
          </div>
        </details>
      </div>
    `;
    card.innerHTML = header;

    const optionsHost = card.querySelector("[data-options]");
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn option-btn text-white d-flex align-items-start gap-2 py-3 px-3";
      if(chosen === idx) btn.classList.add("selected");

      btn.innerHTML = `
        <input class="form-check-input mt-1" type="radio" name="q_${q.id}" ${chosen===idx ? "checked" : ""} ${locked ? "disabled" : ""} />
        <div class="text-start">${escapeHtml(opt)}</div>
      `;

      btn.addEventListener("click", () => {
        if(locked) return;
        userAnswers.set(q.id, idx);
        updateAnsweredPill();

        // update selected styles within this card
        optionsHost.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        // keep radio visually consistent
        optionsHost.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        btn.querySelector('input[type="radio"]').checked = true;
      });

      optionsHost.appendChild(btn);
    });

    quizEl.appendChild(card);
  }

  updateAnsweredPill();
}

// ---------- Grading ----------
function teacherExtras(q, chosenIndex){
  if(!teacherMode) return "";
  const chosenText = (chosenIndex === undefined)
    ? ""
    : `<div><strong>Your answer:</strong> ${escapeHtml(q.options[chosenIndex])}</div>`;

  return `
    ${chosenText}
    <div><strong>Correct:</strong> ${escapeHtml(q.options[q.answerIndex])}</div>
    <div class="mt-1"><strong>Reason:</strong> ${escapeHtml(q.reason)}</div>
  `;
}

function gradeQuiz(auto=false){
  if(locked) return;
  locked = true;

  submitBtn.disabled = true;
  retryBtn.disabled = false;

  searchInput.disabled = true;
  filterSelect.disabled = true;
  difficultySelect.disabled = true;
  timerToggle.disabled = true;
  teacherToggle.disabled = true;

  clearInterval(timerInterval);
  timerInterval = null;

  let correct=0, wrong=0, unanswered=0;

  for(const q of QUESTIONS){
    const chosen = userAnswers.get(q.id);
    if(chosen === undefined){ unanswered++; continue; }
    if(chosen === q.answerIndex) correct++;
    else wrong++;
  }

  const total = QUESTIONS.length;
  const percent = Math.round((correct/total)*100);

  resultBox.classList.remove("d-none");
  resultBox.className = "alert alert-dark border border-white border-opacity-10 mt-3 mb-0";
  resultBox.innerHTML = `
    <div class="d-flex flex-wrap gap-2 align-items-center">
      <span class="badge rounded-pill text-bg-success">Correct: ${correct}</span>
      <span class="badge rounded-pill text-bg-danger">Wrong: ${wrong}</span>
      <span class="badge rounded-pill text-bg-secondary">Unanswered: ${unanswered}</span>
      <span class="badge rounded-pill text-bg-primary">Score: ${percent}%</span>
      <span class="ms-auto text-white-50 small">${auto ? "Time is up. Auto-submitted." : "Submitted successfully."}</span>
    </div>
    ${teacherMode ? `<div class="text-white-50 small mt-2">Teacher mode ON: correct answers and reasons are shown per question.</div>` : `<div class="text-white-50 small mt-2">Student mode: only correctness is shown.</div>`}
  `;

  // Update visible cards feedback
  document.querySelectorAll(".card[data-qid]").forEach(card => {
    const qid = Number(card.dataset.qid);
    const q = QUESTIONS.find(x => x.id === qid);
    if(!q) return;

    const chosen = userAnswers.get(q.id);
    const feedbackEl = card.querySelector("[data-feedback]");
    const detailsEl = card.querySelector("details");

    const isCorrect = chosen !== undefined && chosen === q.answerIndex;

    if(chosen === undefined){
      feedbackEl.classList.remove("feedback-correct","feedback-wrong");
      feedbackEl.classList.add("feedback-wrong");
      feedbackEl.innerHTML = `
        <div><strong>Status:</strong> <span class="text-danger fw-semibold">Unanswered</span></div>
        ${teacherExtras(q, chosen)}
      `;
    } else if(isCorrect){
      feedbackEl.classList.remove("feedback-correct","feedback-wrong");
      feedbackEl.classList.add("feedback-correct");
      feedbackEl.innerHTML = `
        <div><strong>Status:</strong> <span class="text-success fw-semibold">Correct</span></div>
        ${teacherExtras(q, chosen)}
      `;
    } else {
      feedbackEl.classList.remove("feedback-correct","feedback-wrong");
      feedbackEl.classList.add("feedback-wrong");
      feedbackEl.innerHTML = `
        <div><strong>Status:</strong> <span class="text-danger fw-semibold">Wrong</span></div>
        ${teacherExtras(q, chosen)}
      `;
    }

    detailsEl.open = true;

    // Disable option buttons
    card.querySelectorAll(".option-btn").forEach(b => {
      b.setAttribute("disabled","disabled");
      b.classList.add("opacity-75");
    });
    card.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);
  });
}

function resetQuiz(){
  locked = false;
  userAnswers = new Map();

  submitBtn.disabled = false;
  retryBtn.disabled = true;

  searchInput.disabled = false;
  filterSelect.disabled = false;
  difficultySelect.disabled = false;
  timerToggle.disabled = false;
  teacherToggle.disabled = false;

  resultBox.classList.add("d-none");
  resultBox.innerHTML = "";

  timerToggle.checked = false;
  setTimer(false);

  render();
}

function expandAll(){
  document.querySelectorAll("details").forEach(d => d.open = true);
}
function collapseAll(){
  document.querySelectorAll("details").forEach(d => d.open = false);
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// Events
submitBtn.addEventListener("click", () => gradeQuiz(false));
retryBtn.addEventListener("click", resetQuiz);
expandBtn.addEventListener("click", expandAll);
collapseBtn.addEventListener("click", collapseAll);

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);
difficultySelect.addEventListener("change", render);

// Init
updateAnsweredPill();
render();
