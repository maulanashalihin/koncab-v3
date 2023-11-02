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
      hu = await db.hu.where("status").anyOfIgnoreCase("HU", "CP").toArray();
   }

   Loadhu();
</script>

<div>
   <!--
     Heads up! 👋
   
     This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
   -->
   <div class="">
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">Jadwal HU</div>
      </div>

      <div class="mt-10 overflow-x-auto">
         {#if hu.length}
            <div class="space-y-12">
               {#each ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as day}
               <div>
                  <div class="text-lg border-b pb-2">
                     {day}
                  </div>
                  {#if hu.filter((item) => item.hari == day).length}
                     <table
                        class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm"
                     >
                        <thead class="ltr:text-left rtl:text-right">
                           <tr>
                              <th
                                 class="text-left px-4 py-2 font-medium text-gray-900"
                              >
                                 Name
                              </th>
                              <th
                                 class="text-left px-4 py-2 font-medium text-gray-900"
                              >
                                 Status
                              </th>
                              <th
                                 class="text-left px-4 py-2 font-medium text-gray-900"
                              >
                                 Pertemuan
                              </th>
                              <th
                                 class="text-left px-4 py-2 font-medium text-gray-900"
                              >
                                 Guru
                              </th>
                           </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-200">
                           {#each hu.filter((item) => item.hari == day) as item}
                              <tr>
                                 <td
                                    class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                                 >
                                    {item.name}
                                 </td>
                                 <td
                                    class="whitespace-nowrap px-4 py-2 text-gray-700"
                                    >{item.status}</td
                                 >
                                 <td
                                    class="whitespace-nowrap px-4 py-2 text-gray-700"
                                    >  {item.hari || ""}
                                    {item.jam || ""}
                                    {item.pertemuan ? `(${item.pertemuan})` : ""}</td
                                 >
                                 <td
                                    class="whitespace-nowrap px-4 py-2 text-gray-700"
                                    >{item.guru || "-"}</td
                                 >
                              </tr>
                           {/each}
                        </tbody>
                     </table>
                  {/if}
               </div>
            {/each}
            </div>
         {:else}
            <div class="border border-dashed py-20 text-gray-500">
               <div class="text-center">Tidak ada hu</div>
            </div>
         {/if}
      </div>
   </div>
</div>
