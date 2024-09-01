Document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.toggable-section');

    sections.forEach(section => {
        const header = section.querySelector('.header');
        const content = section.querySelector('.section-content');
        const icon = section.querySelector('.toggle-icon');

        header.addEventListener('click', () => {
            content.classList.toggle('open');
            icon.classList.toggle('open');
        });
    });
});