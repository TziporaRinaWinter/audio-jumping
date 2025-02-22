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
      {
        src: "images/object1.png",
        isFail: false,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object2.png",
        isFail: false,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object3.png",
        isFail: false,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object4.png",
        isFail: false,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object5.png",
        isFail: true,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object6.png",
        isFail: true,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object7.png",
        isFail: true,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object8.png",
        isFail: false,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object9.png",
        isFail: true,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object10.png",
        isFail: true,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object11.png",
        isFail: true,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object12.png",
        isFail: true,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object13.png",
        isFail: true,
        heightLimit: window.innerHeight / 2,
      },
      {
        src: "images/object14.png",
        isFail: false,
        heightLimit: window.innerHeight,
      },
      {
        src: "images/object15.png",
        isFail: false,
        heightLimit: window.innerHeight,
      },
      {
        src: "images/object16.png",
        isFail: false,
        heightLimit: window.innerHeight,
      },
      {
        src: "images/object17.png",
        isFail: false,
        heightLimit: window.innerHeight,
      },
      {
        src: "images/object18.png",
        isFail: false,
        heightLimit: window.innerHeight,
      },
      {
        src: "images/object19.png",
        isFail: false,
        heightLimit: window.innerHeight,
      },
    ];

    const activeObjects = [];

    function createObject() {
      const randomIndex = Math.floor(Math.random() * objects.length);
      const objectData = objects[randomIndex];
      const object = document.createElement("img");
      object.src = objectData.src;
      object.style.position = "absolute";
      object.style.right = "0px";

      const maxHeight = objectData.heightLimit;
      object.style.top = `${Math.random() * (maxHeight - 100) + 100}px`;

      document.body.appendChild(object);
      activeObjects.push(object);
      moveObject(object, objectData.isFail);
    }

    function moveObject(object, isFailObject) {
      function animate() {
        const currentPosition = parseInt(object.style.right);
        const characterRect = character.getBoundingClientRect();
        const objectRect = object.getBoundingClientRect();

        if (
          characterRect.right - 5 > objectRect.left + 5 &&
          characterRect.left + 5 < objectRect.right - 5 &&
          characterRect.bottom + 5 > objectRect.top - 5 &&
          characterRect.top - 5 < objectRect.bottom + 5
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
      clearInterval(objectCreationInterval);
      activeObjects.forEach((obj) => obj.remove());

      const originalPosition =
        parseFloat(character.style.transform.split("(")[1]) || 0;

      character.style.transition = "transform 1s";
      character.style.transform = `translate(-50%, -${
        originalPosition + 1500
      }px)`;
      setTimeout(() => {
        character.style.transform = `translate(-50%, ${window.innerHeight}px)`;
        showResult();
      }, 1200);
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
      resultBox.innerText = `המשחק נגמר! אספת ${hitCount} אוצרות`;
      document.body.appendChild(resultBox);
    }

    objectCreationInterval = setInterval(createObject, 3000);
  })
  .catch((err) => {
    console.error("Error accessing microphone:", err);
  });
