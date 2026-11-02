import { Api } from '../Api/Api'
import type { ErrorMsg } from '../Api/Api'
import { basePath } from '../Util/BasePath'

  export type CompanyInfo = {
    name: string;
    companyId: number;
    booth: number;
    scheduled: boolean;
    schedule?: string;
    logoSrc: string;
    tags: string;
    venue: string | null;
    allDay: boolean;
    coords: string;
    boothId: number;
    isWorkshop: boolean;
}

export type CompanyDesc = {
    companyId: number;
    logoSrc: string;
    name: string;
    booth: number;
    centered: boolean;
    links: string[];
    desc: string;
}

export type CompanyLike = {
  value: number;
}

// PLACEHOLDER PICS
const placeholderpic = (speaker = false) => {
  if(speaker) return `${basePath.base}/placeholders/speaker${Math.floor( Math.random() * 6 ) + 1}.png`

  return `${basePath.base}/placeholders/logo${Math.floor( Math.random() * 12 ) + 1}.png`
}

const companydesc: {[companyId: number]: CompanyDesc} = {};
let _companies: CompanyInfo[] | ErrorMsg = []

let _tempcompanies: CompanyInfo[] = [
    {
      name: "Sepon kalatuonti Osakeyhtiö",
      companyId:5,
      booth: 33,
      scheduled: false,
      logoSrc: placeholderpic(),
      tags: "Monta;monta;todella;monta;tagia;ja;vielä;yksi",
      boothId: 0,
      venue: "",
      allDay: false,
      coords: "",
      isWorkshop: false,
      schedule: "",
    },
    {
      name: "Nurmijärven kunta",
      companyId:6,
      booth: 34,
      allDay: false,
      scheduled: false,
      logoSrc: placeholderpic(),
      tags: "Monta;monta;todella;monta;tagia;ja;vielä;yksi",
      boothId: 0,
      venue: "",
      coords: "",
      isWorkshop: false,
      schedule: "",
    },
    {
      name: "Annelin sähkölaitehuolto Ky",
      companyId:7,
      booth: 35,
      allDay: false,
      scheduled: false,
      logoSrc: placeholderpic(),
      tags: "Monta;monta;todella;monta;tagia;ja;vielä;yksi",
      boothId: 0,
      venue: "",
      coords: "",
      isWorkshop: false,
      schedule: "",
    },
    {
      name: "AI-workshop",
      companyId:11, 
      booth: 123,
      logoSrc: placeholderpic(true),
      scheduled: true,
      isWorkshop: true,
      allDay: false,
      coords: "",
      tags: "",
      boothId: 0,
      venue: "AUD2;AUD3",
      schedule: "2025-12-26T00:04:57.321Z<2026-01-28 13:00:00+02:00;2026-01-28 14:00:00+02:00<2026-01-28 16:00:00+02:00",
    },

  ]

	  // fetch companies
	export const getCompanies = async (): Promise<CompanyInfo[]> => {

      _companies = await Api.GetAllCompanies()

      if(_companies && !Array.isArray(_companies) && _companies.hasOwnProperty("errorMsg")) {
        return [{
          name: "Error :-(",
          booth: 0, 
          scheduled: false,
          logoSrc: "",
          companyId: 0,
          tags: "",
          coords: "",
          allDay: false,
          venue: "",
          boothId: 0,
          isWorkshop: false,
          schedule: "",
        } satisfies CompanyInfo]
      }

      if(!_companies) return [];

      // @ts-expect-error
      return (_companies as CompanyInfo[]).toSorted((a,b) => { 
        if(a.scheduled || b.scheduled) return 0;
        return a.name.localeCompare(b.name)});
	}

  export const getCompanyInfo = async (companyId: number): Promise<CompanyInfo[]> => {

    if((_companies as CompanyInfo[]).length == 0) _companies = await Api.GetAllCompanies()

    if( !Array.isArray(_companies) && _companies.hasOwnProperty("errorMsg")) {
        return [{
          name: "Error :-(",
          booth: 0, 
          scheduled: false,
          logoSrc: "",
          companyId: 0,
          tags: "",
          boothId: 0,
          venue: "",
          allDay: false,
          coords: "",
          isWorkshop: false,
          schedule: "",
      } satisfies CompanyInfo]
    }

    return (_companies as CompanyInfo[]).filter((c) => c.companyId == companyId);   
  }

  export const getCompany = async (companyId: number): Promise<CompanyDesc | ErrorMsg> => {
    if(companyId in companydesc)
    {
      return companydesc[companyId];
    }

    return Api.GetCompanyDesc(companyId);  
  }

	export const getCompanyDesc = async(companyId: number): Promise<CompanyDesc> => {
    
    const response = await getCompany(companyId);

    if( Array.isArray(response) && response.length )
    {
      companydesc[companyId] = response[0];
      return response[0];
    }
    
    return {
      desc: "Jokin asia meni pieleen, pahoittelut. Kokeile hetken päästä uudestaan.",
      links: ["",],
      booth: 0,
      logoSrc: "",
      companyId: 0,
      name: "",
      centered: true
    } satisfies CompanyDesc
  }