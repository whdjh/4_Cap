import 'regenerator-runtime/runtime';
import EasySeeSo from 'seeso/easy-seeso';
import {showGaze} from "./showGaze";
import { gazes } from './showGaze';
import { emotions } from './script';

const licenseKey = '';

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

function onClickCalibrationBtn(){
    const userId = 'YOUR_USER_ID'; // ex) 5e9easf293
    const redirectUrl = 'http://localhost:8082';
    const calibrationPoint = 5;
    EasySeeSo.openCalibrationPage(licenseKey, userId, redirectUrl, calibrationPoint);
}

// in redirected page
function parseCalibrationDataInQueryString () {
    const href = window.location.href
    const decodedURI = decodeURI(href)
    const queryString = decodedURI.split('?')[1];
    if (!queryString || !queryString.includes('calibrationData=')) return undefined;
    const jsonString = queryString.slice("calibrationData=".length, queryString.length)
    return jsonString
}

// gaze callback.
function onGaze(gazeInfo) {
    // do something with gaze info.

    // 시선 정보
    gazes.push({ x: gazeInfo.x, y: gazeInfo.y, timestamp: gazeInfo.timestamp });

    const closestEmotion = findEmotion(gazeInfo.timestamp);
    console.log('Closest Emotion:', closestEmotion);

    // closestEmotion.emotion이 객체인지 확인합니다.
    if (closestEmotion.emotion && typeof closestEmotion.emotion === 'object' && Object.keys(closestEmotion.emotion).length > 0) {
        const highestEmotion = Object.keys(closestEmotion.emotion).reduce((a, b) => {
            return closestEmotion.emotion[a] > closestEmotion.emotion[b] ? a : b;
        });

        const combinedData = {
            gazeX: gazeInfo.x,
            gazeY: gazeInfo.y,
            emotion: highestEmotion,
            timestamp: gazeInfo.timestamp
        };

        console.log('Combined Gaze and Emotion Data:', combinedData);
    } else {
        console.log('No valid emotion data available.'); // 감정 데이터가 없을 때
    }
    showGaze(gazeInfo)
}

// debug callback.
function onDebug(FPS, latency_min, latency_max, latency_avg){
    // do something with debug info.
}

async function main() {

    const calibrationData = parseCalibrationDataInQueryString()

    if (calibrationData){
        const seeSo = new EasySeeSo();
        await seeSo.init(licenseKey,
            async () => {        
                await seeSo.startTracking(onGaze, onDebug)
                await seeSo.setCalibrationData(calibrationData)


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
