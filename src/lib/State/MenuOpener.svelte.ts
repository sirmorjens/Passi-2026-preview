export const menuOpenState: {
    MenuButtonOpen: boolean;
    MenuButtonDown: boolean;
    backButtonMode: boolean;
    backButtonCallback: { (): void } | null;
} = $state({
    MenuButtonOpen: false, 
    MenuButtonDown: false,
    _backbuttonMode: false, 
    backButtonCallback: null,
    get backButtonMode (): boolean {
        return this._backbuttonMode;
    },
    set backButtonMode (value: boolean) {
        if(this.MenuButtonOpen && value)
        {
            this.MenuButtonOpen = false;
        }
        this._backbuttonMode = value
    },
});
