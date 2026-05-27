import { CoreResult } from "./CoreResult";
import { IResultOptions } from "./options";

/**
 * This is a Matryoshka doll guard.  
 * I heard you like Result, but I'm sorry, I’m not putting a result inside your result. 
 * 
 * @example
 * // If you really need nesting, override this method like this
 * ```javascript
 * function(isOk, arg, options)  { return this.create(isOk, arg, options); }
 * ```
 * @param isOk 
 * @param arg 
 * @param options 
 */
export function convert<V, E, R extends CoreResult<V, E>, O extends IResultOptions<V,E,R>>(
	isOk: boolean | undefined, 
	arg: R | V | E,
	options?: O,
	BaseClass?: new (...args: []) => R
) : R;