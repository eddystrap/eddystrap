# Changelog

All notable changes to Eddystrap will be documented in this file.

## [0.2.0] - 2025-12-27

### 🎉 Initial Release

**Eddystrap** - Natural kinetic UI components for the web. Time as input, not clicks.

### Philosophy

Traditional UIs are built on clicks - binary, instant decisions. Eddystrap is different. We use **time as input**, **natural metaphors**, and **kinetic feedback** to create interfaces that feel alive.

### Components

#### Eddy
Press-and-hold interactive component with visual commitment building.
- Circular design with progress indicator
- Customizable colors, sizes, and activation timing
- Touch and mouse event support
- Ripple effects emanating from interaction point
- Burst animation on activation

#### Pool
Modal alternative using natural language metaphors.
- "Enter" a pool instead of "opening" a modal
- "Drain" instead of "close"
- Backdrop blur and gradient effects
- Click-outside-to-close functionality
- Customizable content and styling

### Features

- ✨ **TypeScript Native** - Full type definitions included
- 🎯 **Zero Dependencies** - Completely standalone
- 📦 **Tiny Bundle** - ~2.8KB gzipped total
- 📱 **Mobile-First** - Touch events built-in
- ⚡ **Fast** - Built with Vite
- 🎨 **Customizable** - Colors, sizes, timing

### Technical Stack

- **TypeScript 5.9.3** - Strict mode with full type safety
- **Vite 5.0** - Lightning-fast build tool
- **Vitest** - Modern testing framework
- **ES Modules + UMD** - Dual bundle output
- **CSS Animations** - Smooth 60fps animations

### Exports

```typescript
// Components
export { Eddy, Pool }

// Type definitions
export type { EddyOptions, PoolOptions }
```

### Package Bundles

- `dist/eddystrap.es.js` - ES module (9.05 KB)
- `dist/eddystrap.umd.js` - UMD bundle (8.31 KB)
- `dist/style.css` - Extracted styles (0.93 KB)
- `dist/types/index.d.ts` - TypeScript definitions

### Browser Support

- Modern browsers with ES2020 support
- Mobile Safari & Chrome
- Full touch event support

### Development

Built with modern tooling:
- TypeScript compilation with declaration generation
- Vite for blazing-fast dev server and builds
- Vitest for unit testing
- Happy-DOM for test environment

### Links

- **GitHub**: https://github.com/eddystrap/eddystrap
- **npm**: https://www.npmjs.com/package/eddystrap (coming soon)
- **Docs**: Check README.md for full API documentation

---

**Built with time as input. No clicks required.**
