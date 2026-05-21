import { Result } from './Result.js';
import { normalizeOptions, bindThis } from './utils.js';
import { defaultContext } from './defaultContext.js';

function _res(value, error, options) {
	let Class = this?.Class || Result;
	const res = new Class(value, error);
	let _normalizeOptions = bindThis(this?.normalizeOptions, this, normalizeOptions)
	let { init } = _normalizeOptions(options);
	if (typeof init === 'function') {
		init(res);
	}
	return res;	
}


export function _ok(value, options) {
	const res =  _res.call(this, value, undefined, options);
	return res;
}

export function _err(error, options) {
	const res =  _res.call(this, undefined, error, options);
	return res;
}

export function _toResult(arg, options, isFromCatchBlock) {
	let Class = this?.Class || Result;
	let err = bindThis(this?.ERR, this,  ERR);
	let ok = bindThis(this?.OK, this,  OK);

	if (arg instanceof Class) {
		return arg;
	}
	
	if (isFromCatchBlock) {
		return err(arg, options);
	}

	return ok(arg, options);
}

const OK = _ok.bind(defaultContext);
const ERR = _err.bind(defaultContext);
const toResult = _toResult.bind(defaultContext);

export {
	OK,
	ERR,
	toResult
}