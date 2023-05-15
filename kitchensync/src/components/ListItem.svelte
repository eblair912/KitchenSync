<script>
    
    import CustomCheck from "./CustomCheck.svelte";
    
    export let enteredText;
    export let handleListEvent;
    export let handleKeyDownEvent;
    export let checked;

    
</script>

<div class="list-item-container">
    <CustomCheck bind:checked={checked} />
    <input class="list-item-text" type="text" id="item" bind:value={enteredText} on:blur={handleListEvent} on:keydown={handleKeyDownEvent}>
</div>
