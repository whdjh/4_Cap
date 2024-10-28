import 'regenerator-runtime/runtime';
import EasySeeSo from 'seeso/easy-seeso';

const licenseKey = 'dev_fafdh08rb5wsibob5c1xy5nm7wpjdc26alecpx2l';

export function handleLinkClickToIdx(event) {
    event.preventDefault(); // 기본 링크 동작을 막음
    const targetUrl = new URL(event.currentTarget.href);

    // URL에 캘리브레이션 데이터가 있는지 확인
    const urlParams = new URLSearchParams(window.location.search);
    const calibrationData = urlParams.get('calibrationData');

    if(calibrationData) {
      targetUrl.searchParams.set('calibrationData', calibrationData);
    }
    
    window.location.href = targetUrl.toString();
}


export function handleLinkClickFromIdx(event) {
    event.preventDefault(); // 기본 링크 동작을 막음
    const targetUrl = new URL(event.currentTarget.href);

    // URL에 캘리브레이션 데이터가 있는지 확인
    const urlParams = new URLSearchParams(window.location.search);
    const calibrationData = urlParams.get('calibrationData');

    if (calibrationData) {
      targetUrl.searchParams.set('calibrationData', calibrationData);
      window.location.href = targetUrl.toString();
    } 
		else {
      startCalibration(targetUrl.toString()); // 캘리브레이션 과정 시작
    }
}


function startCalibration(page) {
  const userId = 'YOUR_USER_ID';
  const calibrationPoint = 5;
  EasySeeSo.openCalibrationPage(licenseKey, userId, page, calibrationPoint);
}
