<script>
	import { onMount, onDestroy } from 'svelte';
	import ListItem from '../../components/ListItem.svelte';
	import LockList from '../../components/LockList.svelte';
	import DeleteList from '../../components/DeleteList.svelte';
	import ShareList from '../../components/ShareList.svelte';
	import {
		supabase,
		getData,
		sendData,
		updateData,
		deleteData,
		updateList,
		getListLocked,
		deleteList,
		listExists
	} from '$lib/supabaseClient';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	let Items = [];
	let listInput = { id: 0, text: '', checked: false };
	let listLocked = false;
	let listId;
	let showCopied;
	let menuClicked;

	onMount(async () => {
		listId = $page.params.id;
		let listExist = await listExists(listId);

		if (listExist) {
			Items = await getData(listId);
			listLocked = await getListLocked(listId);

			await subscribeToChannel();
		} else {
			//Creates new list
			goto('/');
		}
	});

	onDestroy(() => {
		if(Items.length == 0 && listId != null) {
		    deleteList(listId);
		    goto("/");
		}
		supabase.removeAllChannels();
	});

	async function subscribeToChannel() {
		supabase
			.channel('table_db_changes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'tblListItem',
					filter: `ListId=eq.${listId}`
				},
				(payload) => {
					Items = [...Items, payload.new];
				}
			)
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'tblListItem',
					filter: `ListId=eq.${listId}`
				},
				(payload) => {
					let updated;

					if (payload.new.isDeleted) {
						updated = Items.filter((item) => item.ItemId !== payload.new.ItemId);
					} else {
						updated = Items.map((item) =>
							item.ItemId === payload.new.ItemId ? payload.new : item
						);
					}
					Items = updated;
				}
			)
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'tblList',
					filter: `ListId=eq.${listId}`
				},
				(payload) => {
					listLocked = payload.new.isLocked;
				}
			)
			.subscribe();
	}

	const listKeydown = (event, item) => {
		if (event.key === 'Enter' || event.keyCode === 13) {
			if (item == null) {
				sendData(listInput.text, false, listId);
				clearListInput();
			} else {
				updateData(item.ItemId, item.ItemText, item.isChecked);
			}
		}
	};

	function clearListInput() {
		listInput = { id: 0, text: '', checked: false };
	}

	const deleteClick = () => {
		deleteList(listId);
		goto('/');
	};

	const lockClick = () => {
		updateList(listId, !listLocked);
	};

	const shareClick = () => {
		try {
			navigator.clipboard.writeText($page.url.href);
			showCopied = true;
		} catch {
			console.error('Failed to copy URL: ', err);
		}

		//Need to set this in order to remove class which makes copied message visible
		setTimeout(() => {
			showCopied = false;
		}, 2000);
	};
</script>

<div class="header">
	<span class="header-text">KitchenSync</span>
	<div class="locklist-position">
		<ShareList
			hideButton={Items.length == 0}
			{showCopied}
			shareClick={() => {
				shareClick();
			}}
		/>
		<LockList
			{listLocked}
			lockClick={() => {
				lockClick();
			}}
			hideButton={Items.length == 0}
		/>
		<DeleteList
			hideButton={Items.length == 0}
			locked={listLocked}
			deleteClick={() => {
				deleteClick();
			}}
		/>
	</div>
</div>
<div class="mobile-header">
	{#if !menuClicked}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="unclicked-menu"
			on:click={() => {
				menuClicked = !menuClicked;
			}}
		>
			<Icon icon="line-md:menu-fold-left" class="menu-icon" width="2rem" />
		</div>
	{:else}
		<div class="slide-open">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="header-icon-spacing"
				on:click={() => {
					menuClicked = !menuClicked;
				}}
			>
				<Icon icon="line-md:menu-fold-right" class="menu-icon" width="2rem" />
			</div>
			<span class="header-text">KitchenSync</span>
			<div class="locklist-position">
				<ShareList
					hideButton={Items.length == 0}
					{showCopied}
					shareClick={() => {
						shareClick();
					}}
				/>
				<LockList
					{listLocked}
					lockClick={() => {
						lockClick();
					}}
					hideButton={Items.length == 0}
				/>
				<DeleteList
					hideButton={Items.length == 0}
					locked={listLocked}
					deleteClick={() => {
						deleteClick();
					}}
				/>
			</div>
		</div>
	{/if}
</div>
<div class="main-container">
	<div class="block-centered" style="width:100vw;">
		<div class="parent-list">
			<div class="centered-list">
				{#each Items as item (item.ItemId)}
					<ListItem
						bind:enteredText={item.ItemText}
						bind:checked={item.isChecked}
						handleListEvent={() => updateData(item.ItemId, item.ItemText, item.isChecked)}
						handleKeyDownEvent={(event) => listKeydown(event, item)}
						handleDelete={() => deleteData(item.ItemId)}
						hideButton={listLocked}
						locked={listLocked}
						checkEvent={() => updateData(item.ItemId, item.ItemText, !item.isChecked)}
					/>
				{/each}
				<div style={listLocked ? 'display: none;' : 'display:block;'}>
					<ListItem
						bind:enteredText={listInput.text}
						bind:checked={listInput.checked}
						handleListEvent={() => {
							sendData(listInput.text, false, listId);
							clearListInput();
						}}
						handleKeyDownEvent={(event) => listKeydown(event, null)}
						handleDelete={() => {}}
						hideButton={true}
						locked={false}
						checkEvent={() => {}}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
