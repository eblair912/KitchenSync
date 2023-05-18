<script>
	import { onMount, onDestroy } from 'svelte';
	import ListItem from '../components/ListItem.svelte';
	import { goto } from '$app/navigation';
	import LockList from '../components/LockList.svelte';
	import { supabase } from '../lib/supabaseClient';
    import { GenerateGUID } from '../lib/utils';

	let TestGuid = '8b1ee23c-f4bc-11ed-a05b-0242ac120003';

	let listInput = { id: 0, text: '', checked: false };
	let Items = [];
	let listLocked = false;

	onMount(async () => {
		Items = await getData();

		supabase
			.channel('table_db_changes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'tblListItem',
					filter: `ListId=eq.${TestGuid}`
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
					filter: `ListId=eq.${TestGuid}`
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
			.subscribe();
	});

	onDestroy(() => {
		supabase.removeAllChannels();
	});

	async function getData() {
		const { data, error } = await supabase
			.from('tblListItem')
			.select()
			.eq('ListId', TestGuid)
			.eq('isDeleted', 'FALSE');

		if (error) throw new Error(error.message);

		return data;
	}

	async function sendData(itemText, isChecked) {
		const { data, error } = await supabase.from('tblListItem').insert([
			{
				ListId: TestGuid,
				ItemText: itemText,
				isChecked: isChecked,
				isDeleted: false
			}
		]);

		if (error) {
			console.log(error.message);
			throw new Error(error.message);
		}
		return data;
	}

	async function deleteData(itemId) {
		let dateNow = new Date();

		const { error } = await supabase
			.from('tblListItem')
			.update([{ isDeleted: true, DeletedDate: dateNow }])
			.eq('ItemId', itemId);

		if (error) {
			console.log(error.message);
			throw new Error(error.message);
		}
	}

	async function updateData(itemId, itemText, isChecked) {
		const { error } = await supabase
			.from('tblListItem')
			.update([{ ItemText: itemText, isChecked: isChecked }])
			.eq('ItemId', itemId);

		if (error) {
			console.log(error.message);
			throw new Error(error.message);
		}
	}

	const listKeydown = (event, item) => {
		if (event.key === 'Enter' || event.keyCode === 13) {
			listEvent(item);
		}
	};

	const listEvent = (listItem) => {
		let listTextInput = listItem == null ? listInput.text : listItem.ItemText;
		let listIdInput = listItem == null ? 0 : listItem.ItemId;
		let listCheckedInput = listItem == null ? listInput.checked : listItem.isChecked;

		if (listTextInput.trim() != '') {
			// This is an existing item
			if (listIdInput > 0) {
				updateData(listIdInput, listTextInput, listCheckedInput);
			} else {
				// This is a new item
				sendData(listTextInput, false);
			}
		}

		listInput = { id: 0, text: '', checked: false };
	};

	function createList() {
		let guid = GenerateGUID();
		let url = '/?id=';
		goto(`${url}${guid}`);
	}

	const lockClick = () => {
		listLocked = !listLocked;
	};
</script>

<div class="header">
	<span class="header-text">KitchenSync</span>
	<div class="locklist-position">
		<LockList {listLocked} {lockClick} hideButton={Items.length == 0} />
	</div>
</div>
<div class="main-container">
	<div class="block-centered" style="width:100vw;">
		<div class="parent-list">
			<div class="centered-list">
				{#each Items as item (item.ItemId)}
					<ListItem
						bind:enteredText={item.ItemText}
						bind:checked={item.isChecked}
						handleListEvent={() => listEvent(item)}
						handleKeyDownEvent={(event) => listKeydown(event, item)}
						handleDelete={() => deleteData(item.ItemId)}
						hideButton={listLocked}
						locked={listLocked}
						checkEvent={() => updateData(item.ItemId, item.ItemText, !item.isChecked)}
					/>
				{/each}
				<ListItem
					bind:enteredText={listInput.text}
					bind:checked={listInput.checked}
					handleListEvent={() => listEvent(null)}
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
