/**
 * Webcam wont work over a non-secure browser so we either need https:// or localhost.
 * Use '$ npm install' to install browsersync then use '$ npm start' to run it (over localhost).
 */

// Variables
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Start the webcam and play on the .player element
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

// Play the video in the canvas
function paintToCanvas() {
  // Get the width and height of the video player
  const width = video.offsetWidth;
  const height = video.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  console.log(width, height);

  // Draw video to the canvas every 16 milliseconds
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height); // Take these pixels out

    // Put any effect function here...
    pixels = greenScreen(pixels); // Mess with them

    ctx.putImageData(pixels, 0, 0); // Put them back
  }, 16);
}

// Executes when a photo is being taken
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

// Adds a red filter
function redEffect(pixels) {
  // For loop that increments by 4
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
    // pixels.data[i + 3] would be alpha, which we dont want to edit
  }
  return pixels;
}

// RGB Split filter
function rgbSplit(pixels) {
  // For loop that increments by 4
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // Move all reds back 150px
    pixels.data[i + 100] = pixels.data[i + 1]; // Move all greens 100px forward
    pixels.data[i - 150] = pixels.data[i + 2]; // Move all blues back 150px
    // pixels.data[i + 3] would be alpha, which we dont want to edit
  }
  return pixels;
}

// Green screen effect
function greenScreen(pixels) {
  const levels = {}; // blank levels

  // All 6 of the sliders input values
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  // Loop through all the pixels
  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // If the RGB values are anywhere inbetween the min/max of the slider values, take it out.
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out! Alpha is transparent at 0
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

// Once the webcam is playing, run paintToCanvas
video.addEventListener('canplay', paintToCanvas);
