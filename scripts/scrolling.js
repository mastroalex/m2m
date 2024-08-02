document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            data.sections.forEach(section => {
                const scrollSection = document.querySelector(`#${section.id}`);
                const scrollContent = scrollSection.querySelector('.scroll-content');
                section.contents.forEach((content, index) => {
                    const scrollingPart = scrollContent.children[index];
                    scrollingPart.querySelector('.left-content .text').textContent = content.text;
                    if (content.isImage) {
                        const imageElement = document.createElement('img');
                        imageElement.src = content.image;
                        scrollingPart.querySelector('.right-content .media').appendChild(imageElement);
                    } else {
                        const divElement = document.createElement('div');
                        divElement.classList.add('generic-content');
                        scrollingPart.querySelector('.right-content .media').appendChild(divElement);

                        // Call the specified function to generate the generic content
                        if (content.contentFunction && typeof window[content.contentFunction] === 'function') {
                            window[content.contentFunction](divElement);
                        }
                    }
                });
            });
        });

    function initializeScrollSection(sectionId) {
        const scrollSection = document.querySelector(`#${sectionId}`);
        const scrollContent = scrollSection.querySelector('.scroll-content');
        const contents = scrollContent.querySelectorAll('.scrolling-part');

        let index = 0;
        let scrollCounter = 0;
        const scrollThreshold = 20; // Adjust as needed to make the scroll less sensitive

        scrollSection.addEventListener('wheel', (event) => {
            event.preventDefault();

            // Update scroll counter based on scroll direction
            scrollCounter += event.deltaY;

            if (scrollCounter > scrollThreshold) {
                // Scroll down
                index = (index + 1) % contents.length;
                scrollContent.style.transform = `translateX(-${index * 100}vw)`;
                scrollCounter = 0; // Reset counter
            } else if (scrollCounter < -scrollThreshold) {
                // Scroll up
                index = (index - 1 + contents.length) % contents.length;
                scrollContent.style.transform = `translateX(-${index * 100}vw)`;
                scrollCounter = 0; // Reset counter
            }
        });

        // Handle touch events for mobile
        let touchStartX = 0;

        scrollSection.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
        });

        scrollSection.addEventListener('touchmove', (event) => {
            const touchEndX = event.touches[0].clientX;
            const touchDeltaX = touchStartX - touchEndX;

            if (touchDeltaX > scrollThreshold) {
                // Swipe left
                index = (index + 1) % contents.length;
                scrollContent.style.transform = `translateX(-${index * 100}vw)`;
                touchStartX = touchEndX; // Reset touch start
            } else if (touchDeltaX < -scrollThreshold) {
                // Swipe right
                index = (index - 1 + contents.length) % contents.length;
                scrollContent.style.transform = `translateX(-${index * 100}vw)`;
                touchStartX = touchEndX; // Reset touch start
            }
        });
    }

    // Initialize all scroll sections
    initializeScrollSection('scroll-section-1');
    initializeScrollSection('scroll-section-2');
    initializeScrollSection('scroll-section-3');
});
