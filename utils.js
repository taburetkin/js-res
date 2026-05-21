
const emptyObject = {};

export function normalizeOptions(obj) {
	return obj && typeof obj === 'object' ? obj : emptyObject;
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