<script>
	import ListItem from '../components/ListItem.svelte';
	import { goto } from '$app/navigation';
    import LockList from '../components/LockList.svelte';

	let listInput = { id: 0, text: '', checked: false };
	let Items = [];
	let currentListId = 1;
    let listLocked = false;

	const listKeydown = (event, item) => {
		if (event.key === 'Enter' || event.keyCode === 13) {
			listEvent(item);
		}
	};

	const listEvent = (listItem) => {
		let listTextInput = listItem == null ? listInput.text: listItem.text;
		let listIdInput = listItem == null ? currentListId: listItem.id;
        let listCheckedInput = listItem == null ? listInput.checked: listItem.checked;

		if (listTextInput.trim() != '') {
			// This is an existing item
            let itemToUpdate = Items.find((item) => item.id === listIdInput);
            if (itemToUpdate) {
                itemToUpdate.text = listTextInput;
                itemToUpdate.checked = listCheckedInput;
            } else {
				// This is a new item
				Items = [...Items, { id: currentListId, text: listTextInput, checked: listCheckedInput }];
				currentListId++;
			}
		}

		listInput = { id: 0, text: '', checked: false };
	};

    function deleteItem(id){
        Items = Items.filter(item => item.id != id);
    }

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
    }
</script>

<div class="header">
    <span class="header-text">KitchenSync</span>
    <div class="locklist-position">
        <LockList listLocked={listLocked} lockClick={lockClick} hideButton={Items.length == 0} />
    </div>  
</div>
<div class="main-container">
    <div class="block-centered" style="width:100vw;">
        <div class="parent-list">
            <div class="centered-list">
                {#each Items as item}
                <ListItem
                    bind:enteredText={item.text}
                    bind:checked={item.checked}
                    handleListEvent={() => listEvent(item)}
                    handleKeyDownEvent={(event) => listKeydown(event, item)}
                    handleDelete={() => deleteItem(item.id)}
                    hideButton={listLocked}
                    locked={listLocked}
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
            />
            </div>		
        </div>
    </div>
</div>


