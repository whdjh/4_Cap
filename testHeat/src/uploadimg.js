console.log("uploadimg.js loaded");

document.addEventListener("DOMContentLoaded", function() {
    // List of possible images to load randomly
    const imgSources = [
        'img/random/1.jpeg',
        'img/random/2.webp',
        'img/random/3.jpeg',
        'img/random/4.jpeg' // Ensure all paths are correct
    ];

    // Function to load random images
    function loadRandomImages() {
        // Select two different random images
        const randomIndex1 = Math.floor(Math.random() * imgSources.length);
        let randomIndex2 = Math.floor(Math.random() * imgSources.length);
        
        // Ensure the two images are different
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * imgSources.length);
        }

        // Update the image sources
        document.getElementById('displayImage').src = imgSources[randomIndex1];
        document.getElementById('heatmapImage').src = imgSources[randomIndex2];
    }

    // Add event listener to the load button
    document.getElementById('load_btn').addEventListener('click', function() {
        loadRandomImages(); // Call the function to load images on click
				console.log("Button clicked!"); // Log click for debugging
    });
});
