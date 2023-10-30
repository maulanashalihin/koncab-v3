<script>
   import Modal from "../../../Components/Modal.svelte";
   import { MediaPrice, generateUUID } from "../../../Components/helper";
   import { Log, db, pubsub } from "../../../Database/schema";
   import dayjs from "dayjs";
   import "dayjs/locale/id";
   dayjs.locale("id");

   let peserta = [];

   let active_peserta = {};

   let mutasi = [];

   let jumlah_pembayaran;

   let iltizamat = 0;

   let tabarruat = 0;

   let buletin = 0;

   let tabloid = 0;

   let majalah = 0;

   let form_bayar_modal = false;

   let mutasi_modal = false;

   
   let downloadModal = false;

   let download_data_type = "Pembayaran";


   let start_date = dayjs()
      .subtract(1, "month")
      .set("date", 21)
      .format("YYYY-MM-DD");

   let end_date = dayjs().add(1, "month").set("date", 20).format("YYYY-MM-DD");


   let website = localStorage.getItem("website")
      ? JSON.parse(localStorage.getItem("website"))
      : {};

   async function Loadpeserta() {
      peserta = await db.peserta.toArray();

      for await (const item of peserta) {
         const check = await db.billing.get({
            id: dayjs().format("YYYYMM") + "-" + item.id,
         });

         if (!check || check.total != item.total_spp) {
            const bill_data = {
               id: dayjs().format("YYYYMM") + "-" + item.id,
               peserta_id: item.id,
               bulan: dayjs().format("MMMM YYYY"),
               total: item.total_spp,
               createdAt: dayjs().format("YYYY-MM-DD"),
            };

            await db.billing.put(bill_data);

            Log("billing", bill_data);
         }

         const billings = await db.billing
            .where({ peserta_id: item.id })
            .toArray();

         const payments = await db.payment
            .where({ peserta_id: item.id })
            .toArray();

         const total_tagihan = billings.reduce(
            (a, b) => a + (b["total"] || 0),
            0
         );

         const total_payment = payments.reduce(
            (a, b) => a + (b["jumlah"] || 0),
            0
         );

         item.belum_dibayar = total_tagihan - total_payment;
      }
      peserta = peserta;
   }

   Loadpeserta();

   let editpesertaModal = false;

   function savepeserta() {
      active_peserta.total_spp =
         active_peserta.iltizamat +
         active_peserta.tabarruat +
         active_peserta.buletin * MediaPrice[website.Area].buletin +
         active_peserta.tabloid * MediaPrice[website.Area].tabloid +
         active_peserta.majalah * MediaPrice[website.Area].majalah;

      if (active_peserta.id) {
         db.peserta.put(active_peserta);
      } else {
         active_peserta.id = generateUUID();
         db.peserta.add(active_peserta);
      }
      Log("peserta", active_peserta);
      editpesertaModal = false;
      Loadpeserta();
   }

   async function loadMutasi(item) {
      active_peserta = item;

      const billings = await db.billing
         .where({ peserta_id: item.id })
         .toArray();

      const payments = await db.payment
         .where({ peserta_id: item.id })
         .toArray();

      mutasi = [...payments, ...billings];
      mutasi = mutasi.sort((a, b) => a.createdAt - b.createdAt);

      mutasi_modal = true;
   }
   async function savePayment() {
      jumlah_pembayaran = iltizamat + tabarruat + tabloid + buletin + majalah;
      const payment_data = {
         id: dayjs().format("YYYYMMDD") + "-" + active_peserta.id,
         peserta_id: active_peserta.id,
         jumlah: jumlah_pembayaran,
         iltizamat: iltizamat,
         tabarruat: tabarruat,
         buletin: buletin,
         tabloid: tabloid,
         majalah: majalah,
         bulan: dayjs().format("MMMM YYYY"),
         createdAt: dayjs().format("YYYY-MM-DD"),
      };

      await db.payment.put(payment_data);

      Log("payment", payment_data);

      form_bayar_modal = false;
      Loadpeserta();
   }

   function loadDownload() {
      downloadModal = true;

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

                  // do something
               });
            },
         });

         picker.setDateRange(start_date, end_date);
      }, 100);
   }

   async function downloadData() {
      let data = [];
      if (download_data_type == "Data Individu") {
         data = await db.peserta.toArray();
      } else if (download_data_type == "Tagihan") {
         data = await db.billing
            .where("createdAt")
            .between(start_date, end_date)
            .toArray();

          
      } else if (download_data_type == "Pembayaran") {
         data = await db.payment
            .where("createdAt")
            .between(start_date, end_date)
            .toArray();
      }

      // download data into csv
      const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
      const header = Object.keys(data[0]);
      let csv = data.map((row) =>
         header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(",")
      );
      csv.unshift(header.join(","));
      csv = csv.join("\r\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "data.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
   }
</script>

<div>
   <div>
      <div class="flex flex-col md:flex-row gap-3 md:justify-between">
         <div class="text-xl md:text-3xl">Mal</div>
         <div class="flex gap-1">
            <button
               on:click={loadDownload}
               class="bg-gray-200 flex gap-1 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
               >
                  <path
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
               </svg>
            </button>
            
         </div>
      </div>

      <div class="mt-10 overflow-x-auto">
         {#if peserta.length}
            <table
               class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm"
            >
               <thead class="ltr:text-left rtl:text-right">
                  <tr>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Name
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Iltizamat
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Tabarruat
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Tabloid
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Majalah
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Buletin
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Total
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Belum dibayar
                     </th>
                     <th class="text-left px-4 py-2 font-medium text-gray-900">
                        Action
                     </th>
                  </tr>
               </thead>

               <tbody class="divide-y divide-gray-200">
                  {#each peserta as item}
                     <tr>
                        <td
                           class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                        >
                           {item.name}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >Rp.{item.iltizamat
                              ? item.iltizamat.toLocaleString("id")
                              : 0}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >Rp.{item.tabarruat
                              ? item.tabarruat.toLocaleString("id")
                              : 0}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.tabloid || "0"} (Rp.{item.tabloid
                              ? (
                                   item.tabloid *
                                   MediaPrice[website.Area].tabloid
                                ).toLocaleString("id")
                              : 0})</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.majalah || "0"} (Rp.{item.majalah
                              ? (
                                   MediaPrice[website.Area].majalah *
                                   item.majalah
                                ).toLocaleString("id")
                              : 0})</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                           >{item.buletin || "0"} (Rp.{item.buletin
                              ? (
                                   MediaPrice[website.Area].buletin *
                                   item.buletin
                                ).toLocaleString("id")
                              : 0})</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           Rp.{(item.total_spp || 0).toLocaleString("id")}</td
                        >
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           Rp.{(item.belum_dibayar || 0).toLocaleString("id")}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                           <button
                              type="button"
                              on:click={() => {
                                 active_peserta = item;
                                 editpesertaModal = true;
                              }}
                              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              >Edit</button
                           >
                           <button
                              on:click={() => {
                                 loadMutasi(item);
                              }}
                              type="button"
                              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                              >History</button
                           >

                           <button
                              type="button"
                              on:click={() => {
                                 active_peserta = item;
                                 form_bayar_modal = true;
                                 jumlah_pembayaran = item.belum_dibayar;
                              }}
                              class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                              >+ Bayar</button
                           >
                        </td>
                     </tr>
                  {/each}
               </tbody>
            </table>
         {:else}
            <div class="border border-dashed py-20 text-gray-500">
               <div class="text-center">Tidak ada pemuda</div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal width="max-w-lg" bind:show={editpesertaModal} title="Edit Keuangan">
   <form on:submit|preventDefault={savepeserta} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="name" class="font-medium">Nama</label>
         <input
            required
            bind:value={active_peserta.name}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="text"
            id="name"
            placeholder="Masukan Nama"
         />
      </div>
      <div class="grid grid-cols-2 gap-3">
         <div class="space-y-1">
            <label for="iltizamat" class="font-medium">Iltizamat</label>
            <input
               required
               bind:value={active_peserta.iltizamat}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="iltizamat"
               placeholder="60000"
            />
         </div>
         <div class="space-y-1">
            <label for="tabarruat" class="font-medium">Tabarruat</label>
            <input
               required
               bind:value={active_peserta.tabarruat}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="tabarruat"
               placeholder="60000"
            />
         </div>
         <div class="space-y-1">
            <label for="buletin" class="font-medium">Jlh Buletin</label>
            <input
               required
               bind:value={active_peserta.buletin}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="buletin"
               placeholder="5"
            />
         </div>
         <div class="space-y-1">
            <label for="tabloid" class="font-medium">Jlh Tabloid</label>
            <input
               required
               bind:value={active_peserta.tabloid}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="tabloid"
               placeholder="5"
            />
         </div>
         <div class="space-y-1">
            <label for="majalah" class="font-medium">Jlh Majalah</label>
            <input
               required
               bind:value={active_peserta.majalah}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="majalah"
               placeholder="5"
            />
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

<Modal width="max-w-lg" bind:show={form_bayar_modal} title="Form Pembayaran">
   <form on:submit|preventDefault={savePayment} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="jumlah" class="font-medium">Nama</label>
         <div>
            {active_peserta.name}
         </div>
      </div>
      <div class="space-y-1">
         <label for="jumlah" class="font-medium">Tagihan Bulanan</label>
         <div>
            {active_peserta.total_spp.toLocaleString("id")}
         </div>
      </div>
      <div>
         <div class="font-medium">Rincian</div>
         <div class="grid grid-cols-2">
            <div class="text-gray-500">
               Iltizamat : Rp.{active_peserta.iltizamat}
            </div>
            <div class="text-gray-500">
               Tabarruat : Rp.{active_peserta.tabarruat}
            </div>
            <div class="text-gray-500">
               Buletin : Rp.{MediaPrice[website.Area].buletin *
                  active_peserta.buletin} ({active_peserta.buletin} exp)
            </div>
            <div class="text-gray-500">
               Majalah : Rp.{MediaPrice[website.Area].majalah *
                  active_peserta.majalah} ({active_peserta.majalah} exp)
            </div>
            <div class="text-gray-500">
               Tabloid : Rp.{MediaPrice[website.Area].tabloid *
                  active_peserta.tabloid} ({active_peserta.tabloid} exp)
            </div>
         </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
         <div class="space-y-1">
            <label for="iltizamat" class="font-medium">Iltizamat </label>
            <input
               required
               bind:value={iltizamat}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="iltizamat"
               placeholder="1000000"
            />
            <div class="text-gray-500">
               <small
                  >{iltizamat
                     ? "Rp." + iltizamat.toLocaleString("id")
                     : ""}</small
               >
            </div>
         </div>
         <div class="space-y-1">
            <label for="tabarruat" class="font-medium">Tabarruat </label>
            <input
               required
               bind:value={tabarruat}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="tabarruat"
               placeholder="1000000"
            />
            <div class="text-gray-500">
               <small
                  >{tabarruat
                     ? "Rp." + tabarruat.toLocaleString("id")
                     : ""}</small
               >
            </div>
         </div>
         <div class="space-y-1">
            <label for="buletin" class="font-medium">Buletin </label>
            <input
               required
               bind:value={buletin}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="buletin"
               placeholder="1000000"
            />
            <div class="text-gray-500">
               <small
                  >{buletin ? "Rp." + buletin.toLocaleString("id") : ""}</small
               >
            </div>
         </div>
         <div class="space-y-1">
            <label for="majalah" class="font-medium">Majalah </label>
            <input
               required
               bind:value={majalah}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="majalah"
               placeholder="1000000"
            />
            <div class="text-gray-500">
               <small
                  >{majalah ? "Rp." + majalah.toLocaleString("id") : ""}</small
               >
            </div>
         </div>
         <div class="space-y-1">
            <label for="tabloid" class="font-medium">Tabloid </label>
            <input
               required
               bind:value={tabloid}
               class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
               type="number"
               id="tabloid"
               placeholder="1000000"
            />
            <div class="text-gray-500">
               <small
                  >{tabloid ? "Rp." + tabloid.toLocaleString("id") : ""}</small
               >
            </div>
         </div>
      </div>
      <div class="space-y-1">
         <label for="jumlah" class="font-medium">Total Pembayaran</label>
         <div>
            {(
               iltizamat +
               tabarruat +
               tabloid +
               buletin +
               majalah
            ).toLocaleString("id")}
         </div>
      </div>
      <button
         type="submit"
         class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-yellow-500 bg-yellow-500 text-white hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 active:bg-yellow-700 active:border-yellow-700"
      >
         Bayar
      </button>
   </form>
</Modal>

<Modal width="max-w-lg" bind:show={mutasi_modal} title="History Transaksi">
   <div class="p-4 space-y-3">
      {#each mutasi as item}
         <div class="border p-4 rounded-lg">
            {#if item.jumlah}
               <div class="flex justify-between">
                  <div>
                     Pembayaran {item.bulan}
                  </div>
                  <div class="bg-green-500 text-white rounded-xl px-2">
                     Rp.{item.jumlah.toLocaleString("id")}
                  </div>
               </div>
            {:else}
               <div class="flex justify-between">
                  <div>
                     Tagihan {item.bulan}
                  </div>
                  <div class="bg-red-500 text-white rounded-xl px-2">
                     Rp.{item.total.toLocaleString("id")}
                  </div>
               </div>
            {/if}
         </div>
      {/each}
   </div>
</Modal>



<Modal width="max-w-lg" bind:show={downloadModal} title="Download Data">
   <form on:submit|preventDefault={downloadData} class="p-4 space-y-4">
      <div class="space-y-1">
         <label for="modul" class="font-medium">Range Data</label>
         <input
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            type="text"
            id="datepicker"
         />
      </div>
      <div class="space-y-1">
         <label for="modul" class="font-medium">Data</label>
         <select
            required
            bind:value={download_data_type}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="modul"
         >
            {#each ["Data Individu","Tagihan", "Pembayaran"] as item}
               <option value={item}>{item}</option>
            {/each}
         </select>
      </div>

      <button
         type="submit"
         class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-yellow-500 bg-yellow-500 text-white hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 active:bg-yellow-700 active:border-yellow-700"
      >
         Simpan
      </button>
   </form>
</Modal>
