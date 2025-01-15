// Initialize the page
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('postId'); // Get postId from query string

  if (postId) {
    console.log(postId);
    loadInteractions(postId);
    loadComments(postId);
  } else {
    alert('Post ID not found.');
  }
};

// Fetch and display interactions (views, likes, dislikes)
async function loadInteractions(postId) {
  try {
    // Fetch views count
    const viewsResponse = await fetch(
      `http://localhost:3000/admin/post/${postId}/postviews`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      }
    );

    const viewsData = await viewsResponse.json();
    document.getElementById("views-count").textContent =
      viewsData.views || 0;

    // Fetch likes count
    const likesResponse = await fetch(
      `http://localhost:3000/admin/post/${postId}/like`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      }
    );
    const likesData = await likesResponse.json();
    document.getElementById("likes-count").textContent =
      likesData.likes || 0;

    // Fetch dislikes count
    const dislikesResponse = await fetch(
      `http://localhost:3000/admin/post/${postId}/dislike`,  {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      }
    );
    console.log(dislikesResponse);
    console.log('**************');
    const dislikesData = await dislikesResponse.json();
    console.log(dislikesData);
    document.getElementById("dislikes-count").textContent =
      dislikesData.dislikes || 0;
  } catch (error) {
    console.error("Error loading interactions data:", error);
  }
}

// Fetch and display comments for the post
async function loadComments(postId) {
  try {
    // Fetch comments for the post
    const commentsResponse = await fetch(
      `http://localhost:3000/admin/post/${postId}/comments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      }
    );
    const commentsData = await commentsResponse.json();

    const commentsContainer =
      document.getElementById("comments-container");
    commentsContainer.innerHTML = ""; // Clear existing comments

    commentsData.forEach((comment) => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      const commentText = document.createElement("p");
      commentText.textContent = comment.text;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete Comment";
      deleteButton.classList.add("delete-btn");
      deleteButton.onclick = () => deleteComment(comment.id, postId);

      commentDiv.appendChild(commentText);
      commentDiv.appendChild(deleteButton);

      commentsContainer.appendChild(commentDiv);
    });
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}
