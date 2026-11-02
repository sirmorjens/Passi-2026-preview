<script lang="ts">
	let { symbolsrc, symbolalt, selected } = $props(); 

	const select = (id: number) => {
		if (selected.id == id) return;

		selected.set(id);
	}
</script>
	<div class="customizationRow">
		<div class="symbol">
			<img src={symbolsrc} alt={symbolalt} />
		</div>

		<div class="choices">
			<div class="choice" class:selected={selected.id == 0}>
				<button onclick={() => select(0)}>
					
				</button>
			</div>
			<div class="choice" class:selected={selected.id == 1}>
				<button onclick={() => select(1)}>
					
				</button>
			</div>
			<div class="choice" class:selected={selected.id == 2}>
				<button onclick={() => select(2)}>
					
				</button>
			</div>
			<div class="choice" class:selected={selected.id == 3}>
				<button onclick={() => select(3)}>
					
				</button>
			</div>
			<div class="choice" class:selected={selected.id == 4}>
				<button onclick={() => select(4)}>
					
				</button>
			</div>
			<div class="choice" class:selected={selected.id == 5}>
				<button onclick={() => select(5)}>
					
				</button>
			</div>

		</div>

	</div>


<style>
	.customizationRow
	{
		display: flex;
		flex-direction: row;
		margin: 0;
		padding: 0;
		margin-bottom: 0.7rem;
		margin-top: 0.7rem;
	}

	.symbol {
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 0.5rem;
		margin: 0;
		padding:0;
		margin-right: 0.9rem;
		box-sizing: border-box;
		user-select: none;
	}
	.symbol img {
		padding: 0;
		margin:0;
		height: 2rem;
	}

	div.choices {
		display: flex;
		flex-direction: row;
	}

	div.choices div.choice
	{	
		width: 2.2rem;
		height: 2.2rem;
		border: 1px solid var(--dnxpBlue);
		border: 1px solid color-mix(in srgb, var(--dnxpBlue) 40%, #00000000);
		border-radius: 0.5rem;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		margin-left: 0.3rem;
		user-select: none;
		pointer-events: auto;
	}

	div.choices div.choice.selected 
	{
		border: 1px solid var(--dnxpYellow);
	}

	div.choices div.choice button {
		margin: 0;
		padding: 0;
		height: 100%;
		width: 100%;
		border: none;
	}
	
</style>