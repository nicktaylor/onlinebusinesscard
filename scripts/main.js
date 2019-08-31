import {TweenMax, TimelineLite} from "gsap/TweenMax";

const calcHeight = (cardHeight) => {
    let middleY = (window.innerHeight / 2) - ((cardHeight / 3) * 2);
    return (window.innerWidth < 768) ? window.innerHeight - ((cardHeight / 3) * 2) : middleY;
}

window.addEventListener('load', () => {
    const startPosY = -90;
    const card = document.getElementById("card");
    const top = card.querySelector('.top');
    let middleY = calcHeight(top.clientHeight);

    let span = false;
    let spinning = false;
    let overCard = true;

    var spinToBack = new TimelineLite({paused: true});
    spinToBack.add(TweenMax.to(card, 1.0, {
        rotationY: '-=180_cw',
        x: '+=50px',
        z: '+=' + (middleY / 1.5) + 'px',
        top: middleY,
        transformOrigin: '50%, 80%'
    }));
    spinToBack.add(TweenMax.to(card, 0.5, {rotationX: '-=35_ccw', top: middleY - 100}));

    var t1 = new TimelineMax();
    t1.add(TweenMax.to(card, 1.5, {rotationX: '-=70_cw', z: '+=180px', top: middleY}));
    t1.addCallback(() => {
        top.addEventListener('mouseover', (e) => {
            e.stopPropagation();
            if (!overCard) {
                overCard = true;
                TweenMax.to(card, 0.5, {
                    rotationZ: '0deg',
                    rotationX: (startPosY + 15) + 'deg',
                    transformOrigin: '50%, 20%',
                    top: middleY
                })
            }
        });
        top.addEventListener('mouseout', (e) => {
            overCard = false;
        });

        const wHc = window.innerHeight / 2;
        const wWc = window.innerWidth / 2;
        const maxTurnX = 30;
        const maxTurnY = 30;
        let lastPosX = 0;
        let lastPosY = 0;
        const moveThreshold = 20;

        const handleMove = (e) => {
            if (!span && !overCard && !spinning) {
                const clickX = (e.clientX || e.pageX);
                const clickY = (e.clientY || e.pageY);
                const xDif = lastPosX - clickX;
                const yDif = lastPosY - clickY;

                if (xDif > moveThreshold || xDif < -moveThreshold) {
                    let distanceX = -parseInt(((clickX - wWc) / wWc) * maxTurnX);
                    distanceX = clickY < wHc ? -distanceX : distanceX;
                    TweenMax.to(card, 0.1, {rotationZ: distanceX + 'deg'});
                    lastPosX = clickX;
                }

                if (yDif > moveThreshold || yDif < moveThreshold) {
                    const distanceY = -parseInt(((clickY - wHc) / wHc) * maxTurnY) + startPosY;
                    TweenMax.to(card, 0.1, {rotationX: distanceY + 'deg'});
                    lastPosY = clickY;
                }
            }
        };
        document.body.addEventListener('touchmove', handleMove);
        document.body.addEventListener('mousemove', handleMove);
    });

    card.addEventListener("click", () => {
        if (spinning) {
            return;
        }
        if (span) {
            spinToBack.reverse();
        } else {
            spinToBack.play();
        }
        span = !span;
        spinning = true;
        // HACK: Find out how to call event on completion, or rethink this
        setTimeout(() => spinning = false, 1700);
    });
});


