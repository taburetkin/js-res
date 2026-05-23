/**
 * Представляет контейнер Result, который может быть либо успешным (OK), либо ошибкой (ERR).
 * 
 * @template T - Тип успешного значения (по умолчанию any)
 * @template E - Тип значения ошибки (по умолчанию Error)
 */
export class Result<T = any, E = Error> {
  /** Успешное значение (undefined, если произошла ошибка) */
  readonly value: T | undefined;

  /** Значение ошибки (null/undefined, если успех или если ошибка не задана явно) */
  readonly error: E | null | undefined;

  /** Флаг принудительной трактовки результата как ошибки */
  readonly forcedError: boolean;

  /**
   * Создает новый экземпляр Result.
   * 
   * @param value - Успешное значение
   * @param error - Значение ошибки
   * @param forcedError - Принудительно помечает результат как ошибку
   */
  constructor(value: T | undefined, error: E | null | undefined, forcedError?: boolean);

  /** 
   * Возвращает true, если результат успешный.
   * Результат считается успешным, если forcedError = false И error == null.
   */
  readonly ok: boolean;

  /** Возвращает true, если результат содержит ошибку (инверсия ok) */
  readonly notOk: boolean;

  /**
   * Объектный паттерн-матчинг.
   * Принимает объект с обработчиками ok и err.
   * 
   * @template U - Тип возвращаемого значения (одинаковый для обоих обработчиков)
   */
  match<U>(handlers: {
    ok: (value: T, res: Result<T, E>) => U;
    err: (error: E | null | undefined, res: Result<T, E>) => U;
  }): U;

  /**
   * Функциональный паттерн-матчинг.
   * Выполняет соответствующий колбэк в зависимости от состояния Result.
   * 
   * @template U - Тип возвращаемого значения
   */
  fold<U>(
    onOk: (value: T, res: Result<T, E>) => U,
    onErr: (error: E | null | undefined, res: Result<T, E>) => U
  ): U;
}
