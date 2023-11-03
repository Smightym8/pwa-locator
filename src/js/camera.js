import cancelImage from "../assets/x-circle.svg";
import saveImage from "../assets/save.svg";
import pauseImage from "../assets/pause-btn.svg";
import playImage from "../assets/play-btn.svg";
import changeCameraImage from "../assets/arrow-repeat.svg";

// This will be computed based on the input stream
let streaming = false; //flag for a 1st-time init
const video = document.getElementById('video');
const photo = document.getElementById('photo');
const cancelButton = document.getElementById('cancel');
const saveButton = document.getElementById('save');
const pausePlayButton = document.getElementById('pause-play');
const changeCameraButton = document.getElementById('change-camera');

let cameras = [];
let currentCameraIndex = 0;
let stream;

async function getAvailableCameras() {
    let mediaDevices = await navigator.mediaDevices.enumerateDevices();

    mediaDevices = mediaDevices.filter((camera) => {
        return camera.kind === 'videoinput' && !camera.label.includes('OBS');
    });

    cameras = mediaDevices;
}

async function startVideoPlayback() {
    //start video playback
    let currentDeviceId = cameras[currentCameraIndex].deviceId;

    try {
        stream = await navigator.mediaDevices.getUserMedia(
            {video: {deviceId: {exact: currentDeviceId}}}
        );

        video.srcObject = stream;
        video.play().then(() => {
            pausePlayButton.addEventListener("click", takePicture);
            pausePlayButton.disabled = false;
            saveButton.disabled = true;
            changeCameraButton.style.display = "block";
            saveButton.style.display = "none";
        });

        pausePlayButton.src = pauseImage;
        pausePlayButton.removeEventListener("click", startVideoPlayback);
        photo.style.display = "none";
        video.style.display = "block";
    } catch (err) {
        console.error(`An error occurred: ${err}`);
    }
}

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

    video.style.display = "none";
    photo.style.display = "block";
    changeCameraButton.style.display = "none";
    saveButton.style.display = "block";
    pausePlayButton.src = playImage;
    pausePlayButton.removeEventListener("click", takePicture);
    pausePlayButton.addEventListener("click", startVideoPlayback);
    saveButton.disabled = false;

    stopVideoStream();
}

async function changeCamera() {
    // TODO: Fix firefox bug
    currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
    stopVideoStream();
    await startVideoPlayback();
}

function backToMap() {
    location.href = "/";
}

function stopVideoStream() {
    stream.getTracks().forEach((track) => track.stop());
}

/* setup component */
window.onload = async () => {
    cancelButton.src = cancelImage;
    cancelButton.addEventListener("click", backToMap);

    saveButton.src = saveImage;

    pausePlayButton.src = pauseImage;

    changeCameraButton.src = changeCameraImage;
    changeCameraButton.addEventListener('click', changeCamera);

    await getAvailableCameras();

    // Enable button if there are multiple cameras
    if (cameras.length > 1) {
        changeCameraButton.disabled = false;
    }

    await startVideoPlayback();
}