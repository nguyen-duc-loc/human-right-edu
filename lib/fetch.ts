import handleError from "./handlers/error";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
  includeDefaultHeaders = true
): Promise<ActionResponse<T>> {
  const {
    timeout = 50000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  let headers: HeadersInit = { ...customHeaders };
  if (includeDefaultHeaders) {
    headers = { ...headers, ...defaultHeaders };
  }
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    return handleError(error) as ActionResponse<T>;
  }
}
