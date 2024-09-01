document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.toggable-section');

    sections.forEach(section => {
        const header = section.querySelector('.header');
        const content = section.querySelector('.toggable-section-content');
        const icon = section.querySelector('.toggle-icon');

        header.addEventListener('click', () => {
            content.classList.toggle('open');
            icon.classList.toggle('open');
        });
    });

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