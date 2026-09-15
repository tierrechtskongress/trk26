document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".scrolly").forEach(function (scrolly) {
    var steps = scrolly.querySelectorAll(".scrolly-step");
    var layers = scrolly.querySelectorAll(".scrolly-bg-layer");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var index = entry.target.getAttribute("data-scrolly-step-index");
            layers.forEach(function (layer) {
              layer.classList.toggle(
                "is-active",
                layer.getAttribute("data-scrolly-bg-index") === index
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    steps.forEach(function (step) {
      observer.observe(step);
    });
  });
});