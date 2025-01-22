if(localStorage.getItem('authToken')==null){
  window.location.href = 'login.html';
}else{
  window.onload = () => {
    if (postId) {
      loadPostData(postId);  // Load existing post data if postId is present
    }
  };
};
const videoFileInput = document.getElementById("video-file");
const videoPreview = document.getElementById("video-preview");
const uploadForm = document.getElementById("upload-form");
const postId = new URLSearchParams(window.location.search).get("postId");
const token = localStorage.getItem('authToken');
const submitButton = document.getElementById("submit-button");

if (postId) {
  console.log(postId);
  // Change button text to 'Update Video'
  submitButton.textContent = "Update Video";
}
uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();  // Prevent default form submission behavior

  // Handle the appropriate action based on the presence of postId
  if (postId) {
    // If postId exists, update the post
    update();
  } else {
    // Otherwise, create a new post
    uploadPost();
  }
});
// Video file preview
videoFileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("video/")) {
    const videoURL = URL.createObjectURL(file);
    videoPreview.src = videoURL;
  }
});

// Upload post (for creating new post)
async function uploadPost() {
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
}
// 1. Load existing data (GET request) when the page is loaded
async function loadPostData(postId) {
  console.log(postId);
  if (postId) {
    try {
      const response = await fetch(`http://localhost:3000/admin/videopost/${postId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Populate the form with existing post data
        document.getElementById("video-title").value = data.existingPost.title;
        document.getElementById("video-description").value = data.existingPost.body;
        // Optionally set the video and thumbnail preview here

      } else {
        alert("Failed to load post: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
      alert("An error occurred. Please try again.");
    }
  }
}

// // 2. Update the post (PUT request) when the form is submitted
// async function update() {

//   if (!token) {
//     console.error('No token found. User is not authenticated.');
//     return;
//   }

//   const formData = new FormData();
//   formData.append("title", document.getElementById("video-title").value);
//   formData.append("body", document.getElementById("video-description").value);

//   if (postId) {
//     // If postId exists, it's an update
//     formData.append("video", document.getElementById("video-file").files[0]);
//     formData.append("thumbnail", document.getElementById("image-file").files[0]);
//     console.log(formData);
//     try {
//       const response = await fetch(`http://localhost:3000/admin/updatepost/${postId}`, {
//         method: "PUT",
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         uploadForm.reset(); // Reset form after successful update
//         videoPreview.src = ""; // Clear video preview if necessary
//         window.location.href = "list.html"; // Redirect after successful update
//       } else {
//         alert("Failed to update video: " + data.message);
//       }
//     } catch (error) {
//       console.error("Error updating post:", error);
//       alert("An error occurred. Please try again.");
//     }
//   } else {
//     // If there's no postId in the URL, create a new post
//     formData.append("video", document.getElementById("video-file").files[0]);
//     formData.append("thumbnail", document.getElementById("image-file").files[0]);
//   }
// }
// Call loadPostData function when the page is loaded to populate form data

async function update() {
  if (!token) {
    console.error('No token found. User is not authenticated.');
    return;
  }

  const title = document.getElementById("video-title").value;
  const body = document.getElementById("video-description").value;

  const newdata = {
    title,
    body,
  };

  if (!postId) {
    console.error('No postId provided.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/admin/updatepost/${postId}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',  // Ensure content-type is set to JSON
      },
      body: JSON.stringify(newdata),
    });

    const data = await response.json();

    if (response.ok) {
      uploadForm.reset(); // Reset form after successful update
      videoPreview.src = ""; // Clear video preview if necessary
      window.location.href = "list.html"; // Redirect after successful update
    } else {
      alert("Failed to update video: " + data.message);
    }
  } catch (error) {
    console.error("Error updating post:", error);
    alert("An error occurred. Please try again.");
  }
}

