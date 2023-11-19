<script lang="ts">
  import AdaTree from "../components/AdaTree.svelte";

  let lastId: number;
  let lastColumn: number;
  let lastRow: number;

  let size = 4; 
  let board: number[] = [];
  let isOpen: boolean[] = [];
  let sizeOfRoot: number[] = [];
  let closedBricks: number[] = [];
  let virtualAbove: number;
  let virtualBelow: number;

  let neighbours = '';
  $: if (size > 0) {
    reset();
  }

  let delayTime = 1000;
  let runs = 10;
  let activations: number[] = [];
  const runButtonClickHandler = async () => {
    for (let i = 0; i < runs; i++){
      reset();
      let tries = 0;
      while (closedBricks.length > 0){
        const randomIndex = Math.floor(Math.random() * closedBricks.length);
        const boardId = closedBricks[randomIndex];
        isOpen[boardId] = true;
        closedBricks.splice(randomIndex, 1);
  
        unionWithNeighbours(boardId);
        tries++;
        if (isConnected(virtualAbove, virtualBelow)){
          break;
        }
  
        await sleep(delayTime);
      }

      activations.push(tries);
    }

    activations = [...activations];
  }

  const reset = () => {
    board = Array.from({ length: size ** 2 + 2 }, (_, index) => index);
    isOpen = Array.from({ length: size ** 2 + 2 }, (_) => false);

    virtualAbove = size ** 2;
    virtualBelow = size ** 2 + 1;
    isOpen[virtualAbove] = true;
    isOpen[virtualBelow] = true;
    sizeOfRoot = Array.from({ length: size ** 2 + 2}, (_) => 1);
    closedBricks = Array.from({ length: size ** 2}, (_, index) => index);

  };

  let clickOrder: number[] = [];
  let fullState: number[][] = [];
  const cellClickedHandler = (index: number) => {
    clickOrder = [...clickOrder, index];
    isOpen[index] = true;
    unionWithNeighbours(index);
    fullState = [...fullState, board.slice()];
  }

  const breakClickHandler = () => delayTime = 100000000;

  const unionWithNeighbours = (id: number) => {
    const [row, column] = getRowColumn(id);
    lastId = id;
    lastColumn = column;
    lastRow = row;

    neighbours = '';
    // If upper row connect to virtual parent above
    if (row === 0) {
      weightedUnion(id, virtualAbove);
      neighbours += " top ";
    }

    // If lower row connect to virtual parent below
    if (row === size - 1){
      weightedUnion(id, virtualBelow);
      neighbours += " bottom ";
    }

    const above = getIndexFromRowAndColumn(row - 1, column);
    const below = getIndexFromRowAndColumn(row + 1, column);
    const left = getIndexFromRowAndColumn(row, column - 1);
    const right = getIndexFromRowAndColumn(row, column + 1);
    
    if (row > 0 && isOpen[above]) {
      neighbours += " above ";
      weightedUnion(id, above);
    }

    if (row < size - 1 && isOpen[below]){
      neighbours += " below ";
      weightedUnion(id, below);
    }

    if (column > 0 && isOpen[left]){
      neighbours += " left ";
      weightedUnion(id, left);
    }

    if (column < size - 1 && isOpen[right]){
      neighbours += " right ";
      weightedUnion(id, right);
    }
  }

  const getRowColumn = (id: number): [number, number] => {
    const row = Math.floor(id / size);
    const column = id % size;
    return [row, column];
  }
  
  const getIndexFromRowAndColumn = (row: number, column: number) => row * size + column;

  const weightedUnion = (id1: number, id2: number) => {
    const root1 = getRoot(id1);
    const root2 = getRoot(id2);
    if (root1 === root2)
      return;

    if (sizeOfRoot[root1] > sizeOfRoot[root2]) {
      board[root2] = root1;
      sizeOfRoot[root1] += sizeOfRoot[root2];
    } else {
      board[root1] = root2;
      sizeOfRoot[root2] += sizeOfRoot[root1];
    }
  }
  
  const getRoot = (id: number): number => {
    while (id !== board[id]){
      board[id] = board[board[id]];
      id = board[id];
    }

    return id;
  }

  const isConnected = (id1: number, id2: number) => getRoot(id1) === getRoot(id2);

  $: average = activations.length ? activations.reduce((acc, val) => acc + val, 0) / activations.length : 0;
  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

</script>

<div class="" >
  <AdaTree></AdaTree>
</div>

<input type="number" bind:value={size} />
<input type="number" bind:value={delayTime} />
<input type="number" bind:value={runs} />


<button on:click={runButtonClickHandler}>Run</button>
<button on:click={breakClickHandler}>Break</button>
<br/>
<br/>
{#each board as brick, index}
  {#if index < board.length - 2}
    <div class="square {isOpen[index] ? "open" : "closed"}" on:click={() => cellClickedHandler(index)}></div>
    {#if index !== 0 && (index + 1) % size === 0}
      <br/>
    {/if}
  {/if}
{/each}
<p>Average: {average}</p>
<style>
  .square {
    width: 50px;
    height: 50px;
    border:solid 1px black;
    display: inline-block;
  }
  
  .open{ 
    background-color: rgb(41, 179, 29);
  }

  .closed{
    background-color: rgb(166, 21, 21);
  }
</style>
