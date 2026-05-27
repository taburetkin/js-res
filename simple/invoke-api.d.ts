import type { Result } from "./Result";
import { IResultOptions } from "./options";

export function syncCall<
	F extends (...args: any[]) => any, 
	E = Error, 
	R extends Result<ReturnType<F>, E> = Result<ReturnType<F>, E>
>(
	fn: F,
	options?: IResultOptions<ReturnType<F>, E, R>
): R;


export function syncCall<
	V, 
	E = Error, 
	R extends Result<V, E> = Result<V, E>
>(
	value: V,
	options?: IResultOptions<V, E, R>
): R;



export function asyncCall<
	F extends (...args: any[]) => any, 
	E = Error, 
	V = Awaited<ReturnType<F>>, 
	R extends Result<V, E> = Result<V, E> 
>(
	fn: F,
	options?: IResultOptions<V, E, R>
): Promise<R>; 


export function asyncCall<
	T, 
	E = Error, 
	V = Awaited<T>, 
	R extends Result<V, E> = Result<V, E>
>(
	value: T,
	options?: IResultOptions<V, E, R>
): Promise<R>;