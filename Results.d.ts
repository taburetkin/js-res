import { Result } from './Result';
import { IInvokableOptions, IResultOptions } from './options';
import * as instanceApi from './instance-api';
import * as invokeApi from './invoke-api';

export class Results {
  /** Свойство, определяющее, какой класс Result создавать (Полиморфизм) */
  Class: typeof Result;

  /** Копируем сигнатуры фабрик, привязанных к контексту */
  OK: typeof instanceApi.OK;
  ERR: typeof instanceApi.ERR;
  RES: typeof instanceApi.RES;
  
  /** Безопасный вызов */
  safeInvoke: typeof invokeApi.safeInvoke;

  /** Синхронный вызов (syncCall и алиас sync) */
  syncCall<T, E = Error, R extends Result<T, E> = Result<T, E>>(
    fn: T | ((...args: any[]) => T), 
    options?: IResultOptions<T, E, R>
  ): R;
  sync: this['syncCall'];

  /** Асинхронный вызов (asyncCall и алиас async) */
  asyncCall<T, E = Error, R extends Result<T, E> = Result<T, E>>(
    arg: T | Promise<T> | ((...args: any[]) => T | Promise<T>), 
    options?: IResultOptions<T, E, R>
  ): Promise<R>;
  async: this['asyncCall'];
}
