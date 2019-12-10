// Global countdown variable
let countdown;

function timer(seconds) {
  const now = Date.now(); // When the timer started - in milliseconds
  const then = now + seconds * 1000; // When it stops - Now plus the amount of seconds you want the timer to run
  displayTimeLeft(seconds);

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
  console.log(seconds);
}

timer(10);
