import { AppState } from "../State/AppState.svelte";
import { LoadLocalState, StoreLocalState } from "../State/LocalStateUtil";

const localDQStateName = "dnxp_dq", localDQAnswersStateName = 'dnxp_dq_a'

export const inputTypes = {
	RADIO_INPUT: 0,
	TEXT_INPUT: 1,
	CHECKBOX_INPUT: 2,
	CHECKBOX_INPUT_TEXT: 3,
	RADIO_HORIZONTAL: 4,
	LEFT_TEXT: 5,
	TEXTONLY_INPUT: 6};

type FeedbackAnswer = {
	choiceValue?: number;
	duduAnswer?: number;
	checkboxes?: {[checkboxId: number]: number};
}

export const DuduAnswers: {
		feedbackSubmitted: boolean;
		build: number;
	} & {
	[qId: number]: FeedbackAnswer;
} = $state({
	feedbackSubmitted: false,
	build: AppState.build,
});

export const clearAnswers = () => {
	StoreAnswers();
}

type FeedbackQuestion = {
	qId: number;
	required?: boolean; // feedback page marks as required to answer
	allowDuduSkip?: boolean; // dudu will allow to select "skip" and "don't bother me again"
	questionTxt?: {[lang: string]: string}; // main question text for feedback page
	duduQuestionTxt?: {[lang: string]: string}; // shorter version for Dudu to ask
	UIOptions?: {isSQ: boolean};
	choices: QuestionChoice[];
	forced?: boolean;
	duduExclusive?: boolean; // only asked by Dudu, not present in feedback questionnaire
	inputType?: number; // defines if question is multi-select or text field etc
}
type QuestionChoice = {
	value: number;
	text?: string | {[lang: string]: string};
	duduText?: string | {[lang: string]: string};
	inputType?: number;
	subQuestion?: FeedbackQuestion; // subquestion which will be triggered by selecting this choice
	action?: string; // action to trigger
	textAlign?: number; // alignment
	UIOptions?: {
		effectColor: boolean;
	}
}
export const DuduQState: {
	doneAsking: boolean;
	currentQuestion: FeedbackQuestion | null;
	forceCurrentQuestion: boolean;
	questions: FeedbackQuestion[];
	areYouSure: FeedbackQuestion;
	badgeNotice: FeedbackQuestion;
} = $state({
	doneAsking: false,
	currentQuestion: null,
	forceCurrentQuestion: false,
	questions: [
		{
			qId: 1,
			required: true,
			allowDuduSkip: true,
			questionTxt: {fi: "Mihin ikäryhmään kuulut?", en: "Which age group do you fall in?",},
			choices: [
				{
					value: 1,
					text: "< 15",
				},
				{
					value: 2,
					text: "15-19",
				},
				{
					value: 3,
					text: "20-24",
				},
				{
					value: 4,
					text: "25-29",
				},
				{
					value: 5,
					text: "30-34",
				},
				{
					value: 6,
					text: "35-39",
				},
				{
					value: 7,
					text: "40-44",
				},
				{
					value: 8,
					text: "45-49",
				},
				{
					value: 9,
					text: "> 50",
				},
			],
		},
		{
			qId: 2,
			required: true,
			allowDuduSkip: true,
			questionTxt: {fi: "Mikä on asuinpaikkakuntasi?", en: "What is your city of residence?"},
			choices: [
				{
					value: 1,
					text: "Lahti",
				},
				{
					value: 2,
					text: "Hollola",
				},
				{
					value: 3,
					text: "Orimattila",
				},
				{
					value: 4,
					text: "Heinola",
				},
				{
					value: 5,
					text: "Lappeenranta",
				},
				{
					value: 6,
					inputType: inputTypes.TEXT_INPUT,
					text: {fi: "Muu:", en: "Other",},
				},
			],
		},
		{
			qId: 3,
			allowDuduSkip: true,
			duduQuestionTxt: {fi: "Hei, oletko opiskelija?", en: "Hey, are you a student?"},
			questionTxt: {fi: "Mikä on elämäntilanteesi?", en: "What is your employment status?"},
			choices: [
				{
					value: 1,
					duduText: {fi: "Opiskelen", en: "I'm a student"},
					text: {fi: "Opiskelija", en: "Student"},
					subQuestion: { /* convert subquestions into lists to get even more fun times */
						qId: 4,
						allowDuduSkip: true,
						UIOptions: {
							isSQ: true,// just so we don't enumerate the subquestion in the ui
						},
						duduQuestionTxt: {fi: "Missä opiskelet?", en: "Where do you study at?"},
						questionTxt: {fi: "Opiskelen tällä hetkellä", en: "I am currently studying at"},
						choices: [
							{
								value: 1,
								text: {fi: "Ammattikoulussa", en: "Vocational school"},
							},
							{
								value: 2,
								text: {fi: "Lukiossa", en: "High School"},
							},
							{
								value: 3,
								text: {fi: "Ammattikorkeakoulussa", en: "University of Applied Sciences"},
								subQuestion: {
									qId: 5,
									allowDuduSkip: true,
									UIOptions: {
										isSQ: true, 
									},
									duduQuestionTxt: {fi: "Oletko LAB-ammattikorkeakoulun opiskelija, mitä alaa opiskelet?", en: "If you are a LAB student, what faculty are you studying at?"},
									questionTxt: {fi: "Oletko LAB-ammattikorkeakoulun opiskelija, mitä alaa opiskelet?", en: "If you are a LAB student, what faculty are you studying at?"},
									choices: [
										{
											value: 1,
											text: {fi: "Liiketalous", en: "Business"},
										},
										{
											value: 2,
											text: {fi: "International Business", en: "International Business"},
										},
										{
											value: 3,
											text: {fi: "Sosiaali- ja terveysala", en: "Healthcare and social services"},
										},
										{
											value: 4,
											text: {fi: "Tekniikka", en: "Teknologia"},
										},
										{
											value: 5,
											text: {fi: "Hotelli-, ravintola- ja matkailuala", en: "Hospitality management"},
										},
										{
											value: 6,
											text: {fi: "Muotoilu", en: "Design"},
										},
										{
											value: 7,
											text: {fi: "Kuvataide", en: "Arts"},
										},
										{
											value: 8,
											text: {fi: "Visuaalinen viestintä", en: "Visual communication"},
										},
										{
											value: 9,
											text: {fi: "Muu / en ole LABin opiskelija", en: "Other / I don't study at LAB"},
										},
									],
								},
							},
							{
								value: 4,
								text: {fi: "Yliopistossa", en: "University"},
								subQuestion: {
									qId: 6,
									UIOptions: {
										isSQ: true,
									},
									allowDuduSkip: true,
									duduQuestionTxt: {fi: "Oletko LUT-yliopiston opiskelija, mitä alaa opiskelet?", en: "If you are a student at LUT University, what faculty are you studying at?"},
									questionTxt: {fi: "Oletko LUT-yliopiston opiskelija, mitä alaa opiskelet?", en: "If you are a student at LUT University, what faculty are you studying at?"},
									choices: [
										{
											value: 1,
											text: {fi: "Energiatekniikka", en: "Energy Technology"},
										},
										{
											value: 2,
											text: {fi: "Kemiantekniikka", en: "Chemical Engineering"},
										},
										{
											value: 3,
											text: {fi: "Konetekniikka", en: "Mechanical Engineering"},
										},
										{
											value: 4,
											text: {fi: "Laskennallinen tekniikka", en: "Computational Engineering"},
										},
										{
											value: 5,
											text: {fi: "Sähkötekniikka", en: "Electrical Engineering"},
										},
										{
											value: 6,
											text: {fi: "Tietotekniikka", en: "Software Engineering"},
										},
										{
											value: 7,
											text: {fi: "Tuotantotalous", en: "Industrial Engineering and Management"},
										},
										{
											value: 8,
											text: {fi: "Ympäristötekniikka", en: "Environmental Technology"},
										},
										{
											value: 9,
											text: {fi: "Kauppatieteet", en: "Economics"},
										},
										{
											value: 10,
											text: {fi: "Yhteiskuntatieteet", en: "Social Sciences"},
										},
										{
											value: 11,
											text: {fi: "Muu / en ole LUT-yliopiston opiskelija", en: "Other / I don't study at LUT University"},
										},
									],
								},
							},
						],
					},
				},
				{
					value: 2,
					duduText: {fi: "Olen töissä", en: "I'm employed",},
					text: {fi: "Työssäkäyvä", en: "Employed",},
				},
				{
					value: 3,
					duduText: {fi: "Olen työtön", en: "I'm unemployed",},
					text: {fi: "Työtön", en: "Unemployed",},
				},
				{
					value: 4,
					duduText: {fi: "Jotain muuta", en: "Something",},
					text: {fi: "Muu", en: "Other",},
				},
				
			],
		},
		{
			qId: 7,
			required: true,
			allowDuduSkip: true,
			duduQuestionTxt: {fi: "Oletko käynyt DuuniExpossa aikaisemmin?", en: "Have you been to DuuniExpo before?"},
			questionTxt: {fi: "Oletko vieraillut aikaisempina vuosina DuuniExpossa?", en: "Have you visited DuuniExpo in previous years?"},
			choices: [
				{
					value: 1,
					duduText: {fi: "Kyllä olen", en: "Yes I have",},
					text: {fi: "Kyllä", en: "Yes",},
				},
				{
					value: 2,
					duduText: {fi: "Tämä on ensimmäinen kerta", en: "This is my first time",},
					text: {fi: "En", en: "No",},
				},
				],
		},
		{	
			qId: 8,
			required: true,
			allowDuduSkip: true,
			questionTxt: {fi: "Mitä kautta sait tietää DuuniExposta?", en: "Where did you hear about DuuniExpo?",},
			choices:[
				{
					value: 1,
					inputType: inputTypes.CHECKBOX_INPUT,
					text: {fi: "Sosiaalisesta mediasta", en: "Social media",},
					subQuestion: {
						qId: 9,
						UIOptions: {
							isSQ: true,
						},
						questionTxt: {fi:"Miltä sosiaalisen median alustalta kuulit tapahtumasta?", en:"Which social media platform did you hear about the event from?",},
						choices: [
							{
								inputType: inputTypes.CHECKBOX_INPUT,
								value: 1,
								text: {fi: "Instagram", en: "Instagram"},
							},
							{
								inputType: inputTypes.CHECKBOX_INPUT,
								value: 2,
								text: {fi: "TikTok", en: "TikTok"},
							},
							{
								inputType: inputTypes.CHECKBOX_INPUT,
								value: 3,
								text: {fi: "Facebook", en: "Facebook"},
							},
							{
								inputType: inputTypes.CHECKBOX_INPUT,
								value: 4,
								text: {fi: "LinkedIn", en: "LinkedIn"},
							},
						],
					},
				},
			{
				inputType: inputTypes.CHECKBOX_INPUT,
				value: 2,
				text: {fi: "Koulun kautta", en: "Through school"},
			},
			{
				inputType: inputTypes.CHECKBOX_INPUT,
				value: 3,
				text: {fi: "Mainoksista LABin kampuksella", en: "LAB Campus advertisement",},
			},
			{
				inputType: inputTypes.CHECKBOX_INPUT,
				value: 4,
				text: {fi: "DuuniExpoa järjestäviltä opiskelijoilta", en: "From students organizing DuuniExpo",},
			},
			{
				inputType: inputTypes.CHECKBOX_INPUT,
				value: 5,
				text: {fi: "Ulkomainoksista", en: "Outdoor advertisement",},
			},
			{
				inputType: inputTypes.CHECKBOX_INPUT,
				value: 6,
				text: {fi: "Tulin paikalle sattumalta", en: "I came by chance",},
			},
			{
				inputType: inputTypes.CHECKBOX_INPUT_TEXT,
				value: 7,
				text: {fi: "Muu:", en: "Other:",},
			},
		],
	},
	{
		qId: 10,
		required: true,
		allowDuduSkip: true,
		inputType: inputTypes.RADIO_HORIZONTAL,
		questionTxt: {fi: "Arviosi tapahtuman markkinoinnista?", en: "Your evaluation on the marketing of the event?",},
		choices: [
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				textAlign: inputTypes.LEFT_TEXT,
				text: {fi: "Erittäin huono", en: "Very bad",},
				value: 1,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 2,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 3,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 4,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 5,
				text: {fi: "Erittäin hyvä", en: "Very good",},
			},
			]
	},
	{	
		qId: 11,
		required: true,
		allowDuduSkip: true,
		questionTxt: {fi: "Mihin näistä osallistuit tapahtumapäivänä?", en: "Where did you hear about DuuniExpo?",},
		choices:[
			{
				value: 1,
				inputType: inputTypes.CHECKBOX_INPUT,
				text: {fi: "Näytteilleasettajien ständeillä kiertelyyn", en: "Touring the stands of the exhibitors",},
			},	
			{
				inputType: inputTypes.CHECKBOX_INPUT,
				value: 2,
				text: {fi: "Puhujien kuunteluun auditoriossa", en: "Listening to speakers in the auditorium"},
			},
			{
				inputType: inputTypes.CHECKBOX_INPUT,
				value: 3,
				text: {fi: "Työpajoihin", en: "Workshops",},
			},
		],
	},
	{
		qId: 12,
		required: true,
		allowDuduSkip: true,
		inputType: inputTypes.RADIO_HORIZONTAL,
		questionTxt: {fi: "Löysitkö tarvitsemasi tiedon tapahtumasta etukäteen?", en: "Did you find enough information about the event beforehand?",},
		choices: [
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				textAlign: inputTypes.LEFT_TEXT,
				text: {fi: "En löytänyt", en: "Not at all",},
				value: 1,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 2,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 3,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 4,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 5,
				text: {fi: "Löysin helposti", en: "Very easily",},
			},
			]
	},
	{	
		qId: 13,
		allowDuduSkip: true,
		questionTxt: {fi: "Millaisia puhujia ja/tai ohjelmaa toivoisit näkeväsi ensi vuoden DuuniExpossa?", en: "What type of speakers and/or program would you like to see during next years DuuniExpo?",},
		choices:[
			{
				value: 1,
				inputType: inputTypes.TEXTONLY_INPUT,
				text: {fi: "Vastauksesi", en: "Your answer",},
			},
		],
	},
	{	
		qId: 14,
		required: true,
		allowDuduSkip: true,
		questionTxt: {fi: "Koitko eri toimialojen olevan tarpeeksi edustettuina tapahtumassa?", en: "Did you feel that there were enough different industries represented during the event?",},
		choices:[
			{
				value: 1,
				text: {fi: "Kyllä", en: "Yes",},
			},
			{
				value: 2,
				text: {fi: "Ei", en: "No",},
			},
			{
				value: 3,
				text: {fi: "En osaa sanoa", en: "Maybe",},
			},
		],
	},
	{	
		qId: 15,
		required: true,
		allowDuduSkip: true,
		questionTxt: {fi: "Löysin itselleni mahdollisesti...", en: "I found a possible...",},
		choices:[
			{
				value: 1,
				inputType: inputTypes.CHECKBOX_INPUT,
				text: {fi: "Harjoittelupaikan", en: "Internship",},
			},
			{
				value: 2,
				inputType: inputTypes.CHECKBOX_INPUT,
				text: {fi: "Kesätyöpaikan", en: "Summer job",},
			},
			{
				value: 3,
				inputType: inputTypes.CHECKBOX_INPUT,
				text: {fi: "Työpaikan", en: "Job",},
			},
			{
				value: 4,
				inputType: inputTypes.CHECKBOX_INPUT,
				text: {fi: "Opinnäytetyöaiheen", en: "Thesis topic",},
			},
			{
				value: 5,
				inputType: inputTypes.CHECKBOX_INPUT,
				text: {fi: "Kontakteja", en: "Contacts",},
			},
			{
				value: 6,
				inputType: inputTypes.CHECKBOX_INPUT,
				text: {fi: "Jotain muuta", en: "Something else",},
			},	
	
		],
	},
	{
		qId: 16,
		required: true,
		allowDuduSkip: true,
		inputType: inputTypes.RADIO_HORIZONTAL,
		questionTxt: {fi: "Kuinka todennäköisesti suosittelisit DuuniExpoa?", en: "How likely are you to recommend DuuniExpo?",},
		choices: [
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				textAlign: inputTypes.LEFT_TEXT,
				text: {fi: "En lainkaan", en: "Not at all",},
				value: 1,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 2,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 3,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 4,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 5,
				text: {fi: "Hyvin todennäköisesti", en: "Very likely",},
			},
			]
	},	
	{
		qId: 17,
		required: true,
		allowDuduSkip: true,
		inputType: inputTypes.RADIO_HORIZONTAL,
		questionTxt: {fi: "Minkä arvosanan antaisit tapahtumalle kokonaisuudessaan?", en: "How would you grade the event as a whole?",},
		choices: [
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				textAlign: inputTypes.LEFT_TEXT,
				text: {fi: "Välttävä", en: "Sufficient",},
				value: 1,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 2,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 3,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 4,
			},
			{
				inputType: inputTypes.RADIO_HORIZONTAL,
				value: 5,
				text: {fi: "Erinomainen", en: "Excellent",},
			},
			]
	},
	{	
		qId: 18,
		allowDuduSkip: true,
		questionTxt: {fi: "Kommentteja ja kehitysideoita järjestäjille", en: "Comments and feedback to the event organisers",},
		choices:[
			{
				value: 1,
				inputType: inputTypes.TEXTONLY_INPUT,
				text: {fi: "Vastauksesi", en: "Your answer",},
			},
		],
	},
	{	
		qId: 19,
		allowDuduSkip: true,
		questionTxt: {fi: "Kommentteja DuuniExpo Passista", en: "Comments and feedback about DuuniExpo Passi",},
		choices:[
			{
				value: 1,
				inputType: inputTypes.TEXTONLY_INPUT,
				text: {fi: "Vastauksesi", en: "Your answer",},
			},
		],
	},
	{
		qId: 501,
		duduExclusive: true,
		duduQuestionTxt: {fi: "Haluaisitko vielä vastata DuuniExpo 2026 -palautekyselyyn?", en: "Would you like to fill out a survey about DuuniExpo 2026?"},
		choices: [
			{
				duduText: {fi: "Totta kai haluan", en: "Sure!",},
				value: 600,
				subQuestion: {
					qId: 505,
					duduQuestionTxt: {fi: "Kiitos!", en: "Thank you!"},
					choices: [
						{
							duduText: {fi: "Palautekyselyyn", en: "Open survey",},
							value: 507,
							action: 'feedback',
						},
					]
				}
			},
			{
				duduText: {fi: "Ehkä myöhemmin", en: "Maybe later",},
				value: 601,
				subQuestion: {
					qId: 506,
					duduQuestionTxt: {fi: "Selvä", en: "Ok"},
					choices: [
						{
							duduText: {fi: "...", en: "..."},
							value: 509,
						}
					]
				}
			},
		],
	},
	],
	areYouSure: {
		qId: 999,
		allCoices: false,
		duduMood: 5,
		duduQuestionTxt: {fi: "Selvä, en kysy enää sinulta mitään", en: "Fine, I won't ask you anything anymore"},
		choices: [
			{
				value: 100,
				UIOptions: {
					effectColor: true,
				},
				text: {fi: "Tehdään näin", en: "Fine"},
			},
			{
				value: 2,
				text: {fi: "Peruuta", en: "Cancel"},
			}
		]
	},	
	badgeNotice: {
			qId: 2000,
			allCoices: false,
			forced: true,
			duduMood: 5,
			duduQuestionTxt: {fi: "Vau, olet kultatasolla. Hae infosta itsellesi DuuniExpo-haalarimerkki!", en: "Wow, you reached Gold-level. There's a student patch waiting for you in the Info/reception."},
			choices: [
				{
					value: 2001,
					UIOptions: {
						effectColor: true,
					},
					text: {fi: "Menen hakemaan", en: "I'll get it"},
				},
				{
					value: 2002,
					text: {fi: "Ei kiitos", en: "No thanks"},
				}
			]
	},
	build: AppState.build,

})


export const DuduQStateStore = async () => {
	StoreLocalState(localDQStateName, DuduQState)
}

export const DuduQStateLoad = async () => {
	LoadLocalState(localDQStateName, DuduQState)
}

export const StoreAnswers = () => {
	StoreLocalState(localDQAnswersStateName, DuduAnswers)
}

export const DuduQStateLoadAnswers = () => {
	LoadLocalState(localDQAnswersStateName, DuduAnswers)
}