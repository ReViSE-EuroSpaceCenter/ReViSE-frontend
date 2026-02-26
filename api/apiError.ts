export class ApiError extends Error {
	constructor(public readonly key: string) {
		super(key);
		this.name = "ApiError";
	}
}