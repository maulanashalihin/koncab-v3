<script>
   import { stringify } from "postcss";
   import Modal from "../../../Components/Modal.svelte";
   import { generateUUID } from "../../../Components/helper";
   import { Log, db, pubsub } from "../../../Database/schema";
   import dayjs from "dayjs";

   let hp = [];

   let clone_hp = [];

   let active_hp = {};

   let guru = [];

   let list_contacts = [];

   let is_mundur = false;

   let action = "";

   async function Loadhp() {
      hp = await db.hp.reverse().sortBy("createdAt");

      clone_hp = hp;

      guru = await db.peserta.orderBy("name").toArray();

      list_contacts = await db.im.toArray();
      list_contacts = list_contacts.filter((item) => {
         return !hp.find((hp) => hp.name == item.name);
      });
   }

   Loadhp();

   let edithpModal = false;

   function savehp() {
      if (active_hp.id) {
         if (is_mundur) {
            const upgrade_data = {
               id: generateUUID(),
               name: active_hp.name,
               status: "IA dari " + active_hp.status,
               createdAt: dayjs().format("YYYY-MM-DD"),
            };

            db.ia.put(upgrade_data);
            Log("ia", upgrade_data);

            active_hp.status = "IA";

            db.hp.delete(active_hp.id);

            Log("hp", active_hp, "delete");

            edithpModal = false;

            Loadhp();
            return;
         }

         if (action == "HP ke P") {
            const upgrade_data = {
               id: generateUUID(),
               name: active_hp.name,
               status: action,
               createdAt: dayjs().format("YYYY-MM-DD"),
            };

            db.upgrade.put(upgrade_data);
            Log("upgrade", upgrade_data);

            const new_Peserta = {
               id: active_hp.name,
               name: active_hp.name,
               status: "P",
               createdAt: dayjs().format("YYYY-MM-DD"),
            };
            db.peserta.put(new_Peserta);
            Log("peserta", new_Peserta);

            db.hp.delete(active_hp.id);
            Log("hp", active_hp, "delete");

            edithpModal = false;

            Loadhp();

            return;
         }

         if (active_hp.createdAt == undefined) {
            active_hp.createdAt = dayjs().format("YYYY-MM-DD");
         }
         active_hp.updatedAt = dayjs().format("YYYY-MM-DD");

         db.hp.put(active_hp);
      } else {
         active_hp.id = active_hp.name;
         active_hp.createdAt = dayjs().format("YYYY-MM-DD");
         db.hp.add(active_hp);

         if (action == "HP Baru") {
            const upgrade_data = {
               id: generateUUID(),
               name: active_hp.name,
               status: action,
               createdAt: dayjs().format("YYYY-MM-DD"),
            };
            db.upgrade.put(upgrade_data);

            Log("upgrade", upgrade_data);

            db.im.delete(active_hp.name);
            Log(
               "im",
               {
                  id: active_hp.name,
               },
               "delete"
            );
         }
      }
      Log("hp", active_hp);
      edithpModal = false;
      Loadhp();
   }

   pubsub.subscribe("hp", () => {
      Loadhp();
   });

   let search = "";

   function DoingSearch() {
      if (search == "") {
         hp = clone_hp;
      } else {
         const lower_search = search.toLowerCase();

         hp = clone_hp.filter((item) => {
            return (
               item.name.toLowerCase().includes(lower_search) ||
               item.status.toLowerCase().includes(lower_search) ||
               (item.guru || "").toLowerCase().includes(lower_search) ||
               (item.hari || "").toLowerCase().includes(lower_search)
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
         <div class="text-xl md:text-3xl">HP</div>
         <button
            on:click={() => {
               edithpModal = true;
               action = "HP Baru";
               active_hp = {
                  name: "",
                  status: "HP",
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
         <div class="w-96 max-w-full mb-3">
            <input
               bind:value={search}
               on:input={DoingSearch}
               class="px-3 py-2 border outline-none focus:border-orange-400"
               type="text"
               placeholder="Search"
            />
         </div>
         {#if hp.length}
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
                        Mulai
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Notes
                     </th>
                  </tr>
               </thead>

               <tbody class="divide-y divide-gray-200">
                  {#each hp as item}
                     <tr>
                        <td
                           class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                        >
                           {item.name}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.status}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           {item.hari || ""}
                           {item.jam || ""}
                           {item.pertemuan ? `(${item.pertemuan})` : ""}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.guru || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.createdAt || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           {item.note}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           {#if item.status == "HP"}
                              <button
                                 type="button"
                                 on:click={() => {
                                    is_mundur = false;
                                    active_hp = item;
                                    edithpModal = true;
                                    action = "";
                                 }}
                                 class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                 >Edit</button
                              >
                           {/if}

                           {#if item.status == "HP"}
                              <button
                                 type="button"
                                 on:click={() => {
                                    active_hp = JSON.parse(
                                       JSON.stringify(item)
                                    );
                                    is_mundur = false;
                                    active_hp.status = "P";
                                    active_hp.pertemuan = 0;
                                    action = "HP ke P";
                                    edithpModal = true;
                                 }}
                                 class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded"
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
               <div class="text-center">Tidak ada hp</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={edithpModal} title="Edit hp">
   <form on:submit|preventDefault={savehp} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="name" class="font-medium">Nama</label>
         {#if active_hp.id}
            <input
               disabled
               bind:value={active_hp.name}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               id="name"
            />
         {:else}
            <select
               required
               bind:value={active_hp.name}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               id="name"
            >
               <option disabled value=""
                  >{list_contacts.length ? "Pilih IM" : "Tidak ada IM"}</option
               >
               {#each list_contacts as item}
                  <option value={item.name}>{item.name}</option>
               {/each}
            </select>
         {/if}
      </div>
      {#if is_mundur == false && (active_hp.status == "HP" || active_hp.status == "IM")}
         <div class="space-y-1">
            <label for="guru" class="font-medium">Guru</label>

            <select
               required
               bind:value={active_hp.guru}
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
               bind:value={active_hp.pertemuan}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="pertemuan"
               placeholder="Jumlah Pertemuan"
            />
         </div>
      {/if}
      {#if action != "HP ke P" && is_mundur == false}
         <div class="space-y-1">
            <label for="hari" class="font-medium">Hari</label>
            <select
               required
               bind:value={active_hp.hari}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               id="hari"
            >
               {#each ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as item}
                  <option value={item}>{item}</option>
               {/each}
            </select>
         </div>
         <div class="space-y-1">
            <label for="jam" class="font-medium">Jam</label>

            <input
               type="time"
               id="jam"
               bind:value={active_hp.jam}
               name="jam"
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            />
         </div>
      {/if}

      <div class="space-y-1">
         <label for="pertemuan" class="font-medium">Catatan</label>
         <textarea
            bind:value={active_hp.note}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="note"
            placeholder="Catatan"
         />
      </div>

      {#if active_hp.id && (active_hp.status == "HP" || active_hp.status == "IM") && action == ""}
         <div class="flex gap-2">
            <input type="checkbox" id="is_mundur" bind:checked={is_mundur} />
            <label for="is_mundur">Masukan IA</label>
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
