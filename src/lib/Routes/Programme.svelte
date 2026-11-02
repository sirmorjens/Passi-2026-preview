<script lang="ts">

	import { l, type LocalizationItems } from "../Util/DnxpLocalization"
	import { fade } from 'svelte/transition'
	import ProgrammeSlot_Ohjelma from '../UI/ProgrammeSlot_Ohjelma.svelte'
	import ProgrammeSlot_Standi from '../UI/ProgrammeSlot_Standi.svelte'
	import DNXPLogo from '../UI/DNXPLogo.svelte'
	import DXAnimation from '../UI/DXAnimation.svelte'
	import Search from '../UI/Search.svelte'
	import { getCompanies, type CompanyInfo } from '../Company/Companies'
	import { LikeCompany } from '../Company/LikeCompany'
    import CompanyView from '../UI/CompanyView.svelte'
    import { menuOpenState } from '../State/MenuOpener.svelte'
    import { GetSubRoute, SetRouter } from './Router.svelte'
    import type { CompanyViewProps } from "../../types/Company";


	let { pageProps } = $props();

	// svelte-ignore non_reactive_update
	let companies: CompanyInfo[] = [];
	let search: string = $state("")

	const localization: LocalizationItems = {
        pageName: "programme",
        localization: {
            "Ohjelma - DuuniExpo 2026": "Programme - DuuniExpo 2026",
            "Näytteille&shy;asettajat": "Exhibitors",
            "Ohjelma": "Programme",
            "Work&shy;shopit": "Work&shy;shops",

        }
	};

	const loadCompanies = async () => {
		await Promise.all([companies = await getCompanies(), new Promise((resolve) => setTimeout(resolve, 500))]);

		// if company specified in url, open it after companies have loaded
		if (companyView.pendingCompanyId)
		{
			const matchingCompanyItems = companies.filter((item) => item.companyId == companyView.pendingCompanyId)

			if (!matchingCompanyItems || matchingCompanyItems.length != 1)
			{
				console.log("Could not fetch company")
				companyView.pendingCompanyId = null;
				return
			}

			openCompanyView(matchingCompanyItems[0]);
			companyView.pendingCompanyId = null;
		}
	}

	// haku suodattaa firmojen nimet ja tägit jos on
	const filterSearch = (c: CompanyInfo) => c.name.toLowerCase().includes( search.toLowerCase()) || c.tags && c.tags.toLowerCase().includes( search.toLowerCase()) 

	/* 
		Running logic inside Svelte attachments 
		is truly a cursed thing but maybe it works for now
	*/

	const companyView: CompanyViewProps = $state({
		visible: false,
		item: null,
		defaultOpen: false,
		pendingCompanyId: null,
	})

	const openCompanyView = (item: CompanyInfo): void => {

		if(item.companyId === null || typeof(item.companyId) === 'undefined') return;
		companyView.item = item
		companyView.visible = true;

		companyView.next = getNextCompanyItem( item.companyId+1 ) 
		companyView.prev = getPrevCompanyItem( item.companyId-1 )

		SetRouter("/programme/" + item.companyId)

		menuOpenState.backButtonMode = true;
		menuOpenState.backButtonCallback= () => {
			SetRouter("/programme");
      		companyView.item = null
      		companyView.visible = false;}
	}

	const openCompanyViewViaId = (id: number) => {
		companyView.pendingCompanyId = id; // set a pending company id which then will be fulfilled when companies are loaded
		companyView.defaultOpen = true;
	}

	const closeCompanyView = (): void => {
		if(companyView.defaultOpen) companyView.defaultOpen = false;

		if(menuOpenState.backButtonMode && menuOpenState.backButtonCallback) {
			menuOpenState.backButtonCallback()
			menuOpenState.backButtonCallback = null;
			menuOpenState.backButtonMode = false;
		}
	}

	const getCompanyItemWithId = (companyItemId: number): CompanyInfo => {

		const matchingCompanyItems = companies.filter((item) => item.companyId == companyItemId)

		if(companyItemId <= 0) return companies[companies.length-1]

		if (!matchingCompanyItems || matchingCompanyItems.length != 1) return companies[0]

		return matchingCompanyItems[0];
		
	};

	const getNextCompanyItem = (nextItemId: number | string): CompanyInfo => {
		// sorry for type confusion: mysql might return numbers as strings
		// which is an actual problem unless explicitly converted to int
		return getCompanyItemWithId( parseInt (nextItemId as string) + 1 ); 
		
	};

	const getPrevCompanyItem = (prevItemId: number | string): CompanyInfo => {
		
		return getCompanyItemWithId( parseInt( prevItemId as string ) - 1 );
	}; 

	const openNextCompany = () => {

 		companyView.prev = companyView.item;
		if(companyView.next) companyView.item = companyView.next

		if( !companyView.item ) return
		companyView.next = getNextCompanyItem(companyView.item.companyId);
		SetRouter("/programme/" + (companyView.item ? companyView.item.companyId.toString() : ""))		
	}

	const openPrevCompany = () => {

		companyView.next = companyView.item;
		if(companyView.prev) companyView.item = companyView.prev;

		if( !companyView.item ) return
		companyView.prev = getPrevCompanyItem(companyView.item.companyId);
		SetRouter("/programme/" + (companyView.item ? companyView.item.companyId.toString() : ""))		
	}

	const LoadAnimationCall = () => {

		/* Returned function is ran when element mounts */

		return () => {
			pageProps.loadingAnimationStart();

			/*
				...which in turn returns a function that is ran when el unmounts
			*/

			return () => {

				pageProps.loadingAnimationEnd();
			}
		}

	}

	const SubRouteCheck = () => {
		
		let SubRoute = GetSubRoute()
		
		if(SubRoute.length == 1 && SubRoute[0] !== "") {
			openCompanyViewViaId( parseInt(SubRoute[0]) );
			loadCompanies();
			return;
		}
		
		closeCompanyView();
	}

	SubRouteCheck();

</script>

	<svelte:head>
    	<title>{l("Ohjelma - DuuniExpo 2026", localization)}</title>
	</svelte:head>
	<div class="slotsContainer">
		{#await loadCompanies()}
			<div {@attach LoadAnimationCall()}></div>
		{:then _}
		  	{#key companyView.item}
				<Search bind:search={search} />

				{#if companies.filter((c: CompanyInfo) => c.scheduled == true && c.isWorkshop == false).filter(filterSearch).length}
					<div transition:fade class="heading"><h1>{l("Ohjelma", localization)}</h1></div>
				{/if}

				{#each companies.filter((c: CompanyInfo) => c.scheduled == true && c.isWorkshop == false).filter(filterSearch) as item}
					<ProgrammeSlot_Ohjelma 
						{item} 
						{search} 
						updateSearch={(tag: string) => {search = tag}}
						{openCompanyView}/>
				{/each}

				{#if companies.filter((c: CompanyInfo) => c.scheduled == true && c.isWorkshop == true).filter(filterSearch).length}
					<div transition:fade class="heading">
						<h1>{@html l("Work&shy;shopit", localization)}</h1>
					</div>
				{/if}

				{#each companies.filter((c: CompanyInfo) => c.scheduled == true && c.isWorkshop == true).filter(filterSearch) as item}
					<ProgrammeSlot_Ohjelma 
						{item} 
						{search} 
						updateSearch={(tag: string) => {search = tag}} 
						{openCompanyView}/>
				{/each}


				{#if companies.filter((c: CompanyInfo) => c.booth != 999 && c.scheduled == false).filter(filterSearch).length}
					<div transition:fade class="heading">
						<h1>{@html l("Näytteille&shy;asettajat", localization)}</h1>
					</div>
				{/if}

				{#each companies.filter((c: CompanyInfo) => c.booth != 999 && c.scheduled == false).filter( filterSearch ) as item}
					<ProgrammeSlot_Standi 
						{item}
						{search}
						updateSearch={(tag: string) => {search = tag}}
						{openCompanyView} />
				{/each}
			{/key}
		{/await}
	</div>

  	{#if companyView.visible && companyView.item}
  		<div class="fs_blind"></div> <!-- black div to block out everything behind it -->
  		{#key companyView.item.companyId}
    		<CompanyView defaultOpen={companyView.defaultOpen} companyItem={companyView.item} close={closeCompanyView} prev={openPrevCompany} next={openNextCompany}/>
  		{/key}
  	{/if}

<style>

	.heading {
        width: 80%;
        width: min(500px, 80%);
	}

	.fs_blind {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		pointer-events: 0;
		background: #000000;
	}

	.slotsContainer {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		position: relative;
	}

	.heading h1 {
		font-size: 2.8rem;
		text-align: left;
		align-self: stretch;
		margin: 1.2rem;
		margin-top: 2.4rem;
		margin-bottom: 2.4rem;
		display: block;
		color: var(--dnxpYellow);
		overflow-wrap: break-word;
	}


	:global(span.match) {
		color: #ffffff;
		font-weight: 900;
	}

</style>