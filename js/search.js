document.addEventListener("DOMContentLoaded", () => {
    const videoGrid = document.querySelector(".video-grid");
    const paginationDiv = document.querySelector(".pagination");
    const loadingSpinner = document.getElementById("loading");
    const searchInput = document.getElementById("search-input");

    let currentPage = 1;
    let totalPages = 0;
    let keyword = new URLSearchParams(window.location.search).get("keyword") || "";

    // Pre-fill search input with keyword
    searchInput.value = keyword;

    // Fetch data from the API based on keyword and page
    const fetchVideos = async () => {
      if (!keyword) {
        videoGrid.innerHTML = '<p>No keyword provided. Please search again.</p>';
        return;
      }

      const url = new URL("http://localhost:3000/public/filterVideo");
      const params = {
        keyword,
        page: currentPage,
        pageSize: 8
      };
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      try {
        loadingSpinner.style.display = 'block'; // Show loading spinner
        videoGrid.innerHTML = '<p>Loading videos...</p>'; // Show loading message

        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 200) {
          totalPages = data.totalPages;
          renderVideos(data.paginatedBlog); // Render the video cards
          renderPagination(); // Render pagination buttons
        } else {
          videoGrid.innerHTML = '<p>No videos found.</p>';
          paginationDiv.innerHTML = '';
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        videoGrid.innerHTML = '<p>Something went wrong. Please try again later.</p>';
      } finally {
        loadingSpinner.style.display = 'none'; // Hide loading spinner
      }
    };

    // Render the video grid
    const renderVideos = (videos) => {
      videoGrid.innerHTML = ''; // Clear existing content
      videos.forEach(video => {
        const timeAgoString = timeAgo(video.createdAt);

        // Create the video card element
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-item");

        // Create the link for the video card
        const videoLink = document.createElement("a");
        videoLink.href = `video.html?videoId=${video.id}`;
        videoLink.classList.add("video-card-link");

        // Create the views count and time ago
        const viewsCount = document.createElement('p');
        viewsCount.id = `views-count-${video.id}`;
        viewsCount.textContent = `${video.views || '0'} views • ${timeAgoString || 'Unknown date'}`;

        // Set the content of the video card
        videoLink.innerHTML = `
          <img src="${video.thumbnail || 'https://via.placeholder.com/300x180'}" alt="${video.title}" class="video-thumbnail" style="width: 300px; height: 180px;">
          <div class="info">
            <h3>${video.title}</h3>
            <p>${video.body || 'Unknown Channel'}</p>
          </div>
        `;
        // Append the views count element
        videoLink.appendChild(viewsCount);

        // Add event listener to update views when clicked
        videoCard.addEventListener("click", () => {
          updateVideoViews(video.id); // Trigger view update
        });

        // Append the video link to the video card
        videoCard.appendChild(videoLink);

        // Append the video card to the video grid
        videoGrid.appendChild(videoCard);
      });
    };

    // Render pagination buttons
    const renderPagination = () => {
      paginationDiv.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage('prev')">Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage('next')">Next</button>
      `;
    };

    // Change the page number (previous/next)
    window.changePage = (direction) => {
      // Clear the video grid and show the loading spinner
      videoGrid.innerHTML = ''; // Clear existing content
      loadingSpinner.style.display = 'block'; // Show loading spinner

      if (direction === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
      }
      fetchVideos(); // Fetch videos for the new page
    };

    // Initial fetch on page load
    fetchVideos();

  });

  // Time Ago function to show the date in a readable format
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
        // Successfully updated the views
        alert(`Views updated: ${data.views}`);
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

  // Menu and Slider
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
