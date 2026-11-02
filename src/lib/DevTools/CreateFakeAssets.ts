import { PresetAssets, type MarkAsset } from "../State/TrophyState.svelte"

export const CreateDebugAsset: (slotType: number) => MarkAsset = (slotType: number) => {
    const debugMarkAsset: MarkAsset = {
        assetId: Math.floor( Math.random() * 255 ),
        src: PresetAssets.TODOASSETSRC,
        companyId: Math.floor( Math.random() * 255 ),
        slotType: slotType,
    }

    return debugMarkAsset;
}