// svgAnimate.js
document.addEventListener("DOMContentLoaded", () => {
  function getJsonUrlFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const jsonUrl = urlParams.get("jsonurl");
    return jsonUrl || "content.json";
  }

  const jsonUrl = getJsonUrlFromUrl();

  fetch(jsonUrl)
    .then((response) => response.json())
    .then((data) => {
      const mainSectionSvgContainer =
        document.getElementById("main-section-svg");

      fetch(data.mainSection.svgImage.link)
        .then((response) => response.text())
        .then((svgData) => {
          mainSectionSvgContainer.innerHTML = svgData;

          const svgElement = mainSectionSvgContainer.querySelector("svg");
          if (svgElement) {
            svgElement.setAttribute("width", "100%");
            svgElement.setAttribute("height", "100%");
            svgElement.style.maxWidth = "100%";
            svgElement.style.maxHeight = "100%";
            svgElement.style.display = "block";
            svgElement.style.objectFit = "contain";
            svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

            //applyAnimations(svgElement);

            const journal1 = {
              front: data.mainSection.Journal1.front,
              back: `url(${data.mainSection.Journal1.back})`,
              link: data.mainSection.Journal1.link,
            };
            const journal2 = {
              front: data.mainSection.Journal2.front,
              back: `url(${data.mainSection.Journal2.back})`,
              link: data.mainSection.Journal2.link,
            };
            const journal3 = {
              front: data.mainSection.Journal3.front,
              back: `url(${data.mainSection.Journal3.back})`,
              link: data.mainSection.Journal3.link,
            };
            applyAnimations(svgElement, journal1, journal2, journal3);
          }
        })
        .catch((error) => console.error("Error loading SVG:", error));
    })
    .catch((error) => console.error("Error fetching JSON:", error));

  function applyAnimations(svgElement, journal1, journal2, journal3) {
    gsap.fromTo(".formula", { opacity: 0 }, { opacity: 0.5, duration: 1 });

    gsap.from(".crop-zoom", {
      duration: 1.5,
      opacity: 0,
      scale: 0.5,
      ease: "bounce.out",
      stagger: 0.2,
    });

    // Seleziona tutti gli elementi con la classe 'ellipse'
    const ellipseElements = document.querySelectorAll(".crop-zoom");

    // Funzione per ottenere la posizione del mouse relativa all'elemento
    function getMousePos(event, element) {
      const rect = element.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    // Loop attraverso ogni elemento e applica l'effetto di zoom
    ellipseElements.forEach((ellipse) => {
      // Applica l'effetto di zoom quando il mouse entra nell'elemento
      ellipse.addEventListener("mouseenter", (event) => {
        // Ottieni la posizione del mouse relativa all'elemento
        const mousePos = getMousePos(event, ellipse);

        // Calcola la trasformazione necessaria per mantenere l'ingrandimento centrato
        gsap.to(ellipse, {
          scale: 1.2, // Aumenta la scala al 120%
          duration: 0.5, // Durata dell'animazione in secondi
          ease: "power2.out", // Funzione di easing
          x: 0.2 * mousePos.x - 0.1 * ellipse.offsetWidth,
          y: 0.2 * mousePos.y - 0.1 * ellipse.offsetHeight,
        });
      });

      // Ripristina l'effetto di zoom quando il mouse lascia l'elemento
      ellipse.addEventListener("mouseleave", () => {
        gsap.to(ellipse, {
          scale: 1, // Ripristina la scala alla dimensione originale
          x: 0, // Resetta la posizione orizzontale
          y: 0, // Resetta la posizione verticale
          duration: 0.5, // Durata dell'animazione in secondi
          ease: "power2.out", // Funzione di easing
        });
      });

      // Opzionalmente, aggiungi un effetto di movimento del mouse
      ellipse.addEventListener("mousemove", (event) => {
        const mousePos = getMousePos(event, ellipse);

        gsap.to(ellipse, {
          x: 0.2 * mousePos.x - 0.1 * ellipse.offsetWidth,
          y: 0.2 * mousePos.y - 0.1 * ellipse.offsetHeight,
          duration: 0.1, // Breve durata per seguire il mouse
        });
      });
    });
    let hideJournalTimeout;

    function showJournal(journal) {
        clearTimeout(hideJournalTimeout);  // Clear any pending timeout
        const journalContainer = document.querySelector('#journal-container');
        const journalImage = document.querySelector('#journal-image');
        let newContainer;
    
        if (journalContainer) {
            // Update the background image
            journalContainer.style.backgroundImage = `url(${journal.back})`;
    
            // Clone the container to remove existing event listeners
            newContainer = journalContainer.cloneNode(true);
            journalContainer.parentNode.replaceChild(newContainer, journalContainer);
    
            // Attach the click event listener
            newContainer.addEventListener('click', () => {
                window.open(journal.link, '_blank');
            });
        }
    
        if (journalImage) {
            // Update the image source
            journalImage.src = journal.front;
        }
    
        if (newContainer) {
            gsap.to(newContainer, {
                duration: 1,
                opacity: 1,
                rotationY: 0,
                ease: "power2.inOut",
                onStart: () => {
                    newContainer.style.display = 'block';
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
        const journalContainer = document.querySelector("#journal-container");
        if (journalContainer) {
          gsap.to(journalContainer, {
            duration: 1,
            opacity: 0,
            rotationY: -90,
            ease: "power1.out",
            onComplete: () => {
              journalContainer.style.display = "none";
            },
          });
        }
      }, 3000); // Wait 3 seconds before hiding the journal
    }

    // Array of paper classes and corresponding journal variables
    const paperClasses = ["paper1", "paper2", "paper3"];
    const journalVariables = [journal1, journal2, journal3];

    // Loop through each paper class and corresponding journal variable
    paperClasses.forEach((paperClass, index) => {
      const journalElements = document.querySelectorAll(`.${paperClass}`);

      if (journalElements.length > 0) {
        journalElements.forEach((journal) => {
          journal.addEventListener("mouseenter", () => {
            showJournal(journalVariables[index]); // Pass the corresponding journal variable
          });
          journal.addEventListener("mouseleave", hideJournal);
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
