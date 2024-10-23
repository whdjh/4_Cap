import 'regenerator-runtime/runtime';
import h337 from 'heatmap.js';
import * as address from './address'
import { gazEmo } from './gaze-emo';

let filteredData = [];
let trackData = [];
let heatmapInstance= h337.create({
    container: document.getElementById('heatmapContainer'),  // 히트맵이 표시될 DOM 요소
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

// function getEmotionCategory(emotion) {
//     const positive = ['happy'];
//     const neutral = ['neutral', 'surprised'];
//     const negative = ['sad', 'angry', 'fearful', 'disgusted'];

//     if (positive.includes(emotion)) return 'positive';
//     if (neutral.includes(emotion)) return 'neutral';
//     return 'negative';
// }

// function getEmo(){
//     const bufDatas = gazEmo.getGazEmoData();

//     bufDatas.forEach(bufData => {
//         const emotionKeys = Object.keys(bufData.emotion);
//         let highestEmotion = '';
    
//         if (emotionKeys.length > 0) {
//             highestEmotion = emotionKeys.reduce((a, b) => {
//                 return bufData.emotion[a] > bufData.emotion[b] ? a : b;
//             });
    
//             // 높은 확률 감정의 카테고리화
//             const emotionCategory = getEmotionCategory(highestEmotion);

//             trackData.push({x: bufData.x, y: bufData.y, emoType: emotionCategory})

//         } else {
//             trackData.push({
//                 highestEmotion: null,
//                 category: null
//             });
//         }
//     });
// }
async function loadTrackDataFromServer() {
    try {
        const response = await fetch('/get-trackdata'); // 서버로 GET 요청
        if (response.ok) {
            const trackData = await response.json(); // 서버에서 받은 데이터를 JSON으로 변환
            console.log('Received track data from server:', trackData);
            return trackData; // 받아온 데이터를 반환
        } else {
            console.error('No track data found on the server');
            return null; // 데이터가 없을 때 null 반환
        }
    } catch (error) {
        console.error('Error loading track data from server:', error);
        return null;
    }
}

async function generateHeatmap(emotionType){

    const track = await loadTrackDataFromServer();

    if (track) {
        // 감정 유형에 따라 데이터를 필터링
        switch(emotionType) {
            case 'full':         // 전체 히트맵
            console.log('전체 히트맵')
            filteredData = track.map(item => ({
                x: item.x,
                y: item.y,
                value: 20
            }));
            break;
            case 'positive':     // positive 히트맵
            console.log('긍정 히트맵')
            filteredData = track
                .filter(item => item.emoType === 'positive')
                .map(item => ({ x: item.x, y: item.y, value: 20 }));
            console.log(filteredData)
            break;

            case 'neutral':      // neutral 히트맵
            console.log('중립 히트맵')
            filteredData = track
                .filter(item => item.emoType === 'neutral')
                .map(item => ({ x: item.x, y: item.y, value: 20 }));
            console.log(filteredData)
            break;

            case 'negative':     // negative 히트맵
            console.log('부정 히트맵')
            filteredData = track
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
    } else {
        console.log('No track data available for heatmap');
    }
}

async function main() {
    document.getElementById('exit_btn').addEventListener('click', () => {
        // getEmo();
        const heatmapContainer = document.getElementById('heatmapContainer');
        if (!heatmapContainer) {
            console.error('히트맵 컨테이너가 존재하지 않습니다.');
            return;
        }

        // 히트맵 필터링 버튼들 클릭 이벤트
        document.getElementById('showAll_btn').addEventListener('click', () => {
            generateHeatmap('full'); // 전체 감정 히트맵
        });

        document.getElementById('pos_btn').addEventListener('click', () => {
            generateHeatmap('positive'); // 긍정 감정만 보여주기
        });

        document.getElementById('neu_btn').addEventListener('click', () => {
            generateHeatmap('neutral'); // 중립 감정만 보여주기
        });

        document.getElementById('neg_btn').addEventListener('click', () => {
            generateHeatmap('negative'); // 부정 감정만 보여주기
        });
    });
    
    const indexBtn = document.getElementById('toindex');
    indexBtn.addEventListener('click', address.handleLinkClick());

}

(async () => {
  await main();
})()
