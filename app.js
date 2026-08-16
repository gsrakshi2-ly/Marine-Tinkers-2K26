/* =========================================================
   🌊 OCEAN × ECO-TECH
   APP.JS — REAL DATA ONLY
========================================================= */

"use strict";


/* =========================================================
   1. GLOBAL STATE
========================================================= */

const OceanEcoTech = {

    hardwareConnected: false,

    sensorData: null,

    map: null,

    mapMarkers: [],

    storageKey: "oceanEcoTechWasteReports"

};


/* =========================================================
   2. START APPLICATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

    initializeActiveNavigation();

    initializeRevealAnimations();

    initializeHardwareState();

    initializeWasteReporting();

    renderWasteHistory();

    initializeButtons();

    initializeCuteEffects();

});


/* =========================================================
   3. RESPONSIVE NAVIGATION
========================================================= */

function initializeNavigation() {

    const menuButton =
        document.querySelector(".menu-toggle");

    const nav =
        document.querySelector("nav");

    if (!menuButton || !nav) return;

    menuButton.addEventListener("click", () => {

        const opened =
            nav.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            opened
        );

        menuButton.textContent =
            opened ? "✕" : "☰";

    });


    nav.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("open");

                menuButton.textContent = "☰";

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

}


/* =========================================================
   4. ACTIVE NAVIGATION
========================================================= */

function initializeActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    document.querySelectorAll(
        ".nav-links a"
    ).forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) return;

        const page =
            href
                .split("/")
                .pop()
                .toLowerCase();


        if (
            page === currentPage ||
            (
                currentPage === "" &&
                page === "index.html"
            )
        ) {

            link.classList.add("active");

        }

    });

}


/* =========================================================
   5. SCROLL REVEAL
========================================================= */

function initializeRevealAnimations() {

    const elements =
        document.querySelectorAll(".reveal");

    if (!elements.length) return;


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(element => {

            element.classList.add("visible");

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add("visible");

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================================
   6. HARDWARE STATE
========================================================= */

function initializeHardwareState() {

    /*
       IMPORTANT:

       There is NO simulated hardware state.

       The default state is always:

       📡 Awaiting Hardware Data
    */


    OceanEcoTech.hardwareConnected =
        false;

    OceanEcoTech.sensorData =
        null;


    updateHardwareInterface();

}


/* =========================================================
   7. HARDWARE UI
========================================================= */

function updateHardwareInterface() {

    document.querySelectorAll(
        "[data-hardware-status]"
    ).forEach(element => {

        if (
            OceanEcoTech.hardwareConnected
        ) {

            element.textContent =
                "📡 Hardware Connected";

        } else {

            element.textContent =
                "📡 Awaiting Hardware";

        }

    });


    document.querySelectorAll(
        "[data-awaiting-message]"
    ).forEach(element => {

        if (
            OceanEcoTech.hardwareConnected
        ) {

            element.textContent =
                "Real sensor data is available.";

        } else {

            element.textContent =
                "This feature will become available when the prototype's sensors are connected.";

        }

    });

}


/* =========================================================
   8. RECEIVE REAL SENSOR DATA
========================================================= */

function receiveSensorData(data) {

    /*
       This function NEVER creates data.

       It only accepts data supplied by
       the actual hardware system.
    */


    if (
        !data ||
        typeof data !== "object"
    ) {

        return;

    }


    OceanEcoTech.sensorData =
        data;

    OceanEcoTech.hardwareConnected =
        true;


    updateHardwareInterface();

    displayRealSensorData(data);

    processRealAlerts(data);

}


/* =========================================================
   9. DISPLAY REAL SENSOR DATA
========================================================= */

function displayRealSensorData(data) {

    document.querySelectorAll(
        "[data-sensor]"
    ).forEach(element => {

        const sensor =
            element.dataset.sensor;


        if (
            Object.prototype.hasOwnProperty
                .call(data, sensor)
        ) {

            const value =
                data[sensor];


            if (
                value !== null &&
                value !== undefined
            ) {

                element.textContent =
                    String(value);

            }

        }

    });

}


/* =========================================================
   10. REAL SENSOR ALERTS ONLY
========================================================= */

function processRealAlerts(data) {

    /*
       No automatic/fake warnings.

       Alerts can only appear if the
       real hardware system supplies one.
    */


    if (
        !data.alert
    ) {

        return;

    }


    const alertBox =
        document.querySelector(
            "[data-smart-alert]"
        );


    if (!alertBox) return;


    alertBox.textContent =
        String(data.alert);


    alertBox.hidden = false;

}


/* =========================================================
   11. WASTE REPORTING
========================================================= */

function initializeWasteReporting() {

    document.querySelectorAll(
        "[data-waste-report-form]"
    ).forEach(form => {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                createWasteReport(form);

            }
        );

    });

}


/* =========================================================
   12. CREATE REAL USER REPORT
========================================================= */

function createWasteReport(form) {

    const formData =
        new FormData(form);


    const location =
        cleanInput(
            formData.get("location")
        );


    const wasteType =
        cleanInput(
            formData.get("wasteType")
        );


    const description =
        cleanInput(
            formData.get("description")
        );


    const quantity =
        cleanInput(
            formData.get("quantity")
        );


    if (
        !location ||
        !wasteType
    ) {

        showFormMessage(
            form,
            "Please enter the location and waste type.",
            "warning"
        );

        return;

    }


    /*
       This record represents an actual
       report created by the user.

       No environmental statistics
       are invented.
    */

    const report = {

        id: generateID(),

        date:
            new Date().toISOString(),

        location,

        wasteType,

        description,

        quantity,

        status: "Reported"

    };


    saveWasteReport(report);

    form.reset();


    showFormMessage(
        form,
        "♻️ Your waste report has been recorded.",
        "success"
    );

}


/* =========================================================
   13. SAVE REPORT
========================================================= */

function saveWasteReport(report) {

    const reports =
        getWasteReports();


    reports.push(report);


    localStorage.setItem(
        OceanEcoTech.storageKey,
        JSON.stringify(reports)
    );


    renderWasteHistory();

}


/* =========================================================
   14. GET REPORTS
========================================================= */

function getWasteReports() {

    const saved =
        localStorage.getItem(
            OceanEcoTech.storageKey
        );


    if (!saved) {

        return [];

    }


    try {

        const reports =
            JSON.parse(saved);


        return Array.isArray(reports)
            ? reports
            : [];

    }

    catch {

        return [];

    }

}


/* =========================================================
   15. WASTE HISTORY
========================================================= */

function renderWasteHistory() {

    const containers =
        document.querySelectorAll(
            "[data-waste-history]"
        );


    if (!containers.length) return;


    const reports =
        getWasteReports();


    containers.forEach(container => {

        container.innerHTML = "";


        if (!reports.length) {

            container.innerHTML = `

                <div class="awaiting-hardware">

                    <div class="icon">♻️</div>

                    <h3>
                        No Collection History Yet
                    </h3>

                    <p>
                        Reports created through
                        Waste Reporting will appear here.
                    </p>

                </div>

            `;

            return;

        }


        reports
            .slice()
            .reverse()
            .forEach(report => {

                const item =
                    document.createElement("div");


                item.className =
                    "timeline-item";


                item.innerHTML = `

                    <h3>
                        ♻️
                        ${escapeHTML(
                            report.wasteType
                        )}
                    </h3>

                    <p>
                        📍
                        ${escapeHTML(
                            report.location
                        )}
                    </p>

                    <p>
                        📅
                        ${formatDate(
                            report.date
                        )}
                    </p>

                    ${
                        report.quantity
                            ? `
                                <p>
                                    📦
                                    ${escapeHTML(
                                        report.quantity
                                    )}
                                </p>
                              `
                            : ""
                    }

                    ${
                        report.description
                            ? `
                                <p>
                                    ${escapeHTML(
                                        report.description
                                    )}
                                </p>
                              `
                            : ""
                    }

                `;


                container.appendChild(item);

            });

    });

}


/* =========================================================
   16. CLEAR LOCAL HISTORY
========================================================= */

function clearWasteHistory() {

    localStorage.removeItem(
        OceanEcoTech.storageKey
    );


    renderWasteHistory();

}


/* =========================================================
   17. MAP CONNECTION
========================================================= */

function registerMap(mapInstance) {

    if (!mapInstance) return;


    OceanEcoTech.map =
        mapInstance;

}


/* =========================================================
   18. VERIFIED MAP MARKER
========================================================= */

function addVerifiedMonitoringPoint(
    longitude,
    latitude,
    title
) {

    /*
       This function only accepts coordinates
       supplied by a real/verified source.

       It does NOT generate coordinates.
    */


    if (
        !OceanEcoTech.map ||
        typeof longitude !== "number" ||
        typeof latitude !== "number"
    ) {

        return;

    }


    if (
        typeof maplibregl === "undefined"
    ) {

        return;

    }


    const marker =
        new maplibregl.Marker()
            .setLngLat([
                longitude,
                latitude
            ])
            .setPopup(
                new maplibregl.Popup()
                    .setHTML(`
                        <strong>
                            📍
                            ${escapeHTML(
                                title ||
                                "Verified Monitoring Point"
                            )}
                        </strong>
                    `)
            )
            .addTo(
                OceanEcoTech.map
            );


    OceanEcoTech.mapMarkers.push(
        marker
    );

}


/* =========================================================
   19. CLEAR MAP MARKERS
========================================================= */

function clearMapMarkers() {

    OceanEcoTech.mapMarkers
        .forEach(marker => {

            marker.remove();

        });


    OceanEcoTech.mapMarkers = [];

}


/* =========================================================
   20. FORM MESSAGE
========================================================= */

function showFormMessage(
    form,
    message,
    type
) {

    const oldMessage =
        form.querySelector(
            ".form-message"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    const box =
        document.createElement("div");


    box.className =
        "form-message";


    box.textContent =
        message;


    box.style.marginBottom =
        "15px";

    box.style.padding =
        "12px 15px";

    box.style.borderRadius =
        "12px";

    box.style.fontSize =
        "0.65rem";


    if (type === "warning") {

        box.style.background =
            "#FFF4DD";

        box.style.color =
            "#8A6B12";

    } else {

        box.style.background =
            "#E1F7ED";

        box.style.color =
            "#16805B";

    }


    form.prepend(box);


    setTimeout(() => {

        box.remove();

    }, 5000);

}


/* =========================================================
   21. BUTTONS
========================================================= */

function initializeButtons() {

    document.querySelectorAll(
        "[data-scroll-to]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    document.querySelector(
                        button.dataset.scrollTo
                    );


                if (!target) return;


                target.scrollIntoView({
                    behavior: "smooth"
                });

            }
        );

    });


    document.querySelectorAll(
        "[data-go-back]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                window.history.back();

            }
        );

    });

}


/* =========================================================
   22. CUTE OCEAN BUBBLES
========================================================= */

function initializeCuteEffects() {

    const hero =
        document.querySelector(".hero");


    if (!hero) return;


    const bubbles = [

        ["bubble-small", "10%", "30%"],

        ["bubble-medium", "82%", "25%"],

        ["bubble-small", "72%", "70%"],

        ["bubble-large", "92%", "55%"]

    ];


    bubbles.forEach(
        ([size, left, top]) => {

            const bubble =
                document.createElement("div");


            bubble.className =
                `bubble ${size}`;


            bubble.style.left =
                left;

            bubble.style.top =
                top;


            hero.appendChild(
                bubble
            );

        }
    );

}


/* =========================================================
   23. UTILITIES
========================================================= */

function generateID() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );

}


function cleanInput(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value).trim();

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function formatDate(value) {

    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Date unavailable";

    }


    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   24. PUBLIC HARDWARE API
========================================================= */

window.OceanEcoTechAPI = {

    receiveSensorData,

    registerMap,

    addVerifiedMonitoringPoint,

    clearMapMarkers,

    getWasteReports,

    clearWasteHistory

};


/* =========================================================
   🌊 APPLICATION READY
========================================================= */

console.log(
    "🌊 Ocean × Eco-Tech loaded — Real Data Only."
);

console.log(
    "📡 Hardware: Awaiting Hardware Data"
);