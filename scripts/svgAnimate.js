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
        // GSAP animations for formula and ellipse elements
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

        // Function to show the journal on hover
        function showJournal() {
            gsap.to('.journal-container', {
                duration: 1,
                opacity: 1,
                rotationY: 180,
                ease: "power2.inOut",
                onStart: () => {
                    document.querySelector('.journal-container').style.display = 'block';
                }
            });
        }

        // Function to hide the journal on mouse leave
        function hideJournal() {
            gsap.to('.journal-container', {
                duration: 1,
                opacity: 0,
                rotationY: 0,
                ease: "power1.out",
                onComplete: () => {
                    document.querySelector('.journal-container').style.display = 'none';
                }
            });
        }

        // Add hover event to show journal on ellipse hover
        const ellipseElements = document.querySelectorAll(".ellipse");

        if (ellipseElements.length > 0) {
            ellipseElements.forEach(ellipse => {
                ellipse.addEventListener('mouseenter', showJournal);
                ellipse.addEventListener('mouseleave', hideJournal);
            });
        }

        // Add click event to the journalContainer to open a link
        document.querySelector('.journal-container').addEventListener('click', () => {
            window.open('https://example.com', '_blank'); // Replace with your desired URL
        });
    }
});