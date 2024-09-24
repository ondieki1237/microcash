 // Signin function
 document.querySelector('.submit_signup').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get signin form values
    const idNumber = document.getElementById('idNumber').value;
    const password = document.getElementById('password').value;

    try {
      // Send signin data to backend
      const response = await fetch('http://localhost:3000/api/member_signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idNumber,
          password,
        }),
      });

      // Parse the JSON response
      const data = await response.json();

      if (response.ok) {
        alert('Sign-in successful!');
        // Redirect to dashboard or another page if needed
        window.location.href = '/dashboard'; // Example redirect
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert('Server error, please try again later.');
    }
  });