<script>
   import Modal from "../../../Components/Modal.svelte";
   import dayjs from "dayjs";
   import { Log, db, pubsub } from "../../../Database/schema";
   import "dayjs/locale/id";
   dayjs.locale("id");

   let peserta = [];

   let hs = [];

   let active_hs = {
      list_peserta: [],
      tanggal: dayjs().format("YYYY-MM-DD"),
   };

   async function Loadpeserta() {
      peserta = await db.peserta.where({ status: "K" }).toArray();
   }

   async function LoadHS() {
      hs = await db.hs.toArray();
   }

   LoadHS();

   Loadpeserta();

   let edithsModal = false;

   function saveHs() {
      active_hs.peserta = active_hs.list_peserta.length;
      active_hs.persentage = Math.round(
         (active_hs.peserta / peserta.length) * 100
      );
      active_hs.bulan = dayjs(active_hs.tanggal).format("MMMM YYYY");
      active_hs.id = dayjs(active_hs.tanggal).format("YYYYMM");

      db.hs.put(active_hs);

      Log("hs", active_hs);

      edithsModal = false;

      LoadHS();
   }

   pubsub.subscribe("hs", () => {
      LoadHS();
   });
</script>

<div> 
   <div class="max-w-7xl mx-auto ">
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">HS</div>
         <button
            on:click={() => {
               edithsModal = true;
               active_hs = {
                  list_peserta: [],
                  tanggal: dayjs().format("YYYY-MM-DD"),
               };
            }}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Tambah</button
         >
      </div>

      <div class="mt-10 overflow-x-auto">
         {#if hs.length}
            <table
               class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm"
            >
               <thead class="ltr:text-left rtl:text-right">
                  <tr>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Bulan
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Tanggal
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Pembicara
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Peserta
                     </th>
                  </tr>
               </thead>

               <tbody class="divide-y divide-gray-200">
                  {#each hs as item}
                     <tr>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.bulan}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.tanggal || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.pembicara || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           {item.peserta || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           <button
                              type="button"
                              on:click={() => {
                                 active_hs = item;
                                 edithsModal = true;
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
               <div class="text-center">Tidak ada HS</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={edithsModal} title="Edit HS">
   <form on:submit|preventDefault={saveHs} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="tanggal" class="font-medium">Tanggal</label>
         <input
            required
            bind:value={active_hs.tanggal}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="date"
            id="tanggal"
         />
      </div>
      <div class="space-y-1">
         <label for="pembicara" class="font-medium">Pembicara</label>

         <select
            required
            bind:value={active_hs.pembicara}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
          
            id="pembicara"
         >
            {#each peserta as item}
               <option value={item.name}>{item.name}</option>
            {/each}
         </select>
      </div>
      <div class="space-y-1">
         <label for="note" class="font-medium">Catatan</label>
         <textarea
            bind:value={active_hs.note}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
         
            id="note"
            placeholder="Catatan HS"
         />
      </div>
      <div class="space-y-1">
         <label for="peserta" class="font-medium">Peserta</label>
         <div class="grid grid-cols-2">
            {#each peserta as item}
               <div class="space-x-1">
                  <input
                     id={item.id}
                     class="cursor-pointer"
                     type="checkbox"
                     bind:group={active_hs.list_peserta}
                     value={item.name}
                  />
                  <label class="cursor-pointer" for={item.id}>
                     {item.name}</label
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
