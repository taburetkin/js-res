import { Result } from './Result';
import { IInvokableOptions, IResultOptions } from './options';

export function safeInvoke<T>(
  fn: T | ((...args: any[]) => T),
  options?: IInvokableOptions
): [T?, any?];

export function syncCall<T, E = Error, R extends Result<T, E> = Result<T, E>>(
  fn: T | ((...args: any[]) => T),
  options?: IResultOptions<T, E, R>
): R;

export function asyncCall<T, E = Error, R extends Result<T, E> = Result<T, E>>(
  arg: T | Promise<T> | ((...args: any[]) => T | Promise<T>),
  options?: IResultOptions<T, E, R>
): Promise<R>;
