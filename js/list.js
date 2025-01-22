if(localStorage.getItem('authToken')==null){
  window.location.href = 'login.html';
}else{
  loadPosts();
};

// Adding an event listener to the logout link
document.getElementById('logoutLink').addEventListener('click', function(e) {
  // Prevent the default action of the link (navigation)
  e.preventDefault();

  // Clear the local storage
  localStorage.clear();

  // Optionally, navigate to the login page after clearing the local storage
  window.location.href = 'login.html';
});

// Fetch the posts data from the API and display it
async function loadPosts(page = 1, pageSize = 10) {
  try {
    const response = await fetch(`http://localhost:3000/admin/posts/user?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      }
    });

    const data = await response.json();

    if (data.posts && data.posts.length > 0) {
      // Clear the previous content
      const postsContainer = document.getElementById('posts-container');
      postsContainer.innerHTML = ''; // Clear any existing posts

      // Display each post dynamically
      data.posts.forEach(post => {
        const postRow = document.createElement('div');
        postRow.classList.add('row');
        postRow.id = `post-${post.id}`;  // Add unique ID for easy removal later

        const postContentLeft = document.createElement('div');
        postContentLeft.classList.add('content-left');

        const postTitle = document.createElement('h2');
        postTitle.classList.add('title');
        postTitle.textContent = post.title;

        const postBody = document.createElement('p');
        postBody.classList.add('body');
        postBody.textContent = post.body;

        postContentLeft.appendChild(postTitle);
        postContentLeft.appendChild(postBody);

        const postButtons = document.createElement('div');
        postButtons.classList.add('buttons');

        const interactionsButton = document.createElement('button');
        interactionsButton.classList.add('btn');
        interactionsButton.textContent = 'Interactions';

        interactionsButton.addEventListener('click', () => {
          window.location.href = `/interaction.html?postId=${post.id}`;
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.textContent = 'Delete';

        // Add event listener to delete button
        deleteButton.addEventListener('click', async () => {
          try {
            const deleteResponse = await fetch(`http://localhost:3000/admin/deletepost/${post.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              }
            });

            const deleteData = await deleteResponse.json();

            if (deleteResponse.ok) {
              // Remove the post row from the UI
              postRow.remove();
              alert('Post deleted successfully');
            } else {
              alert(deleteData.message || 'Failed to delete the post');
            }
          } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again later.');
          }
        });

        const updateButton = document.createElement('button');
        updateButton.classList.add('btn');
        updateButton.textContent = 'Update';

        // Add event listener to update button
        updateButton.addEventListener('click', () => {
          window.location.href = `/upload.html?postId=${post.id}`; // Navigate to upload.html with postId
        });

        postButtons.appendChild(interactionsButton);
        postButtons.appendChild(deleteButton);
        postButtons.appendChild(updateButton);

        postRow.appendChild(postContentLeft);
        postRow.appendChild(postButtons);

        postsContainer.appendChild(postRow);
      });

      // Pagination
      const paginationContainer = document.getElementById('pagination-container');
      paginationContainer.innerHTML = ''; // Clear previous pagination controls

      const totalPage = data.totalPage; // Assuming you get totalPage from API response

      if (totalPage > 1) {
        // Create Previous button
        const prevButton = document.createElement('button');
        prevButton.classList.add('pagination-btn');
        prevButton.textContent = 'Previous';
        prevButton.disabled = page === 1;
        prevButton.onclick = () => loadPosts(page - 1, pageSize);

        // Create Next button
        const nextButton = document.createElement('button');
        nextButton.classList.add('pagination-btn');
        nextButton.textContent = 'Next';
        nextButton.disabled = page === totalPage;
        nextButton.onclick = () => loadPosts(page + 1, pageSize);

        paginationContainer.appendChild(prevButton);

        // Add page numbers
        for (let i = 1; i <= totalPage; i++) {
          const pageButton = document.createElement('button');
          pageButton.classList.add('pagination-btn');
          pageButton.textContent = i;
          pageButton.onclick = () => loadPosts(i, pageSize);
          if (i === page) {
            pageButton.classList.add('active');
          }
          paginationContainer.appendChild(pageButton);
        }

        paginationContainer.appendChild(nextButton);
      }
    } else {
      const postsContainer = document.getElementById('posts-container');
      postsContainer.innerHTML = '<h2>No posts available.</h2>';
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    alert('Failed to load posts. Please try again later.');
  }
}


