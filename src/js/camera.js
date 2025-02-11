import cancelImage from "../assets/x-circle.svg";
import saveImage from "../assets/save.svg";
import pauseImage from "../assets/pause-btn.svg";
import playImage from "../assets/play-btn.svg";

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

function drawText(context, text, textFontSize, pictureWidth, pictureHeight, offsetFromBottom) {
    context.fillStyle = 'rgb(0, 0, 0)';

    const textWidth = context.measureText(text).width;
    const textPosition = {
        x:  (pictureWidth - textWidth) / 2,
        y: pictureHeight - textFontSize - offsetFromBottom
    };

    context.fillText(text, textPosition.x, textPosition.y);
}

function drawRectangle(context, text, textFontSize, pictureWidth, pictureHeight, padding) {
    let textMetrics = context.measureText(text);
    context.fillStyle = 'rgba(255, 255, 255, 0.5)';

    const rectanglePosition = {
        x: (pictureWidth / 2) - (textMetrics.width / 2) - padding,
        y: pictureHeight - (textFontSize * 2)
    };

    const rectangleSize = {
        width:  textMetrics.width + (padding * 2),
        height: textFontSize + (padding * 2)
    };

    // Position the rectangle in the bottom center of the picture
    context.fillRect(
        rectanglePosition.x,
        rectanglePosition.y,
        rectangleSize.width,
        rectangleSize.height
    );
}

function takePicture() {
    const width = video.offsetWidth;
    const height = video.offsetHeight;
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    const { longitude, latitude } = getUrlParams();
    let text = `${longitude}x${latitude}`;
    let textFontSize = 18;
    context.font = `${textFontSize}px serif`;

    drawRectangle(context, text, textFontSize, width, height, 2);
    drawText(context, text, textFontSize, width, height, 2);

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