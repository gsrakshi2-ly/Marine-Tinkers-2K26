/* =========================================================
   OCEAN × ECO-TECH
   APP.JS
   MAP + GLOBAL INTERACTIONS
   ========================================================= */


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "active"
            );

            menuToggle.textContent =
                navLinks.classList.contains(
                    "active"
                )
                    ? "✕"
                    : "☰";

        }
    );


    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove(
                        "active"
                    );

                    menuToggle.textContent =
                        "☰";

                }
            );

        });

}


/* =========================================================
   WORLD MAP
   ========================================================= */

let worldMap = null;


if (
    document.getElementById(
        "worldMap"
    )
) {

    worldMap = L.map(
        "worldMap",
        {

            center: [
                20,
                0
            ],

            zoom: 2,

            minZoom: 2,

            maxZoom: 19,

            zoomControl: true,

            scrollWheelZoom: true,

            doubleClickZoom: true,

            touchZoom: true,

            dragging: true,

            zoomSnap: 0.5,

            zoomDelta: 0.5,

            worldCopyJump: true

        }
    );


    /* =====================================================
       REAL STREET / ROAD MAP
       ===================================================== */

    const streetMap =
        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {

                maxZoom: 19,

                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

            }
        );


    streetMap.addTo(
        worldMap
    );


    /* =====================================================
       OCEAN-STYLE BASE LAYER
       ===================================================== */

    const oceanMap =
        L.tileLayer(
            "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
            {

                maxZoom: 19,

                attribution:
                    '&copy; OpenStreetMap contributors'

            }
        );


    /* =====================================================
       LAYER CONTROL
       ===================================================== */

    const baseMaps = {

        "🗺️ Street Map":
            streetMap,

        "🌊 Ocean Map":
            oceanMap

    };


    L.control
        .layers(
            baseMaps,
            null,
            {
                position:
                    "topright"
            }
        )
        .addTo(
            worldMap
        );


    /* =====================================================
       SCALE
       ===================================================== */

    L.control
        .scale(
            {
                metric: true,
                imperial: true
            }
        )
        .addTo(
            worldMap
        );


    /* =====================================================
       CONTINENT COLOUR DATA
       ===================================================== */

    const continentColors = {

        Asia:
            "#159AAB",

        Europe:
            "#72D6D8",

        Africa:
            "#BFE8DD",

        NorthAmerica:
            "#8CC8C5",

        SouthAmerica:
            "#4FA7A9",

        Oceania:
            "#5DB7B9",

        Antarctica:
            "#D8EFE9"

    };


    /* =====================================================
       CONTINENT POLYGONS
       
       These are intentionally simplified geographic
       overlays for visual continent colour coding.
       They do NOT represent sensor data.
       ===================================================== */

    const continents = {

        Asia: [
            [
                [80, 25],
                [100, 35],
                [120, 45],
                [145, 50],
                [150, 30],
                [135, 5],
                [120, 5],
                [100, 10],
                [80, 25]
            ]
        ],

        Europe: [
            [
                [-10, 35],
                [10, 45],
                [30, 55],
                [50, 50],
                [35, 35],
                [10, 35],
                [-10, 35]
            ]
        ],

        Africa: [
            [
                [-20, 35],
                [10, 37],
                [40, 30],
                [50, 5],
                [35, -35],
                [5, -35],
                [-15, 0],
                [-20, 35]
            ]
        ],

        NorthAmerica: [
            [
                [-170, 65],
                [-140, 70],
                [-100, 70],
                [-60, 55],
                [-55, 30],
                [-80, 15],
                [-105, 25],
                [-120, 45],
                [-150, 50],
                [-170, 65]
            ]
        ],

        SouthAmerica: [
            [
                [-80, 12],
                [-55, 8],
                [-35, -5],
                [-45, -25],
                [-55, -55],
                [-75, -45],
                [-80, -15],
                [-80, 12]
            ]
        ],

        Oceania: [
            [
                [110, -10],
                [155, -10],
                [155, -40],
                [125, -40],
                [110, -10]
            ]
        ],

        Antarctica: [
            [
                [-180, -60],
                [180, -60],
                [180, -90],
                [-180, -90],
                [-180, -60]
            ]
        ]

    };


    /* =====================================================
       CONTINENT OVERLAYS
       ===================================================== */

    const continentLayers = {};


    Object.entries(
        continents
    ).forEach(
        ([name, coordinates]) => {

            continentLayers[name] =
                L.polygon(
                    coordinates,
                    {

                        color:
                            continentColors[
                                name
                            ],

                        fillColor:
                            continentColors[
                                name
                            ],

                        fillOpacity:
                            0.22,

                        weight:
                            1.5,

                        opacity:
                            0.65,

                        interactive:
                            false

                    }
                )
                .addTo(
                    worldMap
                );

        }
    );


    /* =====================================================
       VERIFIED MONITORING DATA
       
       IMPORTANT:
       Empty by default.
       
       Do NOT add invented locations.
       ===================================================== */

    let verifiedMonitoringPoints = [];


    /* =====================================================
       LOAD VERIFIED POINTS
       
       If another part of the application stores real
       verified GPS points in localStorage, they can be
       displayed automatically.
       ===================================================== */

    try {

        const storedPoints =
            JSON.parse(
                localStorage.getItem(
                    "verifiedMonitoringPoints"
                ) || "[]"
            );


        if (
            Array.isArray(
                storedPoints
            )
        ) {

            verifiedMonitoringPoints =
                storedPoints;

        }

    } catch (error) {

        verifiedMonitoringPoints = [];

    }


    /* =====================================================
       DISPLAY VERIFIED POINTS
       ===================================================== */

    verifiedMonitoringPoints.forEach(
        point => {

            if (
                typeof point.lat !==
                    "number" ||
                typeof point.lng !==
                    "number"
            ) {

                return;

            }


            const marker =
                L.circleMarker(
                    [
                        point.lat,
                        point.lng
                    ],
                    {

                        radius:
                            8,

                        color:
                            "#FFD700",

                        fillColor:
                            "#FFD700",

                        fillOpacity:
                            0.95,

                        weight:
                            3

                    }
                )
                .addTo(
                    worldMap
                );


            marker.bindPopup(`

                <div>

                    <div class="popup-title">
                        📍 Verified Monitoring Point
                    </div>

                    <div>
                        ${
                            point.name ||
                            "Ocean × Eco-Tech"
                        }
                    </div>

                    <div class="popup-status">
                        Verified project data
                    </div>

                </div>

            `);

        }
    );


    /* =====================================================
       MAP ZOOM EVENT
       ===================================================== */

    worldMap.on(
        "zoomend",
        () => {

            const zoom =
                worldMap.getZoom();

            document.title =
                `Map • Zoom ${zoom.toFixed(
                    1
                )} | Ocean × Eco-Tech`;

        }
    );


    /* =====================================================
       MAP RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (worldMap) {

                worldMap.invalidateSize();

            }

        }
    );

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


if (
    "IntersectionObserver"
    in window
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add(
                                    "visible"
                                );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:
                    0.1
            }
        );


    revealElements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

} else {

    revealElements.forEach(
        element => {

            element.classList.add(
                "visible"
            );

        }
    );

}