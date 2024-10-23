import 'regenerator-runtime/runtime';
import EasySeeSo from 'seeso/easy-seeso';
import GazEmo from './gazeEmoClass';

let setCal = null;
const licenseKey = 'dev_fafdh08rb5wsibob5c1xy5nm7wpjdc26alecpx2l';

export function onClickCalibrationBtn(page){
    const userId = 'YOUR_USER_ID'; // ex) 5e9easf293
    // const baseUrl = 'http://localhost:8082';
    // const redirectUrl = `${baseUrl}/${page}`;
    const redirectUrl = `${page}`;
    const calibrationPoint = 5;
    EasySeeSo.openCalibrationPage(licenseKey, userId, redirectUrl, calibrationPoint);
}

export function parseCalibrationDataInQueryString () {
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

export function handleLinkClick(event) {
    event.preventDefault(); // 기본 링크 이동을 막음

    const targetUrl = event.target.href;
    console.log('targetUrl:', targetUrl);

    const cal = parseCalibrationDataInQueryString();

    if (cal) {
        try {
            // JSON 문자열을 객체로 변환
            setCal = JSON.parse(decodeURIComponent(cal));
            console.log('handleLinkClick setCal', setCal)
        } catch (error) {
            console.error('Error parsing calibration data:', error);
        }
    }

    movePage_cali(targetUrl);
}

export async function checkCali(event) {
    event.preventDefault(); // 기본 링크 이동을 막음
    const targetUrl = event.target.href;
    console.log('targetUrl:', targetUrl);

    const cal =  parseCalibrationDataInQueryString();

    if (cal) {
        try {
            // JSON 문자열을 객체로 변환
            setCal = JSON.parse(decodeURIComponent(cal));
            console.log('checkCali setCal', setCal)
        } catch (error) {
            console.error('Error parsing calibration data:', error);
        }
    }

    if (!setCal) {
        console.log('No calibration data found, starting calibration...');
        onClickCalibrationBtn(targetUrl); // 캘리브레이션 시작
    } else {
        movePage_cali(targetUrl);
    }
}

export function movePage_cali(targetUrl){
    console.log('movePage_cali targetUrl', targetUrl)
    const calibrationQuery = `?calibrationData=${encodeURIComponent(JSON.stringify(setCal))}`;	
    const newUrl = `${targetUrl}${calibrationQuery}`;
    console.log('newUrl:',newUrl);
    window.location.href = newUrl;
}
