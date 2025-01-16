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
    const dislikesData = await dislikesResponse.json();
    document.getElementById("dislikes-count").textContent =
      dislikesData.dislikes || 0;
  } catch (error) {
    console.error("Error loading interactions data:", error);
  }
}

// Fetch and display comments for the post in a table
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

    if (!commentsResponse.ok) {
      throw new Error(`Error fetching comments: ${commentsResponse.statusText}`);
    }

    const commentsData = await commentsResponse.json();
    const commentsContainer = document.getElementById("comments-container");
    commentsContainer.innerHTML = ""; // Clear existing comments

    // Check if comments are present
    if (commentsData.comments && commentsData.comments.length > 0) {
      commentsData.comments.forEach((comment) => {
        const commentRow = document.createElement("tr");

        // Create a cell for the comment text
        const commentCell = document.createElement("td");
        commentCell.textContent = comment.comments; // Comment text
        commentRow.appendChild(commentCell);

        // Create a cell for the delete button
        const actionCell = document.createElement("td");

        // Create a delete button with a trash icon
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.style.backgroundColor = "red";
        deleteButton.style.color = "white";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "5px 10px";
        deleteButton.style.cursor = "pointer";

        // Adding a trash icon inside the delete button (using FontAwesome)
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash"); // Using Font Awesome's trash icon
        deleteButton.appendChild(deleteIcon);

        // Attach the click event to the delete button
        deleteButton.onclick = () => deleteComment(comment.id, postId);

        actionCell.appendChild(deleteButton);
        commentRow.appendChild(actionCell);

        // Append the row to the table body
        commentsContainer.appendChild(commentRow);
      });
    } else {
      const noCommentsRow = document.createElement("tr");
      const noCommentsCell = document.createElement("td");
      noCommentsCell.colSpan = 2;
      noCommentsCell.textContent = "No comments available.";
      noCommentsRow.appendChild(noCommentsCell);
      commentsContainer.appendChild(noCommentsRow);
    }
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}
