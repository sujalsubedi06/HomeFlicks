/* =====================================================
   MovieHub — script.js
   Samsung Smart TV Compatible Version
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    initializeApp();
});


/* =====================================================
   APP INITIALIZATION
===================================================== */

function initializeApp() {

    initializeBrand();
    initializeGithub();
    createPlayer();

    initNavbarScroll();
    initFullscreenButton();
    initReloadButton();
    initCopyButton();
    initKeyboardShortcuts();

}


/* =====================================================
   BRAND
===================================================== */

function initializeBrand() {

    if (!window.APP_CONFIG) {
        return;
    }


    document.title =
        APP_CONFIG.brand + " • Premium Player";


    var navbarLogo =
        document.querySelector(".navbar__logo");


    if (navbarLogo) {

        var brand = APP_CONFIG.brand;

        navbarLogo.innerHTML =
            '<span class="navbar__logo-primary">' +
            brand.substring(0, brand.length - 3) +
            '</span>' +

            '<span class="navbar__logo-accent">' +
            brand.substring(brand.length - 3) +
            '</span>';

    }


    var footerBrand =
        document.getElementById("brandName");


    if (footerBrand) {

        footerBrand.textContent =
            APP_CONFIG.brand;

    }

}



/* =====================================================
   GITHUB LINK
===================================================== */

function initializeGithub() {

    var github =
        document.getElementById("githubLink");


    if (!github) {
        return;
    }


    var url =
        "https://github.com";


    if (
        window.APP_CONFIG &&
        APP_CONFIG.githubUrl
    ) {

        url = APP_CONFIG.githubUrl;

    }


    github.setAttribute(
        "href",
        url
    );

}



/* =====================================================
   PLAYER
===================================================== */

function createPlayer() {


    var container =
        document.getElementById("player");


    if (!container) {
        return;
    }


    container.innerHTML =
        buildLoadingState();



    if (
        !window.APP_CONFIG ||
        !APP_CONFIG.playerUrl
    ) {


        container.innerHTML = "";


        container.appendChild(
            buildEmptyState()
        );


        return;

    }



    var iframe =
        buildIframe(
            APP_CONFIG.playerUrl
        );



    iframe.onload = function () {


        var loader =
            container.querySelector(
                ".player-loading"
            );


        if (loader) {

            loader.parentNode.removeChild(
                loader
            );

        }

    };



    iframe.onerror = function () {


        container.innerHTML =
        '<div class="hero__player-empty">' +

        '<p class="hero__player-empty-text">' +
        'Unable to load movie' +
        '</p>' +

        '<p class="hero__player-empty-sub">' +
        'Please check iframe URL.' +
        '</p>' +

        '</div>';


        announce(
            "Unable to load player"
        );


    };



    container.appendChild(
        iframe
    );


}



/* =====================================================
   IFRAME
===================================================== */

function buildIframe(url) {


    var iframe =
        document.createElement(
            "iframe"
        );


    iframe.src = url;


    iframe.id =
        "moviePlayerFrame";


    iframe.title =
        "Movie Player";



    iframe.allow =
        "autoplay; fullscreen";



    iframe.allowFullscreen = true;


    iframe.frameBorder =
        "0";


    iframe.loading =
        "eager";


    return iframe;


}
/* =====================================================
   LOADING STATE
===================================================== */

function buildLoadingState() {

    return (
        '<div class="player-loading">' +

            '<div class="loader"></div>' +

            '<p>Loading player...</p>' +

        '</div>'
    );

}



/* =====================================================
   EMPTY STATE
===================================================== */

function buildEmptyState() {


    var wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "hero__player-empty";


    wrapper.innerHTML =
        '<p class="hero__player-empty-text">' +
            'NO MOVIE LOADED' +
        '</p>' +

        '<p class="hero__player-empty-sub">' +
            'Open config.js and add iframe URL.' +
        '</p>';



    return wrapper;

}





/* =====================================================
   NAVBAR
===================================================== */

function initNavbarScroll() {


    var navbar =
        document.getElementById(
            "navbar"
        );


    if (!navbar) {

        return;

    }



    function handleScroll() {


        if (
            window.scrollY > 20
        ) {

            navbar.classList.add(
                "is-scrolled"
            );

        } else {

            navbar.classList.remove(
                "is-scrolled"
            );

        }


    }



    window.addEventListener(
        "scroll",
        handleScroll
    );



    handleScroll();


}





/* =====================================================
   FULLSCREEN
===================================================== */

function initFullscreenButton() {


    var button =
        document.getElementById(
            "fullscreenBtn"
        );


    var player =
        document.querySelector(
            ".hero__player"
        );



    if (
        !button ||
        !player
    ) {

        return;

    }



    addRipple(
        button
    );



    button.addEventListener(
        "click",
        function() {



            try {



                if (
                    !document.fullscreenElement
                ) {



                    if (
                        player.requestFullscreen
                    ) {

                        player.requestFullscreen();

                    }



                    else if (
                        player.webkitRequestFullscreen
                    ) {

                        player.webkitRequestFullscreen();

                    }



                }



                else {



                    if (
                        document.exitFullscreen
                    ) {

                        document.exitFullscreen();

                    }



                }



            }


            catch(error) {


                announce(
                    "Fullscreen unavailable"
                );


            }



        }
    );



}





/* =====================================================
   RELOAD PLAYER
===================================================== */

function initReloadButton() {


    var button =
        document.getElementById(
            "reloadBtn"
        );



    if (!button) {

        return;

    }



    addRipple(
        button
    );



    button.addEventListener(
        "click",
        function() {



            button.disabled =
                true;



            createPlayer();



            announce(
                "Player reloaded"
            );



            setTimeout(
                function() {

                    button.disabled =
                        false;


                },
                1000
            );



        }
    );


}





/* =====================================================
   COPY LINK
===================================================== */

function initCopyButton() {


    var button =
        document.getElementById(
            "copyBtn"
        );



    var label =
        document.getElementById(
            "copyBtnLabel"
        );



    if (
        !button ||
        !label
    ) {

        return;

    }



    addRipple(
        button
    );



    button.addEventListener(
        "click",
        function() {



            if (
                !window.APP_CONFIG ||
                !APP_CONFIG.playerUrl
            ) {


                announce(
                    "No movie loaded"
                );


                return;

            }



            if (
                navigator.clipboard
            ) {



                navigator.clipboard.writeText(
                    APP_CONFIG.playerUrl
                );



                label.textContent =
                    "✓ Copied!";



                announce(
                    "Link copied"
                );



                setTimeout(
                    function() {


                        label.textContent =
                            "Copy";


                    },
                    1800
                );



            }


            else {


                announce(
                    "Copy unavailable"
                );


            }



        }
    );


}
/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

function initKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        function (event) {


            var active =
                document.activeElement;


            if (
                active &&
                (
                    active.tagName === "INPUT" ||
                    active.tagName === "TEXTAREA"
                )
            ) {

                return;

            }



            var key =
                event.key
                    ? event.key.toLowerCase()
                    : "";



            switch (key) {


                case "f":

                    var fullscreen =
                        document.getElementById(
                            "fullscreenBtn"
                        );


                    if (fullscreen) {

                        fullscreen.click();

                    }

                    break;



                case "r":


                    event.preventDefault();


                    var reload =
                        document.getElementById(
                            "reloadBtn"
                        );


                    if (reload) {

                        reload.click();

                    }


                    break;



                case "c":


                    var copy =
                        document.getElementById(
                            "copyBtn"
                        );


                    if (copy) {

                        copy.click();

                    }


                    break;


            }


        }
    );

}



/* =====================================================
   RIPPLE EFFECT
===================================================== */

function addRipple(button) {


    button.addEventListener(
        "click",
        function(event) {


            var rect =
                button.getBoundingClientRect();



            var ripple =
                document.createElement(
                    "span"
                );



            var size =
                Math.max(
                    rect.width,
                    rect.height
                );



            ripple.className =
                "btn__ripple";



            ripple.style.width =
                size + "px";


            ripple.style.height =
                size + "px";



            ripple.style.left =
                (
                    event.clientX -
                    rect.left -
                    size / 2
                ) + "px";



            ripple.style.top =
                (
                    event.clientY -
                    rect.top -
                    size / 2
                ) + "px";



            button.appendChild(
                ripple
            );



            setTimeout(
                function() {

                    if (ripple.parentNode) {

                        ripple.parentNode.removeChild(
                            ripple
                        );

                    }

                },
                600
            );


        }
    );


}



/* =====================================================
   ACCESSIBILITY
===================================================== */

function announce(message) {


    var live =
        document.getElementById(
            "statusMessage"
        );


    if (!live) {

        return;

    }



    live.textContent = "";



    setTimeout(
        function() {

            live.textContent =
                message;

        },
        10
    );


}



/* =====================================================
   CONNECTION STATUS
===================================================== */

window.addEventListener(
    "online",
    function() {

        announce(
            "Connection restored"
        );

    }
);



window.addEventListener(
    "offline",
    function() {

        announce(
            "You are offline"
        );

    }
);



window.onerror =
    function() {

        announce(
            "Something went wrong"
        );

    };



/* =====================================================
   END OF FILE
===================================================== */