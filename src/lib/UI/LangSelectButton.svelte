<script lang="ts">
    import { AppState } from "../State/AppState.svelte";

    const langSelect = () => {
    	AppState.lang = AppState.lang == 'fi' ? 'en' : 'fi';
    }

</script>
<div class="langselect">
    <button onclick={langSelect} aria-label="Select language">
        <p class:selected={AppState.lang == 'fi'}><img src="/app/lang/FI.svg" alt="fi" height="1rem" /> Suomeksi</p>
        <p class:selected={AppState.lang == 'en'}><img src="/app/lang/EN.svg" alt="fi" height="1rem" /> In English</p>
    </button>
</div>

<style>


   	.langselect {
		display: flex;
		justify-content: center;
		width: 100%;
		margin: 0;
		padding: 0;
	}
	.langselect button {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: flex-end;
		padding: 0.5rem;
		margin: 0;
		box-sizing: border-box;
		width: 100%;
		margin-top: 1.5rem;
		margin-bottom: 1.4rem;
        border: none;
        outline: none;
	}
	.langselect button:active {
		box-shadow: none;
	}
	.langselect button p {
		margin: 0;
		padding: 0.6rem;
        border-radius: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
		color: #aaaaaa;
		font-weight: 200;
        box-sizing: border-box;

        border: 1px solid #ffffff40;
    }

    .langselect button p img {
		height: 1rem;
		margin: 0;
		padding: 0;
		margin-right: 0.4rem;
		border-radius: 50%;
	}

	.langselect button p.selected {
		font-weight: 900;
		color: #fDfb8a;
	} 
</style>