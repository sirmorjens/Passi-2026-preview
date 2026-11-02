<script lang="ts">
    import { l, type LocalizationItems } from "../../Util/DnxpLocalization";
    import { fade } from "svelte/transition";


    const localization: LocalizationItems = {
        pageName: "Protogrid_overlay",
        localization: {
            "Sulje": "Close",
        }
    }

    let {
        children,
        close,
        hideCloseButton
    } = $props();
</script>

<div class="StampGridOverlayFs" transition:fade>
    <div class="StampGridOverlayContainer">
        {#if !hideCloseButton}
        <div class="StampGridOverlayTop">
            <button onclick={close}>{l("Sulje", localization)}</button>
        </div>
        {/if}
        {@render children()}
    </div>
</div>

<style>
    .StampGridOverlayFs {
        pointer-events: none;
        height: 90%;
        width: 100%;
        position: absolute;
        top:0;
        left:0;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .StampGridOverlayFs .StampGridOverlayContainer
    {
        width: 70%;
        width: min(380px, 70%);
        border-radius: 1.2rem;
        padding: 1rem;
        margin: 0;
        margin-top: 1rem;
        margin-bottom: -1rem;
        background: #000000;
        background: var(--dnxpBackground);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: right 70% bottom;
        pointer-events: auto;
    }
    .StampGridOverlayFs .StampGridOverlayContainer .StampGridOverlayTop {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        pointer-events: auto;
    }
    .StampGridOverlayFs .StampGridOverlayContainer .StampGridOverlayTop button {
        pointer-events: auto;
    }
</style>            