<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { newList } from '../lib/supabaseClient';

	let newListId;

	onMount(async () => {
		newListId = await newList();
		goto(newListId[0].ListId);
	});

</script>


