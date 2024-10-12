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

function addNewData(gaze, emo, time) {
    // 1. 기존 데이터 가져오기
    let storedData = JSON.parse(localStorage.getItem('userData')) || [];  // 저장된 데이터가 없으면 빈 배열 초기화

    // 2. 새로운 데이터 생성
    let newData = {
        timeData: time,
        gazeData: gaze,  // {x: 150, y: 300} 등의 좌표 데이터
        emotion: emo            // ['happy', 'neutral'] 등 감정 데이터
    };

    // 3. 새로운 데이터를 기존 데이터에 추가
    storedData.push(newData);

    // 4. 추가된 데이터를 다시 로컬 스토리지에 저장
    localStorage.setItem('userData', JSON.stringify(storedData));
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
    // console.log('Closest Emotion:', closestEmotion);

    let highestEmotion;

    // closestEmotion이 정의되어 있는지 확인
    if (closestEmotion && typeof closestEmotion.expressions === 'object' && closestEmotion.expressions !== null) {
        
        const emotionKeys = Object.keys(closestEmotion.expressions);
        
        if(emotionKeys.length > 0) {
            highestEmotion = Object.keys(closestEmotion.expressions).reduce((a, b) => {
                return closestEmotion.expressions[a] > closestEmotion.expressions[b] ? a : b;
            });

            const combinedData = {
                gazeX: gazeInfo.x,
                gazeY: gazeInfo.y,
                emotion: highestEmotion,
                gazeTime: gazeInfo.timestamp,
                emoTime: closestEmotion.timestamp,
                diff: (gazeInfo.timestamp - closestEmotion.timestamp) / 1000
            };
    
            // addNewData({x: gazeInfo.x, y: gazeInfo.y}, highestEmotion, gazeInfo.timestamp)
            console.log('Combined Gaze and Emotion Data:', combinedData);
        } else {
            highestEmotion = 'unknown'; // 감정 데이터가 비어 있는 경우
            console.log('No emotion data')
        }
    } else { // 감정 데이터가 없을 경우 기본값을 설정
        highestEmotion = 'unknown';
        console.log('No emotion and closestEmotion data')  // closestEmotion 또는 emotion이 유효하지 않은 경우
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
