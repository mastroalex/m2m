document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.toggable-section');

    sections.forEach(section => {
        const header = section.querySelector('.header');
        const content = section.querySelector('.toggable-section-content');
        const icon = section.querySelector('.toggle-icon');
        let isBabylonInitialized = false; // Track if Babylon.js has been initialized
        
        header.addEventListener('click', () => {
            content.classList.toggle('open');
            icon.classList.toggle('open');

            if (content.classList.contains('open')) {
                // Get all chart canvases in the section
                console.log("Section opened:", section);

                const canvases = content.querySelectorAll('.chartjs-canvas canvas');
                console.log('Found canvases:', canvases);
                // Set the width and height of each canvas
                canvases.forEach(canvas => {
                    canvas.style.width = '300px';
                    canvas.style.height = '300px';
                });

                // Optionally, you can re-render the chart if needed
                canvases.forEach(canvas => {
                    const chart = Chart.getChart(canvas);
                    if (chart) {
                        chart.resize(); // Resize the chart to fit the new dimensions
                    }
                });
            }

            // Initialize Babylon.js only when the section is opened
            if (content.classList.contains('open') && !isBabylonInitialized) {
                initializeBabylonJs(content); // Pass the section content or other relevant element
                isBabylonInitialized = true; // Mark as initialized
            }


        });
    });

    function initializeBabylonJs(element) {
        // Your Babylon.js initialization code here
        const canvas = element.querySelector('canvas');
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);

        // Add your Babylon.js scene setup code here...

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });
    }

    function getJsonUrlFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const jsonUrl = urlParams.get("jsonurl");
        return jsonUrl || "content.json"; // Default to 'content.json' if no URL is specified
      }
    
      // Get JSON URL from URL or default to 'content.json'
      const jsonUrl = getJsonUrlFromUrl();
    
      fetch(jsonUrl)
        .then((response) => response.json())
        .then((data) => {
          const mainText = document.querySelector(".main-text");
          if (mainText) {
            mainText.textContent = data.mainSection.Text; // Set the text content
          }
          // Load the scroll sections and content
          data.sections.forEach((section) => {
            const scrollSection = document.querySelector(`#${section.id}`);
            const scrollContent = scrollSection.querySelector(".toggable-section-content");
    
            // Set the title and subtitle in the fixed part
            const fixedPart = scrollSection.querySelector(".header");
            if (!fixedPart) {
                console.error(`Header not found in section with ID ${section.id}.`);
                return;
            }
        
            fixedPart.querySelector(".title").textContent = section.title;
            fixedPart.querySelector(".subtitle").textContent = section.subtitle;
    
            section.contents.forEach((content, index) => {
              const scrollingPart = scrollContent.children[index];
              scrollingPart.querySelector(".left-content .text").textContent =
                content.text;
    
              if (content.isImage) {
                const imageElement = document.createElement("img");
                imageElement.src = content.image;
                scrollingPart
                  .querySelector(".right-content .media")
                  .appendChild(imageElement);
              } else if (content.canvasType === "chart") {
                const canvasElement = document.createElement("div");
                canvasElement.classList.add("chartjs-canvas");
                scrollingPart
                  .querySelector(".right-content .media")
                  .appendChild(canvasElement);
    
                // Call the specified function to generate the Chart.js content
                if (
                  content.contentFunction &&
                  typeof window[content.contentFunction] === "function"
                ) {
                  window[content.contentFunction](canvasElement);
                }
              } else if (content.canvasType === "babylon") {
                const canvasElement = document.createElement("div");
                canvasElement.classList.add("babylon-canvas");
                scrollingPart
                  .querySelector(".right-content .media")
                  .appendChild(canvasElement);
    
                // Call the specified function to generate the Babylon.js content
                if (
                  content.contentFunction &&
                  typeof window[content.contentFunction] === "function"
                ) {
                  window[content.contentFunction](canvasElement);
                }
              } else {
                const divElement = document.createElement("div");
                divElement.classList.add("generic-content");
                scrollingPart
                  .querySelector(".right-content .media")
                  .appendChild(divElement);
    
                // Call the specified function to generate the generic content
                if (
                  content.contentFunction &&
                  typeof window[content.contentFunction] === "function"
                ) {
                  window[content.contentFunction](divElement);
                }
              }
            });
          });
    
          // Add event listeners to stop scroll propagation on canvas elements
          document
            .querySelectorAll(".scrolling-part .media canvas")
            .forEach((canvas) => {
              canvas.addEventListener("wheel", (event) => {
                if (!event.target.closest(".media")) {
                  event.preventDefault();
                }
                event.stopPropagation();
              });
              canvas.addEventListener("touchmove", (event) => {
                if (!event.target.closest(".media")) {
                  event.preventDefault();
                }
                event.stopPropagation();
              });
            });
        })
        .catch((error) => console.error("Error fetching JSON:", error));
    
});