<script>
    import Icon from '@iconify/svelte';

    export let hideButton;
</script>

<div>
    <button class="share-button" style="{hideButton ? 'display: none' : ''}">
        <Icon icon="material-symbols:content-copy-outline" width="2rem" />
    </button>
</div>