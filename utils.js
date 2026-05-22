
const emptyObject = {};


function isObj(arg) {
	return arg && typeof arg === 'object';
}

export function normalizeOptions(obj, extendWith) {

	let res =  isObj(obj) ? obj : emptyObject;
	if (!isObj(extendWith)) return res;

	res = { ...res, ...extendWith }
	
	return res;
}

export function parseArgs(args) {
	if (args == null) return [];
	if (Array.isArray(args)) return args;
	throw new Error('invokeArgs must be array or undefined');
}

export function bindThis(method, context, fallbackMethod) {
	if (typeof method === 'function') {
		return method.bind(context);
	}
	return fallbackMethod;
}