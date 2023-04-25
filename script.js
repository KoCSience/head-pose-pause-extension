"use strict";

let markers = [];
let timeCounts = 0; // videoの時間の個数

chrome.runtime.onMessage.addListener((request) => {
  console.log("[HPPE] addListener");

  //video要素の取得
  let video = document.querySelector("video");

  const videoPausingBool = request.videoPausingBool;
  if (videoPausingBool === true) {
    video.pause();
  } else if (videoPausingBool === false) {
    video.play();
  } else {
    console.error("[HPPE] wrong message: ", request);
  }
});

window.addEventListener("load", () => {
  // コントローラーの取得
  let videoControlsDiv = document.querySelector(".ytp-right-controls");
  //video要素の取得
  let video = document.querySelector("video");

  // vde div , YouTubeにボタンを埋め込む処理
  let vdeDiv = document.createElement("div");
  vdeDiv.id = "vde-vdeDiv";
  let videoTimeTextsDiv = document.createElement("div");
  videoTimeTextsDiv.id = "vde-videoTimeText";

  const save = createSaveButton(video);
  vdeDiv.appendChild(save);

  const load = createLoadButton(video);
  vdeDiv.appendChild(load);

  videoControlsDiv.prepend(vdeDiv);
  vdeDiv.appendChild(videoTimeTextsDiv); // save → load → videoTimeTextsDiv
});

function createSaveButton(video) {
  let save = document.createElement("button");
  save.id = "vde-saveButton";
  save.innerHTML = "save";
  save.onclick = onSaveButton(video);
  return save;
}

function onSaveButton() {
  addMarker(video.currentTime);
  video.pause();

  /*
      マーカーの一覧を画面に表示する処理(作成中)
      let $list = $('<ul id="list"> hogehoge </ul>')

      markers.forEach(function (marker) {
          $list.append($('<li/>').text(`${marker}`))
      })

      let document = video.ownerDocument;
      let wrapper = document.createElement("div");
      wrapper.classList.add("hoge-controler");

      video.append($list);
      */
}

function createLoadButton(video) {
  let load = document.createElement("button");
  load.id = "vde-loadButton";
  load.innerHTML = "load";
  load.onclick = onLoadButton(video);
  return load;
}

function onLoadButton(video) {
  jumpToMarker(timeCounts);
  video.play();
  timeCounts = (timeCounts + 1) % markers.length;
}

function createVideoText(time) {
  const videoText = document.createElement("p");
  videoText.id = "vde-videoText-" + timeCounts;
  videoText.innerHTML = time;
  return videoText;
}

function addMarker(time, videoTimeTextsDiv) {
  markers.push(time);
  const videoTimeText = createVideoText(time);
  console.log("videoTimeText: ", videoTimeText);
  videoTimeTextsDiv.appendChild(videoTimeText);
}

function jumpToMarker(index, video) {
  video.currentTime = markers[index];
}
