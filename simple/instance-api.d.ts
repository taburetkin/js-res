import type { Result } from "./Result";
import { IResultOptions } from "./options";

export function OK<V, E, R extends Result<V, E>, O extends IResultOptions<V,E,R>>(
	arg: R | V | E,
	options?: O
) : R;

export function ERR<V, E, R extends Result<V, E>, O extends IResultOptions<V,E,R>>(
	arg: R | V | E,
	options?: O
) : R;

export function RES<V, E, R extends Result<V, E>, O extends IResultOptions<V,E,R>>(
	arg: R | V | E,
	options?: O
) : R;