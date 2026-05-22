export class Result {

	constructor(value, error, forcedError) {
		this.value = value;
		this.error = error;
		this.forcedError = !!forcedError;
	}

	get ok(){ return !this.forcedError && this.error == null; }
	get notOk(){ return !this.ok; }

	match(handlers) {
		return this.fold(handlers.ok, handlers.err);
	}

	fold(onOk, onErr) {
		return this.ok ? onOk(this.value, this) : onErr(this.error, this);
	}

}
