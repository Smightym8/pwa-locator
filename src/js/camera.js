import cancelImage from "../assets/x-circle.svg";
import saveImage from "../assets/save.svg";
import pauseImage from "../assets/pause-btn.svg";
import playImage from "../assets/play-btn.svg";

// This will be computed based on the input stream
let streaming = false; //flag for a 1st-time init
const video = document.getElementById('video');
const photo = document.getElementById('photo');
const cancelButton = document.getElementById('cancel');
const saveButton = document.getElementById('save');
const pausePlayButton = document.getElementById('pause-play');
const videoErrorText = document.getElementById('video-error-text');

const reader = new FileReader();
let canvasImgBlob;
let stream;

async function startVideoPlayback() {
    //start video playback
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment" // Use back camera on phone
            },
            audio: false
        });

        video.srcObject = stream;
        video.play();

        pausePlayButton.removeEventListener("click", startVideoPlayback);
        pausePlayButton.addEventListener("click", takePicture);
        pausePlayButton.disabled = false;
        saveButton.disabled = true;
        pausePlayButton.src = pauseImage;
        photo.style.display = "none";
        video.style.display = "block";
    } catch (err) {
        videoErrorText.style.display = "block";
        console.error(`An error occurred: ${err}`);
    }
}

function drawText(context, text, textFontSize, pictureWidth, pictureHeight) {
    let textMetrics = context.measureText(text);
    context.font = `${textFontSize}px serif`;
    context.fillStyle = 'rgb(0, 0, 0)';
    context.textAlign = "center";
    context.textBaseline = "bottom";
    let textPosition = {x:  (pictureWidth / 2), y: pictureHeight - 2};

    context.fillText(text, textPosition.x, textPosition.y);
}

function drawRectangle(context, text, textFontSize, pictureWidth, pictureHeight) {
    let textMetrics = context.measureText(text);
    console.log(textMetrics.width);
    context.fillStyle = 'rgba(255, 255, 255, 0.5)';
    context.fillRect(
        ((pictureWidth / 2) - (textMetrics.width / 2)),
        pictureHeight - (textFontSize + 4),
        textMetrics.width,
        (textFontSize + 2)
    );
}

function takePicture(event) {
    const width = video.offsetWidth;
    const height = video.offsetHeight;
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    const { longitude, latitude } = getUrlParams();
    let text = `${longitude}x${latitude}`;
    let textFontSize = 18;

    drawRectangle(context, text, textFontSize, width, height);
    drawText(context, text, textFontSize, width, height);

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
    pausePlayButton.src = playImage;
    pausePlayButton.removeEventListener("click", takePicture);
    pausePlayButton.addEventListener("click", startVideoPlayback);
    saveButton.disabled = false;

    stopVideoStream();
}

function savePhoto() {
    reader.readAsDataURL(canvasImgBlob);
    backToMap();
}

function stopVideoStream() {
    stream.getTracks().forEach((track) => track.stop());
}

function backToMap() {
    const { longitude, latitude } = getUrlParams();
    location.href = `/?lng=${encodeURIComponent(longitude)}&lat=${encodeURIComponent(latitude)}`;
}

function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const longitude = urlParams.get('lng');
    const latitude = urlParams.get('lat');

    return {longitude: longitude, latitude: latitude};
}

/* setup component */
window.onload = async () => {
    cancelButton.src = cancelImage;
    cancelButton.addEventListener("click", backToMap);

    saveButton.src = saveImage;
    saveButton.addEventListener("click", savePhoto);

    pausePlayButton.src = pauseImage;

    reader.onloadend = function() {
        const { longitude, latitude } = getUrlParams();
        localStorage.setItem(`${longitude}x${latitude}`, reader.result);
    }

    await startVideoPlayback();
}