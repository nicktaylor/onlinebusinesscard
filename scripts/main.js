import { TweenMax, TimelineLite, Power2, Elastic, CSSPlugin } from "gsap/TweenMax";

window.addEventListener('load', () => {
    var t1 = new TimelineLite();
    t1.add(TweenMax.to('.cube', 2, { rotationX: '-=90_cw', top: 350 }));
    console.log("LOADED")
});
