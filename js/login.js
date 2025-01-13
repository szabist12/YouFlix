document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = "http://localhost:3000/public/login";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
      username,
      password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log(result);

      if (response.ok) {

        // Successful login, get the token from the response
        const token = result.token; // This is the JWT token
        // Store the token in localStorage or sessionStorage
        localStorage.setItem('authToken', token);

        window.location.href = "list.html";
      } else {
        alert(result.message || "Login failed! Invalid credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login.");
    }
  });
