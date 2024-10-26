console.log("uploadimg.js loaded");

document.addEventListener("DOMContentLoaded", function() {
    const imageSources = [
        'img/1.jpeg',
        'img/2.webp',
        'img/3.jpeg',
        'img/4.jpeg'  
    ];

    function loadRandomImages() {
        console.log("click!");
        
        const randomIndex1 = Math.floor(Math.random() * imageSources.length);
        let randomIndex2 = Math.floor(Math.random() * imageSources.length);

        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * imageSources.length);
        }

        document.getElementById('displayImage').src = imageSources[randomIndex1];
        document.getElementById('heatmapImage').src = imageSources[randomIndex2];
    }

    document.getElementById('load_btn').addEventListener('click', loadRandomImages);
});