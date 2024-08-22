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

                        //applyAnimations(svgElement);
                    

                        const journal1  = { front: data.mainSection.Journal1.front,
                            back : `url(${data.mainSection.Journal1.back})`,
                            link : data.mainSection.Journal1.link};
                        const journal2  = { front: data.mainSection.Journal2.front,
                            back : `url(${data.mainSection.Journal2.back})`,
                            link : data.mainSection.Journal2.link};
                        const journal3  = { front: data.mainSection.Journal3.front,
                            back : `url(${data.mainSection.Journal3.back})`,
                            link : data.mainSection.Journal3.link};
                        applyAnimations(svgElement, journal1, journal2, journal3);

                    }

                })
                .catch(error => console.error('Error loading SVG:', error));
        })
        .catch(error => console.error('Error fetching JSON:', error));

    function applyAnimations(svgElement, journal1, journal2, journal3) {
        gsap.fromTo(".formula", 
            { opacity: 0 }, { opacity: 0.5, duration: 1 }
        );

        gsap.from(".ellipse", {
            duration: 1.5,
            opacity: 0,
            scale: 0.5,
            ease: "bounce.out",
            stagger: 0.2
        });

        // Select all elements with the class 'ellipse'
        const ellipseElements = document.querySelectorAll('.crop-zoom');

        // Loop through each element and apply the hover effect
        ellipseElements.forEach(ellipse => {
            // Apply the zoom effect when the mouse enters the element
            ellipse.addEventListener('mouseenter', () => {
                gsap.to(ellipse, {
                    scale: 1.2,  // Increase the scale to 120%
                    duration: 0.5,  // Animation duration in seconds
                    ease: "power2.out"  // Easing function
                });
            });

            // Revert the zoom effect when the mouse leaves the element
            ellipse.addEventListener('mouseleave', () => {
                gsap.to(ellipse, {
                    scale: 1,  // Reset the scale to the original size
                    duration: 0.5,  // Animation duration in seconds
                    ease: "power2.out"  // Easing function
                });
            });
        });

        let hideJournalTimeout;

        function showJournal(journal) {
            clearTimeout(hideJournalTimeout);  // Clear any pending timeout
            const journalContainer = document.querySelector('#journal-container');
            const journalImage = document.querySelector('#journal-image');
            
            if (journalContainer) {
                journalContainer.style.backgroundImage = journal.back;
                journalContainer.addEventListener('click', () => {
                    //window.open(data.mainSection.Journal1.link, '_blank');
                    window.open(journal.link, '_blank');
                });
            }
            if (journalImage) {
                journalImage.src = journal.front;
            }

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


        // Array of paper classes and corresponding journal variables
        const paperClasses = ['paper1', 'paper2', 'paper3'];
        const journalVariables = [journal1, journal2, journal3];

        // Loop through each paper class and corresponding journal variable
        paperClasses.forEach((paperClass, index) => {
            const journalElements = document.querySelectorAll(`.${paperClass}`);

            if (journalElements.length > 0) {
                journalElements.forEach(journal => {
                    journal.addEventListener('mouseenter', () => {
                        showJournal(journalVariables[index]);  // Pass the corresponding journal variable
                    });
                    journal.addEventListener('mouseleave', hideJournal);
                });
            }
        });

        //const journalContainer = document.querySelector('#journal-container');
        //if (journalContainer) {
        //    journalContainer.addEventListener('click', () => {
        //        //window.open(data.mainSection.Journal1.link, '_blank');
        //        window.open("https://google.it", '_blank');
        //    });
        //}




    }
});