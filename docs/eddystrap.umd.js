(function(n,r){typeof exports=="object"&&typeof module<"u"?r(exports):typeof define=="function"&&define.amd?define(["exports"],r):(n=typeof globalThis<"u"?globalThis:n||self,r(n.Eddystrap={}))})(this,function(n){"use strict";class r{constructor(t={}){this.commitment=0,this.isActive=!1,this.startTime=null,this.animationFrame=null,this.options={color:"#6366f1",size:200,activationTime:500,onActivate:null,label:"Eddy",sublabel:"Touch & hold",...t},this.element=document.createElement("div"),this.progressCircle=document.createElementNS("http://www.w3.org/2000/svg","circle"),this.create()}create(){this.element.style.cssText=`
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
        `,this.element.appendChild(i),setTimeout(()=>i.remove(),600)},t*50);this.end()}createRipple(t){const e=this.element.getBoundingClientRect();let i,s;if("touches"in t&&t.touches[0])i=(t.touches[0].clientX-e.left)/e.width*100,s=(t.touches[0].clientY-e.top)/e.height*100;else if("clientX"in t)i=(t.clientX-e.left)/e.width*100,s=(t.clientY-e.top)/e.height*100;else return;const o=document.createElement("div");o.style.cssText=`
      position: absolute;
      left: ${i}%;
      top: ${s}%;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, ${this.options.color}80, transparent);
      animation: flowRipple 0.6s ease-out;
    `,this.element.appendChild(o),setTimeout(()=>o.remove(),600)}updateStyle(){const t=this.commitment/100*25,e=.5+this.commitment/100*.5;this.element.style.background=`radial-gradient(circle, ${this.options.color}50, ${this.options.color}20)`,this.element.style.border=`2px solid ${this.options.color}${Math.round(e*255).toString(16).padStart(2,"0")}`,this.element.style.boxShadow=`
      0 0 ${t}px ${this.options.color}90,
      inset 0 0 ${t*.5}px ${this.options.color}50
    `;const i=this.options.size*.45,s=2*Math.PI*i,o=`${this.commitment/100*s}, ${s}`;this.progressCircle.style.strokeDasharray=o,this.progressCircle.style.stroke=this.options.color,this.progressCircle.style.filter=`drop-shadow(0 0 ${t*.5}px ${this.options.color})`}mount(t){const e=typeof t=="string"?document.querySelector(t):t;if(!e)throw new Error(`Target element not found: ${t}`);return e.appendChild(this.element),this}destroy(){return this.animationFrame!==null&&cancelAnimationFrame(this.animationFrame),this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this}}class c{constructor(t={}){this.options={color:"#6366f1",content:"",onDrain:null,...t},this.element=document.createElement("div"),this.create()}create(){this.element.className="flow-pool",this.element.style.cssText=`
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
    `,this.surface.appendChild(e),this.ripples.push(e),setTimeout(()=>{e.remove();const o=this.ripples.indexOf(e);o>-1&&this.ripples.splice(o,1)},800)}getValue(){return this.input.value}setValue(t){return this.input.value=t,this.handleInput(),this}clear(){return this.input.value="",this.handleInput(),this}focus(){return this.input.focus(),this}mount(t){const e=typeof t=="string"?document.querySelector(t):t;if(!e)throw new Error(`Target element not found: ${t}`);return e.appendChild(this.element),this}destroy(){return this.ripples.forEach(t=>t.remove()),this.ripples=[],this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this}}class p{constructor(t={}){this.isDragging=!1,this.animationFrame=null,this.phase=0,this.options={color:"#6366f1",min:0,max:100,value:50,step:1,label:"Wave",onChange:null,...t},this.options.value=Math.max(this.options.min,Math.min(this.options.max,this.options.value)),this.element=document.createElement("div"),this.track=document.createElement("div"),this.handle=document.createElement("div"),this.waveCanvas=document.createElement("canvas"),this.valueDisplay=document.createElement("div"),this.create(),this.startAnimation()}create(){if(this.element.style.cssText=`
      position: relative;
      width: 100%;
      max-width: 400px;
      padding: 1rem 0;
    `,this.options.label){const t=document.createElement("div");t.textContent=this.options.label,t.style.cssText=`
        font-size: 0.9rem;
        opacity: 0.8;
        margin-bottom: 0.5rem;
        color: #ffffff;
      `,this.element.appendChild(t)}this.waveCanvas.style.cssText=`
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 60px;
      transform: translateY(-50%);
      pointer-events: none;
      opacity: 0.3;
    `,this.element.appendChild(this.waveCanvas),setTimeout(()=>{const t=this.waveCanvas.getBoundingClientRect();this.waveCanvas.width=t.width,this.waveCanvas.height=60},0),this.track.style.cssText=`
      position: relative;
      width: 100%;
      height: 8px;
      background: ${this.options.color}20;
      border-radius: 4px;
      cursor: pointer;
      margin: 1rem 0;
    `,this.handle.style.cssText=`
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      background: radial-gradient(circle, ${this.options.color}, ${this.options.color}cc);
      border: 2px solid ${this.options.color};
      border-radius: 50%;
      cursor: grab;
      box-shadow: 0 0 10px ${this.options.color}80;
      transition: all 0.2s ease;
    `,this.track.appendChild(this.handle),this.element.appendChild(this.track),this.valueDisplay.style.cssText=`
      text-align: center;
      font-size: 1.2rem;
      font-weight: 500;
      color: ${this.options.color};
      margin-top: 0.5rem;
    `,this.element.appendChild(this.valueDisplay),this.updatePosition(),this.attachEvents()}attachEvents(){const t=e=>{const i=this.track.getBoundingClientRect(),s=Math.max(0,Math.min(1,(e-i.left)/i.width)),o=this.options.max-this.options.min;let l=this.options.min+s*o;l=Math.round(l/this.options.step)*this.options.step,this.setValue(l)};this.handle.addEventListener("mousedown",()=>{this.isDragging=!0,this.handle.style.cursor="grabbing",this.handle.style.transform="translate(-50%, -50%) scale(1.2)"}),document.addEventListener("mousemove",e=>{this.isDragging&&t(e.clientX)}),document.addEventListener("mouseup",()=>{this.isDragging&&(this.isDragging=!1,this.handle.style.cursor="grab",this.handle.style.transform="translate(-50%, -50%) scale(1)")}),this.handle.addEventListener("touchstart",e=>{e.preventDefault(),this.isDragging=!0,this.handle.style.transform="translate(-50%, -50%) scale(1.2)"},{passive:!1}),document.addEventListener("touchmove",e=>{this.isDragging&&e.touches[0]&&t(e.touches[0].clientX)}),document.addEventListener("touchend",()=>{this.isDragging&&(this.isDragging=!1,this.handle.style.transform="translate(-50%, -50%) scale(1)")}),this.track.addEventListener("click",e=>{e.target===this.track&&t(e.clientX)})}updatePosition(){const t=(this.options.value-this.options.min)/(this.options.max-this.options.min);this.handle.style.left=`${t*100}%`,this.valueDisplay.textContent=this.options.value.toString()}startAnimation(){const t=()=>{this.drawWave(),this.phase+=.05,this.animationFrame=requestAnimationFrame(t)};t()}drawWave(){const t=this.waveCanvas.getContext("2d");if(!t)return;const e=this.waveCanvas.width,i=this.waveCanvas.height,s=i/2;t.clearRect(0,0,e,i);const l=10+(this.options.value-this.options.min)/(this.options.max-this.options.min)*20;t.beginPath(),t.strokeStyle=this.options.color,t.lineWidth=2;for(let a=0;a<e;a++){const u=s+Math.sin((a/50+this.phase)*Math.PI)*l;a===0?t.moveTo(a,u):t.lineTo(a,u)}t.stroke()}getValue(){return this.options.value}setValue(t){return this.options.value=Math.max(this.options.min,Math.min(this.options.max,t)),this.updatePosition(),this.options.onChange&&this.options.onChange(this.options.value),this}mount(t){const e=typeof t=="string"?document.querySelector(t):t;if(!e)throw new Error(`Target element not found: ${t}`);return e.appendChild(this.element),this}destroy(){return this.animationFrame!==null&&cancelAnimationFrame(this.animationFrame),this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this}}class m{constructor(t={}){this.waves=[],this.options={color:"#6366f1",size:60,checked:!1,label:"",onToggle:null,...t},this.element=document.createElement("div"),this.container=document.createElement("div"),this.orb=document.createElement("div"),this.create()}create(){if(this.element.style.cssText=`
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
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `,this.orb.style.cssText=`
      position: absolute;
      top: 50%;
      width: ${this.options.size-8}px;
      height: ${this.options.size-8}px;
      background: radial-gradient(circle, ${this.options.color}ee, ${this.options.color}aa);
      border-radius: 50%;
      transform: translateY(-50%);
      box-shadow: 0 0 15px ${this.options.color}80;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
    `,this.container.appendChild(this.orb),this.element.appendChild(this.container),this.options.label){const t=document.createElement("span");t.textContent=this.options.label,t.style.cssText=`
        font-size: 1rem;
        color: #ffffff;
      `,this.element.appendChild(t)}this.updateState(),this.attachEvents()}attachEvents(){this.element.addEventListener("click",()=>{this.toggle()})}updateState(){this.options.checked?(this.orb.style.left=`calc(100% - ${this.options.size-4}px)`,this.container.style.background=`${this.options.color}40`,this.container.style.borderColor=`${this.options.color}`,this.createTideWaves()):(this.orb.style.left="4px",this.container.style.background=`${this.options.color}15`,this.container.style.borderColor=`${this.options.color}40`,this.clearWaves())}createTideWaves(){this.clearWaves();for(let t=0;t<3;t++){const e=document.createElement("div");e.style.cssText=`
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: ${30+t*10}%;
        background: ${this.options.color}${(20-t*5).toString(16).padStart(2,"0")};
        opacity: ${.5-t*.1};
        animation: tideRise 1s ease-out forwards;
        border-radius: 50% 50% 0 0;
      `,this.container.insertBefore(e,this.orb),this.waves.push(e)}if(!document.getElementById("tide-rise-keyframes")){const t=document.createElement("style");t.id="tide-rise-keyframes",t.textContent=`
        @keyframes tideRise {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes tideFall {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }
      `,document.head.appendChild(t)}}clearWaves(){this.waves.forEach(t=>{t.style.animation="tideFall 0.6s ease-out forwards",setTimeout(()=>t.remove(),600)}),this.waves=[]}toggle(){return this.options.checked=!this.options.checked,this.updateState(),this.options.onToggle&&this.options.onToggle(this.options.checked),this}setChecked(t){return this.options.checked!==t&&(this.options.checked=t,this.updateState(),this.options.onToggle&&this.options.onToggle(this.options.checked)),this}isChecked(){return this.options.checked}mount(t){const e=typeof t=="string"?document.querySelector(t):t;if(!e)throw new Error(`Target element not found: ${t}`);return e.appendChild(this.element),this}destroy(){return this.clearWaves(),this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this}}const f={Eddy:r,Pool:c,Stream:d,Wave:p,Tide:m};n.Eddy=r,n.Pool=c,n.Stream=d,n.Tide=m,n.Wave=p,n.default=f,Object.defineProperties(n,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
