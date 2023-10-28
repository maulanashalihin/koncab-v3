<script>
   import Modal from "../../Components/Modal.svelte";
   import axios from "axios";

   let sites = [];

   let active_sites = {}; 

   async function Loadsites() {
      axios.get("/sites").then((res) => {
         sites = res.data;
      });
   }

   Loadsites();

   let editsitesModal = false;

   function savesites() {
      axios.post("/sites", active_sites).then((res) => {
         Loadsites();
         editsitesModal = false;
      });
   }
</script>

<div>
   <div class="max-w-7xl mx-auto p-6">
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">sites</div>
         <button
            on:click={() => {
               editsitesModal = true;
               active_sites = {
                  Domain: "",
                  User: "Rijal",
                  Area: "Jawa",
                  BuletinPrice: 500,
                  MajalahPrice: 10000,
                  TabloidPrice: 10000,
               };
            }}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Tambah</button
         >
      </div>

      <div class="mt-10 overflow-x-auto">
         {#if sites.length}
            <table
               class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm"
            >
               <thead class="ltr:text-left rtl:text-right">
                  <tr>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Domain
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Dibuat pada
                     </th>
                     <th
                        class="text-left px-4 py-2 font-medium text-gray-900"
                     />
                  </tr>
               </thead>

               <tbody class="divide-y divide-gray-200">
                  {#each sites as item}
                     <tr>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.Domain}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.CreatedAt || "-"}</td
                        >

                        <td class="whitespace-nowrap px-4 py-2 text-gray-700" />
                     </tr>
                  {/each}
               </tbody>
            </table>
         {:else}
            <div class="border border-dashed py-20 text-gray-500">
               <div class="text-center">Tidak ada sites</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={editsitesModal} title="Edit sites">
   <form on:submit|preventDefault={savesites} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="domain" class="font-medium">Domain</label>
         <input
            required
            bind:value={active_sites.Domain}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="text"
            placeholder="yourdomain.com"
            id="domain"
         />
      </div>
      <div class="space-y-1">
         <label for="user" class="font-medium">User</label>
         <select
            bind:value={active_sites.User}
            id="user"
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
         >
            <option value="Rijal">Rijal</option>
            <option value="Nisa">Nisa</option>
         </select>
      </div>
      <div class="space-y-1">
         <label for="area" class="font-medium">Area</label>
         <select
            bind:value={active_sites.Area}
            on:change={(e) => {
               if (active_sites.Area == "Jawa") {
                  active_sites.BuletinPrice = 500;
                  active_sites.MajalahPrice = 10000;
                  active_sites.TabloidPrice = 10000;
               } else {
                  active_sites.BuletinPrice = 500;
                  active_sites.MajalahPrice = 14000;
                  active_sites.TabloidPrice = 17000;
               }
            }}
            id="area"
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
         >
            <option value="Jawa">Jawa</option>
            <option value="Luar Jawa">Luar Jawa</option>
         </select>
      </div>
      <div class="space-y-1">
         <label for="domain" class="font-medium">Harga Buletin</label>
         <input
            required
            bind:value={active_sites.BuletinPrice}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="number"
         />
      </div>
      <div class="space-y-1">
         <label for="domain" class="font-medium">Harga Majalah</label>
         <input
            required
            bind:value={active_sites.MajalahPrice}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="number"
         />
      </div>
      <div class="space-y-1">
         <label for="domain" class="font-medium">Harga Tabloid</label>
         <input
            required
            bind:value={active_sites.TabloidPrice}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="number"
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
