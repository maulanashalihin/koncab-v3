import{s as da,f as P,a as z,l as W,g as y,h as M,A as oa,c as q,m as Q,d as b,j as S,i as aa,x as o,B as na,y as Aa,H as Ta,o as ma,D as ha,n as la}from"../chunks/scheduler.fb86aa3b.js";import{e as ra}from"../chunks/each.e59479a4.js";import{S as ga,i as pa}from"../chunks/index.1f4e2e6a.js";import{d as g,a as p}from"../chunks/schema.d2581fe0.js";import"../chunks/id.5512d1be.js";function ia(k,a,i){const L=k.slice();return L[9]=a[i],L[11]=i,L}function sa(k){let a,i,L='<tr><th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">No</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Item</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Data</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Penjelasan</th></tr>',u,e,l=ra(k[0]),t=[];for(let A=0;A<l.length;A+=1)t[A]=ua(ia(k,l,A));return{c(){a=P("table"),i=P("thead"),i.innerHTML=L,u=z(),e=P("tbody");for(let A=0;A<t.length;A+=1)t[A].c();this.h()},l(A){a=y(A,"TABLE",{class:!0});var N=M(a);i=y(N,"THEAD",{class:!0,"data-svelte-h":!0}),oa(i)!=="svelte-ba5z5m"&&(i.innerHTML=L),u=q(N),e=y(N,"TBODY",{class:!0});var r=M(e);for(let h=0;h<t.length;h+=1)t[h].l(r);r.forEach(b),N.forEach(b),this.h()},h(){S(i,"class","ltr:text-left rtl:text-right"),S(e,"class","divide-y divide-gray-200"),S(a,"class","min-w-full divide-y-2 divide-gray-200 bg-white text-sm")},m(A,N){aa(A,a,N),o(a,i),o(a,u),o(a,e);for(let r=0;r<t.length;r+=1)t[r]&&t[r].m(e,null)},p(A,N){if(N&1){l=ra(A[0]);let r;for(r=0;r<l.length;r+=1){const h=ia(A,l,r);t[r]?t[r].p(h,N):(t[r]=ua(h),t[r].c(),t[r].m(e,null))}for(;r<t.length;r+=1)t[r].d(1);t.length=l.length}},d(A){A&&b(a),ha(t,A)}}}function ua(k){let a,i,L=k[11]+1+"",u,e,l,t=k[9].ITEM+"",A,N,r,h=k[9].DISPLAY_DATA+"",_,I,D,d=k[9].PENJELASAN+"",f,w;return{c(){a=P("tr"),i=P("td"),u=W(L),e=z(),l=P("td"),A=W(t),N=z(),r=P("td"),_=W(h),I=z(),D=P("td"),f=W(d),w=z(),this.h()},l(E){a=y(E,"TR",{});var s=M(a);i=y(s,"TD",{class:!0});var O=M(i);u=Q(O,L),O.forEach(b),e=q(s),l=y(s,"TD",{class:!0});var B=M(l);A=Q(B,t),B.forEach(b),N=q(s),r=y(s,"TD",{class:!0});var T=M(r);_=Q(T,h),T.forEach(b),I=q(s),D=y(s,"TD",{class:!0});var m=M(D);f=Q(m,d),m.forEach(b),w=q(s),s.forEach(b),this.h()},h(){S(i,"class","whitespace-nowrap px-4 py-2 font-medium text-gray-900"),S(l,"class","whitespace-nowrap px-4 py-2 text-gray-700"),S(r,"class","whitespace-nowrap px-4 py-2 text-gray-700"),S(D,"class","whitespace-nowrap px-4 py-2 text-gray-700")},m(E,s){aa(E,a,s),o(a,i),o(i,u),o(a,e),o(a,l),o(l,A),o(a,N),o(a,r),o(r,_),o(a,I),o(a,D),o(D,f),o(a,w)},p(E,s){s&1&&t!==(t=E[9].ITEM+"")&&la(A,t),s&1&&h!==(h=E[9].DISPLAY_DATA+"")&&la(_,h),s&1&&d!==(d=E[9].PENJELASAN+"")&&la(f,d)},d(E){E&&b(a)}}}function ka(k){let a,i,L='<input placeholder="Pilih Range Tanggal" class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400" id="datepicker"/>',u,e,l,t,A,N,r,h,_,I,D,d,f,w,E,s,O,B,T=(k[1]=="hasil"||k[1]=="proses")&&sa(k);return{c(){a=P("div"),i=P("div"),i.innerHTML=L,u=z(),e=P("div"),l=P("nav"),t=P("button"),A=W("Proses"),r=z(),h=P("button"),_=W("Hasil"),D=z(),d=P("button"),f=W("Rekap Bulanan"),E=z(),s=P("div"),T&&T.c(),this.h()},l(m){a=y(m,"DIV",{});var c=M(a);i=y(c,"DIV",{class:!0,"data-svelte-h":!0}),oa(i)!=="svelte-1q7li6h"&&(i.innerHTML=L),u=q(c),e=y(c,"DIV",{class:!0});var j=M(e);l=y(j,"NAV",{class:!0,"aria-label":!0});var Y=M(l);t=y(Y,"BUTTON",{class:!0});var R=M(t);A=Q(R,"Proses"),R.forEach(b),r=q(Y),h=y(Y,"BUTTON",{class:!0});var J=M(h);_=Q(J,"Hasil"),J.forEach(b),D=q(Y),d=y(Y,"BUTTON",{class:!0});var v=M(d);f=Q(v,"Rekap Bulanan"),v.forEach(b),Y.forEach(b),j.forEach(b),c.forEach(b),E=q(m),s=y(m,"DIV",{class:!0});var K=M(s);T&&T.l(K),K.forEach(b),this.h()},h(){S(i,"class","mb-4 w-full md:w-96"),S(t,"class",N=k[1]=="proses"?"shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600":"shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"),S(h,"class",I=k[1]=="hasil"?"shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600":"shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"),S(d,"class",w=k[1]=="rekap bulanan"?"shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600":"shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"),S(l,"class","flex gap-6"),S(l,"aria-label","Tabs"),S(e,"class","mb-3"),S(s,"class","overflow-x-auto")},m(m,c){aa(m,a,c),o(a,i),o(a,u),o(a,e),o(e,l),o(l,t),o(t,A),o(l,r),o(l,h),o(h,_),o(l,D),o(l,d),o(d,f),aa(m,E,c),aa(m,s,c),T&&T.m(s,null),O||(B=[na(t,"click",k[4]),na(h,"click",k[5]),na(d,"click",k[6])],O=!0)},p(m,[c]){c&2&&N!==(N=m[1]=="proses"?"shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600":"shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700")&&S(t,"class",N),c&2&&I!==(I=m[1]=="hasil"?"shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600":"shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700")&&S(h,"class",I),c&2&&w!==(w=m[1]=="rekap bulanan"?"shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600":"shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700")&&S(d,"class",w),m[1]=="hasil"||m[1]=="proses"?T?T.p(m,c):(T=sa(m),T.c(),T.m(s,null)):T&&(T.d(1),T=null)},i:Aa,o:Aa,d(m){m&&(b(a),b(E),b(s)),T&&T.d(),O=!1,Ta(B)}}}function Da(k,a,i){g.locale("id");let L=[],u=g().subtract(1,"month").set("date",21).format("YYYY-MM-DD"),e=g().add(1,"month").set("date",20).format("YYYY-MM-DD"),l="proses";async function t(){const _=await p.peserta.where("status").equals("K").count();let I=0,D=0,d=0,f=0;const w=await p.upgrade.where("createdAt").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).toArray();for await(const n of w)n.status=="HU Baru"?f=f+1:n.status=="Upgrade CP to P"?D=D+1:n.status=="Upgrade HU to CP"?d=d+1:n.status=="Upgrade P to K"&&(I=I+1);const E=await p.peserta.where("status").equals("P").count(),s=await p.hu.where("status").equals("CP").count(),O=await p.hu.where("status").equals("HU").count(),B=await p.peserta.where("guru_index").equals(1).count(),T=await p.groups.count(),m=await p.admin.count();let c=0,j=0,Y=0,R=0;const J=await p.presences.where("tanggal").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).toArray();for await(const n of J)c=c+n.buletin,j=j+n.buletin_fisik||0,Y=Y+n.buletin_digital||0,R=R+n.leaflet||0;const v=c/J.length,K=j/J.length,ta=Y/J.length;let x=0,H=0;const G=await p.peserta.toArray();for await(const n of G)x=x+n.majalah,H=H+n.tabloid;const F=x/G.length,C=H/G.length;let V=0,U=0;const X=await p.payment.where("createdAt").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).toArray();for await(const n of X)V=V+n.iltizamat,U=U+n.tabarruat;V=V/G.length,U=U/G.length;const ea=await p.anggaran.where("bulan").equals(g(e).format("MMMM YYYY")).toArray();let Z=0,$=0;for await(const n of ea)Z=Z+n.penggunaan,$=$+n.pengajuan;i(0,L=[{ITEM:"Karyawan",DATA:_,DISPLAY_DATA:_+" orang",SATUAN:"orang",PENJELASAN:"Jumlah karyawan bulan ini","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Upgrade P ke K",DATA:I,DISPLAY_DATA:I+" orang",SATUAN:"orang",PENJELASAN:"Jumlah upgrade Pelajar menjadi Karyawan","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Pelajar",DATA:E,DISPLAY_DATA:E+" orang",SATUAN:"orang",PENJELASAN:"Jumlah pelajar bulan ini","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Upgrade CP ke P",DATA:D,DISPLAY_DATA:D+" orang",SATUAN:"orang",PENJELASAN:"Jumlah Calon Pelajar yang diupgrade menjadi Pelajar pada bulan ini","PENGOLAH/STANDAR":"Angka tetap, dari 2 bulan sebelumnya",KRITERIA:"1","BOBOT NILAI":"20"},{ITEM:"Calon Pelajar",DATA:s,DISPLAY_DATA:s+" orang",SATUAN:"orang",PENJELASAN:"Jumlah calon pelajar bulan ini","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Upgrade HU ke CP",DATA:d,DISPLAY_DATA:d+" orang",SATUAN:"orang",PENJELASAN:"Jumlah HU yang diupgrade menjadi Calon Pelajar pada bulan ini","PENGOLAH/STANDAR":"Angka tetap dari 1 bulan sebelumnya",KRITERIA:"3","BOBOT NILAI":"15"},{ITEM:"HU",DATA:O,DISPLAY_DATA:O+" orang",SATUAN:"orang",PENJELASAN:"Jumlah peserta HU bulan ini","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Followup Daurah",DATA:f,DISPLAY_DATA:f+" orang",SATUAN:"orang",PENJELASAN:"Jumlah peserta daurah yang bersedia followup pd bulan ini","PENGOLAH/STANDAR":"Angka tetap",KRITERIA:"1","BOBOT NILAI":"20"},{ITEM:"Guru",DATA:B,DISPLAY_DATA:B+" orang",SATUAN:"orang",PENJELASAN:"Jumlah guru bulan ini","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Jumlah Asmen",DATA:"-",DISPLAY_DATA:m+" orang",SATUAN:"orang",PENJELASAN:"Jumlah asmen bulan ini","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Jumlah Kelas",DATA:T,DISPLAY_DATA:T+" kelompok",SATUAN:"kelas",PENJELASAN:"Jumlah kelas bulan ini","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Buletin",DATA:v,DISPLAY_DATA:v+" Eksemplar",SATUAN:"Eksemplar",PENJELASAN:"Rata2 total jumlah buletin Kaffah cetak dan digital yg beredar tiap pekan","PENGOLAH/STANDAR":"Dirata-rata",KRITERIA:"5","BOBOT NILAI":"15"},{ITEM:"Buletin Cetak",DATA:K,DISPLAY_DATA:K+" Eksemplar",SATUAN:"Eksemplar",PENJELASAN:"Rata2 jumlah buletin Kaffah cetak yg beredar tiap pekan","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Buletin Digital",DATA:ta,DISPLAY_DATA:ta+" Eksemplar",SATUAN:"Eksemplar",PENJELASAN:"Rata2 jumlah buletin Kaffah digital yg beredar tiap pekan (disebar melalui japri atau broadcast yang telah dipastikan pesan terkirim ke penerima)","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Jumlah Majalah",DATA:x,DISPLAY_DATA:x+" Eksemplar",SATUAN:"Eksemplar",PENJELASAN:"Jumlah Majalah yang dipesan tiap bulan","PENGOLAH/STANDAR":"Total",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Rata2 Majalah",DATA:F,DISPLAY_DATA:F+" Eksemplar",SATUAN:"Eksemplar",PENJELASAN:"Rata2 Majalah beredar tiap bulan","PENGOLAH/STANDAR":"Total",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Tabloid",DATA:H,DISPLAY_DATA:H+" Eksemplar",SATUAN:"Eksemplar",PENJELASAN:"jumlah tabloid MU yg beredar tiap terbit","PENGOLAH/STANDAR":"Dirata-rata",KRITERIA:"1","BOBOT NILAI":"10"},{ITEM:"Tabloid",DATA:C,DISPLAY_DATA:C+" Eksemplar",SATUAN:"Eksemplar",PENJELASAN:"Rata2 jumlah tabloid MU yg beredar tiap terbit","PENGOLAH/STANDAR":"Dirata-rata",KRITERIA:"1","BOBOT NILAI":"10"},{ITEM:"Iltizamat",DATA:V,DISPLAY_DATA:"Rp."+V.toLocaleString("id"),SATUAN:"Rupiah",PENJELASAN:"Jumlah SPP (Iltizamat) yg diterima bulan ini (isilah angka saja, tanpa titik)","PENGOLAH/STANDAR":"Rata-Rata",KRITERIA:"60000","BOBOT NILAI":"10"},{ITEM:"Laporan Anggaran",DATA:"",DISPLAY_DATA:"Rp."+Z.toLocaleString("id"),SATUAN:"Rupiah",PENJELASAN:"Jumlah anggaran yang digunakan pada bulan sebelumnya","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Pengajuan Anggaran",DATA:"",DISPLAY_DATA:"Rp."+$.toLocaleString("id"),SATUAN:"Rupiah",PENJELASAN:"Jumlah anggaran yang diajukan pada bulan ini","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Tabaruat",DATA:U,DISPLAY_DATA:"Rp."+U.toLocaleString("id"),SATUAN:"Rupiah",PENJELASAN:"Jumlah Tabaruat yg diterima bulan ini (isilah angka saja, tanpa titik)","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"},{ITEM:"Leaflet",DATA:R,DISPLAY_DATA:R+" Eksemplar",SATUAN:"Eksemplar",PENJELASAN:"Jumlah nasyroh yang disebarkan","PENGOLAH/STANDAR":"Tidak ada",KRITERIA:"0","BOBOT NILAI":"0"}])}async function A(){const _=await p.presences.where("tanggal").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).toArray();let I=0,D=0,d=0;for await(const n of _)I=I+n.present_index,D=D+n.kontrol_index,d=d+n.kontak_index;let f=0,w=0,E=0;f=Math.ceil(I/_.length*100),w=Math.ceil(D/_.length*100),E=Math.ceil(d/_.length*100);const s=await p.presence_week.where("tanggal").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).toArray(),O=s.length,B=s.filter(n=>n.status!="Laporan tidak masuk").length,T=Math.ceil(B/O*100),m=await p.rapat.where("tanggal").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).count(),c=await p.ku.where("tanggal").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).toArray();let j=0,Y=0,R=0;for await(const n of c)j=j++,Y=Y+n.jenis=="Online"?1:0,R=R+n.jenis=="Offline"?1:0;await p.kr.where("tanggal").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).toArray();let J=0,v=0,K=0;for await(const n of c)J=J++,v=v+n.jenis=="Online"?1:0,K=K+n.jenis=="Offline"?1:0;const ta=await p.daurah.where("tanggal").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).toArray();let x=0,H=0,G=0;for await(const n of ta)x=x++,H=H+n.jenis=="Online"?1:0,G=G+n.jenis=="Offline"?1:0;const F=await p.hs.where("tanggal").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).first(),C=await p.jm.where("tanggal").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).first(),V=await p.payment.where("createdAt").between(u,g(e).add(1,"day").format("YYYY-MM-DD")).toArray();let U=0,X=0;for await(const n of V)U=n.iltizamat?U++:U,X=n.tabarruat?X++:X;const ea=await p.peserta.count(),Z=Math.ceil(U/ea*100),$=Math.ceil(X/ea*100);i(0,L=[{ITEM:"Kehadiran Kursus",DATA:f,DISPLAY_DATA:f+"%",SATUAN:"orang",PENJELASAN:"Rata2 jumlah pemuda yang hadir kursus tiap pekan. Diinput dalam bentuk angka bulat, bukan desimal"},{ITEM:"Kontrol",DATA:"",DISPLAY_DATA:w+"%",SATUAN:"orang",PENJELASAN:"Rata2 jumlah pemuda yang dikontrol tiap pekan. Diinput dalam bentuk angka bulat, bukan desimal"},{ITEM:"Kontak",DATA:"",DISPLAY_DATA:E+"%",SATUAN:"orang",PENJELASAN:"Rata2 jumlah pemuda yg lakukan kontak tiap pekan. Diinput dalam bentuk angka bulat, bukan desimal"},{ITEM:"Laporan Guru",DATA:T,DISPLAY_DATA:T+"%",SATUAN:"kelas",PENJELASAN:"Rata2 jumlah laporan guru yang masuk tiap pekan. Diinput dalam bentuk angka bulat, bukan desimal"},{ITEM:"Rapat Pengurus",DATA:m,DISPLAY_DATA:m+" kali",SATUAN:"frek",PENJELASAN:"Jumlah frekuensi rapat pengurus rutin bulan ini"},{ITEM:"Kuliah Umum",DATA:j,DISPLAY_DATA:j+" kali",SATUAN:"frek",PENJELASAN:"Jumlah total Acara umum bulanan (seminar, diskusi umum, tabligh akbar, workshop) offline ditambah  online"},{ITEM:"Kuliah Umum Ofline",DATA:R,DISPLAY_DATA:R+" kali",SATUAN:"frek",PENJELASAN:"Jumlah Acara umum bulanan  (seminar, diskusi umum, tabligh akbar, workshop) offline"},{ITEM:"Kuliah Umum Online",DATA:Y,DISPLAY_DATA:Y+" kali",SATUAN:"frek",PENJELASAN:"Jumlah Acara umum bulanan  (seminar, diskusi umum, tabligh akbar, workshop) online"},{ITEM:"Kuliah Rutin",DATA:J,DISPLAY_DATA:J+" kali",SATUAN:"frek",PENJELASAN:"Jumlah total Kajian rutin (durusul masajid, kajian rutin kantoran/kampus/komunitas, dll) bulan ini, offline ditambah online"},{ITEM:"Kuliah Rutin offline",DATA:K,DISPLAY_DATA:K+" kali",SATUAN:"frek",PENJELASAN:"Jumlah total Kajian rutin (durusul masajid, kajian rutin kantoran/kampus/komunitas, dll) bulan ini, offline"},{ITEM:"Kuliah Rutin online",DATA:v,DISPLAY_DATA:v+" kali",SATUAN:"frek",PENJELASAN:"Jumlah total Kajian rutin (durusul masajid, kajian rutin kantoran/kampus/komunitas, dll) bulan ini, online"},{ITEM:"Daurah",DATA:x,DISPLAY_DATA:x+" kali",SATUAN:"Frek",PENJELASAN:"Jumlah total pelaksanaan daurah wajib (daurah yang mekanisme pelaksanaannya sesuai dengan ketetapan MW) yang dilaksanakan secara Offline ditambah online"},{ITEM:"Daurah Offline",DATA:G,DISPLAY_DATA:G+" kali",SATUAN:"Frek",PENJELASAN:"Jumlah pelasanaan daurah wajib (daurah yang mekanisme pelaksanaannya sesuai dengan ketetapan MW) yang dilaksanakan secara Offline"},{ITEM:"Daurah Online",DATA:H,DISPLAY_DATA:H+" kali",SATUAN:"Frek",PENJELASAN:"Jumlah pelasanaan daurah wajib (daurah yang mekanisme pelaksanaannya sesuai dengan ketetapan MW) yang dilaksanakan secara Online"},{ITEM:"Kehadiran HS",DATA:F?F.persentage:0,DISPLAY_DATA:(F?F.persentage:0)+"%",SATUAN:"orang",PENJELASAN:"Jumlah Karyawan yang hadir pada agenda HS"},{ITEM:"Open House",DATA:C?1:0,DISPLAY_DATA:(C?1:0)+" kali",SATUAN:"frek",PENJELASAN:"Pelaksanaan JM oleh mahali (bila dilaksanakan ditulis angka satu, bila tidak ditulis angka nol)"},{ITEM:"Kehadiran JM",DATA:C?C.persentage:0,DISPLAY_DATA:(C?C.persentage:0)+"%",SATUAN:"orang",PENJELASAN:"Jumlah Pemuda yang hadir pada agenda JM. Yang diundang dalam JM adalah K, P, CP, muayyid. "},{ITEM:"Donatur SPP",DATA:Z,DISPLAY_DATA:Z+"%",SATUAN:"orang",PENJELASAN:"Jumlah Pemuda yang bayar Iltizamat bulan ini"},{ITEM:"Donatur Tabaruat",DATA:$,DISPLAY_DATA:$+"%",SATUAN:"orang",PENJELASAN:"Jumlah pemuda yang bayar Tabaruat"},{ITEM:"Khutbah",DATA:"",DISPLAY_DATA:"",SATUAN:"frek",PENJELASAN:"Jumlah pelaksanaan Khutbah Jumat dalam sebulan"},{ITEM:"Durusul Masajid",DATA:"",DISPLAY_DATA:"",SATUAN:"frek",PENJELASAN:"Jumlah pelaksanaan Khutbah Jumat dalam sebulan"},{ITEM:"Kajian Masjid",DATA:"",DISPLAY_DATA:"",SATUAN:"frek",PENJELASAN:"Jumlah Masjid yang terdapat kajian rutin baik sebulan sekali, sebulan 2 kali maupun sebulan 3 kali."}])}return ma(()=>{new Date().getDate()<21?(u=g().subtract(1,"month").set("date",21).format("YYYY-MM-DD"),e=g().set("date",20).format("YYYY-MM-DD")):(u=g().set("date",21).format("YYYY-MM-DD"),e=g().add(1,"month").set("date",20).format("YYYY-MM-DD")),A(),new easepick.create({element:document.getElementById("datepicker"),css:["https://cdn.jsdelivr.net/npm/@easepick/core@1.2.1/dist/index.css","https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css"],plugins:["RangePlugin"],RangePlugin:{tooltip:!0},setup(I){I.on("select",D=>{const{end:d,start:f}=D.detail;u=g(f).format("YYYY-MM-DD"),e=g(d).format("YYYY-MM-DD"),l=="hasil"?t():l=="proses"&&A()})}}).setDateRange(u,e)}),[L,l,t,A,()=>{i(1,l="proses"),A()},()=>{i(1,l="hasil"),t()},()=>{i(1,l="rekap bulanan"),t()}]}class ba extends ga{constructor(a){super(),pa(this,a,Da,ka,da,{})}}export{ba as component};