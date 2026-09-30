const PROMPTS=[
  {title:"Blog Architect Role",tag:"Role Prompting",color:"linear-gradient(135deg,#8B5CF6,#EC4899)",iter:"V1 → V3",base:"You are a senior tech writer...",imp:"You are senior tech writer for Vercel/Notion with 10y exp. Audience:{audience}. Goal: explain {topic} with framework. Tone:{tone}. Output H2/H3 + search intent.",note:"Added authority + audience lock"},
  {title:"SEO Chain Blueprint",tag:"Chain-of-Thought",color:"linear-gradient(135deg,#06B6D4,#3B82F6)",iter:"V2 → V3",base:"Think step by step about search intent...",imp:"First classify intent (info/nav). Then map H2s to questions. Then generate outline.",note:"Split intent classification"},
  {title:"Cold Email Persuader",tag:"Few-Shot",color:"linear-gradient(135deg,#EC4899,#F59E0B)",iter:"V1 → V3",base:"Write a cold email like examples: [3 examples]",imp:"Pattern: Hook(5w)+Pain(1 line)+Proof(metric)+Low-friction CTA. Examples structure.",note:"Extracted structure from winners"},
  {title:"Code Doc Generator",tag:"Role Prompting",color:"linear-gradient(135deg,#8B5CF6,#06B6D4)",iter:"V2 → V3",base:"Explain this code for beginners...",imp:"You are staff engineer. Explain WHY before WHAT. Use Purpose/Params/Gotchas.",note:"Mental model framework"},
  {title:"Viral Thread Hook",tag:"Few-Shot",color:"linear-gradient(135deg,#10B981,#06B6D4)",iter:"V1 → V2",base:"Create a viral X thread about {topic}",imp:"Hook formulas: [Contrarian, Curiosity gap, List]. Thread = Hook +5 insights + CTA.",note:"Hook taxonomy"},
  {title:"Proposal Closer",tag:"Chain-of-Thought",color:"linear-gradient(135deg,#EC4899,#8B5CF6)",iter:"V1 → V3",base:"Write a freelance proposal...",imp:"Think: Client risk → Mitigation → ROI math → Timeline → CTA. Now write.",note:"Risk-first persuasion"},
  {title:"LinkedIn Authority",tag:"Role Prompting",color:"linear-gradient(135deg,#F59E0B,#EC4899)",iter:"V2 → V3",base:"Write a LinkedIn post as a founder...",imp:"You are 2x founder writing to {audience}. Voice: vulnerable + tactical. Structure hook+3 bullets+CTA.",note:"Voice + structure locking"},
  {title:"README Engineer",tag:"Chain-of-Thought",color:"linear-gradient(135deg,#3B82F6,#8B5CF6)",iter:"V1 → V3",base:"Generate README for project...",imp:"Step1: Infer stack. Step2: List killer features. Step3: Write install as copy-paste + usage.",note:"Stack inference before writing"},
];

const grid=document.getElementById('promptGrid');
PROMPTS.forEach((p,i)=>{
  const d=document.createElement('div'); d.className='prompt';
  d.innerHTML=`<span class="p-tag" style="background:${p.color}">${p.tag}</span> <span style="float:right;font-size:10px;padding:3px 8px;border-radius:999px;background:#F8FAFC;border:1px solid #E8EAF1">${p.iter}</span><h4>${p.title}</h4><code>${p.base}</code><div class="extra"><div class="p-improved"><b>Improved V3:</b> ${p.imp}</div><small>💡 ${p.note}</small></div><button>Expand prompt</button>`;
  const btn=d.querySelector('button');
  btn.onclick=()=>{d.classList.toggle('open'); btn.textContent=d.classList.contains('open')?'Collapse':'Expand prompt'};
  grid.appendChild(d);
});

let activeType='blog';
document.querySelectorAll('.tab').forEach(t=> t.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active')); t.classList.add('active'); activeType=t.dataset.type; document.getElementById('meta').textContent=activeType+' • ready';
}));

function genContent(){
  const topic=document.getElementById('topic').value.trim()||'AI Productivity';
  const aud=document.getElementById('audience').value.trim()||'Founders & creators';
  const tone=document.getElementById('tone').value;
  const kw=document.getElementById('keywords').value.trim();
  let md='';
  if(activeType==='blog'){
    md=`# ${tone.split(' ')[0]} Playbook: ${topic}\n\n> For ${aud.toLowerCase()} — optimized for ${kw.split(',')[0]||'search'}\n\n## TL;DR Hook\nStop building features. Start building agents. ${topic} is about leverage.\n\n## Outline\n### Why ${topic} Matters\n- Shift from prompts to workflows\n- ${aud} burning 20h/week\n- ${kw}\n\n### 3-Layer Architecture\n**1. Brain (LLM+Memory)**\n**2. Hands (Tools)** Pick 3 max\n**3. Loop (ReAct)** Thought→Action→Observation\n\n## Full Article\nStart with ONE job your user hates. For ${aud.toLowerCase()}, pain is manual ${topic.toLowerCase()}. Constrain agent to one outcome. Metrics over adjectives. Tone:${tone.toLowerCase()}.\n\n## SEO\nTitle: ${topic}: 2026 Guide\nHashtags: #AI #ContentCreation\n\n## Image Prompt\nphotorealistic, ${topic} workspace, soft studio light, 16:9, minimal`;
  }else if(activeType==='email'){
    md=`# Outreach Pack — ${topic}\n\nTarget: ${aud} | Tone: ${tone}\n\nSubject: Quick idea for {{company}}\n\nHey {{first_name}},\n\nSaw {{company}} scaling ${aud.toLowerCase()} — teams lose 12h/week on ${topic.toLowerCase()}.\n\nWe helped [SimilarCo] cut to 90 mins.\n\nWorth 12-min look Thu/Fri?\n\n— Alex\n\nFollow-up Day3: Bumping — 1-pager on how ${aud} use ${topic}. Reply pass if not relevant.\n\nProposal: Problem→Solution (70% automated 10d) → ROI 8h/week saved.`;
  }else if(activeType==='code'){
    md=`# ${topic} — Docs\n\nToolkit for ${aud}. Tone:${tone}\n\n## README\nFeatures: Fast loop, Memory pgvector, Tool registry, Eval harness\n\nQuickstart\n\\`\\`\\`bash\npnpm i\ncp .env.example .env\npnpm dev\n\\`\\`\\`\n\nCore Loop\n\\`\\`\\`ts\nasync function run(goal:string){ while(!done){ const thought=await plan(goal,memory); const obs=await execute(thought.action); memory.push(obs) } }\n\\`\\`\\`\n\nTutorial: Define job "${topic}" → Prompt V1 → test 5 samples → iterate → evals → ship`;
  }else{
    md=`# Social Pack — ${topic}\n\nAudience:${aud} | Voice:${tone}\n\nLinkedIn: I spent 30 days building ${topic} for ${aud.toLowerCase()}.\n\n3 lessons: 1. Job not tech 2. 3 tools >10 3. Evals day2\n\nNow saves 11h/week.\n\nX Thread: 1/ Most ${aud.toLowerCase()} fail at ${topic} because they start with code. Flip ↓\n2/ Pain > Tech\n3/ One goal one loop one metric\n4/ Evals day2\n5/ Full template in ContentForge. Reply TEMPLATE`;
  }
  return md;
}

const out=document.getElementById('output');
document.getElementById('generate').onclick=()=>{
  const btn=document.getElementById('generate'); btn.textContent='⏳ Generating...'; btn.disabled=true;
  out.innerHTML='<div style="padding:20px"><div style="height:12px;width:70%;background:#F1F5F9;border-radius:99px;margin-bottom:10px"></div><div style="height:12px;width:85%;background:#F1F5F9;border-radius:99px;margin-bottom:14px"></div><div style="height:80px;background:#F8FAFC;border:1px solid #F1F5F9;border-radius:12px"></div></div>';
  setTimeout(()=>{
    const md=genContent(); out.textContent=md;
    document.getElementById('meta').textContent=activeType+' • '+Math.ceil(md.length/5)+' words • generated';
    btn.textContent='✨ Generate Content'; btn.disabled=false;
  },600);
};
document.getElementById('copyBtn').onclick=async()=>{
  const txt=out.textContent; if(!txt||txt.includes('Ready to generate')) return;
  await navigator.clipboard.writeText(txt); const b=document.getElementById('copyBtn'); const o=b.textContent; b.textContent='Copied!'; setTimeout(()=>b.textContent=o,1200);
};
document.getElementById('dlBtn').onclick=()=>{
  const txt=out.textContent; if(!txt||txt.includes('Ready to generate')) return;
  const blob=new Blob([txt],{type:'text/markdown'}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=activeType+'-'+(document.getElementById('topic').value||'content').toLowerCase().replace(/\s+/g,'-').slice(0,24)+'.md'; a.click(); URL.revokeObjectURL(url);
};
