<script lang="ts">
	import { menuOpenState } from '../State/MenuOpener.svelte'
	import { duduState } from '../DuuniDudu/DuduState.svelte'
	import CustomizationRow from './CustomizationRow.svelte'
	import { AppState } from '../State/AppState.svelte'
	let { onOpen, onClose, pokeDudu, localPageState } = $props();
    import { DuduAnswers, StoreAnswers, DuduQState, } from '../DuuniDudu/DuduDialogueQuestions.svelte'
	import { fade } from 'svelte/transition'
	import { Api } from '../Api/Api'

	let open = $state(false)

	let selections = $state({
		antenna: 0,
		torso: 0,
		headwear: 0,
		eyewear: 0,
	})

/*

	color: {
		selected: 0,
		colors: [
			{fs: "#ff66ff", ls: "#594ffe",},
			{fs: "#000000",ls: "#ffffff",},],
	},
	eyecolor: {
		selected: 0,
		colors: ["#3c00be",
			"#000000"],
	},
	antennacolor: {
		selected: 0,
		colors: [
			{fs: "#ff66ff", ls: "#594ffe", stem: "#3c00be"},
			{fs: "#000000",ls: "#ffffff", stem: "#000000"}],
	},

*/	
	const randomComponent = () => {
		return Math.floor((Math.random()*255)).toString(16).padStart(2, '0')
	}

	const reject = () => {
		const states = [duduState.color, duduState.eyecolor, duduState.antennacolor]
		
		states.forEach((state) => {
			state.selected = 0;
		})		
	}

	const getRandomColor = () => {

		return "#" + randomComponent() + randomComponent() + randomComponent()
	}

	const tryOn = () => {
		const states = [duduState.color, duduState.eyecolor, duduState.antennacolor]
		
		states.forEach((state) => {
			state.selected = Math.random() > 0.4 ? 1 : 0;
			
			if(state.colors[1].fs && state.colors[1].ls)
			{
				state.colors[1].fs = getRandomColor();
				state.colors[1].ls = getRandomColor();
			} 
		
			if(state.colors[1].fs && state.colors[1].ls && state.colors[1].stem)
			{
				state.colors[1].fs = getRandomColor();
				state.colors[1].ls = getRandomColor();
				state.colors[1].stem = getRandomColor();
			} 

			if(typeof(state.colors[1]) == 'string' )
			{
				state.colors[1] = getRandomColor();
			}
		})

	}
	const save = () => {
		selectAnimation()

		Api.StoreDuduState(duduState);
	}


	const selectAnimation = () => {
		duduState.store();
		pokeDudu();
	};

</script>
<div class="dc_fswrapper" class:open={open}>
	{#if open}

		<div transition:fade class="dc_content">
		
			<div class="spacer"></div>

			<div class="buttons">
				<div class="fit">
					<div>
						<img src="/app/icons/dudu/dudusymbol.svg" alt="Dudu" />
					</div>
					<div>
						<button class="try" onclick={tryOn}>{AppState.lang == 'fi' ? "Sovita uutta asua" : "Try out a new outfit"}</button>
					</div>
				</div>
				<div>
					<button onclick={save} class="save">{AppState.lang == 'fi' ? "Tallenna" : "Save"}</button>
					<button onclick={reject} class="reject">{AppState.lang == 'fi' ? "Palauta" : "Cancel"}</button>
				</div>
			</div>
			<div class="spacer"></div>

		<div class="duduslot">
				<div class="indicator">
				<div class="duduind" class:disabled={DuduAnswers[999] && DuduAnswers[999].choiceValue == 100}>
				</div>
				<img class="duduAnswer" src="/app/icons/dudu/dudusymbol.svg" alt="Dudu" />
				</div>
				<div class="btn">
					<button onclick={() => {
					if(DuduAnswers[999] && DuduAnswers[999].choiceValue == 100) 
						{
							delete DuduAnswers[999]
							DuduQState.doneAsking = false;
							StoreAnswers();
							return;
						}
					if( !DuduAnswers[999] ) DuduAnswers[999] = {};
					DuduAnswers[999].choiceValue = 100
					StoreAnswers();
					DuduQState.doneAsking = true;
				}}>{DuduAnswers[999] && DuduAnswers[999].choiceValue == 100 ? AppState.lang == 'fi' ? "Palauta Dudu-dialogi" : "Resume Dudu dialogue" : AppState.lang == 'fi' ? "Lopeta Dudu-dialogi" : "Remove Dudu dialogue"} </button>
				</div>
			</div>
		</div>

	{/if}


</div>


<div class="dudubutton">
	<button onclick={()=>{
		if (open) {
			open = false;
			menuOpenState.backButtonMode = false;
			menuOpenState.MenuButtonDown  = false; 
			menuOpenState.backButtonCallback= null;
			onClose();
			return;
		}

		open = true;
		onOpen();
		menuOpenState.backButtonMode = true;
		menuOpenState.MenuButtonDown = true;
		menuOpenState.backButtonCallback= () => {
			open = false;
			localPageState.duduCustomizationOpen = false;
		}
	}}><img src="/app/icons/dudu/dudusymbol.svg" alt="Dudu" /></button>
</div>

<style>
button.save {
	background: var(--dnxpOrange);

	margin-top:1rem;
}
button.try {
	font-size: 1rem;
}
button.reject {
	border: 1px solid #ffffff50;
	color: white;
	background: none;
	margin-top:1rem;
}
.dc_fswrapper {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #000000fa;
	transform-origin: bottom center;
	transform:translate(0, 25%);
	will-change: scale;
	transition: all 0.35s;
	margin: 0;
	padding: 0;
	overflow: hidden;
	opacity: 0;
	pointer-events: none;
}

.dc_fswrapper.open {
	transform: translate(0, 0);
	pointer-events: auto;
	opacity: 1;
}

.dudubutton {
	position: absolute;
	right: 1em;
	bottom: 1em;

}
.spacer {
	height: 4rem;
}
.dudubutton button {
	outline: none;
	padding: 0.6rem;
	margin: 0;
	border: none;
	background: #00000030;
}
.dudubutton button img {
	opacity: 1;
	height: 3.4rem;
}
.fit {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.fit div {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.dc_content {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;
	overflow-y: auto;
	padding-top: 15svh;
	padding-bottom: 20svh;
	box-sizing: border-box;
}
	div.duduslot {
		width: 60%;
		width: min(60%, 380px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 1rem;
	}
	div.duduslot div.indicator div.duduind {
		height: 1rem;
		width: 1rem;
		background: #af2;
		border-radius: 1rem;
		margin-bottom: -0.5rem;
		margin-right: 0.4rem;
	}

	div.duduslot div.indicator div.duduind.disabled {
		background: #f30;
	}
	button img.duduAnswer
	{
		height: 1.6rem;
		margin-bottom: 0rem;
	}

	div.indicator {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
</style>