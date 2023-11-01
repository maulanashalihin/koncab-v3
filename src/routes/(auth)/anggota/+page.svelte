<script>
   import { split } from "postcss/lib/list";
   import Modal from "../../../Components/Modal.svelte";
   import {
      MediaPrice,
      dataToJSON,
      generateUUID,
   } from "../../../Components/helper";
   import { Log, db, pubsub } from "../../../Database/schema";

   let peserta = [];

   let groups = [];

   let group_obj = {};

   let active_peserta = {};

   let bulk_add_modal = false;

   let bulk_text = "";

   let bulk_data = [];

 
   async function Loadpeserta() {
      peserta = await db.peserta.toArray();
   }

   (async () => {
      groups = await db.groups.toArray();
      groups.forEach((item) => {
         group_obj[item.id] = item;
      });
   })();

   Loadpeserta();

   let editpesertaModal = false;

   function savepeserta() {
      active_peserta.guru_index = active_peserta.is_guru ? 1 : 0;
    

      if (active_peserta.id) {
         db.peserta.put(active_peserta);
         Log("peserta", active_peserta);
      } else {
         active_peserta.id = active_peserta.name;
         active_peserta.total_spp = 0 ;
         db.peserta.add(active_peserta);
         Log("peserta", active_peserta);
      }
      editpesertaModal = false;
      Loadpeserta();
   }

   // pubsub.subscribe("peserta", () => {
   //    Loadpeserta();
   // });

   async function saveBulk() {
      for await (const item of bulk_data) {
         item.id = item.name;

         const check = await db.peserta.get(item.id);

         if (check) {
            check.name = item.name;
            check.status = item.status;
            check.is_guru = item.is_guru;
            check.guru_index = check.is_guru ? 1 : 0;

            await db.peserta.put(check);
            Log("peserta", check);
         } else {
            item.guru_index = item.is_guru ? 1 : 0;
            item.iltizamat = 0;
            item.tabarruat = 0;
            item.total_spp = 0;
            item.buletin = 0;
            item.majalah = 0;
            item.tabloid = 0;
            await db.peserta.add(item);
            Log("peserta", item);
         }
      }
      Loadpeserta();
      bulk_add_modal = false;
   }
</script>

<div>
   <div>
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">Anggota</div>
         <div class="flex gap-1">
            <button
               on:click={() => {
                  bulk_add_modal = true;
                  active_peserta = {};
               }}
               class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               >Bulk +</button
            >
            <button
               on:click={() => {
                  editpesertaModal = true;
                  active_peserta = {};
               }}
               class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               >Tambah</button
            >
         </div>
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
                        Modul
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Bab | Halaman
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Guru
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
                           >{item.status} {item.is_guru ? '(Guru)' : ''}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.modul || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.halaman || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{group_obj[item.group_id]
                              ? group_obj[item.group_id].guru
                              : "-"}</td
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
         <label for="status" class="font-medium">Status</label>
         <select
            required
            bind:value={active_peserta.status}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="status"
         >
            <option value="P">P</option>
            <option value="K">K</option>
         </select>
      </div>
      {#if active_peserta.status == "K"}
         <div class="flex gap-2">
            <input
               type="checkbox"
               id="is_guru"
               bind:checked={active_peserta.is_guru}
            />
            <label for="is_guru">Seorang Guru</label>
         </div>
      {/if}

       

      <button
         type="submit"
         class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-yellow-500 bg-yellow-500 text-white hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 active:bg-yellow-700 active:border-yellow-700"
      >
         Simpan
      </button>
   </form>
</Modal>

<Modal width="max-w-lg" bind:show={bulk_add_modal} title="Bulk Upload">
   <form on:submit|preventDefault={saveBulk} class="p-4 space-y-4">
      <img src="/sample-paste.png" alt="">
      <div class="text-gray-500">
         <p>copy data dari excell dengan kolom 1 berisi nama, dan kolom 2 berisi status</p>
      </div>
      <div class="space-y-1">
         <label for="bulk_text" class="font-medium">Upload Data</label>

         <textarea
            bind:value={bulk_text}
            on:input={() => {
               bulk_data = dataToJSON(bulk_text.split("\n"));
               console.log(bulk_data);
            }}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="bulk_text"
            placeholder="Paste data dari excell ke sini"
            cols="30"
            rows="10"
         />
      </div>

      <!--
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
-->

      <div class="overflow-x-auto">
         <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead class="text-left">
               <tr>
                  <th
                     class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                  >
                     Nama
                  </th>
                  <th
                     class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                  >
                     Status
                  </th>
                  <th
                     class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                  >
                     Guru
                  </th>
               </tr>
            </thead>

            <tbody class=" ">
               {#each bulk_data as item}
                  <tr>
                     <td
                        class="whitespace-nowrap border px-4 py-2 font-medium text-gray-900"
                     >
                        <input type="text" bind:value={item.name} />
                     </td>
                     <td
                        class="whitespace-nowrap border px-4 py-2 text-gray-700"
                     >
                        <input type="text" bind:value={item.status} /></td
                     >
                     <td
                        class="whitespace-nowrap border px-4 py-2 text-gray-700"
                     >
                        <input
                           type="checkbox"
                           bind:checked={item.is_guru}
                        /></td
                     >
                  </tr>
               {/each}
            </tbody>
         </table>
      </div>

      <button
         type="submit"
         class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-yellow-500 bg-yellow-500 text-white hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 active:bg-yellow-700 active:border-yellow-700"
      >
         Simpan
      </button>
   </form>
</Modal>
