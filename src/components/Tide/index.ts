export interface TideOptions {
  color?: string;
  size?: number;
  checked?: boolean;
  label?: string;
  onToggle?: ((checked: boolean) => void) | null;
}

/**
 * Tide - A natural toggle with inertia
 *
 * Unlike traditional toggles, Tide responds instantly to clicks but
 * the visual transition has momentum - like a real tide that doesn't
 * change instantly. Click works immediately but the tide rises/falls
 * with natural timing.
 *
 * Philosophy:
 * - Click works instantly (practical)
 * - Visual transition has inertia (~800ms)
 * - Tide rises and falls gradually
 * - Feels weighted and natural
 * - Not annoying, just different
 *
 * @example
 * ```ts
 * const tide = new Tide({
 *   color: '#6366f1',
 *   label: 'Enable Feature',
 *   checked: false,
 *   onToggle: (checked) => console.log('Toggled:', checked)
 * });
 * tide.mount('#app');
 * ```
 */
export class Tide {
  private options: Required<TideOptions>;
  private element: HTMLDivElement;
  private container: HTMLDivElement;
  private orb: HTMLDivElement;
  private waves: HTMLDivElement[] = [];

  constructor(options: TideOptions = {}) {
    this.options = {
      color: '#6366f1',
      size: 60,
      checked: false,
      label: '',
      onToggle: null,
      ...options,
    };

    this.element = document.createElement('div');
    this.container = document.createElement('div');
    this.orb = document.createElement('div');

    this.create();
  }

  private create(): void {
    // Main element
    this.element.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      user-select: none;
    `;

    // Container (the tide pool)
    this.container.style.cssText = `
      position: relative;
      width: ${this.options.size * 1.8}px;
      height: ${this.options.size}px;
      background: ${this.options.color}15;
      border: 2px solid ${this.options.color}40;
      border-radius: ${this.options.size / 2}px;
      overflow: hidden;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;

    // Orb (the moon/sun that controls the tide)
    this.orb.style.cssText = `
      position: absolute;
      top: 50%;
      width: ${this.options.size - 8}px;
      height: ${this.options.size - 8}px;
      background: radial-gradient(circle, ${this.options.color}ee, ${this.options.color}aa);
      border-radius: 50%;
      transform: translateY(-50%);
      box-shadow: 0 0 15px ${this.options.color}80;
      transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      z-index: 10;
    `;

    this.container.appendChild(this.orb);
    this.element.appendChild(this.container);

    // Label
    if (this.options.label) {
      const label = document.createElement('span');
      label.textContent = this.options.label;
      label.style.cssText = `
        font-size: 1rem;
        color: #ffffff;
      `;
      this.element.appendChild(label);
    }

    this.updateState();
    this.attachEvents();
  }

  private attachEvents(): void {
    this.element.addEventListener('click', () => {
      this.toggle();
    });
  }

  private updateState(): void {
    if (this.options.checked) {
      // Tide is in (high tide)
      this.orb.style.left = `calc(100% - ${this.options.size - 4}px)`;
      this.container.style.background = `${this.options.color}40`;
      this.container.style.borderColor = `${this.options.color}`;
      this.createTideWaves();
    } else {
      // Tide is out (low tide)
      this.orb.style.left = '4px';
      this.container.style.background = `${this.options.color}15`;
      this.container.style.borderColor = `${this.options.color}40`;
      this.clearWaves();
    }
  }

  private createTideWaves(): void {
    this.clearWaves();

    // Create 4 wave layers with staggered timing for inertia effect
    for (let i = 0; i < 4; i++) {
      const wave = document.createElement('div');
      const delay = i * 0.1; // Stagger the waves
      wave.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: ${25 + i * 12}%;
        background: ${this.options.color}${(20 - i * 4).toString(16).padStart(2, '0')};
        opacity: ${0.6 - i * 0.12};
        animation: tideRise 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards;
        border-radius: 50% 50% 0 0;
      `;
      this.container.insertBefore(wave, this.orb);
      this.waves.push(wave);
    }

    // Add tide rise animation with momentum easing
    if (!document.getElementById('tide-rise-keyframes')) {
      const style = document.createElement('style');
      style.id = 'tide-rise-keyframes';
      style.textContent = `
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
      `;
      document.head.appendChild(style);
    }
  }

  private clearWaves(): void {
    this.waves.forEach((wave, i) => {
      const delay = i * 0.08; // Stagger the fall slightly
      wave.style.animation = `tideFall 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`;
      setTimeout(() => wave.remove(), 800 + delay * 1000);
    });
    this.waves = [];
  }

  /**
   * Toggle the tide state
   */
  public toggle(): this {
    this.options.checked = !this.options.checked;
    this.updateState();

    if (this.options.onToggle) {
      this.options.onToggle(this.options.checked);
    }

    return this;
  }

  /**
   * Set the checked state
   */
  public setChecked(checked: boolean): this {
    if (this.options.checked !== checked) {
      this.options.checked = checked;
      this.updateState();

      if (this.options.onToggle) {
        this.options.onToggle(this.options.checked);
      }
    }

    return this;
  }

  /**
   * Get the checked state
   */
  public isChecked(): boolean {
    return this.options.checked;
  }

  /**
   * Mount the Tide to a target element
   */
  public mount(target: string | HTMLElement): this {
    const targetElement =
      typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;

    if (!targetElement) {
      throw new Error(`Target element not found: ${target}`);
    }

    targetElement.appendChild(this.element);
    return this;
  }

  /**
   * Destroy the Tide and remove from DOM
   */
  public destroy(): this {
    this.clearWaves();

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    return this;
  }
}
