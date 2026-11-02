<script lang="ts">
	import Toc from '../Util/Toc.svelte'
    import { LinkDealer } from '../Util/LinkDealer.svelte';
    import { AppState } from '../State/AppState.svelte'
    import LangSelectButton from '../UI/LangSelectButton.svelte';

	const close = () => {displayPrivacyPolicy = false;}
	let displayPrivacyPolicy = $state(false);
</script>

	<svelte:head>
	    <title>Info - DuuniExpo 2026</title>
	</svelte:head>
	<div class="cw_fullscreen">

		<div class="spacer"></div>

		<div class="cw_content">
			{#if AppState.lang == 'fi'}
				<h1>Tervetuloa<br />DuuniExpo Passiin</h1>
				<div class="paragraph">
					<p>
						<b>DuuniExpo Passi</b> on kokeilu kehittää DuuniExpon digitaalista kävijäkokemusta vuodelle 2026. Se on kehitetty tapahtumaa varten opiskelijavoimin syksyllä 2025.
					</p>

					<p>
						Voit antaa palautetta myös DuuniExpo Passista vastaamalla <a href="/feedback" {@attach LinkDealer()}>palautekyselyyn</a>.
						DuuniExpo 2026 -tapahtuman infosisällöt löytyvät <a href="https://duuniexpo.eu/kavijoille/">DuuniExpon kotisivulta</a>.  
					</p>
					<p>
						<a href="javascript:void(0);" onclick={() => {displayPrivacyPolicy = true;}}>Tietosuojaseloste</a>.
					</p>

				</div>
			{/if}	

			{#if AppState.lang == 'en'}
				<h1>Welcome to<br />DuuniExpo Passi</h1>
				<div class="paragraph">
					<p>
						<b>DuuniExpo Passi</b> is an experiment on digitally enhancing 
						visitor experience at DuuniExpo 2026. It's developed for the event by students during late 2025.
					</p>

					<p>
						Got feedback? You can let us know your thoughts by taking our <a href="/feedback" {@attach LinkDealer()}>feedback survey</a>.
						All information about the event is found at <a href="https://duuniexpo.eu/kavijoille/">DuuniExpo webpage</a>.  
					</p>
					<p>
						<a href="javascript:void(0);" onclick={() => {displayPrivacyPolicy = true;}}>Privacy policy</a>.
					</p>
				</div>
			{/if}	

			<section>
				<LangSelectButton />
			</section>
		</div>

	</div>

	<Toc {displayPrivacyPolicy} {close} />
<style>
	div.cw_fullscreen {
		position: absolute;
		top: 0;
		left: 0;
		width:100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index:10;
		overflow: hidden;
		margin: 0;
		padding: 0;
		background: #00000000;
	}
	div.cw_content {
		margin: 0;
		padding: 0;
		width: 100%;
		width: min(500px, 100%);
		height: 100%;
		background: #00000000;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		overflow: hidden;
		overflow-y: auto;

	}
	div.cw_content {
		background: url('/app/DNXP_passi_background.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 30% bottom;
	}
	.cw_content h1 {
		text-align: left;
	}
	div.spacer {
		margin: 0;
		padding:0;
		box-sizing: border-box;
		width: 30%;
		height: 15vh;
		height: 15svh;
		flex: 0 0 15vh;
	}
	div.littlespacer {
		margin: 0;
		padding:0;
		box-sizing: border-box;
		width: 30%;
		height: 3rem;
		flex: 0 0 3rem;
	}
    div.paragraph {
    	width: 70%;
    	display: flex;
    	flex-direction: column;
    	align-items: center;

    }
    div.paragraph p {
    	font-family: 'Roboto Mono Variable', monospace;
    	font-weight: 400;
    	text-align: left;
    	font-size: 1rem;
    	line-height: 2rem;
    	text-wrap: balance;
    }

	section
	{
		width: 90%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}



</style>