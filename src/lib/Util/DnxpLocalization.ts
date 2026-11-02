import { AppState } from '../State/AppState.svelte'
import { Api } from '../Api/Api'

export type LocalizationItems = { 
	pageName: string;
	localization: {
		[fi: string]: string }
	};

export function l(msg: string, pageLocalizationItems: LocalizationItems): string {

	if(AppState.lang == 'fi') return msg;

	if( !(msg in pageLocalizationItems.localization) )
	{
		Api.Report( "Missing " + msg + " in " + (pageLocalizationItems.pageName));
	}

	return pageLocalizationItems.localization[msg]
}