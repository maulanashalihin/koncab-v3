<script>
   import { onMount } from "svelte";
   import { db } from "../../../Database/schema";
   import dayjs from "dayjs";
   import "dayjs/locale/id";
   import { jumlah_kelompok_hp } from "../../../Components/helper";
 
 

   let table_data = [];

   let start_date = dayjs()
      .subtract(1, "month")
      .set("date", 21)
      .format("YYYY-MM-DD");

   let end_date = dayjs().add(1, "month").set("date", 20).format("YYYY-MM-DD");

   let menu = "hasil";

   async function loadHasil() {
      const Anggota = await db.peserta.toArray();
   
      const jumlah_karyawan = Anggota.filter(item=>(item.status == "K")).length;

      const jumlah_dosen = Anggota.filter(item=>(item.is_guru)).length;

      const jumlah_siswa = Anggota.filter(item=>(item.status == "P")).length;

      const jumlah_hp = await db.hp.count();

      const jumlah_im = await db.im.count();

      const jumlah_ia = await db.ia.count();

      const jumlah_hm = await db.groups.count();

      let kelompok_hp = jumlah_kelompok_hp(await db.hp.toArray())

      const presences = await db.presences
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();
         
      const kaffah_offline_sum = presences.reduce((acc, item) => {
        
         return acc + (item.buletin_fisik || 0);
      }, 0);

      console.log(kaffah_offline_sum)

      const kaffah_online_sum = presences.reduce((acc, item) => {
         return acc + (item.buletin_digital || 0);
      }, 0);

      const buletin_kontak_sum = presences.reduce((acc, item) => {
         return acc + (item.buletin_kontak || 0);
      }, 0);

      const bts_sum = presences.reduce((acc, item) => {
         return acc + (item.bts || 0);
      }, 0);

      const kehadiran_numbers = presences.filter((item) => item.present).length;

      const kunjungan_numbers = presences.filter((item) => item.kontrol).length;

      const kontak_numbers = presences.filter((item) => item.kontak).length;

      const weekly_report = await db.presence_week.where("tanggal").between(
         start_date,
         dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
      ).toArray();   

      const weekly_report_numbers = weekly_report.filter((item) => item.status == "Terlaksana" || item.status == "Kosong").length;
      
  
      const presences_total = presences.length;
    

      
      const kaffah_offline = Math.ceil(
         (kaffah_offline_sum / presences_total * Anggota.length)
      ) || 0;

      const kaffah_online = Math.ceil(
         (kaffah_online_sum / presences_total * Anggota.length)
      )  || 0;

      const buletin_kontak = Math.ceil(
         (buletin_kontak_sum / presences_total * Anggota.length)
      )  || 0;

      const bts = Math.ceil(
         (bts_sum / presences_total * Anggota.length)
      )  || 0;



 
      const kehadiran_kursus = Math.ceil(
         (kehadiran_numbers / presences_total * Anggota.length)
      ) ;

      const kunjungan = Math.ceil(
         (kunjungan_numbers / presences_total * Anggota.length)
      ) ;

      const kontak = Math.ceil(
         (kontak_numbers / presences_total * Anggota.length)
      ) ;

      const laporan_masuk = Math.ceil(
         (weekly_report_numbers / weekly_report.length * jumlah_hm)
      );

    


      let hs =  await db.hs
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .first();

      const jm = await db.jm
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .first();

         const pu = await db.pu
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

         const pu_peserta = pu.reduce((acc, item) => {
            return acc + (item.peserta || 0);
         }, 0);


         const mt = await db.mt
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

         const mt_peserta = mt.reduce((acc, item) => {
            return acc + (item.peserta || 0);
         }, 0);
      

         const upgrades = await db.upgrade.where("createdAt").between(
         start_date,
         dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
      ).toArray();
      
      const anggota_upgrade = upgrades.filter(item=>(item.status == "P ke K")).length;

      const siswa_rekrut = upgrades.filter(item=>(item.status == "HP ke P")).length;

      const hp_rekrut = upgrades.filter(item=>(item.status == "IM ke HP")).length;
      
     const mutasi = await db.mutasi.where("createdAt").between(
         start_date,
         dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
      ).toArray();

 
      const anggota_masuk = mutasi.filter(item=>(item.status == "Masuk" && item.keanggotaan == "K")).length;

      const siswa_masuk = mutasi.filter(item=>(item.status == "Masuk" && item.keanggotaan == "P")).length;

      const anggota_keluar = mutasi.filter(item=>(item.status == "Keluar" && item.keanggotaan == "K")).length;

      const siswa_keluar = mutasi.filter(item=>(item.status == "Keluar" && item.keanggotaan == "P")).length;

      const anggota_berhenti = mutasi.filter(item=>(item.status == "Berhenti" && item.keanggotaan == "K")).length;

      const siswa_berhenti = mutasi.filter(item=>(item.status == "Berhenti" && item.keanggotaan == "P")).length;

      
      const ia_lists = await db.ia.where("createdAt").between(
         start_date,
         dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
      ).toArray();

      const hp_berhenti = ia_lists.filter(item=>(item.status == "IA dari HP" )).length;



      const im_rekrut = await db.im.where("createdAt").between(
         start_date,
         dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
      ).count();
      




      table_data = [
    {
        "ITEM": "ANGGOTA",
        "DATA": jumlah_karyawan,
        "DISPLAY_DATA": `${jumlah_karyawan} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah total dosen dan asisten dosen bulan ini"
    },
    {
        "ITEM": "DOSEN",
        "DATA": jumlah_dosen,
        "DISPLAY_DATA": `${jumlah_dosen} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah total dosen bulan ini"
    },
    {
        "ITEM": "ASISTEN DOSEN",
        "DATA": jumlah_karyawan - jumlah_dosen,
        "DISPLAY_DATA": `${jumlah_karyawan - jumlah_dosen} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah total asisten dosen bulan ini"
    },
    {
        "ITEM": "SISWA",
        "DATA": jumlah_siswa,
        "DISPLAY_DATA": `${jumlah_siswa} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah total siswa bulan ini"
    },
    {
        "ITEM": "HP",
        "DATA": jumlah_hp,
        "DISPLAY_DATA": `${jumlah_hp} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah total HP bulan ini"
    },
    {
        "ITEM": "IM",
        "DATA": jumlah_im,
        "DISPLAY_DATA": `${jumlah_im} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah total IM bulan ini"
    },
    {
        "ITEM": "Jumlah HM",
        "DATA": jumlah_hm,
        "DISPLAY_DATA": `${jumlah_hm} Kelompok`,
        "SATUAN": "Kelompok",
        "PENJELASAN": "kelompok HM bulan ini"
    },
    {
        "ITEM": "Jumlah HP",
        "DATA": kelompok_hp,
        "DISPLAY_DATA": `${kelompok_hp} Kelompok`,
        "SATUAN": "Kelompok",
        "PENJELASAN": "kelompok HP bulan ini"
    },  
    {
        "ITEM": "Kaaffah Ofline",
        "DATA": kaffah_offline,
        "DISPLAY_DATA": `${kaffah_offline} Eksemplar`,
        "SATUAN": "Eksemplar",
        "PENJELASAN": " penyebaran buletin Kaffah (kertas) secara ofline bulan ini"
    }, 
    {
        "ITEM": "IA",
        "DATA": jumlah_ia,
        "DISPLAY_DATA": `${jumlah_ia} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Orang kontakan yang bukan Maasudah / yang tidak maju ke tahap"
    }, 
    {
        "ITEM": "BTS",
        "DATA": bts,
        "DISPLAY_DATA": `${bts} Eksemplar`,
        "SATUAN": "Eksemplar",
        "PENJELASAN": " penyebaran Buletin Teman Surga bulan ini"
    },  
    {
        "ITEM": "Kaffah terkontak",
        "DATA": buletin_kontak,
        "DISPLAY_DATA": `${buletin_kontak} Eksemplar`,
        "SATUAN": "Eksemplar",
        "PENJELASAN": "  Rata-rata Kaffah yang terkontak tiap pekan"
    },
    {
        "ITEM": "Kaffah Digital",
        "DATA": kaffah_online,
        "DISPLAY_DATA": `${kaffah_online} Eksemplar`,
        "SATUAN": "Eksemplar",
        "PENJELASAN": "Eksemplar penyebaran Kaffah digital oleh syabah bulan ini"
    },
    {
        "ITEM": "Kaffah Total",
        "DATA": kaffah_offline + kaffah_online + buletin_kontak,
        "DISPLAY_DATA": `${kaffah_offline + kaffah_online + buletin_kontak} Eksemplar`,
        "SATUAN": "Eksemplar",
        "PENJELASAN": "Jumlah Penyebaran Kaffah Offline dan Online"
    },
    {
        "ITEM": "Kehadiran kursus",
        "DATA": kehadiran_kursus,
        "DISPLAY_DATA": `${kehadiran_kursus} orang`,
        "SATUAN": "orang",
        "PENJELASAN": "Rata2 syab yang hadir kursus tiap pekan"
    },
    {
        "ITEM": "Kunjungan",
        "DATA": kunjungan_numbers,
        "DISPLAY_DATA": `${kunjungan_numbers} orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Rata2syabah yang di MTB tiap pekan"
    },
    {
        "ITEM": "Pelaku IM",
        "DATA": kontak,
        "DISPLAY_DATA": `${kontak} orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Rata2 syabah yg lakukan IM tiap pekan"
    }, 
    {
        "ITEM": "MT Resmi",
        "DATA": mt.length,
        "DISPLAY_DATA": `${mt.length} forum`,
        "SATUAN": "Jumlah",
        "PENJELASAN": "Jumlah forum MT di cabang"
    }, 

    {
        "ITEM": "Jumlah Peserta MT Resmi",
        "DATA": mt_peserta,
        "DISPLAY_DATA": `${mt_peserta} Orang`,
        "SATUAN": "orang",
        "PENJELASAN": "Jumlah eksternal yang hadir dalam MT Resmi 000 bulan ini"
    },
    {
        "ITEM": "Kehadiran HS",
        "DATA": hs ? hs.peserta : 0,
        "DISPLAY_DATA": `${hs ? hs.peserta : 0} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Adho yang hadir di HS"
    },
    {
        "ITEM": "JM",
        "DATA": jm ? 1 : 0,
        "DISPLAY_DATA": `${jm ? 1 : 0}`,
        "SATUAN": "frekuensi",
        "PENJELASAN": "Diskusi bulanan terbuka/JM (c/ ada 1, tdk ada 0)"
    },
    {
        "ITEM": "Kehadiran JM",
        "DATA": jm ? jm.peserta : 0,
        "DISPLAY_DATA": `${jm ? jm.peserta : 0} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Syabah yang hadir JM"
    },  
    {
        "ITEM": "PU",
        "DATA": pu.length,
        "DISPLAY_DATA": `${pu.length} forum`,
        "SATUAN": "jumlah  forum",
        "PENJELASAN": "Jumlah forum PU di cabang"
    },
    {
        "ITEM": "Peserta PU",
        "DATA": pu_peserta,
        "DISPLAY_DATA": `${pu_peserta} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Peserta PU yang hadir di setiap forum PU"
    },
    {
        "ITEM": "Laporan-Dosen",
        "DATA": laporan_masuk,
        "DISPLAY_DATA": `${laporan_masuk} Kelompok`,
        "SATUAN": "Kelompok",
        "PENJELASAN": "Kelompok Rata2laporan dosen yang masuk tiap pekan"
    },
    {
        "ITEM": "Anggota Upgrade",
        "DATA": anggota_upgrade,
        "DISPLAY_DATA": `${anggota_upgrade} Orang`,
        "SATUAN": "orang",
        "PENJELASAN": "Jumlah Penambahan Anggota dari Darisah"
    },
    {
        "ITEM": "Anggota Masuk",
        "DATA": anggota_masuk,
        "DISPLAY_DATA": `${anggota_masuk} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Penambahan Anggota dari mutasi masuk"
    },
    {
        "ITEM": "Anggota Keluar",
        "DATA": anggota_keluar,
        "DISPLAY_DATA": `${anggota_keluar} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah pengurangan Anngota karena mutasi keluar"
    },
    {
        "ITEM": "Anggota Mundur",
        "DATA": anggota_berhenti,
        "DISPLAY_DATA": `${anggota_berhenti} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Pengurangan Anggota karena mundur/keluar"
    },
    {
        "ITEM": "Siswa Rekrut",
        "DATA": siswa_rekrut,
        "DISPLAY_DATA": `${siswa_rekrut} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Penambahan siswa dari rekrut HP"
    },
    {
        "ITEM": "Siswa Upgrade",
        "DATA": anggota_upgrade,
        "DISPLAY_DATA": `${anggota_upgrade} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah pengurangan siswa karena naik jadi Anggota"
    },
    {
        "ITEM": "Siswa Masuk",
        "DATA": siswa_masuk,
        "DISPLAY_DATA": `${siswa_masuk} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Penambahan Siswa dari mutasi masuk"
    },
    {
        "ITEM": "Siswa Keluar",
        "DATA": siswa_keluar,
        "DISPLAY_DATA": `${siswa_keluar} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Pengurangan Siswa karena mutasi keluar"
    },
    {
        "ITEM": "Siswa Mundur",
       "DATA": siswa_berhenti,
        "DISPLAY_DATA": `${siswa_berhenti} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Pengurangan Siswa karena mundur/keluar"
    },
    {
        "ITEM": "HP Rekrut",
        "DATA": hp_rekrut,
        "DISPLAY_DATA": `${hp_rekrut} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Penambahan HP dari rekrut IM"
    },
    {
        "ITEM": "HP Upgrade",
        "DATA": siswa_rekrut,
        "DISPLAY_DATA": `${siswa_rekrut} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Pengurangan HP karena direkrut menjadi Siswa"
    },
    {
        "ITEM": "HP Mundur",
        "DATA": hp_berhenti,
        "DISPLAY_DATA": `${hp_berhenti} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Pengurangan HP karena mundur/keluar"
    },
    {
        "ITEM": "IM Rekrut",
        "DATA": im_rekrut,
        "DISPLAY_DATA": `${im_rekrut} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Penambahan IM baru, juga upgrade dari IA, PU, dll"
    },
    {
        "ITEM": "IM UP-Grade",
        "DATA": hp_rekrut,
        "DISPLAY_DATA": `${hp_rekrut} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah pengurangan IM karena naik menjadi HP"
    },
    {
        "ITEM": "IM Mundur",
        "DATA": "",
        "DISPLAY_DATA": "",
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah Pengurangan IM karena mundur/ tak mau dikontak lagi, dil"
    },
    {
        "ITEM": "IA Baru",
        "DATA": ia_lists.length,
        "DISPLAY_DATA": `${ia_lists.length} Orang`,
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah penambahan IA baru, dari IM, HP, D yang mundur"
    },
    {
        "ITEM": "IA Upgrade",
        "DATA": "",
        "DISPLAY_DATA": "",
        "SATUAN": "Orang",
        "PENJELASAN": "Jumlah IA yang terupgrade menjadi IM bulan ini"
    },
    {
        "ITEM": "IM baru",
        "DATA": "",
        "DISPLAY_DATA": "",
        "SATUAN": "Orang",
        "PENJELASAN": "jumlah kontakan IM baru tanpa melalui IA dulu"
    }
];
   }

    

   onMount(() => {
      if (new Date().getDate() < 21) {
         start_date = dayjs()
            .subtract(1, "month")
            .set("date", 21)
            .format("YYYY-MM-DD");
         end_date = dayjs().set("date", 20).format("YYYY-MM-DD");
      } else {
         start_date = dayjs().set("date", 21).format("YYYY-MM-DD");
         end_date = dayjs()
            .add(1, "month")
            .set("date", 20)
            .format("YYYY-MM-DD");
      }

      loadHasil();

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
   });
</script>

<!--
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
-->

<div>
   <div class="mb-4 w-full md:w-96">
      <input
         placeholder="Pilih Range Tanggal"
         class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
         id="datepicker"
      />
   </div>
   <div class="mb-3">
      <!-- <nav class="flex gap-6" aria-label="Tabs">
         <button
            on:click={() => {
               menu = "proses";
               loadProses();
            }}
            class="{menu == 'proses'
               ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
               : 'shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'} "
         >
            Proses
         </button>
         <button
            on:click={() => {
               menu = "hasil";
               loadHasil();
            }}
            class="{menu == 'hasil'
               ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
               : 'shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'} "
         >
            Hasil
         </button>
         <button
            on:click={() => {
               menu = "rekap bulanan";
               loadHasil();
            }}
            class="{menu == 'rekap bulanan'
               ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
               : 'shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'} "
         >
            Rekap Bulanan
         </button>
      </nav> -->
   </div>
</div>

<div class="overflow-x-auto">
   {#if menu == "hasil" || menu == "proses"}
      <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
         <thead class="ltr:text-left rtl:text-right">
            <tr>
               <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
               >
                  No
               </th>
               <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
               >
                  Item
               </th>
               <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
               >
                  Data
               </th>
               <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
               >
                  Penjelasan
               </th>
            </tr>
         </thead>

         <tbody class="divide-y divide-gray-200">
            {#each table_data as item, i}
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
   {/if}
</div>
