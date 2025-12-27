declare const _default: {
    Eddy: typeof Eddy;
    Pool: typeof Pool;
};
export default _default;

export declare class Eddy {
    private options;
    private element;
    private progressCircle;
    private commitment;
    private isActive;
    private startTime;
    private animationFrame;
    constructor(options?: EddyOptions);
    private create;
    private attachEvents;
    private start;
    private animate;
    private end;
    private activate;
    private createRipple;
    private updateStyle;
    mount(target: string | HTMLElement): this;
    destroy(): this;
}

export declare interface EddyOptions {
    color?: string;
    size?: number;
    activationTime?: number;
    onActivate?: (() => void) | null;
    label?: string;
    sublabel?: string;
}

export declare class Pool {
    private options;
    private element;
    constructor(options?: PoolOptions);
    private create;
    enter(): this;
    drain(): this;
    mount(target: string | HTMLElement): this;
    destroy(): this;
}

export declare interface PoolOptions {
    color?: string;
    content?: string;
    onDrain?: (() => void) | null;
}

export { }
