let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');

function timer(seconds) {
  const now = Date.now(); // When the timer started - in milliseconds
  const then = now + seconds * 1000; // When it stops - Now plus the amount of seconds you want the timer to run
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000); // in milliseconds so divide by 1000. Round to nearest whole number

    // check if we should stop it
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

// Display time left
function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60); // Grab the lower bound of the minutes (IE, just display 2 if the seconds is within the 2 minutes)
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`; // If remainderSeconds is less than 10, display a 0 infront of the number.
  document.title = display; // Show timer in the browser tab
  timerDisplay.textContent = display;
  // console.log({minutes, remainderSeconds});
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

timer(70);
