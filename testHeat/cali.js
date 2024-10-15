import 'regenerator-runtime/runtime';
import EasySeeSo from 'seeso/easy-seeso';

const licenseKey = '';

let setCal = null;

function onClickCalibrationBtn(page){
    const userId = 'YOUR_USER_ID'; // ex) 5e9easf293
    const baseUrl = 'http://localhost:8082';
    const redirectUrl = `${baseUrl}/${page}`;
    const calibrationPoint = 5;
    EasySeeSo.openCalibrationPage(licenseKey, userId, redirectUrl, calibrationPoint);
}

function parseCalibrationDataInQueryString () {
    const href = window.location.href
    const decodedURI = decodeURI(href)
    const queryString = decodedURI.split('?')[1];
    if (!queryString || !queryString.includes('calibrationData=')) return undefined;
    const jsonString = queryString.slice("calibrationData=".length, queryString.length)

    console.log('Parsed JSON String:', jsonString);

    const decodedJsonString = decodeURIComponent(jsonString);
    console.log('Decoded JSON String:', decodedJsonString);
    return decodedJsonString;
}

async function handleLinkClick(event) {
    event.preventDefault(); // 기본 링크 이동을 막음
    const targetUrl = event.target.href;
    console.log('targetUrl:', targetUrl);

    if (!setCal) {
        console.log('No calibration data found, starting calibration...');
        onClickCalibrationBtn(targetUrl); // 캘리브레이션 시작
    } else {
        // URL에 캘리브레이션 데이터 추가
        const calibrationQuery = `?calibrationData=${encodeURIComponent(JSON.stringify(setCal))}`;
        const newUrl = `${targetUrl}${calibrationQuery}`;
        window.location.href = newUrl; // 페이지 이동
    }
}

async function main() {
    document.addEventListener('DOMContentLoaded', () => {
        const calData = parseCalibrationDataInQueryString();

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
        const textCaseButton = document.getElementById('totext') // 텍스트 버튼
        const idxCaseButton = document.getElementById('toindex')

        if(idxCaseButton) {
            idxCaseButton.addEventListener('click', handleLinkClick);
        }
        if(imgCaseButton) {
            imgCaseButton.addEventListener('click', handleLinkClick);
        }
        if(textCaseButton) {
            textCaseButton.addEventListener('click', handleLinkClick);
        }
    }); 
}

(async () => {
  await main();
})()
