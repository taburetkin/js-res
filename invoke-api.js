import { RES } from "./instance-api.js";
import { normalizeOptions, parseArgs, bindThis } from './utils.js';

/**
 * Go-style safe invocation that catches errors and returns a tuple.
 * 
 * This function is the foundation for both syncCall and asyncCall.
 * It's designed to work with polymorphic `this` context (for Results class).
 * 
 * @template T
 * @param {T | ((...args: any[]) => T)} fn - Function to invoke or plain value
 * @param {import('./index.js').IInvokableOptions} [options] - Optional configuration
 * @returns {[T?, any?]} Tuple of [value, error] (one of them will be undefined)
 * 
 * @example
 * // Success — returns [value, undefined]
 * const [val, err] = safeInvoke(() => 42);
 * console.log(val); // 42
 * console.log(err); // undefined
 * 
 * @example
 * // Error — returns [undefined, error]
 * const [val, err] = safeInvoke(() => { throw 'error'; });
 * console.log(val); // undefined
 * console.log(err); // 'error'
 * 
 * @example
 * // Non-function value — returns [value, undefined]
 * const [val, err] = safeInvoke(42);
 * console.log(val); // 42
 * 
 * @example
 * // With context and arguments
 * const ctx = { multiplier: 2 };
 * const [val, err] = safeInvoke(
 *     function(x) { return x * this.multiplier; },
 *     { invokeContext: ctx, invokeArgs: [5] }
 * );
 * console.log(val); // 10
 */
export function safeInvoke(fn, options) {
	if (typeof fn !== 'function') return [fn];

	let _normalizeOptions = bindThis(this?.normalizeOptions, this, normalizeOptions);
	options = _normalizeOptions(options);
	
	let { invokeContext, invokeArgs } = options;

	let _parseArgs = bindThis(this?.parseArgs, this, parseArgs);
	invokeArgs = _parseArgs(invokeArgs);

	try {
		const value = fn.apply(invokeContext, invokeArgs);
		return [value];
	} catch (error) {
		return [undefined, error];
	}

}

/**
 * Internal function that binds the RES converter to the invocation result.
 * 
 * @private
 * @param {any} fn - Function or value to invoke
 * @param {import('./index.js').IInvokableOptions} options - Optional configuration
 * @returns {[any?, any?, Function]} Tuple of [value, error, toResultConverter]
 */
export function _bindedInvoke(fn, options) {
	let _toResult = bindThis(this?.RES, this, RES);
	let _safeInvoke = bindThis(this?.safeInvoke, this, safeInvoke);
	let [v,e] = _safeInvoke(fn, options);	
	return [v, e, _toResult];
}



/**
 * Synchronous call wrapper that converts thrown errors into Result.
 * 
 * This function executes a function (or returns a value) and wraps the result
 * in a Result container. If the function throws, the error becomes an ERR Result.
 * 
 * @template T
 * @template [E=Error]
 * @template {import('./index.js').Result<T, E>} [R=import('./index.js').Result<T, E>]
 * @param {T | ((...args: any[]) => T)} fn - Function to execute or plain value
 * @param {import('./index.js').IResultOptions<R>} [options] - Optional configuration
 * @returns {R} Result container
 * 
 * @example
 * // Successful execution
 * const result = syncCall(() => 42);
 * if (result.ok) {
 *     console.log(result.value); // 42
 * }
 * 
 * @example
 * // Throwing function becomes error
 * const result = syncCall(() => { throw 'error'; });
 * if (result.notOk) {
 *     console.log(result.error); // 'error'
 * }
 * 
 * @example
 * // Plain value
 * const result = syncCall(42);
 * console.log(result.value); // 42
 * console.log(result.ok);    // true
 */
export function syncCall(fn, options) {
	const [value, catchedError, toRes] = _bindedInvoke(fn, options)
	if (catchedError) {
		return toRes(catchedError, options, true);
	} else {
		return toRes(value, options, false);
	}	
}



/**
 * Asynchronous call wrapper that converts rejections and thrown errors into Result.
 * 
 * This function executes an async function, waits for a Promise, or returns a plain value,
 * and wraps the result in a Result container. If the Promise rejects or the function throws,
 * the error becomes an ERR Result.
 * 
 * @template T
 * @template [E=Error]
 * @template {import('./index.js').Result<T, E>} [R=import('./index.js').Result<T, E>]
 * @param {T | Promise<T> | ((...args: any[]) => T | Promise<T>)} arg - Async function, Promise, or plain value
 * @param {import('./index.js').IResultOptions<R>} [options] - Optional configuration
 * @returns {Promise<R>} Promise of Result container
 * 
 * @example
 * // Async function
 * const result = await asyncCall(async () => 42);
 * if (result.ok) {
 *     console.log(result.value); // 42
 * }
 * 
 * @example
 * // Promise
 * const result = await asyncCall(Promise.resolve(42));
 * if (result.ok) {
 *     console.log(result.value); // 42
 * }
 * 
 * @example
 * // Rejected Promise becomes error
 * const result = await asyncCall(Promise.reject('error'));
 * if (result.notOk) {
 *     console.log(result.error); // 'error'
 * }
 * 
 * @example
 * // Plain value
 * const result = await asyncCall(42);
 * console.log(result.value); // 42
 */
export async function asyncCall(arg, options) {
	const [promise, catchedError, toRes] = _bindedInvoke(arg, options);

	if (catchedError) {
		return toRes(catchedError, options, true);
	}

	try {
		const value = await promise
		return toRes(value, options, false);
	} catch (error) {
		return toRes(error, options, true);
	}
}
