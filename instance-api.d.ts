// instance-api.d.ts

/**
 * OK<number> -> Result<number, Error>
 */
export function OK<T, E = Error, R extends Result<T, E> = Result<T, E>>(
  value: T, 
  options?: IResultOptions<T, E, R>
): R;

/**
 * ERR('stop') -> Result<any, string> (если указать тип явно)
 * ERR(new Error()) -> Result<any, Error> (по умолчанию)
 */
export function ERR<E = Error, T = any, R extends Result<T, E> = Result<T, E>>(
  error: E, 
  options?: IResultOptions<T, E, R>,
  forcedError?: boolean
): R;
