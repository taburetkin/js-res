import { CoreResult } from './CoreResult.js';
import { create } from './create.js'

/**
 * Converts arg to Result. in case arg is already result there can be two scenarios:
 * 1. isOk is undefined or isOk is equal arg.isOk() - return same instance;
 * 2. isOk is booleand and not equal arg.isOk() - recreate Result with correct value or error;
 * 
 * @param {boolean | undefined} isOk 
 * @param {any} arg 
 * @param {IResultOptions} options 
 * @returns 
 */
export function convert(isOk, arg, options, BaseClass) {
	let thisCreate = this?.create || create;
	if (arg instanceof CoreResult) {
		if (
			isOk == null 
			|| (arg.isOk() === (isOk !== false))
		) return arg;
		arg = arg.isOk() ? arg.value : arg.error;
	}
	return thisCreate.call(this, isOk !== false, arg, options, BaseClass)
}