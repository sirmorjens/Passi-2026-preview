<script lang="ts">
    import GridHeading from './GridHeading.svelte'
    import GridTitle from './GridTitle.svelte'
    import StampSlot from '../StampSlot.svelte'
    import InfoView from '../StampGridOverlays/StampGrid_InfoView.svelte'
    import CompanyView from '../CompanyView.svelte'
    import { l } from '../../Util/DnxpLocalization'
    import { TrophyState, TrophyQR, externalStoreCall, levelNames, type SlotItem, } from '../../State/TrophyState.svelte'
    import { AppState } from '../../State/AppState.svelte'
    import { GetSubRoute, ResetSubRoute } from '../../Routes/Router.svelte'
    import { basePath } from '../../Util/BasePath'
    import { menuOpenState } from '../../State/MenuOpener.svelte'
    import { getCompanyInfo } from '../../Company/Companies'
    import type { CompanyInfo } from '../../Company/Companies'
    import TrophyView from '../StampGridOverlays/StampGrid_TrophyView.svelte';


    /*
    
        Tämä komponentti on poikeuksellisen sakea esitys

        Eli ne neljä lokeroa (pronssi, hopea, kulta, platina)
        on hard koodattu tähän ja aika helvetisti kaikkea 
        logiikkaa tapahtuu tämän komponentin sisällä

        Sori siitä
     

    */


    let { pageProps } = $props();

    const PresetContentTypes = {
        TODOLIST: 1,
        FEEDBACKLINK: 655,
        TODOLISTCOMPANYID: -99,
    }

    const localization = {
        pageName: "protogrid",
        localization: {
            "Passi - DuuniExpo 2026": "Passi - DuuniExpo 2026",
            "Tutustu DuuniExpon tarjontaan": "Discover DuuniExpo",
            "Sulje": "Close",
        }
    };

    /*
        
        - system to populate grid with qr codes I guess it's done
        
        - system to populate trophies, this needs thinking, trophies from server? 

        - system to facilitate dudu records

        - juu (juuri näin)

    */
    const trophyNames = {PRONSSI: 2, HOPEA: 3, KULTA: 4, PLATINA: 5,} // just an enum, not real meaningful numbers!

    const defaultDrawersOpen = false; // should every "drawer" be open by default?

    let drawers = $state({
        l1: {
            open: defaultDrawersOpen || true, 
            unlocked: true,
            marks: TrophyState.Slots.l1,
        },
        l2: {
            open: defaultDrawersOpen || false,
            marks: TrophyState.Slots.l2,
        },
        l3: {
            open: defaultDrawersOpen || false, 
            marks: TrophyState.Slots.l3,
        }, 
        l4: {
            open: defaultDrawersOpen || false, 
            marks: TrophyState.Slots.l4,
        }})


    // tässä siis myös qr koodin luku urlista (jos käyttäjä tulee sivulle qr koodi-linkin kautta)

    let SubRoutes = GetSubRoute();

    if( SubRoutes.length ) // if qr code is being read after signing in, we'll do it here
    {
        TrophyQR({qr: {data: basePath.qrbase + SubRoutes.join("/")}})
        ResetSubRoute(); // tämä nollaa urlin
    }

    const companyView: {
        visible: boolean;
        item: CompanyInfo | null;
        presetContent?: object;
        defaultOpen?: boolean;
    } = $state({
        visible: false,
        item: null,
    })

    const trophyView = $state({
        visible: false,
        close: function() {
            this.visible = false;
        },
    })

    type InfoViewCall = {
        presetContent: {
            markInfo?: boolean;
            feedbackLink?: boolean;
            emailQuery?: boolean;
            callToExploreCompanies?: boolean;
        }
    }

    const infoView = $state({
        visible: false,
        markInfo: false,
        presetContent: {
            feedbackLink: false,
            emailQuery: false,
            callToExploreCompanies: false,
        },
        close: function () {
            this.visible = false;
            this.presetContent = {
                feedbackLink: false,
                emailQuery: false,
                callToExploreCompanies: false,
            }
        },
        open: function (call: InfoViewCall) {

            switch(true)
            {   
                case call.presetContent && call.presetContent.markInfo:
                    this.markInfo = true;
                    break;
                case call.presetContent && call.presetContent.feedbackLink:
                    this.presetContent.feedbackLink = true;
                    break;
                case call.presetContent && call.presetContent.emailQuery:
                    this.presetContent.emailQuery = true;
                    break;
                case call.presetContent && call.presetContent.callToExploreCompanies:
                    this.presetContent.callToExploreCompanies = true;
                    break;
            }

            this.visible = true;
        }
    })

    let bronze: boolean = $derived(drawers.l1.marks.every((m) => m.asset != null));
    let silver: boolean = $derived(drawers.l2.marks.every((m) => m.asset != null));
    let gold: boolean = $derived(drawers.l3.marks.every((m) => m.asset != null))
    let platinum: boolean = $derived(drawers.l4.marks.some((m) => m.asset != null))

    const openCompanyViewFetchById = async (companyId: number, slotItem: SlotItem) =>
    {
        if(!companyId || !slotItem) return;

        const companyItems: CompanyInfo[] = await getCompanyInfo(companyId);
        
        if (companyItems.length) openCompanyView(companyItems[0]);

        slotItem.interactedWith = true;
        externalStoreCall()
    }

    const openCompanyView = (item: CompanyInfo): void =>
    {  
        if(item.companyId === null || typeof(item.companyId) === 'undefined') 
        {
            return;
        }

        pageProps.duduDeactivate();
        companyView.item = item
        companyView.visible = true;

        menuOpenState.backButtonMode = true;
        menuOpenState.backButtonCallback = () => {
            companyView.item = null;
            companyView.visible = false;
        }
    }

    const markSlotItemSeen = (slotItem: SlotItem) => {
        slotItem.seen = true;
        externalStoreCall()
    }

    const promptInfoViewEmailQuery = () => {
        if (TrophyState.participatedInDraw) return;
        infoView.visible = true;
        infoView.presetContent.emailQuery = true;          
    }

    $effect( () => {
        if(platinum && gold && silver && bronze)
        {
            promptInfoViewEmailQuery();
        }
    });

    const closeCompanyView = (): void => {
        if(companyView.defaultOpen) companyView.defaultOpen = false;

        if(menuOpenState.backButtonCallback) {
            menuOpenState.backButtonCallback()
            menuOpenState.backButtonCallback= null;
            menuOpenState.backButtonMode = false;
        }
    }

</script>

<svelte:head>
    <title>{l("Passi - DuuniExpo 2026", localization)}</title>
</svelte:head>

<div class="gridWrapper">

    <GridTitle 
        openTrophyView={() => {
            trophyView.visible = !trophyView.visible
        }} 
        trophyLevel={
            (bronze && silver && gold && platinum) ? 'platinum' :
            (bronze && silver && gold) ? 'gold' :
            (bronze && silver) ? 'silver' : (bronze) ? 'bronze' : 'none'
        }/>

    <GridHeading 
        title={levelNames['bronze'][AppState.lang]} 
        slotKey="l1"
        pokaali={trophyNames.PRONSSI}
        bind:drawerOpen={drawers.l1.open} 
        drawerUnlocked={true || /* original dnxp 2026 implementation->*/ drawers.l1.marks.some((m) => m.asset != null)
        } 
        levelTrophy={bronze} />

    <div class="grid" class:open={drawers.l1.open}>
        {#if drawers.l1.open}
            {#each drawers.l1.marks as markItem}
                <StampSlot {markItem} markItemSeen={() => markSlotItemSeen(markItem)} todoMark={markItem.accepts.some((i) => i==PresetContentTypes.TODOLIST)} openCompanyView={openCompanyViewFetchById} openInfoView={(call: InfoViewCall) => infoView.open(call)}/>
            {/each}
        {/if}
    </div>

    <GridHeading title={levelNames['silver'][AppState.lang]}
    pokaali={trophyNames.HOPEA} 
    slotKey="l2"
    bind:drawerOpen={drawers.l2.open} 
    drawerUnlocked={true || /* original dnxp 2026 implementation->*/ drawers.l2.marks.some((m) => m.asset != null) || /* so l2 will be unlocked once l1 is filled*/ drawers.l1.marks.every((m) => m.asset != null)} 
    levelTrophy={bronze && silver} 
    autoOpenForNewContent={drawers.l2.marks.some((m) => m.asset != null && m.seen == false)} />

    <div class="grid" class:open={drawers.l2.open}>
        {#if drawers.l2.open}
            
            {#each drawers.l2.marks as markItem}
                <StampSlot {markItem} markItemSeen={() => markSlotItemSeen(markItem)} openCompanyView={openCompanyViewFetchById} openInfoView={(call: InfoViewCall) => infoView.open(call)}/>
            {/each}
        {/if}
    </div>

    <GridHeading 
    slotKey="l3"
    title={levelNames['gold'][AppState.lang]}
    pokaali={trophyNames.KULTA} 
    bind:drawerOpen={drawers.l3.open} 
    drawerUnlocked={true || /* original dnxp 2026 implementation->*/ drawers.l3.marks.some((m) => m.asset != null) || drawers.l2.marks.every((m) => m.asset != null)} levelTrophy={bronze && silver && gold} 
    autoOpenForNewContent={drawers.l3.marks.some((m) => m.asset != null && m.seen == false)} />

    <div class="grid" class:open={drawers.l3.open}>
        {#if drawers.l3.open}
            {#each drawers.l3.marks as markItem: Mark}
                <StampSlot {markItem} markItemSeen={() => markSlotItemSeen(markItem)} openCompanyView={openCompanyViewFetchById} feedbackMark={markItem.accepts.length == 1 && markItem.accepts.includes( PresetContentTypes.FEEDBACKLINK ) } openInfoView={(call: InfoViewCall) => infoView.open(call)}/>
            {/each}
        {/if}
    </div>

    <GridHeading title={levelNames['platinum'][AppState.lang]}
    slotKey="l4"
    pokaali={trophyNames.PLATINA} bind:drawerOpen={drawers.l4.open} 
    drawerUnlocked={true || /* original dnxp 2026 implementation->*/ drawers.l4.marks.some((m) => m.asset != null)} 
    autoOpenForNewContent={drawers.l4.marks.some((m) => m.asset != null && m.seen == false)} 
    levelTrophy={bronze && silver && gold && platinum} />

    <div class="grid misc" class:open={drawers.l4.open}>
        {#if drawers.l4.open}
            {#each drawers.l4.marks as markItem: Mark}
                <StampSlot {markItem} markItemSeen={() => markSlotItemSeen(markItem)} openCompanyView={openCompanyViewFetchById} openInfoView={(call: InfoViewCall) => infoView.open(call)}/>
            {/each}
        {/if}

    </div>
    <div class="spacer"></div>
    <div class="spacer"></div>
</div>

{#if companyView.visible}
    <CompanyView companyItem={companyView.item as CompanyInfo} close={closeCompanyView}/>
{/if}

{#if trophyView.visible}
    <TrophyView {trophyView} />
{/if}
{#if infoView.visible}
    <InfoView {infoView} />
{/if}

<style>
    .spacer {
        height: 5vh;
        height: 5svh;
    }
    .gridWrapper
    {
        width: 100%;
        margin: 0;
        padding: 0;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

    }
    .grid {
        width: 80%;
        width: min(80%, 400px);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        flex-wrap: wrap;
        transition: max-height 0.25s;
        max-height: 0px;
        overflow: hidden;
    }

    .open 
    {
        max-height: 300px;
    }

    .grid.misc {

        overflow-y: auto;
    }
</style>