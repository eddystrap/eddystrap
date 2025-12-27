// Eddystrap - Natural kinetic UI components for the web
import './styles.css';
import { Eddy, type EddyOptions } from './components/Eddy/index.js';
import { Pool, type PoolOptions } from './components/Pool/index.js';
import { Stream, type StreamOptions } from './components/Stream/index.js';
import { Wave, type WaveOptions } from './components/Wave/index.js';
import { Tide, type TideOptions } from './components/Tide/index.js';

export { Eddy, Pool, Stream, Wave, Tide };
export type { EddyOptions, PoolOptions, StreamOptions, WaveOptions, TideOptions };

// Default export for convenience
export default {
  Eddy,
  Pool,
  Stream,
  Wave,
  Tide,
};
