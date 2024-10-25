import 'regenerator-runtime/runtime';
import EasySeeSo from 'seeso/easy-seeso';

const licenseKey = 'dev_fafdh08rb5wsibob5c1xy5nm7wpjdc26alecpx2l';

// 기존 캘리브레이션 데이터가 있을 때 이벤트 처리 함수
export function handleLinkClickToIdx(event) {
    event.preventDefault(); // 기본 링크 동작을 막음
    // event.target이 올바른 앵커 태그인지 확인 (오류 방지)
    const anchorElement = event.target.closest('a');
    if (!anchorElement || !anchorElement.href) {
        console.warn('유효한 앵커 요소를 찾을 수 없거나 href 속성이 없습니다.');
        return;
    }
    const targetUrl = event.target.href;
    console.log('targetUrl:', event.target.href);

    // URL에 캘리브레이션 데이터가 있는지 확인
    const urlParams = new URLSearchParams(window.location.search);
    const calibrationData = urlParams.get('calibrationData');

    if (calibrationData) {
        console.log('캘리브레이션 데이터가 발견되었습니다. 디코딩하여 이동합니다:', calibrationData);
        const decodedCalibrationData = calibrationData;
        const calibrationQuery = `calibrationData=${decodedCalibrationData}`;
        const newUrl = `${targetUrl}${'?'}${calibrationQuery}`;
        console.log('새로운 URL:', newUrl);
        window.location.href = newUrl;
    } else {
        console.log('캘리브레이션 데이터가 없습니다. 그냥 이동합니다:', targetUrl);
        window.location.href = targetUrl;
    }
}

// 캘리브레이션 데이터가 없을 때 처리 함수
export function handleLinkClickFromIdx(event) {
    event.preventDefault(); // 기본 링크 동작을 막음
    const targetUrl = event.target.href;
    console.log('targetUrl:', targetUrl);

    // URL에 캘리브레이션 데이터가 있는지 확인
    const urlParams = new URLSearchParams(window.location.search);
    const calibrationData = urlParams.get('calibrationData');

    if (calibrationData) {
        console.log('캘리브레이션 데이터가 발견되었습니다. 인코딩하여 이동합니다:', calibrationData);
        const encodedCalibrationData = calibrationData;
        const calibrationQuery = `calibrationData=${encodedCalibrationData}`;
        const newUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}${calibrationQuery}`;
        console.log('새로운 URL:', newUrl);
        window.location.href = newUrl;
    } else {
        console.log('캘리브레이션 데이터가 없습니다. 캘리브레이션을 시작합니다...');
        onClickCalibrationBtn(targetUrl); // 캘리브레이션 과정 시작
    }
}


function onClickCalibrationBtn(page) {
    const userId = 'YOUR_USER_ID';
    const calibrationPoint = 5;
    EasySeeSo.openCalibrationPage(licenseKey, userId, page, calibrationPoint);
}
