<script lang="ts">
    import { menuOpenState } from '../State/MenuOpener.svelte';
    import { LinkDealer } from '../Util/LinkDealer.svelte';

    import { pageState } from '../State/PageState.svelte'
    import { l, type LocalizationItems } from "../Util/DnxpLocalization";

    // figure out how to do this page by page
    const localization: LocalizationItems = {
        pageName: "menu",
        localization: {
            "Passi": "Passi",
            "Ohjelma": "Programme",
            "Kartta": "Map",
            "Info": "Info",
            "Anna palautetta": "Feedback",
        }
    }
</script>

<div class="menu" class:open={menuOpenState.MenuButtonOpen}>
    <ul style="list-style: none;padding-left:0;margin-left:0;" class="menuList">
        <li class="menuItem" class:current={pageState.pageIndex == 0}>
            <a href="/" 
            onclick={() => {menuOpenState.MenuButtonOpen = false; }} 
            {@attach LinkDealer()}>
                {l("Passi", localization)}
            </a>
        </li>
        <li class="menuItem" class:current={pageState.pageIndex == 1}>
            <a href="/programme" 
            onclick={() => {menuOpenState.MenuButtonOpen = false; }} 
            {@attach LinkDealer()}>
                {l("Ohjelma", localization)}
            </a>
        </li>
        <li class="menuItem" class:current={pageState.pageIndex == 2}>
            <a href="/map" 
            onclick={() => {menuOpenState.MenuButtonOpen = false; }} 
            {@attach LinkDealer()}>
                {l("Kartta", localization)}
            </a>
        </li>
        
        <li class="spacer"></li>

        <li class="menuItem minor" class:current={pageState.pageIndex == 4}>
            <a href="/info" 
            onclick={() => {menuOpenState.MenuButtonOpen = false; }} 
            {@attach LinkDealer()}>
                {l("Info", localization)}
            </a>
        </li>
        <li class="menuItem minor" class:current={pageState.pageIndex == 5}>
            <a href="/feedback" 
            onclick={() => {menuOpenState.MenuButtonOpen = false; }} 
            {@attach LinkDealer()}>
                {l("Anna palautetta", localization)}
            </a>
        </li>

    </ul>
</div>


<style>
.menu {
    position: absolute;
    top: 0%;
    left: 0%;
    height: 100%;
    width: 16rem;
    font-size: 2.5em;
    width: 100vw;
    width: 100svw;
    width: min(100vw, 360px);
    background: #101928;
    transform-origin: top left;
    /*transition: all cubic-bezier(.17,.54,.09,1.38) 0.5s;*/
    will-change: transform;
    transition: all cubic-bezier(.6,.14,.33,.98) 0.3s;
    transform: translate(-25%,0);
    padding-top: 15svh;
    box-sizing: border-box;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: auto;
    text-align: left;
    background: #101928;
    background: var(--dnxpBackground);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 70% center;
    z-index: 11;
    opacity: 0;
    pointer-events: none;
    user-select: none;
}
    @keyframes bgRoll {
        0% {
            background-position: 200% 200%;
        }
        50%
        {
            background-position: -200% -200%;
        }
        100% {
            background-position: 200% 200%;
        }
    }
.menuItem {
    text-align: left;  
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    margin-left:10px;
    padding-left: 10px;
}


.current {
    border-left: 3px solid #ffffff70;
}
.menuItem a {
    color: white;
    font-weight: 200;
    user-select: none;
    -webkit-user-select: none;
}
.menuItem a:active {
    transition: font-weight 0.3s;
    font-weight: 300;
}
.open {
    display: block;
    cursor: pointer;
    transform: translate(0,0);
    opacity: 1;
    pointer-events: auto;
}
.menuItem.minor a
{
    font-size: 2rem;
    color: #ffffffff;
}

li.spacer {
    height: 1.5rem;
    margin: 0;
    padding: 0;
    padding-left: 10px;
    margin-left: 10px;
    box-sizing: border-box;
    user-select: none;
    border: none;
}
</style>