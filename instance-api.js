import { Result } from './Result.js';
import { normalizeOptions, bindThis } from './utils.js';

/**
 * Internal factory function for creating Result instances.
 * 
 * @private
 * @template T
 * @template [E=Error]
 * @template {import('./index.js').Result<T, E>} R
 * @param {any} value - Success value
 * @param {any} error - Error value
 * @param {import('./index.js').IResultOptions<R>} options - User options
 * @param {boolean} [forcedError=false] - Forces error state
 * @returns {R} New Result instance
 */
function _res(value, error, options, forcedError) {
	let _normalizeOptions = bindThis(this?.normalizeOptions, this, normalizeOptions)
	options = _normalizeOptions(options);
	let Class = options.Class || this?.Class || Result;
	const res = new Class(value, error, forcedError === true);
	const init = options.init;
	if (typeof init === 'function') {
		init(res);
	}
	return res;	
}

/**
 * Creates a success Result (OK state).
 * 
 * @template T
 * @template [E=Error]
 * @template {import('./index.js').Result<T, E>} R
 * @param {T} value - Success value
 * @param {import('./index.js').IResultOptions<R>} [options] - Optional configuration
 * @returns {R} Success Result
 */
export function OK(value, options) {
	const res =  _res.call(this, value, undefined, options);
	return res;
}


/**
 * Creates an error Result (ERR state).
 * 
 * The returned Result has `ok = false` and `notOk = true`.
 * The `forcedError` flag is set to true, ensuring `ok` is false even if `error` is null/undefined.
 * 
 * @template E
 * @template {import('./index.js').Result} R
 * @param {E} error - Error value
 * @param {import('./index.js').IResultOptions<R>} [options] - Optional configuration
 * @param {(res: R) => void} [options.init] - Hook called after Result creation
 * @param {new (...args: any[]) => R} [options.Class] - Custom Result class constructor to instantiate
 * @param {boolean} [forcedError=true] - Internal flag (defaults to true for ERR)
 * @returns {R} Error Result
 * 
 * @example
 * // Basic error
 * const result = ERR('something went wrong');
 * console.log(result.error); // 'something went wrong'
 * console.log(result.ok);    // false
 * 
 * @example
 * // Even null becomes an error (thanks to forcedError)
 * const result = ERR(null);
 * console.log(result.ok);    // false
 * 
 * @example
 * // With init hook
 * const result = ERR('error', {
 *     init: (r) => console.log('Error created:', r.error)
 * });
 * 
 * @example
 * // Custom Result class
 * class MyResult extends Result {}
 * const result = ERR('fail', { Class: MyResult });
 * console.log(result instanceof MyResult); // true
 */
export function ERR(error, options, forcedError) {
	const res =  _res.call(this, undefined, error, options, forcedError);
	return res;
}

/**
 * Converts any value to a Result.
 * 
 * @template T
 * @template E
 * @template {import('./index.js').Result} R
 * @param {T | import('./index.js').Result<T, E>} arg - Value or existing Result
 * @param {Object} [options] - Optional configuration
 * @param {(res: R) => void} [options.init] - Hook called after Result creation
 * @param {new (...args: any[]) => R} [options.Class] - Custom Result class to instantiate
 * @param {boolean} [isFromCatchBlock=false] - If true, treat as error
 * @returns {import('./index.js').Result<T, E>} Converted Result
 */
export function RES(arg, options, isFromCatchBlock) {
	let _normalizeOptions = bindThis(this?.normalizeOptions, this, normalizeOptions)
	options = _normalizeOptions(options);
	let BaseClass = this?.Class || Result;
	let Class = options.Class || BaseClass;
	let err = bindThis(this?.ERR, this,  ERR);
	let ok = bindThis(this?.OK, this,  OK);

	if (isFromCatchBlock) {
		const errorVal = arg instanceof BaseClass ? arg.error || arg.value : arg;
		return err(errorVal, options, true);
	}

	if (arg instanceof Class) {
		return arg;
	}

	if (arg instanceof BaseClass) {
		return new Class(arg.value, arg.error, arg.forcedError)
	}


	return ok(arg, options);
}

