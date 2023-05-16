<script>
	import ListItem from '../components/ListItem.svelte';
	import { goto } from '$app/navigation';

	let listInput = { id: 0, text: '', checked: false };
	let Items = [];
	let currentListId = 1;

	const listKeydown = (event) => {
		if (event.key === 'Enter' || event.keyCode === 13) {
			listEvent();
		}
	};

	const checkChanged = (id, itemChecked) => {
		let itemToUpdate = Items.find((item) => item.id === id);
		if (itemToUpdate) {
			itemToUpdate.checked = itemChecked;
			console.log(id);
		}
	};

	const listEvent = (id) => {
		let listTextInput = listInput.text;
		let listIdInput = id == 0 ? listInput.id : id;

		if (listTextInput.trim() != '') {
			if (id > 0) {
				// This is an existing item
				let itemToUpdate = Items.find((item) => item.id === listIdInput);
				if (itemToUpdate) {
					itemToUpdate.text = listTextInput;
				}
			} else {
				// This is a new item
				Items = [...Items, { id: currentListId, text: listTextInput, checked: false }];
				currentListId++;
			}
		}
		console.log(Items);
		listInput = { id: 0, text: '', checked: false };
	};

	function createList() {
		let guid = GenerateGUID();
		let url = '/?id=';
		goto(`${url}${guid}`);
	}

	function GenerateGUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
</script>

<div class="main-container">
	<div class="block-centered" style="width:100vw;">
		<div class="parent-list">
			{#each Items as item}
				<ListItem
					bind:enteredText={item.text}
					bind:checked={item.checked}
					handleListEvent={listEvent}
					handleKeyDownEvent={listKeydown}
					checkChanged={checkChanged(checkChanged(item.id, item.checked))}
				/>
			{/each}
			<ListItem
				bind:enteredText={listInput.text}
				bind:checked={listInput.checked}
				handleListEvent={listEvent}
				handleKeyDownEvent={listKeydown}
				checkChanged={checkChanged(listInput.id)}
			/>
		</div>
	</div>
</div>
