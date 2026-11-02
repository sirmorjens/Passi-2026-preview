<script lang="ts">
    import { AppState } from "../../State/AppState.svelte";
    import { l, type LocalizationItems } from "../../Util/DnxpLocalization";
    import { TrophyState } from "../../State/TrophyState.svelte";

    import StampGridOverlay from './StampGridOverlay.svelte'

    const localization: LocalizationItems = {
        pageName: "protogrid",
        localization: {
            "Passi - DuuniExpo 2026": "Passi - DuuniExpo 2026",
            "Tutustu DuuniExpon tarjontaan": "Discover DuuniExpo",
            "Sulje": "Close",
        }
    };    

    let {
        trophyView
    } = $props();

</script>

<StampGridOverlay hideCloseButton={false} close={()=>trophyView.close()}>
    <div class="trophyViewContent">
        <div class="littlespacer"></div>
        <div class="wrapper">
            {#each Array.from([1,2,3,4,5,6,7]) as trophyAssetId}

                {#if TrophyState.Trophies[trophyAssetId]}
                    <img class="trophy" src={"/app/trophies/" + TrophyState.Trophies[`${trophyAssetId}`].src + ".svg"} alt="Trophy" />
                {:else}
                    <img class="trophy" src="/app/trophies/blank_trophy.svg" alt="Blank trophy" />
                {/if}

            {/each}
        </div>
        <div class="legendContent"> 
            <div class="h">
                    <h2>{AppState.lang == 'fi' ? "Kuinka tämä toimii" : "How this works"}</h2>
                </div>
                <p>Maybe get rid of "trophies" (the medals above)? </p>
                <div class="legend">
                    <img class="iconprev" src="/app/icons/icon_ex.svg" alt="Stand" >
                    <p>{AppState.lang == 'fi' ? "Tähän ruutuun sopii QR-koodi näytteilleasettajan pisteeltä" : "For a slot like this, scan a QR-code on an exhibitor stand"}</p>
                </div>
                <div class="legend">
                    <img class="iconprev" src="/app/icons/icon_pre.svg" alt="Stand" >
                    <p>{AppState.lang == 'fi' ? "Tähän ruutuun sopii QR-koodi työpajasta, paneelista tai puhujan esityksestä" : "For a slot like this, scan a QR-code in a workshop, presention or a speaker event"}</p>
                </div>
            <div class="legend">
                <img class="iconprev" src="/app/icons/icon_hybrid.svg" alt="Stand" >
                <p>{AppState.lang == 'fi' ? "Tähän ruutuun sopii jompi kumpi" : "For a slot like this, you can scan either one of the above"}</p>
            </div>
            <div class="littlespacer"></div>
        </div>
    </div>
</StampGridOverlay>

<style>
    div.input {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    div.input input {
        width: 80%;
        border-radius: 0.4rem;
        background: none;
        border: 1px solid #ffffff90;
        font-family: 'Roboto Mono Variable', monospace;
        margin-bottom: 0.7rem;

    }
    button.reject {
        border: 1px solid color-mix(in srgb, var(--dnxpOrange) 20%, #ffffff70);
        color: #ffffff90;
    }
    button.reject.confirm {
        background: var(--dnxpOrange);
        color: #ffffff;
    }
    .trophyViewContent {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .trophyViewContent .wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .trophyViewContent.legendContent 
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-items: center;
        width: 100%;
        pointer-events: auto;
    }
    .legendContent .h h2 
    {
        margin-left: 3.5rem;
    }
    div.text p {
        width: 80%;
        text-align: left;
        margin-left:10%;
        margin-bottom: 3rem;
        word-wrap: break-word;
    }
    .legendContent .legend 
    {
        margin: 0;
        margin-left: 3.5rem;
        margin-bottom: 1rem;
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .legendContent .littlespacer {
        height: 3.5rem;
        flex: 0 0 3.5rem;
    }
    img.iconprev {
        height: 5.5rem;
        margin: 0;
        margin-right: 1rem;

    }
    .trophyViewContent .wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .trophyViewContent .wrapper img.trophy {
        width: 4.2rem;
        height: 4.2rem;
        margin-right: -1rem;
    } 
    .legendContent {
        align-items: flex-start;
        justify-content: center;
    }
    .legendContent .legend {
        justify-content: flex-start;
        align-self: flex-start;
        margin-left: 0.5rem;
    }
    .legendContent .legend p {
        text-align: left;
    }
    .open 
    {
        max-height: 300px;
    }

    .grid.misc {

        overflow-y: auto;
    }

</style>