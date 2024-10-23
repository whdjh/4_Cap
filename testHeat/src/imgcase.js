import 'regenerator-runtime/runtime';
import * as address from './address'
import GazEmo from './gazeEmoClass';
import * as heatmap from './draw-heatmap'

const licenseKey = 'dev_fafdh08rb5wsibob5c1xy5nm7wpjdc26alecpx2l';
const redirectUrl = 'http://localhost:8082';
export const gazEmo = new GazEmo(licenseKey, redirectUrl);

async function main() {
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
    await indexBtn.addEventListener('click', address.handleLinkClick);

}

document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = await document.getElementById('video');
    await gazEmo.initialize(videoElement);
    await gazEmo.startGazEmo();
    await main();
});