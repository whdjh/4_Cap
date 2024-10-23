import 'regenerator-runtime/runtime';
import h337 from 'heatmap.js';
import { gazEmo } from './imgcase';

let filteredData = [];
let trackData = [];

let heatmapInstance = h337.create({
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

function getEmotionCategory(emotion) {
    const positiveEmotions = ['happy'];
    const neutralEmotions = ['neutral', 'surprised'];
    const negativeEmotions = ['sad', 'angry', 'fearful', 'disgusted'];

    // 긍정, 중립, 부정 감정 확률 합산
    const positiveProb = positiveEmotions.reduce((sum, emo) => sum + (emotion[emo] || 0), 0);
    const neutralProb = neutralEmotions.reduce((sum, emo) => sum + (emotion[emo] || 0), 0);
    const negativeProb = negativeEmotions.reduce((sum, emo) => sum + (emotion[emo] || 0), 0);

    // 가장 높은 확률을 가진 카테고리 반환
    const maxProb = Math.max(positiveProb, neutralProb, negativeProb);

    if (maxProb === positiveProb) return 'positive';
    if (maxProb === neutralProb) return 'neutral';
    return 'negative';
}

export function getEmo() {
    const bufDatas = gazEmo.getGazEmoData();

    bufDatas.forEach(bufData => {
        const emotionKeys = Object.keys(bufData.emotion);

        if (emotionKeys.length > 0) {
            // 높은 확률 감정의 카테고리화
            const emotionCategory = getEmotionCategory(bufData.emotion);

            trackData.push({ x: bufData.x, y: bufData.y, emoType: emotionCategory })

        } else {
            trackData.push({
                x: bufData.x,
                y: bufData.y,
                emoType: null
            });
        }
    });
    return trackData;
}

export async function generateHeatmap(emotionType, data) {
    const heatmapContainer = document.getElementById('heatmapContainer');
    if (!heatmapContainer) {
        console.error('히트맵 컨테이너가 존재하지 않습니다.');
        return;
    }

    const track = data;
    console.log('trackData', track);

    if (track) {
        // 감정 유형에 따라 데이터를 필터링
        switch (emotionType) {
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