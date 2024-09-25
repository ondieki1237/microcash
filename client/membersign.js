
  // Signup function
  document.querySelector('.submit_signup').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const idNumber = document.getElementById('idNumber').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const microfinanceNumber = document.getElementById('microfinanceNumber').value;
    const password = document.getElementById('password').value;

    try {
      // Send signup data to backend
      const response = await fetch('http://localhost:3000/api/member_signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          idNumber,
          phoneNumber,
          microfinanceNumber,
          password,
        }),
      });

      // Parse the JSON response
      const data = await response.json();

      if (response.ok) {
        alert('Signup successful!');
        // Redirect to dashboard or another page if needed
        window.location.href = 'profile.html'; // Example redirect
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Server error, please try again later.');
    }
  });

 