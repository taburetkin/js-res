/**
 * Result represents a state containing either a value or an error.
 * 
 * @description
 * BY DESIGN: Use OK(), ERR(), or RES() factories instead of the constructor.
 * 
 * Manual instantiation rules:
 * 1. The first argument is the payload (assigned to `value` if OK, or `error` if !OK).
 * 2. The second argument is optional and any truthy value applies error state to result.
 * 
 * @example
 * new Result(arg) - OK, value: arg
 * new Result(arg, true) - !OK, error: arg
 */
export class Result {
	#ok;
	constructor(arg, isError) {
		let ok = this.#ok = !isError;
		this.value = ok ? arg : undefined;
		this.error = !ok ? arg : undefined;
	}
	isOk() { return this.#ok }
	get ok() { return this.isOk(); }
	get notOk() { return !this.isOk(); }
}