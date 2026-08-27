import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {RefreshCw, Users, Shuffle, RotateCcw, Info, X, Skull, WifiOff} from 'lucide-react';
import './styles.css';

const API='https://deadbydaylight-api.onrender.com/perks/survivor';
const fallback=[
 ['Adrenaline','Meg Thomas','Instantaneamente cura um estado de saúde e concede velocidade quando os portões são energizados.','Adrenaline'],
 ['Sprint Burst','Meg Thomas','Ao começar a correr, acelera para 150% da velocidade normal por 3 segundos. Causa Exaustão.','SprintBurst'],
 ['Quick & Quiet','Meg Thomas','Ações rápidas de cofre e entrada em armários não geram notificação de ruído.','QuickQuiet'],
 ['Bond','Dwight Fairfield','Revela as auras de outros sobreviventes próximos.','Bond'],
 ['Prove Thyself','Dwight Fairfield','Aumenta a velocidade de reparo para cada sobrevivente trabalhando no mesmo gerador.','ProveThyself'],
 ['Leader','Dwight Fairfield','Aumenta a velocidade de várias ações de outros sobreviventes próximos.','Leader'],
 ['Iron Will','Jake Park','Reduz os grunhidos de dor enquanto estiver ferido.','IronWill'],
 ['Calm Spirit','Jake Park','Animais próximos não são alertados e você resiste à vontade de gritar.','CalmSpirit'],
 ['Saboteur','Jake Park','Permite ver auras de ganchos e sabotá-los sem caixa de ferramentas.','Saboteur'],
 ['Self-Care','Claudette Morel','Permite curar a si mesmo sem um kit médico, com velocidade reduzida.','SelfCare'],
 ['Botany Knowledge','Claudette Morel','Aumenta a velocidade e eficiência de cura.','BotanyKnowledge'],
 ['Empathy','Claudette Morel','Revela a aura de sobreviventes feridos ou caídos a grande distância.','Empathy'],
 ['Dead Hard','David King','Use sua adrenalina para evitar dano após ser desenganchado. Causa Exaustão.','DeadHard'],
 ["We're Gonna Live Forever",'David King','Ajuda sobreviventes caídos a se recuperarem e concede proteção temporária.','WereGonnaLiveForever'],
 ['Balanced Landing','Nea Karlsson','Reduz o impacto de quedas e concede uma breve aceleração. Causa Exaustão.','BalancedLanding'],
 ['Urban Evasion','Nea Karlsson','Aumenta sua velocidade de movimento enquanto agachado.','UrbanEvasion'],
 ['Borrowed Time','William “Bill” Overbeck','Estende o efeito de Resistência e a aceleração após ser desenganchado.','BorrowedTime'],
 ['Unbreakable','William “Bill” Overbeck','Permite recuperar-se mais rápido e levantar sozinho uma vez por partida.','Unbreakable'],
 ['Decisive Strike','Laurie Strode','Após ser desenganchado, permite escapar do ombro do assassino com um teste de perícia.','DecisiveStrike'],
 ['Kindred','Geral','Enquanto alguém está no gancho, revela auras dos sobreviventes e do assassino próximo.','Kindred'],
 ['Hope','Geral','Concede velocidade de movimento quando os portões de saída são energizados.','Hope'],
 ['Resilience','Geral','Aumenta a velocidade de várias ações enquanto você está ferido.','Resilience'],
 ['Deja Vu','Geral','Revela geradores próximos entre si e aumenta a velocidade ao repará-los.','DejaVu'],
 ['Windows of Opportunity','Kate Denson','Revela auras de pallets, paredes quebráveis e janelas próximas.','WindowsOfOpportunity'],
 ['Lithe','Feng Min','Após um cofre rápido, acelera para 150% da velocidade por 3 segundos. Causa Exaustão.','Lithe'],
 ['Alert','Feng Min','Revela a aura do assassino quando ele quebra objetos.','Alert'],
 ['Distortion','Jeff Johansen','Consome uma ficha para impedir que o assassino leia sua aura.','Distortion'],
 ['Deliverance','Adam Francis','Após resgatar alguém com segurança, permite escapar do gancho sozinho.','Deliverance'],
 ['Inner Strength','Nancy Wheeler','Após limpar um totem, esconder-se em um armário cura um estado de saúde.','InnerStrength'],
 ['Off the Record','Zarina Kassir','Após ser desenganchado, oculta sua aura, suprime grunhidos e concede Resistência.','OffTheRecord'],
 ['Made for This','Gabriel Soma','Concede benefícios ao curar outro sobrevivente e enquanto estiver ferido.','MadeForThis'],
 ['Plot Twist','Nicolas Cage','Permite entrar voluntariamente no estado agonizante e recuperar-se completamente.','PlotTwist']
].map((p,i)=>({id:'f'+i,name:p[0],owner:p[1],description:p[2],image:`https://raw.githubusercontent.com/dearvoodoo/dbd/master/Perks/${p[3]}.png`}));

const clean=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};

function App(){
 const [count,setCount]=useState(1),[allowRepeat,setAllowRepeat]=useState(true),[perks,setPerks]=useState(fallback),[builds,setBuilds]=useState([]),[selected,setSelected]=useState(null),[loading,setLoading]=useState(true),[source,setSource]=useState('fallback');
 useEffect(()=>{let alive=true;(async()=>{try{const pages=await Promise.all([1,2,3,4,5,6].map(p=>fetch(`${API}?page=${p}`).then(r=>r.ok?r.json():Promise.reject())));const rows=pages.flatMap(x=>Array.isArray(x)?x:(x.perks||x.results||x.data||[]));const mapped=rows.filter(p=>p.name).map((p,i)=>({id:p._id||p.id||'a'+i,name:p.name,owner:p.survivor?.name||p.character?.name||p.character_name||'Sobrevivente',description:clean(p.description||p.content||p.info)||'Consulte os detalhes desta perk no jogo.',image:p.icon||p.image||p.icon_url||p.iconURL}));if(alive&&mapped.length>=16){setPerks(mapped);setSource('api')}}catch{}finally{if(alive)setLoading(false)}})();return()=>{alive=false}},[]);
 const randomize=()=>{if(perks.length<4)return;const pool=shuffle(perks);let next=[];if(allowRepeat){for(let i=0;i<count;i++)next.push(shuffle(perks).slice(0,4))}else{for(let i=0;i<count;i++)next.push(pool.slice(i*4,i*4+4))}setBuilds(next)};
 const total=useMemo(()=>new Set(perks.map(p=>p.id)).size,[perks]);
 return <main>
  <header><div className="brand"><div className="mark"><span/><span/><span/><span/></div><div><b>FOG LOADOUT</b><small>RANDOMIZADOR DE PERKS</small></div></div><div className="status"><i/> {loading?'Sincronizando perks…':`${total} perks disponíveis`}</div></header>
  <section className="hero"><div className="eyebrow"><Skull size={14}/> ENTRE NA NÉVOA</div><h1>Sua próxima build.<br/><em>Deixe o acaso decidir.</em></h1><p>Monte loadouts imprevisíveis para o seu esquadrão. Quatro perks por sobrevivente, zero escolhas fáceis.</p></section>
  <section className="control"><div className="control-title"><div><span>CONFIGURE A PARTIDA</span><h2>Quantos sobreviventes?</h2></div><Users/></div><div className="number-row">{[1,2,3,4].map(n=><button aria-label={`${n} jogador${n>1?'es':''}`} className={count===n?'active':''} onClick={()=>{setCount(n);setBuilds([])}} key={n}><b>{n}</b><small>{n===1?'SOLO':'JOGADORES'}</small></button>)}</div><div className="toggle-row"><div><b>Permitir perks repetidas</b><small>Entre jogadores diferentes</small></div><button className={`switch ${allowRepeat?'on':''}`} role="switch" aria-checked={allowRepeat} onClick={()=>{setAllowRepeat(v=>!v);setBuilds([])}}><span/></button></div><button className="random" onClick={randomize}><Shuffle size={20}/> RANDOMIZAR LOADOUTS</button><div className="hint"><Info size={14}/>{allowRepeat?'Cada jogador terá 4 perks únicas; elas podem aparecer em outro loadout.':'As perks serão únicas em todo o esquadrão.'}</div></section>
  {builds.length>0&&<section className="results"><div className="results-head"><div><span>RESULTADO</span><h2>{count===1?'Seu loadout':'Loadouts do esquadrão'}</h2></div><button onClick={randomize}><RefreshCw size={16}/> Rolar novamente</button></div><div className="players">{builds.map((build,i)=><article className="player" key={i}><div className="player-head"><span>0{i+1}</span><div><b>JOGADOR {i+1}</b><small>SOBREVIVENTE</small></div></div><div className="perks">{build.map(p=><button key={p.id} onClick={()=>setSelected(p)}><div className="diamond"><img src={p.image} alt="" onError={e=>{e.currentTarget.style.opacity='.15'}}/></div><b>{p.name}</b><small>{p.owner}</small></button>)}</div></article>)}</div></section>}
  {builds.length===0&&<section className="empty"><div className="diamond ghost"><Shuffle/></div><b>A névoa está esperando</b><span>Configure a partida e randomize para revelar suas perks.</span></section>}
  <footer><span>Dados comunitários de Dead by Daylight · {source==='api'?'Atualizados via API':'Modo offline'}</span><span>FEITO PARA A NÉVOA</span></footer>
  {selected&&<div className="modal-back" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}><X/></button><div className="modal-top"><div className="diamond big"><img src={selected.image} alt={selected.name}/></div><div><span>PERK DE SOBREVIVENTE</span><h2>{selected.name}</h2><small>{selected.owner}</small></div></div><div className="rule"/><h3>EFEITO</h3><p>{selected.description}</p><div className="note"><Info/> Valores e efeitos podem variar conforme atualizações do jogo.</div></div></div>}
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
