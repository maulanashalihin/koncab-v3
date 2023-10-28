<script>
   import { db } from "../../../Database/schema";
   import dayjs from "dayjs";

   let hasil_data = [];

   (async () => {
      const jumlah_karyawan = await db.peserta
         .where("status")
         .equals("K")
         .count();

      const upgrade_p_to_k = await db.upgrade
         .where("status")
         .equals("P ke K")
         .count();

      const jumlah_pelajar = await db.peserta
         .where("status")
         .equals("P")
         .count();

      const upgrade_cp_to_p = await db.upgrade
         .where("status")
         .equals("CP ke P")
         .count();

      const cp = await db.hu.where("status").equals("CP").count();

      const upgrade_hu_to_cp = await db.upgrade
         .where("status")
         .equals("HU ke CP")
         .count();

      const hu = await db.hu.where("status").equals("HU").count();

      const hu_baru = await db.upgrade
         .where("status")
         .equals("HU Baru")
         .count();

      const guru = await db.peserta.where("guru_index").equals(1).count();

      const kelas = await db.groups.count();

      const asmen = await db.admin.count();

      let buletin = 0;

      let buletin_fisik = 0;

      let buletin_digital = 0;

      let leaflet = 0;

      const presences = await db.presences.toArray();

      for await (const item of presences) {
         buletin = buletin + item.buletin;
         buletin_fisik = buletin_fisik + item.buletin_fisik;
         buletin_digital = buletin_digital + item.buletin_digital;
         leaflet = leaflet + item.leaflet || 0;
      }

      let majalah = 0;

      let tabloid = 0;

      const anggota = await db.peserta.toArray();

      for await (const item of anggota) {
         majalah = majalah + item.majalah;
         tabloid = tabloid + item.tabloid;
      }

      majalah = majalah / anggota.length;

      tabloid = tabloid / anggota.length;


      let iltizamat = 0;

      let tabarruat = 0;

      const payments = await db.payment.toArray();

      for await (const item of payments) {
         iltizamat = iltizamat + item.iltizamat;
         tabarruat = tabarruat + item.tabarruat;
      }

      iltizamat = iltizamat / anggota.length;

      tabarruat = tabarruat / anggota.length;



      hasil_data = [
         {
            ITEM: "Karyawan",
            DATA: jumlah_karyawan,
            DISPLAY_DATA: jumlah_karyawan + " orang",
            SATUAN: "orang",
            PENJELASAN: "Jumlah karyawan bulan ini",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Upgrade P ke K",
            DATA: upgrade_p_to_k,
            DISPLAY_DATA: upgrade_p_to_k + " orang",
            SATUAN: "orang",
            PENJELASAN: "Jumlah upgrade Pelajar menjadi Karyawan",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Pelajar",
            DATA: jumlah_pelajar,
            DISPLAY_DATA: jumlah_pelajar + " orang",
            SATUAN: "orang",
            PENJELASAN: "Jumlah pelajar bulan ini",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Upgrade CP ke P",
            DATA: upgrade_cp_to_p,
            DISPLAY_DATA: upgrade_cp_to_p + " orang",
            SATUAN: "orang",
            PENJELASAN:
               "Jumlah Calon Pelajar yang diupgrade menjadi Pelajar pada bulan ini",
            "PENGOLAH/STANDAR": "Angka tetap, dari 2 bulan sebelumnya",
            KRITERIA: "1",
            "BOBOT NILAI": "20",
         },
         {
            ITEM: "Calon Pelajar",
            DATA: cp,
            DISPLAY_DATA: cp + " orang",
            SATUAN: "orang",
            PENJELASAN: "Jumlah calon pelajar bulan ini",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Upgrade HU ke CP",
            DATA: upgrade_hu_to_cp,
            DISPLAY_DATA: upgrade_hu_to_cp + " orang",
            SATUAN: "orang",
            PENJELASAN:
               "Jumlah HU yang diupgrade menjadi Calon Pelajar pada bulan ini",
            "PENGOLAH/STANDAR": "Angka tetap dari 1 bulan sebelumnya",
            KRITERIA: "3",
            "BOBOT NILAI": "15",
         },
         {
            ITEM: "HU",
            DATA: hu,
            DISPLAY_DATA: hu + " orang",
            SATUAN: "orang",
            PENJELASAN: "Jumlah peserta HU bulan ini",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Followup Daurah",
            DATA: hu_baru,
            DISPLAY_DATA: hu_baru + " orang",
            SATUAN: "orang",
            PENJELASAN:
               "Jumlah peserta daurah yang bersedia followup pd bulan ini",
            "PENGOLAH/STANDAR": "Angka tetap",
            KRITERIA: "1",
            "BOBOT NILAI": "20",
         },
         {
            ITEM: "Guru",
            DATA: guru,
            DISPLAY_DATA: guru + " orang",
            SATUAN: "orang",
            PENJELASAN: "Jumlah guru bulan ini",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Jumlah Asmen",
            DATA: "-",
            DISPLAY_DATA: asmen + " orang",
            SATUAN: "orang",
            PENJELASAN: "Jumlah asmen bulan ini",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Jumlah Kelas",
            DATA: kelas,
            DISPLAY_DATA: kelas + " kelompok",
            SATUAN: "kelas",
            PENJELASAN: "Jumlah kelas bulan ini",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Buletin",
            DATA: buletin,
            DISPLAY_DATA: buletin + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN:
               "Rata2 total jumlah buletin Kaffah cetak dan digital yg beredar tiap pekan",
            "PENGOLAH/STANDAR": "Dirata-rata",
            KRITERIA: "5",
            "BOBOT NILAI": "15",
         },
         {
            ITEM: "Buletin Cetak",
            DATA: buletin_fisik,
            DISPLAY_DATA: buletin_fisik + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN:
               "Rata2 jumlah buletin Kaffah cetak yg beredar tiap pekan",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Buletin Digital",
            DATA: buletin_digital,
            DISPLAY_DATA: buletin_digital + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN:
               "Rata2 jumlah buletin Kaffah digital yg beredar tiap pekan (disebar melalui japri atau broadcast yang telah dipastikan pesan terkirim ke penerima)",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Majalah",
            DATA: majalah,
            DISPLAY_DATA: majalah + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN: "Jumlah al-Waie yang beredar tiap bulan",
            "PENGOLAH/STANDAR": "Dirata-rata",
            KRITERIA: "1",
            "BOBOT NILAI": "10",
         },
         {
            ITEM: "Tabloid",
            DATA: tabloid,
            DISPLAY_DATA: tabloid + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN: "Rata2 jumlah tabloid MU yg beredar tiap terbit",
            "PENGOLAH/STANDAR": "Dirata-rata",
            KRITERIA: "1",
            "BOBOT NILAI": "10",
         },
         {
            ITEM: "Iltizamat",
            DATA: iltizamat,
            DISPLAY_DATA: "Rp." + iltizamat.toLocaleString("id"),
            SATUAN: "Rupiah",
            PENJELASAN:
               "Jumlah SPP (Iltizamat) yg diterima bulan ini (isilah angka saja, tanpa titik)",
            "PENGOLAH/STANDAR": "Rata-Rata",
            KRITERIA: "60000",
            "BOBOT NILAI": "10",
         },
         {
            ITEM: "Laporan Anggaran",
            DATA: "",
            DISPLAY_DATA: "Rp." + tabarruat.toLocaleString("id"),
            SATUAN: "Rupiah",
            PENJELASAN: "Jumlah anggaran yang digunakan pada bulan sebelumnya",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Pengajuan Anggaran",
            DATA: "",
            DISPLAY_DATA: "Rp." + tabarruat.toLocaleString("id"),
            SATUAN: "Rupiah",
            PENJELASAN: "Jumlah anggaran yang diajukan pada bulan ini",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Tabaruat",
            DATA: tabarruat,
            DISPLAY_DATA: "Rp." + tabarruat.toLocaleString("id"),
            SATUAN: "Rupiah",
            PENJELASAN:
               "Jumlah Tabaruat yg diterima bulan ini (isilah angka saja, tanpa titik)",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Leaflet",
            DATA: leaflet,
            DISPLAY_DATA: leaflet + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN: "Jumlah nasyroh yang disebarkan",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
      ];
   })();
</script>

<!--
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
-->

<div>
   <div class="mb-3">
      <nav class="flex gap-6" aria-label="Tabs">
         <button
            class="shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
         >
            Proses
         </button>

         <button
            class="shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600"
            aria-current="page"
         >
            Hasil
         </button>
         <button
            class="shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
         >
            Rekap Bulanan
         </button>
      </nav>
   </div>
</div>

<div class="overflow-x-auto">
   <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
      <thead class="ltr:text-left rtl:text-right">
         <tr>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
               No
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
               Item
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
               Data
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
               Penjelasan
            </th>
         </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
         {#each hasil_data as item, i}
            <tr>
               <td
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
               >
                  {i + 1}
               </td>
               <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                  >{item.ITEM}</td
               >
               <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                  >{item.DISPLAY_DATA}</td
               >
               <td class="whitespace-nowrap px-4 py-2 text-gray-700"
                  >{item.PENJELASAN}</td
               >
            </tr>
         {/each}
      </tbody>
   </table>
</div>
