import 'regenerator-runtime/runtime';
import * as address from './address' 

let setCal = null;

async function main() {
    document.addEventListener('DOMContentLoaded', () => {
        const calData = address.parseCalibrationDataInQueryString();

        if (calData) {
            try {
                // JSON 문자열을 객체로 변환
                setCal = JSON.parse(decodeURIComponent(calData));
                console.log('cali.js setCal:', setCal);
            } catch (error) {
                console.error('Error parsing calibration data:', error);
            }
        }

        const imgCaseButton = document.getElementById('toimg'); // 이미지 버튼
        const textCaseButton = document.getElementById('totext'); // 텍스트 버튼
        const idxCaseButton = document.getElementById('toindex'); // 로고

        if(idxCaseButton) {
            idxCaseButton.addEventListener('click', address.handleLinkClick);
        }
        if(imgCaseButton) {
            imgCaseButton.addEventListener('click', address.checkCali);
        }
        if(textCaseButton) {
            textCaseButton.addEventListener('click', address.checkCali);
        }
    }); 
}

(async () => {
  await main();
})()
