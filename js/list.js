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