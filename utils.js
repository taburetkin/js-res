/**
 * An empty object shared across all normalizeOptions calls that receive non-objects.
 * Prevents unnecessary object allocations.
 * @type {Object}
 */
const emptyObject = {};

/**
 * Checks if a value is an object (non-null, typeof 'object').
 * @param {any} arg - Value to check
 * @returns {boolean} True if value is an object
 * @private
 */
function isObj(arg) {
	return arg && typeof arg === 'object';
}



/**
 * Normalizes input options for Result operations.
 *
 * Converts any input to a plain object for safe option handling.
 *
 * - If `obj` is a valid object, returns it as-is (no mutation, reference preserved)
 * - If `obj` is `null`, `undefined`, or not an object, returns `emptyObject`
 * - If `extendWith` is provided and is an object, merges its properties into the result
 *
 * This function does NOT clone nested objects. Use with custom options carefully.
 *
 * @example
 * // Normal object — returned as-is
 * normalizeOptions({ init: fn })                    // → { init: fn }
 *
 * @example
 * // Non-objects become empty object
 * normalizeOptions(null)                            // → {}
 * normalizeOptions(undefined)                       // → {}
 * normalizeOptions('string')                        // → {}
 *
 * @example
 * // Extend with default options
 * normalizeOptions({ a: 1 }, { b: 2 })              // → { a: 1, b: 2 }
 *
 * @example
 * // Extend overrides existing properties
 * normalizeOptions({ a: 1, b: 2 }, { b: 3 })        // → { a: 1, b: 3 }
 *
 * @param {any} obj - Input value to normalize
 * @param {Object} [extendWith] - Optional object to merge into result
 * @returns {Object} Normalized plain object
 */
export function normalizeOptions(obj, extendWith) {

	let res =  isObj(obj) ? obj : emptyObject;
	if (!isObj(extendWith)) return res;

	res = { ...res, ...extendWith }
	
	return res;
}


/**
 * Parses arguments for function invocation in safeInvoke/syncCall/asyncCall.
 *
 * Converts input to a proper argument array for `Function.apply()`.
 *
 * - If `args` is `null` or `undefined` → returns `[]` (empty array)
 * - If `args` is an array → returns it as-is (reference preserved)
 * - Otherwise throws an error (invalid type)
 *
 * This function is used internally when `invokeArgs` option is provided.
 *
 * @example
 * // Normal array — returned as-is
 * parseArgs([1, 2, 3])                            // → [1, 2, 3]
 *
 * @example
 * // Null/undefined become empty array
 * parseArgs(null)                                 // → []
 * parseArgs(undefined)                            // → []
 *
 * @example
 * // Non-array throws
 * parseArgs('not array')                          // throws Error
 * parseArgs(123)                                  // throws Error
 * parseArgs({})                                   // throws Error
 *
 * @param {any} args - Input to parse
 * @returns {any[]} Array of arguments
 * @throws {Error} If input is not null, undefined, or an array
 */
export function parseArgs(args) {
	if (args == null) return [];
	if (Array.isArray(args)) return args;
	throw new Error('invokeArgs must be array or undefined');
}

/**
 * Safely binds a method to a context with fallback.
 *
 * Utility for polymorphic context binding used in `Results` and `_res` functions.
 *
 * - If `method` is a function → returns the function bound to `context`
 * - Otherwise → returns `fallbackMethod` unchanged
 *
 * This allows methods to be overridden in subclasses while falling back to default implementations.
 *
 * @example
 * // Bind method to context
 * const obj = { value: 42 };
 * function getValue() { return this.value; }
 * const bound = bindThis(getValue, obj, null);
 * bound()                                         // → 42
 *
 * @example
 * // Non-function returns fallback
 * bindThis(null, ctx, defaultValue)              // → defaultValue
 * bindThis(undefined, ctx, defaultValue)         // → defaultValue
 * bindThis('not function', ctx, defaultValue)    // → defaultValue
 *
 * @param {any} method - Function to bind (or any value)
 * @param {any} context - Context to bind the function to
 * @param {Function} fallbackMethod - Function to return if method is not a function
 * @returns {Function} Bound function or fallback function
 */
export function bindThis(method, context, fallbackMethod) {
	if (typeof method === 'function') {
		return method.bind(context);
	}
	return fallbackMethod;
}