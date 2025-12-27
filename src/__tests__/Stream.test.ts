// Jest globals are available without import
import { Stream } from '../components/Stream';

describe('Stream', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should create a Stream instance', () => {
    const stream = new Stream();
    expect(stream).toBeInstanceOf(Stream);
  });

  it('should mount to a target element', () => {
    const stream = new Stream();
    stream.mount(container);
    expect(container.children.length).toBe(1);
  });

  it('should create single-line input by default', () => {
    const stream = new Stream();
    stream.mount(container);
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should create textarea when multiline is true', () => {
    const stream = new Stream({ multiline: true });
    stream.mount(container);
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });

  it('should set and get value', () => {
    const stream = new Stream();
    stream.mount(container);
    stream.setValue('Hello World');
    expect(stream.getValue()).toBe('Hello World');
  });

  it('should clear value', () => {
    const stream = new Stream();
    stream.mount(container);
    stream.setValue('Test');
    stream.clear();
    expect(stream.getValue()).toBe('');
  });

  it('should call onChange callback', () => {
    let value = '';
    const stream = new Stream({
      onChange: (val) => {
        value = val;
      },
    });
    stream.mount(container);
    stream.setValue('Test');
    expect(value).toBe('Test');
  });

  it('should destroy and remove from DOM', () => {
    const stream = new Stream();
    stream.mount(container);
    expect(container.children.length).toBe(1);
    stream.destroy();
    expect(container.children.length).toBe(0);
  });

  it('should throw error when mounting to non-existent selector', () => {
    const stream = new Stream();
    expect(() => stream.mount('#non-existent')).toThrow('Target element not found');
  });

  it('should set custom placeholder', () => {
    const stream = new Stream({
      placeholder: 'Custom placeholder',
    });
    stream.mount(container);
    const input = container.querySelector('input');
    expect(input?.placeholder).toBe('Custom placeholder');
  });
});
