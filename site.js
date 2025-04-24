const StartDialog = document.getElementById("StartDialog");
const MediaPlayer = document.getElementById("MediaPlayer");
const InputDialog = document.getElementById("InputDialog");

const StartModalOK = document.getElementsByClassName("start-modal-proceed")[0];

const playbtn = document.getElementsByClassName("playbtn")[0];
const mainVideo = document.getElementById("mainVideo");
const mute = document.getElementsByClassName("mute")[0];
let muteicon = document.getElementsByClassName("muteicon")[0];
let isPlaying = false;

const videos = [
  { 
    questionSrc: "video/001_scarface_question.mp4", 
    solutionSrc: "video/001_scarface_solution.mp4", 
    answer: "say hello to my little friend" 
  },
  { 
    questionSrc: "video/002_goldfinger_scene.mp4", 
    solutionSrc: "video/001_goldfinger_solution.mp4", 
    answer: "another answer" 
  },
   { 
    questionSrc: "video/001_scarface_question.mp4", 
    solutionSrc: "video/001_scarface_solution.mp4", 
    answer: "third answer" 
  },
   { 
    questionSrc: "video/001_scarface_question.mp4", 
    solutionSrc: "video/001_scarface_solution.mp4", 
    answer: "fourth answer" 
  },
   { 
    questionSrc: "video/001_scarface_question.mp4", 
    solutionSrc: "video/001_scarface_solution.mp4", 
    answer: "fifth answer" 
  }
];

let currentVideoIndex = 0;
let isVideoPlayingQuestion = true;

function loadVideo(index, isQuestion) {
  if (index >= videos.length) {
      console.warn("loadVideo called with index out of bounds:", index);
      return;
  }

  isVideoPlayingQuestion = isQuestion;
  const videoData = videos[index];
  const src = isQuestion ? videoData.questionSrc : videoData.solutionSrc;

  mainVideo.src = src;
  mainVideo.load();
  console.log(`Loading ${isQuestion ? 'question' : 'solution'} ${index + 1}: ${src}`);
}

function startIntroduction() {
    StartDialog.classList.add('--show');
}

StartModalOK.onclick = function() {
  StartDialog.classList.remove('--show');
  MediaPlayer.classList.add('--show');
  currentVideoIndex = 0;
  loadVideo(currentVideoIndex, true);
}

playbtn.onclick = function() {
  mainVideo.play();
}
mute.onclick = function() {
  if (mainVideo.muted) {
    mainVideo.muted = false;
    muteicon.src = "img/sound.png";
  } else {
    mainVideo.muted = true;
    muteicon.src = "img/mute.png";
  }
}

const closeButtons = document.querySelectorAll(".close");
let errorsound = new Audio('./sound/error.mp3');
for (let i = 0; i < closeButtons.length; i++) {
    errorsound.load();
    errorsound.play();
}

mainVideo.onended = function() {
  if (isVideoPlayingQuestion) {
    InputDialog.classList.add('--show');
  } else {
    currentVideoIndex++;
    if (currentVideoIndex < videos.length) {
      loadVideo(currentVideoIndex, true); 
    } else {
      console.log("End of quiz reached.");
      MediaPlayer.classList.remove('--show');
      InputDialog.classList.remove('--show');
      if (window.GameConnector) {
          window.GameConnector.triggerGameFinish();
      } else {
          console.error("GameConnector not found");
      }
    }
  }
};

let answer = document.getElementById("answer");

answer.oninput = function() {
  const correctAnswer = videos[currentVideoIndex].answer;
  const userAnswer = answer.value.replace(/[^\w\s]|_/g, "").toLowerCase().trim();

  if (userAnswer === correctAnswer) {
    console.log("Correct answer!");
    InputDialog.classList.remove('--show');
    answer.value = ""; 
    
    loadVideo(currentVideoIndex, false); 
    mainVideo.play(); 
  }
};
