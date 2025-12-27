export interface PoolOptions {
  color?: string;
  content?: string;
  onDrain?: (() => void) | null;
}

export class Pool {
  private options: Required<PoolOptions>;
  private element: HTMLDivElement;

  constructor(options: PoolOptions = {}) {
    this.options = {
      color: '#6366f1',
      content: '',
      onDrain: null,
      ...options
    };

    this.element = document.createElement('div');
    this.create();
  }

  private create(): void {
    this.element.className = 'flow-pool';
    this.element.style.cssText = `
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

    const surface = document.createElement('div');
    surface.className = 'flow-pool-surface';
    surface.style.cssText = `
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

    const contentDiv = document.createElement('div');
    contentDiv.className = 'flow-pool-content';
    contentDiv.innerHTML = this.options.content;

    surface.appendChild(contentDiv);

    const drainBtn = document.createElement('button');
    drainBtn.innerHTML = '<span>Let it Drain</span>';
    drainBtn.style.cssText = `
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
    `;

    drainBtn.addEventListener('mouseenter', () => {
      drainBtn.style.background = `${this.options.color}40`;
      drainBtn.style.borderColor = `${this.options.color}80`;
    });

    drainBtn.addEventListener('mouseleave', () => {
      drainBtn.style.background = `${this.options.color}26`;
      drainBtn.style.borderColor = `${this.options.color}4d`;
    });

    drainBtn.addEventListener('click', () => this.drain());
    surface.appendChild(drainBtn);

    this.element.appendChild(surface);

    this.element.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.element) {
        this.drain();
      }
    });
  }

  public enter(): this {
    this.element.style.display = 'flex';
    return this;
  }

  public drain(): this {
    this.element.style.display = 'none';

    if (this.options.onDrain) {
      this.options.onDrain();
    }

    return this;
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
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}
