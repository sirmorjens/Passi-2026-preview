import { setCurrentPage } from '../State/PageState.svelte'
import { AppState } from '../State/AppState.svelte'
import { basePath } from '../Util/BasePath'
// Router.svelte.ts

const routing: {
    [name: string]: {page: number;}
}= {
    "": {
        page: 0,
    },
    "programme": {
        page: 1,
    },
    "map": { 
        page: 2,
    },
    "qr": { page: 0,
    },
    "eteismatto": { page: 3,
    },
    "info": { page: 4,
    },
    "feedback": { page: 5,
    },
};

export function SetRouter (route: string): void {
    history.pushState(null, "", basePath.base + route)
}

export function ExecuteRouter (targetLocation: Location = window.location): void {

    // first time visitor get eteismatto
    if( !AppState.active )
    {
        setCurrentPage(routing['eteismatto'].page);

        // use case: first time user scanned qr-code
        // catch qr-code here so it's not a huge pain in the ass
        
        return;
    }

    const pathVars = targetLocation.pathname.split("/").slice(2)

    setCurrentPage(pathVars[0] in routing ? routing[pathVars[0]].page : 0)

    return;

}

export function GetSubRoute (location: Location = window.location): Array<string>
{
    const pathVars = location.pathname.split("/").slice(2)

    if(pathVars.length <= 1) return []
    return pathVars.slice(1)
}

export function ResetSubRoute(location: object = window.location): void {
    history.pushState(null, "", basePath.base + "/")
}