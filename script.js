// Timer variables
let timer;
let isRunning = false;
let timeLeft = 25 * 60;
let currentPhase = "work"; // Track work or break phase

const timeDisplay = document.getElementById("time");
const toggleButton = document.getElementById("toggle");
const resetButton = document.getElementById("reset");
const workInput = document.getElementById("work-time");
const breakInput = document.getElementById("break-time");
const applyButton = document.getElementById("apply-intervals");
const categoryDropdown = document.getElementById("category");

const sessionData = JSON.parse(localStorage.getItem("sessions")) || [];

// Default intervals
let workTime = 25 * 60;
let breakTime = 5 * 60;

// Update timer display
function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
}

// Format time into MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Start timer
function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      toggleButton.textContent = "Start";
      isRunning = false;

      // Notify user
      new Notification("Pomodoro Timer", {
        body: currentPhase === "work" ? "Time for a break!" : "Time to focus again!",
      });

      // Toggle between work and break phase
      currentPhase = currentPhase === "work" ? "break" : "work";
      timeLeft = currentPhase === "work" ? workTime : breakTime;

      // Automatically start the next session
      startTimer();
    }
  }, 1000);
}

// Toggle start/pause
toggleButton.addEventListener("click", () => {
  if (!isRunning) {
    startTimer();
    toggleButton.textContent = "Pause";
  } else {
    clearInterval(timer);
    toggleButton.textContent = "Start";
  }
  isRunning = !isRunning;
});

// Reset timer
resetButton.addEventListener("click", () => {
  clearInterval(timer);
  timeLeft = workTime;
  updateDisplay();
  toggleButton.textContent = "Start";
  isRunning = false;
});

// Apply custom intervals
applyButton.addEventListener("click", () => {
  workTime = parseInt(workInput.value) * 60;
  breakTime = parseInt(breakInput.value) * 60;
  timeLeft = workTime;
  updateDisplay();
  alert("Pomodoro intervals updated!");
});

// Adjust timer based on task category
categoryDropdown.addEventListener("change", () => {
  const selectedCategory = categoryDropdown.value;

  if (selectedCategory === "Work") {
    workTime = 25 * 60;
  } else if (selectedCategory === "Study") {
    workTime = 30 * 60;
  } else if (selectedCategory === "Personal") {
    workTime = 10 * 60;
  }

  timeLeft = workTime;
  updateDisplay();
});

// Save session data
function saveSession(category, duration) {
  const session = {
    category,
    duration,
    timestamp: new Date().toISOString(),
  };
  sessionData.push(session);
  localStorage.setItem("sessions", JSON.stringify(sessionData));
}

// View stats
function calculateStats(timeframe) {
  const now = new Date();
  const filteredSessions = sessionData.filter((session) => {
    const sessionDate = new Date(session.timestamp);
    if (timeframe === "daily") {
      return sessionDate.toDateString() === now.toDateString();
    } else if (timeframe === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return sessionDate >= weekAgo && sessionDate <= now;
    } else if (timeframe === "monthly") {
      return sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear();
    }
    return false;
  });

  const stats = filteredSessions.reduce((totals, session) => {
    totals[session.category] = (totals[session.category] || 0) + session.duration;
    return totals;
  }, {});

  renderChart(stats);
}

// Render chart
function renderChart(stats) {
  const ctx = document.getElementById("statsChart").getContext("2d");
  const categories = Object.keys(stats);
  const durations = Object.values(stats).map((seconds) => seconds / 60);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Time Spent (minutes)",
          data: durations,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    },
  });
}

// Add event listeners for statistics
document.getElementById("daily-stats").addEventListener("click", () => calculateStats("daily"));
document.getElementById("weekly-stats").addEventListener("click", () => calculateStats("weekly"));
document.getElementById("monthly-stats").addEventListener("click", () => calculateStats("monthly"));

// Initial display update
updateDisplay();
