<script>
   import { onMount } from "svelte";
   import { db } from "../../../Database/schema";
   import dayjs from "dayjs";
   import "dayjs/locale/id";
   dayjs.locale("id");

   let table_data = [];

   let start_date = dayjs()
      .subtract(1, "month")
      .set("date", 21)
      .format("YYYY-MM-DD");

   let end_date = dayjs().add(1, "month").set("date", 20).format("YYYY-MM-DD");

   let menu = "proses";

   async function loadHasil() {
      const jumlah_karyawan = await db.peserta
         .where("status")
         .equals("K")
         .count();

      let upgrade_p_to_k = 0,
         upgrade_cp_to_p = 0,
         upgrade_hu_to_cp = 0,
         hu_baru = 0;

      const upgrades = await db.upgrade
         .where("createdAt")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

      for await (const item of upgrades) {
         if (item.status == "HU Baru") {
            hu_baru = hu_baru + 1;
         } else if (item.status == "Upgrade CP to P") {
            upgrade_cp_to_p = upgrade_cp_to_p + 1;
         } else if (item.status == "Upgrade HU to CP") {
            upgrade_hu_to_cp = upgrade_hu_to_cp + 1;
         } else if (item.status == "Upgrade P to K") {
            upgrade_p_to_k = upgrade_p_to_k + 1;
         }
      }

      const jumlah_pelajar = await db.peserta
         .where("status")
         .equals("P")
         .count();

      const cp = await db.hu.where("status").equals("CP").count();

      const hu = await db.hu.where("status").equals("HU").count();

      const guru = await db.peserta.where("guru_index").equals(1).count();

      const kelas = await db.groups.count();

      const asmen = await db.admin.count();

      let buletin = 0;

      let buletin_fisik = 0;

      let buletin_digital = 0;

      let leaflet = 0;

      const presences = await db.presences
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

      for await (const item of presences) {
         buletin = buletin + item.buletin;
         buletin_fisik = buletin_fisik + item.buletin_fisik || 0;
         buletin_digital = buletin_digital + item.buletin_digital || 0;
         leaflet = leaflet + item.leaflet || 0;
      }

      const rata2_buletin = buletin / presences.length;

      const rata2_buletin_fisik = buletin_fisik / presences.length;

      const rata2_buletin_digital = buletin_digital / presences.length;

      let majalah = 0;

      let tabloid = 0;

      const anggota = await db.peserta.toArray();

      for await (const item of anggota) {
         majalah = majalah + item.majalah;
         tabloid = tabloid + item.tabloid;
      }

      const rata2_majalah = majalah / anggota.length;

      const rata2_tabloid = tabloid / anggota.length;

      let iltizamat = 0;

      let tabarruat = 0;

      const payments = await db.payment
         .where("createdAt")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

      for await (const item of payments) {
         iltizamat = iltizamat + item.iltizamat;
         tabarruat = tabarruat + item.tabarruat;
      }

      iltizamat = iltizamat / anggota.length;

      tabarruat = tabarruat / anggota.length;

      const anggaran = await db.anggaran
         .where("bulan")
         .equals(dayjs(end_date).format("MMMM YYYY"))
         .toArray();

      let penggunaan_anggaran = 0;

      let pengajuan_anggaran = 0;

      for await (const item of anggaran) {
         penggunaan_anggaran = penggunaan_anggaran + item.penggunaan;
         pengajuan_anggaran = pengajuan_anggaran + item.pengajuan;
      }

      table_data = [
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
            DATA: rata2_buletin,
            DISPLAY_DATA: rata2_buletin + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN:
               "Rata2 total jumlah buletin Kaffah cetak dan digital yg beredar tiap pekan",
            "PENGOLAH/STANDAR": "Dirata-rata",
            KRITERIA: "5",
            "BOBOT NILAI": "15",
         },
         {
            ITEM: "Buletin Cetak",
            DATA: rata2_buletin_fisik,
            DISPLAY_DATA: rata2_buletin_fisik + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN:
               "Rata2 jumlah buletin Kaffah cetak yg beredar tiap pekan",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Buletin Digital",
            DATA: rata2_buletin_digital,
            DISPLAY_DATA: rata2_buletin_digital + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN:
               "Rata2 jumlah buletin Kaffah digital yg beredar tiap pekan (disebar melalui japri atau broadcast yang telah dipastikan pesan terkirim ke penerima)",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Jumlah Majalah",
            DATA: majalah,
            DISPLAY_DATA: majalah + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN: "Jumlah Majalah yang dipesan tiap bulan",
            "PENGOLAH/STANDAR": "Total",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Rata2 Majalah",
            DATA: rata2_majalah,
            DISPLAY_DATA: rata2_majalah + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN: "Rata2 Majalah beredar tiap bulan",
            "PENGOLAH/STANDAR": "Total",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Tabloid",
            DATA: tabloid,
            DISPLAY_DATA: tabloid + " Eksemplar",
            SATUAN: "Eksemplar",
            PENJELASAN: "jumlah tabloid MU yg beredar tiap terbit",
            "PENGOLAH/STANDAR": "Dirata-rata",
            KRITERIA: "1",
            "BOBOT NILAI": "10",
         },
         {
            ITEM: "Tabloid",
            DATA: rata2_tabloid,
            DISPLAY_DATA: rata2_tabloid + " Eksemplar",
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
            DISPLAY_DATA: "Rp." + penggunaan_anggaran.toLocaleString("id"),
            SATUAN: "Rupiah",
            PENJELASAN: "Jumlah anggaran yang digunakan pada bulan sebelumnya",
            "PENGOLAH/STANDAR": "Tidak ada",
            KRITERIA: "0",
            "BOBOT NILAI": "0",
         },
         {
            ITEM: "Pengajuan Anggaran",
            DATA: "",
            DISPLAY_DATA: "Rp." + pengajuan_anggaran.toLocaleString("id"),
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
   }

   async function loadProses() {
      const presences = await db.presences
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

      let total_kursus = 0,
         total_kontrol = 0,
         total_kontak = 0;

      for await (const item of presences) {
         total_kursus = total_kursus + item.present_index;
         total_kontrol = total_kontrol + item.kontrol_index;
         total_kontak = total_kontak + item.kontak_index;
      }

      const rata2_kursus = Math.ceil((total_kursus / presences.length) * 100);
      const rata2_kontrol = Math.ceil((total_kontrol / presences.length) * 100);
      const rata2_kontak = Math.ceil((total_kontak / presences.length) * 100);

      const presence_weeks = await db.presence_week
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

      const total_presence = presence_weeks.length;
      const laporan_masuk = presence_weeks.filter(
         (item) => item.status != "Laporan tidak masuk"
      ).length;
      const rata2_laporan = Math.ceil((laporan_masuk / total_presence) * 100);

      const rapat = await db.rapat
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .count();

      const ku = await db.ku
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

      let kuliah_umum = 0;
      let kuliah_umum_online = 0;
      let kuliah_umum_offline = 0;

      for await (const item of ku) {
         kuliah_umum = kuliah_umum++;
         kuliah_umum_online =
            kuliah_umum_online + item.jenis == "Online" ? 1 : 0;
         kuliah_umum_offline =
            kuliah_umum_offline + item.jenis == "Offline" ? 1 : 0;
      }

      const kr = await db.kr
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

      let kajian_rutin = 0;
      let kajian_rutin_online = 0;
      let kajian_rutin_offline = 0;

      for await (const item of ku) {
         kajian_rutin = kajian_rutin++;
         kajian_rutin_online =
            kajian_rutin_online + item.jenis == "Online" ? 1 : 0;
         kajian_rutin_offline =
            kajian_rutin_offline + item.jenis == "Offline" ? 1 : 0;
      }

      const list_daurah = await db.daurah
         .where("tanggal")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         )
         .toArray();

      let daurah = 0;
      let daurah_online = 0;
      let daurah_offline = 0;

      for await (const item of list_daurah) {
         daurah = daurah++;
         daurah_online =
            daurah_online + item.jenis == "Online" ? 1 : 0;
         daurah_offline =
            daurah_offline + item.jenis == "Offline" ? 1 : 0;
      }

      const hs = await db.hs
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


 

         const payments = await db.payment
         .where("createdAt")
         .between(
            start_date,
            dayjs(end_date).add(1, "day").format("YYYY-MM-DD")
         ).toArray();

         let total_iltizamat = 0;
         let total_tabarruat = 0;
         for await (const item of payments) {
            total_iltizamat = item.iltizamat ? total_iltizamat++ : total_iltizamat;
            total_tabarruat = item.tabarruat ? total_tabarruat++ : total_tabarruat;
         }

         const total_anggota = await db.peserta.count();

         const rata2_iltizamat = Math.ceil(total_iltizamat / total_anggota * 100);

         const rata2_tabarruat = Math.ceil(total_tabarruat / total_anggota * 100);
          

      table_data = [
         {
            ITEM: "Kehadiran Kursus",
            DATA: "",
            DISPLAY_DATA: rata2_kursus + "%",
            SATUAN: "orang",
            PENJELASAN:
               "Rata2 jumlah pemuda yang hadir kursus tiap pekan. Diinput dalam bentuk angka bulat, bukan desimal",
         },
         {
            ITEM: "Kontrol",
            DATA: "",
            DISPLAY_DATA: rata2_kontrol + "%",
            SATUAN: "orang",
            PENJELASAN:
               "Rata2 jumlah pemuda yang dikontrol tiap pekan. Diinput dalam bentuk angka bulat, bukan desimal",
         },
         {
            ITEM: "Kontak",
            DATA: "",
            DISPLAY_DATA: rata2_kontak + "%",
            SATUAN: "orang",
            PENJELASAN:
               "Rata2 jumlah pemuda yg lakukan kontak tiap pekan. Diinput dalam bentuk angka bulat, bukan desimal",
         },
         {
            ITEM: "Laporan Guru",
            DATA: rata2_laporan,
            DISPLAY_DATA: rata2_laporan + "%",
            SATUAN: "kelas",
            PENJELASAN:
               "Rata2 jumlah laporan guru yang masuk tiap pekan. Diinput dalam bentuk angka bulat, bukan desimal",
         },
         {
            ITEM: "Rapat Pengurus",
            DATA: rapat,
            DISPLAY_DATA: rapat + " kali",
            SATUAN: "frek",
            PENJELASAN: "Jumlah frekuensi rapat pengurus rutin bulan ini",
         },
         {
            ITEM: "Kuliah Umum",
            DATA: kuliah_umum,
            DISPLAY_DATA: kuliah_umum + " kali",
            SATUAN: "frek",
            PENJELASAN:
               "Jumlah total Acara umum bulanan (seminar, diskusi umum, tabligh akbar, workshop) offline ditambah  online",
         },
         {
            ITEM: "Kuliah Umum Ofline",
            DATA: kuliah_umum_offline,
            DISPLAY_DATA: kuliah_umum_offline + " kali",
            SATUAN: "frek",
            PENJELASAN:
               "Jumlah Acara umum bulanan  (seminar, diskusi umum, tabligh akbar, workshop) offline",
         },
         {
            ITEM: "Kuliah Umum Online",
            DATA: kuliah_umum_online,
            DISPLAY_DATA: kuliah_umum_online + " kali",
            SATUAN: "frek",
            PENJELASAN:
               "Jumlah Acara umum bulanan  (seminar, diskusi umum, tabligh akbar, workshop) online",
         },
         {
            ITEM: "Kuliah Rutin",
            DATA: kajian_rutin,
            DISPLAY_DATA: kajian_rutin + " kali",
            SATUAN: "frek",
            PENJELASAN:
               "Jumlah total Kajian rutin (durusul masajid, kajian rutin kantoran/kampus/komunitas, dll) bulan ini, offline ditambah online",
         },
         {
            ITEM: "Kuliah Rutin offline",
            DATA: kajian_rutin_offline,
            DISPLAY_DATA: kajian_rutin_offline + " kali",
            SATUAN: "frek",
            PENJELASAN:
               "Jumlah total Kajian rutin (durusul masajid, kajian rutin kantoran/kampus/komunitas, dll) bulan ini, offline",
         },
         {
            ITEM: "Kuliah Rutin online",
            DATA: kajian_rutin_online,
            DISPLAY_DATA: kajian_rutin_online + " kali",
            SATUAN: "frek",
            PENJELASAN:
               "Jumlah total Kajian rutin (durusul masajid, kajian rutin kantoran/kampus/komunitas, dll) bulan ini, online",
         },
         {
            ITEM: "Daurah",
            DATA: daurah,
            DISPLAY_DATA: daurah + " kali",
            SATUAN: "Frek",
            PENJELASAN:
               "Jumlah total pelaksanaan daurah wajib (daurah yang mekanisme pelaksanaannya sesuai dengan ketetapan MW) yang dilaksanakan secara Offline ditambah online",
         },
         {
            ITEM: "Daurah Offline",
            DATA: daurah_offline,
            DISPLAY_DATA: daurah_offline + " kali",
            SATUAN: "Frek",
            PENJELASAN:
               "Jumlah pelasanaan daurah wajib (daurah yang mekanisme pelaksanaannya sesuai dengan ketetapan MW) yang dilaksanakan secara Offline",
         },
         {
            ITEM: "Daurah Online",
            DATA: daurah_online,
            DISPLAY_DATA: daurah_online + " kali",
            SATUAN: "Frek",
            PENJELASAN:
               "Jumlah pelasanaan daurah wajib (daurah yang mekanisme pelaksanaannya sesuai dengan ketetapan MW) yang dilaksanakan secara Online",
         },
         {
            ITEM: "Kehadiran HS",
            DATA: hs ? hs.persentage : 0,
            DISPLAY_DATA: (hs ? hs.persentage : 0) + "%",
            SATUAN: "orang",
            PENJELASAN: "Jumlah Karyawan yang hadir pada agenda HS",
         },
         {
            ITEM: "Open House",
            DATA: jm ? 1 : 0,
            DISPLAY_DATA: (jm ? 1 : 0) + " kali",
            SATUAN: "frek",
            PENJELASAN:
               "Pelaksanaan JM oleh mahali (bila dilaksanakan ditulis angka satu, bila tidak ditulis angka nol)",
         },
         {
            ITEM: "Kehadiran JM",
            DATA: jm ? jm.persentage : 0,
            DISPLAY_DATA: (jm ? jm.persentage : 0) + "%",
            SATUAN: "orang",
            PENJELASAN:
               "Jumlah Pemuda yang hadir pada agenda JM. Yang diundang dalam JM adalah K, P, CP, muayyid. ",
         },
         {
            ITEM: "Donatur SPP",
            DATA: rata2_iltizamat,
            DISPLAY_DATA: rata2_iltizamat + "%",
            SATUAN: "orang",
            PENJELASAN: "Jumlah Pemuda yang bayar Iltizamat bulan ini",
         },
         {
            ITEM: "Donatur Tabaruat",
            DATA: rata2_tabarruat,
            DISPLAY_DATA: rata2_tabarruat + "%",
            SATUAN: "orang",
            PENJELASAN: "Jumlah pemuda yang bayar Tabaruat",
         },
         {
            ITEM: "Khutbah",
            DATA: "",
            DISPLAY_DATA: "",
            SATUAN: "frek",
            PENJELASAN: "Jumlah pelaksanaan Khutbah Jumat dalam sebulan",
         },
         {
            ITEM: "Durusul Masajid",
            DATA: "",
            DISPLAY_DATA: "",
            SATUAN: "frek",
            PENJELASAN: "Jumlah pelaksanaan Khutbah Jumat dalam sebulan",
         },
         {
            ITEM: "Kajian Masjid",
            DATA: "",
            DISPLAY_DATA: "",
            SATUAN: "frek",
            PENJELASAN:
               "Jumlah Masjid yang terdapat kajian rutin baik sebulan sekali, sebulan 2 kali maupun sebulan 3 kali.",
         },
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

      loadProses();

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

               if (menu == "hasil") {
                  loadHasil();
               } else if (menu == "proses") {
                  loadProses();
               }

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
      <nav class="flex gap-6" aria-label="Tabs">
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
      </nav>
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
