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
        $(window).off("resize.rezumat");
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
            preloadImage("./images/" + $("body").attr("id").replace("Body", '') + "/backgrounds/" + backgroundList[i] + ".jpg");
            element.css("background-image", "url(./images/" + $("body").attr("id").replace("Body", '') + "/backgrounds/" + backgroundList[i] + ".jpg)");
            backgroundList[i] = -1;
            return;
        }
    }
    element.css("background-color", "red");
    console.log("ERROR: not enough backgrounds");
}

const hiddenOpacity = 0.5;
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
    $("#cuprinsSlideContainer").css("transition-duration", "").css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');

    $.getJSON("texts/" + $("body").attr("id").replace("Body", '') + "/cuprins.json", function (data)
    {
        for (let i = 0; i < data.length; ++i)
        {
            $("#cuprins").append('<a class="textCuprins" id="textCuprins' + i + '" href="' + data[i].href + '">' + data[i].text + '</a>');
        }
        $("#cuprinsSlideContainer").css("transition-duration", "").css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');

        $(function ()
        {
            $("#cuprinsSlideContainer").css("transition-duration", "").css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');
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
            setTimeout(function ()
            {
                if (state === "hidden")
                {
                    $("#cuprinsSlideContainer").css("transition-duration", "").css("margin-left", '-' + $("#cuprins").outerWidth() + 'px');
                }
            }, 150);
        });
    });
}


function addRezumat()
{
    var rezumatDisableSomeEvents = false;

    $("#bottomPart").append(
        '<div id="buttonRezumat" class="normalBackgroundColor">Rezumat</div>' +
        '<div id="rezumat" class="transparentBackgroundColor" style="display: none;">' +
        '<div id="rezumatTextContainer" data-simplebar-auto-hide="false"><div id="rezumatText"></div></div>' +
        '<img id="exitRezumat" src="images/icons/exit.png" height="35">' +
        '</div>'
    );

    $(function ()
    {
        setTimeout(function ()
        {
            $("#rezumatTextContainer .simplebar-track").css("display", "none");
        }, 150);
    });

    const el = new SimpleBar($('#rezumatTextContainer')[0], {autoHide: false, scrollbarMinSize: 25});

    $(window).on("resize.rezumat", function ()
    {
        setTimeout(function ()
        {
            el.recalculate();
        }, 150);
    });

    $("#buttonRezumat").on('click', function ()
    {
        if (rezumatDisableSomeEvents === true)
            return;
        rezumatDisableSomeEvents = true;
        $("#rezumat").css("display", "");
        animateCss($("#rezumat"), "zoomIn", function ()
        {
            el.recalculate();
            $("#rezumatTextContainer .simplebar-track").css("display", "");
            el.recalculate();
        });
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
        $("#rezumatTextContainer .simplebar-track").css("display", "none");
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
    $("#" + element).addClass("graph darkerBackgroundColor");
    $("#" + element).append(
        '<div id="' + element + 'CanvasContainer" class="graphCanvasContainer normalBackgroundColor" data-aos="slide-right"></div>' +
        '<div id="' + element + 'NodeData" class="graphNodeData darkBackgroundColor" data-aos="slide-left">' +
        '<div id="' + element + 'NodeDataText" class="graphNodeDataText" data-simplebar data-simplebar-auto-hide="false"></div></div>'
    );

    let option = {};
    // create an array with nodes
    let nodes = new vis.DataSet();
    // create an array with edges
    let edges = new vis.DataSet();
    let currentlyReading;
    let nodeId = 0;

    let nodeDataDefault = "Apasa pe orice nod pentru a afla mai multe informatii.";
    $("#" + element + "NodeDataText").empty().append(nodeDataDefault);

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
        //console.log(data);

        // create an array with nodes
        var nodes = new vis.DataSet(data.nodes);
        var nodeData = [];

        $.each(data.nodes, function (n, outerData)
        {
            $.get('texts/' + $("body").attr("id").replace("Body", '') + '/' + element + '/' + outerData.id + '.html', function (data)
            {
                nodeData[outerData.id] = data;
            });
        });

        // create an array with edges
        var edges = new vis.DataSet(data.edges);
        var dataFromDataSets = {
            nodes: nodes,
            edges: edges
        };
        var network = new vis.Network(container, dataFromDataSets, options);
        network.on("selectNode", function (params)
        {
            $("#" + element + "NodeDataText .simplebar-wrapper .simplebar-mask .simplebar-offset .simplebar-content").empty().append(nodeData[params.nodes[0]]);
        });
        network.on("deselectNode", function (params)
        {
            $("#" + element + "NodeDataText .simplebar-wrapper .simplebar-mask .simplebar-offset .simplebar-content").empty().append(nodeDataDefault);
        });

        $(function ()
        {
            setTimeout(function ()
            {
                network.fit();
            }, 150);
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

var personajeInterval = [];
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
                '<p style="opacity: 0.6; font-style: italic; text-align: center; font-size:13px">Apasă pe mine pentru a afla mai multe și apasă din nou pentru a închide.</p>' +
                '</div>' +
                '<div id="extinderePersonajContainer' + i +
                '" class="extinderePersonajeContainer darkBackgroundColor"><div id="extinderePersonaj' + i +
                '" class="extinderePersonaj normalBackgroundColor"><div id="extinderePersonajSubcontainer' + i + '" class="extinderePersonajSubcontainer">' + data[i].descriereLunga + '</div></div></div>' +
                '</div>'
            );

            let slideMargin = "";
            if (i % 2 === 0)
            {
                $("#personaj" + i).css("float", "left").css("padding-left", (parseInt($("#personaj" + i).css("padding-left").replace('px', '')) + 35) + 'px')
                    .css("border-radius", "0 25px 25px 0");
                $("#extinderePersonajContainer" + i).css("float", "right").css("padding-right", "20vw");
                $("#extinderePersonajContainer" + i + ", #extinderePersonaj" + i).css("border-radius", "25px 0 0 25px");
                slideMargin = "right";
            }
            else
            {
                $("#personaj" + i).css("float", "right").css("border-radius", "25px 0 0 25px");
                $("#extinderePersonajContainer" + i).css("float", "left").css("padding-left", "20vw");  //.css("padding-left", (parseInt($("#extinderePersonajContainer" + i).css("padding-left").replace('px', '')) + 35) + 'px')
                $("#extinderePersonajContainer" + i + ", #extinderePersonaj" + i).css("border-radius", "0 25px 25px 0");
                slideMargin = "left";
            }

            if (slideMargin === "left")
                $("#extinderePersonajContainer" + i).css("transition-duration", "").css("transform", "translateX(" + '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");
            else if (slideMargin === "right")
                $("#extinderePersonajContainer" + i).css("transition-duration", "").css("transform", "translateX(" + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");

            $(window).on("resize.personaje", function ()
            {
                if (slideMargin === "left")
                {
                    $("#personaj" + i).css("transition-duration", "").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
                    $("#extinderePersonajContainer" + i).css("transition-duration", "").css("transform", "translateX(" + '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");
                    personajExtins = false;
                }
                else if (slideMargin === "right")
                {
                    $("#personaj" + i).css("transition-duration", "").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
                    $("#extinderePersonajContainer" + i).css("transition-duration", "").css("transform", "translateX(" + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");
                    personajExtins = false;
                }
                setTimeout(function ()
                {
                    if (slideMargin === "left")
                    {
                        $("#personaj" + i).css("transition-duration", "").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
                        $("#extinderePersonajContainer" + i).css("transition-duration", "").css("transform", "translateX(" + '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");
                        personajExtins = false;
                    }
                    else if (slideMargin === "right")
                    {
                        $("#personaj" + i).css("transition-duration", "").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
                        $("#extinderePersonajContainer" + i).css("transition-duration", "").css("transform", "translateX(" + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");
                        personajExtins = false;
                    }
                }, 125);
                setTimeout(function ()
                {
                    if (slideMargin === "left")
                    {
                        $("#personaj" + i).css("transition-duration", "").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
                        $("#extinderePersonajContainer" + i).css("transition-duration", "").css("transform", "translateX(" + '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");
                        personajExtins = false;
                    }
                    else if (slideMargin === "right")
                    {
                        $("#personaj" + i).css("transition-duration", "").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");
                        $("#extinderePersonajContainer" + i).css("transition-duration", "").css("transform", "translateX(" + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");
                        personajExtins = false;
                    }
                }, 250);
            });

            let personajExtins = false;
            $("#personaj" + i).on("click", function ()
            {
                if (personajExtins === false)
                {
                    $("#personaj" + i).css("transition-duration", state2TransDuration).css("transition-timing-function", "ease").removeClass("normalBackgroundColor").addClass("lighterBackgroundColor");

                    $("#extinderePersonajContainer" + i).css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                        .css("transform", "translateX(" + '0' + ")");
                    personajExtins = true;
                }
                else
                {
                    $("#personaj" + i).css("transition-duration", state2TransDuration).css("transition-timing-function", "ease").removeClass("lighterBackgroundColor").addClass("normalBackgroundColor");

                    if (slideMargin === "left")
                        $("#extinderePersonajContainer" + i).css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                            .css("transform", "translateX(" + '-' + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");
                    if (slideMargin === "right")
                        $("#extinderePersonajContainer" + i).css("transition-duration", stateTransDuration).css("transition-timing-function", "ease")
                            .css("transform", "translateX(" + $("#extinderePersonajContainer" + i).outerWidth() + 'px' + ")");
                    personajExtins = false;
                }
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


function preloadImage(image)
{
    if ($("#imagePreloader").length === 0)
        $("body").prepend("<div id='imagePreloader'></div>");
    $('<img />').attr('src', image).prependTo('#imagePreloader').css("position", "absolute").css("top", "0").css("left", "0");
}
