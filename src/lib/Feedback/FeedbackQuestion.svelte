<script lang="ts">
	import { inputTypes, StoreAnswers } from '../DuuniDudu/DuduDialogueQuestions.svelte'
	import { AppState } from '../State/AppState.svelte'
	let { question, index, submitAnswer, currentAnswers } = $props();
	import { fade } from 'svelte/transition'

	let radioInstance: {
		[choiceValue: number]: HTMLInputElement; 
	} = $state({});

	let checkboxInstance: {
		[choiceValue: number]: HTMLInputElement; 
	} = $state({});

</script>	
	<section transition:fade={{duration: 340,}}>
	<h2>
		<span>{!(question.UIOptions && question.UIOptions.isSQ) ? index+1 + ". " : ""}</span> 
		{#if question.required}
			<span class="required">*</span> 
		{/if}
		{typeof(question.questionTxt) == 'string' ? question.questionTxt : question.questionTxt[AppState.lang]} 
		{#if currentAnswers.duduAnswer}
			<img class="duduAnswer" src="/app/icons/dudu/dudusymbol.svg" alt="Dudu" />
		{/if}
	</h2>

	<ul class:horizontal={question.inputType && question.inputType == inputTypes.RADIO_HORIZONTAL}>
		{#each question.choices as choice}
			<li>
				<label>
					<p class="choices">

						{#if choice.inputType && choice.inputType == inputTypes.RADIO_HORIZONTAL && choice.textAlign && choice.textAlign == inputTypes.LEFT_TEXT} 
							<div class="horizontal_first">
								{choice.text ? typeof(choice.text) == 'string' ? choice.text : choice.text[AppState.lang] : ""}
							</div>
						{/if}

						{#if !choice.inputType || choice.inputType == inputTypes.TEXT_INPUT}
						<input type="radio" checked={currentAnswers.choiceValue && currentAnswers.choiceValue == choice.value } oninput={() => {submitAnswer({choiceValue: choice.value}, question.qId); StoreAnswers();}} bind:this={radioInstance[choice.value]} value={choice.value} name={"radio" + question.qId}>

						{/if}

						{#if choice.inputType == inputTypes.RADIO_HORIZONTAL}
						<div class="horizontal_value">
							<p>{choice.value}</p>
							<input type="radio" checked={currentAnswers.choiceValue && currentAnswers.choiceValue == choice.value } oninput={() => {submitAnswer({choiceValue: choice.value}, question.qId); StoreAnswers();}} bind:this={radioInstance[choice.value]} value={choice.value} name={"radio" + question.qId}>
						</div>
						{/if}


						{#if choice.inputType && (choice.inputType == inputTypes.CHECKBOX_INPUT || choice.inputType == inputTypes.CHECKBOX_INPUT_TEXT)}
							<input type="checkbox" bind:this={checkboxInstance[choice.value]} 
							oninput={(e: Event) => {
								submitAnswer({checkboxId: choice.value, value: (e.target as HTMLInputElement).checked}, question.qId);
								StoreAnswers()}} 
							checked={currentAnswers.checkboxes && currentAnswers.checkboxes[choice.value]} />
						{/if}


						
						{#if choice.inputType && choice.inputType == inputTypes.TEXT_INPUT}

							<input 
								placeholder={typeof(choice.text) == 'string' ? choice.text : choice.text[AppState.lang]}
								oninput={(e: Event) => {
									radioInstance[choice.value].checked = true;
									submitAnswer({
										textValue: (e.target as HTMLInputElement).value,
										choiceValue: choice.value},
										question.qId);
									StoreAnswers()
								}} 
								onchange={(e: Event) => {
									radioInstance[choice.value].checked = true;
									submitAnswer({
										textValue: (e.target as HTMLInputElement).value,
										choiceValue: choice.value},
										question.qId);
										StoreAnswers()
									}} 
								value={currentAnswers.textValue ? currentAnswers.textValue : ""}>

						{/if}

						{#if choice.inputType && choice.inputType == inputTypes.TEXTONLY_INPUT}

							<input 
							placeholder={typeof(choice.text) == 'string' ? choice.text : choice.text[AppState.lang]} 
							oninput={(e: Event) => {
								submitAnswer({
									textValue: (e.target as HTMLInputElement).value,
									choiceValue: choice.value}, question.qId);
									StoreAnswers()
								}}
							onchange={(e: Event) => {
									submitAnswer({textValue: (e.target as HTMLInputElement).value,
									choiceValue: choice.value}, question.qId); StoreAnswers()
								}}
							value={currentAnswers.textValue ? currentAnswers.textValue : ""}>

						{/if}

						{#if choice.inputType && choice.inputType == inputTypes.CHECKBOX_INPUT_TEXT}

							<input 
								placeholder={typeof(choice.text) == 'string' ? choice.text : choice.text[AppState.lang]}
								oninput={(e) => {
									checkboxInstance[choice.value].checked = true;
									submitAnswer({
										textValue: (e.target as HTMLInputElement).value,
										choiceValue: choice.value}, question.qId);
										StoreAnswers()
									}} 
								value={currentAnswers.textValue ? currentAnswers.textValue : ""}>

						{/if}

						{!choice.inputType ||
						choice.inputType == inputTypes.CHECKBOX_INPUT || 
						choice.inputType == inputTypes.RADIO_INPUT ?
						typeof(choice.text) == 'string' ? choice.text : choice.text[AppState.lang] : ""}

						{#if choice.inputType &&
						choice.inputType == inputTypes.RADIO_HORIZONTAL &&
						!choice.textAlign && choice.text} 

							<div class="horizontal_last">
								{choice.text ? typeof(choice.text) == 'string' ? choice.text : choice.text[AppState.lang] : ""}
							</div>

						{/if}
					</p>
				</label>
			</li>	
		{/each}
	</ul>
	</section>
<style>
	ul {
		list-style: none;

	}	
	h1 {
		font-size: 1.6rem;
		text-align: left;
	}
	h2 {
		text-align: left;
		margin: 0;
		margin-top: 2.3rem;
		margin-bottom: 0.7rem;
		color: #ffffff;
		font-weight: 700;
	}
	h2 span {
		font-family: 'Roboto Mono Variable', monospace;
		font-size: 0.9rem;
	}

	h2 img.duduAnswer  {
		height: 1.9rem;
		margin: 0;
		padding: 0;
		margin-bottom: -0.4rem;
	}

	li {
		text-align: left;
	}

	.required {
		color: var(--dnxpOrange);
		font-weight: 900;
	}
	ul.horizontal {
		margin: 0;
		padding: 0;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

	}
	ul.horizontal li 
	{
		margin: 0;
		padding: 0;
		margin-bottom: 1.9rem;

	}
	ul.horizontal p.choices
	{
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-right: 0.4rem;
	}
	ul.horizontal p.choices div.horizontal_value
	{
		margin: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	ul.horizontal p.choices div.horizontal_value p 
	{
		margin: 0;
		padding: 0;
	}


	div.horizontal_first
	{
		text-align: right;
		margin-right: 0.4rem;
		align-self: center;

	}
	div.horizontal_last
	{
		text-align: left;
		margin-left: 0.4rem;
		align-self: center;

	}

	input {
		border-radius: 0.4rem;
		outline: none;
		background: #000;
		color: #fff;
		padding: 0.4rem;
		font-family: 'Roboto Mono Variable', monospace;
		border: 1px solid #ffffff70;
	}
	input::placeholder {
		color: #ffffff90;
		font-family: 'Roboto Mono Variable', monospace;

	}
	section {

	}


</style>