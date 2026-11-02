<script lang="ts">  
    import { fade } from 'svelte/transition'
    import { onMount } from 'svelte'
    import { AppState } from '../State/AppState.svelte'
    let { fullScreen = false } = $props();

</script>
 
<div out:fade={{duration: 1200}} class="animLayer" class:fullScreen={fullScreen}>
    <div class="animContainer">
        <p>{AppState.lang == 'fi' ? "Inpiroidu." : "Get inspired."}</p>
        <p>{AppState.lang == 'fi' ? "Verkostoidu." : "Network."}</p>
        <p>{AppState.lang == 'fi' ? "Menesty." : "Succeed."}</p>
    </div>  
</div>


<style>
.animLayer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0%;
    left: 0%;
    pointer-events: none;
    user-select: none;    
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #000e;

    z-index: 105;
}
.loading {
    margin: 0;
    margin-top: 2rem;
    color: #ffffff78;
    display: flex;
    flex-direction: row;
    width: 70%;
    width: min(70%, 380px);
    align-items: center;
    justify-content: center;
}
.loading p {
    flex: 1;
    font-family: 'Roboto Mono Variable', monospace;
    font-size: 0.9rem;
    letter-spacing: 0.1rem;
    margin: 0;
    margin-right: 1rem;
}
.loading .loadingcontainer
{
    flex: 4;
    height: 1rem;
    border: 1px solid #ffffff78;
    border-radius: 0.2rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.loadingcontainer .loadingbar {
    height: 70%;
    margin: 0;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
    background: #ffffff78;
}
.fullScreen {
    width: 100vw;
    height: 100vh;
    width: 100svw;
    height: 100svh;
}
.animContainer p {
  font-weight: 600;
  line-height: 0.4em;
  font-size: 2.6rem;
  pointer-events: auto;
}


.animContainer p:nth-child(odd){
    animation: textAnim 5.5s infinite both 0.3s cubic-bezier(.63,.21,.3,1.05);
}
.animContainer p:nth-child(even){
    animation: textAnim 5.5s infinite both 0.6s cubic-bezier(.63,.21,.3,1.05);
}
.animContainer p:nth-child(3){
    animation: textAnim 5.5s infinite both 0.9s cubic-bezier(.63,.21,.3,1.05);
}
   
@keyframes textAnim
{
    0% {transform: translate(100%, 0);opacity: 0;}

    25%, 75% {transform: translate(0, 0);opacity: 1;}

    100% {transform: translate(-100%, 0);opacity: 0;}


}

</style>