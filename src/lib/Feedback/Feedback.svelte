<script lang="ts">
	import { AppState } from '../State/AppState.svelte'
	import { Api } from '../Api/Api'
	import { l, type LocalizationItems } from '../Util/DnxpLocalization'
	import { fade } from 'svelte/transition'
	import { AddFeedbackMark } from '../State/TrophyState.svelte'
	import { SetRouter, ExecuteRouter } from '../Routes/Router.svelte'
	import FeedbackQuestion from './FeedbackQuestion.svelte'

	import { DuduQState, DuduAnswers, StoreAnswers, DuduQStateLoadAnswers, clearAnswers } from '../DuuniDudu/DuduDialogueQuestions.svelte'
    
	const localization: LocalizationItems = {
        pageName: "feedback",
        localization: {
            "Palaute - DuuniExpo 2026": "Feedback - DuuniExpo 2026",
            "DuuniExpon 2026 palautekysely": "Feedback survey for DuuniExpo 2026"
        },
    }

	let { pageProps } = $props();

    let allFields = $derived.by(() => DuduQState.questions.filter(q => q.required).every(q => q.qId in DuduAnswers && (!DuduAnswers[q.qId].checkboxes || Object.values(DuduAnswers[q.qId].checkboxes).some(v => v) ) ))

    let posted = false;

    const postAnswers = async () => {
    	if (posted) return;
    	const allAnswers = DuduQState.questions.filter(q => q.required).every(q => q.qId in DuduAnswers && (!DuduAnswers[q.qId].checkboxes || Object.values(DuduAnswers[q.qId].checkboxes).some(v => v) ) )

    	if(!allAnswers) {
    		return;
    	}


    	StoreAnswers();
    	posted = true;
    	const response = await Api.SurveyAnswer(DuduAnswers);

    	if(response.ok == 'ok')
    	{
    		DuduAnswers.feedbackSubmitted = true;
    		StoreAnswers();
    		AddFeedbackMark();
    	}


    }

    const submitAnswer = (valueObj: object, qId: number) => {
    	if (!DuduAnswers[qId]) DuduAnswers[qId] = {};

    	if(valueObj.checkboxId)
    	{
    		if (!DuduAnswers[qId].checkboxes) DuduAnswers[qId].checkboxes = {};
    	}

    	if(valueObj.choiceValue) DuduAnswers[qId].choiceValue = valueObj.choiceValue;
    	if(valueObj.textValue || valueObj.textValue == "") DuduAnswers[qId].textValue = valueObj.textValue;
    	if(valueObj.checkboxId) DuduAnswers[qId].checkboxes[valueObj.checkboxId] = valueObj.value
    }

	DuduQStateLoadAnswers();

</script>
	<svelte:head>
    	<title>{l("Palaute - DuuniExpo 2026", localization)}</title>
	</svelte:head>	
	<div class="contsa">
		<div>
			<div class="feedbackContent">

			<h1>{l("DuuniExpon 2026 palautekysely", localization)}</h1>
				{#if DuduAnswers.feedbackSubmitted}
					{#if AppState.lang == 'fi'}
					<p class="intro done">
						Kiitos vastauksestasi.
					</p>
					<p class="intro done signature">DuuniExpo 2026 järjestäjät</p>
					{:else}
					<p class="intro done">	
						Thank you for your feedback.
					</p>
					<p class="intro done signature">DuuniExpo 2026 organizers</p>
					{/if}

					<div class="linkbutton">
						{#if document.referrer == "https://duuniexpo.eu/"}
						<button onclick={() => { location.replace("https://duuniexpo.eu") }}>Takaisin</button>	
						{:else}
						<button onclick={() => {SetRouter("/");ExecuteRouter();}}>Takaisin</button>
						{/if}
					</div>
				{/if}
				{#if !DuduAnswers.feedbackSubmitted}

					{#if AppState.lang == 'fi'}
					<p class="intro">
						Kiitos kaikille DuuniExpo 2026 kävijöille. Tämän kyselyn avulla haluamme selvittää mitä pidit tapahtumasta. Tämän lisäksi haluamme ymmärtää tapahtumamme kohderyhmiä ja parantaa asiakaskokemusta. Kyselyn aiheina ovat muun muassa ohjelma, markkinointi ja yleinen tunnelma.
					</p>
					<p class="intro">Kaikki vastaukset ovat anonyymejä.</p>
					{:else}
					<p class="intro">	
						Thank you to everyone who attended DuuniExpo 2026. With this survey, we want to find out what you thought of the event. In addition, we aim to better understand our target audiences and improve the customer experience. The survey topics include questions about the program, marketing, and the overall atmosphere.
					</p>
					<p class="intro">All responses are anonymous.</p>
					{/if}

					{#each DuduQState.questions.filter(q => !q.duduExclusive) as question, index}
							
						<div class="dnxpspacer"></div>

						<FeedbackQuestion {index} {question} currentAnswers={DuduAnswers[question.qId] ? DuduAnswers[question.qId] : {}} {submitAnswer} />
						
						{#each question.choices as choice}

							{#if choice.subQuestion && DuduAnswers[question.qId] && (DuduAnswers[question.qId].choiceValue == choice.value || DuduAnswers[question.qId].checkboxes && DuduAnswers[question.qId].checkboxes[choice.value])}
						
								<FeedbackQuestion {index} currentAnswers={DuduAnswers[choice.subQuestion.qId] ? DuduAnswers[choice.subQuestion.qId] : {}} question={choice.subQuestion} {submitAnswer} />


								{#each choice.subQuestion.choices as subchoice}
									
									{#if subchoice.subQuestion && DuduAnswers[choice.subQuestion.qId] && (DuduAnswers[choice.subQuestion.qId].choiceValue == subchoice.value || DuduAnswers[choice.subQuestion.qId].checkboxes && DuduAnswers[choice.subQuestion.qId].checkboxes[choice.value])}
										<FeedbackQuestion {index} depth={3} currentAnswers={DuduAnswers[subchoice.subQuestion.qId] ? DuduAnswers[subchoice.subQuestion.qId] : {}} question={subchoice.subQuestion} {submitAnswer} />
									{/if}	

								{/each}

							{/if}
						{/each}
							
						



					{/each}
				{/if}
			</div>
			
		</div>

		{#if !DuduAnswers.feedbackSubmitted}
			{#if !allFields}
				<div class="requiredFields" transition:fade>
					<p>Vastaa tähdellä (<span>*</span>) merkittyihin kysymyksiin ennen lähettämistä.</p>
				</div>
			{/if}
			<div class="buttons">

				<button class="send" disabled={!allFields} onclick={() => postAnswers()}>Lähetä</button>
				<button class="empty" onclick={() => clearAnswers()}>Tyhjennä</button>
			</div>
		{/if}
		<div class="spacer"></div>
</div>
<style>

	div.contsa div.requiredFields {
		width: 100%;
		width: min(400px, 100%);
		display: flex;
		margin: 0;
		padding: 0;
		margin-top: 1.5rem;
		margin-bottom: 0.0rem;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	div.contsa div.requiredFields p 
	{
		margin: 0;
	}
	div.contsa div.requiredFields span 
	{
		color: var(--dnxpOrange);
		font-weight: 900;
	}
	div.contsa div.buttons {
		width: 100%;
		width: min(400px, 100%);
		display: flex;
		margin: 0;
		padding: 0;
		margin-top: 2rem;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	button.send {
		background: var(--dnxpYellow);
		color: black;
		font-weight: 900;
		border: 1px solid #ffffff60;
		width: 25%;
	}
	button.send:disabled {
		background: #23232320;
		color: black;
		font-weight: 900;
		color: #676767;
		border: 1px solid #ffffff20;
		width: 25%;
	}
	button.empty {
		border: 1px solid #ffffff90;
		background: none;
		font-weight: 300;
		width: 25%;
	}

	.spacer {
		width: 100%;
		height: 15vh;
	}
	h1 {
		font-size: 1.6rem;
		text-align: center;
		align-self: center;
	}
	h2 {
		text-align: left;
	}
	h2 span {
		font-family: 'Roboto Mono Variable', monospace;
		font-size: 0.9rem;
	}
	div.contsa {
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

	}
	div.contsa div {
		width: 80%;
		width: min(400px, 80%);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

	}
	div.contsa div.feedbackContent {
		width: 100%;

	}

	div.contsa div.dnxpspacer {
		height: 0.5rem;
		align-self: center;
		width: 100%;
		width: min(400px, 100%);
		margin: 0;
		padding: 0;
		margin-top: 1rem;

		background-image: url('/images/dnxp_gradient_hd.jpg');
		background-size: 100%;
        border-radius: 1rem;
	}

	p.intro {
		text-align: left;
		color: #bfbfbf;
	}

	div.contsa div.feedbackContent p.intro.done
	{
		align-self: center;
		text-align: center;
		font-size: 1.4rem;
		margin: 0;
		margin-top: 2rem;
		color: var(--dnxpYellow);
	}
	div.contsa div.feedbackContent p.intro.done.signature
	{
		margin: 0;
		font-style: italic;
		color: #aaaaaa;
		margin-top: 1rem;
		font-size: 0.9rem;
	}
	div.contsa div.feedbackContent div.linkbutton {
		margin-top: 1.2rem;
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>