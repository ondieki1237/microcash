
document.querySelector('.submit_signup').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the input values
    const microfinanceNumber = document.getElementById('microfinanceNumber').value;
    const password = document.getElementById('password').value;

    try {
      // Send a POST request to the /signin route
      const response = await fetch('http://localhost:3000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ microfinanceNumber, password }),
      });

      // Parse the JSON response
      const data = await response.json();

      // Handle the response
      if (response.ok) {
        alert('Login successful');
        // You can redirect to a dashboard or another page if needed
        window.location.href = 'microAccount.html'; // Example redirect
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error, please try again later.');
    }
  });