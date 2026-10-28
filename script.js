const CATS = {
  all: ['All', 'i-all'], greet: ['Greetings', 'i-hat'], alarm: ['Alarms & Trips', 'i-flash'],
  comms: ['Telemetry & Comms', 'i-tower'], loop: ['Loop Check', 'i-gauge'],
  fat: ['FAT / SAT', 'i-check'], hand: ['Shift Handover', 'i-log']
};
// c=category, h=common Indian phrasing, e=professional English, t=tags
const P = [
 {c:'greet',h:'Good morning sir, aaj ka plan kya hai?',e:'Good morning, sir. Could you share today\'s work plan?',t:['Greeting','Morning']},
 {c:'greet',h:'Toolbox talk karte hain, sab log aa jao.',e:'Let\'s begin the toolbox talk. Everyone, please gather here.',t:['Toolbox','Safety']},
 {c:'greet',h:'Good afternoon, lunch ke baad panel dekhte hain.',e:'Good afternoon. Let\'s inspect the panel after the lunch break.',t:['Greeting','Afternoon']},
 {c:'greet',h:'Good evening, night shift ko briefing de dete hain.',e:'Good evening. I will brief the night shift on the current plant status.',t:['Greeting','Evening','ShiftHandover']},
 {c:'greet',h:'PTW liya kya? Bina permit kaam nahi karna.',e:'Have you obtained the Permit to Work? No work starts without it.',t:['Safety','PTW']},
 {c:'alarm',h:'Trip false aaya hai, check kar raha hoon.',e:'We received a suspected false trip. I am investigating the cause.',t:['Tripped','FalseTrip']},
 {c:'alarm',h:'Relay lockout ho gaya, reset nahi ho raha.',e:'The lockout relay has operated and will not reset. I am checking the trip cause first.',t:['Tripped','Relay']},
 {c:'alarm',h:'ESD valve close nahi hua.',e:'The ESD valve failed to close on demand. Escalating to the control room immediately.',t:['ESD','Emergency']},
 {c:'alarm',h:'Alarm bahut aa rahe hain, flood ho gaya.',e:'We are experiencing an alarm flood. I will suppress nuisance alarms per the approved procedure.',t:['Alarm','Flood']},
 {c:'alarm',h:'Emergency hai, plant ko safe condition mein lao.',e:'This is an emergency. Bring the plant to a safe state and follow the shutdown procedure.',t:['Emergency','ESD']},
 {c:'comms',h:'Modbus ka timeout aa raha hai.',e:'We are seeing Modbus TCP timeouts. Checking slave ID, port 502 and network status.',t:['Modbus','Timeout']},
 {c:'comms',h:'Profibus mein cyclic data fail ho gaya.',e:'Profibus cyclic data exchange has failed. I will check termination and bus segments.',t:['Profibus','Comms']},
 {c:'comms',h:'Fiber toot gaya hai, link down hai.',e:'There is a fiber break. The link is down, so we are switching to the redundant path.',t:['Fiber','LinkDown']},
 {c:'comms',h:'RTU se data nahi aa raha.',e:'We have lost communication with the RTU. Last good data was received at 10:42.',t:['RTU','CommLoss']},
 {c:'comms',h:'Packet loss zyada hai, network slow hai.',e:'Packet loss is high on this segment. I will run a ping test and check the switch ports.',t:['PacketLoss','Network']},
 {c:'comms',h:'HMI screen hang ho gayi.',e:'The HMI screen has frozen. I will restart the client application; the process is unaffected.',t:['HMI','Freeze']},
 {c:'loop',h:'4-20 mA signal check karna hai.',e:'I will inject a 4-20 mA signal and verify the reading at the HMI.',t:['4-20mA','LoopCheck']},
 {c:'loop',h:'Transmitter ka offset aa raha hai.',e:'The transmitter shows a zero offset. It needs recalibration at the 0%, 50% and 100% points.',t:['Transmitter','Calibration']},
 {c:'loop',h:'HART communicator se device check karte hain.',e:'Let\'s connect the HART communicator to verify the device configuration and range.',t:['HART','Field']},
 {c:'loop',h:'Tag ka mapping galat hai.',e:'The tag mapping is incorrect. The PLC address does not match the HMI database.',t:['TagMapping','LoopCheck']},
 {c:'fat',h:'FAT kal hai, sab ready rakhna.',e:'The FAT is scheduled for tomorrow. Please keep all test documents and the system ready.',t:['FAT','Testing']},
 {c:'fat',h:'Client ne punch list diya hai.',e:'The client has issued a punch list. We will close the Category A items by Friday.',t:['PunchList','Client']},
 {c:'fat',h:'SAT complete hua, sign-off chahiye.',e:'The SAT is complete. We kindly request your sign-off on the test certificate.',t:['SAT','SignOff']},
 {c:'fat',h:'Yeh issue scope ke bahar hai.',e:'This item is outside the agreed scope. We can raise a variation request.',t:['Scope','Client']},
 {c:'hand',h:'Pending kaam yeh hain, next shift dekh lena.',e:'Here are the pending jobs for the next shift, in order of priority.',t:['ShiftHandover','Pending']},
 {c:'hand',h:'Bypass laga hua hai, wapas hatana hai.',e:'Interlock PT-101 is bypassed under approval #42. It must be removed before startup.',t:['Bypass','ShiftHandover']},
 {c:'hand',h:'Aaj ki report bhej raha hoon.',e:'I am sending today\'s shift report with alarms, overrides, and open issues.',t:['Report','ShiftHandover']}
];

const $ = id => document.getElementById(id);
let cat = 'all', tag = '', q = '';

function esc(s){return s.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
const icon = id => `<svg class="ico"><use href="#${id}"/></svg>`;

function buildTabs(){
  $('tabs').innerHTML = Object.entries(CATS).map(([k,[n,i]]) =>
    `<button data-k="${k}" class="${k===cat?'on':''}">${icon(i)} ${n}</button>`).join('');
  const tags = [...new Set(P.flatMap(p=>p.t))].sort();
  $('tags').innerHTML = tags.map(t=>`<button data-t="${t}" class="${t===tag?'on':''}">#${t}</button>`).join('');
}

function render(){
  const ql = q.toLowerCase().replace('#','');
  const list = P.filter(p => (cat==='all'||p.c===cat) && (!tag||p.t.includes(tag)) &&
    (!ql || (p.h+' '+p.e+' '+p.t.join(' ')).toLowerCase().includes(ql)));
  $('count').textContent = `${list.length} phrase${list.length!==1?'s':''}`;
  $('grid').innerHTML = list.map(p=>{
    const i = P.indexOf(p);
    return `<article class="card" data-i="${i}">
      <div class="cat">${icon(CATS[p.c][1])} ${CATS[p.c][0]}</div>
      <p class="hi">${esc(p.h)}</p><p class="en">${esc(p.e)}</p>
      <div class="acts">
        <button data-a="say" aria-label="Play audio">${icon('i-spk')} Listen</button>
        <button data-a="copy" aria-label="Copy phrase">${icon('i-copy')} Copy</button>
        <span class="wave"><i></i><i></i><i></i><i></i></span>
      </div></article>`;
  }).join('') || '<p class="count">No phrases found.</p>';
}

function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.id);toast.id=setTimeout(()=>t.classList.remove('show'),1800)}

async function copy(text){
  try{ await navigator.clipboard.writeText(text); }
  catch(e){ const a=document.createElement('textarea'); a.value=text; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
  toast('Phrase copied ✓');
}

function say(text, card){
  if(!('speechSynthesis' in window)) return toast('Speech not supported');
  speechSynthesis.cancel();
  document.querySelectorAll('.speaking').forEach(c=>c.classList.remove('speaking'));
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IN'; u.rate = 0.9;
  u.onend = u.onerror = () => card.classList.remove('speaking');
  card.classList.add('speaking');
  speechSynthesis.speak(u);
}

$('tabs').onclick = e => { const b=e.target.closest('button'); if(!b) return; cat=b.dataset.k; buildTabs(); render(); };
$('tags').onclick = e => { const b=e.target.closest('button'); if(!b) return; tag = tag===b.dataset.t ? '' : b.dataset.t; buildTabs(); render(); };
$('q').oninput = e => { q = e.target.value.trim(); render(); };
$('grid').onclick = e => {
  const b = e.target.closest('button'); if(!b) return;
  const card = b.closest('.card'), p = P[card.dataset.i];
  b.dataset.a==='copy' ? copy(p.e) : say(p.e, card);
};

// Simulated RTU ticker
const bauds=[9600,19200,38400], units=['RTU-01','RTU-02','PLC-03'];
setInterval(()=>{
  const ms = 8 + Math.floor(Math.random()*40);
  $('ticker').textContent = `${units[Math.floor(Math.random()*3)]} ${bauds[Math.floor(Math.random()*3)]} bps · ${ms} ms`;
}, 2000);

buildTabs(); render();
if('serviceWorker' in navigator) addEventListener('load', ()=>navigator.serviceWorker.register('service-worker.js').catch(console.warn));
