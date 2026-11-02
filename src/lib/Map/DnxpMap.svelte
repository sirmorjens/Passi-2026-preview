<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import 'leaflet/dist/leaflet.css';

    import { GetSubRoute } from '../Routes/Router.svelte'

    import { l, type LocalizationItems } from '../Util/DnxpLocalization'
    import { type CompanyViewProps } from '../../types/Company'

    import EventMap from '/Event-map2026.svg';

    import Search from '../UI/Search.svelte'
    import CompanyView from '../UI/CompanyView.svelte'
    import { menuOpenState } from '../State/MenuOpener.svelte'

    import { fade } from 'svelte/transition'
    import { GetLiked } from '../Company/LikeCompany'

    import { getCompanies, type CompanyInfo } from '../Company/Companies'
    import type { Attachment } from 'svelte/attachments';

    let mapContainer: HTMLElement, L: any, HtmlOverlay: any, map: any;
    let mapLoaded = $state(false)

    let { pageProps } = $props();
    

    // svelte-ignore non_reactive_update
    let companies: CompanyInfo[] = [];
    let zoomState = $state(0)

    const booths: {[id: number]: Booth} = {}
    let boothsList: Booth[] = []

    const localization: LocalizationItems = {
        pageName: "map",
        localization: {
            "Kartta - DuuniExpo 2026": "Map - DuuniExpo 2026",
        },
    }

    const companyView: CompanyViewProps = $state({
        visible: false,
        item: null,
        defaultOpen: false,
    })

    const openCompanyView = (item: CompanyInfo): void => {
        if(item.companyId === null) return;
        companyView.item = item
        companyView.visible = true;


        menuOpenState.backButtonMode = true;
        menuOpenState.backButtonCallback = () => {
            companyView.item = null
            companyView.visible = false;}
    }
    const closeCompanyView = (): void => {

        if(menuOpenState.backButtonCallback) {
            menuOpenState.backButtonCallback()
            menuOpenState.backButtonCallback = null;
            menuOpenState.backButtonMode = false;
        }
    }

    class Booth {
        coords = [0,0];
        highlight = $state(false)

        constructor(coordsX: number, coordsY: number)
        {
            if(!coordsX || !coordsY) {
                throw "Booth coords missing";
            }

            this.coords = [coordsX, coordsY];
        }
    }


    let search: string = $state("")

    // haku suodattaa firmojen nimet ja tägit jos on
    const filterSearch = (c: CompanyInfo) => c.name.toLowerCase().includes( search.toLowerCase()) || c.tags && c.tags.toLowerCase().includes( search.toLowerCase()) 

    const viewTransitionAccuracy = 5 // how close view center to highlight booth item
    const viewTransitionOffset = -5

    const roundCoordinates = (val: number) => Math.floor(val/viewTransitionAccuracy)*viewTransitionAccuracy // utility for rounding map coords

    async function importLeaflet()
    {
        companies = await getCompanies();

        // extract booths from companies and store into object listing booths
        companies.forEach(({boothId, coords}) => {
            if(!boothId || !coords) return;

            const boothCoords = JSON.parse(coords);
            booths[boothId] = new Booth(boothCoords.lat, boothCoords.lng)
        })

        boothsList = Object.values(booths)

        // @ts-expect-error
        L = await import('leaflet');

        if(!mapContainer) return; // must've been unloaded so let's stop it here

        map = L.map(mapContainer, {
          crs: L.CRS.Simple,
          zoomControl: false,
          minZoom: 0,
          maxZoom: 6,
          zoomSnap: 0.0,
          wheelPxPerZoomLevel: 30,
          bounceAtZoomLimits: false,
        });


        const bounds = [
          [0, 0],
          [330, 346]
        ];

        const initialViewBounds = [
            [-87,-1], 
            [478, 346],
        ];
        
        const image = L.imageOverlay(EventMap, bounds).addTo(map);

        map.fitBounds(initialViewBounds);
    }
    //let debugBoothCounter = 15;


    const AddMarker = (booth: Booth) => {

        if(!booth || typeof(booth) === 'undefined') 
        {
            // return function to be ran on the HTMLElement
            // since it's fucked let's delete id
            return (element: HTMLElement) => {
                element.remove()
            };
        }

        return (element: HTMLElement) => {

            let myIcon2 = L.divIcon({
                html: element,
                className: 'workshop',
                bgPos: [10,10],
            });

            const coords = [booth.coords[0], booth.coords[1]]

            const marker = L.marker(coords , {icon: myIcon2, /* draggable for debugging */  /*draggable: true, */}).addTo(map);
            
            // DON'T REMOVE, USED FOR DEBUGGING 
            /* popup for debugging */
            // marker.bindPopup("<p>" + marker.getLatLng() + "</p>").openPopup(); 
        
            /*
            DRAG AND CLICK POPUPS FOR DEBUGGING 

            Drag icon to booth location in map, click icon to copy booth coords to clipboard, 
            then paste into above list of booth constructors. 
            */
             /*
            marker.on("dragend", (e) => {
                const pos = e.target.getLatLng();
            
                booth.coords = [pos.lat, pos.lng]
                e.target.setPopupContent(`<p>${booth.coords}</p>`)
            })

            marker.on("click", (e) => {
                const pos = e.target.getLatLng();

            })
            marker.on("dblclick", (e) => {
                const pos = e.target.getLatLng();
                navigator.clipboard.writeText(`${debugBoothCounter}: new Booth(${pos.lat-boothOffset[0]}, ${pos.lng-boothOffset[1]}),\n`);                
                debugBoothCounter++;
            })
            */
       
        };

    } 

    const initMap = async () => {
        
        await importLeaflet();
        mapLoaded = L && mapContainer || false;

        /* subroute: post url path to search if user wants to look for a speficic company */

        let SubRoute = GetSubRoute()
       
        if(SubRoute.length == 1) {
            search = decodeURIComponent(SubRoute[0])
        }

        if(SubRoute.length != 1) search = ""

        if (!L || !mapContainer) return; // must've been unloaded, stop it here
       
        map.on("zoomend", () => {
            zoomState = map.getZoom()
        })
    }

    onMount(() => {
        initMap()
    });

    onDestroy( () => {
        if(map) // sometimes user unloads page even before these exist
        {
            map.off()
            map.remove()
        }
    });



    const LoadAnimationCall: () => Attachment = () => {

        // Returned function is ran when element mounts
        return () => {
            pageProps.loadingAnimationStart();

            // ...which in turn returns a function that is ran when el unmounts
            return () => {
                pageProps.loadingAnimationEnd();
            }
        }

    }
</script>

<svelte:head>
    <title>{l("Kartta - DuuniExpo 2026", localization)}</title>
</svelte:head>

<div class="mapwrapper">
    <div bind:this={mapContainer} class="map"></div>
</div>


{#if mapLoaded}
    {#each companies.filter((c: CompanyInfo) => c.booth != 0).filter(filterSearch).sort((c) => c.name.charAt(0) == search.charAt(0) ? 0 : 1) as item}
        <div transition:fade {@attach AddMarker(booths[item.booth])} class="markerItem" >


            <a href="javascript:void(0)" onclick={() => { openCompanyView(item)}}>
                <img src={"/app/logos/" + item.logoSrc + ".png"} 
                alt={item.name} 
                class="mapLogoIcon" 
                class:zoom={zoomState >= 2} 
                class:zoomEvenMorePlease={zoomState >= 4}/>
            </a>

            {#if GetLiked(item.companyId)}
                <div class="liked" class:zoom={zoomState >= 2} class:zoomEvenMorePlease={zoomState >= 4}>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.8117 1.65239C18.5821 1.55729 18.3294 1.53242 18.0857 1.58095C17.842 1.62947 17.6181 1.7492 17.4424 1.92498C16.6773 2.68672 15.6416 3.11437 14.562 3.11437C13.4823 3.11437 12.4466 2.68672 11.6815 1.92498C10.4453 0.692247 8.77064 0 7.02479 0C5.27895 0 3.60433 0.692247 2.36807 1.92498C2.13247 2.16051 2.00007 2.47998 2 2.81311V19.1437C2 19.4769 2.13235 19.7964 2.36793 20.032C2.60352 20.2675 2.92303 20.3999 3.2562 20.3999C3.58936 20.3999 3.90888 20.2675 4.14446 20.032C4.38005 19.7964 4.5124 19.4769 4.5124 19.1437V13.4242C5.29675 12.8123 6.27756 12.5077 7.27058 12.5679C8.2636 12.628 9.20049 13.0487 9.90526 13.7508C11.1415 14.9836 12.8161 15.6758 14.562 15.6758C16.3078 15.6758 17.9824 14.9836 19.2187 13.7508C19.4543 13.5153 19.5867 13.1958 19.5868 12.8627V2.81311C19.5868 2.56468 19.5132 2.32181 19.3753 2.1152C19.2373 1.9086 19.0412 1.74754 18.8117 1.65239Z" fill="#FF5631"/>
                    </svg>
                </div>
            {/if}
 
        </div>  
    {/each}
    


    
    <!--
    {#each Object.entries(booths) as [no, booth]}
        <div {@attach AddMarker(booth)} style="border: 1px solid #f0f" class:focus={booth.highlight}>{no}''
            {#if booth.highlight}
            <div transition:fade style="width:30px;height:30px;background:#0ff"><ProgrammeSlot item={{name: "Kampela", id:65, booth: 4, logoSrc: `./placeholders/logo${Math.floor( Math.random() * 12 ) + 1}.png`, scheduled: false, tags: ""}} search="" /></div>
            {/if}
        </div>

    {/each}
    -->
{:else}
    <div {@attach LoadAnimationCall()}></div>
{/if}


<div class="selectorRow">
    <div class="search">
        <Search bind:search={search} />
    </div>
</div>

{#if companyView.visible}
    <CompanyView companyItem={(companyView as CompanyViewProps).item} close={closeCompanyView}/>
{/if}
<style>
    .markerItem {
        margin: 0;
        padding:0;
        position: relative;
        z-index: 1;
    }
    .mapLogoIcon {
        position: relative;
        z-index: 1;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        height: 20px;
        border-radius: 50%;
        margin-left: -6px;
        margin-top: -6px;
        transition: all 0.3s;
    }
    .mapLogoIcon.zoom {
        height: 40px;
        margin-left: -20px;
        margin-top: -20px;
        z-index: 1;
    }
    .mapLogoIcon.zoomEvenMorePlease {
        height: 110px;
        margin-left: -55px;
        margin-top: -55px;
        z-index: 1;
    }    @keyframes heartRoll {
        0% {transform:rotate(-5deg);}
        50% {transform:rotate(5deg);}
        100% {transform:rotate(-5deg);}
    }


    .markerItem .liked {
        position: absolute;
        top: -25px;
        right: -20px;
        z-index: 510;
        transition: all 0.3s;
        animation: heartRoll 2s infinite ease-in-out;
    }
    .markerItem .liked.zoom {
        top: -30px;
        right: -25px;
    }
    .markerItem .liked.zoomEvenMorePlease {
        top: -55px;
        right: -45px;
    }
    .markerItem .liked svg {
        height: 30px;
        filter: drop-shadow(1px 1px 3px #00000040);
    }

    .mapItem {
        z-index:50;
    }
    .mapItemContent
    {
        background: #000;
        width: 400px;
        width: min(400px, 100vw);
        position: absolute;
        top:50px;
        left:-200px;
        border-radius: 1rem;
        z-index: 50;
    }

    .focus {
        color: #f00;
        background: #ff0;
    }
    .map {
        width: 100%;
        height: 100%;
        user-select: none;
    }
    .moi {
        pointer-events: auto;
        width: 500px;
    }
    .fuck {
        color: #ff0;


    }

    .cool {
        color: #f00;
        border:6px solid #ff0;
        transform: scale(2,2);
        transition: transform 1s;
    }
    .mapwrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        margin:0;
        padding:0;
    }

    :global(.leaflet-html-layer)
    {
        z-index: 2 !important;
        pointer-events: none;
    }
    :global(.leaflet-container)
    {
        background: #00000000 !important;
        position: absolute;
        z-index:1 !important;
        outline: none;
        border: none;
    }

    .letters {
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        margin-left: 2svw;
        margin-right: 2svw;
        padding: 0;
        margin-bottom: 2svh;
        align-items: center;
        justify-content: center;
    }

    .letters button {
        flex: 0 0 1.8rem;
        font-size: 0.8rem;
        padding: 2px;
        width: 1.8rem;
        height: 1.8rem;
        border: 1px solid #999;
        border-radius: 0.3rem;
        pointer-events: auto;
    }


    .selectorRow {
        padding: 0;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        box-sizing: border-box;
        pointer-events: none;
        overflow: hidden;
        z-index: 5;
    }
    .selectorRow .search 
    {
        margin: 0;
        padding: 0;
        margin-top: 15vh;
        margin-top: 15svh;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        pointer-events: auto;
    }
</style>