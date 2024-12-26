/* script.js */
//slider icon menu
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
      
      //dropdown menu on avatar icon
      // Toggle the dropdown menu on avatar click
      userAvatar.addEventListener("click", () => {
        dropdownMenu.classList.toggle("active");
      });
      
      // Close the dropdown menu if clicked outside
      window.addEventListener("click", (e) => {
        if (!userAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownMenu.classList.remove("active");
        }
      });
      