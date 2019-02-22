function animateCss(element, animationName, callback) {
    element.addClass("animated" + ' ' + animationName);

    function handleAnimationEnd() {
        element.removeClass("animated" + ' ' + animationName);

        if (typeof callback === 'function') callback()
    }

    element.one('animationend', handleAnimationEnd);
}


function changePage(page) {
    $("html").css("overflow", "hidden");
    $("html")[0].offsetHeight; // flushes CSS buffer

    $("body").css("animation-duration", "0.5s");
    $("body")[0].offsetHeight; // flushes CSS buffer
    animateCss($("body"), "rotateOutDownRight", function () {
        $("body").empty().attr("id", page + "Body");

        // console.log("Going to "+ page);
        $.get(page + ".html", function (data) {

            $("body").append(data);
            animateCss($("body"), "rotateInDownRight", function () {
                $("html").css("overflow", "");
                $("body").css("animation-duration", "");
                $("body")[0].offsetHeight; // flushes CSS buffer
            });
        });
    });
}


function randomBackground(element, backgroundList, numberOfBackgrounds) {
    let rand;
    do {
        rand = Math.floor((Math.random() * numberOfBackgrounds) + 1);
    }
    while (backgroundList[rand] === true);

    element.css("background-image", "url(../images/" + $("body").attr("id").replace("Body", '') + "/backgrounds/" + rand + ".png)");
    backgroundList[rand] = true;
}

const closedOpacity = 0.1;
const hoverOpacity = 0.7;
const openOpacity = 1;

const startTransDuration = "2s";
const stateTransDuration = "0.5s";
const hoverTransDuration = "0.3s";

let state = "closed";
let hovered = false;


function addCuprinsSlider() {

    $("body").prepend("<div id=\"cuprinsSlideContainer\"><div id=\"cuprins\"></div><div id=\"slider\">Cuprins</div></div>")
	$.get("texts/" + $("body").attr("id").replace("Body", '') + "/cuprins.txt", function (data) {
            let parsed = data.split(/\r?\n/);
            // console.log(parsed);
            $.each(parsed, function (outerN, data) {
                let parsed = data.split("!link!");
                $.each(parsed, function (n, data) {
                    // console.log(parsed);
                    if (n === 0)
                        $("#cuprins").append('<a class="textCuprins" id="textCuprins' + outerN + '" style="margin: auto;">' + data + '</a>');
                    else if (n === 1)
                        $("#textCuprins" + outerN).attr("href", data);
                });
            });

            $("#cuprinsSlideContainer").addClass("noTransition").css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');
            $("#cuprinsSlideContainer")[0].offsetHeight; // flushes CSS buffer
            $("#cuprinsSlideContainer").removeClass("noTransition");
            $("#cuprinsSlideContainer")[0].offsetHeight; // flushes CSS buffer
        });
	animateCss($("#cuprinsSlideContainer"), "bounceInLeft", function () {

            setTimeout(function () {
                if (state === "closed" && hovered === false)
                    $("#cuprinsSlideContainer").css("transition-duration", startTransDuration).css("transition-timing-function", "ease").css("opacity", closedOpacity);
            }, 1000);

            $("#cuprinsSlideContainer").on("mouseenter", function () {

                if (state === "closed") {
                    $("#cuprinsSlideContainer").css("transition-duration", hoverTransDuration).css("transition-timing-function", "ease").css("opacity", hoverOpacity);
                }
            });
            $("#cuprinsSlideContainer").on("mouseover", function () {

                hovered = true;
            });
            $("#cuprinsSlideContainer").on("mouseleave", function () {

                hovered = false;
                if (state === "closed") {
                    $("#cuprinsSlideContainer").css("transition-duration", hoverTransDuration).css("transition-timing-function", "ease").css("opacity", closedOpacity);
                }
            });
            $("#cuprinsSlideContainer").on("click", function (e) {

                if ($(e.target).hasClass('textCuprins') === true)
                    return;

                if (state === "opened") {

                    $("#cuprinsSlideContainer").css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                        .css("opacity", closedOpacity).css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');

                    state = "closed";
                }
                else {

                    $("#cuprinsSlideContainer").css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                        .css("opacity", openOpacity).css("margin-left", "0");

                    state = "opened";
                }
            });
        });
}