import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap');
:root {
  --bg:#0B1120; --surface:#111827; --card:#1A2336; --border:#253047;
  --blue:#2563EB; --blue-lt:#3B82F6; --cyan:#06B6D4; --green:#10B981;
  --amber:#F59E0B; --violet:#8B5CF6; --pink:#EC4899;
  --text:#F0F4FF; --muted:#8B9DC3; --dim:#4B5C7A;
}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;}
::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:var(--blue);border-radius:3px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes blob{0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%}50%{border-radius:40% 60% 30% 70%/60% 40% 70% 30%}}
@keyframes gridScroll{from{background-position:0 0}to{background-position:40px 40px}}
.btn{cursor:pointer;border:none;font-family:inherit;transition:all .2s cubic-bezier(.4,0,.2,1);}
.btn:hover{transform:translateY(-2px);}
.card-h{transition:all .28s cubic-bezier(.4,0,.2,1);}
.card-h:hover{transform:translateY(-6px);box-shadow:0 24px 48px rgba(0,0,0,.5);}
input,textarea,select{font-family:inherit;outline:none;}
input::placeholder,textarea::placeholder{color:var(--dim);}
.grid-overlay{position:absolute;inset:0;background-image:linear-gradient(rgba(37,99,235,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.05) 1px,transparent 1px);background-size:40px 40px;animation:gridScroll 10s linear infinite;pointer-events:none;}
.blob{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;animation:blob 16s ease-in-out infinite;}
.phone{width:218px;height:440px;border-radius:38px;background:linear-gradient(160deg,#1e2d47 0%,#0d1a2e 100%);border:2px solid rgba(37,99,235,.3);box-shadow:0 32px 80px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.05),inset 0 1px 0 rgba(255,255,255,.06);position:relative;overflow:hidden;animation:float 5s ease-in-out infinite;}
`;

const NAV = ["Home","Services","Portfolio","About","Contact"];

const SERVICES = [
  {icon:"🖥️",c:"#2563EB",bg:"rgba(37,99,235,.1)",title:"SaaS Platforms",desc:"Scalable multi-tenant cloud software from MVP to enterprise. API-first, cloud-native architecture.",tags:["Cloud-Native","API-First","Microservices"]},
  {icon:"📱",c:"#06B6D4",bg:"rgba(6,182,212,.1)",title:"Mobile Applications",desc:"iOS & Android apps with native performance, offline-first design, and delightful UX.",tags:["React Native","Flutter","Swift","Kotlin"]},
  {icon:"🏗️",c:"#10B981",bg:"rgba(16,185,129,.1)",title:"IT Infrastructure",desc:"Managed IT, cloud migrations, and DevOps pipelines with 24/7 monitoring and SLA-backed uptime.",tags:["AWS","Azure","Kubernetes","DevOps"]},
  {icon:"🔐",c:"#F59E0B",bg:"rgba(245,158,11,.1)",title:"Cybersecurity",desc:"Security audits, penetration testing, SOC 2 preparation, and real-time threat monitoring.",tags:["Pen Testing","SOC 2","GDPR","Compliance"]},
  {icon:"🤖",c:"#8B5CF6",bg:"rgba(139,92,246,.1)",title:"AI & Automation",desc:"LLM integrations, ML pipelines, and intelligent workflow automation that cuts overhead by 60%+.",tags:["LLM","ML Ops","RPA","Data Pipelines"]},
  {icon:"📊",c:"#EC4899",bg:"rgba(236,72,153,.1)",title:"Data & Analytics",desc:"Business intelligence dashboards and data engineering turning raw data into revenue decisions.",tags:["Power BI","Tableau","dbt","BigQuery"]},
];

const PORTFOLIO = [
  {title:"Nexara CRM",cat:"SaaS",desc:"AI-powered CRM for mid-market sales teams",metric:"3× faster deal close",c:"#2563EB"},
  {title:"PocketVault",cat:"Mobile",desc:"Personal finance with predictive insights",metric:"500K+ downloads",c:"#06B6D4"},
  {title:"GridFlux",cat:"IT Services",desc:"National energy grid management platform",metric:"99.99% uptime",c:"#10B981"},
  {title:"Helia Suite",cat:"SaaS",desc:"Remote collaboration for distributed teams",metric:"200+ enterprises",c:"#8B5CF6"},
  {title:"TraceWave",cat:"Mobile",desc:"Supply chain visibility & logistics tracking",metric:"$12M saved p.a.",c:"#F59E0B"},
  {title:"KernelOps",cat:"IT Services",desc:"Enterprise DevOps automation platform",metric:"60% deploy time cut",c:"#EC4899"},
];

const STATS=[{v:"150+",l:"Projects Delivered",i:"🚀"},{v:"40+",l:"Enterprise Clients",i:"🏢"},{v:"8 yrs",l:"Industry Experience",i:"📅"},{v:"99%",l:"Client Retention",i:"⭐"}];

const TESTIMONIALS=[
  {name:"Priya Mehta",role:"CTO, Nexara",av:"PM",text:"Zygonich rebuilt our entire infrastructure in 12 weeks. The new architecture handles 50× our previous peak load without a single incident."},
  {name:"James Okonkwo",role:"Founder, PocketVault",av:"JO",text:"From wireframe to App Store in 16 weeks. The UX attention and communication throughout was genuinely world-class."},
  {name:"Sara Lindqvist",role:"VP Engineering, GridFlux",av:"SL",text:"Their DevOps team manages our 24/7 critical infrastructure. Zero incidents in 14 months. That kind of reliability is priceless."},
];

const TRUST=[
  {icon:"🔐",title:"SOC 2 Type II",desc:"Annual third-party audit",c:"#10B981"},
  {icon:"📜",title:"ISO 27001",desc:"Certified info security",c:"#2563EB"},
  {icon:"🌐",title:"GDPR Ready",desc:"Full data privacy compliance",c:"#06B6D4"},
  {icon:"☁️",title:"AWS Partner",desc:"Advanced Tier Partner",c:"#F59E0B"},
  {icon:"🔵",title:"Azure Certified",desc:"Microsoft Solutions Partner",c:"#8B5CF6"},
  {icon:"🏆",title:"NASSCOM",desc:"Verified member company",c:"#EC4899"},
];

function PhoneWidget() {
  return (
    <div className="phone">
      <div style={{position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",width:76,height:6,background:"rgba(255,255,255,.1)",borderRadius:3}}/>
      <div style={{padding:"34px 14px 14px",height:"100%",display:"flex",flexDirection:"column",gap:9}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"var(--muted)"}}>
          <span>9:41</span><span style={{letterSpacing:2}}>●●●●</span>
        </div>
        <div style={{background:"rgba(37,99,235,.15)",borderRadius:13,padding:"11px 13px",border:"1px solid rgba(37,99,235,.22)"}}>
          <div style={{fontSize:9,color:"var(--cyan)",fontWeight:700,letterSpacing:"0.1em",marginBottom:3}}>ZYGONICH APP</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,color:"var(--text)"}}>Good morning, Alex 👋</div>
        </div>
        {[{l:"Revenue",v:"₹4.2M",ch:"+12.4%",c:"#10B981"},{l:"Active Users",v:"18,420",ch:"+8.1%",c:"#06B6D4"}].map((m,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,.04)",borderRadius:11,padding:"9px 11px",border:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:8,color:"var(--muted)",marginBottom:2}}>{m.l}</div>
              <div style={{fontWeight:700,fontSize:14,color:"var(--text)"}}>{m.v}</div>
            </div>
            <span style={{fontSize:9,fontWeight:700,color:m.c,background:`${m.c}18`,padding:"3px 7px",borderRadius:5}}>{m.ch}</span>
          </div>
        ))}
        <div style={{background:"rgba(255,255,255,.04)",borderRadius:11,padding:"10px 11px",border:"1px solid var(--border)",flex:1}}>
          <div style={{fontSize:8,color:"var(--muted)",marginBottom:7,fontWeight:600}}>Weekly Activity</div>
          <div style={{display:"flex",gap:5,alignItems:"flex-end",height:46}}>
            {[55,80,45,90,70,100,65].map((h,i)=>(
              <div key={i} style={{flex:1,borderRadius:"3px 3px 0 0",background:`linear-gradient(to top,#2563EB,#06B6D4)`,height:`${h}%`,opacity:i===5?1:.45}}/>
            ))}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:5}}>
          {[0,1,2].map(i=><div key={i} style={{width:i===0?20:6,height:6,borderRadius:3,background:i===0?"var(--blue)":"var(--border)"}}/>)}
        </div>
      </div>
    </div>
  );
}

export default function Zygonich() {
  const [scrollY,setScrollY]=useState(0);
  const [menuOpen,setMenuOpen]=useState(false);
  const [filter,setFilter]=useState("All");
  const [activeNav,setActiveNav]=useState("Home");
  const [vis,setVis]=useState(false);
  const [tIdx,setTIdx]=useState(0);
  const [form,setForm]=useState({name:"",email:"",service:"",message:""});
  const [sent,setSent]=useState(false);

  useEffect(()=>{setTimeout(()=>setVis(true),150);const s=()=>setScrollY(window.scrollY);window.addEventListener("scroll",s);return()=>window.removeEventListener("scroll",s);},[]);
  useEffect(()=>{const t=setInterval(()=>setTIdx(i=>(i+1)%TESTIMONIALS.length),4500);return()=>clearInterval(t);},[]);

  const handleSend=()=>{if(form.name&&form.email){setSent(true);setForm({name:"",email:"",service:"",message:""});setTimeout(()=>setSent(false),4500);}};
  const filtered=filter==="All"?PORTFOLIO:PORTFOLIO.filter(p=>p.cat===filter);

  return(
    <div style={{background:"var(--bg)",color:"var(--text)",minHeight:"100vh",overflowX:"hidden"}}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,height:68,padding:"0 5vw",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrollY>40?"rgba(11,17,32,.97)":"transparent",backdropFilter:scrollY>40?"blur(24px)":"none",borderBottom:scrollY>40?"1px solid var(--border)":"none",transition:"all .4s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#2563EB,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:"#fff",boxShadow:"0 4px 16px rgba(37,99,235,.4)"}}>Z</div>
          <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:20,letterSpacing:"-0.02em"}}>Zygonich</span>
        </div>
        <div style={{display:"flex",gap:28,alignItems:"center"}}>
          {NAV.map(n=>(
            <button key={n} className="btn" onClick={()=>setActiveNav(n)} style={{background:"none",color:activeNav===n?"var(--blue-lt)":"var(--muted)",fontSize:14,fontWeight:500,borderBottom:activeNav===n?"1px solid var(--blue-lt)":"1px solid transparent",paddingBottom:2}}>
              {n}
            </button>
          ))}
          <button className="btn" style={{background:"var(--blue)",color:"#fff",padding:"10px 22px",borderRadius:9,fontWeight:700,fontSize:13,boxShadow:"0 4px 16px rgba(37,99,235,.35)"}}>Start Project</button>
        </div>
        <button className="btn" onClick={()=>setMenuOpen(!menuOpen)} style={{display:"none",background:"none",color:"var(--text)",fontSize:24}}>☰</button>
      </nav>

      {menuOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(11,17,32,.98)",backdropFilter:"blur(24px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28}}>
          <button onClick={()=>setMenuOpen(false)} style={{position:"absolute",top:22,right:22,background:"none",border:"none",color:"var(--text)",fontSize:28,cursor:"pointer"}}>✕</button>
          {NAV.map(n=><button key={n} className="btn" onClick={()=>{setActiveNav(n);setMenuOpen(false);}} style={{background:"none",color:"var(--text)",fontSize:22,fontFamily:"'Outfit',sans-serif",fontWeight:700}}>{n}</button>)}
          <button className="btn" style={{background:"var(--blue)",color:"#fff",padding:"14px 36px",borderRadius:10,fontWeight:700,fontSize:16}}>Start Project</button>
        </div>
      )}

      {/* HERO */}
      <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 5vw 0",overflow:"hidden"}}>
        <div className="grid-overlay"/>
        <div className="blob" style={{width:580,height:580,top:"-12%",left:"-8%",background:"radial-gradient(circle,rgba(37,99,235,.2) 0%,transparent 65%)"}}/>
        <div className="blob" style={{width:400,height:400,bottom:"0%",right:"2%",background:"radial-gradient(circle,rgba(6,182,212,.14) 0%,transparent 65%)",animationDelay:"-7s"}}/>
        <div style={{position:"absolute",top:"38%",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(37,99,235,.2),transparent)"}}/>

        <div style={{position:"relative",zIndex:2,display:"grid",gridTemplateColumns:"1fr 420px",gap:60,alignItems:"center",width:"100%",maxWidth:1200,margin:"0 auto",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(30px)",transition:"all 1s cubic-bezier(.16,1,.3,1)"}}>
          <div>
            {/* Trust pill */}
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.25)",borderRadius:100,padding:"6px 14px",marginBottom:28}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#10B981",animation:"pulse 2s ease-in-out infinite"}}/>
              <span style={{fontSize:11,color:"#10B981",fontWeight:700,letterSpacing:"0.08em"}}>TRUSTED BY 40+ ENTERPRISES · ISO 27001 CERTIFIED</span>
            </div>

            <h1 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(38px,5.5vw,74px)",lineHeight:1.06,letterSpacing:"-0.04em",marginBottom:22}}>
              Technology that<br/>
              <span style={{background:"linear-gradient(90deg,var(--blue-lt),var(--cyan))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                powers growth.
              </span>
            </h1>

            <p style={{fontSize:"clamp(15px,1.5vw,17px)",color:"var(--muted)",lineHeight:1.8,maxWidth:500,marginBottom:40}}>
              Zygonich builds SaaS platforms, enterprise mobile apps, and managed IT infrastructure that companies trust with their most critical operations.
            </p>

            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:48}}>
              <button className="btn" style={{background:"var(--blue)",color:"#fff",padding:"14px 32px",borderRadius:10,fontWeight:700,fontSize:14,boxShadow:"0 8px 24px rgba(37,99,235,.4)"}}>Start a Project →</button>
              <button className="btn" style={{background:"rgba(255,255,255,.06)",color:"var(--text)",padding:"14px 32px",borderRadius:10,fontWeight:600,fontSize:14,border:"1px solid var(--border)"}}>View Case Studies</button>
            </div>

            {/* Social proof */}
            <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
              <div style={{display:"flex"}}>
                {["A","B","C","D"].map((l,i)=>(
                  <div key={i} style={{width:32,height:32,borderRadius:"50%",background:`hsl(${i*55+210},55%,38%)`,border:"2px solid var(--bg)",marginLeft:i?-9:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{display:"flex",gap:2,marginBottom:2}}>{"★★★★★".split("").map((s,i)=><span key={i} style={{color:"#F59E0B",fontSize:12}}>{s}</span>)}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>Rated 4.9/5 · 150+ projects</div>
              </div>
              <div style={{width:1,height:30,background:"var(--border)"}}/>
              {["SOC 2","ISO 27001","GDPR"].map(b=>(
                <span key={b} style={{fontSize:10,fontWeight:700,color:"var(--cyan)",background:"rgba(6,182,212,.1)",border:"1px solid rgba(6,182,212,.25)",padding:"4px 9px",borderRadius:5,letterSpacing:"0.06em"}}>{b}</span>
              ))}
            </div>
          </div>

          {/* Right side – phone + floating cards */}
          <div style={{display:"flex",gap:16,alignItems:"center",justifyContent:"center"}}>
            <PhoneWidget/>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {icon:"📱",v:"500K+",l:"App Downloads",c:"var(--cyan)",delay:"0s"},
                {icon:"⚡",v:"12 wks",l:"Avg Delivery",c:"var(--green)",delay:".6s"},
                {icon:"🔒",v:"Zero",l:"Security Breaches",c:"var(--blue-lt)",delay:"1.2s"},
              ].map((c,i)=>(
                <div key={i} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,padding:"14px 16px",minWidth:148,boxShadow:"0 12px 36px rgba(0,0,0,.4)",animation:`float ${4+i*.8}s ease-in-out infinite`,animationDelay:c.delay}}>
                  <div style={{fontSize:18,marginBottom:5}}>{c.icon}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:20,color:c.c,lineHeight:1}}>{c.v}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>{c.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{position:"absolute",bottom:30,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <div style={{width:22,height:34,border:"1.5px solid var(--border)",borderRadius:11,display:"flex",justifyContent:"center",paddingTop:5}}>
            <div style={{width:3,height:7,borderRadius:2,background:"var(--blue)",animation:"float 1.5s ease-in-out infinite"}}/>
          </div>
          <span style={{fontSize:9,color:"var(--dim)",letterSpacing:"0.14em"}}>SCROLL</span>
        </div>
      </section>

      {/* TICKER */}
      <div style={{background:"linear-gradient(90deg,#1d4ed8,var(--blue),#1d4ed8)",padding:"12px 0",overflow:"hidden",borderTop:"1px solid rgba(255,255,255,.08)",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"inline-flex",animation:"ticker 26s linear infinite",whiteSpace:"nowrap"}}>
          {[...Array(2)].map((_,ri)=>(
            <span key={ri} style={{display:"inline-flex"}}>
              {["SaaS Development","Mobile Apps","IT Infrastructure","DevOps","AI Integration","Cybersecurity","Cloud Migration","UI/UX Design","Data Engineering","24/7 Support"].map((t,i)=>(
                <span key={i} style={{color:"rgba(255,255,255,.88)",fontWeight:700,fontSize:11,letterSpacing:"0.1em",padding:"0 28px"}}>◆ {t.toUpperCase()}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* CLIENT LOGOS */}
      <section style={{padding:"52px 5vw",borderBottom:"1px solid var(--border)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <p style={{fontSize:11,color:"var(--dim)",fontWeight:700,letterSpacing:"0.12em"}}>TRUSTED BY TEAMS AT</p>
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:44,flexWrap:"wrap"}}>
          {["Nexara","GridFlux","PocketVault","Helia","TraceWave","KernelOps"].map((l,i)=>(
            <div key={i} style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:"var(--dim)",letterSpacing:"-0.02em",transition:"color .2s",cursor:"default"}}
              onMouseOver={e=>e.currentTarget.style.color="var(--text)"} onMouseOut={e=>e.currentTarget.style.color="var(--dim)"}>{l}</div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{background:"var(--surface)",padding:"72px 5vw"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",maxWidth:900,margin:"0 auto",gap:0}}>
          {STATS.map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"36px 20px",position:"relative"}}>
              <div style={{fontSize:28,marginBottom:10}}>{s.i}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(36px,4.5vw,56px)",color:"var(--text)",lineHeight:1,marginBottom:8}}>{s.v}</div>
              <div style={{color:"var(--muted)",fontSize:13,fontWeight:500}}>{s.l}</div>
              {i<STATS.length-1&&<div style={{position:"absolute",top:"20%",right:0,bottom:"20%",width:1,background:"var(--border)"}}/>}
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{padding:"96px 5vw"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{marginBottom:60}}>
            <div style={{fontSize:11,color:"var(--cyan)",fontWeight:700,letterSpacing:"0.14em",marginBottom:12}}>WHAT WE BUILD</div>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,50px)",letterSpacing:"-0.03em",maxWidth:480,lineHeight:1.1,marginBottom:14}}>Full-stack capabilities. One partner.</h2>
            <p style={{color:"var(--muted)",fontSize:15,maxWidth:460,lineHeight:1.75}}>Everything you need to build, scale, and secure your technology — under one roof.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(330px,1fr))",gap:1}}>
            {SERVICES.map((s,i)=>(
              <div key={i} className="card-h" style={{background:"var(--card)",border:"1px solid var(--border)",padding:"34px 30px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:s.c,opacity:.75}}/>
                <div style={{position:"absolute",top:-30,right:-30,width:110,height:110,borderRadius:"50%",background:s.bg,filter:"blur(28px)"}}/>
                <div style={{width:50,height:50,borderRadius:13,background:s.bg,border:`1px solid ${s.c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:18}}>{s.icon}</div>
                <h3 style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:18,marginBottom:10,color:"var(--text)"}}>{s.title}</h3>
                <p style={{color:"var(--muted)",fontSize:13.5,lineHeight:1.75,marginBottom:18}}>{s.desc}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:18}}>
                  {s.tags.map(t=><span key={t} style={{fontSize:10,fontWeight:600,letterSpacing:"0.05em",padding:"4px 9px",borderRadius:5,background:"rgba(255,255,255,.05)",color:"var(--muted)",border:"1px solid var(--border)"}}>{t}</span>)}
                </div>
                <div style={{color:s.c,fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>Learn more <span>→</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{padding:"96px 5vw",background:"var(--surface)",position:"relative",overflow:"hidden"}}>
        <div className="blob" style={{width:500,height:500,top:"-15%",right:"-5%",background:"radial-gradient(circle,rgba(37,99,235,.15) 0%,transparent 65%)",opacity:.6}}/>
        <div style={{maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:"var(--blue-lt)",fontWeight:700,letterSpacing:"0.14em",marginBottom:12}}>WHY ZYGONICH</div>
              <h2 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(28px,3.5vw,46px)",letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:16}}>Built on trust.<br/>Proven in production.</h2>
              <p style={{color:"var(--muted)",fontSize:15,lineHeight:1.8,marginBottom:36}}>We're not just vendors — we're long-term technology partners. Our reputation is built on transparent delivery, rigorous security, and outcomes that move the needle.</p>
              <div style={{display:"flex",flexDirection:"column",gap:22}}>
                {[
                  {icon:"🛡️",title:"Security-First Engineering",desc:"Automated SAST, dependency scanning, and quarterly penetration testing on every codebase."},
                  {icon:"📋",title:"Transparent Delivery",desc:"Weekly demos, live roadmaps, and Slack access to your core engineering team — always."},
                  {icon:"🤝",title:"Long-Term Partnership",desc:"99% of our clients renew. We measure success in years, not sprints."},
                  {icon:"⚙️",title:"SLA-Backed Uptime",desc:"99.9% uptime guarantee with 24/7 on-call engineering response for critical systems."},
                ].map((f,i)=>(
                  <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{width:42,height:42,borderRadius:11,background:"rgba(37,99,235,.1)",border:"1px solid rgba(37,99,235,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{f.icon}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:"var(--text)",marginBottom:3}}>{f.title}</div>
                      <div style={{color:"var(--muted)",fontSize:13,lineHeight:1.7}}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {TRUST.map((c,i)=>(
                <div key={i} className="card-h" style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,padding:"22px 18px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:c.c,opacity:.75}}/>
                  <div style={{fontSize:24,marginBottom:10}}>{c.icon}</div>
                  <div style={{fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:4}}>{c.title}</div>
                  <div style={{fontSize:11,color:"var(--muted)"}}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section style={{padding:"96px 5vw"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,marginBottom:44}}>
            <div>
              <div style={{fontSize:11,color:"var(--violet)",fontWeight:700,letterSpacing:"0.14em",marginBottom:12}}>CASE STUDIES</div>
              <h2 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,48px)",letterSpacing:"-0.03em",lineHeight:1.1}}>Proof in the work.</h2>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {["All","SaaS","Mobile","IT Services"].map(f=>(
                <button key={f} className="btn" onClick={()=>setFilter(f)} style={{padding:"8px 18px",borderRadius:8,fontSize:12,fontWeight:600,background:filter===f?"var(--blue)":"rgba(255,255,255,.05)",color:filter===f?"#fff":"var(--muted)",border:"1px solid "+(filter===f?"var(--blue)":"var(--border)")}}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:14}}>
            {filtered.map((p,i)=>(
              <div key={i} className="card-h" style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:15,padding:"30px 26px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:`linear-gradient(90deg,${p.c},transparent)`}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",color:p.c,background:`${p.c}14`,border:`1px solid ${p.c}28`,padding:"4px 9px",borderRadius:5}}>{p.cat}</span>
                  <span style={{color:"var(--dim)",fontSize:16}}>↗</span>
                </div>
                <h3 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:22,marginBottom:8,color:"var(--text)"}}>{p.title}</h3>
                <p style={{color:"var(--muted)",fontSize:13.5,lineHeight:1.7,marginBottom:22}}>{p.desc}</p>
                <div style={{paddingTop:16,borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",gap:9}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:p.c,boxShadow:`0 0 8px ${p.c}`}}/>
                  <span style={{fontSize:13,fontWeight:700,color:p.c}}>{p.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"96px 5vw",background:"var(--surface)"}}>
        <div style={{maxWidth:740,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:11,color:"var(--green)",fontWeight:700,letterSpacing:"0.14em",marginBottom:12}}>CLIENT STORIES</div>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(26px,3.5vw,46px)",letterSpacing:"-0.03em",marginBottom:52}}>Don't take our word for it.</h2>
          <div style={{position:"relative",minHeight:200}}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{position:i===0?"relative":"absolute",inset:0,opacity:tIdx===i?1:0,transform:tIdx===i?"translateY(0)":"translateY(14px)",transition:"all .75s cubic-bezier(.16,1,.3,1)",background:"var(--card)",border:"1px solid var(--border)",borderRadius:18,padding:"40px 36px",textAlign:"left"}}>
                <div style={{display:"flex",gap:3,marginBottom:16}}>{"★★★★★".split("").map((s,j)=><span key={j} style={{color:"#F59E0B",fontSize:15}}>{s}</span>)}</div>
                <p style={{fontSize:"clamp(14px,1.6vw,17px)",lineHeight:1.8,color:"#CBD5E1",fontStyle:"italic",marginBottom:24}}>"{t.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,var(--blue),var(--cyan))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff"}}>{t.av}</div>
                  <div>
                    <div style={{fontWeight:700,color:"var(--text)",fontSize:14}}>{t.name}</div>
                    <div style={{color:"var(--muted)",fontSize:12}}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:7,marginTop:26}}>
            {TESTIMONIALS.map((_,i)=><button key={i} className="btn" onClick={()=>setTIdx(i)} style={{width:i===tIdx?26:7,height:7,borderRadius:4,background:i===tIdx?"var(--blue)":"var(--border)",transition:"all .3s"}}/>)}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{padding:"96px 5vw"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontSize:11,color:"var(--cyan)",fontWeight:700,letterSpacing:"0.14em",marginBottom:12}}>HOW WE DELIVER</div>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,48px)",letterSpacing:"-0.03em"}}>Structured. Transparent. Fast.</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:0}}>
            {[
              {n:"01",title:"Discovery",desc:"Deep alignment on goals, users, technical constraints, and success metrics.",c:"#2563EB",icon:"🔍"},
              {n:"02",title:"Architecture",desc:"System design, tech stack decisions, security model, and sprint roadmap.",c:"#06B6D4",icon:"📐"},
              {n:"03",title:"Build",desc:"Weekly demos. Full-stack delivery. You see real progress every Friday.",c:"#10B981",icon:"🔧"},
              {n:"04",title:"Launch & Scale",desc:"CI/CD deployment, monitoring setup, and ongoing engineering support.",c:"#8B5CF6",icon:"🚀"},
            ].map((p,i)=>(
              <div key={i} style={{padding:"40px 28px",background:i%2?"var(--surface)":"var(--card)",border:"1px solid var(--border)",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:p.c,opacity:.8}}/>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:12,color:p.c,opacity:.5}}>#{p.n}</span>
                  <span style={{fontSize:22}}>{p.icon}</span>
                </div>
                <h3 style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:19,marginBottom:10,color:"var(--text)"}}>{p.title}</h3>
                <p style={{color:"var(--muted)",fontSize:13.5,lineHeight:1.75}}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{padding:"96px 5vw",background:"var(--surface)",position:"relative",overflow:"hidden"}}>
        <div className="blob" style={{width:450,height:450,bottom:"-15%",left:"-8%",background:"radial-gradient(circle,rgba(6,182,212,.12) 0%,transparent 65%)"}}/>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start",position:"relative",zIndex:1}}>
          <div>
            <div style={{fontSize:11,color:"var(--blue-lt)",fontWeight:700,letterSpacing:"0.14em",marginBottom:12}}>GET STARTED</div>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(28px,3.5vw,48px)",letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:16}}>Ready to build<br/>something great?</h2>
            <p style={{color:"var(--muted)",fontSize:15,lineHeight:1.8,marginBottom:40}}>Tell us about your project. We respond within 24 hours with an honest scope, timeline, and cost estimate — no pressure.</p>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {[
                {icon:"✉️",l:"Email",v:"hello@zygonich.io"},
                {icon:"📞",l:"Phone",v:"+91 98765 43210"},
                {icon:"📍",l:"Location",v:"Delhi, India · Remote-first globally"},
                {icon:"🕐",l:"Response time",v:"Under 24 hours, guaranteed"},
              ].map((c,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:"rgba(37,99,235,.1)",border:"1px solid rgba(37,99,235,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{c.icon}</div>
                  <div>
                    <div style={{fontSize:10,color:"var(--dim)",fontWeight:700,letterSpacing:"0.08em"}}>{c.l}</div>
                    <div style={{color:"var(--text)",fontSize:13.5,fontWeight:500,marginTop:2}}>{c.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:20,padding:"40px 36px",boxShadow:"0 24px 64px rgba(0,0,0,.4)"}}>
            {sent?(
              <div style={{textAlign:"center",padding:"48px 0"}}>
                <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(16,185,129,.12)",border:"2px solid var(--green)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 18px"}}>✓</div>
                <h3 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:22,color:"var(--green)",marginBottom:10}}>Message received!</h3>
                <p style={{color:"var(--muted)",fontSize:14}}>Expect a response within 24 hours from our team.</p>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{marginBottom:6}}>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:19,color:"var(--text)",marginBottom:4}}>Send us a message</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>Free consultation · No commitment</div>
                </div>
                {[{k:"name",l:"Full Name",t:"text",p:"Jane Smith"},{k:"email",l:"Work Email",t:"email",p:"jane@company.com"}].map(f=>(
                  <div key={f.k}>
                    <label style={{fontSize:11,color:"var(--muted)",fontWeight:600,letterSpacing:"0.06em",display:"block",marginBottom:6}}>{f.l}</label>
                    <input type={f.t} placeholder={f.p} value={form[f.k]} onChange={e=>setForm(d=>({...d,[f.k]:e.target.value}))}
                      style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,padding:"12px 14px",color:"var(--text)",fontSize:13.5,transition:"border-color .2s"}}
                      onFocus={e=>e.target.style.borderColor="var(--blue)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
                  </div>
                ))}
                <div>
                  <label style={{fontSize:11,color:"var(--muted)",fontWeight:600,letterSpacing:"0.06em",display:"block",marginBottom:6}}>Service Needed</label>
                  <select value={form.service} onChange={e=>setForm(d=>({...d,service:e.target.value}))}
                    style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,padding:"12px 14px",color:form.service?"var(--text)":"var(--dim)",fontSize:13.5}}>
                    <option value="">Select a service...</option>
                    {SERVICES.map(s=><option key={s.title} value={s.title}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:11,color:"var(--muted)",fontWeight:600,letterSpacing:"0.06em",display:"block",marginBottom:6}}>Project Details</label>
                  <textarea rows={4} placeholder="What are you building? Timeline? Budget range?" value={form.message} onChange={e=>setForm(d=>({...d,message:e.target.value}))}
                    style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,padding:"12px 14px",color:"var(--text)",fontSize:13.5,resize:"vertical",transition:"border-color .2s"}}
                    onFocus={e=>e.target.style.borderColor="var(--blue)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
                </div>
                <button className="btn" onClick={handleSend} style={{background:"linear-gradient(135deg,#2563EB,#1d4ed8)",color:"#fff",padding:"14px 24px",borderRadius:9,fontWeight:700,fontSize:14,boxShadow:"0 8px 24px rgba(37,99,235,.4)",marginTop:2}}>
                  Send Message →
                </button>
                <p style={{fontSize:10,color:"var(--dim)",textAlign:"center"}}>🔒 Your information is encrypted and never shared.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#060a14",borderTop:"1px solid var(--border)",padding:"60px 5vw 32px"}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:44,marginBottom:52}}>
          <div style={{maxWidth:270}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#2563EB,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16,color:"#fff"}}>Z</div>
              <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:19,color:"var(--text)"}}>Zygonich</span>
            </div>
            <p style={{color:"var(--dim)",fontSize:13,lineHeight:1.8,marginBottom:18}}>Full-service technology studio. SaaS · Mobile · IT Services. Delhi-based, globally delivered.</p>
            <div style={{display:"flex",gap:8}}>
              {["in","gh","tw","be"].map(s=>(
                <div key={s} style={{width:34,height:34,borderRadius:8,background:"var(--card)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"var(--muted)",cursor:"pointer",fontWeight:700,transition:"all .2s"}}
                  onMouseOver={e=>{e.currentTarget.style.background="var(--blue)";e.currentTarget.style.color="#fff";}} onMouseOut={e=>{e.currentTarget.style.background="var(--card)";e.currentTarget.style.color="var(--muted)";}}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:52,flexWrap:"wrap"}}>
            {[
              {h:"Services",links:["SaaS Development","Mobile Apps","IT Infrastructure","AI & Automation","Cybersecurity","Data Analytics"]},
              {h:"Company",links:["About Us","Portfolio","Careers","Blog","Press Kit"]},
              {h:"Legal",links:["Privacy Policy","Terms of Service","Security","Cookie Policy"]},
            ].map(col=>(
              <div key={col.h}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:"var(--dim)",marginBottom:16}}>{col.h}</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {col.links.map(l=><a key={l} href="#" style={{color:"var(--muted)",fontSize:13,transition:"color .2s"}}
                    onMouseOver={e=>e.target.style.color="var(--blue-lt)"} onMouseOut={e=>e.target.style.color="var(--muted)"}>{l}</a>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{borderTop:"1px solid var(--border)",paddingTop:22,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,alignItems:"center"}}>
          <span style={{color:"var(--dim)",fontSize:11}}>© 2026 Zygonich Technologies Pvt. Ltd. All rights reserved.</span>
          <div style={{display:"flex",gap:10}}>
            {["SOC 2","ISO 27001","GDPR"].map(b=><span key={b} style={{fontSize:9,fontWeight:700,color:"var(--dim)",border:"1px solid var(--border)",padding:"3px 8px",borderRadius:4,letterSpacing:"0.06em"}}>{b}</span>)}
          </div>
        </div>
      </footer>

      <style>{`
        @media(max-width:900px){
          nav>div:nth-child(2){display:none!important;}
          nav>button:last-child{display:block!important;}
        }
        @media(max-width:768px){
          section>div[style*="grid-template-columns: 1fr 420px"],
          section>div>div[style*="grid-template-columns: 1fr 1fr"],
          div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important;}
          .phone{display:none!important;}
        }
      `}</style>
    </div>
  );
}