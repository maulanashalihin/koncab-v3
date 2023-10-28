<script>
    let show = false;


  import { createEventDispatcher } from "svelte"; 
  const dispatchEvent = createEventDispatcher();
    import { clickOutside } from "./helper";
    export let lists = [];  
    export let label = "label";
    export let placeholder = "Search"
    export let title = "Lists"

    let filteredLists = [];

    let search = "";

    let hiLiteIndex = null;

    let carts = [];

    $: filteredLists = lists.filter((list) => {
        if(search)
        {
            show = true;
            return list[label].toLowerCase().includes(search.toLowerCase());
        }else{
            
            return list;
        }
        
    });

    const navigateList = (e) => {
        console.log(e)


	if (e.key === "ArrowDown" && hiLiteIndex <= filteredLists.length-1) {
		hiLiteIndex === null ? hiLiteIndex = 0 : hiLiteIndex += 1

        if(hiLiteIndex == filteredLists.length)
        {
            hiLiteIndex = 0;
        }

       
	} else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
		hiLiteIndex === 0 ? hiLiteIndex = filteredLists.length-1 : hiLiteIndex -= 1
        
	} else if (e.key === "Enter") {
        console.log(filteredLists[hiLiteIndex])
        dispatchEvent("select",filteredLists[hiLiteIndex])
        show = false;
	} else {
		return;
	}
} 

</script>

<svelte:window on:keydown={navigateList} />
<div class="relative w-full" use:clickOutside
on:click_outside={() => {
  show = false;
}}>
    <div>
        
        <input
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="text"
            bind:value="{search}"
            autocomplete="off" 
            on:keydown={(e)=>{
                if(e.key == "ArrowDown")
                {
                    show = true;
                }else  if(e.key == "ArrowUp")
                {
                    show = true;
                }
            }}
            placeholder="{placeholder}"
            on:focus={() => (show = true)} 
            id="custom-multiselect"
        />
    </div>

    {#if show}
        <div
        
            class="absolute end-0 z-10 mt-2 w-full divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
            role="menu"
        >
            <div class="p-2 flex  justify-between">
                <strong
                    class="block p-2 text-xs font-medium uppercase text-gray-400"
                >
                    {title}  
                </strong>
                <div class="px-3 flex items-center" >
                    <button
                    type="button"
                    on:click="{()=>{show = false}}"
                    class="-me-1 ms-1.5 inline-block rounded-full bg-gray-200 p-0.5 text-gray-700 transition hover:bg-gray-300"
                >
                    <span class="sr-only">Close Dropdown</span>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-3 w-3"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                </div>
            </div>

            <div class="p-2 max-h-40 overflow-auto">
                {#each filteredLists as list,index}
                    <button
                        type="button"
                        on:click="{()=>{
                            dispatchEvent("select",list);
                            show = false;
                        }}"
                        class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-cyan-50 {hiLiteIndex == index ? 'bg-cyan-50 text-cyan-600' : ''}"
                        role="menuitem"
                    >
                        {list[label]}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>
