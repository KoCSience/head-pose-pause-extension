"use strict";

window.addEventListener('load', function () {
    let timeCounts = 0; // videoの時間の個数

    // コントローラーの取得
    let videoControlsDiv = document.querySelector('.ytp-right-controls');
    let vdeDiv = document.createElement('div');
    vdeDiv.id = "vde-vdeDiv";
    videoControlsDiv.prepend(vdeDiv);
    let videoTimeTextsDiv = document.createElement('div');
    videoTimeTextsDiv.id = "vde-videoTimeText";

    //video要素の取得
    let video = document.querySelector('video');

    // YouTubeにボタンを埋め込む処理
    let save = document.createElement('button');
    save.id = "vde-saveButton";
    save.innerHTML = 'save';
    save.onclick = () => {
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
    vdeDiv.appendChild(save);

    let load = document.createElement('button');
    load.id = "vde-loadButton";
    load.innerHTML = 'load';
    load.onclick = () => {
        jumpToMarker(timeCounts);
        video.play();
        timeCounts = (timeCounts + 1) % markers.length;
    }
    vdeDiv.appendChild(load);

    vdeDiv.appendChild(videoTimeTextsDiv); // save → load → videoTimeTextsDiv
    function createVideoText(time) {
        const videoText = document.createElement('p');
        videoText.id = "vde-videoText-" + timeCounts;
        videoText.innerHTML = time;
        return videoText;
    }

    let markers = [];
    function addMarker(time) {
        markers.push(time);
        const videoTimeText = createVideoText(time);
        console.log("videoTimeText: ", videoTimeText);
        videoTimeTextsDiv.appendChild(videoTimeText);
    }
    const jumpToMarker = (index) => {
        video.currentTime = markers[index];
    }
});