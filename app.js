/* =========================================
   OCEAN × ECO-TECH
   LAYER 1 JAVASCRIPT
   ========================================= */


/* =========================================
   CURRENT YEAR
   ========================================= */

const yearElements =
    document.querySelectorAll("[data-year]");

yearElements.forEach(function(element) {

    element.textContent =
        new Date().getFullYear();

});


/* =========================================
   MOBILE MENU
   ========================================= */

const menuButton =
    document.getElementById("menuButton");

const navLinks =
    document.getElementById("navLinks");


if (menuButton && navLinks) {

    menuButton.addEventListener(
        "click",
        function() {

            navLinks.classList.toggle("mobile-open");

        }
    );

}


/* =========================================
   CONTACT FORM
   ========================================= */

const contactForm =
    document.getElementById("contactForm");

const successMessage =
    document.getElementById("successMessage");


if (contactForm && successMessage) {

    contactForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            successMessage.style.display =
                "block";

            contactForm.reset();

        }
    );

}