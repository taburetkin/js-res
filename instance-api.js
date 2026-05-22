import { Result } from './Result.js';
import { normalizeOptions, bindThis } from './utils.js';


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


export function OK(value, options) {
	const res =  _res.call(this, value, undefined, options);
	return res;
}

export function ERR(error, options, forcedError) {
	const res =  _res.call(this, undefined, error, options, forcedError);
	return res;
}

export function RES(arg, options, isFromCatchBlock) {
	let _normalizeOptions = bindThis(this?.normalizeOptions, this, normalizeOptions)
	options = _normalizeOptions(options);
	let BaseClass = this?.Class || Result;
	let Class = options.Class || BaseClass;
	let err = bindThis(this?.ERR, this,  ERR);
	let ok = bindThis(this?.OK, this,  OK);

	if (arg instanceof Class) {
		return arg;
	}

	if (arg instanceof BaseClass) {
		return new Class(arg.value, arg.error, arg.forcedError)
	}

	
	if (isFromCatchBlock) {
		return err(arg, options, true);
	}

	return ok(arg, options);
}

