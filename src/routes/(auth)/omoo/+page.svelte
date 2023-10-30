<script>
    import Modal from "../../../Components/Modal.svelte";
    import { MediaPrice, generateUUID } from "../../../Components/helper";
    import { Log, db, pubsub } from "../../../Database/schema";
 
    let peserta = [];
  
 
    let active_peserta = {};
 
   
 
    async function Loadpeserta() {
       peserta = await db.peserta.toArray();
    }
 
   
 
    Loadpeserta();
 
    let editpesertaModal = false;
 
    function savepeserta() {
      
       Log("peserta", active_peserta);
       editpesertaModal = false;
       Loadpeserta();
    }
 
    pubsub.subscribe("peserta", () => {
       Loadpeserta();
    });
 </script>
 
 <div>
    <div>
       <div class="flex flex-col md:flex-row gap-3 md:justify-between">
          <div class="text-xl md:text-3xl">Anggota</div>
          <button
             on:click={() => {
                editpesertaModal = true;
                active_peserta = {};
             }}
             class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
             >Tambah</button
          >
       </div>
 
       <div class="mt-10 overflow-x-auto">
          {#if peserta.length}
             <table
                class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm"
             >
                <thead class="ltr:text-left rtl:text-right">
                   <tr>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Name
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Status
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Omoo Id
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Open
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Share
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Action
                      </th>
                   </tr>
                </thead>
 
                <tbody class="divide-y divide-gray-200">
                   {#each peserta as item}
                      <tr>
                         <td
                            class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                         >
                            {item.name}
                         </td>
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                            >{item.status}</td
                         > <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                         >{  "-"}</td
                      >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                            >{  "-"}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                            >{ "-"}</td
                         >
                         
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            <button
                               type="button"
                               on:click={() => {
                                  active_peserta = item;
                                  editpesertaModal = true;
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
                <div class="text-center">Tidak ada Anggota</div>
             </div>
          {/if}
       </div>
    </div>
 </div>
 
 <Modal width="max-w-lg" bind:show={editpesertaModal} title="Edit Anggota">
    <form on:submit|preventDefault={savepeserta} class="p-4 space-y-4">
       <div class="space-y-1">
          <label for="name" class="font-medium">Nama</label>
          <input
             required
             bind:value={active_peserta.name}
             class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
             type="text"
             id="name"
             placeholder="Masukan Nama"
          />
       </div>
 
       <div class="space-y-1">
        <label for="omoo_id" class="font-medium">Omoo Id</label>
        <input
           required
           bind:value={active_peserta.omoo_id}
           class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
           type="text"
           id="omoo_id" 
           placeholder="Masukan Omoo Id"
        />
     </div>
 
    
       <button
          type="submit"
          class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-yellow-500 bg-yellow-500 text-white hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 active:bg-yellow-700 active:border-yellow-700"
       >
          Simpan
       </button>
    </form>
 </Modal>
 