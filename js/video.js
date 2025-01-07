const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("videoId");

const videoTitle = document.getElementById("videoTitle");
const description = document.getElementById("video-description");
const uploadDate = document.getElementById("uploadDate");
const videoSource = document.getElementById("videoSource");
const videoPlayer = document.getElementById("videoPlayer");

const loadVideo = async () => {
  if (!videoId) {
    console.error("No videoId found in the URL.");
    videoTitle.textContent = "Video not found.";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/public/posts/${videoId}`);
    const video = await response.json();

    if (response.ok && video) {
      const timeAgoString = timeAgo(video.createdAt);
      videoTitle.textContent = video.title || "No Title Available";
      description.textContent = video.body || "No Description Available";
      uploadDate.textContent = `Uploaded on: ${timeAgoString || "Unknown date"}`;
      videoSource.src = video.filePath || "/path/to/default-video.mp4";

      videoPlayer.load();
      videoPlayer.play();
    } else {
      throw new Error("Video data not found or invalid.");
    }
  } catch (error) {
    console.error("Error loading video:", error);
    videoTitle.textContent = "Error loading video.";
    description.textContent = "Please try again later.";
    videoSource.src = "";
  }
};

document.addEventListener("DOMContentLoaded", loadVideo);