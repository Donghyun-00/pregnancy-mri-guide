document.addEventListener('DOMContentLoaded', function () {
    // Show the modal on page load
    const modal = document.getElementById('name-modal');
    const welcomeMessage = document.getElementById('welcome-message');
    const userNameInput = document.getElementById('user-name');
    const submitButton = document.getElementById('submit-name');
    let userName = '';

    modal.style.display = 'flex'; // Show modal

    // Handle submit button click
    submitButton.addEventListener('click', function () {
        handleNameSubmission();
    });

    // Handle "Enter" key press for submission
    userNameInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            handleNameSubmission();
        }
    });

    // Function to handle name submission
    function handleNameSubmission() {
        userName = userNameInput.value.trim();

        if (userName) {
            welcomeMessage.textContent = `Welcome, ${userName}!`;
        } else {
            welcomeMessage.textContent = `Welcome!`;
        }
        modal.style.display = 'none'; // Hide modal
    }

    function updateBackground() {
        if (window.innerWidth <= 768) {
            document.body.style.background = "url('mobile_background.jpeg') no-repeat center center";
            document.body.style.backgroundSize = "cover";
        } else {
            document.body.style.background = "url('background image.jpeg') no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
        }
    }

    // Run on page load and resize
    updateBackground();
    window.addEventListener('resize', updateBackground);

    // Handle checklist completion
    const checklistItems = document.querySelectorAll('#preparation-checklist input[type="checkbox"]');
    const successPopup = document.getElementById('success-popup');
    const successMessage = document.getElementById('success-message');

    checklistItems.forEach(item => {
        item.addEventListener('change', function () {
            const allChecked = Array.from(checklistItems).every(checkbox => checkbox.checked);
            if (allChecked) {
                const name = userName || 'User'; // Use the user's name or fallback to "User"
                successMessage.innerHTML = `
                    <p>Great job, ${name}! You’ve completed all the necessary preparations for your MRI scan.</p>
                    <p>Thank you for taking the time to prepare!</p>
                `;
                successPopup.style.display = 'block'; // Show pop-up
            }
        });
    });
});

// Function to close the success pop-up
function closePopup() {
    const successPopup = document.getElementById('success-popup');
    successPopup.style.display = 'none';
}

function showSection(sectionId) {
    document.getElementById('home').style.display = 'none';
    const sections = document.querySelectorAll('.container');
    sections.forEach(section => section.style.display = 'none');
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showHome() {
    const sections = document.querySelectorAll('.container');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById('home').style.display = 'block';
}

// Show/Hide the "Back to Top" button based on scroll position
window.onscroll = function () {
    const backToTopButton = document.getElementById('back-to-top');
    if (window.scrollY > 100) { // Show the button after scrolling down 300px
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to dynamically collect all card content and search it
function searchKeyword() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results
    resultsContainer.style.display = 'none';

    if (input === '') return;

    const matches = [];

    // Dynamically search across all sections
    const sections = document.querySelectorAll('.container');
    sections.forEach(section => {
        const sectionId = section.id;
        const sectionName = section.querySelector('h2')?.textContent || 'Unknown Section';
        const cards = section.querySelectorAll('.content-card');

        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || 'Untitled Card';
            const content = card.textContent.toLowerCase();

            if (content.includes(input)) {
                matches.push({
                    section: sectionName,
                    id: sectionId,
                    title,
                    snippet: getSnippet(content, input)
                });
            }
        });
    });

    if (matches.length > 0) {
        resultsContainer.style.display = 'block';
        matches.forEach(match => {
            const resultItem = document.createElement('div');
            resultItem.innerHTML = `
                <div style="padding: 0.5rem 1rem; cursor: pointer; border-bottom: 1px solid #eee;">
                    <strong>${match.section}:</strong> ${match.title}
                    <div style="font-size: 0.9rem; color: #555;">"${match.snippet}"</div>
                </div>`;
            resultItem.onclick = () => navigateToSection(match.id, match.title);
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.style.display = 'block';
        const noResult = document.createElement('div');
        noResult.textContent = 'No matching sections found';
        noResult.style.padding = '0.5rem 1rem';
        noResult.style.color = '#888';
        resultsContainer.appendChild(noResult);
    }
}

// Function to extract a short snippet around the keyword
function getSnippet(content, keyword) {
    const index = content.indexOf(keyword);
    const snippetStart = Math.max(0, index - 20);
    const snippetEnd = Math.min(content.length, index + 30);
    const snippet = content.substring(snippetStart, snippetEnd);

    // Highlight the keyword using a <span> with styling
    const highlightedSnippet = snippet.replace(
        new RegExp(keyword, 'gi'), // Match keyword case-insensitively
        match => `<span style="font-weight: bold; color: #ff4500;">${match}</span>`
    );

    return snippet.length > 50 ? `${highlightedSnippet.trim()}...` : highlightedSnippet.trim();
}

// Navigate to the selected section
function navigateToSection(sectionId, cardTitle) {
    document.getElementById('search-input').value = ''; // Clear input
    document.getElementById('search-results').style.display = 'none'; // Hide dropdown
    showSection(sectionId); // Navigate to the section

    // Find the card with the specific title and scroll to it
    const targetCard = Array.from(document.querySelectorAll(`#${sectionId} .content-card`)).find(card =>
        card.querySelector('h3')?.textContent === cardTitle
    );

    if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.boxShadow = '0 0 20px 5px #ffcc00'; // Highlight the card
        setTimeout(() => (targetCard.style.boxShadow = ''), 4000); // Remove highlight after 2s
    }
}

// Function to save and restore checklist state
document.querySelectorAll('#preparation-checklist input[type="checkbox"]').forEach(checkbox => {
    // Save state to localStorage on change
    checkbox.addEventListener('change', () => {
        localStorage.setItem(checkbox.id, checkbox.checked);
    });

    // Restore state from localStorage
    checkbox.checked = localStorage.getItem(checkbox.id) === 'true';
});

// Reset Button Functionality
document.getElementById('reset-button').addEventListener('click', () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false; // Uncheck all boxes
        localStorage.removeItem(checkbox.id); // Remove saved states
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(error => console.error('Service Worker Registration Failed:', error));
  }