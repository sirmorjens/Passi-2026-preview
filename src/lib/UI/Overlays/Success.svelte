<script lang="ts">

    let {
        close = () => {throw "No thing for the success thingy"}
    } = $props();

    let animationParent: HTMLDivElement;

    function animationListener (e: Event) 
    {
        // multiple animationend events coming from children,
        // by assigning this arbitrary field into our main 
        // div, we can 
        if(e.target != animationParent ) // if isn't present in target, not our guy
        {   
            return;
        }

        close();
    }

    function animationEndListener (el: HTMLElement)
    {
        el.addEventListener("animationend", animationListener);
        return () => el.removeEventListener("animationend", animationListener)
    }

</script>

<div class="checkmarkcontainer show" bind:this={animationParent} {@attach animationEndListener}>
    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
</div>

<style>
.checkmarkcontainer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0%;
    left: 0%;
    pointer-events: none;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #00000020;
    opacity: 0%;
}

.show
{
    animation: show 1.0s;
}
@keyframes show
{
    0% {
        opacity: 0%;
    }
    25%,
    75% {
        opacity: 100%;
    }
    100% {
        opacity: 0%;
    }
}
@keyframes stroke {
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes scale {

    0%,
    100% {
        transform: none;
    }

    50% {
        transform: scale3d(1.4, 1.4, 1);
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 24px 60px #000;
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1.0;
    }

    100% {
        opacity: 0.0;
    }
}
/* animation icon credit goes to Arthur D'huy 
editing by me
https: //codepen.io/led8
*/
.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 3;
    stroke-miterlimit: 10;
    stroke: #fff;
    fill: none;
    animation: stroke 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.0s forwards, fadeOut 0.4s linear 0.6s forwards;
}

.checkmark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin: 10% auto;
    box-shadow: inset 0px 0px 0px #ffffff50;
    animation: fill 0.8s ease-in-out 0.2s forwards, scale 0.5s ease-in-out 0.0s both, fadeOut 0.3s linear 0.8s forwards;
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.0, 0, 0.45, 1) 0.3s forwards, fadeOut 0.2s linear 0.8s forwards;
}

</style>