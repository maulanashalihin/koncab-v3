<script>
   import Modal from "../../../Components/Modal.svelte";
   import { MediaPrice, generateUUID } from "../../../Components/helper";
   import { Log, db, pubsub } from "../../../Database/schema";

   let peserta = [];

   let groups = [];

   let group_obj = {};

   let active_peserta = {};

   let website = localStorage.getItem("website")
      ? JSON.parse(localStorage.getItem("website"))
      : {};


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
      active_peserta.total_spp = active_peserta.iltizamat + active_peserta.tabarruat + active_peserta.buletin * MediaPrice[website.Area].buletin + active_peserta.tabloid  * MediaPrice[website.Area].tabloid + active_peserta.majalah  * MediaPrice[website.Area].majalah;
      if (active_peserta.id) {
         db.peserta.put(active_peserta);
      } else {
         active_peserta.id = generateUUID();
         db.peserta.add(active_peserta);
      }
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
                           >{item.status}</td
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

      <div class="grid grid-cols-2 gap-3">
         <div class="space-y-1">
            <label for="iltizamat" class="font-medium">Iltizamat</label>
            <input
               required
               bind:value={active_peserta.iltizamat}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="iltizamat"
               placeholder="60000"
            />
         </div>
         <div class="space-y-1">
            <label for="tabarruat" class="font-medium">Tabarruat</label>
            <input
               required
               bind:value={active_peserta.tabarruat}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="tabarruat"
               placeholder="60000"
            />
         </div>
         <div class="space-y-1">
            <label for="buletin" class="font-medium">Jlh Buletin</label>
            <input
               required
               bind:value={active_peserta.buletin}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="buletin"
               placeholder="5"
            />
         </div>
         <div class="space-y-1">
            <label for="tabloid" class="font-medium">Jlh Tabloid</label>
            <input
               required
               bind:value={active_peserta.tabloid}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="tabloid"
               placeholder="5"
            />
         </div>
         <div class="space-y-1">
            <label for="majalah" class="font-medium">Jlh Majalah</label>
            <input
               required
               bind:value={active_peserta.majalah}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="majalah"
               placeholder="5"
            />
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
