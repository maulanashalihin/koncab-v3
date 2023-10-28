<script>
    import Modal from "../../../Components/Modal.svelte"; 
    import { generateUUID } from "../../../Components/helper";
    import { Log, db, pubsub } from "../../../Database/schema";
    import dayjs from "dayjs";
    let rapat = [];
 
    
    export let admins = [];
   
 
    let active_rapat = {
      list_peserta : [],
    };

    
 
    async function Loadrapat() {
       rapat = await db.rapat.toArray();
       
    }

 

    
 
 
 
    Loadrapat();
 
    let editrapatModal = false;
 
    function saverapat() {

      active_rapat.peserta = active_rapat.list_peserta.length;

       if (active_rapat.id) {
          db.rapat.put(active_rapat);
       } else {
          active_rapat.id = generateUUID();
          active_rapat.createdAt = new Date().toISOString();
          db.rapat.add(active_rapat);
       }
       Log("rapat", active_rapat);
       editrapatModal = false;
       Loadrapat();
    }
 
    pubsub.subscribe("rapat", () => {
       Loadrapat();
    });
 </script>
 
 <div>
    <!--
   Heads up! 👋
 
   This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
 --> 
    <div class="max-w-7xl mx-auto">
       <div class="flex flex-col md:flex-row gap-3 md:justify-between">
          <div class="text-xl md:text-3xl">rapat</div>
          <button
             on:click={() => {
                editrapatModal = true;
                active_rapat = {
                  list_peserta : [],
                };
             }}
             class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
             >Tambah</button
          >
       </div>
 
       <div class="mt-10 overflow-x-auto">
         {#if rapat.length}
         <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead class="ltr:text-left rtl:text-right">
             <tr>
                <th class="text-left px-4 py-2 font-medium text-gray-900">
                    Tanggal
                 </th> 
               
                <th class="text-left px-4 py-2 font-medium text-gray-900">
                   Peserta
                </th> 
             
                <th class="text-left px-4 py-2 font-medium text-gray-900">
                   Notes
                </th>
             </tr>
          </thead>
 
          <tbody class="divide-y divide-gray-200">
             {#each rapat as item}
                <tr>
                    <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                    >{dayjs(item.createdAt).format("DD-MM-YYYY")}</td
                 >
                 
                   <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                      >{item.peserta} orang ({item.list_peserta.join(",")})</td
                   >
                
                   
                   
                   <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                      > {item.note}</td
                   >
                   <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                      <button
                         type="button"
                         on:click={() => {
                            active_rapat = item;
                            editrapatModal = true;
                         }}
                         class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                         >Edit</button
                      >
                   </td>
                </tr>
             {/each}
          </tbody>
       </table>
       {:else}
          <div class="border border-dashed py-20 text-gray-500">
             <div class="text-center">Tidak ada rapat</div>
          </div>
         {/if}
       </div>
    </div>
 </div>
 
 <Modal width="max-w-lg" bind:show={editrapatModal} title="Edit rapat">
    <form on:submit|preventDefault={saverapat} class="p-4 space-y-4">
    
    
     
    
     <div class="space-y-1">
        <label for="pertemuan" class="font-medium">Catatan</label>
        <textarea
       
           bind:value={active_rapat.note}
           class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
         
           id="note"
           placeholder="Catatan"
        />
     </div>

     <div class="space-y-1">
      <label for="peserta" class="font-medium">Peserta</label>
      <div class="grid grid-cols-2">
         {#each admins as item}
            <div class="space-x-1">
               <input
                  id={item.id}
                  class="cursor-pointer"
                  type="checkbox"
                  bind:group={active_rapat.list_peserta}
                  value={item.username}
               />
               <label class="cursor-pointer" for={item.id}>
                  {item.username}</label
               >
            </div>
         {/each}
      </div>
   </div>
 
      
       <button
          type="submit"
          class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-yellow-500 bg-yellow-500 text-white hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 active:bg-yellow-700 active:border-yellow-700"
       >
          Simpan
       </button>
    </form>
 </Modal>
 