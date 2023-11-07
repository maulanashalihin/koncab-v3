<script>
   import Modal from "../../../Components/Modal.svelte";
   import dayjs from "dayjs";
   import { Log, db, pubsub } from "../../../Database/schema";
   import "dayjs/locale/id";
   import { generateRandomString } from "../../../Components/helper";

   dayjs.locale("id");
   let kr = [];

   let active_kr = {};

   async function Loadmt() {
      kr = await db.kr.toArray();
   }

   Loadmt();

   let editmtModal = false;

   function savemt() {
      active_kr.bulan = dayjs(active_kr.tanggal).format("MMMM YYYY");
      if (active_kr.id) {

         db.kr.put(active_kr);

      } else {
         active_kr.id =
            dayjs(active_kr.tanggal).format("YYYY-MM-DD-") +
            generateRandomString(5);

         db.kr.add(active_kr);
      }

      Log("kr", active_kr);

      editmtModal = false;

      Loadmt();
   }

   pubsub.subscribe("kr", () => {
      Loadmt();
   });
</script>

<div>
   <!--
   Heads up! 👋
 
   This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
 -->
   <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">KR</div>
         <button
            on:click={() => {
               editmtModal = true;
               active_kr = {
                  tanggal: dayjs().format("YYYY-MM-DD"),
               };
            }}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Tambah</button
         >
      </div>

      <div class="mt-10 overflow-x-auto">
         {#if kr.length}
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
                  {#each kr as item}
                     <tr>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.bulan || "-"}</td
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
                                 active_kr = item;
                                 editmtModal = true;
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
               <div class="text-center">Tidak ada kr</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={editmtModal} title="Edit kr">
   <form on:submit|preventDefault={savemt} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="tanggal" class="font-medium">Tanggal</label>
         <input
            required
            bind:value={active_kr.tanggal}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="date"
            id="tanggal"
         />
      </div>
      <div class="space-y-1">
         <label for="jenis" class="font-medium">Jenis</label>
         <select
            required
            bind:value={active_kr.jenis}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="jenis"
         >
            {#each ["Offline", "Online"] as item}
               <option value={item}>{item}</option>
            {/each}
         </select>
      </div>
      <div class="space-y-1">
         <label for="pembicara" class="font-medium">Pembicara</label>
         <input
            required
            bind:value={active_kr.pembicara}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="text"
            id="pembicara"
            placeholder="Tuliskan nama pembicara"
         />
      </div>
      <div class="space-y-1">
         <label for="note" class="font-medium">Catatan</label>
         <textarea
            bind:value={active_kr.note}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="note"
            placeholder="Catatan"
         />
      </div>
      <div class="space-y-1">
         <label for="peserta" class="font-medium">Peserta</label>
         <input
            required
            bind:value={active_kr.peserta}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="number"
            id="peserta"
            placeholder="Tuliskan jumlah peserta"
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
