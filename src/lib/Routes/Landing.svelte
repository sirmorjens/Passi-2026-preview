<script lang="ts">
    import { Toggle } from "melt/builders";
    import { ExecuteRouter } from './Router.svelte'
    import DNXPLogo from '../UI/DNXPLogo.svelte'
    import { AppState } from '../State/AppState.svelte'
    import Toc from '../Util/Toc.svelte'
	import LangSelectButton from "../UI/LangSelectButton.svelte";


    let { pageProps } = $props();

    const landingSubmit = () => {
    	AppState.signIn(
    		{
	    		start: pageProps.loadingAnimationStart, 
	    		stop: pageProps.loadingAnimationEnd,
	    	},
	    	{
				active: true,
				pc: toctoggle.value,
				cc: cctoggle.value,
			},
			() => {ExecuteRouter();},
    	)

    	
    }
	const close = () => {displayPrivacyPolicy = false;}
    let displayPrivacyPolicy = $state(false);

    const toctoggle = new Toggle({});
    const cctoggle = new Toggle({});
</script>

<div id="landing_fs">
	<div class="landingcontent">
		<div class="image">
			<DNXPLogo height={140} />
		</div>

		<section>
			<LangSelectButton />
		</section>

		<section>
			<div class="consentbox">
				<label>
					<button {...toctoggle.trigger} aria-label="Toggle consent to terms of service" class="consentbutton">
					    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="1.7rem">
						  <line x1="50" y1="50" x2="206" y2="206" stroke-width=15 stroke={toctoggle.value ? "none" : "#ffffff"}/>
						  <line x1="50" y1="206" x2="206" y2="50" stroke-width=15 stroke={toctoggle.value ? "none" : "#ffffff"}/>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" width="1.7rem" viewBox="0 0 256 256" fill="none" style:scale={toctoggle.value ? 1 : 0} class:shadow={toctoggle.value}>
						  <line x1="30" y1="110" x2="120" y2="200" stroke-width=15 stroke=#fDfb8a/>
						  <line x1="120" y1="200" x2="226" y2="50" stroke-width=15 stroke=#fDfb8a/>
						</svg>

					</button>

					{#if AppState.lang == 'fi'}
						<p>Hyväksyn välttämättömien evästeiden käytön. <a href="#" onclick={()=> {displayPrivacyPolicy = true;}}>Tietosuojaseloste</a>.</p>
					{:else}
						<p>I accept essential cookies. <a href="#" onclick={()=> {displayPrivacyPolicy = true;}}>Privacy policy</a>.</p>
					{/if}
				</label>
			</div>

			<div class="consentbox">
				<label>
					<button {...cctoggle.trigger} aria-label="toggle consent to privacy policy" class="consentbutton">
					    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="1.7rem">
						  <line x1="50" y1="50" x2="206" y2="206" stroke-width=15 stroke={cctoggle.value ? "none" : "#ffffff"}/>
						  <line x1="50" y1="206" x2="206" y2="50" stroke-width=15 stroke={cctoggle.value ? "none" : "#ffffff"}/>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" width="1.7rem" viewBox="0 0 256 256" fill="none" style:scale={cctoggle.value ? 1 : 0} class:shadow={cctoggle.value}>
						  <line x1="30" y1="110" x2="120" y2="200" stroke-width=15 stroke=#fDfb8a/>
						  <line x1="120" y1="200" x2="226" y2="50" stroke-width=15 stroke=#fDfb8a/>
						</svg>

					</button>
					{#if AppState.lang == 'fi'}	
						<p>Annan luvan jakaa anonyymejä tulostietoja DuuniExpo Passin käytöstä.</p>
					{:else}
						<p>I consent to sharing anonymous trophy scores from my use of DuuniExpo Passi.</p>
					{/if}
				</label>
			</div>
		</section>
		<button disabled={!toctoggle.value} onclick={landingSubmit}>{AppState.lang == 'fi' ? "Jatka" : "Ok"}</button>
	</div>
</div>

<Toc {displayPrivacyPolicy} {close} />


<style>
	#landing_fs {
		width: 100%;
		height: 100%;
	
		overflow: hidden;
		overflow-y: auto;

		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
	
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background: #000000ee;

		padding: 0;
		margin: 0;
		z-index: 100;
	}




	.landingcontent
	{
		flex: 0 0 400px;
		flex: 0 0 min(400px, 90%);

		display: flex;
		flex-direction: column;
	}

	.landingcontent h1 {
		font-weight: 900;
	}
	.consentbox label {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		box-sizing: border-box;
	}
	.consentbox label div {
		margin: 0.4rem;
	}
	.consentbox label button {
		flex: 1;
	}
	.consentbox label p {
		flex: 3;
		display: block;
		font-size: 1rem;
		user-select: none;
	}
	section {
		width: 60%;
		width: min(400px, 60%);
		align-self: center;

	}
	section p {
		text-align: left;
		user-select: auto;
		font-size: 1rem;
	}
	
	button {
		align-self: center;
		border: 1px solid #fDfb8a;
		outline: none;
		user-select: none;
	}
	button:disabled {
		background: #111111;
		border: 1px solid #454545;
		color: #565656;
	}
    .consentbutton {
        position: relative;
        /*border: none;*/
        height: 1.9rem;
        width: 1.9rem;
        border: none;
        border-radius: 0.2em;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        background: none;
    }
    .consentbutton:active {
        box-shadow: none;
        transform: none;
    }
    .consentbutton svg {
        position: absolute;
        top: 0.1rem;
        left: 0.1rem;
        transition: scale 0.15s;
    }
    .consentbutton svg.shadow
    {
        filter: drop-shadow(0px 0px 2px #ffffff3a);
    }

</style>