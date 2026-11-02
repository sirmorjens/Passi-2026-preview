<script lang="ts">
	import { fade } from 'svelte/transition'
    import { Toggle } from "melt/builders";
    import { LikeCompany, GetLiked, LIKEAMOUNT } from '../Company/LikeCompany'
    import { AppState } from '../State/AppState.svelte'
	import { Api } from '../Api/Api'
    import { TrophyState } from '../State/TrophyState.svelte'
    import { getCompanyDesc } from '../Company/Companies'
	import type { CompanyDesc, CompanyInfo } from '../Company/Companies'
    import { SetRouter, ExecuteRouter } from '../Routes/Router.svelte'
    import { onMount,  } from 'svelte'
    import { CompanyReview, type CompanyReviewEntry } from '../Company/CompanyReview.svelte'

	let { 
		companyItem,
		close,
		prev = null,
		next = null, 
	}: {
		companyItem: CompanyInfo | null;
		close: () => void;
		prev?: {(): {}} | null;
		next?: {(): {}} | null;
	} = $props();


    /* toggle logic */
    const toggleFavorite = (value: boolean) => {
        if(!companyItem || companyItem.companyId === null) throw "No company id present"

        LikeCompany(companyItem.companyId, value)
    };

    const toggle = new Toggle({onValueChange: toggleFavorite, value: companyItem!.companyId in AppState.likedCompanyIds && AppState.likedCompanyIds[companyItem!.companyId] == true});

    // get company details via api, except if content is -99 which makes sense, then use presetContent


    let companyDesc: Partial<CompanyDesc> = $state({})

    getCompanyDesc(companyItem!.companyId).then((companyDescObject: CompanyDesc) => companyDesc = companyDescObject);
    
    CompanyReview.load()

    let latestChange: CompanyReviewEntry;

    let q1: string = $state(""), q2: string = $state(""), q3: string = $state("");

    const updateValues = () => {
    	const change: CompanyReviewEntry = {};
    	change.companyId = companyItem!.companyId;
    	if(q1) change.q1 = q1;
    	if(q2) change.q2 = q2;
    	if(q3) change.q3 = q3; 
    	
    	if (stars) change.stars = stars;

    	latestChange = change;
    	CompanyReview.reviews[companyItem!.companyId] = change
    	CompanyReview.store();
    }

    let stars = $state(0);

    const setStar = (val: number) => {
    	stars = Math.max(1, Math.min( val, 5));
    	updateValues();
    }

    onMount(() => {
    	if(companyItem!.companyId in CompanyReview.reviews)
    	{
    		if (CompanyReview.reviews[companyItem!.companyId].q1) q1 = CompanyReview.reviews[companyItem!.companyId].q1 ?? ""
    		if (CompanyReview.reviews[companyItem!.companyId].q2) q2 = CompanyReview.reviews[companyItem!.companyId].q2 ?? ""
    		if (CompanyReview.reviews[companyItem!.companyId].q3) q3 = CompanyReview.reviews[companyItem!.companyId].q3 ?? ""
    		if (CompanyReview.reviews[companyItem!.companyId].stars) stars = CompanyReview.reviews[companyItem!.companyId].stars ?? 0
    	}	

		// onmount returns a function that runs when component unmounts
		// therefore closing the overlay runs the api save logic

    	return () => { 
			// when unmounting (= close overlay) store through api
    		if(latestChange && latestChange.companyId) {
    			Api.StoreCompanyReview(latestChange);
    		}
    	}
    })

</script>

	<div transition:fade={{duration: 150}} class="cw_fs">
		<div class="cw_content">
			<div class="spacer"></div>
			
			<div class="portrait">
					<img src={"/app/logos/" + companyItem!.logoSrc + ".png"}  alt={companyItem!.name} />
			</div>
			<div class="titlerow">
				<h1>{companyItem!.name}</h1>
			</div>
			{#if prev}<div class="prev"><button title="Previous" onclick={() => {prev()}}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l6 6m-6-6l6-6"/></svg></button></div>{/if}
			{#if next}<div class="next"><button title="Next" onclick={() => {next()}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m0 0l-6-6m6 6l-6 6"/></svg></button></div>{/if}

            <div class="rightside">

            	<div class="likebuttonContainer">
            		<button {...toggle.trigger} aria-label="toggle favourite" class="likebutton">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    						<path fill-rule="evenodd" clip-rule="evenodd" d="M7.02479 0C8.77064 0 10.4453 0.692221 11.6816 1.92496C12.4467 2.68669 13.4823 3.11432 14.562 3.11432C15.6416 3.11432 16.6773 2.68669 17.4424 1.92496C17.6181 1.74918 17.842 1.62952 18.0857 1.581C18.3294 1.53247 18.5821 1.5574 18.8117 1.6525C19.0412 1.74765 19.2374 1.90857 19.3753 2.11516C19.5133 2.32177 19.5868 2.56469 19.5868 2.81313V12.8627C19.5867 13.1958 19.4543 13.5154 19.2187 13.7509C17.9825 14.9836 16.3078 15.6758 14.562 15.6758C12.8161 15.6758 11.1415 14.9836 9.90522 13.7509C9.20046 13.0487 8.26362 12.628 7.27061 12.5678C6.27759 12.5077 5.29675 12.8123 4.5124 13.4242V19.1437C4.51239 19.4769 4.37995 19.7963 4.14437 20.0319C3.90879 20.2675 3.58936 20.3999 3.2562 20.3999C2.92304 20.3999 2.60361 20.2675 2.36803 20.0319C2.13245 19.7963 2 19.4769 2 19.1437V2.81313C2.00007 2.47999 2.13243 2.16048 2.36803 1.92496C3.60429 0.692221 5.27895 0 7.02479 0ZM7.27061 2.51707C6.27738 2.45693 5.29642 2.7619 4.5124 3.37463V10.5438C5.31511 10.2134 6.16932 10.0489 7.02479 10.0489C7.88941 10.0475 8.74582 10.2166 9.5449 10.5468C10.344 10.8771 11.0702 11.3619 11.6816 11.9734C12.3863 12.6755 13.3232 13.0961 14.3162 13.1562C15.3092 13.2163 16.29 12.912 17.0744 12.3V5.13088C15.8716 5.62613 14.5492 5.75467 13.2735 5.50031C11.9979 5.24593 10.826 4.61999 9.90522 3.7013C9.20086 2.99842 8.26386 2.57722 7.27061 2.51707Z" fill={toggle.value ? "none" : "#FFFFFF"}/>
						</svg>
						<svg width="21" height="21" viewBox="0 0 21 21" fill="none" style:scale={toggle.value ? 1 : 0} class:shadow={toggle.value} xmlns="http://www.w3.org/2000/svg">
							<path d="M18.8117 1.65239C18.5821 1.55729 18.3294 1.53242 18.0857 1.58095C17.842 1.62947 17.6181 1.7492 17.4424 1.92498C16.6773 2.68672 15.6416 3.11437 14.562 3.11437C13.4823 3.11437 12.4466 2.68672 11.6815 1.92498C10.4453 0.692247 8.77064 0 7.02479 0C5.27895 0 3.60433 0.692247 2.36807 1.92498C2.13247 2.16051 2.00007 2.47998 2 2.81311V19.1437C2 19.4769 2.13235 19.7964 2.36793 20.032C2.60352 20.2675 2.92303 20.3999 3.2562 20.3999C3.58936 20.3999 3.90888 20.2675 4.14446 20.032C4.38005 19.7964 4.5124 19.4769 4.5124 19.1437V13.4242C5.29675 12.8123 6.27756 12.5077 7.27058 12.5679C8.2636 12.628 9.20049 13.0487 9.90526 13.7508C11.1415 14.9836 12.8161 15.6758 14.562 15.6758C16.3078 15.6758 17.9824 14.9836 19.2187 13.7508C19.4543 13.5153 19.5867 13.1958 19.5868 12.8627V2.81311C19.5868 2.56468 19.5132 2.32181 19.3753 2.1152C19.2373 1.9086 19.0412 1.74754 18.8117 1.65239Z" fill="#FF5631"/>
					</svg>
                    </button>
                    <!--<p>{displayCompanyLikes}</p>-->

                </div>



                {#if companyItem!.booth != null && companyItem!.booth < 250}
                	<div class="locationparent">
                		<img src="/app/location.svg" alt="location" height="25" />
						<div class="location">
	                        <div>
	                            <p>{companyItem!.booth}</p>
	                        </div>
	                	</div>
                	</div>
                {/if}
            </div>
            <div class="paragraph" class:centered={companyDesc.centered}>
            	<p>{@html companyDesc.desc}</p>
            </div>

            {#if TrophyState.Slots.cids.some((id) => id == companyItem!.companyId)}

            <div class="questions">
            	<div class="stars">
            		{#each {length: 5}, starno}
            			<button title={starno.toString() + " stars"} onclick={() => {setStar(starno+1)}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill={stars >= starno+1 ? "var(--dnxpOrange)" : "none"} stroke-width="1px" stroke="#ffffff90" d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"/></svg></button>
            		{/each}
            	</div>
            	<div class="textfields">
            		<div><p>{AppState.lang == 'fi' ? "Miksi valitsit tämän pisteen?" : "Why did you choose to visit?"}</p>
	            		<textarea class="pc" bind:value={q1} onchange={() => {updateValues();}} placeholder={AppState.lang == 'fi' ? "Miksi valitsit tämän pisteen?" : "Why did you choose to visit?"}></textarea>
	            	</div>
	            	<div>
	            		<p>{AppState.lang == 'fi' ? "Mikä vierailustasi jäi mieleen?" : "What resonated with you the most?"}</p>
	            	<textarea class="pc" bind:value={q2} onchange={() => {updateValues();}} placeholder={AppState.lang == 'fi' ? "Mikä vierailustasi jäi mieleen?" : "What resonated with you the most?"}></textarea>
	            	</div>
	                <div>
	                	<p>{AppState.lang == 'fi' ? "Miten käyntisi voisi hyödyttää sinua tulevaisuudessa?" : "In what way could you benefit from your visit in the future?"}</p>
	                <textarea class="pc" bind:value={q3} onchange={() => {updateValues();}} placeholder={AppState.lang == 'fi' ? "Miten käyntisi voisi hyödyttää sinua tulevaisuudessa?" : "In what way could you benefit from your visit in the future?"}></textarea>
	                </div>
            	</div>
            </div>
            {/if}

  			{#each companyDesc.links as link}
  				<p>{link}</p>
  			{/each}
			
  			<div class="littlespacer"></div>
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a class="closeLink" tabindex="2" href="javascript:void(0)" onclick={close}>{((q1 || q2 || q3) && (q1.length || q2.length || q3.length)) ? AppState.lang == 'fi' ? "Tallenna" : "Save" : AppState.lang == 'fi' ? "Sulje" : "Close"}</a>
		</div>
	</div>
<style>
	div.questions {
		width: 70%;
	}
	div.textfields {
		width: 100%;
		text-align: left;
	}
	div.textfields div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	div.textfields div p {
		align-self: flex-start;
		margin: 0;
		margin-left:1rem;
		margin-top: 0.6rem;
		margin-bottom: 0.6rem;
	}
	div.textfields div textarea
	{
		width: 90%;
		border: 1px solid #ffffff90;
		background: #000000;
		padding: 0.4rem;
		border-radius: 0.6rem;
	}
	.stars {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.stars button {
		outline: none;
		border: none;
		margin: none;
		padding: none;
		width: 1.4rem;
	}
	.stars button svg {
		margin: 0;
		padding: 0;
		height: 100%;
	}
	.titlerow {
		width: 80%;
		width: min(360px, 80%);
	}
	a.closeLink {
		display: block;
		font-size: 0.9rem;
		margin: 0;
		margin-top: 1rem;
		margin-bottom: 1.8rem;
		padding: 0.6rem;
		border: 1px solid #ffffff30;
		border-radius: 0.4rem;
	}
	.titlerow h1 {
		vertical-align: middle;
	}
	.titlerow h1 {
		user-select: none;
		text-align: center;
	}
	div.cw_fs {
		position: absolute;
		top: 0;
		left: 0;
		width:100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index:20;
		overflow: hidden;
		margin: 0;
		padding: 0;
		background: #00000000;
	}
	div.prev, div.next {
		position: fixed;
	}
	div.prev button, div.next button
	{
		padding: 0.2rem;
		border: 1px solid #ffffff40;
	}
	div.prev svg, div.next svg
	{
		height: 1.5rem;
		margin: 0;
	}

	div.prev {
		bottom: 15vh;
		left: 1rem;
	}
	div.next {
		bottom: 15vh;
		right: 1rem;
	}

	div.likebuttonContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-left: 0.5rem;
		margin-right: -0.2rem;
	}

	div.portrait img {
		border-radius: 50%;
		width: 60%;
		width: min(250px, 60%);
	}

	div.cw_content {
		margin: 0;
		padding: 0;
		width: 100%;
		width: min(500px, 100%);
		height: 100%;
		background: #00000000;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		overflow: hidden;
		overflow-y: auto;

	}
	div.cw_content {
		background: var(--dnxpBackground);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 30% bottom;
	}

	div.spacer {
		margin: 0;
		padding:0;
		box-sizing: border-box;
		width: 30%;
		height: 15vh;
		height: 15svh;
		flex: 0 0 15vh;
	}
	div.littlespacer {
		margin: 0;
		padding:0;
		box-sizing: border-box;
		width: 30%;
		height: 3rem;
		flex: 0 0 3rem;
	}

    .rightside {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding:0;
        margin-right: 0.2rem;
        margin-left: 0.2rem;
        border: 1px solid #ffffff40;
        padding: 10px;
        border-radius: 1rem;
        position: absolute;
        right: 1rem;
        top: 5vh;
        pointer-events: auto;
        z-index: 250;

    }
    .rightside div {
    	margin: 0;
    	padding:0;
    	margin-right: 1rem;
    }

    .locationparent {
    	display:flex;
    	flex-direction: row;
    	align-items: center;
    	justify-content: center;
    }
    .location div {
        border: 1px solid #aaaaaa;
        margin: 0;
        padding: 0;
        width: 2.1rem;
        height: 2.1rem;
        aspect-ratio: 1 / 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .location div p {
        margin: 0;
        padding: 0;
        text-align: center;
        font-family: 'Roboto Mono Variable', 'DM Sans Variable', sans-serif, monospace;
        font-weight: 400;
    }

    .likebutton {
        position: relative;
        /*border: none;*/
        height: 1.9rem;
        width: 1.9rem;
        border: none;
        border-radius: 0.2em;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        background: none;
        z-index: 1;
        outline: none;
    }
    .likebutton:active {
        box-shadow: none;
        transform: none;
        outline: none;
    }
    .likebutton svg {
        position: absolute;
        top: 0.0rem;
        left: 0.1rem;
        transition: scale 0.15s;
        z-index: 1;
    }
    .likebutton svg.shadow
    {
        filter: drop-shadow(0px 0px 2px #ffffff3a);
    }
 
    button.large {
    	font-size: 1rem;
    	border: 1px solid var(--dnxpYellow);
    }

    div.paragraph {
    	width: 70%;
    	display: flex;
    	flex-direction: column;
    	align-items: center;

    }
    div.paragraph p {
    	font-family: 'Roboto Mono Variable', monospace;
    	font-weight: 400;
    	text-align: left;
    	font-size: 1rem;
    	line-height: 2rem;
    	text-wrap: balance;
    }

    div.paragraph.centered p {
    	text-align: center;
    }


</style>