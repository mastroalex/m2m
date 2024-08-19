// svgAnimate.js

document.addEventListener('DOMContentLoaded', () => {
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

                        applyAnimations(svgElement);
                    }
                })
                .catch(error => console.error('Error loading SVG:', error));
        })
        .catch(error => console.error('Error fetching JSON:', error));

    function applyAnimations(svgElement) {
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

        let hideJournalTimeout;

        function showJournal() {
            clearTimeout(hideJournalTimeout);  // Clear any pending timeout
            const journalContainer = document.querySelector('#journal-container');
            const journalImage = document.querySelector('#journal-image');
            
            if (journalContainer) {
                

                gsap.to(journalContainer, {
                    duration: 1,
                    opacity: 1,
                    rotationY: 0,
                    ease: "power2.inOut",
                    onStart: () => {
                        journalContainer.style.display = 'block';
                    }
                });
            }

            if (journalImage) {
                gsap.to(journalImage, {
                    duration: 1,
                    rotationY: 0,
                    ease: "power2.inOut"
                });
            }
        }

        function hideJournal() {
            hideJournalTimeout = setTimeout(() => {
                const journalContainer = document.querySelector('#journal-container');
                if (journalContainer) {
                    gsap.to(journalContainer, {
                        duration: 1,
                        opacity: 0,
                        rotationY: -90,
                        ease: "power1.out",
                        onComplete: () => {
                            journalContainer.style.display = 'none';
                        }
                    });
                }
            }, 3000);  // Wait 3 seconds before hiding the journal
        }

        const ellipseElements = document.querySelectorAll(".ellipse");

        if (ellipseElements.length > 0) {
            ellipseElements.forEach(ellipse => {
                ellipse.addEventListener('mouseenter', showJournal);
                ellipse.addEventListener('mouseleave', hideJournal);
            });
        }

        const journalContainer = document.querySelector('#journal-container');
        if (journalContainer) {
            journalContainer.addEventListener('click', () => {
                window.open('https://example.com', '_blank');
            });
        }
    }
});