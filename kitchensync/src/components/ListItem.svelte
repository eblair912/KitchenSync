<script>
    import Icon from '@iconify/svelte'
    import CustomCheck from "./CustomCheck.svelte";
    
    export let enteredText;
    export let handleListEvent;
    export let handleKeyDownEvent;
    export let checked;
    export let handleDelete;
    export let hideButton;
    export let locked;
</script>

<div class="list-item-container">
    <CustomCheck bind:checked={checked} />
    <input class="list-item-text" disabled={locked} class:checked={checked} type="text" id="item" bind:value={enteredText} on:blur={handleListEvent} on:keydown={handleKeyDownEvent} maxlength="60">
    <button class="delete-button" disabled={locked} style="{hideButton ? 'display: none' : ''}" type="delete" on:click={handleDelete}><Icon class="delete-icon" icon="streamline:interface-delete-1-remove-add-button-buttons-delete"/></button>
</div>
