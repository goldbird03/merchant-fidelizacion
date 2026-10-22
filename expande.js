/* expandeMoney — nucleo compartido de la plataforma (reglas, datos y utilidades)
   Lo usan index.html, shop.html, signup.html, dashboard.html y panel.html.
   Los datos viven en localStorage (clave "em_store_v1"): lo que haces en una pagina se ve en las otras. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>'S/ '+Number(n).toFixed(2);
const r2=n=>Math.round(n*100)/100;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=t=>String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== iconos (sprite) ===== */
const SPRITE=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-lock" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></symbol>
<symbol id="i-unlock" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></symbol>
<symbol id="i-qr" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></symbol>
<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></symbol>
<symbol id="i-store" viewBox="0 0 24 24"><path d="M3 9l1-5h16l1 5M3 9v11h18V9M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M9 20v-6h6v6"/></symbol>
<symbol id="i-wallet" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 010-4h12v4M4 6v12a2 2 0 002 2h14v-4M18 12a2 2 0 000 4h4v-4z"/></symbol>
<symbol id="i-crown" viewBox="0 0 24 24"><path d="M2 18l2-11 5 5 3-8 3 8 5-5 2 11zM4 21h16"/></symbol>
<symbol id="i-medal" viewBox="0 0 24 24"><path d="M7.2 2h9.6l2.2 6H5zM12 22a6 6 0 100-12 6 6 0 000 12z"/></symbol>
<symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></symbol>
<symbol id="i-reset" viewBox="0 0 24 24"><path d="M3 12a9 9 0 109-9 9 9 0 00-6.7 3L3 8M3 3v5h5"/></symbol>
<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></symbol>
<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></symbol>
<symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></symbol>
<symbol id="i-tag" viewBox="0 0 24 24"><path d="M20 12l-8 8-9-9V3h8zM7.5 7.5h.01"/></symbol>
<symbol id="i-card" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></symbol>
<symbol id="i-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></symbol>
<symbol id="i-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/></symbol>
<symbol id="i-repeat" viewBox="0 0 24 24"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/></symbol>
<symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 003.4 0"/></symbol>
<symbol id="i-belloff" viewBox="0 0 24 24"><path d="M13.7 21a2 2 0 01-3.4 0M18.6 13A17.9 17.9 0 0118 8a6 6 0 00-9.3-5M6.3 6.3A6 6 0 006 8c0 7-3 9-3 9h14M2 2l20 20"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></symbol>
</defs></svg>`;
const ic=n=>`<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;

/* ===== REGLAS DEL PROGRAMA (fuente unica) =====
   rate   = saldo que suma cada consumo.
   locked = true: queda bloqueado hasta completar la tarjeta de 10 consumos.
   reward = saldo que se libera al completar la tarjeta (= 10 x rate). Oro: sin tarjeta, disponible al instante. */
const CARD_COINS=10;
const TIERS={
  Bronce:{rate:.5,locked:true,range:'0–9 visitas'},
  Plata:{rate:.7,locked:true,range:'10–29 visitas'},
  Oro:{rate:1,locked:false,range:'+30 visitas'}
};
Object.values(TIERS).forEach(t=>{
  t.reward=t.locked?r2(CARD_COINS*t.rate):0;
  t.desc=t.locked
    ?`Cada consumo suma ${money(t.rate)} bloqueados. Al completar 10 consumos se liberan ${money(t.reward)} y la tarjeta se reinicia.`
    :`Cada consumo libera ${money(t.rate)} disponible al instante, sin bloqueos.`;
});
const tierFor=v=>v>=30?'Oro':v>=10?'Plata':'Bronce';
const NEXT={Bronce:['Plata',10],Plata:['Oro',30]};
const blockedOf=c=>{const T=TIERS[tierFor(c.visits)];return T.locked?r2(c.coins*T.rate):0};
/* La tasa del consumo es la del nivel que el cliente tiene AL COMPRAR; el cambio de nivel se aplica despues. */
function applyVisit(c){
  const prev=tierFor(c.visits),visits=c.visits+1,tier=tierFor(visits),T=TIERS[prev];let {coins,disp}=c;const ev=[];
  if(!T.locked){disp=r2(disp+T.rate);ev.push(['liberó saldo Oro',T.rate,'oro'])}
  else{coins++;ev.push(['abonó consumo',T.rate,'abono']);
    if(coins>=CARD_COINS){disp=r2(disp+T.reward);coins=0;ev.push([`completó su tarjeta (${prev})`,T.reward,'tarjeta'])}}
  if(tier!==prev){
    if(!TIERS[tier].locked&&coins>0){const p=r2(coins*T.rate);disp=r2(disp+p);coins=0;ev.push(['liberó su saldo bloqueado',p,'lvl'])}
    ev.push([`subió a nivel ${tier}`,0,'lvl'])}
  return {c:{...c,visits,coins,disp},ev,credited:T.rate};
}

/* ===== CATALOGO DE CUPONES (categoria, emoji, nombre, lugar, precio normal, precio con descuento) ===== */
const COUPONS=[
  {id:'cp1',cat:'Gastronomía',emoji:'🍷',name:'Cata de Vinos',place:'Barranco, Lima',list:200,price:110},
  {id:'cp2',cat:'Barismo',emoji:'☕',name:'Masterclass de Barismo',place:'Miraflores, Lima',list:150,price:90},
  {id:'cp3',cat:'Fitness',emoji:'🧘',name:'Pack 4 clases de Pilates',place:'Chapinero, Bogotá',list:180,price:99},
  {id:'cp4',cat:'Salud',emoji:'🩺',name:'Chequeo preventivo integral',place:'San Isidro, Lima',list:260,price:156},
  {id:'cp5',cat:'Belleza',emoji:'💆',name:'Facial + spa de manos',place:'Surco, Lima',list:170,price:102},
  {id:'cp6',cat:'Educación',emoji:'🎓',name:'Workshop la Ruta del Emprendedor',place:'En vivo',list:220,price:121}
];

/* ===== DATOS (localStorage) ===== */
const KEY='em_store_v1';
const DAY=864e5;
function seedHistory(c){
  const h=[],n=Math.min(c.visits,3),T=TIERS[tierFor(c.visits)];
  for(let i=0;i<n;i++)h.push({t:Date.now()-DAY*(i+1)*2,txt:'abonó consumo',amt:T.rate,kind:'abono'});
  return h;
}
const SEED=()=>{
  const clients=[
    {id:'c1',name:'Carlos Mendoza',code:'CM-4821',phone:'987654321',visits:6,coins:6,disp:0},
    {id:'c2',name:'Camila Ruiz',code:'CR-1093',phone:'976543210',visits:12,coins:2,disp:5},
    {id:'c3',name:'Lucía Paredes',code:'LP-7730',phone:'965432109',visits:31,coins:0,disp:18},
    {id:'c4',name:'Diego Salazar',code:'DS-2204',phone:'954321098',visits:2,coins:2,disp:0},
    {id:'c5',name:'Valeria Quispe',code:'VQ-5518',phone:'943210987',visits:9,coins:9,disp:0}
  ].map(c=>({...c,email:'',demo:true,history:seedHistory(c),coupons:[]}));
  const now=Date.now();
  return {v:1,clients,session:null,merchantTotal:5.6,
    activity:[{who:'Camila Ruiz',text:'abonó consumo',amt:.7,kind:'abono',t:now-2*6e4},{who:'Lucía Paredes',text:'liberó saldo Oro',amt:1,kind:'oro',t:now-6*6e4},{who:'Diego Salazar',text:'abonó consumo',amt:.5,kind:'abono',t:now-14*6e4}]};
};
let store=null,mem=null;
function load(){
  try{const raw=localStorage.getItem(KEY);store=raw?JSON.parse(raw):null}catch(e){store=mem}
  if(!store||store.v!==1){store=SEED();save()}
  return store;
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){mem=store}}
function reset(){store=SEED();save();return store}
const S=()=>store||load();
const getClient=id=>S().clients.find(c=>c.id===id)||null;
const session=()=>{const id=S().session;return id?getClient(id):null};
function setSession(id){S().session=id;save()}
function clearSession(){S().session=null;save()}
const initials=n=>n.trim().split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase();

function createClient({name,phone,email}){
  const s=S(),base=initials(name).padEnd(2,'X');let code;
  do{code=base+'-'+String(1000+Math.floor(Math.random()*9000))}while(s.clients.some(c=>c.code===code));
  const c={id:'c'+Date.now().toString(36),name:name.trim(),code,phone,email:email||'',visits:0,coins:0,disp:0,demo:false,
    history:[{t:Date.now(),txt:'creó su billetera',amt:0,kind:'lvl'}],coupons:[]};
  s.clients.push(c);s.session=c.id;save();return c;
}
function findByCode(code){const k=norm(code).replace(/\s+/g,'');return S().clients.find(c=>norm(c.code)===k)||null}

function pushActivity(who,text,amt,kind){const a=S().activity;a.unshift({who,text,amt,kind,t:Date.now()});a.length=Math.min(a.length,30)}
/* Registra un consumo (lo hace el comercio al escanear el QR del cliente) */
function registerVisit(id){
  const s=S(),c=getClient(id);if(!c)return null;
  const prev={...c},{c:next,ev,credited}=applyVisit(c);
  Object.assign(c,{visits:next.visits,coins:next.coins,disp:next.disp});
  ev.slice().reverse().forEach(e=>{c.history.unshift({t:Date.now(),txt:e[0],amt:e[1],kind:e[2]})});
  c.history.length=Math.min(c.history.length,40);
  ev.slice().reverse().forEach(e=>pushActivity(c.name,e[0],e[1],e[2]));
  s.merchantTotal=r2(s.merchantTotal+credited);save();
  return {c,prev,ev,credited};
}
/* Canje de un cupon, opcionalmente con saldo disponible */
function redeem(clientId,couponId,useBalance){
  const c=getClient(clientId),cp=COUPONS.find(x=>x.id===couponId);if(!c||!cp)return null;
  const applied=useBalance?Math.min(c.disp,cp.price):0,pay=r2(cp.price-applied);
  c.disp=r2(c.disp-applied);
  const code='CP-'+String(1000+Math.floor(Math.random()*9000))+Math.random().toString(36).slice(2,4).toUpperCase();
  const item={code,couponId:cp.id,name:cp.name,place:cp.place,emoji:cp.emoji,price:cp.price,balance:applied,paid:pay,date:Date.now(),status:'activo'};
  c.coupons.unshift(item);
  c.history.unshift({t:Date.now(),txt:`canjeó ${cp.name}`,amt:-applied,kind:'canje'});
  pushActivity(c.name,`canjeó ${cp.name}`,0,'canje');save();return item;
}
function validateCoupon(code){
  const k=norm(code).replace(/\s+/g,'');if(!k)return {ok:false,reason:'vacio'};
  for(const c of S().clients){const cp=c.coupons.find(x=>norm(x.code)===k);
    if(cp){if(cp.status==='usado')return {ok:false,reason:'usado',coupon:cp,client:c};
      cp.status='usado';cp.usedAt=Date.now();pushActivity(c.name,`validó cupón ${cp.name}`,0,'tarjeta');save();return {ok:true,coupon:cp,client:c}}}
  return {ok:false,reason:'inexistente'};
}

/* ===== utilidades de interfaz ===== */
function timeAgo(t){const m=Math.max(0,Math.round((Date.now()-t)/6e4));if(m<1)return 'ahora';if(m<60)return `hace ${m} min`;const h=Math.round(m/60);if(h<24)return `hace ${h} h`;const d=Math.round(h/24);return d===1?'ayer':`hace ${d} d`}
function qr(code){let h=0;for(const c of code)h=(h*131+c.charCodeAt(0))>>>0;let s=h,r='';const n=11,c=100/n,id='qg'+h;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){s=(s*1103515245+12345)>>>0;const k=(x<3&&y<3)||(x>n-4&&y<3)||(x<3&&y>n-4);if(k||(s>>16)%2)r+=`<rect x="${x*c}" y="${y*c}" width="${c}" height="${c}"/>`}
  return `<svg viewBox="0 0 100 100" role="img" aria-label="Código QR de ejemplo para ${esc(code)}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD95A"/><stop offset=".55" stop-color="#00e676"/><stop offset="1" stop-color="#F5C542"/></linearGradient></defs><g fill="url(#${id})">${r}</g></svg>`}
function animNum(el,to,{pre='S/ ',dec=2,dur=700}={}){
  const from=parseFloat(el.dataset.v),start=isNaN(from)?0:from;el.dataset.v=to;
  const fmt=v=>pre+v.toFixed(dec);
  if(reduce||start===to){el.textContent=fmt(to);return}
  if(el._raf)cancelAnimationFrame(el._raf);const t0=performance.now();
  const step=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=fmt(start+(to-start)*e);if(p<1)el._raf=requestAnimationFrame(step)};
  el._raf=requestAnimationFrame(step);
}
const buzz=n=>{try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}};

let toastT;
function toast(m){let t=$('#toast');
  if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.innerHTML=ic('check')+'<span></span>';document.body.appendChild(t)}
  ($('span',t)||t).textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2800)}

function initTips(){
  let tip=$('#tip');if(!tip){tip=document.createElement('div');tip.id='tip';tip.setAttribute('role','tooltip');document.body.appendChild(tip)}
  const show=el=>{tip.textContent=el.dataset.tip;tip.classList.add('show');const r=el.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight;
    const x=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2));let y=r.top-h-10;if(y<8)y=r.bottom+10;tip.style.left=x+'px';tip.style.top=y+'px'};
  const hide=()=>tip.classList.remove('show');
  document.addEventListener('pointerover',e=>{const el=e.target.closest&&e.target.closest('[data-tip]');if(el&&e.pointerType!=='touch')show(el)});
  document.addEventListener('pointerout',e=>{if(e.target.closest&&e.target.closest('[data-tip]'))hide()});
  document.addEventListener('focusin',e=>{const el=e.target.closest&&e.target.closest('[data-tip]');if(el)show(el)});
  document.addEventListener('focusout',hide);addEventListener('scroll',hide,{passive:true});
}

/* chip de saldo del menu (si la pagina lo incluye) */
function paintNav(){
  const el=$('#nav-bal');if(!el)return;const c=session();
  el.innerHTML=c?`${ic('wallet')} <b class="mono">${money(c.disp)}</b>`:`${ic('wallet')} Ingresar`;
  el.setAttribute('aria-label',c?`Mi billetera: ${money(c.disp)} disponibles`:'Ingresar a mi billetera');
  el.href=c?'dashboard.html':'signup.html';
}

/* modal accesible: devuelve {open,close} */
function modal(el){
  let last=null;
  const close=()=>{el.classList.remove('on');el.setAttribute('aria-hidden','true');document.body.style.overflow='';last&&last.focus&&last.focus()};
  const open=()=>{last=document.activeElement;el.classList.add('on');el.removeAttribute('aria-hidden');document.body.style.overflow='hidden';
    const f=el.querySelector('button,a[href],input,select');f&&setTimeout(()=>f.focus(),30)};
  el.addEventListener('click',e=>{if(e.target===el||e.target.closest('[data-close]'))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&el.classList.contains('on'))close()});
  el.setAttribute('aria-hidden','true');
  return {open,close};
}

function injectSprite(){
  const missing=(SPRITE.match(/<symbol id="[^"]+"[\s\S]*?<\/symbol>/g)||[]).filter(sym=>!document.getElementById(sym.match(/id="([^"]+)"/)[1]));
  if(missing.length)document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${missing.join('')}</defs></svg>`);
}

/* ===== SUPABASE (clientes) =====
   Requiere cargar el SDK antes que este archivo:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   La anon key es publica por diseno, pero la seguridad real depende de las politicas RLS de la tabla 'clientes'
   (el rol anon necesita permiso INSERT). Nunca pongas aqui la service_role key. */
const SUPABASE_URL='https://jcyeynruazezcosqeqos.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeWV5bnJ1YXplemNvc3FlcW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2Mjk1MjUsImV4cCI6MjEwODIwNTUyNX0.dii03i6WyoD8qyJDBIbcyxX7W3bb3Ebta8HscQ7HCBA';
let sb=null;
function initSupabase(){
  if(sb)return sb;
  if(!window.supabase||typeof window.supabase.createClient!=='function'){console.error('[expandeMoney] No se carg\u00f3 el SDK de Supabase (supabase-js@2).');return null}
  if(!SUPABASE_ANON_KEY||/^PEGA_AQUI/.test(SUPABASE_ANON_KEY)){console.error('[expandeMoney] Falta la SUPABASE_ANON_KEY en expande.js.');return null}
  sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);return sb;
}
const supabaseReady=()=>!!sb||!!initSupabase();
/* codigo_cliente: iniciales (A-Z) + guion + 4 numeros aleatorios. Ej.: Maria Torres -> MT-4821 */
function generarCodigoCliente(nombre){
  const ini=norm(nombre).replace(/[^a-z\s]/g,'').trim().split(/\s+/).filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase().padEnd(2,'X');
  return ini+'-'+String(1000+Math.floor(Math.random()*9000));
}
/* Inserta el cliente en 'clientes'. Reintenta con otro codigo si choca con uno existente (unique violation 23505).
   Devuelve {ok:true,cliente} o {ok:false,reason:'config'|'permisos'|'red'|'error',error} */
async function registrarCliente({nombre,whatsapp}){
  if(!supabaseReady())return {ok:false,reason:'config'};
  for(let intento=0;intento<5;intento++){
    const cliente={codigo_cliente:generarCodigoCliente(nombre),nombre:nombre.trim(),whatsapp,nivel:'Bronce',
      saldo_disponible:0.00,saldo_bloqueado:0.00,visitas_acumuladas:0};
    let error;
    try{({error}=await sb.from('clientes').insert(cliente))}catch(e){error={message:String(e&&e.message||e),code:'NETWORK'}}
    if(!error)return {ok:true,cliente};
    if(error.code==='23505'&&/codigo_cliente/i.test(error.message+' '+(error.details||'')))continue;
    console.error('[expandeMoney] Error al insertar en clientes:',error);
    const reason=error.code==='42501'||/row-level security|permission denied/i.test(error.message||'')?'permisos':(error.code==='NETWORK'||/fetch|network/i.test(error.message||'')?'red':'error');
    return {ok:false,reason,error};
  }
  return {ok:false,reason:'error',error:{message:'No se pudo generar un c\u00f3digo \u00fanico'}};
}

function init(){
  injectSprite();initSupabase();
  load();initTips();paintNav();
  /* sincroniza entre pestanas: si el comercio registra un consumo en otra pestana, esta pagina se actualiza */
  addEventListener('storage',e=>{if(e.key===KEY){load();paintNav();window.EM&&typeof window.EM.onChange==='function'&&window.EM.onChange()}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

window.EM={$,$$,money,r2,esc,norm,ic,reduce,CARD_COINS,TIERS,NEXT,tierFor,blockedOf,applyVisit,COUPONS,
  load,save,reset,state:S,getClient,session,setSession,clearSession,createClient,findByCode,registerVisit,redeem,validateCoupon,
  initials,timeAgo,qr,animNum,buzz,toast,modal,paintNav,generarCodigoCliente,registrarCliente,supabaseReady,onChange:null};
})();
