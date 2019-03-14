function animateCss(element, animationName, callback) {
    element.addClass("animated" + ' ' + animationName);

    function handleAnimationEnd() {
        element.removeClass("animated" + ' ' + animationName);

        if (typeof callback === 'function') callback()
    }

    element.one('animationend', handleAnimationEnd);
}


function changePage(page, direction = 'lr') {
    let outAnimation = "rotateOutDownRight";
    let inAnimation = "rotateInDownRight";
    if (direction === 'rl') {
        inAnimation = inAnimation.replace("Right", "Left");
        outAnimation = outAnimation.replace("Right", "Left");
    }

    $("html").css("overflow", "hidden");
    $("html")[0].offsetHeight; // flushes CSS buffer

    $("body").css("animation-duration", "0.5s");
    $("body")[0].offsetHeight; // flushes CSS buffer
    animateCss($("body"), outAnimation, function () {
        $(window).off("resize.personaje");
        $("body").empty();
        $("link[href='css/" + $("body").attr("id").replace("Body", '') + ".css']").remove();
        $("head").append('<link rel="stylesheet" href="css/' + page + '.css">');
        $("body").attr("id", page + "Body");
        $("body").load(page + ".html", function () {
            window.scrollTo(0, 0);
            animateCss($("body"), inAnimation, function () {
                $("html").css("overflow", "");
                $("body").css("animation-duration", "");
                $("body")[0].offsetHeight; // flushes CSS buffer
                $(function () {
                    $(window).trigger('resize');  // parallax effect breaks if it's loaded before the elements are stationary, so, during the animation, background-image is set
                    $("#start").css("background-image", "");
                    $(".spacers").css("background-image", "");
                });
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

    element.parallax({imageSrc: "images/" + $("body").attr("id").replace("Body", '') + "/backgrounds/" + rand + ".png"/* , bleed: 150 */});  // parallax effect breaks if it's loaded before the elements are stationary, so, during the animation, background-image is set
    element.css("background-image", "url(../images/" + $("body").attr("id").replace("Body", '') + "/backgrounds/" + rand + ".png)");
    backgroundList[rand] = true;
}


const hiddenOpacity = 0.1;
const hoverOpacity = 0.8;
const displayedOpacity = 1;

const startTransDuration = "2s";
const stateTransDuration = "0.5s";
const state2TransDuration = "0.25s";
const hoverTransDuration = "0.3s";

let state = "hidden";
let hovered = false;

function addCuprinsSlider(backButton = false) {

    if (backButton === false)
        $("body").prepend('<div id="cuprinsSlideContainer"><div id="cuprins"></div><div id="slider">Cuprins</div></div>');
    else {
        $("body").prepend('<div id="cuprinsSlideContainer"><div id="cuprins"></div><div id="slider" style="display: flex">' +
            '<div style="flex-basis: 95vh">Cuprins</div>' +
            '<div id="back" style="flex-basis: 5vh; padding: 15px 0; border-top: 1px solid white">Inapoi</div>' +
            '</div></div>');
    }

    $.getJSON("texts/" + $("body").attr("id").replace("Body", '') + "/cuprins.json", function (data) {
        for (let i = 0; i < data.length; ++i) {
            $("#cuprins").append('<a class="textCuprins" id="textCuprins' + i + '" href="' + data[i].href + '" style="margin: auto;">' + data[i].text + '</a>');
        }

        $("#cuprinsSlideContainer").addClass("noTransition").css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');
        $("#cuprinsSlideContainer")[0].offsetHeight; // flushes CSS buffer
        $("#cuprinsSlideContainer").removeClass("noTransition");
        $("#cuprinsSlideContainer")[0].offsetHeight; // flushes CSS buffer

    });

    animateCss($("#cuprinsSlideContainer"), "bounceInLeft", function () {

        setTimeout(function () {
            if (state === "hidden" && hovered === false)
                $("#cuprinsSlideContainer").css("transition-duration", startTransDuration).css("transition-timing-function", "ease").css("opacity", hiddenOpacity);
        }, 1000);

        $("#cuprinsSlideContainer").on("mouseover", function () {
            hovered = true;
            if (state === "hidden") {
                $("#cuprinsSlideContainer").css("transition-duration", hoverTransDuration).css("transition-timing-function", "ease").css("opacity", hoverOpacity);
            }
        });

        $("#cuprinsSlideContainer").on("mouseleave", function () {
            hovered = false;
            if (state === "hidden") {
                $("#cuprinsSlideContainer").css("transition-duration", hoverTransDuration).css("transition-timing-function", "ease").css("opacity", hiddenOpacity);
            }
        });

        $("#cuprinsSlideContainer").on('click', 'a[href^="#"]', function (event) {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 500);
        });

        $("#cuprinsSlideContainer").on("click", function (e) {
            if ($(e.target).hasClass('textCuprins') === true)
                return;
            else if ($(e.target).attr('id') === 'back') {
                changePage("fantastic", 'rl');
                return;
            }

            if (state === "displayed") {

                $("#cuprinsSlideContainer").css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                    .css("opacity", hiddenOpacity).css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');

                state = "hidden";
            }
            else {

                $("#cuprinsSlideContainer").css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                    .css("opacity", displayedOpacity).css('margin-left', '0');

                state = "displayed";
            }
        });
    });
}


function addRezumat() {
    var rezumatDisableSomeEvents = true;

    $("#bottomPart").append(
        '<div id="buttonRezumat" class="normalBackgroundColor">Rezumat</div>' +
        '<div id="rezumat" class="transparentBackgroundColor" style="display: none;">' +
        '<img id="exitRezumat" src="images/icons/exit.png" height="35">' +
        '</div>'
    );

    $("#buttonRezumat").on('click', function () {
        if (rezumatDisableSomeEvents === false)
            return;
        rezumatDisableSomeEvents = false;
        $("#rezumat").css("display", "");
        animateCss($("#rezumat"), "zoomIn");
        animateCss($("#buttonRezumat"), "zoomOut", function () {
            $("#buttonRezumat").css("display", "none");
            rezumatDisableSomeEvents = true;
        });
    });
    $("#buttonRezumat").on('mouseover', function () {
        // console.log(rezumatDisableSomeEvents);
        if (rezumatDisableSomeEvents === false)
            return;
        $("#buttonRezumat").css("transform", "scale(1.10)");
        $("#buttonRezumat").removeClass("normalBackgroundColor").addClass("lighterBackgroundColor");
    });
    $("#buttonRezumat").on('mouseleave', function () {
        $("#buttonRezumat").css("transform", "scale(1)");
        $("#buttonRezumat").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
    });

    $("#exitRezumat").on('click', function () {
        if (rezumatDisableSomeEvents === false)
            return;
        rezumatDisableSomeEvents = false;
        $("#buttonRezumat").css("display", "");
        animateCss($("#buttonRezumat"), "zoomIn");
        animateCss($("#rezumat"), "zoomOut", function () {
            $("#rezumat").css("display", "None");
            rezumatDisableSomeEvents = true;
        });
    })
}


function addGraph(element) {

    $("#" + element).addClass("graph normalBackgroundColor");
    $("#" + element).append(
        '<div id="' + element + 'CanvasContainer" class="graphCanvasContainer normalBackgroundColor wow slideInLeft" data-wow-offset="125"></div>' +
        '<div id="' + element + 'NodeData" class="graphNodeData darkBackgroundColor wow slideInRight" data-wow-offset="125">' +
        '<div id="' + element + 'NodeDataText" class="graphNodeDataText"></div></div>'
    );

    let option = {};
    // create an array with nodes
    let nodes = new vis.DataSet();
    // create an array with edges
    let edges = new vis.DataSet();
    let currentlyReading;
    let nodeId = 0;

    let nodeDataDefault = "Apasa pe orice nod pentru a afla mai multe informatii.";
    $("#" + element + "NodeData").empty().append(nodeDataDefault);

    // create a network
    var container = document.getElementById(element + "CanvasContainer");

    var options = {
        layout: {
            hierarchical: {
                enabled: true,
                direction: 'UD',
                nodeSpacing: 200
            }
        },
        interaction: {
            dragNodes: false,
            dragView: false,
            zoomView: false,
        },
        physics: {
            enabled: false,
            hierarchicalRepulsion: {
                nodeDistance: 200
            }
        },
        nodes: {
            color: "red",
            shape: "diamond",
            size: 20,
            font: {
                face: "Century Gothic",
                size: 16
            }
        },
        edges: {
            smooth: true,
            arrows: {to: true}
        }
    };

    // initialize your network!
    $.getJSON("texts/" + $("body").attr("id").replace("Body", '') + "/" + element + "/nodesAndEdges.json", function (data) {
        console.log(data);
        // create an array with nodes
        var nodes = new vis.DataSet(data.nodes);
        // create an array with edges
        var edges = new vis.DataSet(data.edges);
        var dataFromDataSets = {
            nodes: nodes,
            edges: edges
        };
        var network = new vis.Network(container, dataFromDataSets, options);
        network.on("selectNode", function (params) {
            $("#" + element + "NodeData").empty();
            $("#" + element + "NodeData").load('texts/' + $("body").attr("id").replace("Body", '') + '/' + element + '/' + params.nodes[0] + '.html');
        });
        network.on("deselectNode", function (params) {
            $("#" + element + "NodeData").empty().append(nodeDataDefault);
        });
    });
}


function addPersonaje() {

    $.getJSON("texts/" + $("body").attr("id").replace("Body", '') + "/personaje.json", function (data) {
        for (let i = 0; i < data.length; ++i) {
            $("#outerContainerPersonaje").addClass("darkerBackgroundColor").append(
                '<div id="containerPersonaj' + i + '" class="containerPersonaje">' +
                '<div id    ="personaj' + i + '" class="personaje normalBackgroundColor">' +
                // '<img src="images/' + $("body").attr("id").replace("Body", '') + '/personaje/' + data[i].id + '.png">' +
                '<h1>' + data[i].nume + '</h1>' +
                '<p>' + data[i].descriereScurta + '</p>' +
                '</div>' +
                '<div id="extinderePersonajContainer' + i +
                '" class="extinderePersonajeContainer darkBackgroundColor"><div id="extinderePersonaj' + i +
                '" class="extinderePersonaj normalBackgroundColor">' + data[i].descriereLunga + '</div></div>' +
                '</div>'
            );

            let slideMargin = "";
            if (i % 2 === 0) {
                $("#personaj" + i).css("float", "left").css("padding-left", (parseInt($("#personaj" + i).css("padding-left").replace('px', '')) + 35) + 'px')
                    .css("border-radius", "0 25px 25px 0");
                $("#extinderePersonajContainer" + i).css("float", "right").css("padding-right", "30vw")
                $("#extinderePersonajContainer" + i + ", #extinderePersonaj" + i).css("border-radius", "25px 0 0 25px");
                slideMargin = "right";
            }
            else {
                $("#personaj" + i).css("float", "right").css("border-radius", "25px 0 0 25px");
                $("#extinderePersonajContainer" + i).css("float", "left").css("padding-left", "30vw")  //.css("padding-left", (parseInt($("#extinderePersonajContainer" + i).css("padding-left").replace('px', '')) + 35) + 'px')
                $("#extinderePersonajContainer" + i + ", #extinderePersonaj" + i).css("border-radius", "0 25px 25px 0");
                slideMargin = "left";
            }

            $("#extinderePersonajContainer" + i).addClass("noTransition").css("margin-" + slideMargin, '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px');
            $("#extinderePersonajContainer" + i)[0].offsetHeight; // flushes CSS buffer
            $("#extinderePersonajContainer" + i).removeClass("noTransition");
            $("#extinderePersonajContainer" + i)[0].offsetHeight; // flushes CSS buffer

            $(window).on("resize.personaje", function () {
                $(".extinderePersonajeContainer").addClass("noTransition").css("margin-" + slideMargin, '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px');
                $(".extinderePersonajeContainer")[0].offsetHeight; // flushes CSS buffer
                $(".extinderePersonajeContainer").removeClass("noTransition");
                $(".extinderePersonajeContainer")[0].offsetHeight; // flushes CSS buffer
            });

            $("#personaj" + i).on("mouseenter", function () {
                $("#personaj" + i).css("transition-duration", state2TransDuration).css("transition-timing-function", "ease").removeClass("normalBackgroundColor").addClass("lighterBackgroundColor");
                $("#extinderePersonajContainer" + i).css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                    .css("margin-" + slideMargin, '0');
            });

            $("#personaj" + i).on("mouseleave", function () {
                $("#personaj" + i).css("transition-duration", state2TransDuration).css("transition-timing-function", "ease").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
                $("#extinderePersonajContainer" + i).css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                    .css("margin-" + slideMargin, '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px');
            });
        }
    });
}