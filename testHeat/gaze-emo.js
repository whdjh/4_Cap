import 'regenerator-runtime/runtime';
import EasySeeSo from 'seeso/easy-seeso';
import { emotions } from './getEmo';

const licenseKey = 'dev_fafdh08rb5wsibob5c1xy5nm7wpjdc26alecpx2l';

let setCal = null;

function onClickCalibrationBtn(page){
    const userId = 'YOUR_USER_ID'; // ex) 5e9easf293
    const baseUrl = 'http://localhost:8082';
    const redirectUrl = `${baseUrl}/${page}`;
    const calibrationPoint = 5;
    EasySeeSo.openCalibrationPage(licenseKey, userId, redirectUrl, calibrationPoint);
}

function parseCalibrationDataInQueryString () {
    const href = window.location.href
    const decodedURI = decodeURI(href)
    const queryString = decodedURI.split('?')[1];
    if (!queryString || !queryString.includes('calibrationData=')) return undefined;
    const jsonString = queryString.slice("calibrationData=".length, queryString.length)
    
    console.log('Parsed JSON String:', jsonString);

    const decodedJsonString = decodeURIComponent(jsonString);
    console.log('Decoded JSON String:', decodedJsonString);
    return decodedJsonString;
}

async function sendTrackData(newData) {
    try {
        const response = await fetch('/save-trackdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });

        if (response.ok) {
            console.log('Track data sent to server successfully');
        } else {
            console.error('Failed to send track data');
        }
    } catch (error) {
        console.error('Error sending track data:', error);
    }
}

function findEmotion(gazeTimestamp) {
    if (emotions.length === 0) {
        return { emotion: {}, timestamp: gazeTimestamp }; // 빈 배열일 때 기본값 반환
    }

    // gazeTimestamp보다 이전의 감정만 필터링
    const previousEmotions = emotions.filter(emotion => emotion.timestamp <= gazeTimestamp);

    if (previousEmotions.length === 0) {
        return { emotion: {}, timestamp: gazeTimestamp }; // 이전 감정이 없을 경우
    }

    return previousEmotions.reduce((closest, emotion) => {
        const closestDiff = Math.abs(closest.timestamp - gazeTimestamp);
        const emotionDiff = Math.abs(emotion.timestamp - gazeTimestamp);
        return emotionDiff < closestDiff ? emotion : closest;
    });
}

let trackData = [];

function getEmotionCategory(emotion) {
    const positive = ['happy'];
    const neutral = ['neutral', 'surprised'];
    const negative = ['sad', 'angry', 'fearful', 'disgusted'];

    if (positive.includes(emotion)) return 'positive';
    if (neutral.includes(emotion)) return 'neutral';
    return 'negative';
}

// gaze callback.
function onGaze(gazeInfo) {
    const closestEmotion = findEmotion(gazeInfo.timestamp);     // 시선 시간 보다 이후이면서 가장 가까운 시간의 감정
    console.log('closest:', closestEmotion);
    console.log('gaze', gazeInfo.x, gazeInfo.y)
    
    let highestEmotion;

    // closestEmotion이 정의되어 있는지 확인
    if (closestEmotion && typeof closestEmotion.expressions === 'object' && closestEmotion.expressions !== null) {
        
        const emotionKeys = Object.keys(closestEmotion.expressions);
        
        if(emotionKeys.length > 0) {
            highestEmotion = Object.keys(closestEmotion.expressions).reduce((a, b) => {
                return closestEmotion.expressions[a] > closestEmotion.expressions[b] ? a : b;
            });     // 가장 높은 확률의 감정

            const combinedData = {
                gazeX: gazeInfo.x,
                gazeY: gazeInfo.y,
                emotion: closestEmotion.expressions,
                gazeTime: gazeInfo.timestamp,
                emoTime: closestEmotion.timestamp,
                diff: (gazeInfo.timestamp - closestEmotion.timestamp) / 1000
            };
            
            const emotionCategory = getEmotionCategory(highestEmotion);

            trackData.push({x: gazeInfo.x, y: gazeInfo.y, emoType: emotionCategory});
            console.log('Combined Gaze and Emotion Data:', combinedData);
        } else {
            highestEmotion = 'unknown'; // 감정 데이터가 비어 있는 경우
            console.log('No emotion data')
        }
    } else { // 감정 데이터가 없을 경우 기본값을 설정
        highestEmotion = 'unknown';
        console.log('No emotion and closestEmotion data')  // closestEmotion 또는 emotion이 유효하지 않은 경우
    }
}

// debug callback.
function onDebug(FPS, latency_min, latency_max, latency_avg){
    // do something with debug info.
}

function handleLinkClick(event) {
    event.preventDefault(); // 기본 링크 이동을 막음
    const targetUrl = event.target.href;
    console.log('targetUrl:', targetUrl);
    
    const cal = parseCalibrationDataInQueryString();

    if (cal) {
        try {
            // JSON 문자열을 객체로 변환
            setCal = JSON.parse(cal);
        } catch (error) {
            console.error('Error parsing calibration data:', error);
        }
    }

    sendTrackData(trackData);

    console.log('gaze-emo.js cal:', setCal);
    const calibrationQuery = `?calibrationData=${encodeURIComponent(JSON.stringify(setCal))}`;	
    const newUrl = `${targetUrl}${calibrationQuery}`;
    window.location.href = newUrl;
}


async function main() {
    const caliData = parseCalibrationDataInQueryString();

    if (caliData){
        console.log('seeso 실행', caliData);
        const seeSo = new EasySeeSo();
        await seeSo.init(licenseKey,
            async () => {      
                if (caliData) {
                    await seeSo.setCalibrationData(caliData); // calibration data가 정의되어 있는지 확인
                } else {
                    console.error('Calibration data is not set correctly');
                    return; // calibration data가 없으면 종료
                }

                await seeSo.startTracking(onGaze, onDebug)

                const stopButton = document.getElementById('toheat');
                stopButton.addEventListener('click', handleLinkClick);
            }, // callback when init succeeded.
            () => console.log("callback when init failed.") // callback when init failed.
        )
    } else {
        console.log('No calibration data given.')
        document.addEventListener('DOMContentLoaded', () => {
            const calibrationButton = document.getElementById('calibrationButton');
            calibrationButton.addEventListener('click', onClickCalibrationBtn);
        });
    }
}

(async () => {
  await main();
})()
