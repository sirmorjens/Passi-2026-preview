import { Api, type ErrorMsg } from '../Api/Api'
import { AppState } from './AppState.svelte'
import { CreateDebugAsset } from '../DevTools/CreateFakeAssets'

import { LoadLocalState, StoreLocalState } from './LocalStateUtil';

const localTrophyStateName = "dnxp_t"



export const SlotTypes = {
	NOTHING: 0,
	TODOLIST: 1,
	EXHIBITOR: 2,
	EVENT: 3,
	STUDENTORG: 4,
	FEEDBACKLINK: 655,
}

export const levelNames: {
	[trophyName: string]: {[lang: string]: string},
} = {
	'none': {fi: 'Harjoittelija', en: 'Intern'},
	'bronze': {fi: 'Tekijä', en: 'Achiever'},
	'silver': {fi: 'Esihenkilö', en: 'Supervisor'},
	'gold': {fi: 'Päällikkö', en: 'Chief'},
	'platinum': {fi: 'Toimitusjohtaja', en: 'CEO'},
};

export const PresetAssets = {
	TODOASSETID: 255,
	FEEDBACKASSET: 355,
	TODOASSETSRC: '/app/logos/temp_logo.png',
	FEEDBACKASSETSRC: '/app/logos/temp_logo.png',

}

export type TrophyStateResponse = {
	trophies: TrophyAsset[];
	marks: MarkAsset[];
}

export type SlotItem = {
	accepts: number[];
	seen: boolean;
	interactedWith: boolean;
	asset: object | null;
}
type TrophyApiCall = {
	tr?: object;
	trk?: object;
	df?: {a: number; hs: number};
	pin?: string;
	qr?: string;
	str?: string;
}
type QRCallObject = {
	qr?: {data: string} | null;
	pin?: string | null;
}
export type MarkAsset = {
	assetId: number;
	src: string;
	companyId: number;
	slotType: number;
}
type TrophyAsset = {
	assetId: number;
	src: number;
};

export const TrophyState: {
	userLikedAmount: number; // how many companies you need to flag to get the mark 
	participatedInDraw: boolean; // has user been presented the offer to partake in a draw by providing their email address
	build: number;
	Trophies: {[trophyKey: number]: TrophyAsset};
	SlotCelebration: {
		l1: boolean,
		l2: boolean,// Nämä ettei tule ilotulituksia kuin kerran
		l3: boolean,// kun pääset levelin "läpi"
		l4: boolean,
	},
	Slots: {l1: SlotItem[]; l2: SlotItem[]; l3: SlotItem[]; l4: SlotItem[]; ids: number[]; cids: number[]};
	todoMark: boolean;
	feedbackMark: boolean;
	myDuduScore: number | null;
} = $state({
	userLikedAmount: 6,
	participatedInDraw: false, 
	build: AppState.build,
	SlotCelebration: {
		l1: false,
		l2: false,
		l3: false,
		l4: false,
	},
	Trophies: {},
	Slots: {
		/*
			accepts-attribuutti määrää että meneekö ständi vai tapahtuma
			Nyt olen laittanut että joka slottiin menee mikä vaan selkeyden vuoksi
			
			// pelkät ständit
			accepts: [SlotTypes.EXHIBITOR],

			// pelkät "tapahtumat", työpajat puhujat ym
			accepts: [SlotTypes.EVENT],

			// molemmat
			accepts: [SlotTypes.EVENT, SlotTypes.EXHIBITOR, SlotTypes.STUDENTORG],
		*/

		l1: [
			{
				accepts: [SlotTypes.TODOLIST],
				seen: false,
				interactedWith: false,
				asset: null,
			},
			{				
				// accepts: [SlotTypes.EXHIBITOR],
				accepts: [SlotTypes.EVENT, SlotTypes.EXHIBITOR, SlotTypes.STUDENTORG],
				seen: false,
				interactedWith: false,
				asset: null,
			},
			{				
				//accepts: [SlotTypes.EXHIBITOR], 
				accepts: [SlotTypes.EVENT, SlotTypes.EXHIBITOR, SlotTypes.STUDENTORG],
				seen: false,
				interactedWith: false,
				asset: null,
			},
		],
		l2: [

			{				
				//accepts: [SlotTypes.EXHIBITOR],
				accepts: [SlotTypes.EVENT, SlotTypes.EXHIBITOR, SlotTypes.STUDENTORG],
				seen: false,
				interactedWith: false,
				asset: null,
			},
			{				
				//accepts: [SlotTypes.EXHIBITOR],
				accepts: [SlotTypes.EVENT, SlotTypes.EXHIBITOR, SlotTypes.STUDENTORG],
				seen: false,
				interactedWith: false,
				asset: null,
			},
			{				
				//accepts: [SlotTypes.EVENT],
				accepts: [SlotTypes.EVENT, SlotTypes.EXHIBITOR, SlotTypes.STUDENTORG],
				seen: false,
				interactedWith: false,
				asset: null,
			},
			{				
				//accepts: [SlotTypes.EVENT],
				accepts: [SlotTypes.EVENT, SlotTypes.EXHIBITOR, SlotTypes.STUDENTORG],
				seen: false,
				interactedWith: false,
				asset: null,
			},
		],
		l3: [{
				accepts: [SlotTypes.FEEDBACKLINK],
				seen: false,
				interactedWith: false,
				asset: null,
			},
			{				
				//accepts: [SlotTypes.EXHIBITOR, SlotTypes.EVENT],
				accepts: [SlotTypes.EVENT, SlotTypes.EXHIBITOR, SlotTypes.STUDENTORG],
				seen: false,
				interactedWith: false,
				asset: null,
			},
		],
		l4: [],
		ids: [],
		cids: [],
		
	},
	todoMark: false,
	feedbackMark: false,
	myDuduScore: null,
});

export const clearTrophyState = () => {
	localStorage.removeItem(localTrophyStateName);
	location.reload();
}

const StoreState: {
	storeLock: boolean;
	storeCalls: {() : Promise<void>} []
} = $state({
	storeLock: false,
	storeCalls: [],
})

export const canvasReply = (happy: boolean = false, query?: string) =>
{
	TrophyState.participatedInDraw = true;
	store();

	if(!happy) {
		Api.Canvas({query: "Rejected"});
		return;
	}

	if(query)
	{
		Api.Canvas({query: query, TrophyState: TrophyState});
	} 
}

// someone else calls store trophystate, make sure we're not updating it ourselves at the same time
export const externalStoreCall = () => { 
	/*
		if something is being done atm, well store it as a function pointer
		the function pointers will be executed once it's safe to do so
	*/
	if(StoreState.storeLock) // if action ongoing
	{
		StoreState.storeCalls.push( store )
		return;
	}
	// if nothing going on, just store it

	store();
}

const store = async () => {
	StoreLocalState(localTrophyStateName, TrophyState);
}


export const LoadTrophyState = () => {
	LoadLocalState(localTrophyStateName, TrophyState);
}

/*
	schemas

	trophy
		asset
		 -url
	
	mark
		type
		asset
		 -url
		 -companyid


*/

// find next slot for scanned qr code
const TraverseSlots = (slotType: number): SlotItem => {
	/*
		TÄMÄ AJELEE SLOTTEJA PITKIN KUNNES LÖYTYY TYHJÄ SOPIVA SLOTTI
		JOS EI LÖYDY laitetaan alimpaan lokeroon

	*/



	// if slotType is TODO, we'll never give anything else than the first slot that accepts it

	if(slotType == SlotTypes.TODOLIST) return TrophyState.Slots.l1[0];

	if(slotType == SlotTypes.FEEDBACKLINK) return TrophyState.Slots.l3[0];

	// if student organization go to l4 instantly

	if(slotType == SlotTypes.STUDENTORG)
	{
		let availableSlots = []
		availableSlots = TrophyState.Slots.l4.filter((slot) => slot.asset == null)

		if (availableSlots.length) return availableSlots[0];	
		
		// none found, let's create new slot
		// actually always push a new slot

		const newEmptySlotIndex = TrophyState.Slots.l4.push({				
			accepts: [SlotTypes.NOTHING],
			seen: false,
			interactedWith: false,
			asset: null,
		} satisfies SlotItem)

		return TrophyState.Slots.l4[newEmptySlotIndex-1];
	}

	// it wasn't so we'll start looking for suitable slot for the slottype

	const slotContainers = [
		TrophyState.Slots.l1,
		TrophyState.Slots.l2,
		TrophyState.Slots.l3
	]
	
	let availableSlots = []
		
	availableSlots = slotContainers.filter(( slotContainer ) => 
		slotContainer.filter(( slot ) => 
			( slot.accepts as number[] ).includes( slotType ) && 
			slot.asset == null).length != 0)

	if (availableSlots.length) {
		const retSlot = availableSlots[0].filter((slot: SlotItem) => 
			(slot.accepts as number[]).includes(slotType) && 
			slot.asset == null)[0];
			
		return retSlot;
	}
	
	// no available slots found
	// let's find empty slot from l4 or create a new one if not found
	// let's store it in l4 (misc)
	
	availableSlots = TrophyState.Slots.l4.filter((slot) => slot.asset == null)

	if (availableSlots.length) return availableSlots[0];	
	
	// none found, let's create new slot

	const newEmptySlotIndex = TrophyState.Slots.l4.push({				
				accepts: [SlotTypes.NOTHING],
				seen: false,
				interactedWith: false,
				asset: null,
			} satisfies SlotItem)

	return TrophyState.Slots.l4[newEmptySlotIndex-1];
}

const isEmpty = (o: object) => {
	for (let k in o)
	{
		return false;
	}
	return true;
}

export const CallApi = async (callObject: TrophyApiCall): Promise<boolean> => {
	const call: TrophyApiCall= {}

	StoreState.storeLock = true; // we're doing operations so not let anyone else store right now
	
	if( "tr" in callObject )
	{
		call.tr = {a: callObject.df.df.a, hs: callObject.df.df.hs}
	}

	if ("trk" in callObject )
	{	
		call.trk = callObject.trk;
	}

	if( "df" in callObject )
	{
		call.df = {a: callObject.df.df.a, hs: callObject.df.df.hs}
	}

	if( "pin" in callObject )
	{
		call.pin = callObject.pin
	}

	if( "qr" in callObject )
	{
		call.qr = callObject.qr
	}

	if(isEmpty(call)) {

		Api.Report("Empty api call from trophystate")

		StoreState.storeLock = false; // release lock

		StoreState.storeCalls.forEach((sc) => sc()) // call all storecalls made by someone during lock
		StoreState.storeCalls = []; // empty storecalls array

		return false
	}

	const response: TrophyStateResponse | ErrorMsg = await Api.TrophyCall(call)

	if(!response || (response as ErrorMsg).errorMsg) {
		store();

		StoreState.storeLock = false; // release lock

		StoreState.storeCalls.forEach((sc) => sc()) // call all storecalls made by someone during lock
		StoreState.storeCalls = []; // empty storecalls array	
	}

	if(response.trophies && Array.isArray(response.trophies))
	{
		response.trophies.forEach((t) => AddTrophy(t))
	}

	if(response.marks && Array.isArray(response.marks))
	{
		response.marks.forEach((m) => AddMark(m))
	}

	// call store to store to localstorage
	store();

	StoreState.storeLock = false; // release lock

	StoreState.storeCalls.forEach((sc) => sc()) // call all storecalls made by someone during lock
	StoreState.storeCalls = []; // empty storecalls array

	return (
		(
			(response as TrophyStateResponse).trophies &&
			(response as TrophyStateResponse).trophies.length >= 1 && 
			(response as TrophyStateResponse).trophies.some(
				(trophy) => TrophyState.Trophies.hasOwnProperty(trophy.assetId))
		) || 
		(
			(response as TrophyStateResponse).marks && 
			(response as TrophyStateResponse).marks.length >= 1 &&
			(response as TrophyStateResponse).marks.some((m) => 
				TrophyState.Slots.ids.includes(m.assetId))
		)
	)
}

export const AddTodoMark = async (): Promise<void> => {
	//AddMark with
	if(TrophyState.todoMark) return;

	AddMark({assetId: PresetAssets.TODOASSETID, slotType: SlotTypes.TODOLIST, companyId: 6255, src: PresetAssets.TODOASSETSRC});

	const response: TrophyStateResponse | ErrorMsg = await Api.TrophyCall({trk: "kas4",})
	
	if(response.trophies && Array.isArray(response.trophies))
	{
		response.trophies.forEach((t) => AddTrophy(t))
	}
	TrophyState.todoMark = true; 
	store();
}

export const AddFeedbackMark = async (): Promise<void> => {
	if(TrophyState.feedbackMark) return;

	AddMark({assetId: PresetAssets.FEEDBACKASSET, slotType: SlotTypes.FEEDBACKLINK, companyId: 7655, src: PresetAssets.FEEDBACKASSETSRC});

	const response: TrophyStateResponse | ErrorMsg = await Api.TrophyCall({trk: "c029",})
	
	if(response.trophies && Array.isArray(response.trophies))
	{
		response.trophies.forEach((t) => AddTrophy(t))
	}

	TrophyState.feedbackMark = true; 
	store();


}

const AddTrophy = (trophyAsset: TrophyAsset): void  => {
	// add asset to trophies
	// object schema
	
	/*trophy
	{
		assetId
		src
	}*/

	if(trophyAsset.assetId === null || typeof(trophyAsset.assetId) === 'undefined' ) return
	if(trophyAsset.src === null || typeof(trophyAsset.src) === 'undefined' ) return

	// check if id already exists
	if( trophyAsset.assetId in TrophyState.Trophies ) return;

	TrophyState.Trophies[trophyAsset.assetId] = {assetId: trophyAsset.assetId, src: trophyAsset.src} // put into object

}

export const AddDebugMark = (slotType: number) => {
	AddMark( CreateDebugAsset(slotType) )	
	store();
}

const AddMark = (markAsset: MarkAsset): void => {

	if(markAsset.assetId === null || typeof(markAsset.assetId) === 'undefined' ) return;
	if(markAsset.src === null || typeof(markAsset.src) === 'undefined' ) return 
	if(markAsset.companyId === null || typeof(markAsset.companyId) === 'undefined' ) return
	if(markAsset.slotType === null || typeof(markAsset.slotType) === 'undefined' ) return



	// check if id already exists
	if( TrophyState.Slots.ids.some((id) => id == markAsset.assetId)) return;
	if( TrophyState.Slots.cids.some((id) => id == markAsset.companyId)) return;

	const slot = TraverseSlots(markAsset.slotType)

	slot.asset = {
		assetId: markAsset.assetId,
		src: markAsset.src, 
		companyId: markAsset.companyId,
	};

	TrophyState.Slots.ids.push(markAsset.assetId)
	TrophyState.Slots.cids.push(markAsset.companyId)
}



export const TrophyQR = async (code: QRCallObject) => {

	if(code.qr && code.qr.data) {
		if(await CallApi({qr: code.qr.data} satisfies TrophyApiCall)) return true
		return false
	}

	if(code.pin) {
		if(await CallApi({pin: code.pin} satisfies TrophyApiCall)) return true
		return false
	}

	return false
}

const TrophyLogic = (to: TrophyApiCall = {}): void => {
	CallApi({df: to} satisfies TrophyApiCall) 
} 

export const Flight = (fo: object = {}): number|boolean => {
	
	if( fo.a && !(isNaN(fo.a) ) )
	{
		externalStoreCall() // store local highscore;
		
		TrophyLogic({df: {a: performance.now() - fo.a, hs: fo.hs, }});
		return true
	}

	return performance.now()
}
