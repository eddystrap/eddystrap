import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Pool } from './Pool';

describe('Pool', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('initialization', () => {
    it('should create a Pool with default options', () => {
      const pool = new Pool();
      expect(pool).toBeInstanceOf(Pool);
    });

    it('should accept custom options', () => {
      const pool = new Pool({
        color: '#ff0000',
        content: '<h1>Test</h1>',
        onDrain: () => {}
      });
      expect(pool).toBeInstanceOf(Pool);
    });
  });

  describe('mounting', () => {
    it('should mount to a DOM element by selector', () => {
      const container = document.createElement('div');
      container.id = 'pool-container';
      document.body.appendChild(container);

      const pool = new Pool();
      pool.mount('#pool-container');

      expect(container.children.length).toBe(1);
      expect(container.querySelector('.flow-pool')).toBeTruthy();
    });

    it('should mount to a DOM element by reference', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const pool = new Pool();
      pool.mount(container);

      expect(container.children.length).toBe(1);
    });

    it('should throw error if target not found', () => {
      const pool = new Pool();
      expect(() => pool.mount('#non-existent')).toThrow('Target element not found');
    });

    it('should return this for chaining', () => {
      const pool = new Pool();
      const result = pool.mount(document.body);
      expect(result).toBe(pool);
    });
  });

  describe('enter/drain behavior', () => {
    it('should be hidden by default', () => {
      const pool = new Pool();
      pool.mount(document.body);

      const element = document.querySelector('.flow-pool') as HTMLElement;
      expect(element.style.display).toBe('none');
    });

    it('should show pool when enter is called', () => {
      const pool = new Pool();
      pool.mount(document.body);

      pool.enter();

      const element = document.querySelector('.flow-pool') as HTMLElement;
      expect(element.style.display).toBe('flex');
    });

    it('should hide pool when drain is called', () => {
      const pool = new Pool();
      pool.mount(document.body);

      pool.enter();
      pool.drain();

      const element = document.querySelector('.flow-pool') as HTMLElement;
      expect(element.style.display).toBe('none');
    });

    it('should call onDrain callback when drained', () => {
      const onDrain = vi.fn();
      const pool = new Pool({ onDrain });
      pool.mount(document.body);

      pool.enter();
      pool.drain();

      expect(onDrain).toHaveBeenCalledTimes(1);
    });

    it('should return this for chaining on enter', () => {
      const pool = new Pool();
      pool.mount(document.body);

      const result = pool.enter();
      expect(result).toBe(pool);
    });

    it('should return this for chaining on drain', () => {
      const pool = new Pool();
      pool.mount(document.body);

      const result = pool.drain();
      expect(result).toBe(pool);
    });
  });

  describe('content', () => {
    it('should render custom HTML content', () => {
      const pool = new Pool({
        content: '<h2>Custom Title</h2><p>Custom content</p>'
      });
      pool.mount(document.body);

      const contentDiv = document.querySelector('.flow-pool-content');
      expect(contentDiv?.innerHTML).toContain('Custom Title');
      expect(contentDiv?.innerHTML).toContain('Custom content');
    });

    it('should have a drain button', () => {
      const pool = new Pool();
      pool.mount(document.body);

      const button = document.querySelector('.flow-pool-surface button');
      expect(button).toBeTruthy();
      expect(button?.textContent).toContain('Let it Drain');
    });

    it('should drain when button is clicked', () => {
      const pool = new Pool();
      pool.mount(document.body);
      pool.enter();

      const button = document.querySelector('.flow-pool-surface button') as HTMLButtonElement;
      button.click();

      const element = document.querySelector('.flow-pool') as HTMLElement;
      expect(element.style.display).toBe('none');
    });

    it('should drain when clicking outside surface', () => {
      const pool = new Pool();
      pool.mount(document.body);
      pool.enter();

      const poolElement = document.querySelector('.flow-pool') as HTMLElement;
      poolElement.click();

      expect(poolElement.style.display).toBe('none');
    });

    it('should not drain when clicking inside surface', () => {
      const pool = new Pool();
      pool.mount(document.body);
      pool.enter();

      const surface = document.querySelector('.flow-pool-surface') as HTMLElement;
      surface.click();

      const poolElement = document.querySelector('.flow-pool') as HTMLElement;
      expect(poolElement.style.display).toBe('flex');
    });
  });

  describe('styling', () => {
    it('should apply custom color', () => {
      const pool = new Pool({ color: '#00ff00' });
      pool.mount(document.body);

      const surface = document.querySelector('.flow-pool-surface') as HTMLElement;
      expect(surface.style.background).toContain('#00ff00');
    });

    it('should have flow-pool class', () => {
      const pool = new Pool();
      pool.mount(document.body);

      const element = document.querySelector('.flow-pool');
      expect(element).toBeTruthy();
    });

    it('should have flow-pool-surface class', () => {
      const pool = new Pool();
      pool.mount(document.body);

      const surface = document.querySelector('.flow-pool-surface');
      expect(surface).toBeTruthy();
    });

    it('should be fixed position', () => {
      const pool = new Pool();
      pool.mount(document.body);

      const element = document.querySelector('.flow-pool') as HTMLElement;
      expect(element.style.position).toBe('fixed');
    });
  });

  describe('cleanup', () => {
    it('should remove element from DOM on destroy', () => {
      const pool = new Pool();
      pool.mount(document.body);

      expect(document.body.children.length).toBeGreaterThan(0);

      pool.destroy();

      expect(document.querySelector('.flow-pool')).toBeNull();
    });

    it('should return this for chaining', () => {
      const pool = new Pool();
      pool.mount(document.body);

      const result = pool.destroy();
      expect(result).toBe(pool);
    });

    it('should handle destroy without mounting', () => {
      const pool = new Pool();
      expect(() => pool.destroy()).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('should have a button element for draining', () => {
      const pool = new Pool();
      pool.mount(document.body);

      const button = document.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.tagName).toBe('BUTTON');
    });
  });
});
