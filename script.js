/* DOM (DOM SELECTION) */
const searchInput = document.getElementById('languageInput');
const fetchButton = document.querySelector('.btn-primary');
const resultsCanvas = document.getElementById('resultsCanvas');
const languageChips = document.querySelectorAll('.chip');
const difficultyCheckboxes = document.querySelectorAll('.checkbox-label input');

/* STATE */
const GITHUB_API_BASE = "https://api.github.com/search/issues?q=";

// Initialize the default current language by reading which node currently has the 'active-chip' class.
let currentLanguage = document.querySelector('.active-chip').textContent.trim().toLowerCase();

/* HELPER FUNCTIONS */

// Calculate time (ex: "2 days ago")
function timeSince(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

// Extract Repository Name from API URL
function extractRepoName(url) {
    // API callback: https://api.github.com/repos/facebook/react
    // turn into: facebook/react
    return url.replace('https://api.github.com/repos/', '');
}

/* UI STATES */
// Skeleton when loading
function showLoadingState() {
    // Delete the previous results
    resultsCanvas.innerHTML = '';
    
    // create 4 skeleton templates
    const skeletonHTML = `
        <article class="card glass-card issue-card skeleton-card opacity-muted">
            <div class="issue-card-header">
                <div class="skeleton-block skeleton-repo"></div>
                <div class="skeleton-block skeleton-time"></div>
            </div>
            <div class="skeleton-block skeleton-title"></div>
            <div class="badge-group">
                <div class="skeleton-block skeleton-badge"></div>
                <div class="skeleton-block skeleton-badge-small"></div>
            </div>
            <div class="issue-card-footer">
                <div class="skeleton-block skeleton-button"></div>
            </div>
        </article>
    `;
    
    for (let i = 0; i < 4; i++) {
        resultsCanvas.insertAdjacentHTML('beforeend', skeletonHTML);
    }
}

// Display a notification when an error occurs or no data is available.
function showMessageState(title, message, isError = false) {
    resultsCanvas.innerHTML = `
        <div class="card glass-card" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
            <span class="material-symbols-outlined text-${isError ? 'error' : 'tertiary'}" style="font-size: 4rem; margin-bottom: 1rem;">
                ${isError ? 'error' : 'search_off'}
            </span>
            <h3 class="headline-md mb-2">${title}</h3>
            <p class="body-md text-muted">${message}</p>
        </div>
    `;
}

/* QUERY BUILDER */
function buildSearchQuery() {
    const keyword = searchInput.value.trim();
    // Required: Find open Issues (state:open)
    let queryParts = ['state:open'];

    // Add keywords from the search box (if applicable)
    if (keyword) {
        queryParts.push(encodeURIComponent(keyword));
    }

    // Add language from the Sidebar (if available)
    if (currentLanguage) {
        queryParts.push(`language:${currentLanguage}`);
    }

    // Scan through the checkboxes to see which ones are ticked
    difficultyCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Extract text from the label (e.g., "Good First Issue" -> append to the API string)
            const labelText = checkbox.parentElement.textContent.trim();
            queryParts.push(`label:"${labelText}"`);
        }
    });

    // Concatenate everything using the "+" sign and append it to the base API link. Sort by newest (sort=created&order=desc)
    return `${GITHUB_API_BASE}${queryParts.join('+')}&sort=created&order=desc&per_page=10`;
}

/* CALL API AND REDER DATA */
async function fetchGitHubIssues() {
    showLoadingState();
    
    const apiUrl = buildSearchQuery();

    try {
        const response = await fetch(apiUrl);

        // Catch GitHub Rate Limit errors (allows only ~10 searches per minute if not logged in)
        if (response.status === 403) {
            throw new Error("GitHub API Rate Limit Exceeded. Please wait about 1 minute, then try again.");
        }
        
        if (!response.ok) {
            throw new Error(`A system error occurred: Error ${response.status}`);
        }

        const data = await response.json();
        const issues = data.items;

        // if the array is empty
        if (issues.length === 0) {
            showMessageState("No issues found", "Try changing the language or removing some filters.");
            return;
        }

        // Render the data if applicable
        renderIssues(issues);

    } catch (error) {
        showMessageState("Oops! Ran into an error.", error.message, true);
    }
}

function renderIssues(issuesArray) {
    // Clean Canvas
    resultsCanvas.innerHTML = '';

    issuesArray.forEach(issue => {
        const repoName = extractRepoName(issue.repository_url);
        const timeAgo = timeSince(issue.created_at);
        
        // Render an array of labels as HTML tags.
        const badgesHtml = issue.labels.map(label => {
            // Alternate the colors of the labels for a more aesthetic look.
            const badgeClass = label.name.includes("good first issue") ? "badge-tertiary" : "badge-primary";
            return `<span class="badge ${badgeClass}">${label.name}</span>`;
        }).join('');

        // Create an HTML structure for each Card (using dynamic Template Literals).
        const cardHTML = `
            <article class="card glass-card issue-card border-tertiary">
                <div class="issue-card-header">
                    <div class="repo-info">
                        <span class="material-symbols-outlined icon-small">book</span>
                        <span class="code-md repo-name">${repoName}</span>
                    </div>
                    <span class="label-sm text-muted">${timeAgo}</span>
                </div>
                
                <h4 class="headline-md issue-title">${issue.title}</h4>
                
                <div class="badge-group">
                    ${badgesHtml}
                </div>
                
                <div class="issue-card-footer">
                    <a href="${issue.html_url}" target="_blank" class="btn btn-outline-secondary btn-small">
                        View on GitHub
                        <span class="material-symbols-outlined icon-small">open_in_new</span>
                    </a>
                </div>
            </article>
        `;

        resultsCanvas.insertAdjacentHTML('beforeend', cardHTML);
    });
}

/* EVENTS */

// Click Fetch Issues Button
fetchButton.addEventListener('click', fetchGitHubIssues);

// Press Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchGitHubIssues();
});

// Click Language Selection on the sidebar
languageChips.forEach(chip => {
    chip.addEventListener('click', function() {
        // Remove active class
        languageChips.forEach(c => c.classList.remove('active-chip'));
        // Add active class
        this.classList.add('active-chip');
        
        // Update Language
        currentLanguage = this.textContent.trim().toLowerCase();
        
        // Automatically calls the API-no need to click Fetch.
        fetchGitHubIssues();
    });
});

// Selecting the checkbox also automatically reloads the data.
difficultyCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', fetchGitHubIssues);
});

// DEFAULT STATE
// Automatically fetch data immediately after the webpage finishes loading.
document.addEventListener('DOMContentLoaded', fetchGitHubIssues);

/* MOBILE MENU LOGIC */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const appSidebar = document.querySelector('.app-sidebar');

if (mobileMenuBtn && appSidebar) {
    // Toggle sidebar when clicking the hamburger icon
    mobileMenuBtn.addEventListener('click', (event) => {
        // Prevent click from immediately bubbling up to the document
        event.stopPropagation(); 
        appSidebar.classList.toggle('sidebar-open');
    });

    // Close the sidebar if the user clicks outside of it
    document.addEventListener('click', (event) => {
        const isMenuOpen = appSidebar.classList.contains('sidebar-open');
        const clickedInsideSidebar = appSidebar.contains(event.target);
        const clickedOnMenuBtn = mobileMenuBtn.contains(event.target);

        if (isMenuOpen && !clickedInsideSidebar && !clickedOnMenuBtn) {
            appSidebar.classList.remove('sidebar-open');
        }
    });
}