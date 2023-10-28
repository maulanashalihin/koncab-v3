<script>
    import Modal from "../../../Components/Modal.svelte";
    import dayjs from "dayjs";
    import { Log, db, pubsub } from "../../../Database/schema";
    import "dayjs/locale/id";
    dayjs.locale("id");
 
    let peserta = [];
 
    let anggaran = [];
 
    let active_anggaran = { 
    };
 
 
 
    async function Loadanggaran() {
       anggaran = await db.anggaran.toArray();
    }
 
    Loadanggaran();
  
 
    let editanggaranModal = false;
 
    function saveanggaran() { 
       active_anggaran.bulan = dayjs().format("MMMM YYYY");
       active_anggaran.id = dayjs().format("YYYYMM");
        active_anggaran.createdAt = new Date().toISOString();
       db.anggaran.put(active_anggaran);
 
       Log("anggaran", active_anggaran);
 
       editanggaranModal = false;
 
       Loadanggaran();
    }
 
    pubsub.subscribe("anggaran", () => {
       Loadanggaran();
    });
 </script>
 
 <div> 
    <div class="max-w-7xl mx-auto ">
       <div class="flex flex-col md:flex-row gap-3 md:justify-between">
          <div class="text-xl md:text-3xl">anggaran</div>
          <button
             on:click={async () => {
                editanggaranModal = true;
                active_anggaran =  await db.anggaran.get({id: dayjs().format("YYYYMM")}) || {};
             }}
             class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
             >Tambah</button
          >
       </div>
 
       <div class="mt-10 overflow-x-auto">
          {#if anggaran.length}
             <table
                class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm"
             >
                <thead class="ltr:text-left rtl:text-right">
                   <tr>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Bulan
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Penggunaan
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Pengajuan
                      </th>
                      <th class="text-left px-4 py-2 font-medium text-gray-900">
                         Catatan
                      </th>
                   </tr>
                </thead>
 
                <tbody class="divide-y divide-gray-200">
                   {#each anggaran as item}
                      <tr>
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                            >{item.bulan}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                            >Rp.{item.penggunaan ? item.penggunaan.toLocaleString('id') : "0"}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                            >Rp.{item.pengajuan ? item.pengajuan.toLocaleString('id') : "0"}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {item.catatan || "-"}</td
                         >
                         <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            <button
                               type="button"
                               on:click={() => {
                                  active_anggaran = item;
                                  editanggaranModal = true;
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
                <div class="text-center">Tidak ada anggaran</div>
             </div>
          {/if}
       </div>
    </div>
 </div>
 
 <Modal width="max-w-lg" bind:show={editanggaranModal} title="Edit anggaran">
    <form on:submit|preventDefault={saveanggaran} class="p-4 space-y-4">
        <div class="space-y-1">
            <label for="bulan" class="font-medium">Bulan</label>
             <div>
              {dayjs().format("MMMM YYYY")}
             </div>
         </div>
       <div class="space-y-1">
          <label for="penggunaan" class="font-medium">Penggunaan Anggaran</label>
          <input
             required
             bind:value={active_anggaran.penggunaan}
             class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
             type="number"
             placeholder="10000000"
             id="penggunaan"
          />
          <div class="text-gray-500"><small>{active_anggaran.penggunaan ? active_anggaran.penggunaan.toLocaleString("id") : ''}</small></div>
       </div> 
       <div class="space-y-1">
        <label for="pengajuan" class="font-medium">Pengajuan Anggaran</label>
        <input
           required
           bind:value={active_anggaran.pengajuan}
           class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
           type="number"
           placeholder="10000000"
           id="pengajuan"
        />
        <div class="text-gray-500"><small>{active_anggaran.pengajuan ? active_anggaran.pengajuan.toLocaleString("id") : ''}</small></div>
     </div> 
       <div class="space-y-1">
          <label for="note" class="font-medium">Catatan</label>
          <textarea
             bind:value={active_anggaran.note}
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
 