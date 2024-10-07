const video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo).catch(err => console.error("Model loading failed: ", err));

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Error accessing the camera: ", err);
      alert("Camera access is required for emotion recognition.");
    });
}

const emotions = [];

function addEmotion(emotion) {
  const timestamp = Date.now();
  emotions.push({ emotion, timestamp });
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    
    // 감정 결과를 콘솔에 출력
    if (resizedDetections.length > 0) {
      const expressions = resizedDetections[0].expressions; // 첫 번째 감지된 얼굴의 감정
      
      addEmotion(expressions);

      //console.log('Detected expressions:', expressions);
      
      /*
      // 가장 높은 확률의 감정만 출력
      const highestEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
      console.log(`Most likely emotion: ${highestEmotion} (${expressions[highestEmotion].toFixed(2)})`); */
    }
  }, 100)
})

export { emotions, addEmotion };