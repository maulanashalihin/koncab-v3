<script>
   import Modal from "../../../Components/Modal.svelte";
 
   import dayjs from "dayjs";
   import { Log, db, pubsub } from "../../../Database/schema";
   import { onMount } from "svelte";

   let kontak = [];

   let start_date = dayjs().subtract(1, "month").format("YYYY-MM-DD");
   let end_date = dayjs().format("YYYY-MM-DD");

   let active_kontak = {};

   let pengontak = [];

   let website = localStorage.getItem("website")
      ? JSON.parse(localStorage.getItem("website"))
      : {}; 


   async function Loadkontak() {
      kontak = await db.kontak
         .where("createdAt")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .reverse()
         .sortBy("createdAt");
      pengontak = await db.peserta.toArray();
   }

   let editkontakModal = false;

   function savekontak() {
      if (active_kontak.id) {
         db.kontak.put(active_kontak);
      } else {
         active_kontak.id = active_kontak.name;
         active_kontak.createdAt = dayjs().format("YYYY-MM-DD");
         db.kontak.add(active_kontak);
      }
      Log("kontak", active_kontak);
      editkontakModal = false;
      Loadkontak();
   }

   pubsub.subscribe("kontak", () => {
      Loadkontak();
   });

   onMount(() => {
      setTimeout(() => {
         // @ts-ignore
         const picker = new easepick.create({
            element: document.getElementById("datepicker"),
            css: [
               "https://cdn.jsdelivr.net/npm/@easepick/core@1.2.1/dist/index.css",
               "https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css",
            ],
            plugins: ["RangePlugin"],
            RangePlugin: {
               tooltip: true,
            },
            setup(picker) {
               picker.on("select", (e) => {
                  const { end, start } = e.detail;
                  start_date = dayjs(start).format("YYYY-MM-DD");
                  end_date = dayjs(end).format("YYYY-MM-DD");
                  Loadkontak();
                  // do something
               });
            },
         });

         picker.setDateRange(start_date, end_date);
         Loadkontak();
      }, 100);
   });
</script>

<div>
   <!--
   Heads up! 👋
 
   This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
 -->
   <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">kontak</div>
         <button
            on:click={() => {
               editkontakModal = true;
               active_kontak = {};
            }}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Tambah</button
         >
      </div>

      <div class="mt-10 overflow-x-auto">
         <div class="lg:w-96 max-w-full mb-3">
            <input
               id="datepicker"
               class="px-3 py-2 w-full border outline-none focus:border-orange-400"
               type="text"
            />
         </div>
         {#if kontak.length}
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
                        Pertemuan
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Mulai
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        pengontak
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Notes
                     </th>
                  </tr>
               </thead>

               <tbody class="divide-y divide-gray-200">
                  {#each kontak as item}
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
                           >{item.pertemuan || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.createdAt || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.pengontak || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           {item.note || ""}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           <button
                              type="button"
                              on:click={() => {
                                 active_kontak = item;
                                 editkontakModal = true;
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
               <div class="text-center">Tidak ada kontak</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={editkontakModal} title="Edit kontak">
   <form on:submit|preventDefault={savekontak} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="name" class="font-medium">Nama</label>
         <input
            required
            bind:value={active_kontak.name}
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
            bind:value={active_kontak.status}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="status"
         >
            <option value="Target">Target</option>
            <option value="Prospek">Prospek</option>
            {#if website.User == "Rijal"}
            <option value="Deal">Deal (Ikut Daurah)</option>
            <option value="Sukses">Sukses (Jadi HU)</option>
            {:else}
            <option value="Sukses">Sukses (IM)</option>
            {/if}
           
            <option value="Mundur">Mundur</option>
         </select>
      </div>
      <div class="space-y-1">
         <label for="pengontak" class="font-medium">pengontak</label>

         <select
            required
            bind:value={active_kontak.pengontak}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="pengontak"
         >
            {#each pengontak as item}
               <option value={item.name}>{item.name}</option>
            {/each}
         </select>
      </div>
      <div class="space-y-1">
         <label for="pertemuan" class="font-medium">Pertemuan</label>
         <input
            required
            bind:value={active_kontak.pertemuan}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="number"
            id="pertemuan"
            placeholder="Jumlah Pertemuan"
         />
      </div>

      <div class="space-y-1">
         <label for="pertemuan" class="font-medium">Catatan</label>
         <textarea
            bind:value={active_kontak.note}
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
