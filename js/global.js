function animateCss(element, animationName, callback) {
    element.addClass("animated" + ' ' + animationName);

    function handleAnimationEnd() {
        element.removeClass("animated" + ' ' + animationName);

        if (typeof callback === 'function') callback()
    }

    element.one('animationend', handleAnimationEnd);
}

function changePage(page) {
    $("body").css("overflow-x", "hidden");

    animateCss($("body"), "slideOutUp", function () {
        $("body").empty();

        // console.log("Going to "+ page);
        $.get(page + ".html", function (data) {

            $("body").append(data).css("overflow-x", "hidden");

            animateCss($("body"), "slideInRight", function () {
                $("body").css("overflow-x", "");
            });
        });
    });
}