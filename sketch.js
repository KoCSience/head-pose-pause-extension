"use strict";

// Optionsページを開くボタン
document.getElementById("openOptionsButton").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});

document
  .getElementById("playVideoButton")
  .addEventListener("click", async () => {
    sendVideoPlay();
    flipPoseContinue((poseContinue = true));
  });
document
  .getElementById("saveVideoButton")
  .addEventListener("click", async () => {
    sendVideoPause();
    flipPoseContinue((poseContinue = false));
  });
document
  .getElementById("pauseVideoButton")
  .addEventListener("click", async () => {
    sendVideoPause(false);
    flipPoseContinue((poseContinue = false));
  });

function flipPoseContinue(poseContinue) {
  if (poseContinue) {
    document.getElementById("poseContinue").innerText = "👀";
  } else {
    document.getElementById("poseContinue").innerText = "x";
  }
}
// function onPauseVideoButton() {}

// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let video;
let poseNet;
let poses = [];
let videoPausingBool = false;
let poseContinue = true;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();

  if (!isNullOrUndefined(poses[0]) && poseContinue) {
    const pose = poses[0].pose;
    // console.log(pose);
    if (pose.leftEye.y > pose.leftEar.y || pose.rightEye.y > pose.rightEar.y) {
      console.log("[HPPE] !!!!DOWN!!!!");
      sendVideoPause();
    } else {
      // if (!videoPausingBool) {
      sendVideoPlay();
      // }
      console.log("[HPPE] UP??");
    }
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}

async function sendVideoPause(isCreateVideoTimeButton = true) {
  if (videoPausingBool === false) {
    videoPausingBool = true;
    console.log("[HPPE] pause to true (head down)");
    // await chrome.runtime.sendMessage({
    //   videoPausingBool: videoPausingBool,
    // });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs);
      console.log(tabs[0]);
      const id = tabs[0].id;

      // content_script へデータを送る
      chrome.tabs.sendMessage(id, {
        videoPausingBool: videoPausingBool,
        isCreateVideoTimeButton: isCreateVideoTimeButton,
      });
    });

    console.log("[HPPE] send video pause", videoPausingBool);
  }
}

async function sendVideoPlay() {
  if (videoPausingBool === true) {
    videoPausingBool = false;
    console.log("[HPPE] pause to false (head up)");

    // await chrome.runtime.sendMessage({
    //   videoPausingBool: videoPausingBool,
    // });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs);
      const id = tabs[0].id;

      // content_script へデータを送る
      chrome.tabs.sendMessage(id, {
        videoPausingBool: videoPausingBool,
      });
    });

    console.log("[HPPE] send video play", videoPausingBool);
  }
}

function isUndefined(value) {
  return typeof value === "undefined";
}

function isNullOrUndefined(o) {
  return typeof o === "undefined" || o === null;
}
