  <script lang="ts">
  import { onMount } from "svelte"
  import QrScanner from 'qr-scanner'; 
  import { AppState } from '../State/AppState.svelte'
  import fallback_img from '/qr-code_fallback.svg' 
  import { Api } from '../Api/Api'
  import { TrophyQR } from '../State/TrophyState.svelte'
  import { PinInput } from 'melt/builders'


  // we can import it lazily as well
  //let QrScanner; // we'll import this later

  // import success ja niin päin pois
  // en enää muista mitä tää tarkoittaa

  let fallback = $state(false), 
  displayCamera = $state(true), 
  visible = $state(false),
  fallbackInputDisabled = $state(false);
  
  const pinInput = new PinInput({
    maxLength: 6,
    onComplete: async () => {
      fallbackInputDisabled = true;

      if (await TrophyQR({pin: pinInput.value})) await mainAppScanSuccess();
      closeQrScanner();
    },
  });

  // props
  let {
    mainAppScanSuccess = () => console.log("Callback missing"),
    mainAppCloseScannerState = () => console.log("Callback missing"),
    resetQrReaderFromOrientationChange = () => console.log("Callback missing"),
    setBackButton = () => {throw "Callback is missing, valoja paalle!!!"}
  } = $props();
  
  // svelte-ignore non_reactive_update
  let qrScan: QrScanner | null, videoEl: HTMLVideoElement, qrReaderElement: HTMLElement;

  const closeQrScanner = () => {
  // destroys scanner, calls main app to close scanner
    if(qrScan)
    {
      qrScan.stop();
      qrScan.destroy();
      qrScan = null;
    }
    mainAppCloseScannerState();
  }

  onMount(() => {
    qrScan = new QrScanner(
      videoEl, /* video element */ 
      async (QRresult) => { /* callback when scan successful */ 
        if(await TrophyQR({qr: QRresult})) {
      
          await mainAppScanSuccess();
      
          closeQrScanner();
          return;
        } 
        
        console.log("DISPLAY not found error")
      },
      {
      onDecodeError: error => { 
        /* callback when error, idk what kind of error that is*/ 
        /**/
      },
      
        returnDetailedScanResult: true,
        highlightScanRegion: true,  
        highlightCodeOutline: true,
      }
    );

    QrScanner.hasCamera();
    
    qrScan.start().then(() => {

      if(!qrScan || !qrScan.$video.srcObject)
      {
        throw "Src object is where? Where?!"
      }
      // once scanner running, apply some constraints
      // autofocus needed for iphone
      
      (qrScan.$video.srcObject as MediaStream).getTracks().forEach((track: MediaStreamTrack) => { 

        if("mediaDevices" in navigator)
        {
          navigator.mediaDevices.getSupportedConstraints()
        }

        const constraints = track.getConstraints();


        track.applyConstraints({
          // @ts-expect-error
          focusMode: 'continuous',
          ...constraints,
        } satisfies MediaTrackConstraints)
      });

      // change the hamburger to back button
      setBackButton();

      qrScan.$overlay!.querySelector("svg")!.style.stroke = "#FF5631"
    
      visible = true; // class used by element 
    })
    .catch((e) => {
      // fallback
        setBackButton();
        displayCamera = false;
        fallback = true;
        visible = true;
        // handle error
    });

  const orientationChange = (event: Event) => 
  { 
    resetQrReaderFromOrientationChange(); 
    // callback to main app
    // close and reopen qr reader when orientation changes
    // because it will fuck up the UI
  }


  screen.orientation.addEventListener("change", orientationChange);

  // this is ran when the component unmounts, such as disabling qr reader from main app
  return () => {
    screen.orientation.removeEventListener("change", orientationChange);
    closeQrScanner();
  };
})
</script>

<div bind:this={qrReaderElement} class="scanC" class:show={visible}>

  {#if displayCamera}
    <!-- svelte-ignore a11y_media_has_caption -->
    <video bind:this={videoEl} class="villeW"></video>
    <div class="scanregion"></div>
  {/if}

  {#if fallback}
    <div class="fallback">
      <div class="fbsymbol">
        <img class="fallbacksymbol" src="qr-code_fallback.svg" alt={AppState.lang == "fi" ? "Merkkijono QR-koodin alla" : "String of letters under the QR-code"} />
      </div>
      <div class="closebtn">
        <button onclick={closeQrScanner}>X</button>
      </div>
      <div class="fbmessage">
        <div class="msg">
          <h2>Anna kuusikirjaiminen koodi</h2>
        </div>
      </div>

      <div class="fallbackinput">      
        <div class="pininput" {...pinInput.root} >
          {#each pinInput.inputs as input}
            <input {...input} disabled={fallbackInputDisabled} />
          {/each}
        </div>
        <!--<input type="text" bind:value={code} size=6 maxlength=6 placeholder="" {@attach focus} />-->
        <!--<button onclick={() => {console.log(code);scanSuccess();closeQrScanner()}}>Jatka</button>-->
      </div>

    </div>
  {/if}

</div>  



<style>
.fallbackinput {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
}
.fallback input, .fallback button
{
  display: block;
  margin: 0.5rem;
  padding: 0.5rem;
  background: #000000a0;
  border: 1px solid #ffffff20;
  color: #fff;
  font-size: 1em;
  border-radius: 10px;
  text-align: center;
  height: 3.4rem;
  flex: 1;
}
.fallback input
{
  flex: 1;

}
.fallback input
{
  font-weight: bold;
  font-size: 1rem;
  box-sizing: border-box;
  text-align: center;
  text-transform: uppercase;
  outline: none;
}
.pininput {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

}
.pininput input {
  display: block;
  flex: 1;
  text-align: center;
  padding: 0;
  margin: 0;
  line-height: 1rem;
  font-size: 16px;
  width: 1rem;
  color: #fDfb8a;
  font-family: 'Roboto Mono Variable', monospace;
}
.pininput input::placeholder {
  font-size: 16px;
  color: #fDfb8a;
}
.fbsymbol {
  flex:1;
}
.fallbacksymbol {
  height: 6rem;
}
div.closebtn {
  position: absolute;
  top: 5px;
  right: 5px;

  color: #aaaaaa;
  padding: 0.1rem;
  margin: 0;
}
div.closebtn button {
  margin: 0;
  padding: 0.3rem;
  padding-top: 0;
  padding-bottom: 0;
  height: 1.5rem;
  border-radius: 0.3rem;
  font-size: 0.9rem;
  color: #eaeaea;
  text-align: center;
  aspect-ratio: 1/1;
}

.fbmessage {
  width: 100%;
  width: min(100%,280px);
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  background: #000000aa;
  border-radius: 0.7rem;
}

.fbmessage h2 {
  font-size: 1.15rem;
  color: var(--dnxpOrange);
  text-align: center;
  margin: 0.3rem;
  padding:0;
  margin-bottom: 0.2rem;
}

.fbmessage div {
  flex: 1;
  margin: 0;
  padding: 0;
}
.fbmessage .msg {
  flex: 3;
  margin: 0;
  padding: 0;
  margin-bottom: 0.8rem;
}
.scanC {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100vw;
  width: 100svw;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  opacity: 0%;
  transition: opacity 1s;
  background: #000000bb;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.fallback {
  width: 100%;
  width: min(100%, 280px);
  margin: 0;
  padding: 0;
  padding-bottom: 1rem;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 0.6rem;
  box-sizing: border-box;
  border: 1px solid #aaaaaa10;
  background: #000000;
  box-shadow: 0px 0px 24px #ffffff10;

  position: relative;
}

div.show {
  opacity: 100%;
}

.villeW{
  margin: 0;
  padding: 0; 
  flex: 0 0;
  width: 90%;
  border-radius:10px;
}

</style>