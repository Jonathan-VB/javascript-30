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
    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = redEffect(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // Play the camera audio
  snap.currentTime = 0;
  snap.play();

  // Take data out of canvas, create download button to download snapshot onto users harddrive
  const data = canvas.toDataURL('image/jpg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Dude" />`;
  strip.insertBefore(link, strip.firstChild);
  console.log(data);
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }

  return pixels;
}

getVideo();

// Once the webcam is playing, run paintToCanvas
video.addEventListener('canplay', paintToCanvas);
