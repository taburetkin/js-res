import { Result, create, convert, OK, ERR, RES, safeInvoke, syncCall, asyncCall } from '../simple/index.js';

/**
 * this is a valid way to extend simple api with your custom logic.
 * just extend this class and create an instance of it.
 * 
 * @example
 * class MyResult extends Result { }
 * class MyResults extends Results {
 *   Class: MyResult
 * }
 * export const results = new MyResults();
 * or if you wish you can do it like this
 * const { OK, ERR, RES } = results.export();
 * export { OK, ERR, RES }
 */
export class Results 
{
	Class = Result;

	create = create;
	convert = convert;

	safeInvoke = safeInvoke;

	OK = OK;
	ERR = ERR;
	RES = RES;

	syncCall = syncCall;
	asyncCall = asyncCall;

	export() {
		let OK = this.OK.bind(this);
		let ERR = this.ERR.bind(this);
		let RES = this.RES.bind(this);
		let safeInvoke = this.safeInvoke.bind(this);
		let syncCall = this.syncCall.bind(this);
		let asyncCall = this.asyncCall.bind(this);
		return { OK, ERR, RES, safeInvoke, syncCall, asyncCall }
	}

}