export interface EddyOptions {
  color?: string;
  size?: number;
  activationTime?: number;
  onActivate?: (() => void) | null;
  label?: string;
  sublabel?: string;
}

export class Eddy {
  private options: Required<EddyOptions>;
  private element: HTMLDivElement;
  private progressCircle: SVGCircleElement;
  private commitment: number = 0;
  private isActive: boolean = false;
  private startTime: number | null = null;
  private animationFrame: number | null = null;

  constructor(options: EddyOptions = {}) {
    this.options = {
      color: '#6366f1',
      size: 200,
      activationTime: 500,
      onActivate: null,
      label: 'Eddy',
      sublabel: 'Touch & hold',
      ...options
    };

    this.element = document.createElement('div');
    this.progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    this.create();
  }

  private create(): void {
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

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      pointer-events: none;
    `;

    this.progressCircle.setAttribute('cx', '50%');
    this.progressCircle.setAttribute('cy', '50%');
    this.progressCircle.setAttribute('r', '45%');
    this.progressCircle.setAttribute('fill', 'none');
    this.progressCircle.setAttribute('stroke-width', '3');
    this.progressCircle.style.transition = 'stroke-dasharray 0.05s linear';

    svg.appendChild(this.progressCircle);
    this.element.appendChild(svg);

    const content = document.createElement('div');
    content.style.cssText = `
      position: relative;
      z-index: 10;
      text-align: center;
      color: #ffffff;
      font-size: 1.3rem;
      font-weight: 300;
      letter-spacing: 0.05em;
      pointer-events: none;
    `;
    content.innerHTML = `
      ${this.options.label}
      <small style="display: block; font-size: 0.8rem; opacity: 0.7; margin-top: 0.5rem;">
        ${this.options.sublabel}
      </small>
    `;

    this.element.appendChild(content);
    this.attachEvents();
    this.updateStyle();
  }

  private attachEvents(): void {
    this.element.addEventListener('mousedown', (e) => this.start(e));
    this.element.addEventListener('mouseup', () => this.end());
    this.element.addEventListener('mouseleave', () => this.end());

    this.element.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.start(e);
    }, { passive: false });

    this.element.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.end();
    }, { passive: false });

    this.element.addEventListener('touchcancel', () => this.end());
  }

  private start(e: MouseEvent | TouchEvent): void {
    this.startTime = Date.now();
    this.isActive = true;
    this.element.style.transform = 'scale(1.1)';
    this.animate();
    this.createRipple(e);
  }

  private animate(): void {
    if (!this.isActive || this.startTime === null) return;

    const elapsed = Date.now() - this.startTime;
    this.commitment = Math.min((elapsed / this.options.activationTime) * 100, 100);

    this.updateStyle();

    if (this.commitment >= 100) {
      this.activate();
      return;
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  private end(): void {
    this.isActive = false;
    this.commitment = 0;
    this.startTime = null;
    this.element.style.transform = 'scale(1)';
    this.updateStyle();

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private activate(): void {
    if (this.options.onActivate) {
      this.options.onActivate();
    }

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const angle = (i / 6) * 360;
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          left: 50%;
          top: 50%;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, ${this.options.color}70, transparent);
          transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-40px);
          animation: flowRipple 0.6s ease-out;
        `;

        this.element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }, i * 50);
    }

    this.end();
  }

  private createRipple(e: MouseEvent | TouchEvent): void {
    const rect = this.element.getBoundingClientRect();
    let x: number, y: number;

    if ('touches' in e && e.touches[0]) {
      x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
    } else if ('clientX' in e) {
      x = ((e.clientX - rect.left) / rect.width) * 100;
      y = ((e.clientY - rect.top) / rect.height) * 100;
    } else {
      return;
    }

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, ${this.options.color}80, transparent);
      animation: flowRipple 0.6s ease-out;
    `;

    this.element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  private updateStyle(): void {
    const glow = (this.commitment / 100) * 25;
    const opacity = 0.5 + (this.commitment / 100) * 0.5;

    this.element.style.background = `radial-gradient(circle, ${this.options.color}50, ${this.options.color}20)`;
    this.element.style.border = `2px solid ${this.options.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
    this.element.style.boxShadow = `
      0 0 ${glow}px ${this.options.color}90,
      inset 0 0 ${glow * 0.5}px ${this.options.color}50
    `;

    const radius = this.options.size * 0.45;
    const circumference = 2 * Math.PI * radius;
    const dashArray = `${(this.commitment / 100) * circumference}, ${circumference}`;
    this.progressCircle.style.strokeDasharray = dashArray;
    this.progressCircle.style.stroke = this.options.color;
    this.progressCircle.style.filter = `drop-shadow(0 0 ${glow * 0.5}px ${this.options.color})`;
  }

  public mount(target: string | HTMLElement): this {
    const targetElement = typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : target;

    if (!targetElement) {
      throw new Error(`Target element not found: ${target}`);
    }

    targetElement.appendChild(this.element);
    return this;
  }

  public destroy(): this {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}
