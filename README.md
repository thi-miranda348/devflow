# DevFlow - Open Source Issue Finder

A sleek, modern web application designed to help developers easily discover "Good First Issues" across millions of GitHub repositories. Built from scratch without frameworks to demonstrate mastery of frontend fundamentals, API integration, and asynchronous JavaScript.

## Features

* **Real-time GitHub API Integration:** Fetches live open-source issues dynamically based on user input and filter parameters.
* **Smart UI/UX States:** Implements professional loading states (Skeleton Loaders), empty states, and API rate-limit error handling.
* **Modern CSS Architecture:** Built entirely without CSS frameworks using CSS Custom Properties (Variables), Flexbox, and CSS Grid.
* **Responsive Design:** Fully fluid layout that adapts seamlessly from desktop canvases to mobile screens.
* **No Dependencies:** 100% Vanilla JavaScript, HTML5, and CSS3.

![Dashboard UI Screenshot DevFlow](dashboard-screenshot.png)

## Tech Stack

* **Frontend:** HTML5 (Semantic Structure)
* **Styling:** CSS3 (BEM-inspired naming, Custom Properties, Media Queries)
* **Logic:** Vanilla JavaScript (ES6+, Async/Await, Fetch API, DOM Manipulation)
* **Icons:** Google Material Symbols

## Technical Highlight

This project was built to establish a rock-solid foundation in web architecture before transitioning into full-stack Java/React development. Key engineering challenges solved include:

* **Dynamic Query Building:** Constructing complex REST API URLs on the fly based on active DOM elements (checkboxes, search inputs, and sidebar chips).
* **State Management:** Handling the asynchronous nature of network requests, ensuring the UI accurately reflects loading, success, and error states without framework wrappers.
* **Layout Resilience:** Designing a CSS layout that prevents flex-children from collapsing when dynamic data populates the main canvas.


## Getting Started

Since this project uses pure Vanilla JavaScript and static files, no build steps or package managers (like npm) are required.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/thi-miranda348/devflow.git](https://github.com/thi-miranda348/devflow.git)
   ```

2. **Navigate to the directory:**
    ```bash
    cd devflow
    ```

3. **Run the app:**
Simply open the index.html file in your favorite web browser, or use an extension like VS Code Live Server for hot-reloading.

## License

This project is open-source and available under the MIT License.

Once you have saved both of these files in your folder, open your terminal and run your standard Git workflow to push them to your repository:
```bash
git add .
git commit -m "docs: add professional README and configure gitattributes for JavaScript"
git push
```

