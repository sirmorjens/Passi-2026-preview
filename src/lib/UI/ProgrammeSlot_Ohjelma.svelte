<script lang="ts">
    import { fade } from 'svelte/transition'
    import { Api } from '../Api/Api'
    import { Toggle } from "melt/builders";
    import { LikeCompany, GetLiked } from '../Company/LikeCompany'
    import type { CompanyInfo } from '../Company/Companies';

    type Props = {
        item: CompanyInfo,
        updateSearch: (search: string) => void,
        openCompanyView: (item: CompanyInfo) => void,
    }

    let { 
        item,
        updateSearch,
        openCompanyView
    }: Props = $props();

    const toggleFavorite = (value: boolean) => {
        if(item.companyId === null) throw "No company id present"

        LikeCompany(item.companyId, value)
    };

    let companyliked = $state(GetLiked(item.companyId));

    const toggle = new Toggle({onValueChange: toggleFavorite, value: GetLiked(item.companyId)});


    function getItemTags () {
        if(!item.tags) return []

        return item.tags.split(";")
    }

    type ScheduleItem = {
        text: string,
        location: string | number,
        status: 1 | 0, // joku kahen markan boolean, joku idea täs varmaan ollut
    }

    function getItemSchedule(): ScheduleItem[] {

        // parse 'booleany' values ("1" | "0") koska tulevat merkkijonoina mysqlstä

        if (! parseInt( `${item.scheduled}` )) return [];

        if ( parseInt( `${item.allDay}` )) 
            return [{text: 'Non-stop', status: 0, 
                location: item.venue ? item.venue : item.booth}];

        if (!item.schedule) {
            Api.Report("Mismatch in companies")
            return []
        }

        const scheduleItems = item.schedule.split(";");
        const locations = item.venue ? item.venue.split(";").reverse() /* janky but easier to pop off of*/ : [item.booth];

        return scheduleItems.map<ScheduleItem>((s: string) => {
            const [start, end] = s.split("<").map((t) => new Date(t));

            if(
                !(start && end) || 
                isNaN(start.valueOf()) || 
                isNaN(end.valueOf())
            ) {
                Api.Report("Companies start or end time missing or corrupt")
                return {
                    text: "",
                    status: 0,
                    location: ""
                }
            }

            return {
                text: [start,end].map((time) => new Date(time).toLocaleTimeString("fi", {hour: '2-digit', minute:'2-digit'})).join(" - "),
                status: Date.now() > start.getTime() ? 1 : 0,
                location: locations.pop() ?? "?"
            }
        })    
    }


</script>


    <div transition:fade={{duration: 330,}} class="slot" class:liked={companyliked}>
        <div class="portrait">
            <!-- svelte-ignore a11y_invalid_attribute -->
            <a href="javascript:void(0)" onclick={() => {openCompanyView(item) }}><img src={"/app/logos/" + item.logoSrc + ".png"} alt="{item.name}" /></a>
        </div>
        <div class="heading">

            <h2>
                <!-- svelte-ignore a11y_invalid_attribute -->
                <a href="javascript:void(0)" onclick={() => {openCompanyView(item) }}>{@html item.name}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="var(--dnxpYellow)" d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/></svg>
                </a>
            </h2>
        </div>
        {#if item.booth && item.booth < 100}
            <div class="location">
                <p>{item.booth}</p>
            </div>
        {/if}

        <div class="timetable">
            <ul>
            {#each getItemSchedule() as time}
                <li class:late={time.status == 1}>
                    <h4 class:number={time.text != 'Non-stop'}>{time.text}</h4>
                    <h4 class="loc">{time.location}</h4>
                </li>
            {/each}
            </ul>
        </div>

        <div class="tags">
            {#each getItemTags() as tag}

                <p class="tag"><a href="#" onclick={() => {updateSearch(tag)}}>{@html tag}</a></p>
            {/each}
        </div>

        <div class="rightside">
            <div class="symbol">
            <img src={parseInt( `${item.scheduled}` ) ? "/app/icons/icon_pre.svg" : "/app/icons/icon_ex.svg"} alt="" height="21" class="symbol" />
            </div> 
            <div class="likebuttonContainer">
                <button {...toggle.trigger} aria-label="toggle favourite" class="likebutton">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.02479 0C8.77064 0 10.4453 0.692221 11.6816 1.92496C12.4467 2.68669 13.4823 3.11432 14.562 3.11432C15.6416 3.11432 16.6773 2.68669 17.4424 1.92496C17.6181 1.74918 17.842 1.62952 18.0857 1.581C18.3294 1.53247 18.5821 1.5574 18.8117 1.6525C19.0412 1.74765 19.2374 1.90857 19.3753 2.11516C19.5133 2.32177 19.5868 2.56469 19.5868 2.81313V12.8627C19.5867 13.1958 19.4543 13.5154 19.2187 13.7509C17.9825 14.9836 16.3078 15.6758 14.562 15.6758C12.8161 15.6758 11.1415 14.9836 9.90522 13.7509C9.20046 13.0487 8.26362 12.628 7.27061 12.5678C6.27759 12.5077 5.29675 12.8123 4.5124 13.4242V19.1437C4.51239 19.4769 4.37995 19.7963 4.14437 20.0319C3.90879 20.2675 3.58936 20.3999 3.2562 20.3999C2.92304 20.3999 2.60361 20.2675 2.36803 20.0319C2.13245 19.7963 2 19.4769 2 19.1437V2.81313C2.00007 2.47999 2.13243 2.16048 2.36803 1.92496C3.60429 0.692221 5.27895 0 7.02479 0ZM7.27061 2.51707C6.27738 2.45693 5.29642 2.7619 4.5124 3.37463V10.5438C5.31511 10.2134 6.16932 10.0489 7.02479 10.0489C7.88941 10.0475 8.74582 10.2166 9.5449 10.5468C10.344 10.8771 11.0702 11.3619 11.6816 11.9734C12.3863 12.6755 13.3232 13.0961 14.3162 13.1562C15.3092 13.2163 16.29 12.912 17.0744 12.3V5.13088C15.8716 5.62613 14.5492 5.75467 13.2735 5.50031C11.9979 5.24593 10.826 4.61999 9.90522 3.7013C9.20086 2.99842 8.26386 2.57722 7.27061 2.51707Z" fill={toggle.value ? "none" : "#FFFFFF"}/>
                        </svg>
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" style:scale={toggle.value ? 1 : 0} class:shadow={toggle.value} xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.8117 1.65239C18.5821 1.55729 18.3294 1.53242 18.0857 1.58095C17.842 1.62947 17.6181 1.7492 17.4424 1.92498C16.6773 2.68672 15.6416 3.11437 14.562 3.11437C13.4823 3.11437 12.4466 2.68672 11.6815 1.92498C10.4453 0.692247 8.77064 0 7.02479 0C5.27895 0 3.60433 0.692247 2.36807 1.92498C2.13247 2.16051 2.00007 2.47998 2 2.81311V19.1437C2 19.4769 2.13235 19.7964 2.36793 20.032C2.60352 20.2675 2.92303 20.3999 3.2562 20.3999C3.58936 20.3999 3.90888 20.2675 4.14446 20.032C4.38005 19.7964 4.5124 19.4769 4.5124 19.1437V13.4242C5.29675 12.8123 6.27756 12.5077 7.27058 12.5679C8.2636 12.628 9.20049 13.0487 9.90526 13.7508C11.1415 14.9836 12.8161 15.6758 14.562 15.6758C16.3078 15.6758 17.9824 14.9836 19.2187 13.7508C19.4543 13.5153 19.5867 13.1958 19.5868 12.8627V2.81311C19.5868 2.56468 19.5132 2.32181 19.3753 2.1152C19.2373 1.9086 19.0412 1.74754 18.8117 1.65239Z" fill="#FF5631"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
<style>
    :global(.match) {
        font-weight: 400;
        color: #FF5631;
    }
    :global(.tag .match) {
        font-weight: 400;
        color: #343434;
    }
    .tags {
        margin: 0;
        padding: 0;
        margin-top: 0.6rem;
        margin-bottom: 0.6rem;
        width: 90%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }
    .tags p.tag {
        margin: 0;
        padding: 0;
        margin-left: 0.3rem;
        margin-right: 0.3rem;
        margin-bottom: 0.2rem;
        margin-top: 0.2rem;
        font-size: 0.9rem;
        background: #ffffffef;
        color: #000000;
        border-radius: 0.7rem;
        padding: 0.2rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        box-shadow: 2px 2px 6px #ffffff20;
        box-sizing: border-box;
    }

    .tags p.tag a {
        color: #000000;
    }

    .portrait {
        flex: 0 0 60px;
        flex: 0 0 min(60px, 18%);
    }
    .portrait img {
        width: 65%;
        border-radius: 50%;
    }

    .timetable {
        width: 160px;
    }
    .timetable ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .timetable ul li {
        margin: 0;
        padding: 0;
        background: #FF5631ee;
        color: #ffffff;
        border-radius: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    img.symbol {
        height: 2.2rem;
        border-radius: 0.3rem;
        position: absolute;
        right: 1rem;

        bottom: 1.5rem;
        background: #00000090;
        border-radius: 0.4rem;
        padding: 5px;
        border: 1px solid #ffffff30;
    }

    .timetable ul li h4 {
        margin: 0;
        margin: 0.2rem;
        font-weight: 400;
        padding: 0;
        white-space: nowrap;
    }
    .timetable li.late {
        background: #FF563150;
        color: #676767;
    }
    .timetable li .number {
        font-family: 'Roboto Mono Variable', 'DM Sans Variable', sans-serif, monospace;
        font-weight: 600;
    }
    .timetable li .loc {
        background: #ffffff;
        color: #000000;
        padding: 0;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        border-radius: 0.7rem;
    }
    .timetable li.late .loc {
        background: #888888aa;
        color: #000000;
    }

    .likebuttonContainer
    {
        position: absolute;
        right: 1rem;
        top: 1.5rem;
        background: #000000aa;
        border-radius: 0.4rem;
        padding: 5px;
        border: 1px solid #ffffff40;
    }
    .likebutton {


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
        position: relative;
    }
    .likebutton:active {
        box-shadow: none;
        transform: none;
    }
    .likebutton svg {
        position: absolute;
        top: 0.1rem;
        left: 0.1rem;
        transition: scale 0.15s;
        z-index: 1;
    }
    .likebutton svg.shadow
    {
        filter: drop-shadow(0px 0px 2px #ffffff3a);
    }

    .location p {
        text-align: center;
        border: 1px solid #aaaaaa;
    }


    .slot {
        width: 80%;
        width: min(500px, 80%);
        z-index:0;
        /*
        background: #000000;
        */
        background: url('/app/DNXP_passi_background.png');
        background-repeat: no-repeat;
        background-size: 680px;
        background-position: center bottom;
        
        border-radius: 1.1rem;
        
        box-sizing: border-box;
        box-shadow: 0px 11px 17px #ffffff05;
        position: relative;
        border: none;
        border-bottom: 1px solid #aaaaaa10;


        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 0;
        padding: 0;
        margin-bottom: 2rem;
    }
    .slot.exhibitor {
        flex-direction: row;
    }
    .slot.liked {
        border: 1px solid #ffffff60;
    }
    @media screen and (min-width: 600px)
    {
        .slot {
            background-size: 800px;
        }
    }
    @media screen and (min-width: 1000px)
    {
        .slot {
            background-size: 900px;
        }
    }

    h2 a {
        color: #ffffff;
    }
    h2 a:active {
        color: var(--dnxpBlue);
    }
    h2 a svg {
        margin: 0;
        padding: 0;
        height: 1.5rem;
        margin-bottom: -0.2rem;
    }    .slot .heading h2 {
        font-weight: 600;
        font-size: 1.6rem;
        text-align: center;
    }
    .slot .heading {
        width: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
    }


</style>