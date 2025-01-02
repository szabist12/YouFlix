
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
        const date = new Date(timestamp);
        const now = new Date();

        const diffInSeconds = Math.floor((now - date) / 1000);

        const timeUnits = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        const pluralize = (count, unit) => {
            return `${count} ${unit}${count === 1 ? '' : 's'} ago`;
        };

        for (const [unit, seconds] of Object.entries(timeUnits)) {
            const value = Math.floor(diffInSeconds / seconds);

            if (value >= 1) {
                return pluralize(value, unit);
            }
        }

        return 'just now';
    }

