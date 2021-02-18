import {http} from "./api";

describe('api helper', () => {
  it('returns result', async () => {
    const fetchResponse = Promise.resolve({
        ok  : true,
        json: () => Promise.resolve({test: 42}),
      }) as Promise<Response>;
    jest.spyOn(window, 'fetch').mockReturnValue(fetchResponse);
    const response = await http('/some-url');

    expect(response.parsedBody).toEqual({test: 42});
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('throws error', async () => {
    const fetchErrorResponse = Promise.resolve({
      ok        : false,
      statusText: 'this is status text',
      json      : () => Promise.resolve({test: 42}),
    }) as Promise<Response>;
    jest.spyOn(window, 'fetch').mockReturnValue(fetchErrorResponse);

    await http('/some-url').catch(error => {
      expect(error).toEqual(new Error('this is status text'));
    })
  });
});
