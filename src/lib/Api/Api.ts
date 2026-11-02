import type { CompanyDesc, CompanyInfo, CompanyLike } from '../Company/Companies'
import type { AppSetup } from '../State/AppState.svelte'
import type { TrophyStateResponse } from '../State/TrophyState.svelte'
const ENDPOINT = '/dnxp-api/'

export type ErrorMsg = {
	[errorMsg: string]: string;	
};
export type ApiAttestation = {
	ok: string;
}
/*
	JSON from PHP/MySQL 
	may include ints as strings ("amount": "5") 
	which completely breaks things
*/


const Api = {
	Call: async function<T> (endpoint: string, content: object, tries: number = 0): Promise<T|ErrorMsg> {
		if(tries >= 3)
		{
			// three tries failed, return error msg
			return {errorMsg: "Network error"} satisfies ErrorMsg
		}

		try {
			const response = await fetch(ENDPOINT + endpoint + "/", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify(content),
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if(response.ok)
			{
				const data = await response.json()

				return data;
			}
		}
		catch (e)
		{
		}

		return Api.Call( endpoint, content, tries + 1 );
	},

	Report: function (report: string): void {
		Api.Call("report", {msg: report})
	},

	SetupCall: async function (callObject: object): Promise<AppSetup | ErrorMsg> {
		return Api.Call<Promise<AppSetup | ErrorMsg>>("setup", callObject)
	},

	TrophyCall: async function (callObject: object): Promise<TrophyStateResponse | ErrorMsg> {
		return Api.Call<TrophyStateResponse | ErrorMsg>("trophy", callObject)
	},

	StoreDuduState: async function (callObject: object): Promise<void> {
		Api.Call("dudu", callObject)
	},

	DuduAnswer: async function (callObject: object): Promise<void|ErrorMsg> {
		return Api.Call<void>("duduanswer", callObject);
	},

	SurveyAnswer: async function (callObject: object): Promise<ApiAttestation|ErrorMsg> {
		return Api.Call<ApiAttestation>("survey", callObject);
	},

	FakeCall: async function (apicall: string): Promise<void> {
		return new Promise<Promise<void>>(resolve => setTimeout(resolve,1310))
	},

	GetCompanyLikes: async function (companyId: number): Promise<CompanyLike | ErrorMsg> {
		return Api.Call<Promise<CompanyLike | ErrorMsg>>("companylikes", {companyId: companyId})
	},

	LikeCall: async function (companyId: number, value: boolean): Promise<void> {
		Api.Call<Promise<void>>("likecompany", {companyId: companyId, value: value})
	},

	GetAllCompanies: async function (): Promise<CompanyInfo[] | ErrorMsg> {
		return Api.Call<Promise<CompanyInfo[] | ErrorMsg>>("companies", {})
	},

	GetCompanyDesc: async function (companyId: number): Promise<CompanyDesc | ErrorMsg> {
		return Api.Call<Promise<CompanyDesc | ErrorMsg>>("companyId", {companyId: companyId})
	},

	Canvas: async function (callObject: object): Promise<void> {
		Api.Call<Promise<void>>("canvas", callObject);		
	},
	
	StoreCompanyReview: async function (callObject: object): Promise<void> {
		Api.Call<Promise<void>>("companyreview", callObject);
	}
}

export { Api }