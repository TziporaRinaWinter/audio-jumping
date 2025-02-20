const character = document.getElementById("character");
let isJumping = false;
const speed = 4;
let hitCount = 0; // משתנה לספירת הנגיעות
let gameActive = true; // משתנה לבדיקת מצב המשחק
let objectCreationInterval; // משתנה לשמירת מזהה ה-interval

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

      if (gameActive) {
        requestAnimationFrame(jumpCharacter);
      }
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
    ];

    const failObjects = [
      "images/object9.png",
      "images/object10.png",
      "images/object11.png",
      "images/object12.png",
      "images/object13.png",
    ];

    const activeObjects = [];

    function createObject() {
      const isFailObject = Math.random() < 0.4;
      const object = document.createElement("img");
      object.src = isFailObject
        ? failObjects[Math.floor(Math.random() * failObjects.length)]
        : objects[Math.floor(Math.random() * objects.length)];
      object.style.position = "absolute";
      object.style.right = "0px";
      object.style.top = `${Math.random() * (window.innerHeight - 300)}px`;
      document.body.appendChild(object);
      activeObjects.push(object);
      moveObject(object, isFailObject);
    }

    function moveObject(object, isFailObject) {
      function animate() {
        const currentPosition = parseInt(object.style.right);
        const characterRect = character.getBoundingClientRect();
        const objectRect = object.getBoundingClientRect();

        if (
          characterRect.right > objectRect.left &&
          characterRect.left < objectRect.right &&
          characterRect.bottom > objectRect.top &&
          characterRect.top < objectRect.bottom
        ) {
          if (isFailObject) {
            endGame();
          } else {
            hitCount++;
            console.log("Hit count:", hitCount);
            object.remove();
            activeObjects.splice(activeObjects.indexOf(object), 1);
            return;
          }
        }

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

    function endGame() {
      gameActive = false;
      clearInterval(objectCreationInterval); // עצור את יצירת האובייקטים
      activeObjects.forEach((obj) => obj.remove());
      showResult();
    }

    function showResult() {
      const resultBox = document.createElement("div");
      resultBox.style.position = "fixed";
      resultBox.style.top = "50%";
      resultBox.style.left = "50%";
      resultBox.style.transform = "translate(-50%, -50%)";
      resultBox.style.padding = "20px";
      resultBox.style.backgroundColor = "white";
      resultBox.style.border = "2px solid black";
      resultBox.style.zIndex = "1000";
      resultBox.innerText = `Game Over! You collected ${hitCount} objects.`;
      document.body.appendChild(resultBox);
    }

    objectCreationInterval = setInterval(createObject, 3000); // שמור את מזהה ה-interval
  })
  .catch((err) => {
    console.error("Error accessing microphone:", err);
  });
