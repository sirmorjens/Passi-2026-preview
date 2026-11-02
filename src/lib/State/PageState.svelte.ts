import StampGrid from '../UI/Grid/StampGrid.svelte';
import Programme from '../Routes/Programme.svelte';
import DnxpMap from '../Map/DnxpMap.svelte'
import Empty from '../Routes/Empty.svelte'
import Info from '../Routes/Info.svelte'
import Feedback from '../Feedback/Feedback.svelte';
import { type Component } from 'svelte';

type PageProps = {
    pageProps: {
        loadingAnimationStart?: () => void;
        loadingAnimationEnd?: () => void;
        duduDeactivate?: () => void;
    }
}

export const pageState: {
    loading: boolean;
    pageIndex: number;
    Pages: {page: Component<PageProps, {}, "">; framed: boolean}[];
    currentPage: {page: Component<PageProps, {}, "">; framed: boolean};
} = $state({
    loading: false,
    pageIndex: 0,
    Pages: [
      {page: StampGrid, framed: true}, 
      {page: Programme, framed: true}, 
      {page: DnxpMap, framed: false},
      {page: Empty, framed: false}, /* Landing page which is shown as a separate overlay */
      {page: Info, framed: true},
      {page: Feedback, framed: true},
    ],
    currentPage: {page: StampGrid, framed: true},
});

export const setCurrentPage = (index: number): void => {

    if(!pageState.Pages[index]) // incorrect pageindex, default to font page
    {
        pageState.pageIndex = 0;
        pageState.currentPage = pageState.Pages[0];
        return;
    }

    pageState.pageIndex = index;
    pageState.currentPage = pageState.Pages[index];
};