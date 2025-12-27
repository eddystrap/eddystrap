(function(o,l){typeof exports=="object"&&typeof module<"u"?l(exports):typeof define=="function"&&define.amd?define(["exports"],l):(o=typeof globalThis<"u"?globalThis:o||self,l(o.Eddystrap={}))})(this,function(o){"use strict";class l{constructor(t={}){this.commitment=0,this.isActive=!1,this.startTime=null,this.animationFrame=null,this.options={color:"#6366f1",size:200,activationTime:500,onActivate:null,label:"Eddy",sublabel:"Touch & hold",...t},this.element=document.createElement("div"),this.progressCircle=document.createElementNS("http://www.w3.org/2000/svg","circle"),this.create()}create(){this.element.style.cssText=`
      position: relative;
      width: ${this.options.size}px;
      height: ${this.options.size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    `;const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.style.cssText=`
      position: absolute;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      pointer-events: none;
    `,this.progressCircle.setAttribute("cx","50%"),this.progressCircle.setAttribute("cy","50%"),this.progressCircle.setAttribute("r","45%"),this.progressCircle.setAttribute("fill","none"),this.progressCircle.setAttribute("stroke-width","3"),this.progressCircle.style.transition="stroke-dasharray 0.05s linear",t.appendChild(this.progressCircle),this.element.appendChild(t);const e=document.createElement("div");e.style.cssText=`
      position: relative;
      z-index: 10;
      text-align: center;
      color: #ffffff;
      font-size: 1.3rem;
      font-weight: 300;
      letter-spacing: 0.05em;
      pointer-events: none;
    `,e.innerHTML=`
      ${this.options.label}
      <small style="display: block; font-size: 0.8rem; opacity: 0.7; margin-top: 0.5rem;">
        ${this.options.sublabel}
      </small>
    `,this.element.appendChild(e),this.attachEvents(),this.updateStyle()}attachEvents(){this.element.addEventListener("mousedown",t=>this.start(t)),this.element.addEventListener("mouseup",()=>this.end()),this.element.addEventListener("mouseleave",()=>this.end()),this.element.addEventListener("touchstart",t=>{t.preventDefault(),this.start(t)},{passive:!1}),this.element.addEventListener("touchend",t=>{t.preventDefault(),this.end()},{passive:!1}),this.element.addEventListener("touchcancel",()=>this.end())}start(t){this.startTime=Date.now(),this.isActive=!0,this.element.style.transform="scale(1.1)",this.animate(),this.createRipple(t)}animate(){if(!this.isActive||this.startTime===null)return;const t=Date.now()-this.startTime;if(this.commitment=Math.min(t/this.options.activationTime*100,100),this.updateStyle(),this.commitment>=100){this.activate();return}this.animationFrame=requestAnimationFrame(()=>this.animate())}end(){this.isActive=!1,this.commitment=0,this.startTime=null,this.element.style.transform="scale(1)",this.updateStyle(),this.animationFrame!==null&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null)}activate(){this.options.onActivate&&this.options.onActivate();for(let t=0;t<6;t++)setTimeout(()=>{const e=t/6*360,i=document.createElement("div");i.style.cssText=`
          position: absolute;
          left: 50%;
          top: 50%;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, ${this.options.color}70, transparent);
          transform: translate(-50%, -50%) rotate(${e}deg) translateY(-40px);
          animation: flowRipple 0.6s ease-out;
        `,this.element.appendChild(i),setTimeout(()=>i.remove(),600)},t*50);this.end()}createRipple(t){const e=this.element.getBoundingClientRect();let i,s;if("touches"in t&&t.touches[0])i=(t.touches[0].clientX-e.left)/e.width*100,s=(t.touches[0].clientY-e.top)/e.height*100;else if("clientX"in t)i=(t.clientX-e.left)/e.width*100,s=(t.clientY-e.top)/e.height*100;else return;const n=document.createElement("div");n.style.cssText=`
      position: absolute;
      left: ${i}%;
      top: ${s}%;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, ${this.options.color}80, transparent);
      animation: flowRipple 0.6s ease-out;
    `,this.element.appendChild(n),setTimeout(()=>n.remove(),600)}updateStyle(){const t=this.commitment/100*25,e=.5+this.commitment/100*.5;this.element.style.background=`radial-gradient(circle, ${this.options.color}50, ${this.options.color}20)`,this.element.style.border=`2px solid ${this.options.color}${Math.round(e*255).toString(16).padStart(2,"0")}`,this.element.style.boxShadow=`
      0 0 ${t}px ${this.options.color}90,
      inset 0 0 ${t*.5}px ${this.options.color}50
    `;const i=this.options.size*.45,s=2*Math.PI*i,n=`${this.commitment/100*s}, ${s}`;this.progressCircle.style.strokeDasharray=n,this.progressCircle.style.stroke=this.options.color,this.progressCircle.style.filter=`drop-shadow(0 0 ${t*.5}px ${this.options.color})`}mount(t){const e=typeof t=="string"?document.querySelector(t):t;if(!e)throw new Error(`Target element not found: ${t}`);return e.appendChild(this.element),this}destroy(){return this.animationFrame!==null&&cancelAnimationFrame(this.animationFrame),this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this}}class p{constructor(t={}){this.options={color:"#6366f1",content:"",onDrain:null,...t},this.element=document.createElement("div"),this.create()}create(){this.element.className="flow-pool",this.element.style.cssText=`
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at center, rgba(10, 14, 39, 0.95), rgba(0, 0, 0, 0.9));
      backdrop-filter: blur(20px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: flowPoolRise 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    `;const t=document.createElement("div");t.className="flow-pool-surface",t.style.cssText=`
      position: relative;
      max-width: 500px;
      width: 90%;
      padding: 3rem;
      background: linear-gradient(135deg,
        ${this.options.color}26 0%,
        ${this.options.color}1a 50%,
        ${this.options.color}26 100%);
      border: 1px solid ${this.options.color}4d;
      border-radius: 32px;
      color: #ffffff;
      animation: flowRippleIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 0 40px ${this.options.color}33,
        inset 0 0 30px ${this.options.color}1a;
    `;const e=document.createElement("div");e.className="flow-pool-content",e.innerHTML=this.options.content,t.appendChild(e);const i=document.createElement("button");i.innerHTML="<span>Let it Drain</span>",i.style.cssText=`
      width: 100%;
      height: 60px;
      border-radius: 16px;
      background: ${this.options.color}26;
      border: 1px solid ${this.options.color}4d;
      color: #ffffff;
      font-family: inherit;
      font-size: 1.1rem;
      cursor: pointer;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      margin-top: 2rem;
      transition: all 0.2s ease;
    `,i.addEventListener("mouseenter",()=>{i.style.background=`${this.options.color}40`,i.style.borderColor=`${this.options.color}80`}),i.addEventListener("mouseleave",()=>{i.style.background=`${this.options.color}26`,i.style.borderColor=`${this.options.color}4d`}),i.addEventListener("click",()=>this.drain()),t.appendChild(i),this.element.appendChild(t),this.element.addEventListener("click",s=>{s.target===this.element&&this.drain()})}enter(){return this.element.style.display="flex",this}drain(){return this.element.style.display="none",this.options.onDrain&&this.options.onDrain(),this}mount(t){const e=typeof t=="string"?document.querySelector(t):t;if(!e)throw new Error(`Target element not found: ${t}`);return e.appendChild(this.element),this}destroy(){return this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this}}class d{constructor(t={}){this.ripples=[],this.options={color:"#6366f1",placeholder:"Let your thoughts flow...",multiline:!1,maxLength:500,onFlow:null,onChange:null,...t},this.element=document.createElement("div"),this.input=this.options.multiline?document.createElement("textarea"):document.createElement("input"),this.surface=document.createElement("div"),this.create()}create(){this.element.style.cssText=`
      position: relative;
      width: 100%;
      max-width: 500px;
    `,this.surface.style.cssText=`
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(135deg,
        ${this.options.color}0d 0%,
        ${this.options.color}05 50%,
        ${this.options.color}0d 100%);
      border: 1px solid ${this.options.color}33;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    `,this.element.appendChild(this.surface),this.input.placeholder=this.options.placeholder,this.input instanceof HTMLTextAreaElement?(this.input.rows=4,this.input.style.resize="none"):this.input.type="text",this.input.maxLength=this.options.maxLength,this.input.style.cssText=`
      position: relative;
      width: 100%;
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-family: inherit;
      font-size: 1rem;
      line-height: 1.6;
      z-index: 10;
    `,this.input.addEventListener("input",()=>this.handleInput()),this.input.addEventListener("focus",()=>this.handleFocus()),this.input.addEventListener("blur",()=>this.handleBlur()),this.input.addEventListener("keypress",t=>this.createRipple(t)),this.element.appendChild(this.input)}handleInput(){const t=this.input.value;this.options.onChange&&this.options.onChange(t);const e=Math.min(t.length/this.options.maxLength*100,100),i=e/100*20;this.surface.style.background=`linear-gradient(135deg,
      ${this.options.color}${Math.round(e/100*26).toString(16).padStart(2,"0")} 0%,
      ${this.options.color}0d 50%,
      ${this.options.color}${Math.round(e/100*26).toString(16).padStart(2,"0")} 100%)`,this.surface.style.boxShadow=`
      0 0 ${i}px ${this.options.color}40,
      inset 0 0 ${i*.5}px ${this.options.color}20
    `}handleFocus(){this.surface.style.borderColor=`${this.options.color}80`,this.surface.style.boxShadow=`
      0 0 20px ${this.options.color}40,
      inset 0 0 10px ${this.options.color}20
    `}handleBlur(){this.surface.style.borderColor=`${this.options.color}33`,this.options.onFlow&&this.input.value&&this.options.onFlow(this.input.value)}createRipple(t){const e=document.createElement("div"),i=Math.random()*100,s=Math.random()*100;e.style.cssText=`
      position: absolute;
      left: ${i}%;
      top: ${s}%;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, ${this.options.color}60, transparent);
      animation: flowRipple 0.8s ease-out;
    `,this.surface.appendChild(e),this.ripples.push(e),setTimeout(()=>{e.remove();const n=this.ripples.indexOf(e);n>-1&&this.ripples.splice(n,1)},800)}getValue(){return this.input.value}setValue(t){return this.input.value=t,this.handleInput(),this}clear(){return this.input.value="",this.handleInput(),this}focus(){return this.input.focus(),this}mount(t){const e=typeof t=="string"?document.querySelector(t):t;if(!e)throw new Error(`Target element not found: ${t}`);return e.appendChild(this.element),this}destroy(){return this.ripples.forEach(t=>t.remove()),this.ripples=[],this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this}}class m{constructor(t={}){this.isPressed=!1,this.animationFrame=null,this.phase=0,this.lastUpdate=Date.now(),this.options={color:"#6366f1",min:0,max:100,value:50,label:"Wave",onChange:null,growthRate:40,decayRate:5,...t},this.options.value=Math.max(this.options.min,Math.min(this.options.max,this.options.value)),this.element=document.createElement("div"),this.waveCanvas=document.createElement("canvas"),this.valueDisplay=document.createElement("div"),this.pressArea=document.createElement("div"),this.create(),this.startAnimation()}create(){if(this.element.style.cssText=`
      position: relative;
      width: 100%;
      max-width: 400px;
      padding: 1rem 0;
      user-select: none;
    `,this.options.label){const i=document.createElement("div");i.textContent=this.options.label,i.style.cssText=`
        font-size: 0.9rem;
        opacity: 0.8;
        margin-bottom: 1rem;
        color: #ffffff;
        text-align: center;
      `,this.element.appendChild(i)}const t=document.createElement("div");t.style.cssText=`
      position: relative;
      width: 100%;
      height: 120px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid ${this.options.color}30;
    `,this.waveCanvas.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `,t.appendChild(this.waveCanvas),this.pressArea.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 10;
    `,t.appendChild(this.pressArea);const e=document.createElement("div");e.textContent="Press & hold to grow • Release to set",e.style.cssText=`
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      opacity: 0.5;
      color: #ffffff;
      pointer-events: none;
      z-index: 5;
    `,t.appendChild(e),this.element.appendChild(t),this.valueDisplay.style.cssText=`
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      color: ${this.options.color};
      margin-top: 1rem;
    `,this.element.appendChild(this.valueDisplay),setTimeout(()=>{const i=this.waveCanvas.getBoundingClientRect();this.waveCanvas.width=i.width,this.waveCanvas.height=i.height},0),this.updateDisplay(),this.attachEvents()}attachEvents(){this.pressArea.addEventListener("mousedown",()=>{this.isPressed=!0,this.pressArea.style.cursor="grabbing"}),document.addEventListener("mouseup",()=>{this.isPressed&&(this.isPressed=!1,this.pressArea.style.cursor="pointer")}),this.pressArea.addEventListener("touchstart",t=>{t.preventDefault(),this.isPressed=!0},{passive:!1}),document.addEventListener("touchend",()=>{this.isPressed&&(this.isPressed=!1)})}startAnimation(){const t=()=>{const e=Date.now(),i=(e-this.lastUpdate)/1e3;if(this.lastUpdate=e,this.isPressed){const s=Math.min(this.options.max,this.options.value+this.options.growthRate*i);s!==this.options.value&&this.setValue(s)}else{const s=Math.max(this.options.min,this.options.value-this.options.decayRate*i);s!==this.options.value&&this.setValue(s,!1)}this.drawWave(),this.phase+=this.isPressed?.15:.05,this.animationFrame=requestAnimationFrame(t)};t()}drawWave(){const t=this.waveCanvas.getContext("2d");if(!t)return;const e=this.waveCanvas.width,i=this.waveCanvas.height,s=i/2;t.clearRect(0,0,e,i);const c=5+(this.options.value-this.options.min)/(this.options.max-this.options.min)*(i*.4);[{opacity:.3,offset:0,thickness:3},{opacity:.2,offset:.5,thickness:2},{opacity:.15,offset:1,thickness:1.5}].forEach(a=>{t.beginPath(),t.strokeStyle=this.options.color,t.globalAlpha=a.opacity*(this.isPressed?1.5:1),t.lineWidth=a.thickness;for(let r=0;r<e;r++){const f=s+Math.sin((r/40+this.phase+a.offset)*Math.PI)*c+Math.sin((r/20+this.phase*1.5)*Math.PI)*(c*.3);r===0?t.moveTo(r,f):t.lineTo(r,f)}t.stroke()}),t.globalAlpha=.1,t.fillStyle=this.options.color,t.beginPath(),t.moveTo(0,i);for(let a=0;a<e;a++){const r=s+Math.sin((a/40+this.phase)*Math.PI)*c;t.lineTo(a,r)}t.lineTo(e,i),t.closePath(),t.fill(),t.globalAlpha=1}updateDisplay(){this.valueDisplay.textContent=Math.round(this.options.value).toString()}getValue(){return this.options.value}setValue(t,e=!0){return this.options.value=Math.max(this.options.min,Math.min(this.options.max,t)),this.updateDisplay(),e&&this.options.onChange&&this.options.onChange(this.options.value),this}mount(t){const e=typeof t=="string"?document.querySelector(t):t;if(!e)throw new Error(`Target element not found: ${t}`);return e.appendChild(this.element),this}destroy(){return this.animationFrame!==null&&cancelAnimationFrame(this.animationFrame),this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this}}class u{constructor(t={}){this.waves=[],this.options={color:"#6366f1",size:60,checked:!1,label:"",onToggle:null,...t},this.element=document.createElement("div"),this.container=document.createElement("div"),this.orb=document.createElement("div"),this.create()}create(){if(this.element.style.cssText=`
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      user-select: none;
    `,this.container.style.cssText=`
      position: relative;
      width: ${this.options.size*1.8}px;
      height: ${this.options.size}px;
      background: ${this.options.color}15;
      border: 2px solid ${this.options.color}40;
      border-radius: ${this.options.size/2}px;
      overflow: hidden;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `,this.orb.style.cssText=`
      position: absolute;
      top: 50%;
      width: ${this.options.size-8}px;
      height: ${this.options.size-8}px;
      background: radial-gradient(circle, ${this.options.color}ee, ${this.options.color}aa);
      border-radius: 50%;
      transform: translateY(-50%);
      box-shadow: 0 0 15px ${this.options.color}80;
      transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      z-index: 10;
    `,this.container.appendChild(this.orb),this.element.appendChild(this.container),this.options.label){const t=document.createElement("span");t.textContent=this.options.label,t.style.cssText=`
        font-size: 1rem;
        color: #ffffff;
      `,this.element.appendChild(t)}this.updateState(),this.attachEvents()}attachEvents(){this.element.addEventListener("click",()=>{this.toggle()})}updateState(){this.options.checked?(this.orb.style.left=`calc(100% - ${this.options.size-4}px)`,this.container.style.background=`${this.options.color}40`,this.container.style.borderColor=`${this.options.color}`,this.createTideWaves()):(this.orb.style.left="4px",this.container.style.background=`${this.options.color}15`,this.container.style.borderColor=`${this.options.color}40`,this.clearWaves())}createTideWaves(){this.clearWaves();for(let t=0;t<4;t++){const e=document.createElement("div"),i=t*.1;e.style.cssText=`
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: ${25+t*12}%;
        background: ${this.options.color}${(20-t*4).toString(16).padStart(2,"0")};
        opacity: ${.6-t*.12};
        animation: tideRise 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i}s forwards;
        border-radius: 50% 50% 0 0;
      `,this.container.insertBefore(e,this.orb),this.waves.push(e)}if(!document.getElementById("tide-rise-keyframes")){const t=document.createElement("style");t.id="tide-rise-keyframes",t.textContent=`
        @keyframes tideRise {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes tideFall {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      `,document.head.appendChild(t)}}clearWaves(){this.waves.forEach((t,e)=>{const i=e*.08;t.style.animation=`tideFall 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i}s forwards`,setTimeout(()=>t.remove(),800+i*1e3)}),this.waves=[]}toggle(){return this.options.checked=!this.options.checked,this.updateState(),this.options.onToggle&&this.options.onToggle(this.options.checked),this}setChecked(t){return this.options.checked!==t&&(this.options.checked=t,this.updateState(),this.options.onToggle&&this.options.onToggle(this.options.checked)),this}isChecked(){return this.options.checked}mount(t){const e=typeof t=="string"?document.querySelector(t):t;if(!e)throw new Error(`Target element not found: ${t}`);return e.appendChild(this.element),this}destroy(){return this.clearWaves(),this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this}}const v={Eddy:l,Pool:p,Stream:d,Wave:m,Tide:u};o.Eddy=l,o.Pool=p,o.Stream=d,o.Tide=u,o.Wave=m,o.default=v,Object.defineProperties(o,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
