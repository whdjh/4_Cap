import "regenerator-runtime/runtime";
import * as heatmap from "./draw-heatmap";
import * as address from "./address";
import GazEmo from "./gazeEmoClass";

/* 키값입력
const licenseKey = "";
*/
const redirectUrl = "http://localhost:8082/imgcase.html";
export const gazEmo = new GazEmo(licenseKey, redirectUrl);

document.addEventListener("DOMContentLoaded", async () => {
  const videoElement = document.getElementById("video");
  await gazEmo.initialize(videoElement);
  await gazEmo.startGazEmo();

  document.getElementById("exit_btn").addEventListener(
    "click",
    () => {
      gazEmo.stopGazEmo();
      heatmap.createEmotionHeatmap(gazEmo.getGazEmoData());
    },
    { once: true }
  );

  const indexBtn = document.getElementById("toindex");
  indexBtn.addEventListener("click", address.handleLinkClickToIdx);
});
