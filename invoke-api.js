import { RES } from "./instance-api.js";
import { normalizeOptions, parseArgs, bindThis } from './utils.js';


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

export function _bindedInvoke(fn, options) {
	let _toResult = bindThis(this?.RES, this, RES);
	let _safeInvoke = bindThis(this?.safeInvoke, this, safeInvoke);
	let [v,e] = _safeInvoke(fn, options);	
	return [v, e, _toResult];
}

export function syncCall(fn, options) {
	const [value, catchedError, toRes] = _bindedInvoke(fn, options)
	if (catchedError) {
		return toRes(catchedError, options, true);
	} else {
		return toRes(value, options, false);
	}	
}

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
