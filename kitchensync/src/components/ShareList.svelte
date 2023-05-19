<script>
    import Icon from '@iconify/svelte';

    export let hideButton;
    export let showCopied;
    export let shareClick;
</script>

<div class="share-list-container">
    <div class="{showCopied ? 'copied-link fade-in-fade-out' : 'copied-link'}" >
        <p>Copied link to clipboard</p>
    </div>
    <button class="share-button" style="{hideButton ? 'display: none' : ''}" on:click={shareClick}>
        <Icon icon="material-symbols:content-copy-outline" width="2rem" />
    </button>
</div>