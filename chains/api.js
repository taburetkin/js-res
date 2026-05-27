import { asyncCall } from "../simple/invoke-api.js";
import { safeInvoke } from "../simple/safeInvoke.js";
import { ChainResult } from "./ChainResult.js";
import { convert } from '../simple/convert.js';
import { CoreResult

 } from "../simple/CoreResult.js";
export function asyncChain(arg, options) {

	const [value, error] = safeInvoke(arg, options);
	if (error) {
		return new ChainResult(false, Promise.reject(error));
	}

		let [extracted, extractedError] = value instanceof CoreResult 
			? value.isOk() ? [value.value] : [undefined, value.error]
			: [value];
		let ok = extractedError == null;
		let promise = !ok ? Promise.reject(extractedError)
								: promisify(extracted)

		return new ChainResult(ok, promise);
}

async function promisify(arg) {
	if (arg == null) return arg;
	let result = await arg;
	return result;
}