// Get DOM elements
const videoInput = document.getElementById('video-file');
const videoPreview = document.getElementById('video-preview');

// Preview video when selected
videoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const videoURL = URL.createObjectURL(file);
        videoPreview.src = videoURL;
    }
});
