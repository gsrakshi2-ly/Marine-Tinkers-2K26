/* =========================================================
   OCEAN × ECO-TECH
   GLOBAL WEBSITE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       CURRENT PAGE NAVIGATION
    ----------------------------------------------------- */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }

    });


    /* -----------------------------------------------------
       MOBILE MENU
    ----------------------------------------------------- */

    const menuButton =
        document.querySelector(".menu-toggle");

    const navList =
        document.querySelector("nav ul");

    if (menuButton && navList) {

        menuButton.addEventListener("click", () => {

            navList.classList.toggle("mobile-open");

        });

    }


    /* -----------------------------------------------------
       LIVE CLOCK
    ----------------------------------------------------- */

    const clock =
        document.querySelector("#liveClock");

    if (clock) {

        function updateClock() {

            const now = new Date();

            clock.textContent =
                now.toLocaleTimeString();

        }

        updateClock();

        setInterval(updateClock, 1000);

    }


    /* -----------------------------------------------------
       DEMO SENSOR ANIMATION
    ----------------------------------------------------- */

    const sensorValues =
        document.querySelectorAll("[data-sensor]");

    sensorValues.forEach(value => {

        value.addEventListener("click", () => {

            value.classList.add("pulse");

            setTimeout(() => {
                value.classList.remove("pulse");
            }, 500);

        });

    });

});