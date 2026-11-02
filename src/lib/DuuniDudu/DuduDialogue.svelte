<script lang="ts">
	import  { onMount } from 'svelte'
	import { AppState } from '../State/AppState.svelte'
	import { Tween } from 'svelte/motion'
	import { SetRouter, ExecuteRouter } from '../Routes/Router.svelte'
	import { DuduQState, DuduQStateStore, DuduAnswers, StoreAnswers, } from './DuduDialogueQuestions.svelte'
	import { Api } from '../Api/Api'
	import { type Attachment } from 'svelte/attachments'
	let done = $state(false)
	let message = $state("")

	const SpecialAnswers = {
		SKIPPED: 150,
		NEVER_BOTHER_AGAIN: 100,
		BADGENOTICE: 2000,
	}

	let { 
		getDuuniDuduPosition = () => {throw "No callback for Duunidudu"}, 
		talk = (): void => {throw "No callback for talk"}, 
		shutUp = (): void => {throw "No callback for shutUp"},
		pokeDudu = (): void => {throw "No callback for poke"},
		submitToStartleEvent = (): void => {},
		clearStartleEvent = (): void => {}, 
		DuduSetSad = (): void => {console.log("No callback")},
	} = $props();

	if(DuduQState.forceCurrentQuestion && DuduAnswers[SpecialAnswers.BADGENOTICE] && DuduAnswers[SpecialAnswers.BADGENOTICE].choiceValue)
	{
		DuduQState.forceCurrentQuestion = false;
		// reset forced, has been answered
	}

	if(!DuduQState.forceCurrentQuestion && DuduQState.questions.filter((q) => q.duduQuestionTxt != null && !(q.qId in DuduAnswers) ).length == 0) {
		DuduQState.doneAsking = true;
		DuduQState.currentQuestion = null;
	}

	if(!DuduQState.forceCurrentQuestion && ((DuduAnswers[999] && DuduAnswers[999].choiceValue == SpecialAnswers.NEVER_BOTHER_AGAIN) || DuduAnswers.feedbackSubmitted == true) )  {
		DuduSetSad();
		DuduQState.doneAsking = true;
		DuduQState.currentQuestion = null;
		
	}

	if(!DuduQState.forceCurrentQuestion && !DuduQState.doneAsking) {
		const currentQuestionObj = DuduQState.questions.filter((q) => q.duduQuestionTxt != null && !(q.qId in DuduAnswers))[0]
		
		if(currentQuestionObj) DuduQState.currentQuestion = currentQuestionObj;

	}

	export const skip = () => {
		done = true;
	}
	
	const AreYouSure = () => {
		DuduQState.currentQuestion = DuduQState.areYouSure;
	}

	let bottomPosition = new Tween(0);

	const SetPosition = (positionPixelsFromBottom: number, {offset, ...options}) => {
			bottomPosition.set(positionPixelsFromBottom + offset, options)
	};

	let layoutDemo = $state(false)

	const typewriter = (inputText: string, talk: () => void, shutUp: () => void): Attachment => {
		
		return (el): () => void => {

			if(inputText == null) return false;
			// split and reverse input text so we can
			// type it back again
			el.textContent = ""
			const text = inputText.split("").reverse()
			message = "";

			let timeout: number;

			function type() {
				const letter = text.pop()

				if(letter === undefined || letter === null) {
					shutUp();
					return;
				}

				let delay = 30

				el.textContent += letter

				if ([".","?","!",","].includes(letter)) delay = 500

				// update timeout number so we can cancel it
				timeout = setTimeout(type, delay);
			}

			timeout = setTimeout(type, 0);
			talk();

			return () => {

				clearTimeout(timeout);
			}
		}
	};

	const close = () => {
		clearStartleEvent();
		shutUp();
		pokeDudu();
		done = true;
	}

	const forbid = () => {
		AreYouSure()

		clearStartleEvent();
		shutUp();
		pokeDudu();
	}

	type DuduAnswer = {
		qId?: number;
		checkboxId?: number;
		choiceValue: number;
		textValue?: string;
		duduAnswer?: number;
		value?: string;
	}

    const submitAnswer = (valueObj: DuduAnswer, qId: number) => {
    	if (!DuduAnswers[qId]) DuduAnswers[qId] = {};

    	if(valueObj.checkboxId)
    	{
    		if (!DuduAnswers[qId].checkboxes) DuduAnswers[qId].checkboxes = {};
    	}

    	if(valueObj.choiceValue) DuduAnswers[qId].choiceValue = valueObj.choiceValue;
    	if(valueObj.textValue || valueObj.textValue == "") DuduAnswers[qId].textValue = valueObj.textValue;
    	if(valueObj.checkboxId) DuduAnswers[qId].checkboxes[valueObj.checkboxId] = valueObj.value
    	if(valueObj.duduAnswer) DuduAnswers[qId].duduAnswer = valueObj.duduAnswer;
    }

	const answer = (e) => {
		const answer = isNaN(e.target.dataset.choice) ? 0 : parseInt(e.target.dataset.choice);

		if(typeof(answer) === 'undefined') return;

		if(!DuduQState.currentQuestion) return;
		submitAnswer({choiceValue: answer, duduAnswer: answer}, DuduQState.currentQuestion.qId);
		StoreAnswers()


		if (DuduQState.currentQuestion && DuduQState.currentQuestion.qId && answer)
		{
			Api.DuduAnswer({qId: DuduQState.currentQuestion.qId, ans: answer});	
		}

		if( DuduQState.currentQuestion.forced )
		{
			DuduQState.forceCurrentQuestion = false;
		}

		if(e.target.dataset.action)
		{
			if (e.target.dataset.action == 'feedback')
			{
				SetRouter("/feedback");
				ExecuteRouter();
			}
		}


		if(answer == SpecialAnswers.NEVER_BOTHER_AGAIN) {
			DuduQState.doneAsking = true;
			DuduSetSad();
			clearStartleEvent();
			shutUp();
			done = true;	
			return;			
		}

		let answerObj = DuduQState.currentQuestion.choices.filter((c) => c.value == answer)
		/* write this all over again */
		if (answerObj && typeof(answerObj) != 'undefined' && answerObj.length && answerObj[0].subQuestion) {
			DuduQState.currentQuestion = answerObj[0].subQuestion;
			return;
		}

		clearStartleEvent();
		shutUp();
		pokeDudu();
		done = true;			
	}

	onMount(() => {
		SetPosition(getDuuniDuduPosition(), {offset: 20, duration: 0})
		submitToStartleEvent(close);

		return () => {
			clearStartleEvent();
		}

	});
</script>
	<svelte:window onorientationchange={() => {
		SetPosition(getDuuniDuduPosition(), {offset: 20, duration: 500} )}} />
	<!--
	<div style="position: absolute;top:20px;right:20px;z-index:300">
		<button onclick={() => {layoutDemo = !layoutDemo}}>Layout-testi</button>
	</div>
	-->
	<div class="fswrapper">

		{#if DuduQState.currentQuestion != null}

			<div class="duduDialogue" style:bottom={`${bottomPosition.current}px`} class:closeDialogueBox={done}>
				<div class="dialogueBody">
					<div class="wrapper">
						<div class="heading">
							<h2><span class="name">Duuni-Dudu:</span><br /><span {@attach typewriter(typeof(DuduQState.currentQuestion.duduQuestionTxt) == 'string' ? DuduQState.currentQuestion.duduQuestionTxt : DuduQState.currentQuestion.duduQuestionTxt![AppState.lang], talk, shutUp)} class="msg"></span></h2>
						</div>
						<!--
						<div class="body">
							<p>Minä olen Dudu</p>
						</div>
						-->
						<section class="answers">
							<div class="buttonrowWrapper">
								<div class="buttonrow" class:buttons_nowrap={layoutDemo}>
									<div class="spacer"></div>
									{#each DuduQState.currentQuestion.choices as choice}
											<button class:reject={choice.UIOptions && choice.UIOptions.effectColor} data-choice={choice.value} data-action={choice.action} onclick={answer}>{choice.duduText ? typeof(choice.duduText) === 'string' ? choice.duduText : choice.duduText[AppState.lang] : typeof(choice.text) === 'string' ? choice.text : choice.text![AppState.lang]}</button>
									{/each}
									{#if DuduQState.currentQuestion.allowDuduSkip}
										<button class="reject" onclick={(forbid)}>{AppState.lang == 'fi' ? "Älä enää ikinä häiritse minua" : "Never bother me again!"}</button>
										<button class="later" onclick={close}>{AppState.lang == 'fi' ? "Ei nyt" : "Not now"}</button>
									{/if}
									<div class="spacer"></div>
								</div>
							</div>

						</section>
					</div>
				</div>
			</div>
		{/if}
	</div>
<style>
	.fswrapper {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}

	.dialogueBody
	{
		width: 100%;
		pointer-events: auto;
		background: #000;
		padding: 3px;
		margin: 0;
		box-sizing: border-box;
		border-radius: 0.5rem;
		/*background: url('/musta_tausta.png'), linear-gradient(0.0turn, #000000, #000000);*/
		/*background-clip: border-box, content-box;*/
		background: linear-gradient(#090909, #090909) content-box,
              url('/musta_tausta.png') border-box;
		animation: bgRoll 35s infinite linear;
		position: relative;
	}
	.dialogueBody:after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 15%;
		width: 0;
		height: 0;
		border: 14px solid transparent;
		border-top-color: #090909;
		border-bottom: 0;
		margin-left: -14px;
		margin-left: max(-14px, -40%);
		margin-bottom: -13px;
	}
	.duduDialogue {
		width: 90%;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		position: absolute;
		bottom: 0%;
		bottom: calc(0% + 30px);
		left: 1rem;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		transform-origin: 20% bottom;
		animation: bounce 0.35s;
	}

	.closeDialogueBox {
		animation: closeDialogue 0.35s forwards;
	}



	.dialogueBody {
		width: 90%;
		position: relative;

	}
	.dialogueBody .wrapper .close 
	{
		position: absolute;
		top: 0.5rem;
		right: 1rem;
	}
	.dialogueBody .wrapper .close button
	{
		color: #646464;
		border-color: #646464;
		margin: 0;
		font-size: 0.6rem;
		padding: 0.40rem;
		box-sizing: border-box;
	}
	.dialogueBody > div
	{
		margin: 0;
		padding: 0;
	}
	.wrapper {
		border-radius: 0.5rem;
	}
	.heading {
		text-align: left;
		margin: 0;
		padding: 0;
		width: 90%;
		width: calc(100% - 1.8rem);
		font-size: 0.7rem;
		padding: 1rem;

	}
	.heading h2, .body p
	{
		padding: 0;
		margin: 0.2rem;
		user-select: none;
		margin-right: 1.0rem;
	}
	.heading h2 span.name
	{
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--dnxpYellow)

	}
	.body {
		text-align: left;
		user-select: none;
	}


	section.answers 
	{
		width: 100%;
		position: relative;
	}

	.buttonrowWrapper
	{
		width: 100%;
		overflow: hidden;
		overflow-x: auto;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	.buttonrow {
		margin: 0;
		user-select: none;
		margin-bottom: 0.8rem;
	}

	.buttons_nowrap
	{
		white-space: nowrap;
	}
	.spacer {
		user-select: none;
		display: inline-block;
		height: 100%;
		width: 0.5rem;
		margin: 0;
		padding: 0;
	}
	.buttonGradient {
		position:absolute;
		width: 1.5rem;
		height: 100%;
		pointer-events: none;
		margin: 0;
		padding: 0;
	}
	.bg_start {
		top: 0;
		left: 0;
		background: linear-gradient(90deg,#090909ff 0%, #09090900 100%);
	}
	.bg_end {
		top: 0;
		right: 0;
		background: linear-gradient(90deg,#09090900 0%, #090909ff 100%);
	}
	.buttonrow button {
		display: inline;
		white-space: nowrap;
		color: white;
		border-color: white;
		min-width: 4rem;
		margin: 0.4rem;
		margin-right: 0.6rem;
		margin-left: 0;
		box-sizing: border-box;
		padding: 0.3rem;
		padding-left: 0.4rem;
		padding-right: 0.4rem;
		user-select: none;
		outline: none;
	}

	.buttonrow button.reject {
		border-color: #ff2400;
		color: #ff2400;
	}
	.buttonrow button.later {
		background: #888888;
		border-color: #474747;
		color: #000000;
		font-weight: 700;
	}

	@keyframes bounce {
		0% {
			transform: scale(0,0.0);
		}
		50% {
			transform: scale(1.0,1.1);
		}
		100% {
			transform: scale(1,1);
		}
	}
	@keyframes closeDialogue {
		0% {
			transform: scale(1,1);
		}
		50% {
			transform: scale(1.0,1.1);
		}
		100% {
			
			transform: scale(0,0.0);
		}
	}
	@keyframes bgRoll {
		0% {
			background-position: 0px 0px, -400px -400px;
		}
		100%
		{
			background-position: 0px 0px, 400px 400px;
		}
	}
	@media screen and (min-width: 500px)
	{
		.duduDialogue {
			justify-content: flex-start;
			width: 60%;
			width: min(60%, 400px);
			margin-left: 10px;
		}

	}
</style>