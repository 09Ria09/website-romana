function animateCss(element, animationName, callback)
{
    element.addClass("animated" + ' ' + animationName);

    function handleAnimationEnd()
    {
        element.removeClass("animated" + ' ' + animationName);

        if (typeof callback === 'function') callback()
    }

    element.one('animationend', handleAnimationEnd);
}


function changePage(page)
{
    $.getJSON("texts/pages.json", function (data)
    {
        for (let i = 0; i < data.length; ++i)
        {
            if (data[i].id === page)
            {
                document.title = data[i].name;
                break;
            }
        }
    });
    $("body").empty();
    $("body").prepend("<div id='preloaderContainer'><div id='preloader' class='line-scale'><div></div><div></div><div></div><div></div><div></div></div></div>");
    animateCss($("#preloaderContainer"), "fadeIn", function ()
    {
        $(window).off("resize.cuprinsSlider");
        $(window).off("resize.graph");
        $(window).off("resize.personaje");

        $("link[href='css/" + $("body").attr("id").replace("Body", '') + ".css']").remove();
        $("head").append('<link rel="stylesheet" href="css/' + page + '.css">');

        $("body").attr("id", page + "Body");
        $.get(page + ".html", function (data)
        {
            $("html").css("overflow-y", "hidden");
            $("body").append(data);
            window.scrollTo(0, 0);

            /*
            $(function(){
                $(".spacerTrianglesTL").each(function (n, element)
                {
                    let color = "normalBackgroundColor";
                    if ($(element)[0].hasAttribute("data-border-color"))
                        color = $(element).attr("data-border-color");
                    console.log(color);
                    $(element).css("border-top-color", $('.' + color).css("background-color"));
                });

                $(".spacerTrianglesTR").each(function (n, element)
                {
                    let color = "normalBackgroundColor";
                    if ($(element)[0].hasAttribute("data-border-color"))
                        color = $(element).attr("data-border-color");
                    console.log(color);
                    $(element).css("border-right-color", $('.' + color).css("background-color"));
                });

                $(".spacerTrianglesBR").each(function (n, element)
                {
                    let color = "normalBackgroundColor";
                    if ($(element)[0].hasAttribute("data-border-color"))
                        color = $(element).attr("data-border-color");
                    console.log(color);
                    $(element).css("border-bottom-color", $('.' + color).css("background-color"));
                });

                $(".spacerTrianglesBL").each(function (n, element)
                {
                    let color = "normalBackgroundColor";
                    if ($(element)[0].hasAttribute("data-border-color"))
                        color = $(element).attr("data-border-color");
                    console.log(color);
                    $(element).css("border-left-color", $('.' + color).css("background-color"));
                });
            });
            */

            $("#preloaderContainer").css("animation-delay", "0.5s");
            animateCss($("#preloaderContainer"), "fadeOut", function ()
            {
                AOS.refresh();
                $("#preloaderContainer").remove();
                $("html").css("overflow-y", "");
            });
        });
    });
}

function addBackground(element, backgroundList)
{
    for (let i = 0; i < backgroundList.length; ++i)
    {
        if (backgroundList[i] !== -1)
        {
            element.css("background-image", "url(../images/" + $("body").attr("id").replace("Body", '') + "/backgrounds/" + backgroundList[i] + ".jpg)");
            backgroundList[i] = -1;
            return;
        }
    }
    element.css("background-color", "red");
    console.log("ERROR: not enough backgrounds");
}

const hiddenOpacity = 0.1;
const hoverOpacity = 0.8;
const displayedOpacity = 1;

const startTransDuration = "2s";
const stateTransDuration = "0.5s";
const state2TransDuration = "0.25s";
const hoverTransDuration = "0.3s";

function addCuprinsSlider(backButton = false)
{
    let state = "hidden";
    let hovered = false;

    if (backButton === false)
        $("body").prepend('<div id="cuprinsSlideContainer"><div id="cuprins"></div><div id="slider">Cuprins</div></div>');
    else
    {
        $("body").prepend('<div id="cuprinsSlideContainer"><div id="cuprins"></div><div id="slider" style="display: flex">' +
            '<div style="flex-basis: 95vh">Cuprins</div>' +
            '<div id="back">Inapoi</div>' +
            '</div></div>');
    }

    $.getJSON("texts/" + $("body").attr("id").replace("Body", '') + "/cuprins.json", function (data)
    {
        for (let i = 0; i < data.length; ++i)
        {
            $("#cuprins").append('<a class="textCuprins" id="textCuprins' + i + '" href="' + data[i].href + '">' + data[i].text + '</a>');
        }

        $(function ()
        {
            $("#cuprinsSlideContainer").css("transition-duration", "").css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');
            // $("#cuprinsSlideContainer")[0].offsetHeight; // flushes CSS buffer
            // $("#cuprinsSlideContainer").removeClass("noTransition");
            // $("#cuprinsSlideContainer")[0].offsetHeight; // flushes CSS buffer
        });

    });

    animateCss($("#cuprinsSlideContainer"), "bounceInLeft", function ()
    {
        setTimeout(function ()
        {
            if (state === "hidden" && hovered === false)
                $("#cuprinsSlideContainer").css("transition-duration", startTransDuration).css("transition-timing-function", "ease").css("opacity", hiddenOpacity);
        }, 1000);

        $("#cuprinsSlideContainer").on("mouseenter", function ()
        {
            hovered = true;
            if (state === "hidden")
            {
                $("#cuprinsSlideContainer").css("transition-duration", hoverTransDuration).css("transition-timing-function", "ease").css("opacity", hoverOpacity);
            }
        });

        $("#cuprinsSlideContainer").on("mouseleave", function ()
        {
            hovered = false;
            if (state === "hidden")
            {
                $("#cuprinsSlideContainer").css("transition-duration", hoverTransDuration).css("transition-timing-function", "ease").css("opacity", hiddenOpacity);
            }
        });

        $("#cuprinsSlideContainer").on('click', 'a[href^="#"]', function (event)
        {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 500);
        });

        $("#cuprinsSlideContainer").on("click", function (e)
        {
            if ($(e.target).hasClass('textCuprins') === true)
                return;
            else if ($(e.target).attr('id') === 'back')
            {
                changePage("fantastic", 'rl');
                return;
            }

            if (state === "displayed")
            {

                $("#cuprinsSlideContainer").css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                    .css("opacity", hiddenOpacity).css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');

                state = "hidden";
            }
            else
            {

                $("#cuprinsSlideContainer").css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                    .css("opacity", displayedOpacity).css('margin-left', '0');

                state = "displayed";
            }
        });

        $(window).on("resize.cuprinsSlider", function ()
        {
            if (state === "hidden")
            {
                $("#cuprinsSlideContainer").css("transition-duration", "").css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');
            }
        });
    });
}


function addRezumat()
{
    var rezumatDisableSomeEvents = false;

    $("#bottomPart").append(
        '<div id="buttonRezumat" class="normalBackgroundColor">Rezumat</div>' +
        '<div id="rezumat" class="transparentBackgroundColor" style="display: none;">' +
        '<img id="exitRezumat" src="images/icons/exit.png" height="35">' +
        '</div>'
    );

    $("#buttonRezumat").on('click', function ()
    {
        if (rezumatDisableSomeEvents === true)
            return;
        rezumatDisableSomeEvents = true;
        $("#rezumat").css("display", "");
        animateCss($("#rezumat"), "zoomIn");
        animateCss($("#buttonRezumat"), "zoomOut", function ()
        {
            $("#buttonRezumat").css("display", "none");
            rezumatDisableSomeEvents = false;
        });
    });
    $("#buttonRezumat").on('mouseenter', function ()
    {
        if (rezumatDisableSomeEvents === true)
            return;
        $("#buttonRezumat").css("transform", "scale(1.10)");
        $("#buttonRezumat").removeClass("normalBackgroundColor").addClass("lighterBackgroundColor");
    });
    $("#buttonRezumat").on('mouseleave', function ()
    {
        $("#buttonRezumat").css("transform", "scale(1)");
        $("#buttonRezumat").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
    });

    $("#exitRezumat").on('click', function ()
    {
        if (rezumatDisableSomeEvents === true)
            return;
        rezumatDisableSomeEvents = true;
        $("#buttonRezumat").css("display", "");
        animateCss($("#buttonRezumat"), "zoomIn");
        animateCss($("#rezumat"), "zoomOut", function ()
        {
            $("#rezumat").css("display", "None");
            rezumatDisableSomeEvents = false;
        });
    })
}


function addGraph(element)
{

    $("#" + element).addClass("graph normalBackgroundColor");
    $("#" + element).append(
        '<div id="' + element + 'CanvasContainer" class="graphCanvasContainer normalBackgroundColor" data-aos="slide-right"></div>' +
        '<div id="' + element + 'NodeData" class="graphNodeData darkBackgroundColor" data-aos="slide-left">' +
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
                face: "ralewayregular",
                size: 16
            }
        },
        edges: {
            smooth: true,
            arrows: {to: true}
        }
    };

    $.getJSON("texts/" + $("body").attr("id").replace("Body", '') + "/" + element + "/nodesAndEdges.json", function (data)
    {
        console.log(data);
        // create an array with nodes
        var nodes = new vis.DataSet(data.nodes);
        // create an array with edges
        var edges = new vis.DataSet(data.edges);
        var dataFromDataSets = {
            nodes: nodes,
            edges: edges
        };
        let network = new vis.Network(container, dataFromDataSets, options);
        network.on("selectNode", function (params)
        {
            $("#" + element + "NodeData").empty();
            $("#" + element + "NodeData").load('texts/' + $("body").attr("id").replace("Body", '') + '/' + element + '/' + params.nodes[0] + '.html');
        });
        network.on("deselectNode", function (params)
        {
            $("#" + element + "NodeData").empty().append(nodeDataDefault);
        });
        $(window).on("resize.graph", function ()
        {
            setTimeout(function ()
            {
                network.fit();
            }, 150);
        });
    });
}


function addPersonaje()
{

    $.getJSON("texts/" + $("body").attr("id").replace("Body", '') + "/personaje.json", function (data)
    {
        for (let i = 0; i < data.length; ++i)
        {
            $("#outerContainerPersonaje").addClass("darkerBackgroundColor").append(
                '<div id="containerPersonaj' + i + '" class="containerPersonaje">' +
                '<div id    ="personaj' + i + '" class="personaje normalBackgroundColor">' +
                // '<img src="images/' + $("body").attr("id").replace("Body", '') + '/personaje/' + data[i].id + '.png">' +
                '<h2>' + data[i].nume + '</h2>' +
                '<p>' + data[i].descriereScurta + '</p>' +
                '<p style="opacity: 0.6; font-style: italic; text-align: center;">Mută mouse-ul deasupra mea pentru a afla mai multe!</p>' +
                '</div>' +
                '<div id="extinderePersonajContainer' + i +
                '" class="extinderePersonajeContainer darkBackgroundColor"><div id="extinderePersonaj' + i +
                '" class="extinderePersonaj normalBackgroundColor">' + data[i].descriereLunga + '</div></div>' +
                '</div>'
            );

            let slideMargin = "";
            if (i % 2 === 0)
            {
                $("#personaj" + i).css("float", "left").css("padding-left", (parseInt($("#personaj" + i).css("padding-left").replace('px', '')) + 35) + 'px')
                    .css("border-radius", "0 25px 25px 0");
                $("#extinderePersonajContainer" + i).css("float", "right").css("padding-right", "30vw")
                $("#extinderePersonajContainer" + i + ", #extinderePersonaj" + i).css("border-radius", "25px 0 0 25px");
                slideMargin = "right";
            }
            else
            {
                $("#personaj" + i).css("float", "right").css("border-radius", "25px 0 0 25px");
                $("#extinderePersonajContainer" + i).css("float", "left").css("padding-left", "30vw")  //.css("padding-left", (parseInt($("#extinderePersonajContainer" + i).css("padding-left").replace('px', '')) + 35) + 'px')
                $("#extinderePersonajContainer" + i + ", #extinderePersonaj" + i).css("border-radius", "0 25px 25px 0");
                slideMargin = "left";
            }

            $("#extinderePersonajContainer" + i).css("transition-duration", "").css("margin-" + slideMargin, '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px');
            // $("#extinderePersonajContainer" + i)[0].offsetHeight; // flushes CSS buffer
            // $("#extinderePersonajContainer" + i).removeClass("noTransition");
            // $("#extinderePersonajContainer" + i)[0].offsetHeight; // flushes CSS buffer

            $(window).on("resize.personaje", function ()
            {
                $(".extinderePersonajeContainer").css("transition-duration", "").css("margin-" + slideMargin, '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px');
                // $(".extinderePersonajeContainer")[0].offsetHeight; // flushes CSS buffer
                // $(".extinderePersonajeContainer").removeClass("noTransition");
                // $(".extinderePersonajeContainer")[0].offsetHeight; // flushes CSS buffer
            });

            $("#personaj" + i).on("mouseenter", function ()
            {
                $("#personaj" + i).css("transition-duration", state2TransDuration).css("transition-timing-function", "ease").removeClass("normalBackgroundColor").addClass("lighterBackgroundColor");
                $("#extinderePersonajContainer" + i).css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                    .css("margin-" + slideMargin, '0');
            });

            $("#personaj" + i).on("mouseleave", function ()
            {
                $("#personaj" + i).css("transition-duration", state2TransDuration).css("transition-timing-function", "ease").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
                $("#extinderePersonajContainer" + i).css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                    .css("margin-" + slideMargin, '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px');
            });
        }
    });
}


function shuffleArray(array)
{
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex)
    {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}