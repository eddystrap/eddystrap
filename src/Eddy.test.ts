import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Eddy } from './Eddy';

describe('Eddy', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('initialization', () => {
    it('should create an Eddy with default options', () => {
      const eddy = new Eddy();
      expect(eddy).toBeInstanceOf(Eddy);
    });

    it('should accept custom options', () => {
      const eddy = new Eddy({
        color: '#ff0000',
        size: 300,
        label: 'Custom',
        sublabel: 'Test'
      });
      expect(eddy).toBeInstanceOf(Eddy);
    });

    it('should create DOM element with correct size', () => {
      const eddy = new Eddy({ size: 250 });
      eddy.mount(container);

      const element = container.querySelector('div');
      expect(element).toBeTruthy();
      expect(element?.style.width).toBe('250px');
      expect(element?.style.height).toBe('250px');
    });
  });

  describe('mounting', () => {
    it('should mount to a DOM element by selector', () => {
      const eddy = new Eddy();
      eddy.mount('#test-container');

      expect(container.children.length).toBe(1);
    });

    it('should mount to a DOM element by reference', () => {
      const eddy = new Eddy();
      eddy.mount(container);

      expect(container.children.length).toBe(1);
    });

    it('should throw error if target not found', () => {
      const eddy = new Eddy();
      expect(() => eddy.mount('#non-existent')).toThrow('Target element not found');
    });

    it('should return this for chaining', () => {
      const eddy = new Eddy();
      const result = eddy.mount(container);
      expect(result).toBe(eddy);
    });
  });

  describe('activation', () => {
    it('should call onActivate callback when activated', async () => {
      const onActivate = vi.fn();
      const eddy = new Eddy({
        activationTime: 100,
        onActivate
      });
      eddy.mount(container);

      const element = container.querySelector('div') as HTMLElement;

      // Simulate press and hold
      const mouseDownEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100
      });
      element.dispatchEvent(mouseDownEvent);

      // Wait for activation time
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(onActivate).toHaveBeenCalledTimes(1);
    });

    it('should not activate if released early', async () => {
      const onActivate = vi.fn();
      const eddy = new Eddy({
        activationTime: 200,
        onActivate
      });
      eddy.mount(container);

      const element = container.querySelector('div') as HTMLElement;

      element.dispatchEvent(new MouseEvent('mousedown'));

      // Release before activation
      await new Promise(resolve => setTimeout(resolve, 50));
      element.dispatchEvent(new MouseEvent('mouseup'));

      // Wait a bit more to ensure it doesn't activate
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(onActivate).not.toHaveBeenCalled();
    });

    it('should handle touch events', async () => {
      const onActivate = vi.fn();
      const eddy = new Eddy({
        activationTime: 100,
        onActivate
      });
      eddy.mount(container);

      const element = container.querySelector('div') as HTMLElement;

      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      element.dispatchEvent(touchEvent);

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(onActivate).toHaveBeenCalled();
    });
  });

  describe('styling', () => {
    it('should apply custom color', () => {
      const eddy = new Eddy({ color: '#00ff00' });
      eddy.mount(container);

      const element = container.querySelector('div') as HTMLElement;
      expect(element.style.background).toContain('#00ff00');
    });

    it('should have circular shape', () => {
      const eddy = new Eddy();
      eddy.mount(container);

      const element = container.querySelector('div') as HTMLElement;
      expect(element.style.borderRadius).toBe('50%');
    });

    it('should contain SVG progress circle', () => {
      const eddy = new Eddy();
      eddy.mount(container);

      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();

      const circle = svg?.querySelector('circle');
      expect(circle).toBeTruthy();
    });
  });

  describe('content', () => {
    it('should display label and sublabel', () => {
      const eddy = new Eddy({
        label: 'Test Label',
        sublabel: 'Test Sublabel'
      });
      eddy.mount(container);

      const element = container.querySelector('div') as HTMLElement;
      expect(element.textContent).toContain('Test Label');
      expect(element.textContent).toContain('Test Sublabel');
    });
  });

  describe('cleanup', () => {
    it('should remove element from DOM on destroy', () => {
      const eddy = new Eddy();
      eddy.mount(container);

      expect(container.children.length).toBe(1);

      eddy.destroy();

      expect(container.children.length).toBe(0);
    });

    it('should return this for chaining', () => {
      const eddy = new Eddy();
      eddy.mount(container);

      const result = eddy.destroy();
      expect(result).toBe(eddy);
    });

    it('should handle destroy without mounting', () => {
      const eddy = new Eddy();
      expect(() => eddy.destroy()).not.toThrow();
    });
  });

  describe('interaction states', () => {
    it('should scale up on mouse down', () => {
      const eddy = new Eddy();
      eddy.mount(container);

      const element = container.querySelector('div') as HTMLElement;
      element.dispatchEvent(new MouseEvent('mousedown'));

      expect(element.style.transform).toBe('scale(1.1)');
    });

    it('should reset scale on mouse up', async () => {
      const eddy = new Eddy();
      eddy.mount(container);

      const element = container.querySelector('div') as HTMLElement;
      element.dispatchEvent(new MouseEvent('mousedown'));

      await new Promise(resolve => setTimeout(resolve, 10));

      element.dispatchEvent(new MouseEvent('mouseup'));

      expect(element.style.transform).toBe('scale(1)');
    });
  });
});
