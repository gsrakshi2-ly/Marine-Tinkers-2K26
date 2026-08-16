```javascript
"use strict";

/* =========================================================
   OCEAN × ECO-TECH — APP.JS
   ---------------------------------------------------------
   No fake sensor data.
   No simulated monitoring readings.
   No AI.
   Waste reports are stored locally in the browser.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeNavigation();
    initializeScrollEffects();
    initializeMobileNavigation();
    initializeRevealAnimations();
    initializeCounters();
    initializeForms();
    initializeWasteReporting();
    initializeReportClearButton();
    initializeHistory();
    initializeMap();
    initializeLiveData();
});


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {
    const currentPage =
        window.location.pathname.split("/").pop().toLowerCase() ||
        "index.html";

    const navLinks = document.querySelectorAll("nav a[href]");

    navLinks.forEach(link => {
        const href =
            link.getAttribute("href")
                ?.split("#")[0]
                .split("?")[0]
                .toLowerCase();

        if (!href || href === "#") return;

        if (
            href === currentPage ||
            (currentPage === "" && href === "index.html")
        ) {
            link.classList.add("active");
        }
    });
}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

function initializeScrollEffects() {
    const nav = document.querySelector("nav");

    if (!nav) return;

    const updateNavbar = () => {
        nav.classList.toggle(
            "scrolled",
            window.scrollY > 25
        );
    };

    updateNavbar();

    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );
}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initializeMobileNavigation() {
    const nav = document.querySelector("nav");
    const navList = nav?.querySelector("ul");

    if (!nav || !navList) return;

    let menuButton =
        nav.querySelector(".mobile-menu-btn");

    if (!menuButton) {
        menuButton = document.createElement("button");

        menuButton.className =
            "mobile-menu-btn";

        menuButton.type = "button";

        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.textContent = "☰";

        nav.appendChild(menuButton);
    }

    menuButton.addEventListener("click", () => {
        const open =
            navList.classList.toggle(
                "mobile-open"
            );

        menuButton.textContent =
            open ? "✕" : "☰";

        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );
    });

    navList.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navList.classList.remove("mobile-open");

            menuButton.textContent = "☰";

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

function initializeRevealAnimations() {
    const elements = document.querySelectorAll(
        ".impact-card, " +
        ".about-card, " +
        ".build-card, " +
        ".achievement-card, " +
        ".area-card, " +
        ".value-card, " +
        ".process-item, " +
        ".journey-item, " +
        ".story-card, " +
        ".team-note, " +
        ".status-box"
    );

    if (!elements.length) return;

    elements.forEach(element => {
        element.classList.add("eco-reveal");
    });

    if (!("IntersectionObserver" in window)) {
        elements.forEach(element => {
            element.classList.add("eco-visible");
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "eco-visible"
                        );

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
   STATIC COUNTERS
   ---------------------------------------------------------
   Only works when the HTML explicitly provides
   data-counter. It never creates sensor values.
========================================================= */

function initializeCounters() {
    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );

    counters.forEach(counter => {
        const value =
            Number(counter.dataset.counter);

        if (!Number.isFinite(value)) return;

        animateNumber(counter, value);
    });
}


function animateNumber(element, target) {
    const duration = 900;
    const start = performance.now();

    function update(time) {
        const progress =
            Math.min(
                (time - start) / duration,
                1
            );

        const eased =
            1 - Math.pow(1 - progress, 3);

        element.textContent =
            Math.round(
                target * eased
            ).toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


/* =========================================================
   GENERAL FORMS
========================================================= */

function initializeForms() {
    const forms =
        document.querySelectorAll(
            "form:not(#wasteReportForm)"
        );

    forms.forEach(form => {
        form.addEventListener("submit", event => {
            const hasRealAction =
                form.getAttribute("action") &&
                form.getAttribute("action") !== "#";

            if (hasRealAction) return;

            event.preventDefault();

            const requiredFields =
                form.querySelectorAll("[required]");

            let valid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;

                    field.classList.add(
                        "form-error"
                    );
                } else {
                    field.classList.remove(
                        "form-error"
                    );
                }
            });

            if (!valid) {
                showFormMessage(
                    form,
                    "Please complete the required fields."
                );

                return;
            }

            showFormMessage(
                form,
                "Your information has been recorded locally. No online submission service is connected yet."
            );
        });
    });
}


/* =========================================================
   WASTE REPORTING
========================================================= */

function initializeWasteReporting() {
    const form =
        document.querySelector(
            "#wasteReportForm"
        );

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const location =
            form.querySelector(
                "[name='location']"
            )?.value.trim() || "";

        const wasteType =
            form.querySelector(
                "[name='wasteType']"
            )?.value.trim() || "";

        const description =
            form.querySelector(
                "[name='description']"
            )?.value.trim() || "";

        if (!location || !wasteType) {
            showFormMessage(
                form,
                "Please enter the location and waste type."
            );

            return;
        }

        const report = {
            id: Date.now(),
            location,
            wasteType,
            description,
            createdAt:
                new Date().toISOString()
        };

        const reports =
            getStoredReports();

        reports.push(report);

        localStorage.setItem(
            "oceanEcoWasteReports",
            JSON.stringify(reports)
        );

        showFormMessage(
            form,
            "Report saved on this device. It has not been sent to a server."
        );

        form.reset();

        renderWasteReports();
        initializeHistory();
    });

    renderWasteReports();
}


/* =========================================================
   GET LOCAL REPORTS
========================================================= */

function getStoredReports() {
    try {
        const stored =
            localStorage.getItem(
                "oceanEcoWasteReports"
            );

        if (!stored) return [];

        const reports =
            JSON.parse(stored);

        return Array.isArray(reports)
            ? reports
            : [];

    } catch {
        return [];
    }
}


/* =========================================================
   DISPLAY WASTE REPORTS
========================================================= */

function renderWasteReports() {
    const container =
        document.querySelector(
            "#wasteReportHistory"
        );

    if (!container) return;

    const reports =
        getStoredReports();

    if (!reports.length) {
        container.innerHTML = `
            <div class="empty-state">
                🌊 No waste reports have been recorded on this device yet.
            </div>
        `;

        return;
    }

    container.innerHTML =
        reports
            .slice()
            .reverse()
            .map(report => {
                const date =
                    new Date(
                        report.createdAt
                    ).toLocaleString();

                return `
                    <article class="report-item">

                        <div class="report-icon">
                            ♻️
                        </div>

                        <div class="report-content">

                            <strong>
                                ${escapeHTML(
                                    report.wasteType
                                )}
                            </strong>

                            <span>
                                📍 ${escapeHTML(
                                    report.location
                                )}
                            </span>

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

                            <small>
                                ${escapeHTML(date)}
                            </small>

                        </div>

                    </article>
                `;
            })
            .join("");
}


/* =========================================================
   CLEAR REPORTS
========================================================= */

function initializeReportClearButton() {
    const button =
        document.querySelector(
            "#clearWasteReports"
        );

    if (!button) return;

    button.addEventListener("click", () => {
        localStorage.removeItem(
            "oceanEcoWasteReports"
        );

        renderWasteReports();
        initializeHistory();
    });
}


/* =========================================================
   COLLECTION HISTORY
========================================================= */

function initializeHistory() {
    const container =
        document.querySelector(
            "#collectionHistory"
        );

    if (!container) return;

    const reports =
        getStoredReports();

    if (!reports.length) {
        container.innerHTML = `
            <div class="empty-state">
                📋 No collection history is available yet.
                Real collection records will appear once
                the system is connected to actual hardware.
            </div>
        `;

        return;
    }

    container.innerHTML =
        reports
            .slice()
            .reverse()
            .map(report => `
                <div class="history-item">

                    <span>
                        ♻️
                        ${escapeHTML(
                            report.wasteType
                        )}
                    </span>

                    <span>
                        📍
                        ${escapeHTML(
                            report.location
                        )}
                    </span>

                </div>
            `)
            .join("");
}


/* =========================================================
   FORM MESSAGE
========================================================= */

function showFormMessage(form, message) {
    let messageBox =
        form.querySelector(
            ".form-message"
        );

    if (!messageBox) {
        messageBox =
            document.createElement("div");

        messageBox.className =
            "form-message";

        form.appendChild(messageBox);
    }

    messageBox.textContent = message;

    messageBox.classList.add(
        "visible"
    );
}


/* =========================================================
   LIVE DATA
   ---------------------------------------------------------
   Intentionally does not create fake readings.
========================================================= */

function initializeLiveData() {
    const liveElements =
        document.querySelectorAll(
            "[data-live-sensor]"
        );

    liveElements.forEach(element => {
        element.textContent =
            "Waiting for hardware connection…";
    });
}


/* =========================================================
   WORLD MAP
   ---------------------------------------------------------
   Handles only monitoring points that already exist
   in the HTML. No fake points are generated.
========================================================= */

function initializeMap() {
    const map =
        document.querySelector(
            "#worldMap"
        );

    if (!map) return;

    const points =
        map.querySelectorAll(
            "[data-monitoring-point]"
        );

    points.forEach(point => {
        point.addEventListener("click", () => {
            const label =
                point.dataset.label;

            const info =
                document.querySelector(
                    "#mapInfo"
                );

            if (info && label) {
                info.textContent = label;
            }
        });
    });
}


/* =========================================================
   STORAGE EVENT
========================================================= */

window.addEventListener(
    "storage",
    event => {
        if (
            event.key ===
            "oceanEcoWasteReports"
        ) {
            renderWasteReports();
            initializeHistory();
        }
    }
);


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   PAGE HELPERS
========================================================= */

function getCurrentPage() {
    return (
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase()
        || "index.html"
    );
}


function isPage(pageName) {
    return (
        getCurrentPage() ===
        pageName.toLowerCase()
    );
}


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener(
    "keydown",
    event => {
        if (event.key !== "Escape") return;

        const openMenus =
            document.querySelectorAll(
                ".mobile-open"
            );

        openMenus.forEach(menu => {
            menu.classList.remove(
                "mobile-open"
            );
        });

        const menuButton =
            document.querySelector(
                ".mobile-menu-btn"
            );

        if (menuButton) {
            menuButton.textContent = "☰";

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }
);


/* =========================================================
   DYNAMIC UI STYLES
========================================================= */

const dynamicStyle =
    document.createElement("style");

dynamicStyle.textContent = `

nav.scrolled {
    box-shadow:
        0 8px 30px rgba(0,0,0,.12);
}

.eco-reveal {
    opacity: 0;
    transform: translateY(18px);

    transition:
        opacity .6s ease,
        transform .6s ease;
}

.eco-reveal.eco-visible {
    opacity: 1;
    transform: translateY(0);
}

.form-error {
    border-color: #E45D5D !important;

    box-shadow:
        0 0 0 3px rgba(228,93,93,.08) !important;
}

.form-message {
    display: none;

    margin-top: 15px;

    padding: 13px 16px;

    border-radius: 12px;

    background: #EAF9F7;

    border: 1px solid #BDE8E2;

    color: #063B5C;

    font-size: 12px;

    line-height: 1.6;
}

.form-message.visible {
    display: block;
}

.empty-state {
    padding: 25px;

    border-radius: 18px;

    background: #F7FCFC;

    border: 1px solid #DCECEE;

    color: #66808B;

    font-size: 13px;

    line-height: 1.7;
}

.report-item {
    display: flex;

    gap: 15px;

    padding: 18px;

    margin-bottom: 12px;

    border-radius: 17px;

    background: #FFFFFF;

    border: 1px solid #DCECEE;
}

.report-icon {
    width: 42px;
    height: 42px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 13px;

    background: #E7F9F7;

    font-size: 21px;
}

.report-content {
    display: flex;

    flex-direction: column;

    gap: 4px;
}

.report-content strong {
    color: #063B5C;

    font-size: 13px;
}

.report-content span {
    color: #4E707C;

    font-size: 11px;
}

.report-content p {
    color: #71878E;

    font-size: 11px;

    line-height: 1.6;
}

.report-content small {
    color: #91A4AA;

    font-size: 9px;
}

.history-item {
    display: flex;

    justify-content: space-between;

    gap: 20px;

    padding: 15px 18px;

    margin-bottom: 10px;

    border-radius: 14px;

    background: #FFFFFF;

    border: 1px solid #DCECEE;

    color: #52717C;

    font-size: 11px;
}

.mobile-menu-btn {
    display: none;

    border: 0;

    background: transparent;

    color: #FFFFFF;

    font-size: 25px;

    cursor: pointer;
}

@media (max-width: 800px) {

    .mobile-menu-btn {
        display: block;
    }

    nav ul.mobile-open {
        display: flex;

        position: absolute;

        top: 74px;
        left: 0;

        width: 100%;

        padding: 20px;

        flex-direction: column;

        align-items: stretch;

        gap: 5px;

        background: rgba(4,45,70,.98);

        border-top:
            1px solid rgba(255,255,255,.08);

        box-shadow:
            0 15px 30px rgba(0,0,0,.15);
    }

    nav ul.mobile-open li a {
        display: block;

        padding: 12px 10px;
    }
}

`;

document.head.appendChild(
    dynamicStyle
);


/* =========================================================
   CONNECTION MESSAGE
========================================================= */

console.log(
    "🌊 Ocean × Eco-Tech loaded."
);

console.log(
    "📡 No sensor data is generated until real hardware is connected."
);
```
