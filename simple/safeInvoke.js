const emptyObject = {}
const emptyArgs = []

export function normalizeArgs(args) {
	if (args == null || Array.isArray(args)) return args;
	throw new Error('invokeArgs must be array or undefined');
}

function isObj(arg) {
	return arg && typeof arg === 'object';
}

export function normalizeOptions(obj, extendWith) {

	let res =  isObj(obj) ? obj : emptyObject;
	if (!isObj(extendWith)) return res;

	res = { ...res, ...extendWith }
	
	return res;
}

export function safeInvoke(fn, options) {
	if (typeof fn !== 'function') return [fn];

	let _normalizeOptions = this?.normalizeOptions || normalizeOptions;
	options = _normalizeOptions.call(this, options);
	
	let { invokeContext, invokeArgs } = options;

	let _normalizeArgs = this?.normalizeArgs || normalizeArgs;
	invokeArgs = _normalizeArgs.call(this, invokeArgs);

	try {
		const value = fn.apply(invokeContext, invokeArgs || emptyArgs);
		return [value];
	} catch (error) {
		console.log('catched', error)
		return [undefined, error];
	}

}