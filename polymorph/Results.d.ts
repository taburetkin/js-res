
import { Result, create, convert, OK, ERR, RES } from '../simple/index.js';

export interface IResultsExports
{
	OK: typeof OK
	ERR: typeof ERR
	RES: typeof RES
}

export class Results<R extends Result<V, E>> {
	Class: new (...args: any[]) => R

	create: typeof create
	convert: typeof convert

	OK: typeof OK
	ERR: typeof ERR
	RES: typeof RES

	export() : IResultsExports

}