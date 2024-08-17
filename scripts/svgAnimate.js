// svgAnimate.js

document.addEventListener('DOMContentLoaded', () => {
    // Function to get JSON URL from the query parameter
    function getJsonUrlFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const jsonUrl = urlParams.get('jsonurl');
        return jsonUrl || 'content.json';
    }

    const jsonUrl = getJsonUrlFromUrl();

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            const mainSectionSvgContainer = document.getElementById('main-section-svg');

            fetch(data.mainSection.svgImage.link)
                .then(response => response.text())
                .then(svgData => {
                    mainSectionSvgContainer.innerHTML = svgData;

                    const svgElement = mainSectionSvgContainer.querySelector('svg');
                    if (svgElement) {
                        svgElement.setAttribute('width', '100%');
                        svgElement.setAttribute('height', '100%');
                        svgElement.style.maxWidth = '100%';
                        svgElement.style.maxHeight = '100%';
                        svgElement.style.display = 'block';
                        svgElement.style.objectFit = 'contain';
                        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                        applyAnimations();
                    }
                })
                .catch(error => console.error('Error loading SVG:', error));
        })
        .catch(error => console.error('Error fetching JSON:', error));

    function applyAnimations() {
        gsap.fromTo(".formula", 
            {
                opacity: 0,
                scale: 0.5,
                rotation: 0,
                x: -100,
                y: -100
            }, 
            {
                duration: 3,
                opacity: 1,
                scale: 1,
                rotation: 360,
                x: 0,
                y: 0,
                ease: "elastic.out",
                repeat: -1,
                yoyo: true
            }
        );

        gsap.from(".ellipse", {
            duration: 1.5,
            opacity: 0,
            scale: 0.5,
            ease: "bounce.out",
            stagger: 0.2
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
            rotationY: 0
        });

        // Animation to show the journal on hover over the ellipse
        document.querySelectorAll('.ellipse').forEach(ellipse => {
            ellipse.addEventListener('mouseenter', () => {
                gsap.to(journalContainer, {
                    duration: 1,
                    opacity: 1,
                    ease: "power1.out"
                });

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