import cameraImage from "../assets/camera.svg";

// This will be computed based on the input stream
let streaming = false; //flag for a 1st-time init
const video = document.getElementById('video');
const photo = document.getElementById('photo');
const cameraButton = document.getElementById('camera');

//start video playback
navigator.mediaDevices.getUserMedia(
    { video: true, audio: false }
)
.then((stream) => {
    video.srcObject = stream;
    video.play();
})
.catch((err) => {
    console.error(`An error occurred: ${err}`);
});

function takePicture(event) {
    const width = video.offsetWidth;
    const height = video.offsetHeight;
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    let canvasImgBlob;

    canvas.convertToBlob({ type: 'image/jpeg' }).then(
        (blob) => {
            canvasImgBlob = blob;
            const imageData = URL.createObjectURL(blob);
            photo.width = width;
            photo.height = height;
            photo.src = imageData;
        }
    );
}

/* setup component */
window.onload = () => {
    cameraButton.addEventListener("click", takePicture);
    cameraButton.src = cameraImage;
}