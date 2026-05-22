export interface ResultOptions<R extends Result = Result> {
  /** Function to modify the Result instance after creation */
  init?: (res: R) => void;
  /** Context (this) for executing fn in safeInvoke/sync/async */
  invokeContext?: any;
  /** Arguments for calling fn. Accepts anything, processed via parseArgs */
  invokeArgs?: readonly any[];
  /** Any additional fields for custom logic */
  [key: string]: any;
}

/** Base data container */
export class Result<T = any, E = any> {
  constructor(value?: T, error?: E, forcedError?: boolean);
  readonly value: T | undefined;
  readonly error: E | undefined;
  readonly ok: boolean;
  readonly notOk: boolean;
  readonly forcedError: boolean;

  /**
   * Object-style pattern matching.
   * @example
   * result.match({
   *   ok: (value) => `Success: ${value}`,
   *   err: (error) => `Error: ${error}`
   * });
   */
  match<U>(handlers: {
    ok: (value: T, result: Result<T, E>) => U;
    err: (error: E, result: Result<T, E>) => U;
  }): U;

  /**
   * Function-style pattern matching.
   * @example
   * result.fold(
   *   (value) => value.toUpperCase(),
   *   (error) => error.message
   * );
   */
  fold<U>(
    onOk: (value: T, result: Result<T, E>) => U,
    onErr: (error: E, result: Result<T, E>) => U
  ): U;
}

/** 
 * PUBLIC FUNCTIONAL API (Out of the box)
 */
export function OK<T = never>(value: T, options?: ResultOptions<Result<T, never>>): Result<T, never>;
export function ERR<E = never>(error: E, options?: ResultOptions<Result<never, E>>): Result<never, E>;
export function RES<T, E>(arg: T | Result<T, E>, options?: ResultOptions, isFromCatchBlock?: boolean): Result<T, E>;

export function safeInvoke<T>(
  fn: T | ((...args: any[]) => T),
  options?: ResultOptions
): [T?, any?];

export function syncCall<T>(
  fn: T | ((...args: any[]) => T),
  options?: ResultOptions
): Result<T, any>;

// asyncCall — three overloads for different argument types
export function asyncCall<T>(arg: Promise<T>, options?: ResultOptions): Promise<Result<T, any>>;
export function asyncCall<T>(arg: () => T | Promise<T>, options?: ResultOptions): Promise<Result<T, any>>;
export function asyncCall<T>(arg: T, options?: ResultOptions): Promise<Result<T, any>>;

/** 
 * API FOR POLYMORPHISM (Inheritance)
 * R — the Result class type that methods will return
 */
export class Results<R extends Result = Result> {
  /** Reference to the Result class constructor */
  Class: new (...args: any[]) => R;

  /** Creates an instance of R (success) */
  OK<T>(value: T, options?: ResultOptions<R>): R;
  /** Creates an instance of R (error) */
  ERR<E>(error: E, options?: ResultOptions<R>): R;
  /** Converts a value to an instance of R */
  RES(arg: any, options?: ResultOptions<R>, isFromCatchBlock?: boolean): R;

  /** Safe call (Go-style) */
  safeInvoke(fn: Function, options?: ResultOptions<R>): [any?, any?];
  
  /** Synchronous call returning R */
  syncCall(fn: Function, options?: ResultOptions<R>): R;
  /** Alias for syncCall */
  sync(fn: Function, options?: ResultOptions<R>): R;
  
  /** Asynchronous call returning Promise<R> */
  asyncCall(arg: any, options?: ResultOptions<R>): Promise<R>;
  /** Alias for asyncCall */
  async(arg: any, options?: ResultOptions<R>): Promise<R>;

  /** System methods available for overriding */
  normalizeOptions(obj: any): ResultOptions<R>;
  parseArgs(args: any): any[];
}

/** 
 * CHAIN API (Optional module)
 * Import from 'js-res/chain'
 */
export class ChainResult<T = any, E = any> extends Result<T, E> {
  /** Synchronous chain method */
  syncChain<U>(fn: (value: T) => U | Result<U, any>, options?: ResultOptions): ChainResult<U, any>;
  /** Asynchronous chain method */
  asyncChain<U>(fn: (value: T) => Promise<U | Result<U, any>>, options?: ResultOptions): Promise<ChainResult<U, any>>;
}

/** Start a synchronous chain */
export function syncChain<T>(arg: T | (() => T), options?: ResultOptions): ChainResult<T, any>;
/** Start an asynchronous chain */
export function asyncChain<T>(arg: T | (() => Promise<T>), options?: ResultOptions): Promise<ChainResult<T, any>>;