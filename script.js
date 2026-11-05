// Photos: save product photos in /assets as 1.png, 2.png, 3.png ... (up to 6; .jpg also works). Cards cycle through whatever you add.
// Each card has 2 slides: the photo, and a zoomed-in view of the same photo (dummy "second angle").
const BRANDS=["H&M","Pepe Jeans","H&M","Levis","Levis","Nike","Pepe Jeans","H&M","H&M","Levis","Levis","Nike"];
const SIZES=["XXS","XS","S","M","L","XL"];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const heart=l=>`<button class="heart" aria-pressed="false" aria-label="Add ${l} to wishlist"><span><svg width="13" height="12" viewBox="0 0 24 22"><path d="M12 20s-9-5.5-9-12.2A5 5 0 0112 5a5 5 0 019 2.8C21 14.5 12 20 12 20z"/></svg></span></button>`;
const EXT=["png","jpg","jpeg","webp","PNG","JPG","JPEG"];
const probe=k=>new Promise(r=>{const t=n=>{if(n>=EXT.length)return r(null);const i=new Image(),u=`assets/${k}.${EXT[n]}`;i.onload=()=>r(u);i.onerror=()=>t(n+1);i.src=u};t(0)});
Promise.all([1,2,3,4,5,6].map(probe)).then(a=>{const ok=a.filter(Boolean);render(ok.length?ok:[null]);initCarousels()});
function render(photos){$("#grid").innerHTML=BRANDS.map((b,i)=>{const l=`${b} Men’s Cotton Sweatshirt`,src=photos[i%photos.length];
const slides=!src?`<div class="slide ph"><span>Photo coming soon</span></div>`:`<div class="slide"><img src="${src}" alt="${l}"></div><div class="slide zoom"><img src="${src}" alt="${l}, close-up"></div>`;
return `<article class="card"><div class="media"><div class="track">${slides}</div>
<div class="dots" aria-hidden="true"></div>${heart(l)}</div>
<div class="info"><p class="name"><b>${b}</b><span>Men’s Cotton Sweatshirt</span></p><span class="tag">Limited stock</span>
<p class="price"><s class="old"><span class="sr">Original price </span>₹3,499</s><span class="now">₹ 1,799</span><span class="off">48% Off</span></p></div>
<div class="row"><button class="cta add">Add to Cart</button>${heart(l)}</div></article>`}).join("")}
// carousel: dots follow scroll; desktop hover slides to the close-up and back
const wide=matchMedia("(min-width:1024px) and (hover:hover)"),calm=matchMedia("(prefers-reduced-motion:reduce)");
const count=m=>m.querySelectorAll(".slide").length;
function sync(m){const n=count(m);m.querySelector(".dots").innerHTML=Array.from({length:n},(_,k)=>`<i class="${k?"":"on"}"></i>`).join("");m.classList.toggle("single",n<2)}
function initCarousels(){$$(".media").forEach(m=>{const t=m.querySelector(".track");let n=0,timer;
 const go=i=>{const c=count(m);if(c<2)return;n=(i+c)%c;t.scrollTo({left:n*t.clientWidth,behavior:"smooth"})};
 t.addEventListener("scroll",()=>{const i=Math.round(t.scrollLeft/t.clientWidth);m.querySelectorAll(".dots i").forEach((x,k)=>x.classList.toggle("on",k===i));n=i},{passive:true});
 m.addEventListener("mouseenter",()=>{if(wide.matches&&!calm.matches&&count(m)>1){go(1);timer=setInterval(()=>go(n+1),1100)}});
 m.addEventListener("mouseleave",()=>{clearInterval(timer);if(wide.matches&&count(m)>1)t.scrollTo({left:0,behavior:"smooth"})});
 sync(m)})}
// size sheet, cart, wishlist
let cart=0,btn=null,size=null;const done=$("#done");
$("#sizes").innerHTML=SIZES.map(s=>`<button class="size" role="radio" aria-checked="false" ${s==="XXS"?'disabled aria-label="XXS, out of stock"':""}>${s}</button>`).join("");
const open=b=>{btn=b;size=null;done.disabled=true;$$(".size").forEach(x=>x.setAttribute("aria-checked","false"));document.body.classList.add("open");$("#sheet").setAttribute("aria-hidden","false");$(".size:not(:disabled)").focus()};
const close=()=>{document.body.classList.remove("open");$("#sheet").setAttribute("aria-hidden","true");btn&&btn.focus()};
document.addEventListener("click",e=>{
 const h=e.target.closest(".heart");
 if(h){const on=h.getAttribute("aria-pressed")!=="true";h.closest(".card").querySelectorAll(".heart").forEach(x=>{x.setAttribute("aria-pressed",on);x.classList.remove("pop");void x.offsetWidth;x.classList.add("pop")});return}
 const a=e.target.closest(".add");if(a)return open(a);
 const s=e.target.closest(".size");if(s&&!s.disabled){size=s.textContent;$$(".size").forEach(x=>x.setAttribute("aria-checked",x===s));done.disabled=false;return}
 const c=e.target.closest(".chip");if(c)$$(".chip").forEach(x=>{x.classList.toggle("on",x===c);x.setAttribute("aria-pressed",x===c)});
 if(e.target.id==="scrim")close()});
done.onclick=()=>{const b=btn;close();cart++;const bd=$("#badge");bd.textContent=cart;bd.classList.add("on");bd.classList.remove("bump");void bd.offsetWidth;bd.classList.add("bump");
 $("#cartBtn").setAttribute("aria-label",`Cart, ${cart} ${cart===1?"item":"items"}`);
 b.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M4 12l5 5L20 6"/></svg>Added (size '+size+')';b.classList.add("added");
 setTimeout(()=>{b.textContent="Add to Cart";b.classList.remove("added")},1800)};
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
