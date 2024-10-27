import 'regenerator-runtime/runtime';
import * as address from './address'

document.addEventListener('DOMContentLoaded', () => {

    const imgCaseButton = document.getElementById('toimg'); // 이미지 버튼
    const heatCaseButton = document.getElementById('toheatmap'); // 텍스트 버튼
    const textCaseButton = document.getElementById('totext'); // 텍스트 버튼

    if (heatCaseButton) {
        heatCaseButton.addEventListener('click', address.handleLinkClickFromIdx);
    }
    if (imgCaseButton) {
        imgCaseButton.addEventListener('click', address.handleLinkClickFromIdx);
    }
    if (textCaseButton) {
        textCaseButton.addEventListener('click', address.handleLinkClickFromIdx);
    }
});