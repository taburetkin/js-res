/**
 * Represents a Result container that can be either a success (OK) or an error (ERR).
 * 
 * This is the core class of the library, providing a type-safe way to handle
 * operations that may fail without throwing exceptions.
 * 
 * @template T - Type of the success value
 * @template E - Type of the error value
 * 
 * @example
 * // Create a success result
 * const success = new Result('data', null);
 * console.log(success.ok);     // true
 * console.log(success.value);  // 'data'
 * 
 * @example
 * // Create an error result
 * const failure = new Result(undefined, 'error');
 * console.log(failure.ok);     // false
 * console.log(failure.error);  // 'error'
 */
export class Result {

	/**
	 * Creates a new Result instance.
	 * 
	 * @param {T} value - Success value (undefined if error)
	 * @param {E} error - Error value (null/undefined if success)
	 * @param {boolean} [forcedError=false] - Forces the result to be treated as error, even if error is null/undefined
	 * 
	 * @example
	 * // Normal success
	 * new Result('data', null);
	 * 
	 * @example
	 * // Normal error
	 * new Result(undefined, 'fail');
	 * 
	 * @example
	 * // Forced error (from ERR factory or catch block)
	 * new Result(undefined, null, true);  // ok will be false
	 * new Result(undefined, undefined, true);  // ok will be false
	 */	
	constructor(value, error, forcedError) {
		this.value = value;
		this.error = error;
		this.forcedError = !!forcedError;
	}

	/**
	 * Returns true if the Result represents a success.
	 * 
	 * A Result is successful when:
	 * - `forcedError` is false AND
	 * - `error` is null or undefined
	 * 
	 * @type {boolean}
	 * @readonly
	 * 
	 * @example
	 * const result = OK('data');
	 * if (result.ok) {
	 *     console.log('Success:', result.value);
	 * }
	 */	
	get ok(){ return !this.forcedError && this.error == null; }

	/**
	 * Returns true if the Result represents an error.
	 * 
	 * This is the inverse of the `ok` getter. Useful for positive checks
	 * when you want to avoid the logical NOT operator (`!`).
	 * 
	 * @type {boolean}
	 * @readonly
	 * 
	 * @example
	 * const result = ERR('fail');
	 * if (result.notOk) {
	 *     console.error('Error:', result.error);
	 * }
	 */	
	get notOk(){ return !this.ok; }

	/**
	 * Object-style pattern matching.
	 * 
	 * Takes an object with `ok` and `err` handlers and executes the appropriate one.
	 * This is syntactic sugar over the `fold` method.
	 * 
	 * @template U - Return type of the handlers (both must return the same type)
	 * @param {Object} handlers - Handler object
	 * @param {function(T, Result<T,E>): U} handlers.ok - Called when Result is successful
	 * @param {function(E, Result<T,E>): U} handlers.err - Called when Result is an error
	 * @returns {U} The return value from the executed handler
	 * 
	 * @example
	 * const result = OK(42);
	 * const message = result.match({
	 *     ok: (value) => `Success: ${value}`,
	 *     err: (error) => `Error: ${error}`
	 * });
	 * console.log(message); // 'Success: 42'
	 * 
	 * @example
	 * // Access to the result instance (e.g., forcedError flag)
	 * result.match({
	 *     ok: (value, res) => ({ value, forced: res.forcedError }),
	 *     err: (error, res) => ({ error, forced: res.forcedError })
	 * });
	 */	
	match(handlers) {
		return this.fold(handlers.ok, handlers.err);
	}

	/**
	 * Function-style pattern matching.
	 * 
	 * Takes two functions and executes the appropriate one based on the Result state.
	 * Both functions receive the result instance as their second argument.
	 * 
	 * @template U - Return type of the callbacks (both must return the same type)
	 * @param {function(T, Result<T,E>): U} onOk - Called when Result is successful
	 * @param {function(E, Result<T,E>): U} onErr - Called when Result is an error
	 * @returns {U} The return value from the executed callback
	 * 
	 * @example
	 * const result = ERR('fail');
	 * const code = result.fold(
	 *     (value) => 200,           // not called
	 *     (error) => error === 'fail' ? 400 : 500
	 * );
	 * console.log(code); // 400
	 * 
	 * @example
	 * // Using with async handlers
	 * const data = await result.fold(
	 *     async (value) => await saveToDb(value),
	 *     async (error) => await logError(error)
	 * );
	 * 
	 * @example
	 * // Access to result instance
	 * result.fold(
	 *     (value, res) => ({ value, forced: res.forcedError }),
	 *     (error, res) => ({ error, forced: res.forcedError })
	 * );
	 */	
	fold(onOk, onErr) {
		return this.ok ? onOk(this.value, this) : onErr(this.error, this);
	}

}
