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
        gsap.fromTo(".formula", 
            {
                opacity: 0,          // Start fully transparent
                scale: 0.5,          // Start at half the size
                rotation: 0,         // Start with no rotation
                x: -100,             // Start 100px to the left
                y: -100              // Start 100px above
            }, 
            {
                duration: 3,         // Animation duration of 3 seconds
                opacity: 1,          // End fully opaque
                scale: 1,            // End at full size
                rotation: 360,       // End with a full 360-degree rotation
                x: 0,                // End at the original x position
                y: 0,                // End at the original y position
                ease: "elastic.out", // Elastic easing for a bounce effect
                repeat: -1,          // Infinite loop
                yoyo: true           // Reverse the animation on every alternate cycle
            }
        );

        // Add animations for elements with the 'ellipse' class inside the SVG
        gsap.from(".ellipse", {
            duration: 1.5,
            opacity: 0,
            scale: 0.5,
            ease: "bounce.out",
            stagger: 0.2 // Staggers the start of each element's animation by 0.2 seconds
        });

        // Create a journal container that appears on hover over the ellipse
        const journalContainer = document.createElement('div');
        journalContainer.classList.add('journal-container');
        document.body.appendChild(journalContainer);

        const journalImage = document.createElement('div');
        journalImage.classList.add('journal-image');
        journalContainer.appendChild(journalImage);

        gsap.set(journalContainer, {
            opacity: 0,
            rotationY: 0,
            zIndex: 10
        });

        // Animation to show the journal on hover over the ellipse
        document.querySelectorAll('.ellipse').forEach(ellipse => {
            ellipse.addEventListener('mouseenter', () => {
                gsap.to(journalContainer, {
                    duration: 1,
                    opacity: 1,
                    ease: "power1.out"
                });

                // Rotate to reveal the journal image
                gsap.fromTo(journalContainer, 
                    { rotationY: 0 }, 
                    { 
                        duration: 1.5, 
                        rotationY: 180, 
                        ease: "power2.inOut",
                        onComplete: () => {
                            journalImage.style.display = 'block';
                        }
                    }
                );
            });

            ellipse.addEventListener('mouseleave', () => {
                gsap.to(journalContainer, {
                    duration: 1,
                    opacity: 0,
                    rotationY: 0,
                    ease: "power1.out"
                });
            });
        });

        // Add click event to the journalContainer to open a link
        journalContainer.addEventListener('click', () => {
            window.open('https://example.com', '_blank'); // Replace with your desired URL
        });
    }
});