<script>
    import Modal from "../../../Components/Modal.svelte";
    import dayjs from "dayjs";
    import { Log, db, pubsub } from "../../../Database/schema";
    import "dayjs/locale/id";
    dayjs.locale("id");
 
    let peserta = [];
 
    let daurah = [];
 
    let active_daurah = {
       list_peserta: [],
       list_followup: [],
       tanggal: dayjs().format("YYYY-MM-DD"),
    };
 
    async function Loadpeserta() {
       peserta = await db.kontak.where({ status: "Prospek" }).toArray();
    }
 
    async function Loaddaurah() {
       daurah = await db.daurah.toArray();
    }
 
    Loaddaurah();
 
    Loadpeserta();
 
    let editdaurahModal = false;
 
    function savedaurah() {
       active_daurah.peserta = active_daurah.list_peserta.length;
       active_daurah.followup = active_daurah.list_followup.length;
       active_daurah.bulan = dayjs(active_daurah.tanggal).format("MMMM YYYY");
       active_daurah.id = dayjs(active_daurah.tanggal).format("YYYYMM");
 
       db.daurah.put(active_daurah);
 
       Log("daurah", active_daurah);

       active_daurah.list_followup.forEach((item) => {
         db.kontak.update(item, { status: "Sukses" });
       });
 
       editdaurahModal = false;
 
       Loaddaurah();
    }
 
    pubsub.subscribe("daurah", () => {
       Loaddaurah();
    });
 </script>
 
 <div> 
    <div class="max-w-7xl mx-auto ">
       <div class="flex flex-col md:flex-row gap-3 md:justify-between">
          <div class="text-xl md:text-3xl">daurah</div>
          <button
             on:click={() => {
                editdaurahModal = true;
                active_daurah = {
                   list_peserta: [],
                   list_followup: [],
                   tanggal: dayjs().format("YYYY-MM-DD"),
                };
             }}
             class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
             >Tambah</button
          >
       </div>
 
       <div class="mt-10 overflow-x-auto">
          {#if daurah.length}
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
                         Trainer
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Peserta
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Followup
                     </th>
                   </tr>
                </thead>
 
                <tbody class="divide-y divide-gray-200">
                   {#each daurah as item}
                      <tr>
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                            >{item.bulan}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                            >{item.tanggal || "-"}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                            >{item.trainer || "-"}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {item.peserta || "-"}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {item.followup || "-"}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            <button
                               type="button"
                               on:click={() => {
                                  active_daurah = item;
                                  editdaurahModal = true;
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
                <div class="text-center">Tidak ada daurah</div>
             </div>
          {/if}
       </div>
    </div>
 </div>
 
 <Modal width="max-w-lg" bind:show={editdaurahModal} title="Edit daurah">
    <form on:submit|preventDefault={savedaurah} class="p-4 space-y-4">
       <div class="space-y-1">
          <label for="tanggal" class="font-medium">Tanggal</label>
          <input
             required
             bind:value={active_daurah.tanggal}
             class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
             type="date"
             id="tanggal"
          />
       </div>
       <div class="space-y-1">
         <label for="jenis" class="font-medium">Jenis</label>
         <select
            required
            bind:value={active_daurah.jenis}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="jenis"
         >
            {#each ["Offline","Online"] as item}
               <option value={item}>{item}</option>
            {/each}
         </select>
      </div>
       <div class="space-y-1">
          <label for="trainer" class="font-medium">Trainer</label>
            <input
                 required
                 bind:value={active_daurah.trainer}
                 class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
                 type="text"
                 id="trainer"
                 placeholder="Daftar Pembicara"
                />
           
       </div>
       <div class="space-y-1">
          <label for="note" class="font-medium">Catatan</label>
          <textarea
             bind:value={active_daurah.note}
             class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
          
             id="note"
             placeholder="Catatan daurah"
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
                      bind:group={active_daurah.list_peserta}
                      value={item.name}
                   />
                   <label class="cursor-pointer" for={item.id}>
                      {item.name}</label
                   >
                </div>
             {/each}
          </div>
       </div>
       <div class="space-y-1">
        <label for="list_followup" class="font-medium">Followup</label>
        <div class="grid grid-cols-2">
           {#each peserta as item}
              <div class="space-x-1">
                 <input
                    id={"followup"+item.id}
                    class="cursor-pointer"
                    type="checkbox"
                    bind:group={active_daurah.list_followup}
                    value={item.name}
                 />
                 <label class="cursor-pointer" for={"followup"+item.id}>
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
 