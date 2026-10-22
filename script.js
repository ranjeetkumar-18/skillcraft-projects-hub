/* 
  =============================================================
  SKILLCRAFT TECHNOLOGY · UNIFIED PROJECTS HUB
  100% Pure Vanilla JavaScript (No Node, No Libraries, No Backend)
  =============================================================
  Features:
  1. Live Theme Switcher with LocalStorage (Cyber, Emerald, Sunset, Ocean)
  2. Task 01: Responsive Navbar, Mobile Drawer & Active Scrollspy
  3. Task 02: High-Precision Stopwatch with Lap Analysis (Fastest/Slowest)
  4. Task 03: Tic-Tac-Toe with Player vs Player & Minimax AI + Confetti
  5. Task 04: LocalStorage To-Do App with Deadlines & Edit Modal
  =============================================================
*/

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     0. LIVE THEME SWITCHER (CYBER, EMERALD, SUNSET, OCEAN)
     ========================================================= */
  const themeMenuBtn = document.getElementById('theme-menu-btn');
  const themeDropdown = document.getElementById('theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  const currentThemeLabel = document.getElementById('current-theme-label');

  const themeLabels = {
    cyber: 'Cyber Neon',
    emerald: 'Emerald Aurora',
    sunset: 'Sunset Coral',
    ocean: 'Electric Azure'
  };

  // Load saved theme or default to 'cyber'
  const savedTheme = localStorage.getItem('sct_theme') || 'cyber';
  applyTheme(savedTheme);

  // Toggle theme menu dropdown
  if (themeMenuBtn && themeDropdown) {
    themeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!themeDropdown.contains(e.target) && !themeMenuBtn.contains(e.target)) {
        themeDropdown.classList.remove('open');
      }
    });

    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const selectedTheme = option.getAttribute('data-theme');
        applyTheme(selectedTheme);
        themeDropdown.classList.remove('open');
      });
    });
  }

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('sct_theme', themeName);
    
    if (currentThemeLabel && themeLabels[themeName]) {
      currentThemeLabel.textContent = themeLabels[themeName];
    }

    themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-theme') === themeName);
    });
  }


  /* =========================================================
     TASK 01: NAVBAR, MOBILE DRAWER & ACTIVE SCROLLSPY
     ========================================================= */
  const header = document.getElementById('navbar-header');
  const menuBtn = document.getElementById('menu-btn');
  const navLinksContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');

  // Change navbar appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile hamburger menu toggle
  if (menuBtn && navLinksContainer) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('active');
      menuBtn.classList.toggle('open', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile nav when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active Scrollspy via IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const isActive = link.getAttribute('data-sec') === id;
          link.classList.toggle('active', isActive);
          link.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));


  /* =========================================================
     TASK 02: HIGH-PRECISION STOPWATCH WITH LAP ANALYSIS
     ========================================================= */
  const swDisplay = document.getElementById('stopwatch-display');
  const swStartBtn = document.getElementById('stopwatch-start');
  const swStartText = document.getElementById('sw-start-text');
  const swStartIcon = document.getElementById('sw-start-icon');
  const swLapBtn = document.getElementById('stopwatch-lap');
  const swResetBtn = document.getElementById('stopwatch-reset');
  const swStatusDot = document.getElementById('sw-status-dot');
  const swStatusLabel = document.getElementById('sw-status-label');
  const lapSection = document.getElementById('lap-section');
  const lapList = document.getElementById('lap-list');

  let stopwatchTimer = null;
  let stopwatchStartTime = 0;
  let stopwatchElapsedTime = 0;
  let isStopwatchRunning = false;
  let laps = []; // stores { index, splitTime, totalTime }
  let lastLapTotalTime = 0;

  function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
  }

  function updateStopwatch() {
    const now = Date.now();
    const total = stopwatchElapsedTime + (now - stopwatchStartTime);
    swDisplay.textContent = formatTime(total);
  }

  function setStopwatchState(state) {
    if (state === 'running') {
      swStatusDot.className = 'pulse-dot running';
      swStatusLabel.textContent = 'Running';
      swStartText.textContent = 'Pause';
      swStartBtn.classList.add('btn-outline');
      swStartBtn.classList.remove('btn-primary');
      swStartIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      `;
      swLapBtn.disabled = false;
    } else if (state === 'paused') {
      swStatusDot.className = 'pulse-dot paused';
      swStatusLabel.textContent = 'Paused';
      swStartText.textContent = 'Resume';
      swStartBtn.classList.remove('btn-outline');
      swStartBtn.classList.add('btn-primary');
      swStartIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      `;
      swLapBtn.disabled = true;
    } else {
      // Ready
      swStatusDot.className = 'pulse-dot';
      swStatusLabel.textContent = 'Ready';
      swStartText.textContent = 'Start';
      swStartBtn.classList.remove('btn-outline');
      swStartBtn.classList.add('btn-primary');
      swStartIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      `;
      swLapBtn.disabled = true;
    }
  }

  // Start / Pause button click
  swStartBtn.addEventListener('click', () => {
    if (!isStopwatchRunning) {
      isStopwatchRunning = true;
      stopwatchStartTime = Date.now();
      stopwatchTimer = setInterval(updateStopwatch, 10);
      setStopwatchState('running');
    } else {
      isStopwatchRunning = false;
      clearInterval(stopwatchTimer);
      stopwatchElapsedTime += (Date.now() - stopwatchStartTime);
      setStopwatchState('paused');
    }
  });

  // Record Lap
  swLapBtn.addEventListener('click', () => {
    if (!isStopwatchRunning) return;

    const currentTotal = stopwatchElapsedTime + (Date.now() - stopwatchStartTime);
    const splitTime = currentTotal - lastLapTotalTime;
    lastLapTotalTime = currentTotal;

    const lapObj = {
      index: laps.length + 1,
      splitTime: splitTime,
      totalTime: currentTotal
    };

    laps.unshift(lapObj); // newest lap on top
    renderLaps();
  });

  // Reset Stopwatch
  swResetBtn.addEventListener('click', () => {
    isStopwatchRunning = false;
    clearInterval(stopwatchTimer);
    stopwatchElapsedTime = 0;
    lastLapTotalTime = 0;
    laps = [];

    swDisplay.textContent = '00:00:00.00';
    setStopwatchState('ready');
    lapList.innerHTML = '';
    lapSection.style.display = 'none';
  });

  function renderLaps() {
    lapSection.style.display = 'block';
    lapList.innerHTML = '';

    // Find fastest and slowest split if 2+ laps
    let fastestSplit = Infinity;
    let slowestSplit = -Infinity;

    if (laps.length >= 2) {
      laps.forEach(l => {
        if (l.splitTime < fastestSplit) fastestSplit = l.splitTime;
        if (l.splitTime > slowestSplit) slowestSplit = l.splitTime;
      });
    }

    laps.forEach(lap => {
      const li = document.createElement('li');
      li.className = 'lap-item';

      let badgeHtml = '';
      if (laps.length >= 2) {
        if (lap.splitTime === fastestSplit) {
          badgeHtml = '<span class="lap-badge fastest">Fastest</span>';
        } else if (lap.splitTime === slowestSplit) {
          badgeHtml = '<span class="lap-badge slowest">Slowest</span>';
        }
      }

      li.innerHTML = `
        <span class="lap-index">Lap ${lap.index} ${badgeHtml}</span>
        <span class="lap-split">+${formatTime(lap.splitTime)}</span>
        <span class="lap-total">${formatTime(lap.totalTime)}</span>
      `;
      lapList.appendChild(li);
    });
  }


  /* =========================================================
     TASK 03: TIC-TAC-TOE SMART GAME (PVP & MINIMAX AI)
     ========================================================= */
  const boardCells = document.querySelectorAll('.cell');
  const gameStatusText = document.getElementById('game-status');
  const turnDot = document.querySelector('.turn-dot');
  const resetGameBtn = document.getElementById('game-reset');
  const resetScoresBtn = document.getElementById('game-reset-scores');
  const gameModeSelect = document.getElementById('game-mode');
  const aiDifficultyWrapper = document.getElementById('ai-difficulty-wrapper');
  const aiDifficultySelect = document.getElementById('ai-difficulty');
  const playerOTitle = document.getElementById('player-o-title');
  const scoreXVal = document.getElementById('score-x');
  const scoreDrawsVal = document.getElementById('score-draws');
  const scoreOVal = document.getElementById('score-o');

  let gameState = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;
  let currentPlayer = 'X';
  let scores = { X: 0, O: 0, draws: 0 };

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Mode change handler
  gameModeSelect.addEventListener('change', () => {
    const isAi = gameModeSelect.value === 'ai';
    aiDifficultyWrapper.style.display = isAi ? 'block' : 'none';
    playerOTitle.textContent = isAi ? 'Computer AI' : 'Player O';
    resetGame();
  });

  aiDifficultySelect.addEventListener('change', resetGame);

  // Cell Click Handler
  boardCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const cellIndex = parseInt(cell.getAttribute('data-index'), 10);

      if (gameState[cellIndex] !== '' || !gameActive) return;

      makeMove(cellIndex, currentPlayer);

      const winningLine = checkWin(gameState, currentPlayer);
      if (winningLine) {
        endGame(currentPlayer, winningLine);
      } else if (checkDraw(gameState)) {
        endGame('draw');
      } else {
        // Toggle turn
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnUI();

        // AI turn trigger
        if (gameModeSelect.value === 'ai' && currentPlayer === 'O' && gameActive) {
          gameActive = false; // Lock board during AI calculation
          gameStatusText.textContent = 'Computer is thinking...';

          setTimeout(() => {
            triggerAIMove();
          }, 380);
        }
      }
    });
  });

  function makeMove(index, player) {
    gameState[index] = player;
    const cell = boardCells[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
  }

  function updateTurnUI() {
    const isAi = gameModeSelect.value === 'ai';
    const playerLabel = (currentPlayer === 'O' && isAi) ? 'Computer AI' : `Player ${currentPlayer}`;
    gameStatusText.textContent = `${playerLabel}'s turn`;

    if (turnDot) {
      turnDot.classList.toggle('o-turn', currentPlayer === 'O');
    }
  }

  function checkWin(board, player) {
    for (let combo of winningCombinations) {
      if (combo.every(idx => board[idx] === player)) {
        return combo;
      }
    }
    return null;
  }

  function checkDraw(board) {
    return board.every(cell => cell !== '');
  }

  function endGame(winner, winningLine = null) {
    gameActive = false;

    if (winner === 'draw') {
      gameStatusText.textContent = "🤝 It's a draw!";
      scores.draws++;
      scoreDrawsVal.textContent = scores.draws;
    } else {
      const isAi = gameModeSelect.value === 'ai';
      const winnerName = (winner === 'O' && isAi) ? 'Computer AI' : `Player ${winner}`;
      gameStatusText.textContent = `🎉 ${winnerName} wins!`;

      if (winner === 'X') {
        scores.X++;
        scoreXVal.textContent = scores.X;
      } else {
        scores.O++;
        scoreOVal.textContent = scores.O;
      }

      // Highlight winning 3 cells
      if (winningLine) {
        winningLine.forEach(idx => {
          boardCells[idx].classList.add('winner');
        });
      }

      // Launch celebratory confetti!
      launchConfetti();
    }
  }

  function triggerAIMove() {
    const difficulty = aiDifficultySelect.value;
    let bestIndex;

    if (difficulty === 'easy') {
      // Random available move
      const emptyCells = [];
      gameState.forEach((val, idx) => {
        if (val === '') emptyCells.push(idx);
      });
      bestIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else {
      // Unbeatable Minimax
      bestIndex = getBestMoveMinimax();
    }

    if (bestIndex !== undefined) {
      gameActive = true;
      makeMove(bestIndex, 'O');

      const winningLine = checkWin(gameState, 'O');
      if (winningLine) {
        endGame('O', winningLine);
      } else if (checkDraw(gameState)) {
        endGame('draw');
      } else {
        currentPlayer = 'X';
        updateTurnUI();
      }
    }
  }

  // Minimax Algorithm
  function getBestMoveMinimax() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
      if (gameState[i] === '') {
        gameState[i] = 'O';
        let score = minimax(gameState, 0, false);
        gameState[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(board, depth, isMaximizing) {
    if (checkWin(board, 'O')) return 10 - depth;
    if (checkWin(board, 'X')) return depth - 10;
    if (checkDraw(board)) return 0;

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = '';
          maxScore = Math.max(score, maxScore);
        }
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = '';
          minScore = Math.min(score, minScore);
        }
      }
      return minScore;
    }
  }

  function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    updateTurnUI();

    boardCells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'cell';
    });
  }

  resetGameBtn.addEventListener('click', resetGame);

  resetScoresBtn.addEventListener('click', () => {
    scores = { X: 0, O: 0, draws: 0 };
    scoreXVal.textContent = '0';
    scoreOVal.textContent = '0';
    scoreDrawsVal.textContent = '0';
    resetGame();
  });


  /* =========================================================
     CELEBRATION CONFETTI ENGINE (PURE VANILLA CANVAS)
     ========================================================= */
  const confettiCanvas = document.getElementById('confetti-canvas');
  const ctx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function launchConfetti() {
    cancelAnimationFrame(confettiAnimationId);
    confettiParticles = [];
    const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

    for (let i = 0; i < 90; i++) {
      confettiParticles.push({
        x: confettiCanvas.width / 2 + (Math.random() * 200 - 100),
        y: confettiCanvas.height / 2 + (Math.random() * 100 - 50),
        w: Math.random() * 9 + 5,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    animateConfetti();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.009;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      if (p.opacity <= 0 || p.y > confettiCanvas.height) {
        confettiParticles.splice(idx, 1);
      }
    });

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }


  /* =========================================================
     TASK 04: TO-DO WEB APPLICATION (LOCALSTORAGE + DEADLINES)
     ========================================================= */
  const todoForm = document.getElementById('todo-form');
  const todoTitleInput = document.getElementById('todo-title');
  const todoDateTimeInput = document.getElementById('todo-datetime');
  const todoList = document.getElementById('todo-list');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const countAll = document.getElementById('count-all');
  const countActive = document.getElementById('count-active');
  const countCompleted = document.getElementById('count-completed');

  // Edit Modal elements
  const editModal = document.getElementById('edit-modal');
  const editTaskForm = document.getElementById('edit-task-form');
  const editTaskTitle = document.getElementById('edit-task-title');
  const editTaskDatetime = document.getElementById('edit-task-datetime');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  let currentEditingTaskId = null;

  // Retrieve tasks from LocalStorage
  let tasks = JSON.parse(localStorage.getItem('sct_tasks')) || [];
  let currentFilter = 'all';

  function saveTasks() {
    localStorage.setItem('sct_tasks', JSON.stringify(tasks));
  }

  function updateCounts() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;

    countAll.textContent = total;
    countActive.textContent = active;
    countCompleted.textContent = completed;

    clearCompletedBtn.style.display = completed > 0 ? 'inline-block' : 'none';
  }

  function renderTasks() {
    updateCounts();
    todoList.innerHTML = '';

    let filtered = tasks;
    if (currentFilter === 'active') {
      filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      filtered = tasks.filter(t => t.completed);
    }

    // Sort: uncompleted first by deadline date, then completed
    filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (!a.datetime) return 1;
      if (!b.datetime) return -1;
      return new Date(a.datetime) - new Date(b.datetime);
    });

    if (filtered.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'empty-state';
      emptyLi.innerHTML = `
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <p>No tasks found</p>
        <span>Add a task above or select another filter view.</span>
      `;
      todoList.appendChild(emptyLi);
      return;
    }

    const now = new Date();

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;

      // Deadline formatting & Overdue/Today badges
      let dateMetaHtml = '';
      if (task.datetime) {
        const dueDate = new Date(task.datetime);
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const dateStr = dueDate.toLocaleDateString('en-US', options);

        let badgeTag = '';
        if (!task.completed) {
          if (dueDate < now) {
            badgeTag = '<span class="tag-badge tag-overdue">Overdue</span>';
          } else if (dueDate.toDateString() === now.toDateString()) {
            badgeTag = '<span class="tag-badge tag-today">Due Today</span>';
          }
        }

        dateMetaHtml = `
          <div class="todo-meta">
            <span class="todo-datetime">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              ${dateStr}
            </span>
            ${badgeTag}
          </div>
        `;
      }

      li.innerHTML = `
        <div class="todo-left">
          <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" aria-label="Toggle task complete">
          <div class="todo-details">
            <span class="todo-title">${escapeHTML(task.title)}</span>
            ${dateMetaHtml}
          </div>
        </div>
        <div class="todo-actions">
          <button class="action-btn edit-btn" data-id="${task.id}" title="Edit task" aria-label="Edit task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="action-btn delete-btn" data-id="${task.id}" title="Delete task" aria-label="Delete task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;

      // Checkbox listener
      li.querySelector('.todo-checkbox').addEventListener('change', (e) => {
        toggleTask(task.id);
      });

      // Edit listener
      li.querySelector('.edit-btn').addEventListener('click', () => {
        openEditModal(task);
      });

      // Delete listener
      li.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTask(task.id);
      });

      todoList.appendChild(li);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
  }

  // Add Task
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = todoTitleInput.value.trim();
    const datetime = todoDateTimeInput.value;

    if (!title) return;

    const newTask = {
      id: Date.now(),
      title: title,
      datetime: datetime || null,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    todoTitleInput.value = '';
    todoDateTimeInput.value = '';
  });

  // Toggle Completion
  function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
  }

  // Delete Task
  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }

  // Clear Completed
  clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  });

  // Filter switching
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.getAttribute('data-filter');
      renderTasks();
    });
  });

  // Edit Modal logic
  function openEditModal(task) {
    currentEditingTaskId = task.id;
    editTaskTitle.value = task.title;
    editTaskDatetime.value = task.datetime || '';
    editModal.style.display = 'flex';
    editModal.setAttribute('aria-hidden', 'false');
    editTaskTitle.focus();
  }

  function closeEditModal() {
    editModal.style.display = 'none';
    editModal.setAttribute('aria-hidden', 'true');
    currentEditingTaskId = null;
  }

  modalCloseBtn.addEventListener('click', closeEditModal);
  modalCancelBtn.addEventListener('click', closeEditModal);

  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editModal.style.display === 'flex') {
      closeEditModal();
    }
  });

  editTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentEditingTaskId) return;

    const newTitle = editTaskTitle.value.trim();
    if (!newTitle) return;

    tasks = tasks.map(t => {
      if (t.id === currentEditingTaskId) {
        return {
          ...t,
          title: newTitle,
          datetime: editTaskDatetime.value || null
        };
      }
      return t;
    });

    saveTasks();
    renderTasks();
    closeEditModal();
  });

  // Initial render
  renderTasks();

});
