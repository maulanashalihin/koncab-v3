<script>
   import { onMount } from "svelte";
   import Modal from "../../../Components/Modal.svelte";
   import { generateUUID } from "../../../Components/helper";
   import { Log, db, pubsub } from "../../../Database/schema";
   import dayjs from "dayjs";
   let mutasi = [];

   let active_mutasi = {};

   let start_date = dayjs().subtract(1, "month").format("YYYY-MM-DD");
   let end_date = dayjs().format("YYYY-MM-DD");

   let status = "P";

   let peserta = [];

   async function Loadmutasi() {
      mutasi = await db.mutasi
         .where("createdAt")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .reverse()
         .sortBy("createdAt");
         console.log(mutasi)
      peserta = await db.peserta.toArray();
   }

   Loadmutasi();

   let editmutasiModal = false;

   async function savemutasi() {

      const check = await db.peserta.where("name").equals(active_mutasi.name).first();

      if(check && active_mutasi.status == "Masuk")
      {
         alert(  `Nama ${check.name} sudah digunakan`);
         return;
      }

         active_mutasi.id = generateUUID();
         active_mutasi.createdAt = dayjs().format("YYYY-MM-DD");
         active_mutasi.keanggotaan = status;

         await db.mutasi.add(active_mutasi);

         if (active_mutasi.status == "Masuk") {
            await db.peserta.add({
               id: active_mutasi.name,
               status: status,
               name: active_mutasi.name,
               createdAt: dayjs().format("YYYY-MM-DD"),
            });
            await Log("peserta", {
               id: active_mutasi.name,
               status: status,
               name: active_mutasi.name,
               createdAt: dayjs().format("YYYY-MM-DD"),
            });
         } else {
            await db.peserta.delete(active_mutasi.name);
            Log(
               "peserta",
               {
                  id: active_mutasi.id,
                  status: status,
                  name: active_mutasi.name,
                  createdAt: dayjs().format("YYYY-MM-DD"),
               },
               "delete"
            );

            if(active_mutasi.status == "Berhenti")
            {
               const ia_data = {
                  id: generateUUID(),
                  name: active_mutasi.name,
                  status: "IA dari " + status,
                  createdAt: dayjs().format("YYYY-MM-DD"),
               };


               await db.ia.add(ia_data);
               
               Log(
                  "ia",
                  {
                     id: active_mutasi.id,
                     status: status,
                     name: active_mutasi.name,
                     createdAt: dayjs().format("YYYY-MM-DD"),
                  },
                  "delete"
               );
            }
         }
      Log("mutasi", active_mutasi);
      editmutasiModal = false;

      Loadmutasi();
   }

   pubsub.subscribe("mutasi", () => {
      Loadmutasi();
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
                  Loadmutasi();
                  // do something
               });
            },
         });

         picker.setDateRange(start_date, end_date);
         Loadmutasi();
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
         <div class="text-xl md:text-3xl">mutasi</div>
         <button
            on:click={() => {
               editmutasiModal = true;
               active_mutasi = {
                  name: "",
               };
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
         {#if mutasi.length}
            <table
               class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm"
            >
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
                  {#each mutasi as item}
                     <tr>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{dayjs(item.createdAt).format("DD-MM-YYYY")}</td
                        >
                        <td
                           class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                        >
                           {item.name} ({item.keanggotaan})
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.status}</td
                        >

                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           {item.note || ""}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700" />
                     </tr>
                  {/each}
               </tbody>
            </table>
         {:else}
            <div class="border border-dashed py-20 text-gray-500">
               <div class="text-center">Tidak ada mutasi</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={editmutasiModal} title="Edit mutasi">
   <form on:submit|preventDefault={savemutasi} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="status" class="font-medium">Status</label>
         <select
            required
            bind:value={active_mutasi.status}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="status"
         >
            <option value="Masuk">Masuk</option>
            <option value="Keluar">Keluar</option>
            <option value="Berhenti">Berhenti</option>
         </select>
      </div>
      {#if active_mutasi.status == "Masuk"}
         <div class="space-y-1">
            <label for="name" class="font-medium">Nama</label>
            <input
               required
               bind:value={active_mutasi.name}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="text"
               id="name"
               placeholder="Masukan Nama"
            />
         </div>
         <div class="space-y-1">
            <label for="status" class="font-medium">Status Anggota</label>
            <select
               required
               bind:value={status}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               id="status"
            >
               <option value="P">P</option>
               <option value="K">K</option>
            </select>
         </div>
      {:else}
         <div class="space-y-1">
            <label for="name" class="font-medium">Anggota</label>

            <select
               required
               bind:value={active_mutasi.name}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               id="name"
            >
               <option disabled value="">Pilih Anggota</option>
               {#each peserta as item}
                  <option value={item.name}>{item.name}</option>
               {/each}
            </select>
         </div>
      {/if}

      <div class="space-y-1">
         <label for="pertemuan" class="font-medium">Catatan</label>
         <textarea
            bind:value={active_mutasi.note}
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
