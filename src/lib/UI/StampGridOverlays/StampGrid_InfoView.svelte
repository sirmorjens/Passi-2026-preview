<script lang="ts">
    import { canvasReply, TrophyState } from "../../State/TrophyState.svelte";
    import { AppState } from "../../State/AppState.svelte";
    import { SetRouter, ExecuteRouter } from "../../Routes/Router.svelte";
    import { l, type LocalizationItems } from "../../Util/DnxpLocalization";
    import StampGridOverlay from "./StampGridOverlay.svelte";
    
    const localization: LocalizationItems = {
        pageName: "protogrid",
        localization: {
            "Passi - DuuniExpo 2026": "Passi - DuuniExpo 2026",
            "Tutustu DuuniExpon tarjontaan": "Discover DuuniExpo",
            "Sulje": "Close",
        }
    };    

    let {
        infoView
    } = $props();

    // svelte-ignore non_reactive_update
    let emailInput: string = $state(""), sureBtn: HTMLButtonElement, sure = $state(false)
    
    const askSure = () => {
        if(sureBtn) {
            sureBtn.textContent = AppState.lang == 'fi' ? "Varmista ei" : "Confirm no"
            sure = true
        }
    }
</script>

<StampGridOverlay close={()=>infoView.close()} hideCloseButton={infoView.presetContent.emailQuery /* hide to prevent misclicking when asked for a reply */ }>
    <div class="trophyViewContent legendContent">
            {#if infoView.markInfo}
                <div class="h">
                    <h2>{AppState.lang == 'fi' ? "Kuinka tämä toimii (tän vois päivittää)" : "How this works"}</h2>
                </div>
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
            {/if}
            {#if infoView.presetContent.feedbackLink}
                <div class="h">
                    <h2>{AppState.lang == 'fi' ? "Palautekysely" : "Feedback survey"}</h2>
                </div>
                <div class="text">
                    <p>{AppState.lang == 'fi' ? "Anna meille palautetta DuuniExpo 2026 -tapahtumasta ja saat leiman" : "Let us know your feedback and you'll receive this mark"}</p>
                    <button class="large" onclick={() => {
                        infoView.close();
                        SetRouter("/feedback");
                        ExecuteRouter();
                    }}>
                        {AppState.lang == 'fi' ? "Palautekyselyyn" : "To the feedback page"}
                    </button>
                </div>

                <div class="littlespacer"></div>
            {/if}
            {#if infoView.presetContent.callToExploreCompanies}
                <div class="h">
                    <h2>{AppState.lang == 'fi' ? "Tutustu DuuniExpoon" : "Discover DuuniExpo"}</h2>
                </div>
                <div class="flagPicture">
                    <img src="/app/flagstuff.svg"  alt="Tutustu DuuniExpoon" class="smallflagpicture" />
                </div>
                <div class="text">
                    <p>{AppState.lang == 'fi' ? "Merkitse vähintään " + TrophyState.userLikedAmount.toString() + " sinua kiinnostavaa kohdetta, saat leiman." : "Select atleast " + TrophyState.userLikedAmount.toString() + " companies or activies of interest to unlock this mark."}</p>
                    <button class="large" onclick={() => {
                        infoView.close();
                        SetRouter("/programme");
                        ExecuteRouter();
                    }}>
                        {AppState.lang == 'fi' ? "Tutustu DuuniExpon objelmaan" : "Explore DuuniExpo programme"}
                    </button>
                </div>

                <div class="littlespacer"></div>
            {/if}
            {#if infoView.presetContent.emailQuery}
                <div class="h">
                    <h2>{AppState.lang == 'fi' ? "Osallistu arvontaan" : "Enter a giveaway"}</h2>
                </div>
                <div class="text">
                    <p>{AppState.lang == 'fi' ? "Arvomme kaksi DuuniExpo-kassia platinatasolle yltäneiden DuuniExpo Passi -käyttäjien kesken. Osallistu arvontaan jättämällä sähköpostiosoitteesi" : "We're giving away two DuuniExpo canvas bags among those who've reached Platinum-level. Enter your email address to participate."}</p>
                
                <div class="input">
                <input type="text" bind:value={emailInput} placeholder={AppState.lang == 'fi' ? "Sähköpostiosoitteesi" : "Your email address"} />

                <div class="btnrow">
                    <button onclick={() => {canvasReply(true, emailInput); infoView.close();}}>{AppState.lang == 'fi' ? 'Lähetä' : 'Send'}</button>
                    <button class="reject" class:confirm={sure} bind:this={sureBtn} onclick={() => {if (sure) {canvasReply(false); infoView.close(); return;} askSure(); }}>{AppState.lang == 'fi' ? "Ei kiitos" : "No thanks"}</button>
                </div>
                </div>
                </div>


                <div class="littlespacer"></div>
            {/if}
    </div>
</StampGridOverlay>

<style>
    .flagPicture img {
        width: 40%;
        width: min(40%, 200px);
        user-select: none;
    }
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
    .trophyViewContent.legendContent 
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-items: center;
        width: 100%;
        pointer-events: auto;
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
</style>