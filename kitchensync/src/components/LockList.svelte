<script>
    import Icon from '@iconify/svelte'

    export let listLocked;
    export let lockClick;
    export let hideButton;
</script>

<div>
    <button class="lock-button" on:click={lockClick} placeholder="Lock list to prevent deletion" style="{hideButton ? 'display: none' : ''}">
        {#if !listLocked}
            <Icon icon="material-symbols:lock-open" width="2rem"/>
        {:else}
            <Icon icon="material-symbols:lock" width="2rem"/>
        {/if}
    </button>    
</div>