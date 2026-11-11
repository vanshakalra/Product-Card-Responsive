/* LOOK group bag: shared bag with friends - add, vote, chat. Demo sync via localStorage (same browser). */
renderHeader({page:"group"});
$("#wishBtn").onclick=()=>{location.href="index.html?wish=1"};
document.body.insertAdjacentHTML("afterbegin",`<div class="bagbar"><button class="icon" aria-label="Back" id="bb" type="button">${ICON.back}</button><h1>Group bag</h1><span id="bn"></span></div>`);
$("#bb").onclick=()=>history.length>1?history.back():location.href="cart.html";
{const s=document.createElement("style");s.textContent="@media(max-width:767px){.top{display:none}}";document.head.appendChild(s)}
const GH=ICON.heart,TU=sv('<path d="M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1 2.5 2.5V10H19a2 2 0 012 2.3l-1 6a2 2 0 01-2 1.7H7"/>',16),TD=sv('<path d="M7 13V4H4v9zM7 13l4 7c1.5 0 2.5-1 2.5-2.5V14H19a2 2 0 002-2.3l-1-6A2 2 0 0018 4H7"/>',16);
const params=new URLSearchParams(location.search),joinCode=params.get("join");
const BOTS=["Aanya","Rohan","Meera","Kabir"],LINES=["Ooh this one is nice","Is the grey better than the black?","I'd go with this one","Which size are you taking?","Price is really good right now"];
const avatar=m=>`<span class="av${m.bot?" bot":""}" style="background:${m.col}" title="${esc(m.name)}${m.bot?" (demo friend)":""}">${esc(m.name[0].toUpperCase())}</span>`;
function shareSheet(){const g=Group.get(),link=Group.link();
  openSheet({title:"Invite friends",html:`<p class="fine" style="padding:6px 16px;font-size:13px">Anyone with this link can join <b>${esc(g.name)}</b>, add items, vote and chat.</p>
<div class="lnkbox"><input id="lk" readonly value="${esc(link)}" aria-label="Group link" data-focus="1"><button class="done sm" id="cp" type="button">Copy</button></div>
${navigator.share?'<div class="sheet-foot"><button class="done ink" id="sh" type="button">Share…</button></div>':""}
<div class="note"><b>Trying it out?</b> Open the link in a second window of this browser to see live sync. A real launch needs a server so friends on other phones can join. Or add a demo friend below.</div>
<div class="sheet-foot"><button class="ghostbtn" style="width:100%" id="bot" type="button">${ICON.user} Add a demo friend</button></div>`,
  onMount:(el,close)=>{$("#cp",el).onclick=async()=>{try{await navigator.clipboard.writeText(link);toast("Link copied")}catch{$("#lk",el).select();toast("Press Ctrl/Cmd+C to copy")}};
    const sh=$("#sh",el);if(sh)sh.onclick=()=>navigator.share({title:g.name,text:"Join my LOOK group bag",url:link}).catch(()=>{});
    $("#bot",el).onclick=()=>{close();addBot()}}})}
function addBot(){const g=Group.get(),name=BOTS.find(n=>!g.members.some(m=>m.name===n))||"Friend",b=Group.addBot(name);toast(`${name} joined (demo friend)`);
  const t=(ms,fn)=>setTimeout(()=>{if(Group.get()&&Group.get().members.some(m=>m.id===b.id))fn()},ms);
  t(2500,()=>{const gi=Group.get().items,pool=PRODUCTS.filter(p=>!gi.some(i=>i.pid===p.id)),p=pool[Math.floor(Math.random()*pool.length)]||PRODUCTS[0],c=p.colors[Math.floor(Math.random()*p.colors.length)],st=stockOf(p,c),s=["M","L","S","XL"].find(x=>st[x]>0)||"M";Group.add(p.id,c,s,b.id)});
  t(4500,()=>Group.say(LINES[Math.floor(Math.random()*LINES.length)],b.id));
  t(7000,()=>{const its=Group.get().items;if(its.length){const it=its[Math.floor(Math.random()*its.length)];if(it.votes[b.id]!==1)Group.vote(it.id,b.id,1)}});
  t(9500,()=>Group.say(LINES[Math.floor(Math.random()*LINES.length)],b.id))}
function render(){const g=Group.get(),m=$("#main");
  if(!g){m.innerHTML=`<div class="emptyc"><svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M3 20c.5-3.8 3-5.5 6-5.5s5.5 1.7 6 5.5M15.5 14.8c3 0 5 1.4 5.5 4.7"/></svg><h1>${joinCode?"This group link has expired":"Shop together"}</h1><p>${joinCode?"For this demo, the link only works in the browser where the group was created.":"Make a group bag, invite friends to add items, vote and chat before anyone buys."}</p><button class="done" id="st" type="button">Start a group bag</button></div>`;$("#bn").textContent="";return}
  const me=Group.me();
  if(!me){m.innerHTML=`<div class="gwrap"><div class="gcard"><div class="ghead"><h2>You’re invited to ${esc(g.name)}</h2></div><div class="mem">${g.members.map(avatar).join("")}<span>${g.members.map(x=>esc(x.name)).join(", ")}</span></div>
<form id="jf" novalidate style="margin-top:14px"><div class="fld"><label for="jn">Your name</label><div class="mob"><input id="jn" maxlength="20" placeholder="e.g. Aanya" autocomplete="given-name"></div></div><p class="msg" id="je" role="alert"></p><button class="done" style="margin-top:6px">Join group bag</button></form></div></div>`;
    $("#jn").focus();$("#jf").onsubmit=e=>{e.preventDefault();const n=$("#jn").value.trim();if(!n)return $("#je").textContent="Enter your name to join.";Group.join(g.id,n);render()};return}
  $("#bn").textContent=g.name;
  const items=[...g.items].sort((a,b)=>Group.score(b)-Group.score(a)),total=items.reduce((a,i)=>a+byId(i.pid).price,0),mrp=items.reduce((a,i)=>a+byId(i.pid).mrp,0),n=g.members.length;
  const row=i=>{const p=byId(i.pid),c=COLORS[i.color],by=Group.who(i.by),mine=i.by===me.id,sc=Group.score(i),ups=Object.values(i.votes).filter(v=>v>0).length,dns=Object.values(i.votes).filter(v=>v<0).length;
    return`<li class="gitem" data-id="${i.id}"><span class="th"><img src="${c.img}" alt=""></span><div class="bd"><b>${esc(p.brand)}</b><span class="t">${esc(p.name)} · ${c.name} · Size ${i.size}</span>
<span class="pr"><span class="now">${INR(p.price)}</span> <s class="old">${INR(p.mrp)}</s> <span class="off">${p.disc}% Off</span></span><span class="by"><i style="background:${by.col}"></i>Added by ${mine?"you":esc(by.name)}</span>
${n>1&&ups===n?'<span class="badge2">Everyone likes this</span>':""}
<div class="votes"><button class="vt up" data-v="1" aria-pressed="${i.votes[me.id]===1}" aria-label="Like, ${ups} likes">${TU}${ups}</button><button class="vt dn" data-v="-1" aria-pressed="${i.votes[me.id]===-1}" aria-label="Not sure, ${dns}">${TD}${dns}</button></div>
<div class="gact"><button class="pri" data-act="mine">Add to my bag</button>${mine?'<button data-act="rm">Remove</button>':""}</div></div></li>`};
  const keepChat=$(".chat"),atBottom=!keepChat||keepChat.scrollHeight-keepChat.scrollTop-keepChat.clientHeight<40;
  const draft=($("#ci")||{}).value||"",hadFocus=document.activeElement&&document.activeElement.id==="ci";
  m.innerHTML=`<div class="gwrap"><section class="gcard"><div class="ghead"><h2>${esc(g.name)}</h2><button class="inv" id="inv" type="button">${ICON.user} Invite</button></div>
<div class="mem">${g.members.map(avatar).join("")}<span>${n} ${n===1?"person":"people"}</span></div></section>
<section aria-label="Items"><div class="gi-list">${items.length?items.map(row).join(""):`<div class="gcard emptyc" style="padding:36px 16px"><h1 style="font-size:17px">Nothing here yet</h1><p>Browse the store and choose “Group bag” when you add an item.</p><a class="done" href="index.html" style="width:auto;padding:0 28px">Browse products</a></div>`}</div></section>
${items.length?`<section class="gcard gtot"><div>Group total<small>${n>1?`${INR(total/n)} each if split equally · `:""}Saves ${INR(mrp-total)} vs MRP</small></div><b style="font:700 18px Poppins">${INR(total)}</b></section>`:""}
<section class="gcard" aria-label="Group chat"><div class="ghead"><h2 style="font-size:15px">Chat</h2></div><div class="chat" id="chat" role="log" aria-live="polite">${g.msgs.length?g.msgs.map(x=>{const w=Group.who(x.by);return`<div class="msg2${x.by===me.id?" me":""}"><small>${x.by===me.id?"You":esc(w.name)}</small>${esc(x.text)}</div>`}).join(""):'<p class="fine">Say hi and ask which one to pick.</p>'}</div>
<form class="cform" id="cf" novalidate><label class="sr" for="ci">Message</label><input id="ci" placeholder="Write a message…" maxlength="200" autocomplete="off"><button>Send</button></form></section>
<button class="lnk" id="lv" type="button" style="align-self:center;color:#777">Leave group (demo reset)</button></div>`;
  const ci=$("#ci");if(draft){ci.value=draft}if(hadFocus)ci.focus();const ch=$("#chat");if(atBottom)ch.scrollTop=ch.scrollHeight}
$("#main").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  if(b.id==="st")return startGroupSheet(()=>{history.replaceState(null,"","group.html");render()});
  if(b.id==="inv")return shareSheet();
  if(b.id==="lv"){Group.leave();toast("Left the group");return}
  const li=b.closest(".gitem");if(!li)return;const g=Group.get(),me=Group.me(),it=g.items.find(i=>i.id===li.dataset.id);if(!it)return;
  if(b.dataset.v){Group.vote(it.id,me.id,+b.dataset.v);const again=$(`.gitem[data-id="${it.id}"] [data-v="${b.dataset.v}"]`);again&&again.focus();return}
  if(b.dataset.act==="rm"){Group.remove(it.id);return toast("Removed from group bag")}
  if(b.dataset.act==="mine"){Store.add(it.pid,it.color,it.size);toast("Added to your bag",{label:"View bag",fn:()=>location.href="cart.html"})}});
$("#main").addEventListener("submit",e=>{if(e.target.id!=="cf")return;e.preventDefault();const v=$("#ci").value;if(!v.trim())return;Group.say(v,Group.me().id);$("#ci").value=""});
document.addEventListener("group",render);render();
