const character = document.getElementById("character");
let isJumping = false;
// Define image sources for different jump heights
const jumpImages = [
  "images/small_jump.png",
  "images/medium_jump.png",
  "images/high_jump.png",
];

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function getAverageVolume() {
      analyser.getByteFrequencyData(dataArray);
      return dataArray.reduce((a, b) => a + b) / dataArray.length;
    }

    function jumpCharacter() {
      const average = getAverageVolume();
      const jumpHeight = Math.min(average * 3, window.innerHeight);

      if (jumpHeight > 5 && !isJumping) {
        isJumping = true;

        let jumpImageIndex = 0;
        if (jumpHeight > 250) {
          jumpImageIndex = 2; // High jump
        } else if (jumpHeight > 100) {
          jumpImageIndex = 1; // Medium jump
        }
        character.src = jumpImages[jumpImageIndex];
        character.style.transform = `translate(-50%, -${jumpHeight}px)`;
        setTimeout(() => {
          character.style.transform = "translate(-50%, 0)";
          character.src = jumpImages[0];
          isJumping = false;
        }, 500);
      }

      requestAnimationFrame(jumpCharacter);
    }

    requestAnimationFrame(jumpCharacter);
  })
  .catch((err) => {
    console.error("Error accessing microphone:", err);
  });
