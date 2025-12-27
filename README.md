# Eddystrap

> Natural kinetic UI components for the web. Time as input, not clicks.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Philosophy

Traditional UIs are built on **clicks** - binary, instant decisions. Eddystrap is different.

- **Time as input** - Holding builds commitment. Duration matters.
- **Natural metaphors** - "Enter a pool" not "open modal". "Drain" not "close".
- **Kinetic feedback** - Ripples, momentum, visual flow. UI that feels alive.
- **No traditional buttons** - Everything flows. Nothing snaps.

## Components

### Eddy

A circular interactive component that activates through **press-and-hold**. The longer you press, the more "commitment" builds until activation (default 500ms).

```typescript
import { Eddy } from 'eddystrap';
import 'eddystrap/styles.css';

const eddy = new Eddy({
  color: '#6366f1',
  label: 'Confirm',
  onActivate: () => console.log('Action committed!')
});

eddy.mount('#app');
```

### Pool

A modal alternative that uses natural language. You "enter" a pool of information, then let it "drain" when done.

```typescript
import { Pool } from 'eddystrap';

const pool = new Pool({
  color: '#f59e0b',
  content: '<h2>Welcome</h2><p>You\'ve entered the pool.</p>',
  onDrain: () => console.log('Pool drained')
});

pool.mount('body');
pool.enter(); // Show
```

## Features

- ✨ **TypeScript Native** - Full type definitions included
- 🎯 **Zero Dependencies** - Completely standalone
- 📦 **Tiny Bundle** - ~2.8KB gzipped
- 📱 **Mobile-First** - Touch events built-in
- ⚡ **Fast** - Built with Vite
- 🎨 **Customizable** - Colors, sizes, timing

## Installation

```bash
npm install eddystrap
```

## Quick Start

### TypeScript

```typescript
import { Eddy, Pool, type EddyOptions, type PoolOptions } from 'eddystrap';
import 'eddystrap/styles.css';

const eddyOptions: EddyOptions = {
  color: '#10b981',
  size: 200,
  label: 'Submit',
  sublabel: 'Hold to confirm',
  activationTime: 500, // ms
  onActivate: () => {
    console.log('Submitted!');
  }
};

const eddy = new Eddy(eddyOptions);
eddy.mount('#container');
```

### JavaScript

```javascript
import { Eddy, Pool } from 'eddystrap';
import 'eddystrap/styles.css';

const eddy = new Eddy({
  color: '#6366f1',
  label: 'Action',
  onActivate: () => alert('Activated!')
});

eddy.mount('#app');
```

### Browser (UMD)

```html
<link rel="stylesheet" href="https://unpkg.com/eddystrap/dist/style.css">
<script src="https://unpkg.com/eddystrap/dist/eddystrap.umd.js"></script>

<div id="app"></div>

<script>
  const { Eddy } = Eddystrap;

  new Eddy({
    color: '#10b981',
    label: 'Try Me'
  }).mount('#app');
</script>
```

## API

### Eddy

```typescript
interface EddyOptions {
  color?: string;              // Hex color (default: '#6366f1')
  size?: number;               // Size in px (default: 200)
  label?: string;              // Main text (default: 'Eddy')
  sublabel?: string;           // Subtitle (default: 'Touch & hold')
  activationTime?: number;     // Time to activate in ms (default: 500)
  onActivate?: () => void;     // Callback on activation
}

// Methods
eddy.mount(target: string | HTMLElement): this
eddy.destroy(): this
```

### Pool

```typescript
interface PoolOptions {
  color?: string;              // Hex color (default: '#6366f1')
  content?: string;            // HTML content string
  onDrain?: () => void;        // Callback when closed
}

// Methods
pool.mount(target: string | HTMLElement): this
pool.enter(): this              // Show the pool
pool.drain(): this              // Hide the pool
pool.destroy(): this
```

## Examples

Check the `examples/` directory:
- `standalone.html` - No build required, works in any browser
- `index.html` - Using the UMD bundle

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Run tests
npm test
```

## Project Structure

```
eddystrap/
├── src/
│   ├── Eddy.ts           # Eddy component
│   ├── Eddy.test.ts      # Eddy tests
│   ├── Pool.ts           # Pool component
│   ├── Pool.test.ts      # Pool tests
│   ├── index.ts          # Main entry
│   └── styles.css        # Shared styles
├── dist/                 # Built files
│   ├── eddystrap.es.js   # ES module
│   ├── eddystrap.umd.js  # UMD bundle
│   ├── style.css         # Extracted CSS
│   └── types/            # TypeScript definitions
├── examples/             # Live demos
└── index.html            # Dev server entry
```

## Design Decisions

1. **Press-and-hold over hover** - More deliberate, works better on mobile
2. **500ms default** - Sweet spot between too fast (accidental) and too slow (annoying)
3. **Circular progress** - Visual commitment building
4. **Natural metaphors** - Pool/drain feels more organic than modal/close
5. **Ripple effects** - Emanate from touch point for kinetic feedback

## Future Components

Following the natural metaphor:

- **Stream** - Flowing content feeds
- **Current** - Directional navigation
- **Tide** - Periodic state changes
- **Whirlpool** - Multi-step commitment flows

## Browser Support

- Modern browsers with ES2020 support
- Mobile Safari & Chrome
- Touch events fully supported

## Contributing

Contributions welcome! This library is in early development.

## License

MIT © [Eddystrap](https://github.com/eddystrap)

---

**Built with time as input. No clicks required.**
