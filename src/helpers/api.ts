interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

export async function http<T>(url: string): Promise<HttpResponse<T>> {
  let response: HttpResponse<T> = await fetch(url);

  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    response.parsedBody = await response.json();
  }
  return response;
}
