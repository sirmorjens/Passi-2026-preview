/* Logic for liking company, storing it both to local state and db */
import { AppState } from '../State/AppState.svelte'
import { Api } from '../Api/Api'
import { AddTodoMark, TrophyState } from '../State/TrophyState.svelte'
export const LIKEAMOUNT = 6;

export const LikeCompany = (companyId: number, value: boolean): boolean => {

	if( companyId === null || typeof(companyId) === 'undefined' ) return false

	Api.LikeCall(companyId, value);
	
	AppState.likedCompanyIds[companyId] = value;
	AppState.store();

	if(!TrophyState.todoMark && Object.values(AppState.likedCompanyIds).filter((v) => v == true).length >= TrophyState.userLikedAmount)
	{
		AddTodoMark()
	}
	// implement error handling maybe?
	return true
}

export const GetLiked = (companyId: number): boolean => {
	if (!(companyId in AppState.likedCompanyIds)) return false;

	return AppState.likedCompanyIds[companyId]
}