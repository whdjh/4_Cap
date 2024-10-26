import 'regenerator-runtime/runtime';
import EasySeeSo from 'seeso/easy-seeso';

export default class GazEmo {
    // 생성자: GazEmo 클래스의 인스턴스를 생성하고 필요한 변수들을 초기화합니다.
    constructor(licenseKey, redirectUrl) {
        this.licenseKey = licenseKey; // 라이센스 키를 저장합니다.
        this.redirectUrl = redirectUrl; // 캘리브레이션 이후 리다이렉트할 URL을 저장합니다.
        this.GazEmoBuf = []; // 시선과 감정 데이터를 저장하는 배열입니다.
        this.gazeBuffer = []; // 시선 데이터를 임시로 저장하는 버퍼입니다.
        this.emoBuffer = null; // 감정 데이터를 임시로 저장하는 버퍼입니다.
        this.seeSo = null; // SeeSo 객체를 저장합니다.
        this.emotionDetectionInterval = null; // 감정 인식 타이머를 저장하는 변수입니다.
        this.video = null; // 비디오 엘리먼트를 참조하는 변수입니다.
    }

    // 비디오 요소를 초기화하고 face-api.js 모델을 로드하는 함수입니다.
    async initialize(videoElement) {
        this.video = videoElement; // 비디오 엘리먼트를 설정합니다.
        await this.loadModels(); // 감정 인식을 위한 모델들을 로드합니다.
        await this.startVideo(); // 비디오 스트리밍을 시작합니다.
        console.log("init 끝")
    }

    // 시선 추적 및 캘리브레이션을 시작하는 함수입니다.
    async startGazEmo() {
        console.log("시작")
        this.startGaze();
        this.startEmo();
    }

    // 시선 추적과 감정 인식을 중지하는 함수입니다.
    stopGazEmo() {
        if (this.seeSo) {
            this.seeSo.stopTracking(); // 시선 추적을 중지합니다.
        }
        if (this.emotionDetectionInterval) {
            clearInterval(this.emotionDetectionInterval); // 감정 인식 주기적인 호출을 중지합니다.
        }
        this.video.style.display = 'none';
        console.log("시선 추적 및 감정 인식을 중단했습니다.");
        console.log(this.GazEmoBuf); // 수집된 데이터를 출력합니다.
    }

    // 시선과 감정 데이터를 접근하기 위한 게터 메서드들입니다.
    getGazEmoData() {
        return this.GazEmoBuf; // GazEmoBuf 배열을 참조로 반환합니다.
    }

    // 시선 추적을 위한 캘리브레이션을 시작하는 함수입니다.
    startCalibration() {
        const userId = 'YOUR_USER_ID'; // 예) 5e9easf293
        const calibrationPoint = 5; // 캘리브레이션에 필요한 포인트 수
        // 캘리브레이션 페이지를 열어 사용자 시선 추적을 설정합니다.
        EasySeeSo.openCalibrationPage(this.licenseKey, userId, this.redirectUrl, calibrationPoint);
    }

    // 리다이렉트된 페이지에서 호출되는 함수
    parseCalibrationDataInQueryString() {
        const href = window.location.href;
        const decodedURI = decodeURI(href);
        const queryString = decodedURI.split('?')[1];
        if (!queryString || !queryString.includes('calibrationData=')) return undefined;
        const jsonString = queryString.slice('calibrationData='.length, queryString.length);

        const decodedJsonString = decodeURIComponent(jsonString);
        console.log('Decoded JSON String:', decodedJsonString);
        return decodedJsonString;
    }

    // 시선 추적을 시작하는 함수입니다.
    async startGaze() {
        const calibrationData = this.parseCalibrationDataInQueryString();

        if (calibrationData) {
            this.seeSo = new EasySeeSo();
            await this.seeSo.init(
                this.licenseKey,
                async () => {
                    await this.seeSo.setCalibrationData(calibrationData);
                    await this.seeSo.startTracking(this.onGaze.bind(this), this.onDebug.bind(this));
                }, // 초기화 성공 시 호출되는 콜백
                () => console.log('초기화 실패 시 호출되는 콜백') // 초기화 실패 시 호출되는 콜백
            );
        } else {
            this.startCalibration();
        }
    }


    // 시선 데이터를 수신할 때 호출되는 콜백 함수입니다.
    onGaze(gazeInfo) {
        // 시선 데이터를 gazeBuffer에 추가합니다.
        this.gazeBuffer.push({ x: gazeInfo.x, y: gazeInfo.y, timestamp: gazeInfo.timestamp });
        // showGaze(gazeInfo); // 화면에 시선을 표시합니다.
    }

    // 디버깅 정보를 출력하는 함수입니다. (프로덕션에서는 필요하지 않을 수 있음)
    onDebug(FPS, latency_min, latency_max, latency_avg) {
        // 디버깅 정보 핸들러 (FPS, 지연시간 등을 출력)
    }


    // 웹캠 비디오 스트림을 가져와 비디오 엘리먼트에 연결하는 함수입니다.
    async startVideo() {
        console.log('스트림 연결')
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = await stream; // 비디오 엘리먼트에 스트림을 연결합니다.

            await new Promise((resolve) => {
                this.video.onloadeddata = () => {
                    console.log('비디오 로드 완료');
                    resolve(); // 비디오가 완전히 로드되었을 때 실행
                };
            });
        } catch (err) {
            console.error('카메라 접근 오류: ', err); // 카메라 접근 실패 시 오류 출력
            alert('감정 인식을 위해 카메라 접근이 필요합니다.'); // 사용자에게 카메라 접근이 필요함을 알립니다.
        }
    }

    // 감정 인식을 시작하는 함수입니다. 비디오 스트림에서 얼굴 감정 데이터를 감지합니다.
    startEmo() {
        // 비디오 엘리먼트에서 감정 인식을 위한 캔버스를 생성합니다.
        const canvas = faceapi.createCanvasFromMedia(this.video);
        document.body.append(canvas); // 캔버스를 문서에 추가합니다.
        const displaySize = { width: this.video.width, height: this.video.height }; // 비디오 크기를 설정합니다.
        faceapi.matchDimensions(canvas, displaySize); // 캔버스를 비디오 크기에 맞춥니다.

        // 감정 인식을 주기적으로 수행합니다 (100ms마다).
        this.emotionDetectionInterval = setInterval(async () => {
            const timestamp = Date.now(); // 현재 시간을 타임스탬프로 저장합니다.
            const detections = await faceapi
                .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions()) // 얼굴을 감지합니다.
                .withFaceLandmarks() // 얼굴 랜드마크 인식
                .withFaceExpressions(); // 얼굴 감정 인식
            const resizedDetections = faceapi.resizeResults(detections, displaySize); // 감지 결과를 비디오 크기에 맞춥니다.

            if (resizedDetections.length > 0) {
                const expressions = resizedDetections[0].expressions; // 첫 번째 얼굴의 감정 데이터를 추출합니다.
                this.emoBuffer = { expressions, timestamp }; // 감정 데이터를 emoBuffer에 저장합니다.
                this.syncData(); // 시선 데이터와 감정 데이터를 동기화합니다.
            }
        }, 100);
    }

    async loadModels() {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
            faceapi.nets.faceExpressionNet.loadFromUri('./models'),
        ]).catch((err) => console.error('모델 로딩 실패: ', err));
    }

    // 시선 데이터와 감정 데이터를 동기화하는 함수입니다.
    syncData() {
        if (this.emoBuffer) {
            const { timestamp: emoTimestamp, expressions } = this.emoBuffer; // 감정 데이터와 타임스탬프를 추출합니다.

            let closestGaze = null;
            let minTimeDiff = Infinity;

            // emoTimestamp와 가장 가까운 gazeBuffer의 시선 데이터를 찾습니다.
            this.gazeBuffer.forEach((gaze) => {
                const timeDiff = Math.abs(emoTimestamp - gaze.timestamp);
                if (timeDiff < minTimeDiff && gaze.timestamp < emoTimestamp) {
                    closestGaze = gaze;
                    minTimeDiff = timeDiff;
                }
            });

            if (closestGaze) {
                const timeDiff = emoTimestamp - closestGaze.timestamp; // 시선 데이터와 감정 데이터 사이의 시간 차이

                // GazEmoBuf 배열에 시선과 감정 데이터를 추가합니다.
                this.GazEmoBuf.push({
                    'x': closestGaze.x,
                    'y': closestGaze.y,
                    'emotion': expressions,
                    'time': timeDiff,
                    'temptime': emoTimestamp
                });

                // 처리된 시선 데이터를 gazeBuffer에서 제거합니다.
                const closestIndex = this.gazeBuffer.indexOf(closestGaze);
                if (closestIndex !== -1) {
                    this.gazeBuffer.splice(0, closestIndex + 1);
                }
            }

            // emoBuffer를 비웁니다.
            this.emoBuffer = null;
        }
    }
}