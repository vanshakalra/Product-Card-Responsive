/* LOOK login: mobile number -> 4-digit OTP (demo code 1234) */
const safeNext=(()=>{const n=new URLSearchParams(location.search).get("next")||"index.html";return/^(index|cart)\.html$/.test(n)?n:"index.html"})();
renderHeader({page:"login"});
$("#wishBtn").onclick=()=>{try{sessionStorage.setItem("look-f2",JSON.stringify({quick:["wish"]}))}catch{}location.href="index.html"};
document.body.classList.add("loginpg");
{const s=document.createElement("style");s.textContent="@media(max-width:767px){.top{display:none}}";document.head.appendChild(s)}
document.body.insertAdjacentHTML("beforeend",`<div class="atop"><a class="logo" href="index.html" aria-label="LOOK home"><img src="assets/logo.png" alt="" onerror="this.remove()"><span>L<em>OO</em>K</span></a><a class="skip2" href="${safeNext}">Skip</a></div>
<main class="auth" id="main"><div class="acard">
<div class="promo" aria-label="Welcome offer"><div class="pt"><small>Welcome offer</small><h2>FLAT ₹200 OFF</h2><p>on your first order of ₹1,999 or more</p><span class="code"><i>CODE</i>FIRST200</span></div>
<div class="pimg"><img src="assets/4.png" alt=""><img src="assets/3.png" alt=""></div><span class="pbadge">₹200<br>OFF</span><small class="tc">*T&amp;C apply · Limited time offer</small></div>
<section class="form" id="f"></section></div></main>`);
let pending=null,timer,mobile="";
const f=$("#f");start();document.addEventListener("store",()=>{if(!Store.get().user&&f.dataset.in){delete f.dataset.in;stepOne()}});
function start(){
const fmt=v=>{const d=v.replace(/\D/g,"").slice(0,10);return d.length>5?d.slice(0,5)+" "+d.slice(5):d};
let agreed=false;
function stepOne(err,terr){f.innerHTML=`<h1>Login or Sign up</h1><p class="sub">Get exclusive offers, track orders and keep your wishlist across devices.</p>
<form id="s1" novalidate><div class="fld${err?" err":""}"><label for="mob">Mobile number</label><div class="mob"><span>+91</span><input id="mob" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="Mobile number" value="${esc(mobile)}" maxlength="11" aria-describedby="e1" ${err?'aria-invalid="true"':""}></div><p class="msg" id="e1" role="alert">${err||""}</p></div>
<div class="agw"><label class="agree"><input type="checkbox" id="ag" ${agreed?"checked":""} aria-describedby="e2"><span>By continuing, I agree to the <a href="#" data-t>Terms of Use</a> &amp; <a href="#" data-t>Privacy Policy</a> and I am above 18 years old.</span></label><p class="msg" id="e2" role="alert">${terr||""}</p></div>
<button class="done">Continue</button></form><div class="or">or</div>
<button class="ghostbtn" id="gg" type="button"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1a6 6 0 010-12c1.9 0 3.2.8 3.9 1.5l2.7-2.6A9.6 9.6 0 0012 2.5a9.5 9.5 0 100 19c5.5 0 9.1-3.8 9.1-9.3 0-.6-.1-1.1-.2-1.6z"/></svg>Continue with Google</button>
<p class="help">Have trouble logging in? <a href="#" data-help>Get help</a></p>`;
  const i=$("#mob");if(!terr)i.focus();i.addEventListener("input",()=>{i.value=fmt(i.value)});
  $("#ag").addEventListener("change",e=>{agreed=e.target.checked;if(agreed)$("#e2").textContent=""});
  $$("[data-t]").forEach(a=>a.onclick=e=>{e.preventDefault();toast("Legal pages aren’t part of this prototype")});
  $("[data-help]").onclick=e=>{e.preventDefault();toast("Help centre isn’t part of this prototype. Demo code is 1234.")};
  $("#gg").onclick=()=>{Store.signIn({id:"Google account",name:"Google user"});toast("Signed in with Google (demo)");setTimeout(()=>location.href=safeNext,700)};
$("#s1").onsubmit=e=>{e.preventDefault();mobile=fmt(i.value);const d=mobile.replace(/\D/g,"");
    if(!d)return stepOne("Enter your 10-digit mobile number.");if(!/^[6-9]\d{9}$/.test(d))return stepOne("Enter a valid 10-digit Indian mobile number.");
    if(!agreed)return stepOne("","Please accept the terms to continue.");pending={d,id:"+91 "+mobile};stepTwo()}}
function stepTwo(err){clearInterval(timer);let s=24;
  f.innerHTML=`<button class="backl" id="bk" aria-label="Back" type="button">${ICON.back}</button><h1>Verify mobile number</h1><p class="sub">Code sent to <b>${esc(pending.id)}</b> <button class="lnk" id="chg" type="button" style="min-height:32px">Edit</button></p>
<form id="s2" novalidate><fieldset style="border:0;padding:0;min-width:0"><legend class="sr">4-digit code</legend><div class="otp" id="otp">${Array.from({length:4},(_,k)=>`<input inputmode="numeric" maxlength="1" autocomplete="${k?"off":"one-time-code"}" aria-label="Digit ${k+1}">`).join("")}</div></fieldset>
<p class="msg" role="alert">${err||""}</p><p class="fine" id="tm"></p><p class="demohint">Demo: use code <b>1234</b></p><button class="done" id="vb" style="margin-top:6px" disabled>Verify &amp; continue</button></form>
<div class="row2"><span></span><button class="lnk" id="rs" type="button" disabled>Resend code</button></div>`;
  const ins=$$("#otp input"),code=()=>ins.map(x=>x.value).join(""),upd=()=>{$("#vb").disabled=code().length<4};ins[0].focus();
  ins.forEach((x,k)=>{x.addEventListener("input",()=>{x.value=x.value.replace(/\D/g,"").slice(-1);x.removeAttribute("aria-invalid");if(x.value&&ins[k+1])ins[k+1].focus();upd();if(code().length===4)verify()});
    x.addEventListener("keydown",e=>{if(e.key==="Backspace"&&!x.value&&ins[k-1]){ins[k-1].focus();ins[k-1].value="";upd()}else if(e.key==="ArrowLeft"&&ins[k-1])ins[k-1].focus();else if(e.key==="ArrowRight"&&ins[k+1])ins[k+1].focus()});
    x.addEventListener("paste",e=>{const d=(e.clipboardData.getData("text")||"").replace(/\D/g,"").slice(0,4);if(!d)return;e.preventDefault();d.split("").forEach((c,j)=>ins[j]&&(ins[j].value=c));ins[Math.min(d.length,3)].focus();upd();if(d.length===4)verify()})});
  const tick=()=>{const t=`00:${String(Math.max(s,0)).padStart(2,"0")}`;$("#tm").textContent=s>0?`Resend code in ${t}`:"";$("#rs").disabled=s>0;if(s--<=0)clearInterval(timer)};tick();timer=setInterval(tick,1000);
  $("#rs").onclick=()=>{toast("A new code was sent (demo: 1234)");stepTwo()};$("#chg").onclick=$("#bk").onclick=()=>{clearInterval(timer);stepOne()};
  $("#s2").onsubmit=e=>{e.preventDefault();if(code().length===4)verify()};
  function verify(){if(code()==="1234"){clearInterval(timer);Store.signIn({id:pending.id,name:"Member"});
      f.innerHTML=`<div class="okcheck" role="status"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#12a150" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10" stroke-width="1.4"/><path d="M7 12.5l3.5 3.5L17 9"/></svg><h3>You’re in</h3><p class="fine">Taking you back…</p></div>`;setTimeout(()=>location.href=safeNext,900)}
    else{const o=$("#otp");o.classList.remove("shake");void o.offsetWidth;o.classList.add("shake");ins.forEach(x=>{x.value="";x.setAttribute("aria-invalid","true")});ins[0].focus();upd();$(".msg").textContent="That code doesn’t match. Try 1234 for the demo."}}}
function signedIn(){const u=Store.get().user;
  f.innerHTML=`<h1>You’re logged in</h1><p class="sub">Signed in as <b>${esc(u.id)}</b>. Log out to try the login screens again.</p><a class="done" href="${safeNext}">Continue shopping</a><button class="ghostbtn" id="lo" type="button">Log out</button>`;
  $("#lo").onclick=()=>{Store.signOut();toast("Logged out");stepOne()}}
Store.get().user?signedIn():stepOne()}
