<script>
    export let checked;
</script>

<div class="custom-checkbox">
	<input type="checkbox" id="checkbox" class="hidden-checkbox" bind:checked={checked}/>
	<label for="checkbox" class="styled-checkbox" />
</div>


<style>
    .custom-checkbox {
        width: fit-content;
        padding: 0;
        margin: 0;
        margin-right: .5rem;
    }

	/* Hide the default checkbox */
	.hidden-checkbox {
		position: absolute;
		opacity: 0;
		cursor: pointer;
	}

	/* Create a custom checkbox */
	.styled-checkbox {
		position: relative;
		height: 25px;
		width: 25px;
		background-color: var(--unfocused-color);
        opacity: .3;
		cursor: pointer;
		display: block;
        transition: 0.3s;
	}

	/* Create the checkmark/indicator (hidden when not checked) */
	.styled-checkbox:after {
		content: '';
		position: absolute;
		display: none;
	}

	/* Show the checkmark when checked */
	.hidden-checkbox:checked ~ .styled-checkbox:after {
		display: block;
	}

	/* Style the checkmark/indicator */
	.styled-checkbox:after {
		left: 9px;
		top: 5px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-width: 0 3px 3px 0;
		transform: rotate(45deg);
	}

	/* When the checkbox is checked, add a blue background */
	.hidden-checkbox:checked ~ .styled-checkbox {
		background-color: var(--accent-color) !important;
        opacity: 1 !important;
	}
</style>
