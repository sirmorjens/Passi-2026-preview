<script lang="ts">

    import MenuButton from "./MenuButton.svelte";
    import { LinkDealer } from '../Util/LinkDealer.svelte'
    import { fade } from 'svelte/transition'
    import { menuOpenState } from '../State/MenuOpener.svelte'

    let { duduFlight } = $props(); // we want to hide everything when dudu is flying, so user won't click on menubutton while trying to do their thing

    const onclick: () => void = () => {

        if(menuOpenState.backButtonMode)
        {
          menuOpenState.backButtonMode = false;

          if(menuOpenState.backButtonCallback == null)
          {
            throw "No callback for menubutton->back";
          }

          menuOpenState.backButtonCallback();

          menuOpenState.backButtonCallback = null;
          
          if (menuOpenState.MenuButtonDown) menuOpenState.MenuButtonDown = false;

        }
        menuOpenState.MenuButtonOpen = false

    }
</script>

{#if !duduFlight }

    <div transition:fade class="Header">
        <a href="/" {@attach LinkDealer()} {onclick}><img src="/app/dnxp/DNXP.jpg" alt="DuuniExpo" /></a>
    </div>

    <div transition:fade class="buttonContainer">
        <MenuButton />
    </div>

    <div transition:fade class="shareContainer">
        <!-- nothing -->
    </div>

{/if}

<style>
    .Header, .buttonContainer, .shareContainer {
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        margin:0;
        padding: 0;
        padding-top: 20px;
        pointer-events: none;
        height: 10svh;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        overflow: visible;
        box-shadow: border-box;
        z-index: 20;
        user-select: none;

    }
    .Header 
    {
        background: linear-gradient(to bottom, #00000077, #00000000);
        pointer-events: none;
        user-select: none;
    }
    .Header img {
        height: 60%;
        min-height: 40px;
        max-height: min(50px, 15vh);
        max-height: min(50px, 15svh);
        border: none;
        border-radius: 50%;
        user-select: none;
    }
    .buttonContainer {
        justify-content: flex-start;
        user-select: none;
    }
    .Header {
        justify-content: center;
        pointer-events: none;
        user-select: none;
    }
    .shareContainer {
        justify-content: flex-end;
        user-select: none;
    }
    .Header a {
        user-select: none;
        pointer-events: auto;
    }




</style>