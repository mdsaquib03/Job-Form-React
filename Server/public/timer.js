let timerDisplay = document.getElementById("timer");
let timerInterval;
let hours = 0;
let minutes = 0;
let seconds = 0;

function startTimer(duration) {
    clearInterval(timerInterval);

    hours = 0;
    minutes = 0;
    seconds = 0;
    timerDisplay.textContent = "00:00:00";

    timerInterval = setInterval(updateTimer, 1000);

    function updateTimer() {
        seconds++;

        if (seconds === 60) {
            seconds = 0;
            minutes++;

            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
        }

        const hoursDisplay = String(hours).padStart(2, '0');
        const minutesDisplay = String(minutes).padStart(2, '0');
        const secondsDisplay = String(seconds).padStart(2, '0');

        const timeString = `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`;
        timerDisplay.innerText = timeString;

        if (hours * 3600 + minutes * 60 + seconds >= duration) {
            clearInterval(timerInterval);
        }
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = "Starting...";
}
