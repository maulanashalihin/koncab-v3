<script>
   import { stringify } from "postcss";
   import Modal from "../../../Components/Modal.svelte";
   import { generateUUID } from "../../../Components/helper";
   import { Log, db, pubsub } from "../../../Database/schema";
   import dayjs from "dayjs";

   let ia = [];

   let clone_ia = [];

   let active_ia = {};

   let guru = [];

   let list_contacts = [];

   let is_mundur = false;

   let action = "";

   async function Loadia() {
      ia = await db.ia.reverse().sortBy("createdAt");

      clone_ia = ia;

      guru = await db.peserta.orderBy("name").toArray();

      list_contacts = await db.kontak
         .where("status")
         .equals("Sukses")
         .toArray();
      list_contacts = list_contacts.filter((item) => {
         return !ia.find((ia) => ia.name == item.name);
      });
   }

   Loadia();

   let editiaModal = false;

   function saveia() {
      if (active_ia.id) {
        
         active_ia.updatedAt = dayjs().format("YYYY-MM-DD");

         db.ia.put(active_ia);

           
      } else {
        
      }
      Log("ia", active_ia);
      editiaModal = false;
      Loadia();
   }

   pubsub.subscribe("ia", () => {
      Loadia();
   });

   let search = "";

   function DoingSearch() {
      if (search == "") {
         ia = clone_ia;
      } else {
         const lower_search = search.toLowerCase();

         ia = clone_ia.filter((item) => {
           

            return (
               item.name.toLowerCase().includes(lower_search) ||
               item.status.toLowerCase().includes(lower_search) ||
               (item.guru || '').toLowerCase().includes(lower_search) ||
               (item.hari || '').toLowerCase().includes(lower_search)
            );
         });
      }
   }
</script>

<div>
   <!--
    Heads up! 👋
  
    This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
  -->
   <div class="">
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">IA</div>
    
      </div>

      <div class="mt-10 overflow-x-auto">
         <div class="w-96 max-w-full mb-3">
            <input
               bind:value={search}
               on:input={DoingSearch}
               class="px-3 py-2 border outline-none focus:border-orange-400"
               type="text"
               placeholder="Search"
            />
         </div>
         {#if ia.length}
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
                        Tanggal
                     </th>
                  </tr>
               </thead>

               <tbody class="divide-y divide-gray-200">
                  {#each ia as item}
                     <tr>
                        <td
                           class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                        >
                           {item.name}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.status}</td
                        >
                       
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.createdAt || "-"}</td
                        >
                       
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           <!-- <button
                           type="button"
                           on:click={() => {
                              active_ia = item;
                              editiaModal = true;
                              action = "";
                           }}
                           class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                           >Upgrade</button
                        > -->
                        </td>
                     </tr>
                  {/each}
               </tbody>
            </table>
         {:else}
            <div class="border border-dashed py-20 text-gray-500">
               <div class="text-center">Tidak ada ia</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={editiaModal} title="Edit ia">
   <form on:submit|preventDefault={saveia} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="name" class="font-medium">Nama</label>
         <input
         disabled
         bind:value={active_ia.name}
         class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
         id="name"
      />
      </div>
        
      

      <div class="space-y-1">
         <label for="pertemuan" class="font-medium">Catatan</label>
         <textarea
            bind:value={active_ia.note}
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
