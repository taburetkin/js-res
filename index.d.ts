export interface ResultOptions<R extends Result = Result> {
  /** Функция для модификации экземпляра Result после его создания */
  init?: (res: R) => void;
  /** Контекст (this) для выполнения fn в safeInvoke/sync/async */
  invokeContext?: any;
  /** Аргументы для вызова fn. Принимает что угодно, обрабатывается через parseArgs */
  invokeArgs?: any;
  /** Любые дополнительные поля для кастомной логики */
  [key: string]: any;
}

/** Базовый контейнер данных */
export class Result<T = any, E = any> {
  constructor(value?: T, error?: E);
  readonly value: T | undefined;
  readonly error: E | undefined;
  readonly ok: boolean;
  readonly notOk: boolean;
}

/** 
 * ПУБЛИЧНОЕ ФУНКЦИОНАЛЬНОЕ API (Из коробки)
 */
export function OK<T>(value: T, options?: ResultOptions<Result<T, any>>): Result<T, any>;
export function ERR<E>(error: E, options?: ResultOptions<Result<any, E>>): Result<any, E>;
export function toResult<T>(arg: T | Result<T, any>, options?: ResultOptions, isFromCatchBlock?: boolean): Result<T, any>;

export function safeInvoke<T>(fn: (...args: any[]) => T, options?: ResultOptions): [T?, any?];
export function syncCall<T>(fn: (...args: any[]) => T, options?: ResultOptions): Result<T, any>;
export function asyncCall<T>(arg: Promise<T> | ((...args: any[]) => Promise<T>), options?: ResultOptions): Promise<Result<T, any>>;

/** 
 * API ДЛЯ ПОЛИМОРФИЗМА (Наследование)
 * R — тип класса Result, который будет возвращаться методами.
 */
export class Results<R extends Result = Result> {
  /** Ссылка на конструктор класса Result */
  Class: new (...args: any[]) => R;

  /** Создает экземпляр R (успех) */
  OK<T>(value: T, options?: ResultOptions<R>): R;
  /** Создает экземпляр R (ошибка) */
  ERR<E>(error: E, options?: ResultOptions<R>): R;
  /** Приводит значение к экземпляру R */
  toResult(arg: any, options?: ResultOptions<R>, isFromCatchBlock?: boolean): R;

  /** Безопасный вызов (Go-style) */
  safeInvoke(fn: Function, options?: ResultOptions<R>): [any?, any?];
  /** Синхронный вызов с возвратом R */
  sync(fn: Function, options?: ResultOptions<R>): R;
  /** Асинхронный вызов с возвратом Promise<R> */
  async(arg: any, options?: ResultOptions<R>): Promise<R>;

  /** Системные методы, доступные для переопределения */
  normalizeOptions(obj: any): ResultOptions<R>;
  parseArgs(args: any): any[];
}
