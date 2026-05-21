import { toResult } from "./instance-api.js";
import { normalizeOptions, parseArgs, bindThis } from './utils.js';
import { defaultContext } from './defaultContext.js';

export function _safeInvoke(fn, options) {
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

const safeInvoke = _safeInvoke.bind(defaultContext);

export function _syncCall(fn, options) {
	
	let _toResult = bindThis(this?.toResult, this, toResult);
	let _safeInvoke = bindThis(this?.safeInvoke, this, safeInvoke);

	const [value, catchedError] = _safeInvoke(fn, options);
	if (catchedError) {
		return _toResult(catchedError, options, true);
	} else {
		return _toResult(value, options, false);
	}	
}

export async function _asyncCall(arg, options) {
	let _toResult = bindThis(this?.toResult, this, toResult);
	let _safeInvoke = bindThis(this?.safeInvoke, this, safeInvoke);

	const [promise, catchedError] = _safeInvoke(arg, options);
	if (catchedError) {
		return _toResult(catchedError, options, true);
	}
	try {
		const value = await promise
		return _toResult(value, options, false);
	} catch (error) {
		return _toResult(error, options, true);
	}
}


const syncCall = _syncCall.bind(defaultContext);
const asyncCall = _asyncCall.bind(defaultContext);

export {
	safeInvoke, 
	syncCall,
	asyncCall
}