<script lang="ts">
	import {l, type LocalizationItems} from '../Util/DnxpLocalization.js'

	import symbol_search from "/icons/symbol_search.svg"
	import symbol_x from '/icons/symbol_x.svg'

	let { search = $bindable("") } = $props();

	const localization: LocalizationItems = {
        pageName: "search",
        localization: {
            "Etsi": "Search",
        }
	};</script>
			<div class="search">
				<span><input placeholder={l("Etsi", localization)} bind:value={search} class:highlight={search.length != 0}/><button onclick={() => {console.log("Reset", search);search = "";}}><img src={search.length == 0 ? symbol_search : symbol_x} alt="" /></button></span>
			</div>
<style>
	.search {
		position: sticky;
		top: 15vh;
		left: 0;
		z-index: 10;
        width: 80%;
        width: min(500px, 80%);
	}
	input {
		font-family: 'DM Sans Variable', system-ui, Avenir, Helvetica, Arial, sans-serif;
	  	line-height: 1.6;
		font-weight: 800;
	  	font-size: 18px;
	}
	input::placeholder {
		color: #808080;
	}
	.search input {
		border-radius: 1.1rem;
		font-size: 17px;
		box-sizing: border-box;
		width: 100%;
		outline: none;
		border: 1px solid #aaaaaa50;
		background: #000000d0;
		z-index: 10;
		margin: 0;
		padding: 0.5rem;
		padding-left: 3.5rem;
		line-height: 1.8rem;
		color: #ffffff;
		font-weight: 300;
	}
	.search button {
		position: absolute;
		top: 0.4rem;
		left: 0.5rem;
		border-radius: 0.8rem;
		padding: 0;
		margin: 0;
		padding: 0.2rem;
		height: 2.2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		border: none;
		user-select: none;
		outline: none;
	}
	.search button img {
		height: 100%;
	}

	.search input.highlight {
		border: 1px solid color-mix(in srgb, var(--dnxpYellow) 50%, transparent);
	}
</style>