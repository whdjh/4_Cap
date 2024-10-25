import GazEmo from './gazeEmoClass.js';
import * as address from './address.js';
import * as heatmap from './draw-heatmap';

document.addEventListener('DOMContentLoaded', async () => {

    const licenseKey = 'dev_fafdh08rb5wsibob5c1xy5nm7wpjdc26alecpx2l'; // Replace with your SeeSo license key
    const redirectUrl = 'http://localhost:8082'; // Redirect URL after calibration

    const gazEmo = new GazEmo(licenseKey, redirectUrl);
    const videoElement = await document.getElementById('video');
    await gazEmo.initialize(videoElement);
    await gazEmo.startGazEmo();
    
    document.getElementById('exit_btn').addEventListener('click', () => {
        gazEmo.stopGazEmo();
        getEmo();

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
});