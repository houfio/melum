export type Breakpoint = 'phone' | 'tablet' | 'laptop' | 'desktop';

export type Breakpoints<T> = {
  [K in Breakpoint]?: T
};
