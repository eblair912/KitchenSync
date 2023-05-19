<script>
    import Icon from '@iconify/svelte';

    export let hideButton;
    export let locked;
    export let deleteClick;
</script>

<div>
    <button class='lock-button' disabled={locked} on:click={deleteClick} style="{hideButton ? 'display: none' : ''}">
        <Icon icon="mdi:trash-can-outline" width="2rem" />
    </button>
</div>