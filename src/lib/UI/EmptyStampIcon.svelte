<script lang="ts">
    import { SlotTypes, TrophyState } from "../State/TrophyState.svelte";

    let {
        feedbackMark,
        todoMark,
        markItem
    } = $props();

    const duuniexpo2026 = true // new icon test
</script>

{#if !duuniexpo2026}
    {#if markItem.accepts.every((a: number) => a == SlotTypes['EXHIBITOR'])}
        <img class="placeholder" src={"/app/icons/icon_ex.svg"} alt="Stand" >
    {:else if markItem.accepts.every((a: number) => a == SlotTypes['EVENT'])}
        <img class="placeholder" src={"/app/icons/icon_pre.svg"} alt="Stand" >
    {:else if markItem.accepts.every((a: number) => a == SlotTypes['EVENT'] || a == SlotTypes['EXHIBITOR'])}
        <img class="placeholder" src={"/app/icons/icon_hybrid.svg"} alt="Stand" >
    {:else if todoMark}
        <img src="/app/icons/icon_todolist.svg" alt="Todo list" />
    {:else if feedbackMark}
        <img src="/app/icons/icon_feedback.svg" alt="Feedback" />
    {/if}
{:else}
    <img class="dnxp_blank" src="/app/dnxp/DNXP.jpg" alt="Dnxp"/>
    <div class="icon">
            {#if todoMark}
                <img src="/app/icons/icon_todolist.svg" alt="Todo list" />
            {:else if feedbackMark}
                <img src="/app/icons/icon_feedback.svg" alt="Feedback" />
            {/if}
    </div>
{/if}
<style>
    .dnxp_blank {
        border-radius: 8px;
        width: 100%;
        opacity: 0.1;        
    }
    .icon {
        position: absolute; 
        display: flex;
    }
    img 
    {
        border-radius: 8px;
        width: 100%;
    }

    img.placeholder {
        opacity: 0.9;
    }
</style>