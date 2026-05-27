import { Result, safeInvoke, convert, create, OK } from '../simple/index.js';
import { Step } from './Step.js';

export class Pipeline
{
	#steps;

	constructor() {
		this.#steps = []
		this.api = {
			Class: Result,
			safeInvoke, convert, create, OK
		}
	}

	Step = Step

	#create(arg, actOnError, isObserver) {
		const step = new this.Step(arg, actOnError, isObserver, this.api);
		this.#steps.push(step);
		return this;
	}

	step(arg) { 
		const step = new this.Step(arg, false, false, this.api);
		this.#steps.push(step);
		return this;
	}

	onOk(arg) {
		return this.#create(arg, false, true)
	}

	onErr(arg) {
		return this.#create(arg, true, true)
	}

	on(onOk, onErr) {
		this.onOk(onOk);
		return this.onErr(onErr);
	}

	async go() {
		let prevStepResult;
		let pipeResult;
		for(let step of this.#steps) {

			let stepResult = await step.go(pipeResult);
			if (pipeResult && !pipeResult.isOk()) continue;

			if (!stepResult.isOk() || !step.isObserver)
			{
				pipeResult = stepResult;
			}
		}
		return pipeResult || this.api.OK();
	}

}

export function step(arg) {
	const pipe = new Pipeline();
	return pipe.step(arg);
}