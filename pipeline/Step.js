export class Step {

	#tasks
	#api

	constructor(arg, actOnError, isObserver, api) {
		this.#tasks = [];
		this.#api = api;
		this.actOnError = actOnError;
		this.isObserver = isObserver;
		if (Array.isArray(arg)) {
			this.#tasks = [...arg];
		} else {
			this.#tasks = [arg];
		}
	}

	go(prevTaskResult) {
		let results = []
		let isAsync;
		let api = this.#api;
		
		let shouldDo = (prevTaskResult ? prevTaskResult.isOk() : true) === !this.actOnError;
		
		if (!this.#tasks.length || !shouldDo) {
			return prevTaskResult || api.OK();
		}


		
			for(let task of this.#tasks) {
				
				let [value, error] = api.safeInvoke(task, { invokeArgs: [prevTaskResult?.value, prevTaskResult] });
				let taskResult;
				if (error != null) {
					taskResult = api.convert(false, error);
				}
				else if (!isThenable(value)) {
					taskResult = api.convert(true, value)
				}
				else {
					let promise = value;
					taskResult = promise.then(value => api.convert(undefined, value), error => api.convert(true, error))
							.catch(error => api.convert(true, error));
					isAsync = true;

				}

				results.push(taskResult);
			}

			
		this.isAsync = isAsync;


		if (results.length === 1) {
			this.result = results[0]
			return this.result;
		}
		
		let aggregated;
		if (isAsync) {
			aggregated = Promise.all(results)
				.then(awaitedResults => aggregate(awaitedResults, api)).catch(error => api.convert(true, error))
		}
		else {
			aggregated = aggregate(results, api);
		}
		
		this.result = aggregated;
		return this.result;
	}

}

function aggregateItem(index, res) {
	const ok = res.isOk();
	const selected = ok ? res.value : res.error;
	const key = ok ? 'value' : 'error';
	return {
		index,
		ok, 
		[key]: selected
	}
}
function aggregate(results, api) {
	let errors = [];
	const values = [];
	for(let index = 0; index < results.length; index++) {
		const res = results[index];
		let ok = res.isOk();
		let item = aggregateItem(index, res);
		let arr = ok ? values : errors;
		arr.push(item);
	}
	if (!errors.length) { errors = undefined; }
	const aggregateResult = { errors, values }
	return api.convert(!!aggregateResult.errors, aggregateResult);
}

function isThenable(arg) {
	return arg instanceof Promise || typeof arg?.then === 'function';
}
