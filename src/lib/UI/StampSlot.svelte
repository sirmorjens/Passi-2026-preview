<script lang="ts">
    import EmptyStampIcon from "./EmptyStampIcon.svelte";

    let { 
        markItem = null, 
        todoMark = null, 
        openInfoView = null, 
        openCompanyView,
        feedbackMark = false, 
        markItemSeen = () => {throw "No callback"},
    } = $props();

    const animationEndListener = (e: AnimationEvent): void => {
        markItemSeen();
    }

</script>


<div class="stampSlot" class:todoMark={todoMark} class:animation={markItem.asset && !markItem.seen} onanimationend={animationEndListener} class:feedbackMark={feedbackMark} class:todoMarkDone={markItem.asset != null}>
    <label>
        
        <button class="overlayOpener" title="Open" onclick={() => {

            if(!markItem.asset && !todoMark && !feedbackMark)
            {
                openInfoView({markInfo: true},);
                return;
            }
            if(!markItem.asset && feedbackMark)
            {
                openInfoView({presetContent: {
                    feedbackLink: true,}
                });
                return;
            }
            if(!markItem.asset && todoMark)
            {
                openInfoView({presetContent: {
                    callToExploreCompanies: true,}
                });
                return;
            }
            
            if(markItem.asset && (todoMark || feedbackMark))
            {
                // do something fun
                // jep näin vuoden jälkeen mikähän tässä on ollut idea
                return;
            }

            openCompanyView( markItem.asset.companyId, markItem )
        }
        }></button>

    {#if markItem.asset && !todoMark && !feedbackMark}
        <img src={"/app/logos/" + markItem.asset.src + ".png"} alt="" >
    {:else}
        <div>
            <EmptyStampIcon {feedbackMark} {todoMark} {markItem}/>
        </div>
    {/if}

    </label>
    {#if !feedbackMark && !todoMark && markItem.asset && !markItem.interactedWith}
        <div class="roundthing">!</div>
    {/if}
</div>
      
<style>
    @keyframes newStamp {
        0% {
            transform: scale(0,0) rotate(-15deg);
            opacity: 0;
        }

        50% {
           transform: scale(1.2,1.2) rotate(2deg); 
            opacity: 1;
        }
        100% {

        }
    }
    .animation {
        animation: newStamp 0.6s;
    }

    .stampSlot {
        margin: 0.5rem;
        flex: 0 0 60px;
        width: 60px;
        height: 60px;
        box-sizing: border-box;
        border-radius: 10px;
        border: 1px solid #ffffff10;
        background: #111;
        position: relative;
        box-shadow: 5px 5px 30px #00000040 inset, 0px 0px 10px #000000f8;
        box-sizing: border-box;
        padding: 0;
        overflow: visible;


        display: flex;
        justify-content: center;
        align-items: center;
    }
    .stampSlot img 
    {
        border-radius: 8px;
        width: 100%;
    }
    .stampSlot label {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .stampSlot label div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .stampSlot label button {
        position: absolute;
        width: 1px;
        height: 1px;
        border: transparent;
        background: transparent;
    }

    .stampSlot label button:active ~ img, .stampSlot label button:active ~ div {
        width: 90%;
    }
    .todoMark, .feedbackMark {
        border: 1px solid #000000;
        border-color: color-mix(in srgb, var(--dnxpOrange) 25%, #ffffff00);
        background: #111;
    }
    .roundthing {
        position: absolute;
        right: -10px;
        top: -5px;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        padding: 0.2em;
        font-size: 1em;
        font-weight: 900;
        aspect-ratio: 1/1;
        border-radius: 50%;
        background: rgba(255, 51, 82, 0.685);
        box-shadow: 2px 2px 10px #000;
        border: 1px solid rgba(255, 255, 255, 0.306);
        animation: jump 1.6s cubic-bezier(.17,.54,.09,1.38) infinite;
        transform-origin: center;
        user-select: none;
        pointer-events: none;
    }
    @keyframes jump {
        0% {transform: translate(0px, 0px);}
        50% {
            transform: translate(0px, -2px) scale(0.95, 1.05);

        }
        100% {
            transform: translate(0px, 0px);
        }
    }  

    button {
        outline: none;
    }
    
    label:has(button:focus) {
        border: 1px solid white;
        border-radius: 1rem;
    }
</style>        