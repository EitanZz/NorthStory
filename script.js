// --- Users & Posts ---
const users = [
  { name: "Alice", avatar: "👩‍💼", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Bob", avatar: "👨‍🦰", image: "https://randomuser.me/api/portraits/men/22.jpg" },
  { name: "Charlie", avatar: "👨‍🦰", image: "https://randomuser.me/api/portraits/men/31.jpg" },
  { name: "Dana", avatar: "👩‍💼", image: "https://randomuser.me/api/portraits/women/55.jpg" },
];

let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentFilter = "all";
const postsContainer = document.getElementById("posts");

function setFeedFilter(mode) {
  currentFilter = mode;
  document.getElementById("posts").classList.remove("hidden");
  document.getElementById("postInputBox").classList.remove("hidden");
  document.getElementById("gameZone").classList.add("hidden");
  document.getElementById("quizZone").classList.add("hidden");
  document.getElementById("studyGroupZone").classList.add("hidden");
  document.getElementById("journalZone").classList.add("hidden");
  renderPosts();
  highlightActiveButton();
  applyModeTheme();
}

function highlightActiveButton() {
  ["all", "study", "fun"].forEach(mode => {
    const btn = document.getElementById(`btn-${mode}`);
    if (btn) {
      const isActive = mode === currentFilter;
      btn.classList.toggle("bg-blue-500", isActive);
      btn.classList.toggle("text-white", isActive);
      btn.classList.toggle("bg-blue-100", !isActive && mode === "study");
      btn.classList.toggle("bg-pink-100", !isActive && mode === "fun");
      btn.classList.toggle("bg-gray-200", !isActive && mode === "all");
      btn.classList.toggle("text-gray-800", !isActive);
    }
  });
}

function applyModeTheme() {
  const body = document.body;
  body.classList.remove("bg-gray-100", "bg-blue-50", "bg-pink-50");

  if (currentFilter === "study") {
    body.classList.add("bg-blue-50");
  } else if (currentFilter === "fun") {
    body.classList.add("bg-pink-50");
  } else {
    body.classList.add("bg-gray-100");
  }
}

function renderPosts() {
  postsContainer.innerHTML = "";

  posts
    .filter(post => currentFilter === "all" || post.category === currentFilter)
    .forEach((post, index) => {
      const postEl = document.createElement("div");
      postEl.className = "bg-white p-4 rounded-xl shadow";

      postEl.innerHTML = `
        <div class="flex items-center mb-2">
          <img src="${post.image}" alt="${post.user}" class="w-10 h-10 rounded-full object-cover" />
          <div class="ml-2">
            <div class="font-semibold text-gray-800">${post.user}</div>
            <div class="text-xs text-gray-500">${post.time} · <span class="italic">${post.category}</span></div>
          </div>
        </div>
        <div class="text-gray-700 mb-2">${post.content}</div>
        <div class="text-sm text-gray-600 space-x-4 mb-2">
          <button class="hover:text-blue-500" onclick="likePost(${index})">👍 Like (${post.likes})</button>
          <button class="hover:text-blue-500" onclick="toggleComments(${index})">💬 Comment</button>
          <button class="hover:text-blue-500">↪️ Share</button>
        </div>
        <div id="comments-${index}" class="hidden space-y-2 mt-2">
          <input placeholder="Write a comment..." class="w-full p-2 border rounded comment-input" data-index="${index}" />
          <div class="text-sm text-gray-700">${post.comments.join('<br>')}</div>
        </div>
      `;

      postsContainer.appendChild(postEl);
    });

  document.querySelectorAll('.comment-input').forEach(input => {
    input.addEventListener('keydown', function (e) {
      if (e.key === "Enter") {
        const i = this.dataset.index;
        posts[i].comments.push(this.value);
        this.value = "";
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
        toggleComments(i);
      }
    });
  });
}

function toggleComments(index) {
  const el = document.getElementById(`comments-${index}`);
  if (el) el.classList.toggle("hidden");
}

function likePost(index) {
  posts[index].likes++;
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
  showToast("You liked a post!");
}

function sharePost() {
  const input = document.getElementById("postInput");
  const category = document.getElementById("postCategory").value;
  const content = input.value.trim();

  if (!content) return;

  const user = users[Math.floor(Math.random() * users.length)];

  const newPost = {
    user: user.name,
    avatar: user.avatar,
    image: user.image,
    content,
    time: new Date().toLocaleString(),
    comments: [],
    category,
    likes: 0
  };

  posts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));
  input.value = "";
  setFeedFilter(category);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

function openGameZone() {
  document.getElementById("posts").classList.add("hidden");
  document.getElementById("postInputBox").classList.add("hidden");
  document.getElementById("gameZone").classList.remove("hidden");
  document.getElementById("studyGroupZone").classList.add("hidden");
  document.getElementById("journalZone").classList.add("hidden");
  switchGame();
}

function switchGame() {
  const selectedGame = document.getElementById("gameSelect").value;

  document.getElementById("ticTacToeGame").classList.add("hidden");
  document.getElementById("quizZone").classList.add("hidden");
  document.getElementById("otherGamePlaceholder").classList.add("hidden");

  if (selectedGame === "ticTacToe") {
    document.getElementById("ticTacToeGame").classList.remove("hidden");
  } else if (selectedGame === "quiz") {
    document.getElementById("quizZone").classList.remove("hidden");
    resetQuiz();
  } else {
    document.getElementById("otherGamePlaceholder").classList.remove("hidden");
  }
}

//tic Tac Toe
const gameBoard = document.getElementById("gameBoard");
const gameStatus = document.getElementById("gameStatus");
let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "❌";
let gameActive = true;

function handleCellClick(index) {
  if (!gameActive || gameState[index]) return;

  gameState[index] = currentPlayer;
  renderBoard();

  if (checkWin()) {
    gameStatus.textContent = `${currentPlayer} wins! 🎉`;
    gameActive = false;
  } else if (!gameState.includes("")) {
    gameStatus.textContent = "It's a draw! 🤝";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "❌" ? "⭕" : "❌";
  }
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => gameState[i] === currentPlayer)
  );
}

function renderBoard() {
  gameBoard.innerHTML = "";
  gameState.forEach((cell, index) => {
    const btn = document.createElement("button");
    btn.className = "w-20 h-20 text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded";
    btn.textContent = cell;
    btn.onclick = () => handleCellClick(index);
    gameBoard.appendChild(btn);
  });
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "❌";
  gameActive = true;
  gameStatus.textContent = "";
  renderBoard();
}

//quiz game
const quizQuestions = [
  {
    question: "What does 'HTML' stand for?",
    options: ["HyperText Markup Language", "HotMail", "How To Make Links", "HighTech Media Language"],
    answer: 0
  },
  {
    question: "Which of the following is a programming language?",
    options: ["HTTP", "Python", "HTML", "URL"],
    answer: 1
  },
  {
    question: "What does 'CPU' stand for?",
    options: ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Control Panel Utility"],
    answer: 2
  },
  {
    question: "Which is not a coding language?",
    options: ["CSS", "Java", "Excel", "JavaScript"],
    answer: 2
  },
  {
    question: "What does CSS do?",
    options: ["Defines logic", "Styles the page", "Handles data", "Draws graphics"],
    answer: 1
  }
];

let currentQuizIndex = 0;
let quizScore = 0;

function showQuiz() {
  document.getElementById("quizZone").classList.remove("hidden");
  loadQuestion();
}

function hideQuiz() {
  document.getElementById("quizZone").classList.add("hidden");
}

function loadQuestion() {
  const q = quizQuestions[currentQuizIndex];
  document.getElementById("quizQuestion").textContent = q.question;
  const optionsContainer = document.getElementById("quizOptions");
  optionsContainer.innerHTML = "";

  q.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-left";
    btn.textContent = option;
    btn.onclick = () => checkAnswer(i);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("nextBtn").classList.add("hidden");
}

function checkAnswer(selectedIndex) {
  const q = quizQuestions[currentQuizIndex];
  const feedback = document.getElementById("quizFeedback");

  if (selectedIndex === q.answer) {
    feedback.textContent = "✅ Correct!";
    quizScore++;
  } else {
    feedback.textContent = `❌ Incorrect. The correct answer is: ${q.options[q.answer]}`;
  }

  document.querySelectorAll("#quizOptions button").forEach(btn => btn.disabled = true);
  document.getElementById("nextBtn").classList.remove("hidden");
}

function nextQuestion() {
  currentQuizIndex++;
  if (currentQuizIndex < quizQuestions.length) {
    loadQuestion();
  } else {
    document.getElementById("quizQuestion").textContent = `🎉 You scored ${quizScore}/${quizQuestions.length}!`;
    document.getElementById("quizOptions").innerHTML = "";
    document.getElementById("nextBtn").classList.add("hidden");
  }
}

function resetQuiz() {
  currentQuizIndex = 0;
  quizScore = 0;
  loadQuestion();
}

//study groups
function toggleStudyGroups() {
  document.getElementById("studyGroupsMenu").classList.toggle("hidden");
}

function openStudyGroup(topic) {
  document.getElementById("posts").classList.add("hidden");
  document.getElementById("postInputBox").classList.add("hidden");
  document.getElementById("gameZone").classList.add("hidden");
  document.getElementById("quizZone").classList.add("hidden");
  document.getElementById("journalZone").classList.add("hidden");

  let zone = document.getElementById("studyGroupZone");
  zone.classList.remove("hidden");
  zone.innerHTML = `
    <h2 class="text-lg font-semibold mb-4">👥 Study Group: ${topic}</h2>
    <div class="bg-gray-100 p-4 rounded-lg shadow">
      <p class="text-gray-700 text-sm mb-2">Chat coming soon...</p>
      <textarea class="w-full p-2 border rounded mb-2" placeholder="Write a message..." disabled></textarea>
      <button class="bg-blue-500 text-white px-4 py-2 rounded" disabled>Send</button>
    </div>
  `;
}
function toggleStudyGroups() {
  const menu = document.getElementById("studyGroupsMenu");
  menu.classList.toggle("hidden");
}

const studyGroupMessages = {
  Chemistry: [
    "למישהו יש טריק לזכור בעל פה את הטבלה המחזורית?"  
  ],
  Math: [
    "שונא אינטגרלים",
    "מישהו מכיר שיטה טובה לפתור משוואות ריבועיות?",
    "!מבולבל? תמיד יש את כלל לופיטל "
  ],
  Programming: [
    "?😅 מי עוד מתקשה עם רקורסיה",
    "הצלחתי לעשות אפליקציית נוטס!",
    "?אני עושה קורס בלימוד מכונה במה עדיף להשתמש בפייתון או סי"
  ]
};

function openStudyGroup(topic) {
  document.getElementById("posts").classList.add("hidden");
  document.getElementById("postInputBox").classList.add("hidden");
  document.getElementById("gameZone").classList.add("hidden");
  document.getElementById("quizZone").classList.add("hidden");
  document.getElementById("journalZone").classList.add("hidden");

  const zone = document.getElementById("studyGroupZone");
  zone.classList.remove("hidden");
  let messagesHtml = studyGroupMessages[topic].map(msg => `<div class='p-2 bg-white rounded shadow mb-2 text-sm'>${msg}</div>`).join("");

  zone.innerHTML = `
    <h2 class="text-lg font-semibold mb-4">👥 Study Group: ${topic}</h2>
    <div class="bg-gray-100 p-4 rounded-lg shadow space-y-2">
      ${messagesHtml}
      <textarea class="w-full p-2 border rounded" placeholder="Write a message..." disabled></textarea>
      <button class="bg-blue-500 text-white px-4 py-2 rounded" disabled>Send</button>
    </div>
  `;
}

function openJournal() {
  document.getElementById("posts").classList.add("hidden");
  document.getElementById("postInputBox").classList.add("hidden");
  document.getElementById("gameZone").classList.add("hidden");
  document.getElementById("quizZone").classList.add("hidden");
  document.getElementById("studyGroupZone").classList.add("hidden");

  const zone = document.getElementById("journalZone");
  zone.classList.remove("hidden");
  const savedEntry = localStorage.getItem("journalEntry") || "";
  zone.innerHTML = `
    <h2 class="text-lg font-semibold mb-4">✍️ Anonymous Journal</h2>
    <textarea id="journalInput" class="w-full p-4 border rounded h-48">${savedEntry}</textarea>
    <button onclick="saveJournalEntry()" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Save Entry</button>
  `;
}

function saveJournalEntry() {
  const entry = document.getElementById("journalInput").value;
  localStorage.setItem("journalEntry", entry);
  showToast("Journal entry saved locally!");
}


// Init
renderBoard();
renderPosts();
highlightActiveButton();
applyModeTheme();