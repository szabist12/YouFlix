// Get videoId from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("videoId");
const videoTitle = document.getElementById("videoTitle");
const description = document.getElementById("video-description");
const uploadDate = document.getElementById("uploadDate");
const videoSource = document.getElementById("videoSource");
const videoPlayer = document.getElementById("videoPlayer");
const likeButton = document.getElementById("likeButton");
const likeCount = document.getElementById("likeCount");
const dislikeButton = document.getElementById("dislikeButton");
const dislikeCount = document.getElementById("dislikeCount");
const downloadButton = document.getElementById("downloadButton");
const commentInput = document.getElementById("commentInput");
const postCommentButton = document.querySelector(".post-btn");
const cancelButton = document.querySelector(".cancel-btn");
const commentSection = document.querySelector(".comments-section");

// Function to clear the input when cancel button is clicked
const clearInput = () => {
  commentInput.value = "";  // Clear the input field
};

// Function to handle the download button click
const handleDownloadButtonClick = () => {
  // Check if the video source URL is valid
  if (!videoSource.src) {
    alert("No video source found to download.");
    return;
  }
  // Create an anchor element to trigger the download
  const link = document.createElement("a");
  link.href = videoSource.src; // Set the video URL as the href
  link.download = videoSource.src.split('/').pop(); // Set the download filename (last part of the URL)

  // Trigger the click event on the anchor tag to start the download
  link.click();
};

let currentLikes = 0;  // Track the current number of likes
let currentDislikes = 0; // Track the current number of dislikes

// Function to load video details and comments
const loadVideo = async () => {
  if (!videoId) {
    console.error("No videoId found in the URL.");
    videoTitle.textContent = "Video not found.";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/public/post/${videoId}`);
    const video = await response.json();
    console.log(video.views);
    if (response.ok && video) {
      const timeAgoString = timeAgo(video.createdAt);
      videoTitle.textContent = video.title || "No Title Available";
      description.textContent = video.body || "No Description Available";
      uploadDate.innerHTML = `
        <span>Views: ${video.views}</span>
        <span style="margin-left: 30px;">Uploaded On: ${timeAgoString || "Unknown date"}</span>
      `;
      videoSource.src = video.filePath || "/path/to/default-video.mp4";

      // Set initial like and dislike counts
      currentLikes = video.likes || 0;
      currentDislikes = video.dislikes || 0;

      likeCount.textContent = currentLikes;
      dislikeCount.textContent = currentDislikes;

      videoPlayer.load();
      videoPlayer.play();

      // Load comments from the video data returned by the API
      loadComments(video.comments);
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

// Function to load comments from the video response
const loadComments = (comments) => {
  if (!comments) {
    console.error("No comments found.");
    return;
  }

  comments.forEach(comment => {
    const commentElement = createCommentElement(comment);
    commentSection.appendChild(commentElement);
  });
};

// Function to create HTML element for each comment
const createCommentElement = (comment) => {
  const commentElement = document.createElement("div");
  commentElement.classList.add("comment-box");

  const userAvatar = "https://via.placeholder.com/40"; // Use a real user avatar URL
  commentElement.innerHTML = `
    <img src="${userAvatar}" alt="User Avatar" class="user-avatar" />
    <div class="comment-content">
      <p>${comment.comments}</p>
    </div>
  `;
  return commentElement;
};

// Function to post a new comment
const postComment = async () => {
  const content = commentInput.value.trim();

  if (!content) {
    alert("Comment content cannot be empty.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/public/posts/${videoId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const newComment = await response.json();

    if (response.ok) {
      // Append the new comment to the comments section
      const commentElement = createCommentElement(newComment);
      commentSection.appendChild(commentElement);

      // Clear the comment input
      commentInput.value = "";
    } else {
      alert("Failed to post the comment.");
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    alert("There was an error posting your comment. Please try again later.");
  }
};

// Function to handle like button click
const handleLikeButtonClick = async () => {
  if (!videoId) {
    console.error("No videoId found in the URL.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/public/posts/${videoId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message || "Failed to like the post.");
      return;
    }

    const data = await response.json();
    currentLikes = data.likes; // Update the like count from the response
    likeCount.textContent = currentLikes; // Update the UI with the new like count
  } catch (error) {
    console.error("Error liking the post:", error);
    alert("Failed to like the post.");
  }
};

// Function to handle dislike button click
const handleDislikeButtonClick = async () => {
  if (!videoId) {
    console.error("No videoId found in the URL.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/public/posts/${videoId}/dislike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message || "Failed to dislike the post.");
      return;
    }

    const data = await response.json();
    currentDislikes = data.dislikes; // Update the dislike count from the response
    dislikeCount.textContent = currentDislikes; // Update the UI with the new dislike count
  } catch (error) {
    console.error("Error disliking the post:", error);
    alert("Failed to dislike the post.");
  }
};

// Add event listener to the cancel button
cancelButton.addEventListener("click", clearInput);

// Add event listener to the download button
downloadButton.addEventListener("click", handleDownloadButtonClick);

// Add event listener to the like and dislike button
likeButton.addEventListener("click", handleLikeButtonClick);
dislikeButton.addEventListener("click", handleDislikeButtonClick);

// Add event listener for posting a comment
postCommentButton.addEventListener("click", postComment);

// Load video when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadVideo);
