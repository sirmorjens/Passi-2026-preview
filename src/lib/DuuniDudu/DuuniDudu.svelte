<script lang="ts">
    import { onMount } from 'svelte'
    import { Spring, Tween } from 'svelte/motion'
    import { fade } from 'svelte/transition'
    import { duduState } from './DuduState.svelte'
    import { cubicInOut } from 'svelte/easing' 
    import { Flight, TrophyState } from '../State/TrophyState.svelte'

    import DuuniDuduHead from "./DuuniDuduHead.svelte"
    
    let dd_parent, initialBoundRect = 0, child, head, talking = false, f = null, duduFlightInstance = false;
    let happyTilt = new Tween(0.0, {duration: 320, easing: cubicInOut, });

    let { 
        mainAppCallHideHeader = (): void => {}, 
        mainAppCallShowHeader = (): void => {} } = $props();

    /* a function passed by dududialogue to run when dudu is startled */
    let startleEventFn = () => {}; // empty implementation when dududialogue not present

    let tempClickCounter = $state(0);
    /*
        this thing is a mess (yet it works, I guess)
        Maybe refactor this next year

    */

    // export functions for dududialogue

    // export position for dududialogue for it to position about right
    export const getPosition = (): number => {
       return Math.round( (window.innerHeight - dd_parent.getBoundingClientRect().top));  
    }
    
    export const talk = (): void => {
        head.talk();
    } 
    export const shutup = (): void => {
        head.shutUp();
    } 

    export const submitToStartleEvent = (fn: () => void): void => {
        startleEventFn = fn;
    }

    export const clearStartleEvent = (): void => {

        startleEventFn = () => {}; // clear dudu call when dududialogue not present
    }





    let direction = $state([0,0]);
    let springB = new Spring([0,0], {stiffness: 0.05, damping:0.333,})
    let springT = new Spring([40,76], {stiffness: 0.16, damping:0.798,})
    let springH = new Spring([5,-30], {stiffness: 0.16, damping:0.838,})
    let springTT = new Spring([40,105], {stiffness: 0.18, damping:0.538,})
    let springLH = new Spring([10,70], {stiffness: 0.04, damping:0.826,})
    let springRH = new Spring([70,70], {stiffness: 0.03, damping:0.52, })

    const springs = [
        [springB, [0,0], [1,1], 1],
        [springH, [5,-30], [1,1], 0],
        [springT, [40,76], [1,1],0 ],
        [springTT, [40,105], [1,1],0 ],
        [springLH, [10,70], [1,1],0],
        [springRH, [70,70], [1,1],0]];
    
        /*

            yeah I know it's a f****n mess this 

            B   body
            H   head 
            T   torso
            TT  tail
            LH  lh
            RH  rh


        */

    // if dudu is above the screen
    let overBounds = $derived({flight: springB.current[1] < initialBoundRect*-.20, ufo: (springB.current[1] + initialBoundRect) < 0});

    const windowClickListener = () => {

        tempClickCounter += 1
    }


    const FlightMode = () => {
        return () => {
            // dudu in flight, hide the header
            mainAppCallHideHeader();
            tempClickCounter = 0;
            window.addEventListener("click", windowClickListener)

            f = Flight();

            return () => { 
                // dudu is back, show header again
                duduFlightInstance = false;
                mainAppCallShowHeader();

                window.removeEventListener("click", windowClickListener)

            }
        }

    }

    const HighScoreSetter = ():void =>  
    {
        if(TrophyState.myDuduScore == null) TrophyState.myDuduScore = tempClickCounter

        if(tempClickCounter < TrophyState.myDuduScore) TrophyState.myDuduScore = tempClickCounter


    }

    // dudu above screen, report it
    const reportUfoFlight = () => {

        
        return () => { /* returned function runs when mounted */

            HighScoreSetter();

            return () => { /* runs when unmounted / done */

                if(duduFlightInstance) return
                duduFlightInstance = true; // setting this so multiple calls won't happen
                if(f != null) Flight({a: f, hs: tempClickCounter})

            }
        }
    }
    export const setSad = () => {
        head.setSad();
        springH.target = [springH.current[0] + 2,springH.current[1] +2];

    }
    export const pokeDudu = () => {
        const direction = [0,-5]

        springs.forEach( ([spring, defaultPos, multiplier, childrenMp]) => {
            spring.set([direction[0]*(Math.random()*0.25+0.75)+defaultPos[0]*multiplier[0]+(spring.current[0]*childrenMp), direction[1]*(Math.random()*0.5+0.5)+defaultPos[1]*multiplier[1]+(spring.current[1]*childrenMp)], {preserveMomentum: 10}).then(() => {

                spring.set(defaultPos, {preserveMomentum: 5400})
                }).catch((e) => {

                })
        });  
        happyTilt.set(2.0).then( ()=> happyTilt.set(-2.0).then(()=>happyTilt.target = 0));
    }

    const onclick = (e) => 
    {   
        const boundingbox = dd_parent.getBoundingClientRect()
        // call dududialogue if dudu is startled
        if(startleEventFn) startleEventFn();

        const vector = [
            ((e.clientX - Math.abs(boundingbox.left)) - boundingbox.width * 0.5 ) / boundingbox.width * 100,
            ((e.clientY - boundingbox.top) - boundingbox.height * 0.5 )/boundingbox.height * 100, ]

        head.activate([vector[0]*-0.2, vector[1]*-0.2]);
        
        direction = [Math.min( Math.max( vector[0]*-1.6, -40), 40 ), Math.min( Math.max( vector[1]*-1.6, -40), 40 )];



        /* implement click counter for flight */

        springs.forEach( ([spring, defaultPos, multiplier, childrenMp]) => {
            spring.set([direction[0]*(Math.random()*0.25+0.75)+defaultPos[0]*multiplier[0]+(spring.current[0]*childrenMp), direction[1]*(Math.random()*0.5+0.5)+defaultPos[1]*multiplier[1]+(spring.current[1]*childrenMp)], {preserveMomentum: 10}).then(() => {

                spring.set(defaultPos, {preserveMomentum: 5400})
                }).catch((e) => {

                })
        });
    }

    const calcDuduFlightBoundRect = () => {
        // set initial boundrect pixel so we have a static value to compare to when dudu is flinged around
        initialBoundRect = dd_parent.getBoundingClientRect().top;
        // quick hack for landscape, effectively disable flight if in landscape
        initialBoundRect = initialBoundRect < 340 ? 2000 : initialBoundRect;        
    }

    onMount(() => {
        calcDuduFlightBoundRect();



        return () => {}
    });
</script>

<svelte:window onorientationchange={calcDuduFlightBoundRect} />


<!-- dudu flight effect -->
{#if overBounds.flight}
    <div class="flight" {@attach FlightMode()}transition:fade={{duration: 1500}}>
        <div class="spacebg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" preserveAspectRatio="xMinYMin slice">
                <rect width="300" height="300" rx="0" fill="#08071a"/>
                <rect width="1" height="1" x="231" y="40" fill="#ffffff"><animate attributename="y" values="0;300" dur="8.2s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="198" y="40" fill="#ffffff"><animate attributename="y" values="0;300" dur="11.7s" repeatCount="indefinite" begin="-11" /></rect><rect width="1" height="1" x="260" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-2" dur="29.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="134" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-21" dur="29.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="95" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-3" dur="21.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="66" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-34" dur="24.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="23" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-2" dur="22.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="74" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-11" dur="25.3s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="80" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-1" dur="27.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="130" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-3" dur="24.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="175" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-3" dur="19s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="45" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-12" dur="17s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="263" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-3" dur="15.3s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="196" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-6" dur="21.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="210" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-3" dur="12.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="97" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-5" dur="18.9s" repeatCount="indefinite" /></rect><rect width="1" height="1" x="143" y="40" fill="#ffffff"><animate attributename="y" values="0;300" begin="-3" dur="23.9s" repeatCount="indefinite" /></rect>
            </svg>
        </div>
        <div class="counter">
            <div class="counterGroup">
                <div class="clickCounter"><h4>{tempClickCounter}</h4></div>
                <div class="topScore"><h6>Oma ennätys <span>{TrophyState.myDuduScore == null ? "∞" : TrophyState.myDuduScore}</span></h6></div>
            </div>
        </div>
    </div>
{/if}

<div class="fswrapper">
  <div class="container">
    <div class="outer" bind:this={dd_parent} {onclick} style:top={`${springB.current[1]}px`} style:left={`${springB.current[0]}px`} style:transform={`rotate(${Math.sin( springB.current[0]*0.05 )*16.4}deg)`}>
      <div class="inner" style:top={`${springTT.current[1]}px`} style:left={`${springTT.current[0]}px`}>
          <svg style="overflow:visible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 42" height=200><defs><style>.cls-1 {fill: #f2eded;}.cls-2 {fill: #3c00be;}.cls-3 {fill: #7c1a1a;}.cls-4 {stroke: #3c00be;}.cls-4, .cls-5 {fill: none;stroke-miterlimit: 10;stroke-width: 2px;stroke-linecap: round;}.cls-5 {stroke: #3c00be;}</style></defs><radialGradient id="dudu1"><stop offset="0.3" stop-color={duduState.color.colors[duduState.color.selected].fs} /><stop offset="1" stop-color={duduState.color.colors[duduState.color.selected].ls} /></radialGradient><ellipse rx="1.96" fill="url(#dudu1)" ry="2.08"/></svg>
      </div>
      <div class="inner" style:top={`${springT.current[1]}px`} style:left={`${springT.current[0]}px`}>
        <svg style="overflow:visible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 42" height=200><defs><style>.cls-1 {fill: #f2eded;}.cls-2 {fill: #3c00be;}.cls-3 {fill: #7c1a1a;}.cls-4 {stroke: #3c00be;}.cls-4, .cls-5 {fill: none;stroke-miterlimit: 10;stroke-width: 2px;stroke-linecap: round;}.cls-5 {stroke: #3c00be;}</style></defs><radialGradient id="dudu1"><stop offset="0.3" stop-color={duduState.color.colors[duduState.color.selected].fs} /><stop offset="1" stop-color={duduState.color.colors[duduState.color.selected].ls} /></radialGradient><path d="M4.96905 -3.26352C3.59265 -5.36419 0.83722 -5.22341 -0.515523 -5.16754C-1.86819 -5.11166 -3.86195 -5.13404 -4.86959 -2.83719C-5.19495 0.208805 -3.74719 3.0685 -0.0502599 5.56733C3.1113 3.80112 5.31799 0.605906 4.96905 -3.26352Z" fill="url(#dudu1)"/></svg>
      </div>
      <div class="inner" style:top={`${springLH.current[1]}px`} style:left={`${springLH.current[0]}px`}>
        <svg style="overflow:visible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 42" height=200><defs><style>.cls-1 {fill: #f2eded;}.cls-2 {fill: #3c00be;}.cls-3 {fill: #7c1a1a;}.cls-4 {stroke: #3c00be;}.cls-4, .cls-5 {fill: none;stroke-miterlimit: 10;stroke-width: 2px;stroke-linecap: round;}.cls-5 {stroke: #3c00be;}</style></defs><radialGradient id="dudu1"><stop offset="0.3" stop-color={duduState.color.colors[duduState.color.selected].fs} /><stop offset="1" stop-color={duduState.color.colors[duduState.color.selected].ls} /></radialGradient><ellipse rx="1.96" fill="url(#dudu1)" ry="2.08"/></svg>
      </div>
      <div class="inner" style:top={`${springRH.current[1]}px`} style:left={`${springRH.current[0]}px`}>
          <svg style="overflow:visible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 42" height=200><defs><style>.cls-1 {fill: #f2eded;}.cls-2 {fill: #3c00be;}.cls-3 {fill: #7c1a1a;}.cls-4{stroke: #3c00be;}.cls-4, .cls-5 {fill: none;stroke-miterlimit: 10;stroke-width: 2px;stroke-linecap: round;}.cls-5 {stroke: #3c00be;}</style></defs><radialGradient id="dudu1"><stop offset="0.3" stop-color={duduState.color.colors[duduState.color.selected].fs} /><stop offset="1" stop-color={duduState.color.colors[duduState.color.selected].ls} /></radialGradient><ellipse rx="1.96" fill="url(#dudu1)" ry="2.08"/></svg>
      </div>
      <div class="inner" style:top={`${springH.current[1]}px`} style:left={`${springH.current[0]}px`} style:transform={`rotate(${springH.current[0]*0.4+happyTilt.current}deg)`}>
          <DuuniDuduHead bind:this={head}/>
      </div>
    </div>
  </div>
</div>

<!-- dudu space effect -->

{#if overBounds.ufo}
    <div class="space" {@attach reportUfoFlight()} transition:fade={{duration: 900}}>
        <svg width="481" height="481" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="40.5" cy="-10" rx="50" ry="40.5" filter="url(#blur)" fill="url(#paint0_1534331132)"/>
            <defs>
                <radialGradient id="paint0_1534331132" r="0.5" >
                    <stop offset="0" stop-color="#FF6C30" stop-opacity="1" />
                    <stop offset="0.2" stop-color="#EF5C00" stop-opacity="1" />
                    <stop offset="1" stop-color="#aaaaff" stop-opacity="0"/>
                </radialGradient>
                <filter id="blur">
                    <feGaussianBlur stdDeviation="10" />
                </filter>
            </defs>
        </svg>
    </div>

{/if}

<!--


<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 124 124" fill="none">
      <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
      <stop offset="0%" stop-color="blue">
         <animate attributeName="stop-color" dur="9s" values="#f00;#0f0;#00f;#f00" repeatCount="indefinite" />
        <animate attributeName="offset" dur="11s" values="0.0;0.4;0.0" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stop-color="red">
                   <animate attributeName="stop-color" dur="7s" values="#3f3;#ff0;#ffe;#ff2;#3f3" repeatCount="indefinite" />
          <animate attributeName="offset" dur="9s" values="0.9;1;0.9" repeatCount="indefinite" />
        </stop>
    </linearGradient>

-->

<style>
    .flight
    {
        position:absolute;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        pointer-events: auto;
        background: #00000080;
    }

    .flight .counter {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        user-select: none;
        pointer-events: none;
    }
    .counterGroup {
        height:11rem;
        width: 11rem;
        display: flex;
        flex-direction: column;
        justify-content: center;        
        
        margin:0;
        padding: 0;
        box-sizing: border-box;
        border-radius: 50%;
        border: 1px solid #aaaaaa50;

    }
    .counterGroup .topScore {
        margin: 0;  
        padding: 0;
    }
    .counterGroup .topScore h6  {
        font-size: 0.9rem;
        color: #aaaaaa;
        font-weight: 600;
        margin: 0;
        padding: 0;
        margin-bottom: 0.2rem;
    }
    .counterGroup .topScore h6 span {
        font-family: 'Roboto Mono Variable', monospace;
        font-weight: 800;
        color: white;
    }
    .counterGroup .clickCounter h4 {
        font-family: 'Roboto Mono Variable', monospace;
        font-size: 2.3rem;
        font-weight: 300;
        line-height: 2.3rem;
        margin: 0;
        padding: 0;
        margin-bottom: 0.4rem;
        color: var(--dnxpYellow);
    }
    .space {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .space svg {
        width: 100%;        
    }

    .spacebg {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .spacebg svg {
        height: 100%;
        opacity: 0.75;
    }
    @media screen and (min-width: 600px)
    {
    .spacebg svg {
        width: 100%;
    }

    }

    .fswrapper {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100svh;
        width: 100svw;
        overflow: hidden;
        margin: 0;
        padding: 0;
        pointer-events: none;
    }
    .container {
        pointer-events: auto;
        position: absolute;
        bottom: 3%;
        left: 3%;
        bottom: min(60px, 3%);
        left: min(60px, 3%);
        /*
        top: 15vh;
        left:40%;
        */
    }
    .outer {
        
        width: 70px;
        height: 100px;
        overflow: visible;
        position: relative;
        transform-origin: center;
        pointer-events: auto;
    }
    .inner {
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        width: 20px;
        height: 20px;
        overflow: visible;
        pointer-events: none;

    }
    /*
    .inner > svg > ellipse   {
      filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .1));
    }
    */

</style>