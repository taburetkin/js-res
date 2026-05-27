import { Result } from './Result.js';
import { convert } from './convert.js';
/**
 * Converts arg to Result instace forcing to be OK.
 * Always return OK result even in case when arg is Err result
 * @param {any} arg 
 * @param {IResultOptions} options 
 * @returns Result
 */
export function OK(arg, options) {
	let thisConvert = this?.convert || convert;
	return thisConvert.call(this, true, arg, options, Result);
}

/**
 * Converts arg to Result instace forcing to be Err.
 * Always return Err result even in case when arg is Ok result
 * @param {any} arg 
 * @param {IResultOptions} options 
 * @returns Result
 */
export function ERR(arg, options) {
	let thisConvert = this?.convert || convert;
	return thisConvert.call(this, false, arg, options, Result);
}

/**
 * Converts arg to Result instace.
 * in case arg is already Result it will be returned as is
 * @param {any} arg 
 * @param {IResultOptions} options 
 * @returns Result
 * 
 * 
 * @example
 * RES(42) -> Result<number, Error>
 * RES<number, string>(42) -> Result<number, string>
 */
export function RES(arg, options) {
	let thisConvert = this?.convert || convert;
	return thisConvert.call(this, undefined, arg, options, Result);
}
