const menuBtn = document.getElementById("menu-btn");
const slider = document.getElementById("slider");
let isMouseInside = false;

menuBtn.addEventListener("click", () => slider.classList.add("open"));
menuBtn.addEventListener("mouseenter", () => (isMouseInside = true));
slider.addEventListener("mouseenter", () => (isMouseInside = true));
menuBtn.addEventListener("mouseleave", () => {
  isMouseInside = false;
  setTimeout(() => {
    if (!isMouseInside) slider.classList.remove("open");
  }, 300);
});
slider.addEventListener("mouseleave", () => {
  isMouseInside = false;
  setTimeout(() => {
    if (!isMouseInside) slider.classList.remove("open");
  }, 300);
});

const userAvatar = document.getElementById("user-avatar-img");
const dropdownMenu = document.getElementById("dropdown-menu");

userAvatar.addEventListener("click", () => {
  dropdownMenu.classList.toggle("active");
});

window.addEventListener("click", (e) => {
  if (!userAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove("active");
  }
});

// Function to update the views via the API
async function updateVideoViews(postId) {
  try {
    const response = await fetch(`http://localhost:3000/public/posts/${postId}/views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Update the view count in the UI (assuming you have a view count element)
      const viewCountElement = document.querySelector(`#views-count-${postId}`);
      if (viewCountElement) {
        viewCountElement.innerText = `Views: ${data.views}`;
      }
    } else {
      // Handle error response from the API
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error updating views:', error);
    alert('An error occurred while updating views.');
  }
}

const loadVideos = async (page = 1, keyword = '') => {
  const videoGrid = document.querySelector(".video-grid");
  const loadingSpinner = document.getElementById("loading");
  const url = new URL("http://localhost:3000/public/posts");

  // Add page number and keyword to URL
  url.searchParams.set("page", page);
  if (keyword) {
    url.searchParams.set("keyword", keyword);
  }

  try {
    loadingSpinner.style.display = "block";  // Ensure the spinner is visible
    videoGrid.innerHTML = ""; // Clear existing content

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      if (data.paginationVideo && data.paginationVideo.length > 0) {
        data.paginationVideo.forEach((video) => {
          const timeAgoString = timeAgo(video.createdAt);
          const videoCard = document.createElement("div");
          videoCard.classList.add("video-card");

          const videoLink = document.createElement("a");
          videoLink.href = `video.html?videoId=${video.id}`;
          videoLink.classList.add("video-card-link");
          const viewsCount = document.createElement('p');
          viewsCount.id = `views-count-${video.id}`;
          videoLink.innerHTML = `
          <div class="thumbnail-container">
            <img src="${video.thumbnail || 'https://via.placeholder.com/300x180'}" alt="Video Thumbnail" />
            <div class="play-icon">
              <i class="fa fa-play"></i>
            </div>
          </div>
          <div class="info">
            <h3>${video.title}</h3>
            <p>${video.body || 'Unknown Channel'}</p>
            <p id="views-count-${video.id}">${video.views || '0'} views • ${timeAgoString || 'Unknown date'}</p>
          </div>
        `;

          // Add event listener to update views when clicked
          videoCard.addEventListener("click", () => {
            updateVideoViews(video.id); // Trigger view update
          });

          videoCard.appendChild(videoLink);
          videoGrid.appendChild(videoCard);
        });

        // Add pagination UI
        if (data.totalPage > 1) {
          const paginationContainer = document.querySelector(".pagination");
          paginationContainer.innerHTML = ""; // Clear existing pagination

          // Render page buttons
          for (let i = 1; i <= data.totalPage; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            if (i === page) {
              pageButton.classList.add("active");
            }
            pageButton.addEventListener("click", () => {
              loadVideos(i, keyword); // Reload with the selected page
            });
            paginationContainer.appendChild(pageButton);
          }
        }
      } else {
        videoGrid.innerHTML = `<p>No videos found.</p>`;
      }
    } else {
      console.error("Failed to fetch videos:", data.message);
      videoGrid.innerHTML = `<p>Failed to load videos. Please try again later.</p>`;
    }
  } catch (error) {
    console.error("Error loading videos:", error);
    videoGrid.innerHTML = `<p>An error occurred while loading videos.</p>`;
  } finally {
    loadingSpinner.style.display = "none";  // Hide spinner after loading is finished
  }
};

// Function for handling search button click
document.addEventListener("DOMContentLoaded", () => {
  loadVideos(); // Initial load with no search

  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  // Search button click event
  searchButton.addEventListener("click", () => {
    const keyword = searchInput.value.trim();
    if (keyword) {
      // Redirect to the results page with the search keyword in the URL
      window.location.href = `search.html?keyword=${encodeURIComponent(keyword)}`;
    }
  });

  // Handle Enter key press for search
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchButton.click();
    }
  });
});

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

  if (seconds >= 365 * 24 * 60 * 60) {
    const count = Math.floor(seconds / (365 * 24 * 60 * 60));
    return count === 1 ? `${count} year ago` : `${count} years ago`;
  } else if (seconds >= 30 * 24 * 60 * 60) {
    const count = Math.floor(seconds / (30 * 24 * 60 * 60));
    return count === 1 ? `${count} month ago` : `${count} months ago`;
  } else if (seconds >= 7 * 24 * 60 * 60) {
    const count = Math.floor(seconds / (7 * 24 * 60 * 60));
    return count === 1 ? `${count} week ago` : `${count} weeks ago`;
  } else if (seconds >= 24 * 60 * 60) {
    const count = Math.floor(seconds / (24 * 60 * 60));
    return count === 1 ? `${count} day ago` : `${count} days ago`;
  } else if (seconds >= 60 * 60) {
    const count = Math.floor(seconds / (60 * 60));
    return count === 1 ? `${count} hour ago` : `${count} hours ago`;
  } else if (seconds >= 60) {
    const count = Math.floor(seconds / 60);
    return count === 1 ? `${count} minute ago` : `${count} minutes ago`;
  } else {
    return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
  }
}
