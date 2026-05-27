import { Result } from "./Result.js";

function isResultClass(arg, Class) {
	if (typeof arg !== 'function') return false;
	return Class?.isPrototypeOf(arg) || arg === Class;
}


/**
 * 
 * creates an instance of Result
 * 
 * @param {boolean} ok 
 * @param {any} arg 
 * @param {IResultOptions} options 
 * @returns Result
 */
export function create(ok, arg, options, BaseClass) {
	const init = options?.init;
	let Class = isResultClass(this?.Class, Result) ? this?.Class : Result;
	const res = new Class(arg, ok !== true);
	if (typeof init === 'function') {
		init(res);
	}
	return res;
}