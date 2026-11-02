import { AppState } from './AppState.svelte'

export const StoreLocalState = (localStateName: string, stateObject: object) => {
    if(!localStorage) {
        // handle error
        throw new Error("Localstorage not available");
    }

    localStorage.setItem(localStateName, JSON.stringify(stateObject));
}

export const LoadLocalState = (localStateName: string, stateObject: object) => {
    if(!localStorage) {
        // handle error
        throw new Error("Localstorage not available");
    }

    const storageEntry = localStorage.getItem(localStateName);

    if(!storageEntry) return;

    const loadedState = JSON.parse(storageEntry)

    if (!loadedState.build || loadedState.build != AppState.build)
    {
        alert(localStateName + ': Laitteellasi on jotain tiedostoja vanhoista kehitysversioista. Poista sivuston tiedot ("Poista selaustiedot" tms.) ja aloita alusta');
        console.log("Not current build")
        localStorage.clear();
    }

    Object.assign(stateObject, loadedState);
}