// Jest globals are available without import
import { Eddy } from '../components/Eddy';

describe('Eddy', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should create an Eddy instance', () => {
    const eddy = new Eddy();
    expect(eddy).toBeInstanceOf(Eddy);
  });

  it('should mount to a target element', () => {
    const eddy = new Eddy();
    eddy.mount(container);
    expect(container.children.length).toBe(1);
  });

  it('should accept custom color option', () => {
    const eddy = new Eddy({ color: '#ff0000' });
    eddy.mount(container);
    const element = container.firstChild as HTMLElement;
    // Color gets converted to rgba, so check for 'rgb(255, 0, 0)' or 'rgba(255, 0, 0'
    expect(element.style.border).toMatch(/255,\s*0,\s*0/);
  });

  it('should accept custom size option', () => {
    const eddy = new Eddy({ size: 300 });
    eddy.mount(container);
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('300px');
    expect(element.style.height).toBe('300px');
  });

  it('should call onActivate callback', () => {
    let called = false;
    const eddy = new Eddy({
      onActivate: () => {
        called = true;
      },
    });
    eddy.mount(container);
    // Trigger activation directly
    (eddy as any).activate();
    expect(called).toBe(true);
  });

  it('should destroy and remove from DOM', () => {
    const eddy = new Eddy();
    eddy.mount(container);
    expect(container.children.length).toBe(1);
    eddy.destroy();
    expect(container.children.length).toBe(0);
  });

  it('should throw error when mounting to non-existent selector', () => {
    const eddy = new Eddy();
    expect(() => eddy.mount('#non-existent')).toThrow('Target element not found');
  });
});
