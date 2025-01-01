        document.getElementById("video-file").addEventListener("change", function (event) {
          const file = event.target.files[0];
          const preview = document.getElementById("video-preview");
          const objectURL = URL.createObjectURL(file);
          preview.src = objectURL;
        });



        document
        .getElementById("upload-form")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          const url = "http://localhost:3000/admin/createpost";

          const title = document.getElementById("video-title").value;
          const body = document.getElementById("video-description").value;
          const fileInput = document.getElementById("video-file");
          const file = fileInput.files[0];

          if (!file) {
            alert("Please select a file to upload!");
            return;
          }

          const formData = new FormData();
          formData.append("title", title);
          formData.append("body", body);
          formData.append("filepath", file);

          try {
            const response = await fetch(url, {
              method: "POST",
              body: formData,
            });

            const result = await response.json();

            if (response.ok) {
              window.location.href = "list.html";
            } else {
              alert(result.message || "Failed to create post!");
            }
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating the post.");
          }
        });
