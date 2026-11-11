/* LOOK bag page */
renderHeader({page:"cart"});
$("#wishBtn").onclick=()=>{location.href="index.html?wish=1"};
document.body.insertAdjacentHTML("afterbegin",`<div class="bagbar" id="bagbar"><button class="icon" aria-label="Back" id="bb" type="button">${ICON.back}</button><h1>Bag</h1><span id="bn"></span><button class="tool" id="bw" aria-label="Wishlist" type="button">${ICON.heart}</button></div>`);
$("#bb").onclick=()=>history.length>1?history.back():location.href="index.html";$("#bw").onclick=()=>location.href="index.html?wish=1";
{const s=document.createElement("style");s.textContent="@media(max-width:767px){.top{display:none}}";document.head.appendChild(s)}
const FREE=999,SHIP=79;
function totals(){const it=Store.get().items;let mrp=0,sell=0;it.forEach(i=>{const p=byId(i.pid);mrp+=p.mrp*i.qty;sell+=p.price*i.qty});
  const c=COUPONS.find(x=>x.code===Store.get().coupon),valid=c&&sell>=c.min,cp=valid?c.calc(sell):0,after=sell-cp,ship=after>=FREE||!it.length?0:SHIP;
  const best=Math.max(0,...COUPONS.filter(x=>sell>=x.min).map(x=>x.calc(sell)));
  return{mrp,sell,disc:mrp-sell,cp,c,valid,after,ship,total:after+ship,best,items:it.reduce((a,i)=>a+i.qty,0)}}
const eta=(i)=>deliverBy(byId(i.pid).days,Store.get().pin);
const lineHTML=i=>{const p=byId(i.pid),c=COLORS[i.color],k=Store.key(i),max=Store.maxQty(i),st=stockOf(p,i.color);
 return`<li class="line" data-k="${esc(k)}"><a class="th" href="index.html" aria-label="${esc(p.name)}"><img src="${c.img}" alt=""></a>
<button class="rm" data-act="rm" aria-label="Remove ${esc(p.name)} from bag">${ICON.trash}</button>
<div class="bd"><b>${esc(p.brand)}</b><span class="t">${esc(p.name)} · ${c.name}</span>
<div class="pickers"><label class="selw"><span class="sr">Size</span><select data-sz aria-label="Size">${SIZES.filter(s=>st[s]>0||s===i.size).map(s=>`<option ${s===i.size?"selected":""}>${s}</option>`).join("")}</select>${ICON.chev}</label>
<div class="step" role="group" aria-label="Quantity"><button data-d="-1" aria-label="Decrease quantity" ${i.qty<=1?"disabled":""}>−</button><span aria-live="polite">${i.qty}</span><button data-d="1" aria-label="Increase quantity" ${i.qty>=max?"disabled":""}>+</button></div></div>
${i.qty>=max?`<span class="maxnote">${st[i.size]<=5?`Only ${st[i.size]} left in this size`:"Max 5 per order"}</span>`:""}
<span class="pr"><span class="now">${INR(p.price*i.qty)}</span><s class="old">${INR(p.mrp*i.qty)}</s><span class="off">${p.disc}% Off</span></span>
<span class="eta">Delivery by ${eta(i)}</span>
<button class="mv" data-act="wish">${Store.isWish(p.id)?"Already in wishlist":"Move to wishlist"}</button></div></li>`};
function groupCta(){const g=Group.get();
  return`<div class="gcta"><span class="gi">${sv('<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M3 20c.5-3.8 3-5.5 6-5.5s5.5 1.7 6 5.5M15.5 14.8c3 0 5 1.4 5.5 4.7"/>',22)}</span><div><b>${g?esc(g.name):"Shop together"}</b><small>${g?`${g.members.length} ${g.members.length===1?"person":"people"} · ${g.items.length} ${g.items.length===1?"item":"items"} in the group bag`:"Make a group bag. Friends add items, vote and chat before anyone buys."}</small></div><button class="gb" id="gbtn" type="button">${g?"Open":"Start"}</button></div>`}
function render(){const it=Store.get().items,m=$("#main"),t=totals(),pin=Store.get().pin;
  $("#bn").textContent=it.length?`${t.items} ${t.items===1?"item":"items"}`:"";
  if(!it.length){m.innerHTML=`<div class="emptyc"><svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6.5a3 3 0 016 0V8"/></svg><h1>Your bag is empty</h1><p>Anything you add shows up here with the colour and size you picked.</p><a class="done" href="index.html">Start shopping</a></div><div style="padding:0 12px 24px;max-width:560px;margin:0 auto">${groupCta()}</div>`;return}
  const left=Math.max(0,FREE-t.after),c=t.c;
  m.innerHTML=`<div class="pghead" style="display:none"><h1>Bag</h1><span>${t.items} ${t.items===1?"item":"items"}</span></div>
<div class="cartgrid"><div class="lines-col" style="display:flex;flex-direction:column;gap:12px;min-width:0">
<div class="dlv">${ICON.truck}<span>Deliver to <b>${cityOf(pin)} – ${pin}</b></span><button id="chg" type="button">Change</button></div>
${groupCta()}
${left?`<div class="ship">Add <b>${INR(left)}</b> more for free delivery<div class="bar2"><i style="width:${Math.min(100,t.after/FREE*100)}%"></i></div></div>`:""}
<ul class="lines">${it.map(lineHTML).join("")}</ul></div>
<aside class="sumcard" aria-label="Price details"><button class="cpn${t.valid?" on":""}" id="cpn" type="button">${ICON.tag}<div>${t.valid?`${c.code} applied`:"Apply coupon"}<small>${t.valid?`You saved ${INR(t.cp)} with this coupon`:t.best?`Save up to ${INR(t.best)} more`:"Offers available"}</small></div>${ICON.chevr}</button>
<div class="sum" style="margin-top:14px"><h2>Price details (${t.items} ${t.items===1?"item":"items"})</h2>
<div class="r"><span>Total MRP</span><span>${INR(t.mrp)}</span></div><div class="r g"><span>Discount</span><span>−${INR(t.disc)}</span></div>
<div class="r g"><span>Coupon</span>${t.valid?`<span>−${INR(t.cp)}</span>`:`<button id="cpn2" type="button">Apply</button>`}</div>
<div class="r g"><span>Delivery</span><span>${t.ship?INR(t.ship):"Free"}</span></div>
<div class="r tot"><span>Total amount</span><span>${INR(t.total)}</span></div>
<div class="save">${ICON.tag.replace('width="18" height="18"','width="16" height="16"')}You will save ${INR(t.disc+t.cp)} on this order</div>
<button class="done" data-order type="button">Place order</button></div></aside></div>
<div class="stick"><div class="amt"><small>Total</small>${INR(t.total)}</div><button class="done" data-order type="button">Place order</button></div>`}
function couponSheet(){const t=totals();
  openSheet({title:"Apply coupon",html:`<div class="cpl"><form id="cf" novalidate><label class="sr" for="cin">Coupon code</label><input id="cin" placeholder="Enter coupon code" autocomplete="off" data-focus="1"><button class="done sm">Apply</button></form><p class="msg" id="cm" role="alert" style="margin:-6px 4px 8px"></p>
${COUPONS.map(c=>{const ok=t.sell>=c.min,on=Store.get().coupon===c.code;return`<div class="cc"><div><b>${c.title} <code>${c.code}</code></b>${c.desc}${ok?"":`<br><span class="why">Add ${INR(c.min-t.sell)} more to use this</span>`}</div><button data-c="${c.code}" ${ok?"":"disabled"}>${on?"Remove":"Apply"}</button></div>`}).join("")}</div>`,
  onMount:(el,close)=>{const use=(code)=>{const c=COUPONS.find(x=>x.code===code);if(!c)return"That code isn’t valid.";if(totals().sell<c.min)return`Add ${INR(c.min-totals().sell)} more to use ${code}.`;Store.setCoupon(code);close();toast(`${code} applied`);return""};
    $("#cf",el).onsubmit=e=>{e.preventDefault();const v=$("#cin",el).value.trim().toUpperCase();$("#cm",el).textContent=v?use(v):"Enter a coupon code."};
    el.addEventListener("click",e=>{const b=e.target.closest("[data-c]");if(!b)return;if(Store.get().coupon===b.dataset.c){Store.setCoupon(null);close();toast("Coupon removed")}else $("#cm",el).textContent=use(b.dataset.c)})}})}
$("#main").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.id==="gbtn")return Group.get()?location.href="group.html":startGroupSheet(()=>location.href="group.html");if(b.id==="chg")return pinSheet();if(b.id==="cpn"||b.id==="cpn2")return couponSheet();
  if(b.hasAttribute("data-order")){if(!Store.get().user){toast("Log in to place your order");return setTimeout(()=>location.href="login.html?next=cart.html",700)}return placeOrder()}
  const ln=b.closest(".line");if(!ln)return;const k=ln.dataset.k;
  if(b.dataset.d){const i=Store.get().items.find(x=>Store.key(x)===k);Store.setQty(k,i.qty+ +b.dataset.d)}
  else if(b.dataset.act==="rm"){const r=Store.remove(k);toast("Removed from bag",{label:"Undo",fn:()=>Store.restore(r)});say("Item removed")}
  else if(b.dataset.act==="wish"){const i=Store.get().items.find(x=>Store.key(x)===k),on=Store.isWish(i.pid);
    if(on)return toast("Already in your wishlist");
    Store.toggleWish(i.pid);const r=Store.remove(k);toast("Moved to wishlist",{label:"Undo",fn:()=>{Store.restore(r);Store.toggleWish(i.pid)}})}});
$("#main").addEventListener("change",e=>{if(!e.target.matches("[data-sz]"))return;Store.setSize(e.target.closest(".line").dataset.k,e.target.value);say("Size changed to "+e.target.value)});
function placeOrder(){const t=totals(),id="LK"+Math.floor(10000000+Math.random()*89999999),u=Store.get().user;
  openSheet({title:"Order placed",html:`<div class="okcheck"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#12a150" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10" stroke-width="1.4"/><path d="M7 12.5l3.5 3.5L17 9"/></svg><h3>Thanks${u&&u.name!=="Member"?", "+esc(u.name.split(" ")[0]):""}!</h3><p class="fine">Order ${id} · ${INR(t.total)}<br>Delivering to ${cityOf(Store.get().pin)} ${Store.get().pin}</p><p class="fine" style="max-width:30ch">Payment is the next screen to design – this is a prototype, so nothing was charged.</p></div><div class="sheet-foot"><button class="done" data-focus="1" id="ok">Continue shopping</button></div>`,
    onMount:(el,close)=>$("#ok",el).onclick=()=>{Store.clear();close();location.href="index.html"},onClose:()=>Store.clear()})}
document.addEventListener("store",render);document.addEventListener("group",render);render();
