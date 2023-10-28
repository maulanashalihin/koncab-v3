<script>
    import Modal from "../../../Components/Modal.svelte"; 
    import { generateUUID } from "../../../Components/helper";
    import { Log, db, pubsub } from "../../../Database/schema";
    import dayjs from "dayjs";
    let upgrade = [];
 
    
 
   
 
    let active_upgrade = {
         
    };

    
 
    async function Loadupgrade() {
       upgrade = await db.upgrade.toArray();
       
    }

 

    
 
 
 
    Loadupgrade();
 
    let editupgradeModal = false;
 
    function saveupgrade() {
       if (active_upgrade.id) {
          db.upgrade.put(active_upgrade);
       } else {
          active_upgrade.id = generateUUID();
          active_upgrade.createdAt = new Date().toISOString();
          db.upgrade.add(active_upgrade);
       }
       Log("upgrade", active_upgrade);
       editupgradeModal = false;
       Loadupgrade();
    }
 
    pubsub.subscribe("upgrade", () => {
       Loadupgrade();
    });
 </script>
 
 <div>
    <!--
   Heads up! 👋
 
   This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
 --> 
    <div class="max-w-7xl mx-auto">
       <div class="flex flex-col md:flex-row gap-3 md:justify-between">
          <div class="text-xl md:text-3xl">upgrade</div>
          <button
             on:click={() => {
                editupgradeModal = true;
                active_upgrade = {};
             }}
             class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
             >Tambah</button
          >
       </div>
 
       <div class="mt-10 overflow-x-auto">
         {#if upgrade.length}
         <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead class="ltr:text-left rtl:text-right">
             <tr>
                <th class="text-left px-4 py-2 font-medium text-gray-900">
                    Tanggal
                 </th> 
                <th class="text-left px-4 py-2 font-medium text-gray-900">
                   Name
                </th>
                <th class="text-left px-4 py-2 font-medium text-gray-900">
                   Status
                </th> 
             
                <th class="text-left px-4 py-2 font-medium text-gray-900">
                   Notes
                </th>
             </tr>
          </thead>
 
          <tbody class="divide-y divide-gray-200">
             {#each upgrade as item}
                <tr>
                    <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                    >{dayjs(item.createdAt).format("DD-MM-YYYY")}</td
                 >
                   <td
                      class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                   >
                      {item.name}
                   </td>
                   <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                      >{item.status}</td
                   >
                
                   
                   
                   <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                      > {item.note}</td
                   >
                   <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                      <button
                         type="button"
                         on:click={() => {
                            active_upgrade = item;
                            editupgradeModal = true;
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
             <div class="text-center">Tidak ada upgrade</div>
          </div>
         {/if}
       </div>
    </div>
 </div>
 
 <Modal width="max-w-lg" bind:show={editupgradeModal} title="Edit upgrade">
    <form on:submit|preventDefault={saveupgrade} class="p-4 space-y-4">
       <div class="space-y-1">
          <label for="name" class="font-medium">Nama</label>
          <input
             required
             bind:value={active_upgrade.name}
             class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
             type="text"
             id="name"
             placeholder="Masukan Nama"
          />
       </div>
       <div class="space-y-1">
        <label for="status" class="font-medium">Status</label>
        <select
           required
           bind:value={active_upgrade.status}
           class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
         
           id="status"
        >
           <option value="HU Baru">HU Baru</option>
           <option value="HU ke CP">HU ke CP</option>
           <option value="CP ke P">CP ke P</option>
           <option value="P ke K">P ke K</option>
        </select>
     </div>
    
     
    
     <div class="space-y-1">
        <label for="pertemuan" class="font-medium">Catatan</label>
        <textarea
       
           bind:value={active_upgrade.note}
           class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
           
           id="note"
           placeholder="Catatan"
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
 