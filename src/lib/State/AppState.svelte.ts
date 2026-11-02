import { Api, type ErrorMsg } from '../Api/Api'
import { basePath } from '../Util/BasePath'
import { LoadLocalState, StoreLocalState } from './LocalStateUtil';

const localAppStateName = "dnxp_l"

export type AppSetup = {
	ok: boolean;
}

export const AppState: {
	lang: string;
	consentSharingTrophies: boolean;
	active: boolean;
	likedCompanyIds: {[key: number]: boolean};
	load: () => Promise<void>;
	signIn: any;
	store: () => Promise<void>;
	build: number;
	base: string; 
} = $state({
	lang: 'fi',
	consentSharingTrophies: false,
	active: false, /* has user seen landing page with consent and language selection*/
	likedCompanyIds: {}, /* let's see if there's a better place for this. Companies.ts is not a good place since its going to be imported from db */ 

	/* Storing liked companies into AppState is in LikeCompany.ts */

	load: async function (): Promise<void> {
		LoadLocalState(localAppStateName, AppState);
	},

	signIn: async function (loadingAnimation: object, appStateEntries: {}, callback: () => void) {

		// refactor this shit

		if(!appStateEntries || !appStateEntries.pc) {
			return;
		}
		//if(appStateEntries.)

		loadingAnimation.start()

		Object.entries(appStateEntries).forEach(([key, val]) => {
			AppState[key] = val;
		})	

		const response: AppSetup | ErrorMsg = await Api.SetupCall({AppState});

		if(!response || response.ok != "ok") {
			Api.Report("Problem signing in")
			// return poistettu että oudossakin tilanteessa pääsee sisään
		}

		loadingAnimation.stop();

		localStorage.setItem(localAppStateName, JSON.stringify(AppState));
		
		callback();
	},

	store: async function () {
		await Api.FakeCall("store appstate");

		StoreLocalState(localAppStateName, AppState);
	},



	build: 106,
	base: basePath.base,
});
