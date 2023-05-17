<script>
    import {onMount} from 'svelte';
	import ListItem from '../components/ListItem.svelte';
	import { goto } from '$app/navigation';
	import LockList from '../components/LockList.svelte';
	import { supabase } from '../lib/supabaseClient';

    onMount(async () => {
        Items = await getData();
    });

    async function getData() {
		const { data, error } = await supabase.from('tblListItem').select().eq('ListId', '0ee1f38a-f4bc-11ed-a05b-0242ac120003').eq('isDeleted', 'FALSE');

		if (error) throw new Error(error.message);

		return data;
	}

    async function sendData(itemText, isChecked) {
        const { data, error } = await supabase
        .from('tblListItem')
        .insert([
            {'ListId': '0ee1f38a-f4bc-11ed-a05b-0242ac120003', 'ItemText': itemText, 'isChecked': isChecked, 'isDeleted': false}
        ])

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
        .update([{ 'isDeleted': true, 'DeletedDate': dateNow }])
        .eq('ItemId', itemId)

        if (error) {
            console.log(error.message);
            throw new Error(error.message);
        }
    }

    async function updateData(itemId, itemText, isChecked) {
        console.log("updating record")
        console.log(itemId)
        console.log(isChecked)
        console.log(itemText)
        const {  error } = await supabase
        .from('tblListItem')
        .update([{ 'ItemText': itemText, "isChecked": isChecked }])
        .eq('ItemId', itemId)

        if(error) {
            console.log(error.message);
            throw new Error(error.message);
        }
    }

	let listInput = { id: 0, text: '', checked: false };
	let Items = [];
	let listLocked = false;

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

	function GenerateGUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
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
				{#each Items as item}
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
