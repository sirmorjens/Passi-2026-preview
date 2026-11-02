<script lang="ts">
    import { AddFeedbackMark, AddTodoMark, clearTrophyState, AddDebugMark } from '../State/TrophyState.svelte'

    const {
        testSuccess = () => {}
    } = $props()

    const localStorageItem = JSON.parse( localStorage.getItem("devtools") ?? "false" )

    $effect(() => {
        const isMinified = minified
        localStorage.setItem("devtools", JSON.stringify( isMinified ))
    })

    let minified = $state(localStorageItem ? localStorageItem : false)
    let draggableContainer: HTMLElement;

    const DebugButtons: {fn: {(e: any) : void }, label: string}[] = [
        {fn: (e: any) => AddFeedbackMark(), label: "Add feedback mark"},
        {fn: (e: any) => AddTodoMark(), label: "Add todo mark"},
        {fn: (e: any) => AddDebugMark(2), label: "Add random stand"},
        {fn: (e: any) => AddDebugMark(3), label: "Add random event"},
        {fn: (e: any) => AddDebugMark(4), label: "Add random student org"},
        {fn: (e: any) => clearTrophyState(), label: "Clear TrophyState"},
        {fn: (e: any) => testSuccess(), label: "Test qr scan animation"},
    ]

    let isDragged = false, offsetX = 0, offsetY = 0;
    
    const onpointerdown = (e: MouseEvent) => {
        const target: HTMLElement | null = e.target as HTMLElement ?? null;
        if(!target) return;
        target.style.cursor = 'grabbing'

        offsetX = e.clientX - draggableContainer.getBoundingClientRect().left
        offsetY = e.clientY - draggableContainer.getBoundingClientRect().top
        isDragged = true;
    }

    const onpointerup = (e: MouseEvent) => {
        isDragged = false;
        const target: HTMLElement | null = e.target as HTMLElement ?? null;
        if(!target) return;
        target.style.cursor = 'grab'
    }
    
   export const onpointermove = (e: MouseEvent) => {
        if(!isDragged) return;
        const target: HTMLElement | null = e.target as HTMLElement ?? null;
        if(!target) return;

        draggableContainer.style.top = `${e.clientY - offsetY}px`;
        draggableContainer.style.left = `${e.clientX - offsetX}px`;
    }
</script>
    <svelte:window {onpointermove} {onpointerup}  />
    
    <div 
    bind:this={draggableContainer} 
    class="devtools" 
    class:minified={minified} 
    role="menu" tabindex=0 
    {onpointerdown} 
    aria-roledescription="Editor" aria-label="Drag">
    
    	<button class="state" onclick={
            () => minified = !minified}>
		{minified ? "+" : "-"}
	</button>

        {#each DebugButtons as buttonProps: {fn: (e: any) => void, label: string}}
            <button onclick={buttonProps.fn}>{buttonProps.label}</button>
        {/each}
    </div>

<style>
    button.state {
        position: absolute;
        top: -5%;
        left: -5%;
    }
    .devtools {
        position: absolute;
        width: 60%;
        width: min(260px, 60%);
        background: #d1cc82;
        border-radius: 1rem;
        padding: 1rem;
        top: 0px;
        right: 0px;
        user-select: none;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .minified {
        height: 20px;
        width: 20px;

    }
    .minified button {
        display: none;
    }
    .minified button.state {
        display: block;
    }
    button {
        flex: 1;
        background: #000;
        color: #fff;
    }
</style>
