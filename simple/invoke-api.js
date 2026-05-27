import { safeInvoke } from "./safeInvoke.js";
import { convert } from './convert.js';

export function syncCall(fn, options) {
	const _safeInvoke = this?.safeInvoke || safeInvoke;
	const [value, catchedError] = _safeInvoke.call(this, fn, options);
	const _convert = this?.convert || convert;
	if (catchedError) {
		return _convert.call(this, false, catchedError, options);
	} else {
		return _convert.call(this, true, value, options);
	}	
}

export async function asyncCall(arg, options) {
	const _safeInvoke = this?.safeInvoke || safeInvoke;
	const [promise, catchedError] = _safeInvoke.call(this, arg, options);
	
	const _convert = this?.convert || convert;
	
	if (catchedError) {
		return _convert.call(this, false, catchedError, options);
	}
	try {
		const value = await promise
		return _convert.call(this, true, value, options);
	} catch (error) {
		return _convert.call(this, false, error, options);
	}
}