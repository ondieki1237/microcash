document.querySelector('.submit_signup').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get form values
    const microfinanceName = document.getElementById('microfinanceName').value;
    const microfinanceNumber = document.getElementById('microfinanceNumber').value;
    const numberOfMembers = document.getElementById('numberOfMembers').value;
    const location = document.getElementById('location').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      // Send a POST request to your backend signup route
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          microfinanceName,
          microfinanceNumber,
          numberOfMembers,
          location,
          password,
          confirmPassword
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Microfinance account created successfully!');
        window.location.href = 'microAccount.html';
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error, please try again later.');
    }
  });
