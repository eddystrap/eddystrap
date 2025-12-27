export interface WaveOptions {
  color?: string;
  min?: number;
  max?: number;
  value?: number;
  label?: string;
  onChange?: ((value: number) => void) | null;
  growthRate?: number; // How fast the wave grows (value/second)
  decayRate?: number; // How fast the wave decays when not pressed (value/second)
}

/**
 * Wave - A natural value control using wave physics
 *
 * Unlike sliders, Wave responds to press duration. Press and hold to make
 * the wave grow. Release when it reaches the desired height. The wave
 * naturally decays slowly over time if you don't interact.
 *
 * Philosophy:
 * - Press duration builds the wave
 * - Waves grow and decay naturally
 * - Visual feedback through wave amplitude
 * - No dragging, just pressing
 * - Time is the input
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
  private waveCanvas: HTMLCanvasElement;
  private valueDisplay: HTMLDivElement;
  private pressArea: HTMLDivElement;
  private isPressed: boolean = false;
  private animationFrame: number | null = null;
  private phase: number = 0;
  private lastUpdate: number = Date.now();

  constructor(options: WaveOptions = {}) {
    this.options = {
      color: '#6366f1',
      min: 0,
      max: 100,
      value: 50,
      label: 'Wave',
      onChange: null,
      growthRate: 40, // Grows from 0 to 100 in 2.5 seconds
      decayRate: 5, // Decays slowly when not pressed
      ...options,
    };

    // Ensure value is within bounds
    this.options.value = Math.max(this.options.min, Math.min(this.options.max, this.options.value));

    this.element = document.createElement('div');
    this.waveCanvas = document.createElement('canvas');
    this.valueDisplay = document.createElement('div');
    this.pressArea = document.createElement('div');

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
      user-select: none;
    `;

    // Label
    if (this.options.label) {
      const label = document.createElement('div');
      label.textContent = this.options.label;
      label.style.cssText = `
        font-size: 0.9rem;
        opacity: 0.8;
        margin-bottom: 1rem;
        color: #ffffff;
        text-align: center;
      `;
      this.element.appendChild(label);
    }

    // Wave canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: 120px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid ${this.options.color}30;
    `;

    // Wave canvas
    this.waveCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `;
    canvasContainer.appendChild(this.waveCanvas);

    // Press area (overlay for interaction)
    this.pressArea.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 10;
    `;
    canvasContainer.appendChild(this.pressArea);

    // Instruction text
    const instruction = document.createElement('div');
    instruction.textContent = 'Press & hold to grow • Release to set';
    instruction.style.cssText = `
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      opacity: 0.5;
      color: #ffffff;
      pointer-events: none;
      z-index: 5;
    `;
    canvasContainer.appendChild(instruction);

    this.element.appendChild(canvasContainer);

    // Value display
    this.valueDisplay.style.cssText = `
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      color: ${this.options.color};
      margin-top: 1rem;
    `;
    this.element.appendChild(this.valueDisplay);

    // Set canvas size
    setTimeout(() => {
      const rect = this.waveCanvas.getBoundingClientRect();
      this.waveCanvas.width = rect.width;
      this.waveCanvas.height = rect.height;
    }, 0);

    this.updateDisplay();
    this.attachEvents();
  }

  private attachEvents(): void {
    // Mouse events
    this.pressArea.addEventListener('mousedown', () => {
      this.isPressed = true;
      this.pressArea.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
      if (this.isPressed) {
        this.isPressed = false;
        this.pressArea.style.cursor = 'pointer';
      }
    });

    // Touch events
    this.pressArea.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        this.isPressed = true;
      },
      { passive: false }
    );

    document.addEventListener('touchend', () => {
      if (this.isPressed) {
        this.isPressed = false;
      }
    });
  }

  private startAnimation(): void {
    const animate = () => {
      const now = Date.now();
      const delta = (now - this.lastUpdate) / 1000; // Convert to seconds
      this.lastUpdate = now;

      // Update value based on press state
      if (this.isPressed) {
        // Grow the wave
        const newValue = Math.min(
          this.options.max,
          this.options.value + this.options.growthRate * delta
        );
        if (newValue !== this.options.value) {
          this.setValue(newValue);
        }
      } else {
        // Decay the wave slowly
        const newValue = Math.max(
          this.options.min,
          this.options.value - this.options.decayRate * delta
        );
        if (newValue !== this.options.value) {
          this.setValue(newValue, false); // Don't trigger onChange on decay
        }
      }

      this.drawWave();
      this.phase += this.isPressed ? 0.15 : 0.05; // Faster phase when pressed
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
    const amplitude = 5 + percent * (height * 0.4);

    // Draw multiple wave layers
    const layers = [
      { opacity: 0.3, offset: 0, thickness: 3 },
      { opacity: 0.2, offset: 0.5, thickness: 2 },
      { opacity: 0.15, offset: 1, thickness: 1.5 },
    ];

    layers.forEach((layer) => {
      ctx.beginPath();
      ctx.strokeStyle = this.options.color;
      ctx.globalAlpha = layer.opacity * (this.isPressed ? 1.5 : 1);
      ctx.lineWidth = layer.thickness;

      for (let x = 0; x < width; x++) {
        const y =
          centerY +
          Math.sin((x / 40 + this.phase + layer.offset) * Math.PI) * amplitude +
          Math.sin((x / 20 + this.phase * 1.5) * Math.PI) * (amplitude * 0.3);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    });

    // Draw fill below wave
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = this.options.color;
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x < width; x++) {
      const y = centerY + Math.sin((x / 40 + this.phase) * Math.PI) * amplitude;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  private updateDisplay(): void {
    this.valueDisplay.textContent = Math.round(this.options.value).toString();
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
  public setValue(value: number, triggerChange: boolean = true): this {
    this.options.value = Math.max(this.options.min, Math.min(this.options.max, value));
    this.updateDisplay();

    if (triggerChange && this.options.onChange) {
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
