import 'regenerator-runtime/runtime';
import * as address from './address'
import GazEmo from './gazeEmoClass';
import * as heatmap from './draw-heatmap'

export default class CustomGazEmo extends GazEmo {
    constructor(licenseKey, redirectUrl) {
        // 부모 클래스의 생성자를 호출합니다.
        super(licenseKey, redirectUrl);
    }

    onGaze(gazeInfo) {
        super.onGaze(gazeInfo);
        this.showGaze(gazeInfo)
    }

    showGaze (gazeInfo) {
      let canvas = document.getElementById("output")
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = '#FF0000'
      ctx.clearRect(0, 0, canvas.width, canvas.height )
      ctx.beginPath();
      ctx.arc(gazeInfo.x, gazeInfo.y, 10, 0, Math.PI * 2, true);
      ctx.fill();
    }
}



const licenseKey = 'dev_fafdh08rb5wsibob5c1xy5nm7wpjdc26alecpx2l';
const redirectUrl = 'http://localhost:8082/heatmap.html';
export const gazEmo = new CustomGazEmo(licenseKey, redirectUrl);

document.addEventListener('DOMContentLoaded', async () => {

    const videoElement = document.getElementById('video');
    await gazEmo.initialize(videoElement);
    await gazEmo.startGazEmo();

    document.getElementById('exit_btn').addEventListener('click', () => {
        gazEmo.stopGazEmo();
        const trackData = heatmap.getEmo();

        // 히트맵 필터링 버튼들 클릭 이벤트
        document.getElementById('showAll_btn').addEventListener('click', () => {
            heatmap.generateHeatmap('full', trackData); // 전체 감정 히트맵
        });

        document.getElementById('pos_btn').addEventListener('click', () => {
            heatmap.generateHeatmap('positive', trackData); // 긍정 감정만 보여주기
        });

        document.getElementById('neu_btn').addEventListener('click', () => {
            heatmap.generateHeatmap('neutral', trackData); // 중립 감정만 보여주기
        });

        document.getElementById('neg_btn').addEventListener('click', () => {
            heatmap.generateHeatmap('negative', trackData); // 부정 감정만 보여주기
        });
    });

    const indexBtn = document.getElementById('toindex');
    indexBtn.addEventListener('click', address.handleLinkClickToIdx);

});