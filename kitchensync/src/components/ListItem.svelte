<script>
    
    import CustomCheck from "./CustomCheck.svelte";
    
    export let enteredText;
    export let handleListEvent;
    export let handleKeyDownEvent;
    export let checked;
    export let checkChanged;
    
</script>

<div class="list-item-container">
    <CustomCheck bind:checked={checked} checkChanged={checkChanged}/>
    <input class="list-item-text" type="text" id="item" bind:value={enteredText} on:blur={handleListEvent} on:keydown={handleKeyDownEvent}>
</div>
