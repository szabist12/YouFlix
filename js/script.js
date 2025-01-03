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




      const loadVideos = async () => {
        const videoGrid = document.querySelector(".video-grid");

        try {
          const response = await fetch("http://localhost:3000/public/posts");
          const videos = await response.json();

          if (response.ok) {
            videoGrid.innerHTML = "";

            if (videos.length > 0) {
              videos.forEach((video) => {
                const timeAgoString = timeAgo(video.createdAt);
                const videoCard = document.createElement("div");
                videoCard.classList.add("video-card");


                const videoLink = document.createElement("a");
                videoLink.href = `video.html?videoId=${video.id}`;
                videoLink.classList.add("video-card-link");

                videoLink.innerHTML = `
                  <img src="${video.thumbnail || 'https://via.placeholder.com/300x180'}" alt="Video Thumbnail" />
                  <div class="info">
                    <h3>${video.title}</h3>
                    <p>${video.body || 'Unknown Channel'}</p>
                    <p>${video.views || '0'} views • ${timeAgoString || 'Unknown date'}</p>
                  </div>
                `;

                videoCard.appendChild(videoLink);
                videoGrid.appendChild(videoCard);
              });
            } else {
              videoGrid.innerHTML = `<p>No videos found.</p>`;
            }
          } else {
            console.error("Failed to fetch videos:", videos.message);
            videoGrid.innerHTML = `<p>Failed to load videos. Please try again later.</p>`;
          }
        } catch (error) {
          console.error("Error loading videos:", error);
          videoGrid.innerHTML = `<p>An error occurred while loading videos.</p>`;
        }
      };

      document.addEventListener("DOMContentLoaded", loadVideos);


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



