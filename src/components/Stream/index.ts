export interface StreamOptions {
  color?: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  onFlow?: ((value: string) => void) | null;
  onChange?: ((value: string) => void) | null;
}

/**
 * Stream - A natural text input component
 *
 * Unlike traditional inputs, Stream uses flowing water metaphors.
 * Text flows in with ripple effects and natural feedback.
 *
 * Philosophy:
 * - No harsh borders, just gentle boundaries
 * - Text flows in like water
 * - Visual feedback with each character
 * - Commitment builds as you type
 *
 * @example
 * ```ts
 * const stream = new Stream({
 *   color: '#6366f1',
 *   placeholder: 'Let your thoughts flow...',
 *   onFlow: (value) => console.log('Flowed:', value)
 * });
 * stream.mount('#app');
 * ```
 */
export class Stream {
  private options: Required<StreamOptions>;
  private element: HTMLDivElement;
  private input: HTMLInputElement | HTMLTextAreaElement;
  private surface: HTMLDivElement;
  private ripples: HTMLDivElement[] = [];

  constructor(options: StreamOptions = {}) {
    this.options = {
      color: '#6366f1',
      placeholder: 'Let your thoughts flow...',
      multiline: false,
      maxLength: 500,
      onFlow: null,
      onChange: null,
      ...options,
    };

    this.element = document.createElement('div');
    this.input = this.options.multiline
      ? document.createElement('textarea')
      : document.createElement('input');
    this.surface = document.createElement('div');

    this.create();
  }

  private create(): void {
    // Container
    this.element.style.cssText = `
      position: relative;
      width: 100%;
      max-width: 500px;
    `;

    // Surface (visual layer behind text)
    this.surface.style.cssText = `
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
    `;
    this.element.appendChild(this.surface);

    // Input element
    this.input.placeholder = this.options.placeholder;

    if (this.input instanceof HTMLTextAreaElement) {
      this.input.rows = 4;
      this.input.style.resize = 'none';
    } else {
      this.input.type = 'text';
    }

    this.input.maxLength = this.options.maxLength;
    this.input.style.cssText = `
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
    `;

    this.input.addEventListener('input', () => this.handleInput());
    this.input.addEventListener('focus', () => this.handleFocus());
    this.input.addEventListener('blur', () => this.handleBlur());
    this.input.addEventListener('keypress', (e: Event) => this.createRipple(e as KeyboardEvent));

    this.element.appendChild(this.input);
  }

  private handleInput(): void {
    const value = this.input.value;

    if (this.options.onChange) {
      this.options.onChange(value);
    }

    // Update glow based on content length
    const intensity = Math.min((value.length / this.options.maxLength) * 100, 100);
    const glow = (intensity / 100) * 20;

    this.surface.style.background = `linear-gradient(135deg,
      ${this.options.color}${Math.round((intensity / 100) * 26)
        .toString(16)
        .padStart(2, '0')} 0%,
      ${this.options.color}0d 50%,
      ${this.options.color}${Math.round((intensity / 100) * 26)
        .toString(16)
        .padStart(2, '0')} 100%)`;

    this.surface.style.boxShadow = `
      0 0 ${glow}px ${this.options.color}40,
      inset 0 0 ${glow * 0.5}px ${this.options.color}20
    `;
  }

  private handleFocus(): void {
    this.surface.style.borderColor = `${this.options.color}80`;
    this.surface.style.boxShadow = `
      0 0 20px ${this.options.color}40,
      inset 0 0 10px ${this.options.color}20
    `;
  }

  private handleBlur(): void {
    this.surface.style.borderColor = `${this.options.color}33`;

    // Trigger onFlow when user finishes (blur)
    if (this.options.onFlow && this.input.value) {
      this.options.onFlow(this.input.value);
    }
  }

  private createRipple(_e: KeyboardEvent): void {
    // Create a small ripple effect when typing
    const ripple = document.createElement('div');

    // Random position within the surface
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    ripple.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, ${this.options.color}60, transparent);
      animation: flowRipple 0.8s ease-out;
    `;

    this.surface.appendChild(ripple);
    this.ripples.push(ripple);

    // Remove after animation
    setTimeout(() => {
      ripple.remove();
      const index = this.ripples.indexOf(ripple);
      if (index > -1) {
        this.ripples.splice(index, 1);
      }
    }, 800);
  }

  /**
   * Get current value from the stream
   */
  public getValue(): string {
    return this.input.value;
  }

  /**
   * Set value in the stream
   */
  public setValue(value: string): this {
    this.input.value = value;
    this.handleInput();
    return this;
  }

  /**
   * Clear the stream
   */
  public clear(): this {
    this.input.value = '';
    this.handleInput();
    return this;
  }

  /**
   * Focus the input
   */
  public focus(): this {
    this.input.focus();
    return this;
  }

  /**
   * Mount the Stream to a target element
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
   * Destroy the Stream and remove from DOM
   */
  public destroy(): this {
    // Clean up ripples
    this.ripples.forEach((ripple) => ripple.remove());
    this.ripples = [];

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
}
