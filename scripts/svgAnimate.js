// svgAnimate.js

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
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

});