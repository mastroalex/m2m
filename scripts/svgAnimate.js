document.addEventListener('DOMContentLoaded', () => {
    // Load the SVG
    fetch(data.mainSection.svgImage.link)
        .then(response => response.text())
        .then(svgData => {
            document.getElementById('main-section-svg').innerHTML = svgData;

            // Initialize GSAP animations after SVG is loaded
            runGSAPAnimations();
        })
        .catch(error => console.error('Error loading SVG:', error));
});

function runGSAPAnimations() {
    gsap.to(".formula", {
        duration: 2,
        x: 100,
        y: 50,
        rotation: 360,
        scale: 1.5,
        ease: "power1.inOut"
    });

    gsap.from(".ellipse", {
        duration: 1.5,
        opacity: 0,
        scale: 0.5,
        ease: "bounce.out",
        stagger: 0.2
    });
}