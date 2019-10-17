/**
 * Webcam wont work over a non-secure browser so we either need https:// or localhost.
 * Use '$ npm install' to install browsersync then use '$ npm start' to run it (over localhost).
 */

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error(`OH NO!!!`, err);
    });
}

function paintToCanvas() {
  const width = video.offsetWidth;
  const height = video.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  console.log(width, height);

  // Paint video to the canvas every 16 milliseconds
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
  }, 16);
}

function takePhoto() {
  // Play the camera audio
  snap.currentTime = 0;
  snap.play();
}

getVideo();

// Once the webcam is playing, run paintToCanvas
video.addEventListener('canplay', paintToCanvas);
