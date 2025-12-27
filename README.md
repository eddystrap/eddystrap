# Eddystrap

> Natural kinetic UI components for the web. Time as input, not clicks.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Documentation

📚 **[View Full Documentation](docs/pages/landing.html)**

Interactive demos and complete component reference available in the documentation pages.

## Philosophy

Traditional UIs are built on **clicks** - binary, instant decisions. Eddystrap is different.

- **Time as input** - Holding builds commitment. Duration matters.
- **Natural metaphors** - "Enter a pool" not "open modal". "Drain" not "close".
- **Kinetic feedback** - Ripples, momentum, visual flow. UI that feels alive.
- **No traditional buttons** - Everything flows. Nothing snaps.

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

## Quick Example

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

For full API documentation and interactive examples, see the [documentation pages](docs/pages/landing.html).

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
