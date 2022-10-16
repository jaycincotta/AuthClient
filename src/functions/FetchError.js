// FetchError is a custom error returned by our Fetch extension of fetch
export default class FetchError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.name = "FetchError"
        this.statusCode = statusCode;
    }
}