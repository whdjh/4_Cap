import 'regenerator-runtime/runtime';
import * as heatmap from './draw-heatmap';
import * as address from './address';
import GazEmo from './gazeEmoClass';


document.addEventListener('DOMContentLoaded', async () => {

    class CustomGazEmo extends GazEmo {
        constructor(licenseKey, redirectUrl) {
            // 부모 클래스의 생성자를 호출합니다.
            super(licenseKey, redirectUrl);
            this.canvas = null;
        }

        onGaze(gazeInfo) {
            super.onGaze(gazeInfo);
            this.showGaze(gazeInfo)
        }

        showGaze(gazeInfo) {
            this.canvas = document.getElementById("output")
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            let ctx = this.canvas.getContext("2d");
            ctx.fillStyle = '#FF0000'
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            ctx.beginPath();
            ctx.arc(gazeInfo.x, gazeInfo.y, 10, 0, Math.PI * 2, true);
            ctx.fill();
        }

        stopGazEmo() {
            super.stopGazEmo();
            let ctx = this.canvas.getContext("2d");
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }

        syncData() {
            super.syncData();
            const emoDisplay = document.getElementById('displayEmotion')
            const lastData = this.GazEmoBuf[this.GazEmoBuf.length - 1];
            const updateEmoDisplay = (expressions, timeDiff) => {
                const resultText = `
                    timeDiff: ${(timeDiff)}ms<br>
                    happy: ${(expressions.happy * 100).toFixed(2)}%<br>
                    sad: ${(expressions.sad * 100).toFixed(2)}%<br>
                    angry: ${(expressions.angry * 100).toFixed(2)}%<br>
                    fearful: ${(expressions.fearful * 100).toFixed(2)}%<br>
                    disgusted: ${(expressions.disgusted * 100).toFixed(2)}%<br>
                    surprised: ${(expressions.surprised * 100).toFixed(2)}%<br>
                    neutral: ${(expressions.neutral * 100).toFixed(2)}%
                `;
        
                emoDisplay.innerHTML = resultText;
            };

            updateEmoDisplay(lastData.emotion, lastData.time);
        }
    }

    const licenseKey = 'dev_fafdh08rb5wsibob5c1xy5nm7wpjdc26alecpx2l';
    const redirectUrl = 'http://localhost:8082/heatmap.html';
    const gazEmo = new CustomGazEmo(licenseKey, redirectUrl);

    const videoElement = document.getElementById('heatmap_video');
    await gazEmo.initialize(videoElement);
    await gazEmo.startGazEmo();

    document.getElementById('exit_btn').addEventListener('click', () => {
        gazEmo.stopGazEmo();
        heatmap.createEmotionHeatmap(gazEmo.getGazEmoData());
    }, { once: true });

    const indexBtn = document.getElementById('toindex');
    indexBtn.addEventListener('click', address.handleLinkClickToIdx);

});