<script lang="ts">
  // @ts-expect-error
  import '@fontsource-variable/roboto-mono';
  // @ts-expect-error
  import '@fontsource-variable/dm-sans';

  import { ExecuteRouter } from './lib/Routes/Router.svelte'
  import { menuOpenState } from "./lib/State/MenuOpener.svelte"
  import { fade } from 'svelte/transition'

  import { Api } from './lib/Api/Api'
  
  import { DuduQState, DuduQStateLoad, DuduQStateLoadAnswers } from './lib/DuuniDudu/DuduDialogueQuestions.svelte'
  import { duduState } from './lib/DuuniDudu/DuduState.svelte'

  import DuuniDudu from './lib/DuuniDudu/DuuniDudu.svelte'
  import DuduDialogue from './lib/DuuniDudu/DuduDialogue.svelte'

  import Menu from "./lib/UI/Menu.svelte"
  import Header from "./lib/UI/Header.svelte"
  import UIOverlays from './lib/UI/Overlays/UIOverlays.svelte';
  import ScannerButton from './lib/UI/ScannerButton.svelte';
  import Landing from './lib/Routes/Landing.svelte'
  import DuduCustomization from './lib/DuuniDudu/DuduCustomization.svelte'
  import PWABadge from './lib/Util/PWABadge.svelte'

  import { pageState } from './lib/State/PageState.svelte';
  import { AppState } from './lib/State/AppState.svelte'
  import { LoadTrophyState } from './lib/State/TrophyState.svelte'

  import DebugTools from './lib/DevTools/DebugTools.svelte'

  const pageIndexes: {
    [key: string]: number;
  } = {
    LANDING_PAGE: 3,
    FRONT_PAGE: 0,
  }
  type LocalPageState = {
    scan: boolean;
    success: boolean;
    successIsAnimating: boolean;
    duduFlight: boolean;
    loading: boolean;
    duduCustomizationOverlayOpen: boolean;
    /*  svelte doesn't like mutating state 
        inside child, valid I guess
        so let's do it via this callback
    */
    assignToState: (data: Partial<LocalPageState>) => void;
  }

  const localPageState: LocalPageState = $state({
    scan: false,
    success: false,
    successIsAnimating: false,
    duduFlight: false,
    loading: false,
    duduCustomizationOverlayOpen: false,
    assignToState: function (data: Partial<LocalPageState>) {
      Object.assign(this, data);
    }
  });

  // duunidudu will bind to this so it can be called upon
  // svelte-ignore non_reactive_update
  let DuuniDuduCallable: DuuniDudu, DuduDialogueCallable: DuduDialogue; 
  
  // load states
  AppState.load(); // loads appstate from localstorage or backend
  LoadTrophyState(); // loads trophystate from localstorage or backend
  DuduQStateLoad();
  DuduQStateLoadAnswers();
  duduState.load();

  // execute router = look URL path and decide which page is shown
  ExecuteRouter(window.location);

</script>

  <svelte:head>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">  
  </svelte:head>

  <svelte:window 
    onerror={
      (e:any) => {
        // log browser errors
        Api.Report("JS error: " + e.error + " " + e.message + " " + e.filename)
      }
    } 
    onpopstate={(e: Event) => {// popstate = browser back-button pressed so execute router to display correct page
        ExecuteRouter(window.location);
        e.preventDefault();
      }
    }
    />

  <PWABadge />

  {#key pageState.currentPage} <!-- keyed element completely re-render when key property changes -->
    <div in:fade class:contentwrapper={pageState.currentPage.framed} class:contentwrapper-fullscreen={!pageState.currentPage.framed}>
      
      <pageState.currentPage.page 
        pageProps={{
          loadingAnimationStart: () => {localPageState.loading = true},
          loadingAnimationEnd: () => {localPageState.loading = false},
          duduDeactivate: () => {
            if(DuduDialogueCallable) DuduDialogueCallable.skip();}
       }}/>

    </div>
  {/key}

  
  {#if pageState.pageIndex == pageIndexes.FRONT_PAGE} 
    <DuduCustomization 
      pokeDudu={() => {if(DuuniDuduCallable) DuuniDuduCallable.pokeDudu()}}
      onOpen={() => {if(DuduDialogueCallable) DuduDialogueCallable.skip();localPageState.duduCustomizationOverlayOpen = true;}} 
      onClose={() => {localPageState.duduCustomizationOverlayOpen = false;}} 
      {localPageState} />

    {#if (!DuduQState.doneAsking || DuduQState.forceCurrentQuestion) && !localPageState.duduCustomizationOverlayOpen}
        {#await new Promise((resolve) => {setTimeout(resolve, 2600);}) then }
          {#key DuduQState.forceCurrentQuestion}
           <DuduDialogue bind:this={DuduDialogueCallable}
            getDuuniDuduPosition={DuuniDuduCallable.getPosition}
            talk={DuuniDuduCallable.talk}
            shutUp={DuuniDuduCallable.shutup}
            DuduSetSad={DuuniDuduCallable.setSad}
            pokeDudu={DuuniDuduCallable.pokeDudu}
            submitToStartleEvent={DuuniDuduCallable.submitToStartleEvent}
            clearStartleEvent={DuuniDuduCallable.clearStartleEvent}
            />
          {/key}
        {/await}

    {/if}   

    {#if !localPageState.duduCustomizationOverlayOpen}
      <ScannerButton assignToLocalPageState={(data: Partial<LocalPageState>)=>localPageState.assignToState(data)} />
    {/if}
  {/if}

  <Menu  />
  <Header duduFlight={localPageState.duduFlight} />
    
  {#if pageState.pageIndex == pageIndexes.FRONT_PAGE}
    <DuuniDudu 
      bind:this={DuuniDuduCallable} 
      mainAppCallHideHeader={() => {
        localPageState.duduFlight = true}} 
      mainAppCallShowHeader={() => {
        localPageState.duduFlight = false}}
     />
  {/if}

  {#if pageState.pageIndex == pageIndexes.LANDING_PAGE}
      <Landing 
        pageProps={{
          loadingAnimationStart: () => {localPageState.loading = true},
          loadingAnimationEnd: () => {localPageState.loading = false},
        }}/> 
  {/if}

  <UIOverlays {localPageState} assignToLocalPageState={(data: Partial<LocalPageState>)=>localPageState.assignToState(data)}/>


  <DebugTools testSuccess={() => {localPageState.success = true}}/>


 <style>
  .contentwrapper
  {
    box-sizing: border-box;
    width: 100%;
    padding-top: 15vh;
    padding-top: 15svh;
  }
  .contentwrapper-fullscreen
  {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }


</style>
