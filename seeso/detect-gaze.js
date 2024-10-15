import 'regenerator-runtime/runtime';
import EasySeeSo from 'seeso/easy-seeso';
import {showGaze} from "./showGaze";
import h337 from 'heatmap.js';

import { emotions } from './script';

const licenseKey = 'dev_fafdh08rb5wsibob5c1xy5nm7wpjdc26alecpx2l';

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
let filteredData = [];
let heatmapInstance;

function getEmotionCategory(emotion) {
    const positive = ['happy'];
    const neutral = ['neutral', 'surprised'];
    const negative = ['sad', 'angry', 'fearful', 'disgusted'];

    if (positive.includes(emotion)) return 'positive';
    if (neutral.includes(emotion)) return 'neutral';
    return 'negative';
}

function generateHeatmap(emotionType){

    // 감정 유형에 따라 데이터를 필터링
    switch(emotionType) {
        case 'full':         // 전체 히트맵
        console.log('전체 히트맵')
        filteredData = trackData.map(item => ({
            x: item.x,
            y: item.y,
            value: 20
        }));
        break;
        case 'positive':     // positive 히트맵
        console.log('긍정 히트맵')
        filteredData = trackData
            .filter(item => item.emoType === 'positive')
            .map(item => ({ x: item.x, y: item.y, value: 20 }));
        console.log(filteredData)
        break;

        case 'neutral':      // neutral 히트맵
        console.log('중립 히트맵')
        filteredData = trackData
            .filter(item => item.emoType === 'neutral')
            .map(item => ({ x: item.x, y: item.y, value: 20 }));
        console.log(filteredData)
        break;

        case 'negative':     // negative 히트맵
        console.log('부정 히트맵')
        filteredData = trackData
            .filter(item => item.emoType === 'negative')
            .map(item => ({ x: item.x, y: item.y, value: 20 }));
        console.log(filteredData)
        break;

        default:
        console.log("Invalid type");
        return;
    }

    // 이전 히트맵을 지우고 새 데이터로 히트맵 생성
    heatmapInstance.setData({ data: filteredData });
    console.log('히트맵 생성', filteredData)
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
    const closestEmotion = findEmotion(gazeInfo.timestamp);     // 시선 시간 보다 이후이면서 가장 가까운 시간의 감정
    console.log('closest:', closestEmotion);
    
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
    showGaze(gazeInfo)
}

// debug callback.
function onDebug(FPS, latency_min, latency_max, latency_avg){
    // do something with debug info.
}


async function main() {

    const calibrationData = parseCalibrationDataInQueryString()
    const heatmapContainer = document.getElementById('heatmap-container');
    if (!heatmapContainer) {
        console.error('히트맵 컨테이너가 존재하지 않습니다.');
        return;
    }
    
    heatmapInstance = h337.create({
        container: document.getElementById('heatmap-container'),  // 히트맵이 표시될 DOM 요소
        radius: 20, // 각 데이터 포인트의 반지름 (픽셀 단위)
        maxOpacity: 0.6, // 최대 불투명도
        minOpacity: 0.1, // 최소 불투명도
        blur: 0.75, // 블러 정도
        gradient: { // 색상 그라디언트 설정 (선택 사항)
            0.1: 'blue',
            0.5: 'green',
            1.0: 'red'
        }
    });

    if (calibrationData){
        const seeSo = new EasySeeSo();
        await seeSo.init(licenseKey,
            async () => {        
                await seeSo.startTracking(onGaze, onDebug)
                await seeSo.setCalibrationData(calibrationData)

                // 트래킹 중지 버튼 클릭 시
                document.getElementById('stopTracking').addEventListener('click', () => {
                    seeSo.stopTracking(); // seeso 트래킹 종료

                    // 비디오와 캔버스 숨기기
                    document.getElementById('video').style.display = 'none';
                    document.getElementById('output').style.display = 'none';
                    document.getElementById('gazeInfo').style.display = 'none';
                    document.getElementById('calibrationButton').style.display = 'none';

                    // 트래킹 중지 버튼 숨기기
                    document.getElementById('stopTracking').style.display = 'none';

                    // 히트맵 버튼 보이게 설정
                    document.getElementById('heatmapButtons').classList.remove('hidden');
                });

                // 히트맵 필터링 버튼들 클릭 이벤트
                document.getElementById('showAll').addEventListener('click', () => {
                    generateHeatmap('full'); // 전체 감정 히트맵
                });

                document.getElementById('showPositive').addEventListener('click', () => {
                    generateHeatmap('positive'); // 긍정 감정만 보여주기
                });

                document.getElementById('showNeutral').addEventListener('click', () => {
                    generateHeatmap('neutral'); // 중립 감정만 보여주기
                });

                document.getElementById('showNegative').addEventListener('click', () => {
                    generateHeatmap('negative'); // 부정 감정만 보여주기
                });

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
