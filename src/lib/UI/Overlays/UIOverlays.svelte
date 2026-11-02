<script lang="ts">
    import { menuOpenState } from "../../State/MenuOpener.svelte";
    import QRScanner from "../../QRScanner/QRScanner.svelte";
    import Success from "./Success.svelte";
    import DXAnimation from "../DXAnimation.svelte";
    
    import { tick } from 'svelte'
    
    let {
        localPageState,
        assignToLocalPageState
    } = $props();

    async function animateSuccess (): Promise<void> {
        const durationMs = 900

        if(localPageState.successIsAnimating)
        {
            // already animating, nothing more to do
            return;
        }

        assignToLocalPageState({
          success: true,
          successIsAnimating: true,
        })


        // returns after durationMs passed
        await new Promise((resolve) => setTimeout(resolve, durationMs));
    }

</script>

  {#if localPageState.scan}
    <QRScanner 
      mainAppScanSuccess={animateSuccess} 
      mainAppCloseScannerState={() => {

        assignToLocalPageState({
          scan: false,
        })
        menuOpenState.backButtonMode = false
      }} 
      resetQrReaderFromOrientationChange={() => {
        localPageState.scan = false; 
        tick().then(() => {
          assignToLocalPageState({
            scan: true,
          })
        });
      }}
      setBackButton={() => {
        menuOpenState.backButtonMode = true;
        menuOpenState.backButtonCallback= () => {
          assignToLocalPageState({
            scan: false,
          })
        }      
    }} />
  {/if}
  {#if localPageState.success}
    <Success close={() => {
      assignToLocalPageState({
        success: false,
        successIsAnimating: false,
      })
    }}/>
  {/if}
  {#if localPageState.loading}
      <DXAnimation />
  {/if}