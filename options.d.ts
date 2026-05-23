// options.d.ts
import { Result } from './Result';

/**
 * Базовые опции для вызова функций через safeInvoke / syncCall / asyncCall.
 */
export interface IInvokableOptions {
  /** Контекст исполнения (this) для вызываемой функции */
  invokeContext?: any;
  /** Аргументы, которые будут переданы в функцию через .apply() */
  invokeArgs?: any[];
}

/**
 * Расширенные опции для создания Result.
 * 
 * @template T - Тип успешного значения
 * @template E - Тип ошибки
 * @template R - Класс Result или его наследник
 */
export interface IResultOptions<
  T = any, 
  E = Error, 
  R extends Result<T, E> = Result<T, E>
> extends IInvokableOptions {
  
  /** 
   * Конструктор класса, который будет создан.
   * Позволяет подменить стандартный Result на ваш кастомный класс.
   */
  Class?: new (...args: any[]) => R;

  /** 
   * Хук (функция обратного вызова), которая выполняется сразу после создания экземпляра.
   * Позволяет донастроить объект res до того, как он вернется из фабрики.
   */
  init?: (res: R) => void;
}
