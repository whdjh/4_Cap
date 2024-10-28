import 'regenerator-runtime/runtime';
import h337 from 'heatmap.js';

// 데이터가 다른 파일에서 전달될 것으로 가정하고, 매개변수로 받도록 함
export function createEmotionHeatmap(data) {
  const heatmapInstance = h337.create({
    container: document.getElementById('heatmapContainer'),
    radius: 30, // 각 데이터 포인트의 반지름 (픽셀 단위)
    maxOpacity: 0.6, // 최대 불투명도
    minOpacity: 0.1, // 최소 불투명도
    blur: 0.85, // 블러 정도
  	gradient: { // 색상 그라디언트 설정 (더 세부적으로 나누기)
      '0.0': 'blue',            // 매우 낮은 밀도 - 파란색
      '0.1': 'deepskyblue',     // 낮은 밀도 - 밝은 파란색
      '0.2': 'cyan',            // 낮음 - 청록색
      '0.3': 'springgreen',     // 낮음 - 밝은 초록색
      '0.4': 'lime',            // 중간 정도 - 연녹색
      '0.5': 'greenyellow',     // 중간 정도 - 노란빛 초록색
      '0.6': 'yellow',          // 중간-높음 - 노란색
      '0.7': 'orange',          // 높음 - 주황색
      '0.8': 'orangered',       // 높음 - 빨간빛 주황색
      '0.9': 'red',             // 매우 높음 - 빨간색
      '1.0': 'darkred'          // 극히 높음 - 어두운 빨간색
    }
  });

  // 감정 리스트
  const emotions = ["angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised"];

  // 감정별 데이터 필터링 함수
  function filterDataByEmotion(emotionKey) {
    const filteredData = data.reduce((acc, curr) => {
      const value = curr.emotion[emotionKey] || 0;
      if (value > 0.01) {
        acc.push({
          x: curr.x,
          y: curr.y,
          value: value,
        });
      }
      return acc;
    }, []);
    return filteredData;
  }

  // 히트맵 그리기 함수
  function drawHeatmap(dataPoints) {
    heatmapInstance.setData({
      max: 1.5, // 각 타임스탬프의 감정 합이 1이므로 최대값은 1
      data: dataPoints
    });
  }

  // '전체' 버튼 클릭 이벤트
  document.getElementById("showAll_btn").addEventListener("click", () => {
    const allData = data.map(d => ({
      x: d.x,
      y: d.y,
      value: Object.values(d.emotion).reduce((acc, v) => acc + v, 0) // 모든 감정 값 합산
    }));
    drawHeatmap(allData);
  });

  // 감정별 버튼 클릭 이벤트
  emotions.forEach(emotion => {
    document.getElementById(`${emotion}_btn`).addEventListener("click", () => {
      const emotionData = filterDataByEmotion(emotion);
      drawHeatmap(emotionData);
    });
  });

  // 초기화 시 전체 감정 히트맵을 표시
  document.getElementById("showAll_btn").click();
}
