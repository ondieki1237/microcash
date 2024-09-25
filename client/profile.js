// Function to post a new contribution
async function postContribution(memberId, debit, credit, narration) {
    try {
      const response = await fetch('http://localhost:3000/api/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId,
          debit,
          credit,
          narration,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Contribution recorded:', data);
        return data; // Return the newly created contribution
      } else {
        console.error('Failed to post contribution:', data.message);
      }
    } catch (error) {
      console.error('Error posting contribution:', error);
    }
  }
  
  // Function to get all contributions for a specific member
  async function getContributions(memberId) {
    try {
      const response = await fetch(`http://localhost:3000/api/contributions/${memberId}`, {
        method: 'GET',
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Contributions fetched:', data);
        renderContributions(data); // Call a function to display contributions
      } else {
        console.error('Failed to fetch contributions:', data.message);
      }
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  }
  
  // Function to update a contribution
  async function updateContribution(id, debit, credit, narration) {
    try {
      const response = await fetch(`http://localhost:3000/api/contributions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          debit,
          credit,
          narration,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Contribution updated:', data);
        return data; // Return the updated contribution
      } else {
        console.error('Failed to update contribution:', data.message);
      }
    } catch (error) {
      console.error('Error updating contribution:', error);
    }
  }
  
  // Function to render the contributions in the table
  function renderContributions(contributions) {
    const contributionTable = document.querySelector('.contibutionTable');
    
    // Clear existing table rows
    contributionTable.innerHTML = `
      <div class="row header">
        <div class="cell">Date</div>
        <div class="cell">Debit</div>
        <div class="cell">Credit</div>
        <div class="cell">Narration</div>
      </div>
    `;
  
    // Populate table with contributions
    contributions.forEach(contribution => {
      const row = document.createElement('div');
      row.classList.add('row');
      
      row.innerHTML = `
        <div class="cell">${new Date(contribution.date).toLocaleDateString()}</div>
        <div class="cell">${contribution.debit}</div>
        <div class="cell">${contribution.credit}</div>
        <div class="cell">${contribution.narration}</div>
      `;
  
      contributionTable.appendChild(row);
    });
  }
  
  // Example usage:
  // Posting a new contribution
  document.querySelector('#postContributionButton').addEventListener('click', () => {
    const memberId = 'someMemberId'; // Replace with actual member ID
    const debit = parseFloat(document.querySelector('#debitInput').value);
    const credit = parseFloat(document.querySelector('#creditInput').value);
    const narration = document.querySelector('#narrationInput').value;
  
    postContribution(memberId, debit, credit, narration);
  });
  
  // Fetching contributions for a member
  document.querySelector('#getContributionsButton').addEventListener('click', () => {
    const memberId = 'someMemberId'; // Replace with actual member ID
    getContributions(memberId);
  });
  
  // Updating a contribution
  document.querySelector('#updateContributionButton').addEventListener('click', () => {
    const contributionId = 'someContributionId'; // Replace with actual contribution ID
    const debit = parseFloat(document.querySelector('#updateDebitInput').value);
    const credit = parseFloat(document.querySelector('#updateCreditInput').value);
    const narration = document.querySelector('#updateNarrationInput').value;
  
    updateContribution(contributionId, debit, credit, narration);
  });
  