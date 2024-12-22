// Timer variables
let timer; // Holds the interval
let isRunning = false; // Tracks if the timer is running
let timeLeft = 25 * 60; // Default timer: 25 minutes in seconds

const timeDisplay = document.getElementById("time");
const toggleButton = document.getElementById("toggle");
const resetButton = document.getElementById("reset");

// Format time into MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Update the timer display
function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
}

// Start the timer
function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer); // Stop the timer at 0
      toggleButton.textContent = "Start"; // Reset button text
      isRunning = false;
      alert("Time's up!"); // Notify user when the timer ends
    }
  }, 1000);
}

// Toggle Start/Pause functionality
toggleButton.addEventListener("click", () => {
  if (!isRunning) {
    startTimer(); // Start the timer
    toggleButton.textContent = "Pause"; // Change button text to Pause
  } else {
    clearInterval(timer); // Pause the timer
    toggleButton.textContent = "Start"; // Change button text back to Start
  }
  isRunning = !isRunning; // Toggle the running state
});

// Reset functionality
resetButton.addEventListener("click", () => {
  clearInterval(timer); // Stop the timer
  timeLeft = 25 * 60; // Reset time to 25 minutes
  updateDisplay(); // Update the display to show 25:00
  toggleButton.textContent = "Start"; // Set the button text back to Start
  isRunning = false; // Reset running state
});

// Initial display update
updateDisplay();
