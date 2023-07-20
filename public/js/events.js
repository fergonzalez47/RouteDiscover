document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    var trigger = document.querySelector('.sidenav-trigger');
    var sideNav = document.querySelector('.sidenav');
    var closeIcon = document.querySelector('.close-icon');

    trigger.addEventListener('click', function () {
        var isOpen = sideNav.classList.contains('sidenav-open');

        if (isOpen) {
            sideNav.classList.remove('sidenav-open');
        } else {
            sideNav.classList.add('sidenav-open');
        }
    });

    closeIcon.addEventListener('click', function () {
        sideNav.classList.remove('sidenav-open');
    });
});

if (document.querySelector(".new")) {
    const newButton = document.querySelector(".new");
    newButton.addEventListener("click", () => {
        window.location.href = '/newTrail';
    })
};