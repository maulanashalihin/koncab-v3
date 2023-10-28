<script>
   import { generateUUID } from "../../../Components/helper";
   import Modal from "../../../Components/Modal.svelte";
   import MultiSelect from "../../../Components/MultiSelect.svelte";
   import { db, Log } from "../../../Database/schema";
   import dayjs from "dayjs";
   import weekOfYear from "dayjs/plugin/weekOfYear";
   dayjs.extend(weekOfYear);

   let groups = [];

   let peserta = [];

   let guru = [];

   let active_group = {};

   let presence_week = {};

   async function LoadData() {
      groups = await db.groups.toArray();
   }

   async function loadpeserta() {
      peserta = await db.peserta.toArray();
      guru = peserta.filter((item) => {
         return item.is_guru;
      });
   }

   loadpeserta();
   LoadData();

   let editGroupModal = false;

   let presentModal = false;

   let selected_peserta = [];

   async function saveGroup() {
      // cari nama guru
      active_group.guru = guru.find(
         (item) => item.id == active_group.guru_id
      ).name;

      if (active_group.id) {
         db.groups.put(active_group);

         Log("groups", active_group);

         console.log(active_group);

         for await (let item of selected_peserta) {
            await db.peserta.update(item.value, {
               group_id: active_group.id,
               modul: active_group.modul,
               halaman: active_group.halaman,
               kalimat: active_group.kalimat,
            });

            let peserta_data = await db.peserta.get(item.value);

            Log("peserta", peserta_data);
         }
         loadpeserta();
      } else {
         active_group.id = generateUUID();

         Log("groups", active_group);

         db.groups.add(active_group).then(async (id) => {
            for await (let item of selected_peserta) {
               await db.peserta.update(item.value, {
                  group_id: active_group.id,
                  modul: active_group.modul,
                  halaman: active_group.halaman,
                  kalimat: active_group.kalimat,
               });

               let peserta_data = await db.peserta.get(item.value);

               Log("peserta", peserta_data);
            }
            loadpeserta();
         });
      }
      editGroupModal = false;
      LoadData();
   }

   async function LoadPresence() {
      const id = dayjs().week() + ":" + dayjs().year() + ":" + active_group.id;

      presence_week = (await db.presence_week.where({ id: id }).first()) || {};

      presence_week.halaman = active_group.halaman;
      presence_week.kalimat = active_group.kalimat;
      presence_week.group_id = active_group.id;
      presence_week.modul = active_group.modul;
      presence_week.presence = (presence_week.presence && presence_week.presence.length &&  presence_week.presence.length == selected_peserta.length) ? presence_week.presence  : selected_peserta;
      presence_week.meeting_time = 120;
      presence_week.date = dayjs().format("YYYY-MM-DD");
      presence_week.id = id;
   }

   async function savePresence() {
      active_group.last_meet = presence_week.date;
      active_group.halaman = presence_week.halaman;
      active_group.kalimat = presence_week.kalimat;

      groups = groups.map((item) => {
         if (item.id == active_group.id) {
            item.last_meet = presence_week.date;
         }
         return item;
      });

      await db.groups.put(active_group);

      Log("groups", active_group);

      presence_week.number_pages = presence_week.halaman - active_group.halaman;

      presence_week.presence_percentage =
         (presence_week.presence.filter((item) => item.present).length /
            presence_week.presence.length) *
         100;

      presence_week.ontime_percentage =
         (presence_week.presence.filter((item) => item.ontime).length /
            presence_week.presence.length) *
         100;

      await db.presence_week.put(presence_week);

      Log("presence_week", presence_week);

      for await (let item of presence_week.presence) {
         const presence_data = {
            id: presence_week.id + ":" + item.group_id + ":" + item.id,
            week_id: presence_week.id,
            group_id: active_group.id,
            peserta_id: item.id,
            present: item.present,
            present_index : item.present ? 1 : 0,
            ontime: item.ontime,
            ontime_index : item.ontime ? 1 : 0, 
            kontrol: item.kontrol,
            kontrol_index : item.kontrol ? 1 : 0,
            kontak: item.kontak,
            kontak_index : item.kontak ? 1 : 0, 
            buletin_fisik : item.buletin_fisik,
            buletin_digital : item.buletin_digital,
            leaflet : item.leaflet,
            buletin : item.buletin_fisik + item.buletin_digital,
            date: presence_week.date,
         };
         await db.presences.put(presence_data);

         Log("presences", presence_data);
      }
      presentModal = false;
   }
</script>

<div>
   <!--
    Heads up! 👋
  
    This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
  -->
   <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">HM</div>
         <button
            on:click={() => {
               editGroupModal = true;
               active_group = {};
            }}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Tambah</button
         >
      </div>

      <div class="mt-10 overflow-x-auto">
         {#if groups.length}
            <table
               class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm"
            >
               <thead class="ltr:text-left rtl:text-right">
                  <tr>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Guru
                     </th>

                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Modul
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Halaman
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Pertemuan Terakhir
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Action
                     </th>
                  </tr>
               </thead>

               <tbody class="divide-y divide-gray-200">
                  {#each groups as item}
                     <tr>
                        <td
                           class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                        >
                           {item.guru}
                        </td>

                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.modul}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.halaman}
                           {item.kalimat ? `(${item.kalimat})` : ""}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.last_meet || "-"}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           <button
                              type="button"
                              on:click={() => {
                                 active_group = item;
                                 editGroupModal = true;

                                 selected_peserta = peserta
                                    .filter((i) => i.group_id == item.id)
                                    .map((item) => ({
                                       label: item.name,
                                       value: item.id,
                                    }));
                              }}
                              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              >Edit</button
                           >

                           <button
                              type="button"
                              on:click={() => {
                                 active_group = item;
                                 presentModal = true;
                                 selected_peserta = peserta.filter(
                                    (i) => i.group_id == item.id
                                 );
                                 LoadPresence();
                              }}
                              class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                              >+ Absen</button
                           >
                        </td>
                     </tr>
                  {/each}
               </tbody>
            </table>
         {:else}
            <div class="border border-dashed py-20 text-gray-500">
               <div class="text-center">Tidak ada Kelompok</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={editGroupModal} title="Edit Kelompok">
   <form on:submit|preventDefault={saveGroup} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="guru" class="font-medium">Guru</label>

         <select
            required
            bind:value={active_group.guru_id}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="guru"
         >
            {#each guru as item}
               <option value={item.id}>{item.name}</option>
            {/each}
         </select>
      </div>
      <div class="space-y-1">
         <label for="modul" class="font-medium">Modul</label>
         <select
            required
            bind:value={active_group.modul}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="modul"
         >
            {#each ["NI", "TH", "MH", "DI", "SEI", "AMWAL", "SPI"] as item}
               <option value={item}>{item}</option>
            {/each}
         </select>
      </div>

      <div class="space-y-1">
         <label for="halaman" class="font-medium">Halaman</label>
         <input
            required
            bind:value={active_group.halaman}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="number"
            id="halaman"
            placeholder="Halaman Terakhir"
         />
      </div>

      <div class="space-y-1">
         <label for="peserta" class="font-medium">Peserta</label>
         <MultiSelect
            placeholder="Cari peserta"
            lists={peserta
               .filter((item) => item.id != active_group.guru_id)
               .map((item) => ({
                  label: item.name,
                  value: item.id,
               }))}
            bind:value={selected_peserta}
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

<Modal width="max-w-lg" bind:show={presentModal} title="Presensi Kelas">
   <form on:submit|preventDefault={savePresence} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="date" class="font-medium">Tanggal Pertemuan</label>
         <input
            required
            bind:value={presence_week.date}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="date"
            id="date"
         />
      </div>
      <div class="space-y-1">
         <label for="modul" class="font-medium">Modul</label>
         <input
            required
            bind:value={presence_week.modul}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="text"
            id="modul"
         />
      </div>
      <div class="space-y-1">
         <label for="halaman" class="font-medium">Halaman</label>
         <input
            required
            bind:value={presence_week.halaman}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="number"
            id="halaman"
            placeholder="Masukan Halaman"
         />
      </div>
      <div class="space-y-1">
         <label for="halaman" class="font-medium">Kalimat</label>
         <input
            bind:value={presence_week.kalimat}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="text"
            id="kalimat"
            placeholder="Kalimat Awalan"
         />
      </div>
      <div class="space-y-1">
         <label for="meeting_time" class="font-medium">Lama Tatap Muka</label>
         <input
            required
            bind:value={presence_week.meeting_time}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="number"
            id="meeting_time"
            placeholder="Masukan Lama Tatap Muka"
         />
         <small>dalam satuan menit</small>
      </div>

      <div class="space-y-1">
         <label for="presence" class="font-medium">Control Checklist</label>

         <div class="grid gap-6 divide-y">
            {#each presence_week.presence || [] as item}
               <div class="pt-4">
                   
                  <div class="space-y-1">
                     <label for="buletin" class="font-medium">Nama</label>
                     <div>
                        {item.name}
                     </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 my-3">
                    <div class="flex gap-1 ">
                         
                        <div class="   ">
                           <input  
                              type="checkbox"
                              id="{item.id+'present'}"
                              bind:checked={item.present}
                           />
                           
                        </div>
                        <label  for="{item.id+'present'}">Hadir</label>
                     </div>
                     <div class="flex gap-1 ">
                         
                        <div class="   ">
                           <input  
                              type="checkbox"
                              id="{item.id+'ontime'}"
                              bind:checked={item.ontime}
                           />
                           
                        </div>
                        <label  for="{item.id+'ontime'}">Tepat Waktu</label>
                     </div>
                     <div class="flex gap-1 ">
                         
                        <div class="   ">
                           <input  
                              type="checkbox"
                              id="{item.id+'kontak'}"
                              bind:checked={item.kontak}
                           />
                           
                        </div>
                        <label  for="{item.id+'kontak'}">Kontak</label>
                     </div>
                     <div class="flex gap-1 ">
                         
                        <div class="   ">
                           <input  
                              type="checkbox"
                              id="{item.id+'kontrol'}"
                              bind:checked={item.kontrol}
                           />
                           
                        </div>
                        <label  for="{item.id+'kontrol'}">Kontrol</label>
                     </div>
                     
                  </div>
                  <div class="grid grid-cols-2 w-full gap-3">
                     <div class="space-y-1">
                        <label for="buletin" class="font-medium"
                           >Sebar Buletin (Fisik)</label
                        >
                        <input
                           required
                           bind:value={item.buletin_fisik}
                           class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
                           type="number"
                           id="buletin"
                           placeholder="5"
                        />
                     </div>
                     <div class="space-y-1">
                        <label for="buletin" class="font-medium"
                           >Sebar Buletin (Digital)</label
                        >
                        <input
                           required
                           bind:value={item.buletin_digital}
                           class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
                           type="number"
                           id="buletin"
                           placeholder="5"
                        />
                     </div>
                     <div class="space-y-1">
                        <label for="leaflet" class="font-medium"
                           >Leaflet (Nasyrah)</label
                        >
                        <input
                           required
                           bind:value={item.leaflet}
                           class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
                           type="number"
                           id="leaflet"
                           placeholder="5"
                        />
                        <div class="text-gray-500"><small>diisi jika ada penyebaran nasyrah</small></div>
                     </div>
                  </div>
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
