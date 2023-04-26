let button = document.getElementById("requestPermission");

button.onclick = () => {
  getMediaRequest();
};

function getMediaRequest() {
  console.log("ya");
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { audio: false, video: { width: 1280, height: 720 } },
      (stream) => {
        console.log("success");
        document.getElementById("status").innerText = "OK";
      },
      (err) => {
        console.error(`The following error occurred: ${err.name}`);
      }
    );
  } else {
    console.log("getUserMedia not supported");
  }
}

getMediaRequest();
