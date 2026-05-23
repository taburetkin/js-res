import { Result } from './Result.js';
import { _bindedInvoke } from './invoke-api.js';
import { asyncCall, syncCall } from './invoke-api.js';


/**
 * Extended Result with chain methods for functional programming style.
 * 
 * ChainResult extends the base Result<T, E> class with methods that allow
 * chaining operations without breaking the flow. It supports both
 * synchronous (syncChain) and asynchronous (asyncChain) operations.
 * 
 * @template T
 * @template [E=Error]
 * @extends {Result<T, E>}
 * 
 * @example
 * // Synchronous chain
 * const result = syncChain(5)
 *   .syncChain(x => x * 2)
 *   .syncChain(x => x + 1)
 *   .match({ ok: v => v, err: e => -1 });
 * 
 * @example
 * // Asynchronous chain with await
 * const result = await asyncChain(() => fetch('/api'))
 *   .asyncChain(res => res.json())
 *   .asyncChain(data => data.id)
 *   .await()
 *   .match({ ok: id => id, err: e => null });
 */
export class ChainResult extends Result {

	/**
	 * Стандартный метод для поддержки await.
	 * Позволяет делать: const res = await asyncChain(...).asyncChain(...);
	 */
	then(onfulfilled, onrejected) {
		return this.await().then(onfulfilled, onrejected);
	}

	/**
	 * @template NT
	 * @param {NT | ((value: T, res: ChainResult<T, E>) => NT)} arg
	 * @param {import('./index.js').IResultOptions<ChainResult<NT, E>>} [options]
	 * @returns {ChainResult<NT, E>}
	 */
	syncChain(arg, options) {
		if (this.notOk) return this;

		options = Object.assign({ Class: this.constructor }, options);
		const invokeoptions = Object.assign({ invokeArgs:[this.value, this], invokeContext: this }, options);
			
		const [value, catchedError, toRes] = _bindedInvoke(arg, invokeoptions);

		if (catchedError) {
			return toRes(catchedError, options, true);
		} else {
			return toRes(value, options, false);
		}			
		
   }
	/**
	 * @template NT
	 * @param {NT | Promise<NT> | ((value: T, res: ChainResult<T, E>) => NT | Promise<NT>)} arg
	 * @returns {ChainResult<Promise<NT>, E>}
	 */
	asyncChain(arg, options) {
		if (this.notOk) return this;
		
		const opts = Object.assign({ Class: this.constructor }, options);

		const nextPromise = (async () => {
			// Разворачиваем текущее значение
			const result = await asyncCall(this.value, opts);
			if (result.notOk) return result;

			// Вызываем следующий шаг
			const callOptions = Object.assign({ invokeArgs: [result.value, result] }, opts);
			return asyncCall(arg, callOptions);
		})();
		
		return new this.constructor(nextPromise, undefined, false);
    }	
	 
    /**
     * Unwraps the internal Promise.
     * @returns {Promise<ChainResult<T extends Promise<infer U> ? U : T, E>>}
     */	 
    async await() {
		if (this.notOk) return this;
		const options = { Class: this.constructor }
		const result = await asyncCall(this.value, options)		
		return result;
    }	 
	}




/**
 * @template T
 * @template [E=Error]
 * @param {T | ((...args: any[]) => T)} arg
 * @param {import('./index.js').IResultOptions<ChainResult<T, E>>} [options]
 * @returns {ChainResult<T, E>}
 */
export function syncChain(arg, options) {
	options = Object.assign({ Class: ChainResult }, options)
	return syncCall(arg, options);
}


/**
 * Creates an asynchronous chain from a value or function.
 * 
 * Returns a ChainResult containing a Promise of the result.
 * Use .await() to unwrap the Promise when you need the value.
 * 
 * @template T
 * @template [E=Error]
 * @param {T | Promise<T> | ((...args: any[]) => T | Promise<T>)} arg
 * @param {import('./index.js').IResultOptions<ChainResult<Promise<T>, E>>} [options]
 * @returns {ChainResult<Promise<T>, E>}
 * 
 * @example
 * // From async function
 * const chain = asyncChain(() => fetch('/api'));
 * 
 * @example
 * // From Promise
 * const chain = asyncChain(Promise.resolve(42));
 * 
 * @example
 * // From value
 * const chain = asyncChain(42);
 * 
 * @example
 * // Full usage with await
 * const result = await asyncChain(() => fetch('/api'))
 *   .asyncChain(res => res.json())
 *   .await()
 *   .match({ ok: data => data, err: e => null });
 */
export function asyncChain(arg, options) {
	const opts = Object.assign({ Class: ChainResult }, options);
	const promise = asyncCall(arg, opts);
	return new ChainResult(promise, undefined, false);
}




