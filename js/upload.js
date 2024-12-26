document
        .getElementById("video-file")
        .addEventListener("change", function (event) {
          const file = event.target.files[0];
          const preview = document.getElementById("video-preview");
          const objectURL = URL.createObjectURL(file);
          preview.src = objectURL;
        });