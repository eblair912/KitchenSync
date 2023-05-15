<script>
    import ListItem from "../components/ListItem.svelte";
    
    let createNewList = false;
    let listInput = {id: 0, text: '', checked: false};
    let Items = [];
    let currentListId = 1;

    const listKeydown = (event) => {
        if(event.key === 'Enter' || event.keyCode === 13) {
            listEvent();
        }
    }

    const listEvent = () => {
        let listTextInput = listInput.text;
        let listIdInput = listInput.id;
        let listChecked = listInput.checked;

        if(listTextInput.trim() != '') {
            if(Items.some(item => item.id === listIdInput)){
                // This is an existing item
                let itemToUpdate = Items.find(item => item.id === listIdInput);
                if(itemToUpdate){
                    itemToUpdate.text = listTextInput;
                    itemToUpdate.checked = listChecked;
                }
            } else {
                // This is a new item
                Items = [...Items, {id: currentListId, text: listTextInput, checked: listChecked}]
                currentListId++;
            }      
        }
        console.log(Items);
        listInput = {id: 0, text: '', checked: false}
    }

    function createList()
    {
        createNewList = !createNewList;
    }
</script>

<div class="main-container">
    <div class="block-centered" style="width:100vw;">
        {#if Items.length == 0 && !createNewList}
            <button class="primary-button" id="createListButton" on:click={createList}>Create New List</button>
        {:else}
            <div class="parent-list">
                {#each Items as listItem}
                    <ListItem bind:enteredText={listItem.text} bind:checked={listItem.checked} handleListEvent={listEvent} handleKeyDownEvent={listKeydown} />
                {/each}
                <ListItem bind:enteredText={listInput.text} bind:checked={listInput.checked} handleListEvent={listEvent} handleKeyDownEvent={listKeydown} />
            </div>  
        {/if}   


    </div>  
</div>


