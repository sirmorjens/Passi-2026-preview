<script lang="ts">
    import pronssi from '/pokaali_pronssi.svg'
    import hopea from '/pokaali_hopea.svg'
    import kulta from '/pokaali_kulta.svg'
    import platina from '/pokaali_platina.svg'
    import { TrophyState, CallApi, externalStoreCall } from '../../State/TrophyState.svelte'
    import { DuduQState } from '../../DuuniDudu/DuduDialogueQuestions.svelte'
    import Confetti from '../Confetti.svelte';

    /* rewrite */
    /* add confetti to level updates, not stamps */

    const trophyNames = {PRONSSI: 2, HOPEA: 3, KULTA: 4, PLATINA: 5,}
    const trophys: {[key: number]: string} = {2: pronssi, 3: hopea, 4: kulta, 5: platina};
    const trk = {
        2: "a44",
        3: "0hg",
        4: "50axx",
        5: "4C99c",
        6: "oac",
        9: "kas4",
        23: "v88c",
        26: "v99944",
        39: "xaso2", 
        40: "aco",
        41: "v88c",
        46: "9v8c",
        60: "0v9",
        76: "ax983",
        80: "340ee",
        93: "cl9ek",
        100: "v99c",
    }
    
    const trophyOffset = 0;

    type Props = {
        title: string,
        pokaali: number,
        drawerOpen: boolean,
        drawerUnlocked: boolean,
        levelTrophy : boolean,
        autoOpenForNewContent?: boolean;
        slotKey: SlotKey,
    }

    let {
        title, 
        pokaali, 
        drawerOpen = $bindable(), 
        drawerUnlocked, 
        levelTrophy = false, 
        autoOpenForNewContent = false,
        slotKey,
    }: Props = $props();

    const kultapokaali = () => {
        console.log("Kulta pokaali mode")
        DuduQState.currentQuestion = DuduQState.badgeNotice;
        DuduQState.forceCurrentQuestion = true;
    }

    $effect( () => {
        if(levelTrophy && pokaali == trophyNames.KULTA && !(pokaali in TrophyState.Trophies )) 
        {
            kultapokaali();
        }

        if(levelTrophy && !( pokaali in TrophyState.Trophies )) 
        {
            CallApi({trk: trk[(pokaali+trophyOffset)*20]})
        }
    })
</script>

{#if autoOpenForNewContent}
    <div {@attach () => {drawerOpen = true}}></div>
{/if}

<section class="gridHeading" class:locked={!drawerUnlocked}>
    <label>
        <div>
            <button onclick={() => {drawerOpen = !drawerOpen}} disabled={!drawerUnlocked}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none" class="buttonArrow" stroke-width="2px">
                {#if drawerOpen}
                  <line x1="0" y1="15" x2="10" y2="5" />
                  <line x1="20" y1="15" x2="10" y2="5" />
                {:else}
                  <line x1="0" y1="5" x2="10" y2="15" />
                  <line x1="20" y1="5" x2="10" y2="15" />
                {/if}
                </svg>
            </button>
            <h2 class="title">{title} <span class="stats" class:done={levelTrophy }>{TrophyState.Slots[slotKey].filter(s => s.asset).length}/{slotKey == 'l4' ? "-" : TrophyState.Slots[slotKey].length}</span></h2>
        </div>
        <div class="trophy" class:levelTrophy={levelTrophy}>
            {#if levelTrophy && !TrophyState.SlotCelebration[slotKey]}
                <Confetti markItemSeen={() => {
                    TrophyState.SlotCelebration[slotKey] = true;
                    externalStoreCall();
                }} />
            {/if}
            <img src={trophys[pokaali]} height="1rem" alt="Trophy" />
        </div>
    </label>
</section>

<style>
    .buttonArrow {
        stroke: var(--dnxpYellow);
    }
    .gridHeading
    {
        width: 80%;
        width: min(80%, 400px);
        margin: 0;
        padding: 0;
        border-radius: 20px;
        border: 1px solid #ffffff20;
        background: #00000005;
        margin-bottom: 0.5rem;
    }
    .gridHeading label
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        box-sizing: border-box;
        margin: 0;
        padding: 0;
        margin-top: 5px;
        margin-bottom: 5px;
        user-select: none;
        -webkit-user-select: none;
    }
    .gridHeading label div {
        display: flex;
        flex-direction: row;

    }

    .gridHeading label button {
        padding: 0;
        margin: 0;
        border: none;
        margin-left: 1.3rem;
        user-select: none;
        outline: none
    }
    .gridHeading label button:focus {
        background: #ffffff30;  
    }
    .gridHeading label button:focus svg {
        stroke: white;    

    }
    .trophy {
        height: 25px;
        margin: 0;
        padding: 0;
        margin-right: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .trophy img {
        height: 1.4rem;
    }
    .trophy img {
        opacity: 0.25;
    }

    .levelTrophy.trophy img {
        opacity: 1;
        filter: drop-shadow(1px 1px 10px #ffffff60);
        filter: drop-shadow(1px 1px 5px color-mix(in srgb, var(--dnxpYellow) 50%, #ff0000ff));
    }
    h2.title
    {
        font-weight: 700;
        font-size: 0.9rem;
        display: block;
        margin: 5px;
        padding: 0;
        margin-left: 1em;
        box-sizing: border-box;
        user-select: none;
        -webkit-user-select: none;
    }

    .locked {
        color: #909090;
        border: 1px solid #98989810;
    }
    .locked svg {
        stroke: #909090;
        opacity: 0.5;
    }

    h2 span.stats {
        font-weight: 500;
        font-size: 0.9rem;
        color: #ffffffae;
        margin-left: 0.4rem;
    }
    h2 span.stats.done {
        color: var(--dnxpYellow);
        text-shadow: 0px 0px 25px var(--dnxpYellow);
    }
</style>