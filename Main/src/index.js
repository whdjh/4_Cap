// import GazEmo from './gazeEmoClass.js';
import * as adress from './address.js';

document.querySelectorAll('.btn.watch-btn, .btn.cali-btn').forEach((button) => {
    button.addEventListener('click', () => {
        adress.checkCali
    });
});