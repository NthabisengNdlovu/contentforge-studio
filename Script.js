const PROMPTS=[
  {title:"Blog Architect",tag:"Role Prompting",color:"linear-gradient(135deg,#8B5CF6,#EC4899)",iter:"V1 → V3",base:"You are senior tech writer...",imp:"You are senior strategist for Vercel. Audience:{audience}. Topic:{topic}. Tone:{tone}. H2/H3 + intent.",note:"Authority + audience lock"},
  {title:"SEO Chain",tag:"Chain-of-Thought",color:"linear-gradient(135deg,#06B6D4,#3B82F6)",iter:"V2 → V3",base:"Think step by step about intent...",imp:"Classify intent → map H2s to questions → outline.",note:"Split intent"},
  {title:"Cold Email",tag:"Few-Shot",color:"linear-gradient(135deg,#EC4899,#F59E0B)",iter:"V1 → V3",base:"Write cold email like examples",imp:"Hook(5w)+Pain+Proof+CTA. Examples structure.",note:"Winning pattern"},
  {title:"Code Doc",tag:"Role",color:"linear-gradient(135deg,#8B5CF6,#06B6D4)",iter:"V2 → V3",base:"Explain code for beginners",imp:"WHY before WHAT. Purpose/Params/Gotchas.",note:"Mental model"},
  {title:"Viral Thread",tag:"Few-Shot",color:"linear-gradient(135deg,#10B981,#06B6D4)",iter:"V1 → V2",base:"Create viral X thread",imp:"Hook formulas: Contrarian, Curiosity gap. Hook+5 insights.",note:"Hook taxonomy"},
  {title:"Proposal Closer",tag:"CoT",color:"linear-gradient(135deg,#EC4899,#8B5CF6)",iter:"V1 → V3",base:"Write freelance proposal",imp:"Risk→Mitigation→ROI→Timeline→CTA.",note:"Risk-first"},
  {title:"LinkedIn",tag:"Role",color:"linear-gradient(135deg,#F59E0B,#EC4899)",iter:"V2 → V3",base:"Write LinkedIn as founder",imp:"2x founder voice: vulnerable+tactical.",note:"Voice locking"},
  {title:"Image Prompt",tag:"Prompt-to-Prompt",color:"linear-gradient(135deg,#06B6D4,#8B5CF6)",iter:"V1 → V2",base:"Make image prompt for blog",imp:"Convert TITLE into Midjourney v6 photorealistic 16:9 cinematic.",note:"Visual consistency"},
];
const grid=document.getElementById('promptGrid');
PROMPTS.forEach(p=>{
  const d=document.createElement('div'); d.className='prompt';
  d.innerHTML=`<span class="p-tag" style="background:${p.color}">${p.tag}</span><span style="float:right;font-size:10px;padding:3px 8px;border-radius:999px;background:#F8FAFC;border:1px solid #E8EAF1">${p.iter}</span><h4>${p.title}</h4><code>${p.base}</code><div class="extra"><div class="p-improved"><b>Improved V3:</b> ${p.imp}</div><small>💡 ${p.note}</small></div><button>Expand</button>`;
  const b=d.querySelector('button'); b.onclick=()=>{d.classList.toggle('open'); b.textContent=d.classList.contains('open')?'Collapse':'Expand'};
  grid.appendChild(d);
});

let activeType='blog';
const tabs=document.querySelectorAll('.tab');
const textForm=document.getElementById('textForm');
const codeForm=document.getElementById('codeForm');
const imageForm=document.getElementById('imageForm');
const out=document.getElementById('output');
const outLabel=document.getElementById('outLabel');
const meta=document.getElementById('meta');

function switchTab(type){
  activeType=type;
  tabs.forEach(t=>t.classList.remove('active'));
  document.querySelector(`[data-type="${type}"]`).classList.add('active');
  textForm.style.display=(type==='blog'||type==='email'||type==='social')?'block':'none';
  codeForm.style.display=type==='code'?'block':'none';
  imageForm.style.display=type==='image'?'block':'none';
  out.className='output-body'+(type==='code'?' code':'')+(type==='image'?' img':'');
  outLabel.textContent=type==='image'?'Image Output':type==='code'?'Code Output':'Output Preview';
  meta.textContent=type+' • ready';
  if(type==='image') out.innerHTML='<div class="empty"><div class="e-icon">🎨</div><b>AI Image Generator</b><p>Real AI images via Pollinations. No API key. Fully responsive.</p></div>';
  else if(type==='code') out.innerHTML='<div class="empty"><div class="e-icon">💻</div><b>AI Code Generator</b><p>Generates JS, Python, React, HTML, SQL with docs.</p></div>';
  else out.innerHTML='<div class="empty"><div class="e-icon">✦</div><b>Ready to generate</b><p>AI-Generated Text for '+type+'</p></div>';
}
tabs.forEach(t=> t.onclick=()=> switchTab(t.dataset.type));

function genText(){
  const topic=document.getElementById('topic').value||'AI Productivity';
  const aud=document.getElementById('audience').value||'Founders';
  const tone=document.getElementById('tone').value;
  const kw=document.getElementById('keywords').value;
  let md='';
  if(activeType==='blog') md=`# ${tone.split(' ')[0]} Playbook: ${topic}\n\n> For ${aud.toLowerCase()} — ${kw.split(',')[0]||'search'}\n\n## TL;DR\n${topic} is about leverage. For ${aud.toLowerCase()}, saves 10h/week.\n\n## Why ${topic} Matters\n- Prompts → workflows\n- ${aud} burning 20h/week\n- Keywords: ${kw}\n\n## 3-Layer Architecture\n**Brain:** LLM+Memory\n**Hands:** ${kw.split(',').slice(0,3).join(', ')}\n**Loop:** ReAct Thought→Action→Observation\n\n## Tactical Build\n1. One hated job\n2. 1 prompt + 2 tools\n3. Evals day 2\n\n## SEO\nTitle: ${topic}: 2026 Guide\nHashtags: #AI\n\nImage Prompt: photorealistic ${topic} workspace, 16:9 minimal`;
  else if(activeType==='email') md=`# Email Pack — ${topic}\n\nTarget: ${aud} | Tone: ${tone}\n\nSubject: Quick idea for {{company}}\n\nHey {{first_name}},\nSaw {{company}} scaling ${aud.toLowerCase()} — lose 12h/week on ${topic.toLowerCase()}.\n\nWe helped SimilarCo cut to 90 mins (${kw}).\n\nWorth 12-min look?\n— Alex\n\nFollow-up: Bumping — 1-pager how ${aud} use ${topic}.`;
  else md=`# Social Pack — ${topic}\n\nLinkedIn (${tone}): I spent 30d building ${topic} for ${aud.toLowerCase()}. 3 lessons: Job>Tech, 3 tools>10, Evals day2. Saves 11h/week.\n\nX Thread: 1/ Most ${aud.toLowerCase()} fail at ${topic} because start with code. Flip ↓ 2/ Pain>Tech 3/ One goal one loop 4/ Evals day2 5/ Template in ContentForge.`;
  return md;
}
document.getElementById('generate').onclick=()=>{
  const btn=document.getElementById('generate'); btn.textContent='⏳ Generating...'; btn.disabled=true;
  out.innerHTML='<div style="padding:20px">Generating AI text...</div>';
  setTimeout(()=>{const md=genText(); out.textContent=md; out.className='output-body'; meta.textContent=activeType+' • '+md.length+' chars • generated'; btn.textContent='✨ Generate Content'; btn.disabled=false;},600);
};

// CODE
function genCode(){
  const lang=document.getElementById('codeLang').value;
  const task=document.getElementById('codeTask').value||'Create AI generator';
  const type=document.getElementById('codeType').value;
  let code='';
  if(lang.includes('JavaScript')) code=`// ${task} — ${type}\nfunction generateContent({topic,audience,tone}){\n  const prompt=\`You are strategist for \${audience}. Topic:\${topic}. Tone:\${tone}\`;\n  return {title: \`\${tone} Playbook: \${topic}\`, outline:['Why','Arch','Build'], seo:{keywords:topic.split(' ')} }\n}\nconsole.log(generateContent({topic:'${task.slice(0,20)}',audience:'founders'}));`;
  else if(lang.includes('Python')) code=`# ${task}\ndef generate_content(topic,audience,tone="Confident"): \n    base=f"You are strategist for {audience}. Topic: {topic}"\n    return {"title": f"{tone} Playbook: {topic}", "outline": ["Why","Arch","Build"]}\nprint(generate_content("${task.slice(0,20)}","founders"))`;
  else if(lang.includes('HTML')) code=`<!-- ${task} -->\n<section class="ai-generator">\n  <h2>${task}</h2>\n  <input id="topic" placeholder="Topic"/><button>Generate</button><div id="output"></div>\n</section>\n<style>.ai-generator{max-width:600px;margin:auto;padding:24px;border:1px solid #E8EAF1;border-radius:16px}</style>`;
  else if(lang.includes('React')) code=`// ${task} React\nimport {useState} from 'react';\nexport default function Gen(){ const [t,setT]=useState('${task.slice(0,15)}'); const [o,setO]=useState(''); const gen=()=> setO(\`# Playbook: \${t}\`); return <div><input value={t} onChange={e=>setT(e.target.value)}/><button onClick={gen}>Generate</button><pre>{o}</pre></div> }`;
  else code=`-- ${task}\nCREATE TABLE content_ideas (id SERIAL, topic TEXT, audience TEXT, prompt_v3 TEXT);\nINSERT INTO content_ideas VALUES (1,'${task.slice(0,20)}','founders','You are strategist...');`;
  return code;
}
document.getElementById('genCode').onclick=()=>{
  const btn=document.getElementById('genCode'); btn.textContent='⏳ Generating code...'; btn.disabled=true;
  out.innerHTML='<div style="padding:20px">Generating AI code...</div>';
  setTimeout(()=>{const c=genCode(); out.textContent=c; out.className='output-body code'; meta.textContent='code • '+c.length+' chars • '+document.getElementById('codeLang').value; btn.textContent='💻 Generate Code'; btn.disabled=false;},500);
};

// IMAGE - REAL AI
const history=[];
document.getElementById('genImg').onclick=async()=>{
  const prompt=document.getElementById('imgPrompt').value.trim(); if(!prompt) return;
  const style=document.getElementById('imgStyle').value;
  const ratio=document.getElementById('imgRatio').value;
  const neg=document.getElementById('imgNeg').value;
  const [w,h]=ratio==='1:1'?[1024,1024]:ratio==='16:9'?[1280,720]:ratio==='9:16'?[720,1280]:[1024,768];
  const full=`${prompt}, ${style} style, highly detailed, 4k${neg?', not '+neg:''}`;
  const seed=Math.floor(Math.random()*999999);
  const url=`https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?width=${w}&height=${h}&seed=${seed}&nologo=true&enhance=true`;
  const btn=document.getElementById('genImg'); btn.textContent='⏳ Rendering AI image...'; btn.disabled=true;
  out.className='output-body img';
  out.innerHTML='<div style="padding:40px;text-align:center">🎨 Generating real AI image...<br><small>via Pollinations AI</small><div style="margin:20px auto;width:36px;height:36px;border:3px solid #E8EAF1;border-top-color:#7C3AED;border-radius:50%;animation:spin 1s linear infinite"></div></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>';
  try{
    const img=new Image(); img.crossOrigin='anonymous'; img.src=url;
    await new Promise((res,rej)=>{img.onload=res; img.onerror=rej; setTimeout(rej,20000);});
    out.innerHTML=''; const finalImg=document.createElement('img'); finalImg.src=url; out.appendChild(finalImg);
    meta.textContent=`${w}x${h} • ${style} • AI generated`;
    history.unshift(url); if(history.length>8) history.pop();
    const hg=document.getElementById('imgHistory'); hg.innerHTML=''; history.forEach(u=>{const im=document.createElement('img'); im.src=u; im.onclick=()=>{out.innerHTML=''; const c=document.createElement('img'); c.src=u; out.appendChild(c); out.className='output-body img';}; hg.appendChild(im);});
  }catch(e){out.innerHTML='<div style="color:#ef4444;padding:20px">Failed — Pollinations busy, try again.</div>';}
  btn.textContent='🎨 Generate Image'; btn.disabled=false;
};

// Copy / Download
document.getElementById('copyBtn').onclick=async()=>{
  const isImg=document.querySelector('#output img'); if(isImg) return;
  const t=out.textContent; if(!t||t.includes('Ready')) return; await navigator.clipboard.writeText(t);
  const b=document.getElementById('copyBtn'); const o=b.textContent; b.textContent='Copied!'; setTimeout(()=>b.textContent=o,1200);
};
document.getElementById('dlBtn').onclick=async()=>{
  const img=document.querySelector('#output img');
  if(img){
    try{const r=await fetch(img.src); const blob=await r.blob(); const u=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=u; a.download='ai-image-'+Date.now()+'.png'; a.click(); URL.revokeObjectURL(u);}catch{window.open(img.src,'_blank');}
  }else{
    const t=out.textContent; if(!t||t.includes('Ready')) return;
    const ext=activeType==='code'?'.js':'.md';
    const b=new Blob([t],{type:'text/plain'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=activeType+'-'+Date.now()+ext; a.click(); URL.revokeObjectURL(u);
  }
};
