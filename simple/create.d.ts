import { CoreResult } from "./CoreResult";
import { IResultOptions } from "./options";
/**
 * The official assembly line for your Result instances - a factory method!
 * 
 * 
 * @param ok 
 * @param arg 
 * @param options 
 */
export function create<V, E, R extends CoreResult<V, E>, O extends IResultOptions<V,E,R>>(
	ok: boolean, 
	arg: V | E,
	options?: O,
	BaseClass?: new (...args: []) => R
) : R;