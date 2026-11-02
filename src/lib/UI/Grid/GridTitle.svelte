<script lang="ts">
    import { Tween } from 'svelte/motion'
    import { cubicInOut } from 'svelte/easing' 
    import { TrophyState, levelNames } from '../../State/TrophyState.svelte'
    import { AppState } from '../../State/AppState.svelte';

    type Props = {
        openTrophyView: () => void,
        trophyLevel: string;
    }

    let { 
        openTrophyView = () => {console.log('callback missing')}, 
        trophyLevel
    }: Props = $props();
   
    let progressValue = Tween.of(
        () => ( Math.min( ((
            Array.from([]).filter(i => i in TrophyState.Trophies).length + 
            TrophyState.Slots.l1.filter(m => m.asset).length +
            TrophyState.Slots.l2.filter(m => m.asset).length + 
            TrophyState.Slots.l3.filter(m => m.asset).length +
            (TrophyState.Slots.l4.filter(m => m.asset).length > 0 ? 1 : 0) ) / 10) * 100 ,100)), {duration: 1200, easing: cubicInOut});


</script>


<section class="gridTitle" >
    <h2 class="title">
        <span>{AppState.lang == 'fi' ? 'Rooli:' : 'Role:'}</span>
        {levelNames[trophyLevel][AppState.lang]}
    </h2>
    <div class="right">
        <div class="trophy">
            {#each Object.values(TrophyState.Trophies) as trophy}
                <img src={"/app/trophies/" + trophy.src + ".svg"} alt="Blank" />
            {/each}
        </div>
        <div class="info">
            <button title="Open trophy view" onclick={openTrophyView}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#dcd4d4" d="M12 8.5a1.5 1.5 0 0 0-1.5 1.5v.107a.5.5 0 1 1-1 0V10A2.5 2.5 0 0 1 12 7.5h.116a2.384 2.384 0 0 1 1.552 4.193l-.771.661a1.14 1.14 0 0 0-.397.863v.533a.5.5 0 0 1-1 0v-.533c0-.624.273-1.216.746-1.622l.77-.66a1.384 1.384 0 0 0-.9-2.435zm0 8a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5"/><path fill="#dcd4d4" d="M3.5 12a8.5 8.5 0 1 1 17 0a8.5 8.5 0 0 1-17 0M12 4.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15"/></svg>
            </button>
        </div>
    </div>
    <progress class="visuallyhidden" max="100" value={progressValue.current}></progress>
</section>
<section class="gridTitle progressContainer">
    <div class="progress">
        <div class="percent">{progressValue.current.toFixed()}%</div>
        <div class="progressBarWrapper">
            <div class="progressBar" style:width={`${progressValue.current}%`}></div>
        </div>

    </div>
</section>

<style>
    .gridTitle
    {
        border: 1px solid #ffffff20;
        background: #00000040;
        width: 80%;
        width: min(80%, 400px);
        margin: 0;
        padding: 5px;
        border-radius: 0.8rem;
        user-select: none;
        -webkit-user-select: none;
        
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        margin-bottom: .5rem;
    }
    .gridTitle.progressContainer {
        margin-bottom: 1rem;
    }
    .progress
    {
        width: 100%;
        height: 25px;
        display: flex;
        box-sizing: border-box;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin: 0;
        padding: 0%;
    }


    .progressBarWrapper
    {
        width: 90%;
        width: calc(100% - 20px);
        margin: 0;
        flex: 6;
        padding: 0;
        height: 90%;
        display:flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin-left: 1rem;
    }
    .progressBar
    {
        margin: 0;
        padding: 0;
        height: 40%;
        background: var(--dnxpOrange);
        border-radius: 10px;
    }

    .progress .percent {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 1rem;
        height: 100%;
        font-family: 'Roboto Mono Variable', monospace;
        font-size: 0.9rem;

    }

    .right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }

    .right .info button {
        padding: 0;
        margin: 0;
        border: none;
        background: none;
    }
    .right .info button svg {
        margin: 0;
        margin-top:0.7rem;
        margin-right: 0.6rem;
        height: 2rem
    }
    .right .trophy {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        padding-right: 0.6rem;

    }
    .right .trophy img {
        margin: 0;
        margin-top:0.6rem;
        margin-right: 0.6rem;
        height: 1.2em;
        margin-right: -0.2rem;
        filter: drop-shadow(1px 1px 5px #ffaa77);
    }

    .visuallyhidden 
    {
        width: 1px;
        height: 1px;
        position: absolute;
        top: -999px;
        left: -999px;
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
    h2 span {
        font-weight: 400;
        color: #ffffffef;
        margin-right: 0.3rem;
    }
</style>