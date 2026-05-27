import { Result, asyncCall, convert, create } from '../simple/index.js'
let index = 0;
export class ChainResult extends Result
{
	constructor(isok, arg) {
		super(isok, arg);
		this.cid = ++index;
		console.log('created #', this.cid, 'ok:', isok);
		if (index > 10) {
			throw new Error('overflow')
		}
	}

	// async then(onfulfilled, onrejected) {
	// 	console.log('then #', this.cid);
	// 	let value, error, isOk;
	// 	try {
	// 		value = await this.value;
	// 		console.log('then fullfiled #', this.cid, this.value, value);
	// 		//return res.isOk() ? onfulfilled(res) : onrejected(res);
	// 	} catch (exc) {
	// 		value = exc;
	// 		isOk = false;
	// 		console.log('then rejected #', this.cid);
	// 	}
	// 	const res = this.convert(isOk, value);
	// 	return onfulfilled(res);
	// 	//return this.value.then(onfulfilled, onrejected)
	// }

	// #toPromise(arg) {
	// 	if (arg instanceof Promise || typeof arg?.then === 'function') {
	// 		return arg;
	// 	} else {
	// 		return Promise.resolve(arg);
	// 	}
	// }

	// map(fn, options) {
	// 	if (typeof fn !== 'function' || !this.isOk()) return this;
	// 	const [value, error] = this.safeInvoke(() => fn(this.value));
	// 	if (error) {
	// 		return this.convert(false, error, options);
	// 	}
	// 	return this.convert(true, value, options);
	// }

	// mapAsync(arg, options) {

	// 	const next = this.value.then(awaited => {
	// 		let [invoked, err] = this.safeInvoke(arg, { invokeArgs: [awaited, this]});
	// 		if (err) { return Promise.reject(err); }
	// 		return Promise.resolve(invoked);
	// 	})
	// 	return this.convert(true, next, options);
	// }	
	
	// await() {
	// 	if (!this.isOk()) return this;
	// 	const result = asyncCall.call(this, this.value)
	// 	return result;
	// }	 

	convert(isOk, arg, options) {
		return convert.call(this, isOk, arg, options, this.constructor);
	}

	create(isOk, arg, options) {
		return create.call(this, isOk, arg, options, this.constructor);
	}
}