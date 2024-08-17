// svgAnimate.js

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Function to get JSON URL from the query parameter
    function getJsonUrlFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const jsonUrl = urlParams.get('jsonurl');
        return jsonUrl || 'content.json'; // Default to 'content.json' if no URL is specified
    }

    // Get JSON URL from URL or default to 'content.json'
    const jsonUrl = getJsonUrlFromUrl();

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            // Load the main section SVG
            const mainSectionSvgContainer = document.getElementById('main-section-svg');

            // Load the SVG
            fetch(data.mainSection.svgImage.link)
                .then(response => response.text())
                .then(svgData => {
                    mainSectionSvgContainer.innerHTML = svgData;

                    // Get the SVG element after it's inserted into the DOM
                    const svgElement = mainSectionSvgContainer.querySelector('svg');
                    if (svgElement) {
                        svgElement.setAttribute('width', '100%');
                        svgElement.setAttribute('height', '100%');
                        svgElement.style.maxWidth = '100%';
                        svgElement.style.maxHeight = '100%';
                        svgElement.style.display = 'block';
                        svgElement.style.objectFit = 'contain'; // Or 'cover', depending on your needs

                        // Optional: Ensure the SVG scales properly within the viewBox
                        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                        // Now apply GSAP animations to the SVG elements
                        applyAnimations();
                    }
                })
                .catch(error => console.error('Error loading SVG:', error));
        })
        .catch(error => console.error('Error fetching JSON:', error));

    // Function to apply GSAP animations
    function applyAnimations() {
        // Example animation for elements with the 'formula' class inside the SVG
        gsap.to(".formula", {
            duration: 2,
            x: 100,
            y: 50,
            rotation: 360,
            scale: 1.5,
            ease: "power1.inOut", // Ease function for smooth animation
            repeat: -1, // Makes the animation loop infinitely
            yoyo: true  // Makes the animation reverse on every alternate cycle
        });
        
        // Add more animations for other SVG elements if needed
        gsap.from(".ellipse", {
            duration: 1.5,
            opacity: 0,
            scale: 0.5,
            ease: "bounce.out",
            stagger: 0.2 // Staggers the start of each element's animation by 0.2 seconds
        });
    }
});