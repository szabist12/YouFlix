
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
                    <p>${video.views || '0'} views • ${video.createdAt || 'Unknown date'}</p>
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

      // Load videos when the page loads
      document.addEventListener("DOMContentLoaded", loadVideos);
