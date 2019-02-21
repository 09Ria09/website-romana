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
    var rand;
    do {
        rand = Math.floor((Math.random() * numberOfBackgrounds) + 1);
    }
    while (backgroundList[rand] === true);

    element.css("background-image", "url(../images/" + $("body").attr("id").replace("Body", '') + "/backgrounds/" + rand + ".png)");
    backgroundList[rand] = true;
}