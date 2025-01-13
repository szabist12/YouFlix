// Video file preview
const videoFileInput = document.getElementById("video-file");
const videoPreview = document.getElementById("video-preview");

videoFileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("video/")) {
    const videoURL = URL.createObjectURL(file);
    videoPreview.src = videoURL;
  }
});

// Form submission
const uploadForm = document.getElementById("upload-form");
uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }

    const formData = new FormData();
    formData.append("title", document.getElementById("video-title").value);
    formData.append("body", document.getElementById("video-description").value);
    formData.append("video", document.getElementById("video-file").files[0]);
    formData.append("thumbnail", document.getElementById("image-file").files[0]);

    try {
      const response = await fetch("http://localhost:3000/admin/createpost", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        uploadForm.reset(); // Reset form
        videoPreview.src = ""; // Clear video preview
        window.location.href = "list.html"; // Redirect after successful upload
      } else {
        alert("Failed to upload video: " + data.message);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("An error occurred. Please try again.");
    }
  });


