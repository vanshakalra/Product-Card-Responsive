/* LOOK – shared data, store, header, sheet and toast. No build step. */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const INR=n=>"₹"+Math.round(n).toLocaleString("en-IN");
const SIZES=["XXS","XS","S","M","L","XL"];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- Catalogue (edit here) ---------- */
const COLORS={
  grey:{name:"Slate Grey",hex:"#6b6f76",img:"assets/1.png"},
  white:{name:"White",hex:"#f4f4f2",img:"assets/2.png"},
  black:{name:"Black",hex:"#1c1c1e",img:"assets/3.png"},
  pink:{name:"Dusty Rose",hex:"#d98c8c",img:"assets/4.png"}
};
const P=(id,brand,name,type,style,mrp,price,colors,trend,rating,reviews,fit,fabric,neck,days)=>({id:String(id),brand,name,type,style,mrp,price,colors,trend,rating,reviews,fit,fabric,neck,days});
const PRODUCTS=[
  P(1,"H&M","Regular Fit Cotton Sweatshirt","Sweatshirt","Crew neck",3499,1799,["grey","black","pink"],"low",4.3,3700,"Regular","Cotton","Crew neck",2),
  P(2,"Pepe Jeans","Zip-Up Cotton Hoodie","Hoodie","Zip-ups",3499,1799,["white"],"avg",4.5,1200,"Regular","Cotton","Hooded",2),
  P(3,"H&M","Oversized Crew Sweatshirt","Sweatshirt","Oversized",2999,1499,["black","grey"],"low",4.1,860,"Oversized","Cotton","Crew neck",3),
  P(4,"Levis","Crewneck Sweatshirt","Sweatshirt","Crew neck",3999,2399,["pink","grey"],"high",4.4,2100,"Regular","Cotton blend","Crew neck",2),
  P(5,"Levis","Logo Cotton Sweatshirt","Sweatshirt","Crew neck",3499,1749,["grey","pink","black"],"avg",4.2,940,"Regular","Cotton","Crew neck",3),
  P(6,"Nike","Club Fleece Zip Hoodie","Hoodie","Zip-ups",4295,3219,["white"],"low",4.6,5300,"Regular","Fleece","Hooded",1),
  P(7,"Pepe Jeans","Relaxed Fit Sweatshirt","Sweatshirt","Oversized",2799,1399,["black","pink"],"avg",3.9,410,"Relaxed","Cotton","Crew neck",4),
  P(8,"H&M","Essential Sweatshirt","Sweatshirt","Crew neck",1999,1799,["pink","grey"],"high",4.0,1800,"Regular","Cotton blend","Crew neck",2),
  P(9,"H&M","Fleece Zip Hoodie","Hoodie","Fleece",2999,1999,["white"],"low",4.2,760,"Regular","Fleece","Hooded",3),
  P(10,"Levis","Classic Cotton Sweatshirt","Sweatshirt","Crew neck",3299,1649,["black","grey","pink"],"avg",4.3,3100,"Regular","Cotton","Crew neck",2),
  P(11,"Levis","Tonal Pullover Hoodie","Hoodie","Hooded",3699,2589,["white"],"high",4.4,980,"Relaxed","Cotton blend","Hooded",2),
  P(12,"Nike","Dri-FIT Crew Sweatshirt","Sweatshirt","Fleece",3995,2797,["pink","black"],"low",4.5,2600,"Regular","Fleece","Crew neck",1)
];
PRODUCTS.forEach(p=>p.disc=Math.floor((p.mrp-p.price)/p.mrp*100));
const byId=id=>PRODUCTS.find(p=>p.id===String(id));
const fmtK=n=>n>=1000?(n/1000).toFixed(1).replace(/\.0$/,"")+"k":String(n);

const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
function stockOf(p,c){const o={};SIZES.forEach(s=>{const v=hash(p.id+c+s)%11;o[s]=s==="XXS"?(v>8?v-8:0):(v<2?0:v-1)});
  if(p.id%3===0||p.id==="5"){SIZES.forEach(s=>o[s]=Math.min(o[s],2))}
  if(!SIZES.some(s=>o[s]))o.M=2;return o}
const stockTotal=(p,c)=>Object.values(stockOf(p,c)).reduce((a,b)=>a+b,0);
const LOW=6;

/* ---------- Price history (demo data, seeded) ---------- */
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const _hist={};
function history(p){if(_hist[p.id])return _hist[p.id];
  const r=rng(hash("h"+p.id)),N=90,out=[];let w=0;
  for(let i=0;i<N;i++){w=w*.82+(r()-.5)*.05;let m;
    if(p.trend==="low")m=1.1+w+.05*Math.sin(i/9)+(i<30?.1:0);
    else if(p.trend==="avg")m=1.07+w+(i>48&&i<54?-.13:0);
    else m=(i<58?.95:i<68?.86:.9+(i-68)*(.1/21))+w*.6;
    out.push(Math.round(p.price*m/10)*10)}
  if(p.trend==="low")for(let i=0;i<N;i++)out[i]=Math.max(out[i],Math.ceil(p.price*1.03/10)*10);
  out[N-1]=p.price;
  if(p.trend==="high"){const lo=Math.round(p.price*.82/10)*10;out[60]=Math.min(out[60],lo)}
  return _hist[p.id]=out}
function priceInfo(p){const h=history(p),min=Math.min(...h),max=Math.max(...h),avg=h.reduce((a,b)=>a+b,0)/h.length;
  const minI=h.indexOf(min),day=i=>{const d=new Date();d.setDate(d.getDate()-(h.length-1-i));return d};
  let kind,short,verdict;
  if(p.price<=min){kind="good";short="Lowest in 90 days";verdict="Lowest price in 90 days"}
  else if(p.price<=avg*.97){kind="ok";short="Price history";verdict=Math.round((1-p.price/avg)*100)+"% below the 90-day average"}
  else{kind="warn";short="Dipped to "+INR(min);verdict=INR(p.price-min)+" above the 90-day low"}
  return{h,min,max,avg,minI,day,kind,short,verdict}}

/* ---------- Delivery location ---------- */
const CITIES={"282001":"Agra","110001":"Delhi","400001":"Mumbai","560001":"Bengaluru","600001":"Chennai","700001":"Kolkata","500001":"Hyderabad","411001":"Pune"};
const cityOf=pin=>CITIES[pin]||"your area";
const deliverBy=(days,pin)=>{const d=new Date();d.setDate(d.getDate()+days+(pin==="282001"?0:1));return d.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})};

/* ---------- Coupons ---------- */
const COUPONS=[
 {code:"LOOK10",title:"10% off",desc:"Up to ₹300 off. No minimum order.",min:0,calc:s=>Math.min(300,Math.round(s*.1))},
 {code:"FIRST200",title:"₹200 off",desc:"On orders of ₹1,999 and above.",min:1999,calc:()=>200},
 {code:"WINTER15",title:"15% off",desc:"Up to ₹500 off on orders of ₹3,000 and above.",min:3000,calc:s=>Math.min(500,Math.round(s*.15))}];

/* ---------- Store (localStorage; every access guarded) ---------- */
const Store=(()=>{const D=()=>({items:[],wish:[],user:null,coupon:null,notify:[],pin:"282001"});let s=D();
  const load=()=>{try{s=Object.assign(D(),JSON.parse(localStorage.getItem("look-store2")||"{}"))}catch{}};
  const save=()=>{try{localStorage.setItem("look-store2",JSON.stringify(s))}catch{}document.dispatchEvent(new Event("store"))};
  load();addEventListener("storage",e=>{if(e.key==="look-store2"){load();document.dispatchEvent(new Event("store"))}});
  const key=i=>i.pid+"|"+i.color+"|"+i.size;
  return{
    get:()=>s,key,
    count:()=>s.items.reduce((a,i)=>a+i.qty,0),
    maxQty:i=>Math.min(5,stockOf(byId(i.pid),i.color)[i.size]||1),
    add(pid,color,size){const f=s.items.find(i=>i.pid===pid&&i.color===color&&i.size===size);
      if(f)f.qty=Math.min(f.qty+1,Store.maxQty(f));else s.items.push({pid,color,size,qty:1});save()},
    setQty(k,q){const i=s.items.find(x=>key(x)===k);if(i){i.qty=Math.max(1,Math.min(q,Store.maxQty(i)));save()}},
    setSize(k,size){const i=s.items.find(x=>key(x)===k);if(!i)return;const o=s.items.find(x=>x!==i&&x.pid===i.pid&&x.color===i.color&&x.size===size);
      if(o){o.qty=Math.min(o.qty+i.qty,Store.maxQty(o));s.items=s.items.filter(x=>x!==i)}else{i.size=size;i.qty=Math.min(i.qty,Store.maxQty(i))}save()},
    remove(k){const n=s.items.findIndex(x=>key(x)===k);if(n<0)return null;const[it]=s.items.splice(n,1);save();return{it,n}},
    restore(r){s.items.splice(Math.min(r.n,s.items.length),0,r.it);save()},
    clear(){s.items=[];s.coupon=null;save()},
    inBag:(pid,color)=>s.items.some(i=>i.pid===pid&&i.color===color),
    isWish:pid=>s.wish.includes(pid),
    toggleWish(pid){const on=!s.wish.includes(pid);s.wish=on?[...s.wish,pid]:s.wish.filter(x=>x!==pid);save();return on},
    isNotify:pid=>s.notify.includes(pid),
    toggleNotify(pid){const on=!s.notify.includes(pid);s.notify=on?[...s.notify,pid]:s.notify.filter(x=>x!==pid);save();return on},
    signIn(u){s.user=u;save()},signOut(){s.user=null;save()},
    setCoupon(c){s.coupon=c;save()},setPin(p){s.pin=p;save()}}})();

/* ---------- Icons ---------- */
const sv=(d,w=20,extra="")=>`<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const ICON={
 search:sv('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
 user:sv('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4-6 8-6s7 1.5 8 6"/>'),
 heart:sv('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z"/>'),
 bag:sv('<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6.5a3 3 0 016 0V8"/>'),
 back:sv('<path d="M15 5l-7 7 7 7"/>',22),
 pin:sv('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>',17),
 chev:sv('<path d="M6 9l6 6 6-6"/>',16),
 chevr:sv('<path d="M9 5l7 7-7 7"/>',18),
 trash:sv('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',18),
 truck:sv('<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/>',18),
 tag:sv('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',18),
 sort:sv('<path d="M8 4v16M8 20l-3-3M8 20l3-3M16 20V4M16 4l-3 3M16 4l3 3"/>',22),
 brand:sv('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',22),
 size:sv('<rect x="3" y="8" width="18" height="8" rx="1.5"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',22),
 colour:sv('<path d="M12 3s6 6.2 6 10.5a6 6 0 01-12 0C6 9.2 12 3 12 3z"/>',22),
 filter:sv('<path d="M3 7h9M16 7h5M3 17h5M12 17h9"/><circle cx="14" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',22),
 star:'<svg width="11" height="11" viewBox="0 0 24 24" fill="#f5a623" aria-hidden="true"><path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5L9 8.9z"/></svg>',
 trend:sv('<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',12),
 flame:sv('<path d="M12 3c1 3 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',16),
 star2:sv('<path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z"/>',16),
 check:sv('<path d="M5 12.5l4.5 4.5L19 7.5"/>',14,'stroke-width="3"')};

/* ---------- Header ---------- */
function renderHeader({page=""}={}){
  document.body.insertAdjacentHTML("afterbegin",`<a class="skip" href="#main">Skip to content</a>
<header class="top" id="top">
  <button class="icon back" id="backBtn" aria-label="Back" type="button">${ICON.back}</button>
  <a class="logo" href="index.html" aria-label="LOOK home"><img src="assets/logo.png" alt="" onerror="this.remove()"><span>L<em>OO</em>K</span></a>
  <nav class="nav" aria-label="Primary"><a href="index.html"${page==="home"?' aria-current="page"':""}>Men</a><a href="#" data-soon="Women">Women</a><a href="#" data-soon="Kids">Kids</a><a href="#" data-soon="Home">Home</a></nav>
  <form class="search desk" role="search" data-search>${ICON.search}<span class="sr">Search</span><input type="search" placeholder="Search for sweatshirts, brands…" autocomplete="off"></form>
  <div class="tools">
    <button class="tool srch" id="srchBtn" aria-label="Search" type="button">${ICON.search}</button>
    <button class="tool prof" id="profBtn" aria-label="Account" type="button">${ICON.user}<b>Profile</b></button>
    <button class="tool" id="wishBtn" aria-label="Wishlist" type="button">${ICON.heart}<b>Wishlist</b><i class="badge" id="wBadge" aria-hidden="true">0</i></button>
    <a class="tool cart" id="cartBtn" href="cart.html" aria-label="Cart, 0 items">${ICON.bag}<b>Cart</b><i class="badge" id="badge" aria-hidden="true">0</i></a>
  </div>
  <div class="finder"><form class="search" role="search" data-search>${ICON.search}<span class="sr">Search</span><input type="search" placeholder="Search for sweatshirts, brands…" autocomplete="off"></form></div>
</header><div class="live sr" id="live" aria-live="polite"></div>`);
  const bump=(b,n)=>{const was=+b.textContent;b.textContent=n;b.classList.toggle("on",n>0);if(n>was){b.classList.remove("bump");void b.offsetWidth;b.classList.add("bump")}};
  const sync=()=>{const n=Store.count();bump($("#badge"),n);$("#cartBtn").setAttribute("aria-label",`Cart, ${n} ${n===1?"item":"items"}`);
    bump($("#wBadge"),Store.get().wish.length);
    const u=Store.get().user;$("#profBtn").innerHTML=u?`<span class="avatar" aria-hidden="true">${esc(u.name[0].toUpperCase())}</span><b>${esc(u.name)}</b>`:`${ICON.user}<b>Profile</b>`;
    $("#profBtn").setAttribute("aria-label",u?`Account, signed in as ${u.name}`:"Sign in")};
  sync();document.addEventListener("store",sync);
  $("#backBtn").onclick=()=>{if(page==="home"||history.length<2)location.href="index.html";else history.back()};
  if(page==="home")$("#backBtn").classList.add("ghost");
  $("#srchBtn").onclick=()=>{const t=$("#top");t.classList.toggle("searching");if(t.classList.contains("searching"))$(".finder input").focus()};
  $$("[data-soon]").forEach(a=>a.onclick=e=>{e.preventDefault();toast(a.dataset.soon+" collection is coming soon")});
  $("#profBtn").onclick=()=>{const u=Store.get().user;if(!u)return location.href="login.html?next="+encodeURIComponent(location.pathname.split("/").pop()||"index.html");
    openSheet({title:"Account",html:`<div class="acct"><span class="avatar lg">${esc(u.name[0].toUpperCase())}</span><div><b>${esc(u.name)}</b><p>${esc(u.id)}</p></div></div><div class="sheet-foot"><button class="done" id="so">Sign out</button></div>`,
      onMount:(el,close)=>$("#so",el).onclick=()=>{Store.signOut();close();toast("Signed out")}})};
  $$("[data-search]").forEach(f=>{f.addEventListener("submit",e=>e.preventDefault());
    f.querySelector("input").addEventListener("keydown",e=>{if(e.key==="Enter"&&!document.body.dataset.listing)location.href="index.html?q="+encodeURIComponent(e.target.value)})})}
function say(t){const l=$("#live");if(l){l.textContent="";setTimeout(()=>l.textContent=t,30)}}

/* Delivery-location bar + pincode sheet */
function locationBar(){const pin=Store.get().pin,city=cityOf(pin);
  return`<button class="loc" id="locBtn" type="button" aria-haspopup="dialog">${ICON.pin}<span><b>${pin==="282001"?"Home":"Deliver to"}</b> ${pin==="282001"?"12 MG Road, Agra 282001":city+" "+pin}</span>${ICON.chev}</button>`}
function pinSheet(){const cur=Store.get().pin;
  openSheet({title:"Deliver to",html:`<form class="pinf" id="pf" novalidate><label class="sr" for="pin">Pincode</label><div class="pinrow"><input id="pin" inputmode="numeric" maxlength="6" placeholder="Enter 6-digit pincode" value="${cur}" autocomplete="postal-code" data-focus="1"><button class="done sm">Check</button></div><p class="msg" id="pm" role="alert"></p>
<div class="pins">${Object.entries(CITIES).map(([p,c])=>`<button type="button" class="opt" data-p="${p}">${c} <small>${p}</small></button>`).join("")}</div></form>`,
  onMount:(el,close)=>{const set=p=>{Store.setPin(p);close();toast("Delivering to "+cityOf(p)+" "+p)};
    $("#pf",el).onsubmit=e=>{e.preventDefault();const v=$("#pin",el).value.trim();if(!/^[1-9]\d{5}$/.test(v)){$("#pm",el).textContent="Enter a valid 6-digit pincode.";return}set(v)};
    el.addEventListener("click",e=>{const b=e.target.closest("[data-p]");if(b)set(b.dataset.p)})}})}

/* ---------- Sheet ---------- */
let _sheet=null;
function openSheet({title,html,onMount,onClose,cls=""}){
  if(_sheet)_sheet.close(true);const tt=$("#toast");if(tt)tt.classList.remove("on");
  let sc=$("#scrim");if(!sc){document.body.insertAdjacentHTML("beforeend",'<div class="scrim" id="scrim"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle"></div>');sc=$("#scrim")}
  const el=$("#sheet"),last=document.activeElement;el.className="sheet "+cls;
  el.innerHTML=`<div class="sheet-head"><h2 id="sheetTitle">${esc(title)}</h2><button class="x" aria-label="Close" type="button">×</button></div>${html}`;
  el.removeAttribute("aria-hidden");document.body.classList.add("open");
  const close=silent=>{document.body.classList.remove("open");el.setAttribute("aria-hidden","true");document.removeEventListener("keydown",key);sc.onclick=null;_sheet=null;
    if(!silent){onClose&&onClose();last&&last.focus&&last.focus()}};
  const key=e=>{if(e.key==="Escape")return close();
    if(e.key==="Tab"){const f=$$("button:not(:disabled),a[href],input,select,[tabindex='0']",el).filter(x=>x.offsetParent);if(!f.length)return;
      const a=f[0],b=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus()}else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus()}}};
  document.addEventListener("keydown",key);sc.onclick=()=>close();$(".x",el).onclick=()=>close();
  _sheet={close};onMount&&onMount(el,close);
  (el.querySelector("[data-focus]")||el.querySelector(".x")).focus();return _sheet}

/* ---------- Toast ---------- */
let _t;
function toast(msg,action){let t=$("#toast");if(!t){document.body.insertAdjacentHTML("beforeend",'<div class="toast" id="toast" role="status"></div>');t=$("#toast")}
  clearTimeout(_t);t.innerHTML=`<span>${esc(msg)}</span>${action?`<button type="button">${esc(action.label)}</button>`:""}`;
  if(action)t.querySelector("button").onclick=()=>{action.fn();t.classList.remove("on")};
  requestAnimationFrame(()=>t.classList.add("on"));_t=setTimeout(()=>t.classList.remove("on"),action?6000:2600)}

/* ---------- Group bag (demo: shared through localStorage, so two windows of the same browser sync live) ---------- */
const GCOL=["#dc3737","#3b6fd8","#1f9d6b","#b5651d","#8a4fd0","#c2418f"];
const Group=(()=>{const K="look-group";let g=null;
  const load=()=>{try{g=JSON.parse(localStorage.getItem(K)||"null")}catch{g=null}};
  const save=()=>{try{localStorage.setItem(K,JSON.stringify(g))}catch{}document.dispatchEvent(new Event("group"))};
  load();addEventListener("storage",e=>{if(e.key===K){load();document.dispatchEvent(new Event("group"))}});
  const uid=()=>Math.random().toString(36).slice(2,8);
  const meId=()=>{try{return sessionStorage.getItem("look-me")}catch{return null}};
  const setMe=id=>{try{sessionStorage.setItem("look-me",id)}catch{}};
  const member=(name,bot)=>({id:uid(),name:name.trim().slice(0,20)||"Friend",bot:!!bot,col:GCOL[(g?g.members.length:0)%GCOL.length]});
  return{
    get:()=>g,
    me:()=>g&&g.members.find(m=>m.id===meId())||null,
    who:id=>g&&g.members.find(m=>m.id===id)||{name:"Someone",col:"#888"},
    create(name,myName){g=null;g={id:uid().toUpperCase(),name:name.trim().slice(0,30)||"Our group bag",members:[],items:[],msgs:[],at:Date.now()};
      const m=member(myName);g.members.push(m);setMe(m.id);save();return g},
    join(code,name){if(!g||g.id!==code)return null;const m=member(name);g.members.push(m);setMe(m.id);save();return m},
    addBot(name){const m=member(name,true);g.members.push(m);save();return m},
    add(pid,color,size,by){const f=g.items.find(i=>i.pid===pid&&i.color===color&&i.size===size);if(f)return f;
      const it={id:uid(),pid,color,size,by,votes:{}};g.items.push(it);save();return it},
    remove(id){g.items=g.items.filter(i=>i.id!==id);save()},
    vote(id,mid,v){const it=g.items.find(i=>i.id===id);if(!it)return;if(it.votes[mid]===v)delete it.votes[mid];else it.votes[mid]=v;save()},
    say(text,by){if(!text.trim())return;g.msgs.push({id:uid(),by,text:text.trim().slice(0,200),t:Date.now()});save()},
    leave(){g=null;try{localStorage.removeItem(K)}catch{}try{sessionStorage.removeItem("look-me")}catch{}document.dispatchEvent(new Event("group"))},
    active:()=>!!g,
    link:()=>new URL("group.html?join="+g.id,location.href).href,
    score:it=>Object.values(it.votes).reduce((a,b)=>a+b,0)}})();
function startGroupSheet(then){
  openSheet({title:"Start a group bag",html:`<form class="pinf" id="gf" novalidate><p class="fine" style="margin:0 0 12px;font-size:13px">Pick things together. Friends add items, vote and chat before anyone buys.</p>
<div class="fld"><label for="gn">Group name</label><div class="mob"><input id="gn" value="Weekend wardrobe" maxlength="30" data-focus="1"></div></div>
<div class="fld" style="margin-top:12px"><label for="gm">Your name</label><div class="mob"><input id="gm" placeholder="e.g. Vansha" maxlength="20" autocomplete="given-name"></div></div><p class="msg" id="gme" role="alert"></p>
<button class="done" style="margin-top:6px">Create group bag</button></form>`,
  onMount:(el,close)=>{$("#gf",el).onsubmit=e=>{e.preventDefault();const n=$("#gm",el).value.trim();if(!n){$("#gme",el).textContent="Enter your name so friends know who added what.";return}
    Group.create($("#gn",el).value,n);close();then&&then()}}})}
