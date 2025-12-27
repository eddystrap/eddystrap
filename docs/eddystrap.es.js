class r {
  constructor(t = {}) {
    this.commitment = 0, this.isActive = !1, this.startTime = null, this.animationFrame = null, this.options = {
      color: "#6366f1",
      size: 200,
      activationTime: 500,
      onActivate: null,
      label: "Eddy",
      sublabel: "Touch & hold",
      ...t
    }, this.element = document.createElement("div"), this.progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle"), this.create();
  }
  create() {
    this.element.style.cssText = `
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
    `;
    const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    t.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      pointer-events: none;
    `, this.progressCircle.setAttribute("cx", "50%"), this.progressCircle.setAttribute("cy", "50%"), this.progressCircle.setAttribute("r", "45%"), this.progressCircle.setAttribute("fill", "none"), this.progressCircle.setAttribute("stroke-width", "3"), this.progressCircle.style.transition = "stroke-dasharray 0.05s linear", t.appendChild(this.progressCircle), this.element.appendChild(t);
    const e = document.createElement("div");
    e.style.cssText = `
      position: relative;
      z-index: 10;
      text-align: center;
      color: #ffffff;
      font-size: 1.3rem;
      font-weight: 300;
      letter-spacing: 0.05em;
      pointer-events: none;
    `, e.innerHTML = `
      ${this.options.label}
      <small style="display: block; font-size: 0.8rem; opacity: 0.7; margin-top: 0.5rem;">
        ${this.options.sublabel}
      </small>
    `, this.element.appendChild(e), this.attachEvents(), this.updateStyle();
  }
  attachEvents() {
    this.element.addEventListener("mousedown", (t) => this.start(t)), this.element.addEventListener("mouseup", () => this.end()), this.element.addEventListener("mouseleave", () => this.end()), this.element.addEventListener("touchstart", (t) => {
      t.preventDefault(), this.start(t);
    }, { passive: !1 }), this.element.addEventListener("touchend", (t) => {
      t.preventDefault(), this.end();
    }, { passive: !1 }), this.element.addEventListener("touchcancel", () => this.end());
  }
  start(t) {
    this.startTime = Date.now(), this.isActive = !0, this.element.style.transform = "scale(1.1)", this.animate(), this.createRipple(t);
  }
  animate() {
    if (!this.isActive || this.startTime === null) return;
    const t = Date.now() - this.startTime;
    if (this.commitment = Math.min(t / this.options.activationTime * 100, 100), this.updateStyle(), this.commitment >= 100) {
      this.activate();
      return;
    }
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
  end() {
    this.isActive = !1, this.commitment = 0, this.startTime = null, this.element.style.transform = "scale(1)", this.updateStyle(), this.animationFrame !== null && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null);
  }
  activate() {
    this.options.onActivate && this.options.onActivate();
    for (let t = 0; t < 6; t++)
      setTimeout(() => {
        const e = t / 6 * 360, i = document.createElement("div");
        i.style.cssText = `
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
        `, this.element.appendChild(i), setTimeout(() => i.remove(), 600);
      }, t * 50);
    this.end();
  }
  createRipple(t) {
    const e = this.element.getBoundingClientRect();
    let i, s;
    if ("touches" in t && t.touches[0])
      i = (t.touches[0].clientX - e.left) / e.width * 100, s = (t.touches[0].clientY - e.top) / e.height * 100;
    else if ("clientX" in t)
      i = (t.clientX - e.left) / e.width * 100, s = (t.clientY - e.top) / e.height * 100;
    else
      return;
    const n = document.createElement("div");
    n.style.cssText = `
      position: absolute;
      left: ${i}%;
      top: ${s}%;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, ${this.options.color}80, transparent);
      animation: flowRipple 0.6s ease-out;
    `, this.element.appendChild(n), setTimeout(() => n.remove(), 600);
  }
  updateStyle() {
    const t = this.commitment / 100 * 25, e = 0.5 + this.commitment / 100 * 0.5;
    this.element.style.background = `radial-gradient(circle, ${this.options.color}50, ${this.options.color}20)`, this.element.style.border = `2px solid ${this.options.color}${Math.round(e * 255).toString(16).padStart(2, "0")}`, this.element.style.boxShadow = `
      0 0 ${t}px ${this.options.color}90,
      inset 0 0 ${t * 0.5}px ${this.options.color}50
    `;
    const i = this.options.size * 0.45, s = 2 * Math.PI * i, n = `${this.commitment / 100 * s}, ${s}`;
    this.progressCircle.style.strokeDasharray = n, this.progressCircle.style.stroke = this.options.color, this.progressCircle.style.filter = `drop-shadow(0 0 ${t * 0.5}px ${this.options.color})`;
  }
  mount(t) {
    const e = typeof t == "string" ? document.querySelector(t) : t;
    if (!e)
      throw new Error(`Target element not found: ${t}`);
    return e.appendChild(this.element), this;
  }
  destroy() {
    return this.animationFrame !== null && cancelAnimationFrame(this.animationFrame), this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element), this;
  }
}
class l {
  constructor(t = {}) {
    this.options = {
      color: "#6366f1",
      content: "",
      onDrain: null,
      ...t
    }, this.element = document.createElement("div"), this.create();
  }
  create() {
    this.element.className = "flow-pool", this.element.style.cssText = `
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at center, rgba(10, 14, 39, 0.95), rgba(0, 0, 0, 0.9));
      backdrop-filter: blur(20px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: flowPoolRise 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    const t = document.createElement("div");
    t.className = "flow-pool-surface", t.style.cssText = `
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
    `;
    const e = document.createElement("div");
    e.className = "flow-pool-content", e.innerHTML = this.options.content, t.appendChild(e);
    const i = document.createElement("button");
    i.innerHTML = "<span>Let it Drain</span>", i.style.cssText = `
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
    `, i.addEventListener("mouseenter", () => {
      i.style.background = `${this.options.color}40`, i.style.borderColor = `${this.options.color}80`;
    }), i.addEventListener("mouseleave", () => {
      i.style.background = `${this.options.color}26`, i.style.borderColor = `${this.options.color}4d`;
    }), i.addEventListener("click", () => this.drain()), t.appendChild(i), this.element.appendChild(t), this.element.addEventListener("click", (s) => {
      s.target === this.element && this.drain();
    });
  }
  enter() {
    return this.element.style.display = "flex", this;
  }
  drain() {
    return this.element.style.display = "none", this.options.onDrain && this.options.onDrain(), this;
  }
  mount(t) {
    const e = typeof t == "string" ? document.querySelector(t) : t;
    if (!e)
      throw new Error(`Target element not found: ${t}`);
    return e.appendChild(this.element), this;
  }
  destroy() {
    return this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element), this;
  }
}
const a = {
  Eddy: r,
  Pool: l
};
export {
  r as Eddy,
  l as Pool,
  a as default
};
