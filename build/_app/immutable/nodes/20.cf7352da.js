import{s as lt,p as st,f as h,a as Y,g as p,h as k,A as V,c as A,d as b,j as d,i as P,x as a,B as U,C as nt,I as ot,y as rt,D as it,l as X,m as G,n as Q,K as H,J as ut,L as $,M as dt,H as ct}from"../chunks/scheduler.fb86aa3b.js";import{S as ft,i as ht,f as pt,b as mt,d as _t,m as vt,a as bt,t as yt,e as gt}from"../chunks/index.1f4e2e6a.js";import{e as tt}from"../chunks/each.e59479a4.js";import{M as xt}from"../chunks/Modal.d6059f2e.js";import{b as wt}from"../chunks/helper.a295fbb9.js";import{p as Ct,a as W,d as Z,L as Et}from"../chunks/schema.d2581fe0.js";function et(r,t,e){const n=r.slice();return n[11]=t[e],n}function Tt(r){let t,e='<div class="text-center">Tidak ada mutasi</div>';return{c(){t=h("div"),t.innerHTML=e,this.h()},l(n){t=p(n,"DIV",{class:!0,"data-svelte-h":!0}),V(t)!=="svelte-1rd28l3"&&(t.innerHTML=e),this.h()},h(){d(t,"class","border border-dashed py-20 text-gray-500")},m(n,s){P(n,t,s)},p:rt,d(n){n&&b(t)}}}function kt(r){let t,e,n='<tr><th class="text-left px-4 py-2 font-medium text-gray-900">Tanggal</th> <th class="text-left px-4 py-2 font-medium text-gray-900">Name</th> <th class="text-left px-4 py-2 font-medium text-gray-900">Status</th> <th class="text-left px-4 py-2 font-medium text-gray-900">Notes</th></tr>',s,g,i=tt(r[0]),o=[];for(let u=0;u<i.length;u+=1)o[u]=at(et(r,i,u));return{c(){t=h("table"),e=h("thead"),e.innerHTML=n,s=Y(),g=h("tbody");for(let u=0;u<o.length;u+=1)o[u].c();this.h()},l(u){t=p(u,"TABLE",{class:!0});var _=k(t);e=p(_,"THEAD",{class:!0,"data-svelte-h":!0}),V(e)!=="svelte-1vul56x"&&(e.innerHTML=n),s=A(_),g=p(_,"TBODY",{class:!0});var l=k(g);for(let y=0;y<o.length;y+=1)o[y].l(l);l.forEach(b),_.forEach(b),this.h()},h(){d(e,"class","ltr:text-left rtl:text-right"),d(g,"class","divide-y divide-gray-200"),d(t,"class","min-w-full divide-y-2 divide-gray-200 bg-white text-sm")},m(u,_){P(u,t,_),a(t,e),a(t,s),a(t,g);for(let l=0;l<o.length;l+=1)o[l]&&o[l].m(g,null)},p(u,_){if(_&7){i=tt(u[0]);let l;for(l=0;l<i.length;l+=1){const y=et(u,i,l);o[l]?o[l].p(y,_):(o[l]=at(y),o[l].c(),o[l].m(g,null))}for(;l<o.length;l+=1)o[l].d(1);o.length=i.length}},d(u){u&&b(t),it(o,u)}}}function at(r){let t,e,n=Z(r[11].createdAt).format("DD-MM-YYYY")+"",s,g,i,o=r[11].name+"",u,_,l,y=r[11].status+"",c,w,T,C=r[11].note+"",j,M,B,v,N="Edit",I,f,E;function x(){return r[5](r[11])}return{c(){t=h("tr"),e=h("td"),s=X(n),g=Y(),i=h("td"),u=X(o),_=Y(),l=h("td"),c=X(y),w=Y(),T=h("td"),j=X(C),M=Y(),B=h("td"),v=h("button"),v.textContent=N,I=Y(),this.h()},l(L){t=p(L,"TR",{});var m=k(t);e=p(m,"TD",{class:!0});var q=k(e);s=G(q,n),q.forEach(b),g=A(m),i=p(m,"TD",{class:!0});var S=k(i);u=G(S,o),S.forEach(b),_=A(m),l=p(m,"TD",{class:!0});var K=k(l);c=G(K,y),K.forEach(b),w=A(m),T=p(m,"TD",{class:!0});var O=k(T);j=G(O,C),O.forEach(b),M=A(m),B=p(m,"TD",{class:!0});var D=k(B);v=p(D,"BUTTON",{type:!0,class:!0,"data-svelte-h":!0}),V(v)!=="svelte-168lam3"&&(v.textContent=N),D.forEach(b),I=A(m),m.forEach(b),this.h()},h(){d(e,"class","whitespace-nowrap px-4 py-2 text-gray-700"),d(i,"class","whitespace-nowrap px-4 py-2 font-medium text-gray-900"),d(l,"class","whitespace-nowrap px-4 py-2 text-gray-700"),d(T,"class","whitespace-nowrap px-4 py-2 text-gray-700"),d(v,"type","button"),d(v,"class","bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"),d(B,"class","whitespace-nowrap px-4 py-2 text-gray-700")},m(L,m){P(L,t,m),a(t,e),a(e,s),a(t,g),a(t,i),a(i,u),a(t,_),a(t,l),a(l,c),a(t,w),a(t,T),a(T,j),a(t,M),a(t,B),a(B,v),a(t,I),f||(E=U(v,"click",x),f=!0)},p(L,m){r=L,m&1&&n!==(n=Z(r[11].createdAt).format("DD-MM-YYYY")+"")&&Q(s,n),m&1&&o!==(o=r[11].name+"")&&Q(u,o),m&1&&y!==(y=r[11].status+"")&&Q(c,y),m&1&&C!==(C=r[11].note+"")&&Q(j,C)},d(L){L&&b(t),f=!1,E()}}}function Dt(r){let t,e,n,s="Nama",g,i,o,u,_,l="Status",y,c,w,T="Masuk",C,j="Keluar",M,B="Berhenti",v,N,I,f="Catatan",E,x,L,m,q="Simpan",S,K;return{c(){t=h("form"),e=h("div"),n=h("label"),n.textContent=s,g=Y(),i=h("input"),o=Y(),u=h("div"),_=h("label"),_.textContent=l,y=Y(),c=h("select"),w=h("option"),w.textContent=T,C=h("option"),C.textContent=j,M=h("option"),M.textContent=B,v=Y(),N=h("div"),I=h("label"),I.textContent=f,E=Y(),x=h("textarea"),L=Y(),m=h("button"),m.textContent=q,this.h()},l(O){t=p(O,"FORM",{class:!0});var D=k(t);e=p(D,"DIV",{class:!0});var R=k(e);n=p(R,"LABEL",{for:!0,class:!0,"data-svelte-h":!0}),V(n)!=="svelte-nu0yl2"&&(n.textContent=s),g=A(R),i=p(R,"INPUT",{class:!0,type:!0,id:!0,placeholder:!0}),R.forEach(b),o=A(D),u=p(D,"DIV",{class:!0});var z=k(u);_=p(z,"LABEL",{for:!0,class:!0,"data-svelte-h":!0}),V(_)!=="svelte-5o26ou"&&(_.textContent=l),y=A(z),c=p(z,"SELECT",{class:!0,id:!0});var F=k(c);w=p(F,"OPTION",{"data-svelte-h":!0}),V(w)!=="svelte-kvwu98"&&(w.textContent=T),C=p(F,"OPTION",{"data-svelte-h":!0}),V(C)!=="svelte-n61qvi"&&(C.textContent=j),M=p(F,"OPTION",{"data-svelte-h":!0}),V(M)!=="svelte-1of6z7i"&&(M.textContent=B),F.forEach(b),z.forEach(b),v=A(D),N=p(D,"DIV",{class:!0});var J=k(N);I=p(J,"LABEL",{for:!0,class:!0,"data-svelte-h":!0}),V(I)!=="svelte-rpdbpz"&&(I.textContent=f),E=A(J),x=p(J,"TEXTAREA",{class:!0,id:!0,placeholder:!0}),k(x).forEach(b),J.forEach(b),L=A(D),m=p(D,"BUTTON",{type:!0,class:!0,"data-svelte-h":!0}),V(m)!=="svelte-1ajo9iy"&&(m.textContent=q),D.forEach(b),this.h()},h(){d(n,"for","name"),d(n,"class","font-medium"),i.required=!0,d(i,"class","bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"),d(i,"type","text"),d(i,"id","name"),d(i,"placeholder","Masukan Nama"),d(e,"class","space-y-1"),d(_,"for","status"),d(_,"class","font-medium"),w.__value="Masuk",H(w,w.__value),C.__value="Keluar",H(C,C.__value),M.__value="Berhenti",H(M,M.__value),c.required=!0,d(c,"class","bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"),d(c,"id","status"),r[1].status===void 0&&ut(()=>r[7].call(c)),d(u,"class","space-y-1"),d(I,"for","pertemuan"),d(I,"class","font-medium"),d(x,"class","bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"),d(x,"id","note"),d(x,"placeholder","Catatan"),d(N,"class","space-y-1"),d(m,"type","submit"),d(m,"class","inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-yellow-500 bg-yellow-500 text-white hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 active:bg-yellow-700 active:border-yellow-700"),d(t,"class","p-4 space-y-4")},m(O,D){P(O,t,D),a(t,e),a(e,n),a(e,g),a(e,i),H(i,r[1].name),a(t,o),a(t,u),a(u,_),a(u,y),a(u,c),a(c,w),a(c,C),a(c,M),$(c,r[1].status,!0),a(t,v),a(t,N),a(N,I),a(N,E),a(N,x),H(x,r[1].note),a(t,L),a(t,m),S||(K=[U(i,"input",r[6]),U(c,"change",r[7]),U(x,"input",r[8]),U(t,"submit",dt(r[3]))],S=!0)},p(O,D){D&2&&i.value!==O[1].name&&H(i,O[1].name),D&2&&$(c,O[1].status),D&2&&H(x,O[1].note)},d(O){O&&b(t),S=!1,ct(K)}}}function Mt(r){let t,e,n,s,g="mutasi",i,o,u="Tambah",_,l,y,c,w,T,C,j;function M(f,E){return f[0].length?kt:Tt}let B=M(r),v=B(r);function N(f){r[9](f)}let I={width:"max-w-lg",title:"Edit mutasi",$$slots:{default:[Dt]},$$scope:{ctx:r}};return r[2]!==void 0&&(I.show=r[2]),c=new xt({props:I}),st.push(()=>pt(c,"show",N)),{c(){t=h("div"),e=h("div"),n=h("div"),s=h("div"),s.textContent=g,i=Y(),o=h("button"),o.textContent=u,_=Y(),l=h("div"),v.c(),y=Y(),mt(c.$$.fragment),this.h()},l(f){t=p(f,"DIV",{});var E=k(t);e=p(E,"DIV",{class:!0});var x=k(e);n=p(x,"DIV",{class:!0});var L=k(n);s=p(L,"DIV",{class:!0,"data-svelte-h":!0}),V(s)!=="svelte-1wn133u"&&(s.textContent=g),i=A(L),o=p(L,"BUTTON",{class:!0,"data-svelte-h":!0}),V(o)!=="svelte-jy6ttc"&&(o.textContent=u),L.forEach(b),_=A(x),l=p(x,"DIV",{class:!0});var m=k(l);v.l(m),m.forEach(b),x.forEach(b),E.forEach(b),y=A(f),_t(c.$$.fragment,f),this.h()},h(){d(s,"class","text-xl md:text-3xl"),d(o,"class","bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"),d(n,"class","flex flex-col md:flex-row gap-3 md:justify-between"),d(l,"class","mt-10 overflow-x-auto"),d(e,"class","max-w-7xl mx-auto")},m(f,E){P(f,t,E),a(t,e),a(e,n),a(n,s),a(n,i),a(n,o),a(e,_),a(e,l),v.m(l,null),P(f,y,E),vt(c,f,E),T=!0,C||(j=U(o,"click",r[4]),C=!0)},p(f,[E]){B===(B=M(f))&&v?v.p(f,E):(v.d(1),v=B(f),v&&(v.c(),v.m(l,null)));const x={};E&16386&&(x.$$scope={dirty:E,ctx:f}),!w&&E&4&&(w=!0,x.show=f[2],nt(()=>w=!1)),c.$set(x)},i(f){T||(bt(c.$$.fragment,f),T=!0)},o(f){yt(c.$$.fragment,f),T=!1},d(f){f&&(b(t),b(y)),v.d(),gt(c,f),C=!1,j()}}}function Lt(r,t,e){let n=[],s={};async function g(){e(0,n=await W.mutasi.toArray())}g();let i=!1;function o(){s.id?W.mutasi.put(s):(e(1,s.id=wt(),s),e(1,s.createdAt=Z().format("YYYY-MM-DD"),s),W.mutasi.add(s)),Et("mutasi",s),e(2,i=!1),g()}Ct.subscribe("mutasi",()=>{g()});const u=()=>{e(2,i=!0),e(1,s={})},_=T=>{e(1,s=T),e(2,i=!0)};function l(){s.name=this.value,e(1,s)}function y(){s.status=ot(this),e(1,s)}function c(){s.note=this.value,e(1,s)}function w(T){i=T,e(2,i)}return[n,s,i,o,u,_,l,y,c,w]}class Vt extends ft{constructor(t){super(),ht(this,t,Lt,Mt,lt,{})}}export{Vt as component};