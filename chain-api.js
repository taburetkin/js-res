import { Result } from './Result.js';
import { _bindedInvoke } from './invoke-api.js';
import { asyncCall, syncCall } from './invoke-api.js';

export class ChainResult extends Result {
	syncChain(arg, options) {
		if (this.notOk) return this;

		options = Object.assign({ Class: ChainResult }, options);
		const [value, catchedError, toRes] = invoke(this, arg, options)

		if (catchedError) {
			return toRes(catchedError, options, true);
		} else {
			return toRes(value, options, false);
		}			
		
   }
	async asyncChain(arg, options) {
		if (this.notOk) return this;
		options = Object.assign({ Class: ChainResult }, options);
		const [promise, catchedError, toRes] = invoke(this, arg, options)		
		if (catchedError) {
			return toRes(catchedError, options, true);
		}	
		try {
			const value = await promise
			return toRes(value, options, false);
		} catch (error) {
			return toRes(error, options, true);
		}		
	}
}


function invoke(result, arg, options) {
	options = Object.assign({ invokeArgs:[result.value, result], invokeContext: result }, options)
	return _bindedInvoke(arg, options)
}


export function syncChain(arg, options) {
	options = Object.assign({ Class: ChainResult }, options)
	return syncCall(arg, options);
}

export async function asyncChain(arg, options) {
	options = Object.assign({ Class: ChainResult }, options)
	return asyncCall(arg, options)
}