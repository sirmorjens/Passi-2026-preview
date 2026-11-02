<script lang="ts">
    import { l, type LocalizationItems } from "../Util/DnxpLocalization";
    let { assignToLocalPageState } = $props();

    const localization: LocalizationItems = {
      pageName: "Scanner btn",
      localization: {
        "Skannaa" : "Scan",
      }
    }
</script>

<div class="scanbtn">
    <div>
    <button 
        class="scanbutton"
        onclick={() => {
            assignToLocalPageState({scan: true,});
        }}>

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 24 24">
                <path fill="currentColor" d="M13 18h3a2 2 0 0 0 2-2v-3a1 1 0 0 1 2 0v3a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-3a1 1 0 0 1 2 0v3a2 2 0 0 0 2 2h3a1 1 0 0 1 0 2h6a1 1 0 0 1 0-2M2 7a1 1 0 1 1-2 0V4a4 4 0 0 1 4-4h3a1 1 0 1 1 0 2H4a2 2 0 0 0-2 2zm16 0V4a2 2 0 0 0-2-2h-3a1 1 0 0 1 0-2h3a4 4 0 0 1 4 4v3a1 1 0 0 1-2 0"/>
            </svg>
            {l("Skannaa", localization)} 
    </button>
    </div>
</div>

<style>
    .scanbutton {

        pointer-events: auto;
        background: var(--dnxpOrange);
    }
  button.scanbutton {
    pointer-events: auto;
  }

  button.scanbutton {
    font-size: 1rem;
  }
  button.scanbutton svg {
    display: inline;
    vertical-align: middle;
    height: 2.1rem;
    margin-top: -0.1rem;
    margin-right: 0.35rem;
  }

  div.scanbtn {
    position: absolute;
    bottom: 2rem;
    left: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 15svh;

    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
    
</style>