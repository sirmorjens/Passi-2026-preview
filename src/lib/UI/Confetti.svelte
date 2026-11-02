<script lang="ts">
	/*
		credit for confetti code goes to Maxim Bespalov
		https://codepen.io/Maxim-Bespalov
	*/

    let { markItemSeen } = $props();
    /*
        markItemSeen on callback joka kutsutaan kun animaatio on näytetty
        se merkkaa sen näytetyksi niin ei tule enää uudestaan
    */

    // for some reason calling the prop function
    // twice makes for a weird time
    let itemSeenCalled = false;

    // create timeout and cancel it when unmounted
    let timeout = setTimeout(() => {
        if(!itemSeenCalled) markItemSeen()
        itemSeenCalled = true;
    }, 2500);

    function createConfetti(el: HTMLElement) {

    const loc = el.getBoundingClientRect()
    const offsetPx = 20;
    const origin = [loc.left + offsetPx, loc.top + offsetPx];
    
    // const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    const oldColors = ['#FF5631', '#fDfb8a']; // old colors from 2026
    const colors = ['#ccd66e', '#035474'];
    const confettiCount = 26;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            //confetti.style.left = window.innerWidth / 2 + 'px';
            confetti.style.left = origin[0] + 'px';
            //confetti.style.top = window.innerHeight / 2 + 'px';
            confetti.style.top = origin[1] + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = "900"
            el.appendChild(confetti);
            
            const angle = (Math.PI * 2 * i) / confettiCount;
            const velocity = 1.2 + Math.random() * 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 3;
            
            //let x = window.innerWidth / 2;
            //let y = window.innerHeight / 2;
            let x = origin[0];
            let y = origin[1];
            let velX = vx;
            let velY = vy;
            
            const animate = () => {
                x += velX;
                y += velY;
                velY += 0.08; // gravity
                confetti.style.left = x + 'px';
                confetti.style.top = y + 'px';
                //confetti.style.opacity = Math.max(0, 1 - (y - window.innerHeight / 2) / 300);
                
                if (y < window.innerHeight + 100) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();

                }
            };
            
            animate();

        }

    return () => {
        if(timeout) clearTimeout(timeout)

        if(!itemSeenCalled) markItemSeen()
        itemSeenCalled = true;
    }
    
}


</script>

    <div class="confettiHome" {@attach createConfetti}></div>

<style>

:global(.confetti) {
    position: absolute;
    width: 5px;
    height: 5px;
    margin-left: -10px;
    border-radius: 5px;
    pointer-events: none;
}
/*
    Jos liikeherkkyyttä ni ei konfettia
*/

@media (prefers-reduced-motion: reduce)
{
    .confettiHome {
        display: none;
    }
}
</style>