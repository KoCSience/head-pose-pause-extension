"use strict";

let markers = [];
let timeCounts = 0; // videoの時間の個数

window.addEventListener("load", () => {
  chrome.runtime.onMessage.addListener((request) => {
    console.log("[HPPE] Message Listener");

    //video要素の取得
    let video = document.querySelector("video");

    const videoPausingBool = request.videoPausingBool;
    if (videoPausingBool === true) {
      console.log("[HPPE] pause");
      onSaveButton();
    } else if (videoPausingBool === false) {
      console.log("[HPPE] play");
      video.play();
    } else {
      console.error("[HPPE] wrong message: ", request);
    }
  });

  // コントローラーの取得
  let videoControlsDiv = document.querySelector(".ytp-right-controls");
  videoControlsDiv.style.display = "flex"; // buttonをいい感じに他のやつと場所を揃える感じ

  //video要素の取得
  let video = document.querySelector("video");

  // vde div , YouTubeにボタンを埋め込む処理
  let vdeDiv = document.createElement("div");
  vdeDiv.id = "vde-vdeDiv";
  let videoTimeButtonsDiv = document.createElement("div");
  videoTimeButtonsDiv.id = "vde-videoTimeButtons";

  const save = createSaveButton(videoTimeButtonsDiv);
  vdeDiv.appendChild(save);

  const load = createLoadButton();
  vdeDiv.appendChild(load);

  videoControlsDiv.prepend(vdeDiv);

  // 以下function

  function createSaveButton(videoTimeButtonsDiv) {
    let save = document.createElement("button");
    save.id = "vde-saveButton";
    save.innerHTML = "save";
    save.onclick = () => {
      onSaveButton();
    };
    return save;
  }

  function onSaveButton() {
    addMarker(video.currentTime);
    video.pause();
  }

  function addMarker(currentVideoTime) {
    let div = document.querySelector("#vde-markerButtons");
    if (isNullOrUndefined(div)) {
      div = document.createElement("div");
      div.id = "vde-markerButtons";
      div.innerText = "";
      div = addMarker_(currentVideoTime);
      const player = document.querySelector("#player");
      player.after(div); // divの要素を追加後にafter
    } else {
      addMarker_(currentVideoTime);
    }

    function addMarker_(currentVideoTime) {
      markers.push(currentVideoTime);
      const videoTimeButton = createVideoTimeButton(
        markers.length - 1,
        currentVideoTime
      );
      console.log("videoTimeButton: ", videoTimeButton, div);
      div.appendChild(videoTimeButton);
      return div;
    }
  }

  function createVideoTimeButton(index, time) {
    const videoTimeButton = document.createElement("button");
    videoTimeButton.id = "vde-videoTimeButton-" + index;
    videoTimeButton.innerHTML = time;
    videoTimeButton.onclick = () => {
      let video = document.querySelector("video");
      console.log("videoTimeButton: ", markers, index);
      video.currentTime = markers[index];
    };
    return videoTimeButton;
  }

  function createLoadButton() {
    let load = document.createElement("button");
    load.id = "vde-loadButton";
    load.innerHTML = "load";
    load.onclick = () => {
      onLoadButton();
    };
    return load;
  }

  function onLoadButton() {
    jumpToMarker(markers.length - 1); // 最後尾?
    video.play();
  }

  function jumpToMarker(index) {
    video.currentTime = markers[index];
  }
});

function isNullOrUndefined(o) {
  return typeof o === "undefined" || o === null;
}
