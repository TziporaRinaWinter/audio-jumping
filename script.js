const character = document.getElementById("character");
let isJumping = false;
const speed = 4;

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
        let jumpImageIndex = jumpHeight > 250 ? 2 : jumpHeight > 100 ? 1 : 0;
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

    const objects = [
      "images/object1.png",
      "images/object2.png",
      "images/object3.png",
      "images/object4.png",
      "images/object5.png",
      "images/object6.png",
      "images/object7.png",
      "images/object8.png",
      "images/object9.png",
      "images/object10.png",
    ];

    const activeObjects = [];

    function createObject() {
      const object = document.createElement("img");
      object.src = objects[Math.floor(Math.random() * objects.length)];
      object.style.position = "absolute";
      object.style.right = "0px";
      object.style.top = `${Math.random() * (window.innerHeight - 300)}px`;
      document.body.appendChild(object);
      activeObjects.push(object);
      moveObject(object);
    }

    function moveObject(object) {
      function animate() {
        const currentPosition = parseInt(object.style.right);
        if (currentPosition < window.innerWidth) {
          object.style.right = `${currentPosition + speed}px`;
          requestAnimationFrame(animate);
        } else {
          object.remove();
          activeObjects.splice(activeObjects.indexOf(object), 1);
        }
      }
      animate();
    }

    setInterval(createObject, 3000);
  })
  .catch((err) => {
    console.error("Error accessing microphone:", err);
  });
