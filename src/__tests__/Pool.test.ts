// Jest globals are available without import
import { Pool } from '../components/Pool';

describe('Pool', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should create a Pool instance', () => {
    const pool = new Pool();
    expect(pool).toBeInstanceOf(Pool);
  });

  it('should mount to a target element', () => {
    const pool = new Pool();
    pool.mount(container);
    expect(container.children.length).toBe(1);
  });

  it('should be hidden by default', () => {
    const pool = new Pool();
    pool.mount(container);
    const element = container.firstChild as HTMLElement;
    expect(element.style.display).toBe('none');
  });

  it('should show when entering', () => {
    const pool = new Pool();
    pool.mount(container);
    pool.enter();
    const element = container.firstChild as HTMLElement;
    expect(element.style.display).toBe('flex');
  });

  it('should hide when draining', () => {
    const pool = new Pool();
    pool.mount(container);
    pool.enter();
    pool.drain();
    const element = container.firstChild as HTMLElement;
    expect(element.style.display).toBe('none');
  });

  it('should call onDrain callback', () => {
    let called = false;
    const pool = new Pool({
      onDrain: () => {
        called = true;
      },
    });
    pool.mount(container);
    pool.drain();
    expect(called).toBe(true);
  });

  it('should accept custom content', () => {
    const pool = new Pool({
      content: '<h1>Custom Content</h1>',
    });
    pool.mount(container);
    expect(container.innerHTML).toContain('Custom Content');
  });

  it('should destroy and remove from DOM', () => {
    const pool = new Pool();
    pool.mount(container);
    expect(container.children.length).toBe(1);
    pool.destroy();
    expect(container.children.length).toBe(0);
  });

  it('should throw error when mounting to non-existent selector', () => {
    const pool = new Pool();
    expect(() => pool.mount('#non-existent')).toThrow('Target element not found');
  });
});
