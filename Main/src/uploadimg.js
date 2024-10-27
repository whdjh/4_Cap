console.log("uploadimg.js loaded");

document.addEventListener("DOMContentLoaded", function() {
    // List of possible images to load randomly
    const imageSources = [
        'img/1.jpeg',
        'img/2.webp',
        'img/3.jpeg',
        'img/4.jpeg'  // Note: fixed 'jepg' typo here to 'jpeg'
    ];

    // Function to load random images
    function loadRandomImages() {
        console.log("click!"); // This will log only when the button is clicked
        
        // Select two different random images
        const randomIndex1 = Math.floor(Math.random() * imageSources.length);
        let randomIndex2 = Math.floor(Math.random() * imageSources.length);

        // Ensure the two images are different
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * imageSources.length);
        }

        // Update the image sources
        document.getElementById('displayImage').src = imageSources[randomIndex1];
        document.getElementById('heatmapImage').src = imageSources[randomIndex2];
    }

    // Add event listener to the load button
    document.getElementById('load_btn').addEventListener('click', loadRandomImages);
});