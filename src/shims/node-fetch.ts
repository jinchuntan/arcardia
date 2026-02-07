// Browser shim for packages that import "node-fetch".
// In the browser, use native fetch.

const nodeFetch: typeof fetch = (...args) => fetch(...args);

export default nodeFetch;

export const Headers = globalThis.Headers;
export const Request = globalThis.Request;
export const Response = globalThis.Response;
