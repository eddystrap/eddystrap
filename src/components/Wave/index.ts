export interface WaveOptions {
  color?: string;
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  label?: string;
  onChange?: ((value: number) => void) | null;
}

/**
 * Wave - A natural slider/range component
 *
 * Unlike traditional sliders, Wave uses flowing wave motion to represent values.
 * The wave amplitude changes based on the value, creating organic feedback.
 *
 * Philosophy:
 * - Values flow like waves
 * - Visual amplitude represents magnitude
 * - Natural, smooth transitions
 * - No harsh linear bars
 *
 * @example
 * ```ts
 * const wave = new Wave({
 *   color: '#6366f1',
 *   min: 0,
 *   max: 100,
 *   value: 50,
 *   onChange: (value) => console.log('Value:', value)
 * });
 * wave.mount('#app');
 * ```
 */
export class Wave {
  private options: Required<WaveOptions>;
  private element: HTMLDivElement;
  private track: HTMLDivElement;
  private handle: HTMLDivElement;
  private waveCanvas: HTMLCanvasElement;
  private valueDisplay: HTMLDivElement;
  private isDragging: boolean = false;
  private animationFrame: number | null = null;
  private phase: number = 0;

  constructor(options: WaveOptions = {}) {
    this.options = {
      color: '#6366f1',
      min: 0,
      max: 100,
      value: 50,
      step: 1,
      label: 'Wave',
      onChange: null,
      ...options,
    };

    // Ensure value is within bounds
    this.options.value = Math.max(this.options.min, Math.min(this.options.max, this.options.value));

    this.element = document.createElement('div');
    this.track = document.createElement('div');
    this.handle = document.createElement('div');
    this.waveCanvas = document.createElement('canvas');
    this.valueDisplay = document.createElement('div');

    this.create();
    this.startAnimation();
  }

  private create(): void {
    // Container
    this.element.style.cssText = `
      position: relative;
      width: 100%;
      max-width: 400px;
      padding: 1rem 0;
    `;

    // Label
    if (this.options.label) {
      const label = document.createElement('div');
      label.textContent = this.options.label;
      label.style.cssText = `
        font-size: 0.9rem;
        opacity: 0.8;
        margin-bottom: 0.5rem;
        color: #ffffff;
      `;
      this.element.appendChild(label);
    }

    // Wave canvas (background animation)
    this.waveCanvas.width = 400;
    this.waveCanvas.height = 60;
    this.waveCanvas.style.cssText = `
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 60px;
      transform: translateY(-50%);
      pointer-events: none;
      opacity: 0.3;
    `;
    this.element.appendChild(this.waveCanvas);

    // Track
    this.track.style.cssText = `
      position: relative;
      width: 100%;
      height: 8px;
      background: ${this.options.color}20;
      border-radius: 4px;
      cursor: pointer;
      margin: 1rem 0;
    `;

    // Handle
    this.handle.style.cssText = `
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
    `;

    this.track.appendChild(this.handle);
    this.element.appendChild(this.track);

    // Value display
    this.valueDisplay.style.cssText = `
      text-align: center;
      font-size: 1.2rem;
      font-weight: 500;
      color: ${this.options.color};
      margin-top: 0.5rem;
    `;
    this.element.appendChild(this.valueDisplay);

    this.updatePosition();
    this.attachEvents();
  }

  private attachEvents(): void {
    const handleMove = (clientX: number) => {
      const rect = this.track.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const range = this.options.max - this.options.min;
      let value = this.options.min + percent * range;

      // Snap to step
      value = Math.round(value / this.options.step) * this.options.step;
      this.setValue(value);
    };

    // Mouse events
    this.handle.addEventListener('mousedown', () => {
      this.isDragging = true;
      this.handle.style.cursor = 'grabbing';
      this.handle.style.transform = 'translate(-50%, -50%) scale(1.2)';
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        handleMove(e.clientX);
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.handle.style.cursor = 'grab';
        this.handle.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });

    // Touch events
    this.handle.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        this.isDragging = true;
        this.handle.style.transform = 'translate(-50%, -50%) scale(1.2)';
      },
      { passive: false }
    );

    document.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    });

    document.addEventListener('touchend', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.handle.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });

    // Click on track
    this.track.addEventListener('click', (e) => {
      if (e.target === this.track) {
        handleMove(e.clientX);
      }
    });
  }

  private updatePosition(): void {
    const percent = (this.options.value - this.options.min) / (this.options.max - this.options.min);
    this.handle.style.left = `${percent * 100}%`;
    this.valueDisplay.textContent = this.options.value.toString();
  }

  private startAnimation(): void {
    const animate = () => {
      this.drawWave();
      this.phase += 0.05;
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  private drawWave(): void {
    const ctx = this.waveCanvas.getContext('2d');
    if (!ctx) return;

    const width = this.waveCanvas.width;
    const height = this.waveCanvas.height;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Calculate amplitude based on value
    const percent = (this.options.value - this.options.min) / (this.options.max - this.options.min);
    const amplitude = 10 + percent * 20;

    // Draw wave
    ctx.beginPath();
    ctx.strokeStyle = this.options.color;
    ctx.lineWidth = 2;

    for (let x = 0; x < width; x++) {
      const y = centerY + Math.sin((x / 50 + this.phase) * Math.PI) * amplitude;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }

  /**
   * Get current value
   */
  public getValue(): number {
    return this.options.value;
  }

  /**
   * Set value
   */
  public setValue(value: number): this {
    this.options.value = Math.max(this.options.min, Math.min(this.options.max, value));
    this.updatePosition();

    if (this.options.onChange) {
      this.options.onChange(this.options.value);
    }

    return this;
  }

  /**
   * Mount the Wave to a target element
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
   * Destroy the Wave and remove from DOM
   */
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
