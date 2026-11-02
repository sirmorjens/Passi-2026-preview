import { SetRouter, ExecuteRouter } from "../Routes/Router.svelte";

/*
    this is attached to hyperlinks
    and prevents browser navigating
    instead it call's router function to
    update pagestate so new content is displayed
*/

function LinkCatcher (e: Event) {
    if((e.target as HTMLAnchorElement).pathname)
    {
        SetRouter( (e.target as HTMLAnchorElement).pathname )
        ExecuteRouter()
        e.preventDefault();
        return
    }

    if((e.currentTarget as HTMLAnchorElement).pathname) SetRouter( (e.currentTarget as HTMLAnchorElement).pathname )
    ExecuteRouter()
    e.preventDefault();
}

export function LinkDealer ()
{
    return (element: HTMLElement) => {

        element.addEventListener("click", LinkCatcher);
        element.addEventListener("dblclick", LinkCatcher);

        // attachments return function that runs on element that 
        // then returns a function that runs when unmounted,
        // remove eventlisteners no duplicate eventlisteners exist
        return () => {

            element.removeEventListener("click", LinkCatcher);
            element.removeEventListener("dblclick", LinkCatcher);
        };
    }
}