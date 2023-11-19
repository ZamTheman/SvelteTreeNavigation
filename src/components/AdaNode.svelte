<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from 'flowbite-svelte';
  import { Icon, Minus, Plus } from "svelte-hero-icons";

  export let id: string = '';
  export let text: string;
  export let isExpanded: boolean = false;
  export let isActive: boolean = false;
  export let type: EntityType;
  export let indentLevel: number = 0;

  const isHeader = type == 'header';

  const dispatch = createEventDispatcher();

  const itemExpanderClicked = (event: MouseEvent) => {
    isExpanded = !isExpanded;
    event?.stopPropagation();
  }

  const itemClickedHandler = () => {
    const detail: SelectedEventDetail = {
      id: id,
      type: type
    }

    dispatch('selected', detail)
  }
</script>

<div
  on:click={itemClickedHandler}
  class="{isActive ? 'bg-gray-300' : 'bg-gray-200'} {isHeader ? '' : 'hover:bg-gray-400 cursor-pointer'} m-1 rounded-lg p-2 pl-0 {'ml-[' + indentLevel + 'px]'} w-64"
  style="margin-left: {indentLevel * 10}px">
  {#if type != 'header'}
  <Button class="float-left mr-2 pl-2 pr-2" on:click={itemExpanderClicked}>
    <Icon
      src={isExpanded ? Minus : Plus}
      size=24
      class="hover:bg-white bg-gray-400 rounded-lg p-1"/>
  </Button>
  {/if}
  <p class="{isHeader ? 'ml-4' : ''}">{text}</p>
</div>
