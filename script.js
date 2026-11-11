/* LOOK listing: discovery rows, cards, size sheet, Price Check, Filters page */
renderHeader({page:"home"});
const F0=()=>({q:"",quick:[],types:[],styles:[],colors:[],sizes:[],brands:[],price:[],disc:0,rating:0,ship:0,fits:[],fabrics:[],necks:[],sort:"rec"});
let F=F0();
try{const s=JSON.parse(sessionStorage.getItem("look-f2")||"null");if(s)F=Object.assign(F0(),s)}catch{}
{const u=new URLSearchParams(location.search);if(u.get("q"))F.q=u.get("q");if(u.get("wish")==="1"&&!F.quick.includes("wish"))F.quick.push("wish")}
const keep=()=>{try{sessionStorage.setItem("look-f2",JSON.stringify(F))}catch{}};
const sel={};
const QUICK={drop:["Winter Price Drop",p=>priceInfo(p).kind==="good",ICON.trend.replace('width="12" height="12"','width="16" height="16"')],deal:["Crazy Deal",p=>p.disc>=50,ICON.flame],top:["Top Rated",p=>p.rating>=4.4,ICON.star2],fast:["Delivery in 2 days",p=>p.days<=2],wish:["In my wishlist",p=>Store.isWish(p.id)]};
const TOPQ=["drop","deal","top"];
const PRICES=[["u15","Under ₹1,500",0,1499],["m","₹1,500 – ₹2,000",1500,2000],["m2","₹2,000 – ₹3,000",2000,3000],["o3","Above ₹3,000",3001,1e9]];
const PHOTO={grey:"assets/1.png",white:"assets/2.png",black:"assets/3.png",pink:"assets/4.png"};
const TILES=[["","All items","assets/1.png"],["Sweatshirt","Sweatshirts","assets/4.png"],["Hoodie","Hoodies","assets/2.png"]];
const CIRCS=[["Crew neck","assets/4.png"],["Hooded","assets/2.png"],["Zip-ups","assets/2.png"],["Oversized","assets/3.png"],["Fleece","assets/1.png"]];

/* ---------- filtering ---------- */
const any=(a,v)=>!a.length||a.includes(v);
function match(p,f=F){
  if(f.q){const t=(p.brand+" "+p.name+" "+p.style+" "+p.colors.map(c=>COLORS[c].name).join(" ")).toLowerCase();if(!f.q.toLowerCase().split(/\s+/).every(w=>t.includes(w)))return false}
  if(!f.quick.every(k=>QUICK[k][1](p)))return false;
  if(!any(f.types,p.type)||!any(f.styles,p.style)||!any(f.brands,p.brand)||!any(f.fits,p.fit)||!any(f.fabrics,p.fabric)||!any(f.necks,p.neck))return false;
  if(f.colors.length&&!p.colors.some(c=>f.colors.includes(c)))return false;
  if(f.price.length&&!f.price.some(k=>{const r=PRICES.find(x=>x[0]===k);return p.price>=r[2]&&p.price<=r[3]}))return false;
  if(f.disc&&p.disc<f.disc)return false;if(f.rating&&p.rating<f.rating)return false;if(f.ship&&p.days>f.ship)return false;
  if(f.sizes.length&&!p.colors.some(c=>(f.colors.length?f.colors.includes(c):true)&&f.sizes.some(s=>stockOf(p,c)[s]>0)))return false;
  return true}
const results=(f=F)=>{const l=PRODUCTS.filter(p=>match(p,f));
  const s={pa:(a,b)=>a.price-b.price,pd:(a,b)=>b.price-a.price,disc:(a,b)=>b.disc-a.disc,rate:(a,b)=>b.rating-a.rating}[f.sort];if(s)l.sort(s);return l};
const nOther=(f=F)=>f.quick.length+f.styles.length+f.colors.length+f.sizes.length+f.brands.length+f.price.length+(f.disc?1:0)+(f.rating?1:0)+(f.ship?1:0)+f.fits.length+f.fabrics.length+f.necks.length+f.types.length;

/* ---------- card ---------- */
const heartBtn=(p,l)=>`<button class="heart" aria-pressed="${Store.isWish(p.id)}" aria-label="Add ${esc(l)} to wishlist"><span><svg width="13" height="12" viewBox="0 0 24 22"><path d="M12 20s-9-5.5-9-12.2A5 5 0 0112 5a5 5 0 019 2.8C21 14.5 12 20 12 20z"/></svg></span></button>`;
const curColor=p=>sel[p.id]&&p.colors.includes(sel[p.id])?sel[p.id]:(p.colors.find(c=>F.colors.includes(c))||p.colors[0]);
const slides=(p,c)=>{const l=`${p.brand} ${p.name} in ${COLORS[c].name}`,src=COLORS[c].img;return`<div class="slide"><img src="${src}" alt="${esc(l)}" width="160" height="200"></div><div class="slide zoom"><img src="${src}" alt="${esc(l)}, close-up" width="160" height="200"></div>`};
function cardHTML(p,i){const c=curColor(p),pi=priceInfo(p),l=`${p.brand} ${p.name}`,tot=stockTotal(p,c),more=p.colors.length>3?p.colors.length-3:0;
  return`<article class="card" data-id="${p.id}" style="animation-delay:${Math.min(i,11)*25}ms"><div class="media"><div class="track">${slides(p,c)}</div><div class="dots" aria-hidden="true"></div>
<span class="ltag" ${tot<=LOW?"":"hidden"}>Limited stock</span><span class="rate" aria-label="Rated ${p.rating} from ${p.reviews} reviews">${ICON.star}${p.rating.toFixed(1)}<span>${fmtK(p.reviews)}</span></span>${heartBtn(p,l)}</div>
<div class="info"><p class="name"><b>${esc(p.brand)}</b><span>${esc(p.name)}</span></p>
<div class="sw${p.colors.length<2?" one":""}" role="radiogroup" aria-label="Colour">${p.colors.map(k=>`<button type="button" role="radio" aria-checked="${k===c}" aria-label="${COLORS[k].name}" data-c="${k}"><i style="background:${COLORS[k].hex}"></i></button>`).join("")}<em>${COLORS[c].name}</em></div>
<div class="meta"><button class="pc ${pi.kind}" type="button" aria-label="Price history: ${esc(pi.verdict)}">${ICON.trend}${esc(pi.short)}</button></div>
<p class="price"><s class="old"><span class="sr">Original price </span>${INR(p.mrp)}</s><span class="now">${INR(p.price)}</span><span class="off">${p.disc}% Off</span></p></div>
<div class="row"><button class="cta add" type="button"></button>${heartBtn(p,l)}</div></article>`}
const CHECK=ICON.check;
function paintCta(card,flash){const p=byId(card.dataset.id),c=curColor(p),b=$(".cta",card);
  if(flash){b.className="cta add added";b.innerHTML=CHECK+"Added (size "+flash+")";return}
  b.disabled=false;b.className="cta add";
  if(Store.inBag(p.id,c)){b.className="cta add bagged";b.innerHTML='Go to Bag '+sv('<path d="M5 12h14M13 6l6 6-6 6"/>',14)}
  else b.textContent="Add to Cart"}
function setColor(card,c){const p=byId(card.dataset.id);sel[p.id]=c;
  $$(".sw button",card).forEach(b=>b.setAttribute("aria-checked",b.dataset.c===c));$(".sw em",card).textContent=COLORS[c].name;
  const t=$(".track",card);t.innerHTML=slides(p,c);t.scrollTo({left:0});$(".ltag",card).hidden=stockTotal(p,c)>LOW;paintCta(card);say(COLORS[c].name+" selected")}

/* ---------- render ---------- */
const thumb=u=>`style="background-image:url(${u})"`;
function renderRows(){
  const gb=Group.active()?`<a class="qchip gchip" href="group.html">${sv('<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M3 20c.5-3.8 3-5.5 6-5.5s5.5 1.7 6 5.5M15.5 14.8c3 0 5 1.4 5.5 4.7"/>',16)}Group bag · ${Group.get().items.length}</a>`:"";
  $("#quick").innerHTML=gb+TOPQ.map(k=>`<button class="qchip" type="button" data-q="${k}" aria-pressed="${F.quick.includes(k)}">${QUICK[k][2]}${QUICK[k][0]}</button>`).join("");
  $("#tiles").innerHTML=TILES.map(([v,l,im])=>{const on=v?F.types.includes(v):!F.types.length;return`<button class="tile" type="button" data-t="${v}" aria-pressed="${on}"><span class="im" ${thumb(im)}></span>${l}<span class="ck">${ICON.check}</span></button>`}).join("");
  $("#circs").innerHTML=CIRCS.map(([l,im])=>`<button class="circ" type="button" data-s="${l}" aria-pressed="${F.styles.includes(l)}"><span class="im" ${thumb(im)}></span>${l}</button>`).join("")}
function renderFab(){const on=k=>F[k].length>0;
  $("#fab").innerHTML=[["sort","Sort",ICON.sort,F.sort!=="rec"],["brands","Brand",ICON.brand,on("brands")],["sizes","Size",ICON.size,on("sizes")],["colors","Colour",ICON.colour,on("colors")],["all","Filters",ICON.filter,nOther()-F.brands.length-F.sizes.length-F.colors.length>0]]
   .map(([k,l,ic,a],i)=>`<button type="button" data-fab="${k}" class="${a?"on":""}${i===4?" sep":""}">${ic}<i></i>${l}</button>`).join("")}
function render(){
  renderRows();renderFab();
  const list=results();
  $("#grid").innerHTML=list.length?list.map(cardHTML).join(""):`<div class="empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M8.5 11h5"/></svg><h2>Nothing matches</h2><p>Try removing a filter or searching for something else.</p><button class="done" id="clr" style="width:auto;padding:0 28px">Clear all filters</button></div>`;
  $$(".card").forEach(c=>paintCta(c));initCarousels();
  $("#count").textContent=`${list.length} ${list.length===1?"product":"products"}`;
  const n=nOther();$("#fcount").textContent=n;$("#fcount").classList.toggle("on",n>0);
  $$("input[type=search]").forEach(i=>{if(document.activeElement!==i)i.value=F.q});$("#sort").value=F.sort;
  const pills=[];const L={sizes:s=>"Size "+s,colors:c=>COLORS[c].name,price:k=>PRICES.find(x=>x[0]===k)[1],quick:k=>QUICK[k][0]};
  ["quick","types","styles","colors","sizes","brands","price","fits","fabrics","necks"].forEach(k=>F[k].forEach(v=>{if(k==="quick"&&TOPQ.includes(v))return pills.push([k,v,QUICK[v][0]]);pills.push([k,v,(L[k]?L[k](v):v)])}));
  if(F.disc)pills.push(["disc",F.disc,F.disc+"% off or more"]);if(F.rating)pills.push(["rating",F.rating,F.rating+"★ & above"]);if(F.ship)pills.push(["ship",F.ship,"Delivery in "+F.ship+" days"]);if(F.q)pills.push(["q",F.q,"“"+F.q+"”"]);
  $("#active").innerHTML=pills.length?pills.map(([k,v,l])=>`<button class="pill" data-k="${k}" data-v="${esc(v)}" type="button" aria-label="Remove filter ${esc(l)}">${esc(l)}<i aria-hidden="true">×</i></button>`).join("")+`<button class="pill clear" id="clr2" type="button">Clear all</button>`:"";
  keep()}
function clearAll(){F=Object.assign(F0(),{sort:F.sort});render();say("All filters cleared")}

/* ---------- carousel: dots follow scroll; desktop hover previews the close-up ---------- */
const wide=matchMedia("(min-width:1024px) and (hover:hover)"),calm=matchMedia("(prefers-reduced-motion:reduce)");
const count=m=>m.querySelectorAll(".slide").length;
function sync(m){const n=count(m);m.querySelector(".dots").innerHTML=Array.from({length:n},(_,k)=>`<i class="${k?"":"on"}"></i>`).join("");m.classList.toggle("single",n<2)}
function initCarousels(){$$(".media").forEach(m=>{const t=m.querySelector(".track");let n=0,timer;
 const go=i=>{const c=count(m);if(c<2)return;n=(i+c)%c;t.scrollTo({left:n*t.clientWidth,behavior:"smooth"})};
 t.addEventListener("scroll",()=>{const i=Math.round(t.scrollLeft/t.clientWidth);m.querySelectorAll(".dots i").forEach((x,k)=>x.classList.toggle("on",k===i));n=i},{passive:true});
 m.addEventListener("mouseenter",()=>{if(wide.matches&&!calm.matches&&count(m)>1){go(1);timer=setInterval(()=>go(n+1),1100)}});
 m.addEventListener("mouseleave",()=>{clearInterval(timer);if(wide.matches&&count(m)>1)t.scrollTo({left:0,behavior:"smooth"})});
 sync(m)})}

/* ---------- size sheet ---------- */
function sizeSheet(card){const p=byId(card.dataset.id),c=curColor(p),st=stockOf(p,c);let size=null,dest="bag";
  openSheet({title:"Select size",html:`<div class="mini"><span class="th"><img src="${COLORS[c].img}" alt=""></span><div><b>${esc(p.brand)}</b><span>${esc(p.name)} · ${COLORS[c].name}</span><br><span>${INR(p.price)}</span></div></div>
<div class="sizes" role="radiogroup" aria-label="Size">${SIZES.map(s=>`<button class="size" role="radio" aria-checked="false" data-s="${s}" ${st[s]?"":'disabled'} aria-label="${s}${st[s]?(st[s]<=3?`, only ${st[s]} left`:""):", out of stock"}">${s}${st[s]&&st[s]<=3?`<small>${st[s]} left</small>`:""}</button>`).join("")}</div>
${Group.active()&&Group.me()?`<div class="seg" role="radiogroup" aria-label="Add to"><button role="radio" aria-checked="true" data-dest="bag" type="button">My bag</button><button role="radio" aria-checked="false" data-dest="group" type="button">Group: ${esc(Group.get().name)}</button></div>`:""}
<p class="hint" id="hint">Pick a size to continue.</p><div class="sheet-foot"><button class="done" id="done" disabled>Add to Cart</button></div>`,
  onMount:(el,close)=>{const first=$(".size:not(:disabled)",el);if(first){first.setAttribute("data-focus","1");first.focus()}
    el.onclick=e=>{const dd=e.target.closest("[data-dest]");if(dd){dest=dd.dataset.dest;$$("[data-dest]",el).forEach(x=>x.setAttribute("aria-checked",x===dd));$("#done",el).textContent=dest==="group"?"Add to group bag":"Add to Cart";return}
      const s=e.target.closest(".size");if(!s||s.disabled)return;size=s.dataset.s;$$(".size",el).forEach(x=>x.setAttribute("aria-checked",x===s));$("#done",el).disabled=false;
      $("#hint",el).textContent=st[size]<=3?`Hurry – only ${st[size]} left in ${size}.`:"Size "+size+" selected."};
    $("#done",el).onclick=()=>{if(!size)return;
      if(dest==="group"){Group.add(p.id,c,size,Group.me().id);close();return toast("Added to the group bag",{label:"View",fn:()=>location.href="group.html"})}
      Store.add(p.id,c,size);close();toast(`${p.brand} ${p.name} added to cart`);
      paintCta(card,size);clearTimeout(card._t);card._t=setTimeout(()=>paintCta(card),1500)}}})}

/* ---------- Price Check ---------- */
function priceSheet(card){const p=byId(card.dataset.id),pi=priceInfo(p),h=pi.h,W=320,H=110,pad=6,lo=Math.min(pi.min,p.price)-40,hi=pi.max+40,
  x=i=>pad+i*(W-2*pad)/(h.length-1),y=v=>H-pad-(v-lo)/(hi-lo)*(H-2*pad),d=h.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(v).toFixed(1)).join("");
  const fmt=dt=>dt.toLocaleDateString("en-IN",{day:"numeric",month:"short"}),minD=fmt(pi.day(pi.minI));
  const mrpNote=pi.max<p.mrp?`The struck-through MRP of ${INR(p.mrp)} wasn’t the selling price at any point in the last 90 days – the highest was ${INR(pi.max)}.`:`Sold at the MRP of ${INR(p.mrp)} within the last 90 days.`;
  openSheet({title:"Price check",html:`<div class="pcv"><h3 class="${pi.kind}">${esc(pi.verdict)}</h3><p class="sub">${esc(p.brand)} ${esc(p.name)} · today ${INR(p.price)}</p></div>
<div class="chart"><p class="read" id="read" aria-hidden="true">Drag across the chart for any day</p><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Price over the last 90 days. Low ${INR(pi.min)} on ${minD}, high ${INR(pi.max)}, today ${INR(p.price)}.">
<defs><linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#dc3737" stop-opacity=".18"/><stop offset="1" stop-color="#dc3737" stop-opacity="0"/></linearGradient></defs>
<path d="${d}L${x(h.length-1)} ${H}L${x(0)} ${H}Z" fill="url(#ag)"/><path d="${d}" fill="none" stroke="#dc3737" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
<line id="cur" x1="0" x2="0" y1="0" y2="${H}" stroke="#1f1d1e" stroke-width="1" opacity="0"/><circle id="curd" r="4" fill="#1f1d1e" opacity="0"/>
<circle cx="${x(pi.minI)}" cy="${y(pi.min)}" r="4" fill="#12a150" stroke="#fff" stroke-width="1.5"/><circle cx="${x(h.length-1)}" cy="${y(p.price)}" r="4.5" fill="#1f1d1e" stroke="#fff" stroke-width="1.5"/></svg></div>
<div class="stats"><div><span>90-day low</span><b>${INR(pi.min)}</b></div><div><span>Average</span><b>${INR(pi.avg)}</b></div><div><span>90-day high</span><b>${INR(pi.max)}</b></div><div><span>Today</span><b>${INR(p.price)}</b></div></div>
<p class="mrpnote">${mrpNote}</p>
<button class="switch" role="switch" aria-checked="${Store.isNotify(p.id)}" id="nt"><span>Notify me if the price drops below ${INR(p.price)}</span><i></i></button>
<p class="demo">Demo data – connect your catalogue’s price log to make this live.</p>`,
  onMount:(el)=>{const nt=$("#nt",el);nt.onclick=()=>{const on=Store.toggleNotify(p.id);nt.setAttribute("aria-checked",on);toast(on?"We’ll tell you if the price drops (demo)":"Price alert removed")};
    const svg=$("svg",el),rd=$("#read",el);const mv=e=>{const r=svg.getBoundingClientRect(),i=Math.max(0,Math.min(h.length-1,Math.round((e.clientX-r.left)/r.width*(h.length-1))));
      $("#cur",el).setAttribute("x1",x(i));$("#cur",el).setAttribute("x2",x(i));$("#cur",el).setAttribute("opacity",.35);const cd=$("#curd",el);cd.setAttribute("cx",x(i));cd.setAttribute("cy",y(h[i]));cd.setAttribute("opacity",1);rd.textContent=`${fmt(pi.day(i))} · ${INR(h[i])}`};
    svg.addEventListener("pointermove",mv);svg.addEventListener("pointerdown",mv)}})}

/* ---------- Sort sheet (mobile bar) ---------- */
const SORTS=[["rec","Recommended"],["pa","Price: low to high"],["pd","Price: high to low"],["disc","Biggest discount"],["rate","Top rated"]];
function sortSheet(){openSheet({title:"Sort by",html:`<div class="rl" role="radiogroup" aria-label="Sort by">${SORTS.map(([k,l])=>`<button role="radio" aria-checked="${F.sort===k}" data-k="${k}"><span class="rd"></span>${l}</button>`).join("")}</div>`,
  onMount:(el,close)=>{$("[aria-checked=true]",el).setAttribute("data-focus","1");$("[aria-checked=true]",el).focus();el.onclick=e=>{const b=e.target.closest("[data-k]");if(b){F.sort=b.dataset.k;render();close()}}}})}

/* ---------- Filters page (draft until Apply) ---------- */
const cntBy=(fn)=>PRODUCTS.filter(fn).length;
const uniq=f=>[...new Set(PRODUCTS.map(f))];
function sections(){return[
 {k:"quick",l:"Quick Filters",opts:Object.keys(QUICK).map(k=>[k,QUICK[k][0],cntBy(p=>QUICK[k][1](p))])},
 {k:"sizes",l:"Size",opts:SIZES.map(s=>[s,s,cntBy(p=>p.colors.some(c=>stockOf(p,c)[s]>0))])},
 {k:"colors",l:"Colour",swatch:1,opts:Object.keys(COLORS).map(c=>[c,COLORS[c].name,cntBy(p=>p.colors.includes(c))])},
 {k:"brands",l:"Brand",search:1,all:1,opts:uniq(p=>p.brand).map(b=>[b,b,cntBy(p=>p.brand===b)])},
 {k:"types",l:"Categories",opts:[["Sweatshirt","Sweatshirts"],["Hoodie","Hoodies"]].map(([v,l])=>[v,l,cntBy(p=>p.type===v)])},
 {k:"styles",l:"Style",opts:uniq(p=>p.style).map(s=>[s,s,cntBy(p=>p.style===s)])},
 {k:"price",l:"Price Range",opts:PRICES.map(([k,l,a,b])=>[k,l,cntBy(p=>p.price>=a&&p.price<=b)])},
 {k:"disc",l:"Discount",single:1,opts:[30,40,50].map(v=>[v,v+"% and above",cntBy(p=>p.disc>=v)])},
 {k:"rating",l:"Rating",single:1,opts:[3.5,4,4.5].map(v=>[v,v+"★ and above",cntBy(p=>p.rating>=v)])},
 {k:"ship",l:"Delivery Time",single:1,opts:[[1,"Tomorrow"],[2,"Within 2 days"],[3,"Within 3 days"]].map(([v,l])=>[v,l,cntBy(p=>p.days<=v)])},
 {k:"fits",l:"Fit",opts:uniq(p=>p.fit).map(s=>[s,s,cntBy(p=>p.fit===s)])},
 {k:"fabrics",l:"Fabric",opts:uniq(p=>p.fabric).map(s=>[s,s,cntBy(p=>p.fabric===s)])},
 {k:"necks",l:"Neck Type",opts:uniq(p=>p.neck).map(s=>[s,s,cntBy(p=>p.neck===s)])}]}
let D=null,curSec="quick",pLast=null;
document.body.insertAdjacentHTML("beforeend",'<div class="scrim p" id="pscrim"></div><aside class="panel" id="panel" role="dialog" aria-modal="true" aria-label="Filters" aria-hidden="true"></aside>');
const secN=(s)=>s.single?(D[s.k]?1:0):D[s.k].length;
const OK=ICON.check;
function fillPanel(){const S=sections(),sec=S.find(s=>s.k===curSec),pb=$("#panel .pane"),keepTop=pb?pb.scrollTop:0,rt=$("#panel .rail")?$("#panel .rail").scrollTop:0,total=results(D).length;
  const row=(s,[v,l,n])=>{const on=s.single?D[s.k]===v:D[s.k].includes(v),dis=s.k==="sizes"&&!n;
    return`<button class="ck-row" role="${s.single?"radio":"checkbox"}" aria-checked="${on}" data-v="${esc(v)}" ${dis?"disabled":""}><span class="cb${s.single?" r":""}">${OK}</span>${s.swatch?`<span class="dot" style="background:${COLORS[v].hex}"></span>`:""}<b>${esc(l)}</b><small>${n}</small></button>`};
  const allOn=sec.all&&sec.opts.every(o=>D[sec.k].includes(o[0]));
  $("#panel").innerHTML=`<div class="ph"><h2>Filters</h2><button class="clr" type="button" id="pclr">CLEAR ALL</button><button class="x" id="pclose" aria-label="Close filters" type="button">×</button></div>
<div class="pbody"><div class="rail" role="tablist" aria-label="Filter groups">${S.map(s=>`<button role="tab" aria-selected="${s.k===curSec}" data-sec="${s.k}">${s.l}${secN(s)?`<em>${secN(s)}</em>`:""}</button>`).join("")}</div>
<div class="pane" role="tabpanel" aria-label="${sec.l}">${sec.search?`<label class="ps">${ICON.search}<span class="sr">Search ${sec.l}</span><input id="psearch" type="search" placeholder="Search ${sec.l.toLowerCase()}" autocomplete="off"></label>`:""}
${sec.all?`<button class="ck-row" role="checkbox" aria-checked="${allOn}" data-all="1"><span class="cb">${OK}</span><b>Select all (${sec.opts.length})</b></button>`:""}
<div id="plist">${sec.opts.map(o=>row(sec,o)).join("")}</div></div></div>
<div class="pf"><button type="button" id="pclose2">Close</button><button type="button" class="ap" id="papply">Apply${total!==results().length||true?` (${total})`:""}</button></div>`;
  $("#panel .pane").scrollTop=keepTop;$("#panel .rail").scrollTop=rt}
function openPanel(sec){pLast=document.activeElement;D=JSON.parse(JSON.stringify(F));curSec=sec||curSec;fillPanel();
  const p=$("#panel");p.removeAttribute("aria-hidden");p.classList.add("on");$("#pscrim").classList.add("on");document.body.classList.add("pan-open");document.body.style.overflow="hidden";
  const t=$(`[data-sec="${curSec}"]`,p);t&&t.scrollIntoView({block:"nearest"});(t||$("#pclose")).focus();document.addEventListener("keydown",pkey)}
function closePanel(){$("#panel").classList.remove("on");$("#panel").setAttribute("aria-hidden","true");$("#pscrim").classList.remove("on");document.body.classList.remove("pan-open");document.body.style.overflow="";document.removeEventListener("keydown",pkey);pLast&&pLast.focus&&pLast.focus()}
function pkey(e){if(e.key==="Escape")return closePanel();if(e.key!=="Tab")return;const f=$$("button:not(:disabled),input",$("#panel")).filter(x=>x.offsetParent);if(!f.length)return;const a=f[0],b=f[f.length-1];
  if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus()}else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus()}}
$("#panel").addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
  if(t.id==="pclose"||t.id==="pclose2")return closePanel();
  if(t.id==="papply"){F=D;D=null;closePanel();render();return say(results().length+" products")}
  if(t.id==="pclr"){const s=D.sort;D=Object.assign(F0(),{sort:s});return fillPanel()}
  if(t.dataset.sec){curSec=t.dataset.sec;fillPanel();return $(`[data-sec="${curSec}"]`).focus()}
  const sec=sections().find(s=>s.k===curSec);
  if(t.dataset.all){const all=sec.opts.every(o=>D[sec.k].includes(o[0]));D[sec.k]=all?[]:sec.opts.map(o=>o[0]);return fillPanel()}
  if(t.dataset.v!==undefined){const raw=sec.opts.find(o=>String(o[0])===t.dataset.v)[0];
    if(sec.single)D[sec.k]=D[sec.k]===raw?0:raw;else D[sec.k]=D[sec.k].includes(raw)?D[sec.k].filter(x=>x!==raw):[...D[sec.k],raw];
    fillPanel();const again=$(`.ck-row[data-v="${CSS.escape(t.dataset.v)}"]`,$("#panel"));again&&again.focus()}});
$("#panel").addEventListener("input",e=>{if(e.target.id!=="psearch")return;const q=e.target.value.toLowerCase();$$("#plist .ck-row").forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(q))});
$("#pscrim").onclick=closePanel;

/* ---------- events ---------- */
$("#locwrap").innerHTML=locationBar();
$("#locwrap").addEventListener("click",e=>{if(e.target.closest("#locBtn"))pinSheet()});
document.addEventListener("store",()=>{$("#locwrap").innerHTML=locationBar();$$(".card").forEach(c=>{if(!c.querySelector(".cta.added"))paintCta(c);const p=byId(c.dataset.id);$$(".heart",c).forEach(x=>x.setAttribute("aria-pressed",Store.isWish(p.id)))})});
$("#fbtn").onclick=()=>openPanel("quick");
$("#fab").onclick=e=>{const b=e.target.closest("[data-fab]");if(!b)return;const k=b.dataset.fab;if(k==="sort")return sortSheet();openPanel(k==="all"?"quick":k)};
$("#sort").onchange=e=>{F.sort=e.target.value;render()};
$("#wishBtn").onclick=()=>{const on=F.quick.includes("wish");F.quick=on?F.quick.filter(x=>x!=="wish"):[...F.quick,"wish"];render();
  if(!on)toast(Store.get().wish.length?"Showing your wishlist":"Your wishlist is empty – tap the heart on any product")};
$$("input[type=search]").forEach(i=>i.addEventListener("input",()=>{F.q=i.value.trim();clearTimeout(i._t);i._t=setTimeout(render,180)}));
const tg=(k,v)=>{F[k]=F[k].includes(v)?F[k].filter(x=>x!==v):[...F[k],v]};
document.addEventListener("click",e=>{
 if(e.target.closest("#clr,#clr2"))return clearAll();
 const pill=e.target.closest(".pill[data-k]");
 if(pill){const k=pill.dataset.k,v=pill.dataset.v;if(Array.isArray(F[k]))F[k]=F[k].filter(x=>String(x)!==v);else F[k]=k==="q"?"":0;return render()}
 const q=e.target.closest(".qchip[data-q]");if(q){tg("quick",q.dataset.q);render();return $(`.qchip[data-q="${q.dataset.q}"]`).focus()}
 const t=e.target.closest(".tile");if(t){F.types=t.dataset.t?[t.dataset.t]:[];render();return $(`.tile[data-t="${t.dataset.t}"]`).focus()}
 const c=e.target.closest(".circ");if(c){tg("styles",c.dataset.s);render();return $(`.circ[data-s="${c.dataset.s}"]`).focus()}
 const card=e.target.closest(".card");if(!card)return;
 const h=e.target.closest(".heart");
 if(h){const on=Store.toggleWish(card.dataset.id);$$(".heart",card).forEach(x=>{x.setAttribute("aria-pressed",on);x.classList.remove("pop");void x.offsetWidth;x.classList.add("pop")});say(on?"Saved to wishlist":"Removed from wishlist");return}
 const sw=e.target.closest(".sw button");if(sw)return setColor(card,sw.dataset.c);
 if(e.target.closest(".pc"))return priceSheet(card);
 const a=e.target.closest(".cta");if(a){if(a.classList.contains("bagged"))return location.href="cart.html";if(!a.classList.contains("added"))sizeSheet(card)}});
render();
document.addEventListener("group",renderRows);
