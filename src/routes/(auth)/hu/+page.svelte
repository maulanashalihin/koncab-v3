<script>
   import { stringify } from "postcss";
   import Modal from "../../../Components/Modal.svelte";
   import { generateUUID } from "../../../Components/helper";
   import { Log, db, pubsub } from "../../../Database/schema";
   import dayjs from "dayjs";

   let hu = [];

   let active_hu = {};

   let guru = [];

   let list_contacts = [];

   let is_mundur = false;

   let action = "";

   async function Loadhu() {
      hu = await db.hu.toArray();
      guru = await db.peserta.toArray();
      list_contacts = await db.kontak
         .where("status")
         .equals("Sukses")
         .toArray();
      list_contacts = list_contacts.filter((item) => {
         return !hu.find((hu) => hu.name == item.name);
      });
   }

   Loadhu();

   let edithuModal = false;

   function savehu() {
      if (active_hu.id) {

         if (is_mundur) {
            active_hu.status = "Mundur";
         }

         db.hu.put(active_hu);
        

         if (action == "HU ke CP") {
            const upgrade_data = {
               id: generateUUID(),
               name: active_hu.name,
               status: action,
               createdAt: dayjs().format("YYYY-MM-DD"),
            };
            db.upgrade.put(upgrade_data);
            Log("upgrade", upgrade_data);
         }

         if (action == "CP ke P") {
            const upgrade_data = {
               id: generateUUID(),
               name: active_hu.name,
               status: action,
               createdAt: dayjs().format("YYYY-MM-DD"),
            };
            db.upgrade.put(upgrade_data);
            Log("upgrade", upgrade_data);

            const new_Peserta = {
               id: active_hu.name,
               name: active_hu.name,
               status: "P",
               createdAt: dayjs().format("YYYY-MM-DD"),
            };
            db.peserta.put(new_Peserta);
            Log("peserta", new_Peserta);
         }
      } else {
         active_hu.id = generateUUID();
         db.hu.add(active_hu);

         if (action == "HU Baru") {
            const upgrade_data = {
               id: generateUUID(),
               name: active_hu.name,
               status: action,
               createdAt: dayjs().format("YYYY-MM-DD"),
            };
            db.upgrade.put(upgrade_data);

            Log("upgrade", upgrade_data);
         }
      }
      Log("hu", active_hu);
      edithuModal = false;
      Loadhu();
   }

   pubsub.subscribe("hu", () => {
      Loadhu();
   });
</script>

<div>
   <!--
    Heads up! 👋
  
    This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
  -->
   <div class="">
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">HU</div>
         <button
            on:click={() => {
               edithuModal = true;
               action = "HU Baru";
               active_hu = {
                  name: "",
                  status: "HU",
                  pertemuan: 0,
                  guru: "",
                  note: "",
               };
            }}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Tambah</button
         >
      </div>

      <div class="mt-10 overflow-x-auto">
         {#if hu.length}
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
                        Guru
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Notes
                     </th>
                  </tr>
               </thead>

               <tbody class="divide-y divide-gray-200">
                  {#each hu as item}
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
                           >{item.guru || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           {item.note}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           <button
                              type="button"
                              on:click={() => {
                                 active_hu = item;
                                 edithuModal = true;
                                 action = "";
                              }}
                              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              >Edit</button
                           >
                           {#if item.status == "HU"}
                              <button
                                 type="button"
                                 on:click={() => {
                                    active_hu = JSON.parse(
                                       JSON.stringify(item)
                                    );
                                    active_hu.status = "CP";
                                    active_hu.pertemuan = 0;
                                    action = "HU ke CP";
                                    edithuModal = true;
                                 }}
                                 class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                                 >Upgrade ke CP</button
                              >
                           {/if}
                           {#if item.status == "CP"}
                              <button
                                 type="button"
                                 on:click={() => {
                                    active_hu = JSON.parse(
                                       JSON.stringify(item)
                                    );
                                    active_hu.status = "P";
                                    active_hu.pertemuan = 0;
                                    action = "CP ke P";
                                    edithuModal = true;
                                 }}
                                 class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                                 >Upgrade ke P</button
                              >
                           {/if}
                        </td>
                     </tr>
                  {/each}
               </tbody>
            </table>
         {:else}
            <div class="border border-dashed py-20 text-gray-500">
               <div class="text-center">Tidak ada hu</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={edithuModal} title="Edit hu">
   <form on:submit|preventDefault={savehu} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="name" class="font-medium">Nama</label>
         {#if active_hu.id}
            <input
               disabled
               bind:value={active_hu.name}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               id="name"
            />
         {:else}
            <select
               required
               bind:value={active_hu.name}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               id="name"
            >
               <option disabled value=""
                  >{list_contacts.length
                     ? "Pilih Kontakan"
                     : "Tidak ada Kontakan"}</option
               >
               {#each list_contacts as item}
                  <option value={item.name}>{item.name}</option>
               {/each}
            </select>
         {/if}
      </div>
      {#if active_hu.status == "HU" || active_hu.status == "CP"}
         <div class="space-y-1">
            <label for="guru" class="font-medium">Guru</label>

            <select
               required
               bind:value={active_hu.guru}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               id="guru"
            >
               <option disabled value="">Pilih Guru</option>
               {#each guru as item}
                  <option value={item.name}>{item.name}</option>
               {/each}
            </select>
         </div>
         <div class="space-y-1">
            <label for="pertemuan" class="font-medium">Pertemuan</label>
            <input
               required
               bind:value={active_hu.pertemuan}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="pertemuan"
               placeholder="Jumlah Pertemuan"
            />
         </div>
      {/if}

      <div class="space-y-1">
         <label for="pertemuan" class="font-medium">Catatan</label>
         <textarea
            bind:value={active_hu.note}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="note"
            placeholder="Catatan"
         />
      </div>

      {#if active_hu.id && (active_hu.status == "HU" || active_hu.status == "CP") && action == ""}
         <div class="flex gap-2">
            <input type="checkbox" id="is_mundur" bind:checked={is_mundur} />
            <label for="is_mundur">HU Mundur</label>
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
