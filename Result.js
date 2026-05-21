export class Result {

	constructor(value, error) {
		this.value = value;
		this.error = error;
	}

	get ok(){ return this.error == null; }
	get notOk(){ return !this.ok; }

}
