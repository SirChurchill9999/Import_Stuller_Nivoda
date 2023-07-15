import fetchMock from 'fetch-mock';
import makeRequest from './getAllProductIDs.js';

describe('makeRequest', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it('should resolve with all products', async () => {
    const products1 = [
      { id: 1, title: 'Product 1' },
      { id: 2, title: 'Product 2' },
    ];
    const products2 = [
      { id: 3, title: 'Product 3' },
      { id: 4, title: 'Product 4' },
    ];
    fetchMock.getOnce('https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/products.json', {
      headers: {
        Link: '<https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/products2.json>; rel="next"',
      },
      body: JSON.stringify(products1),
    });
    fetchMock.getOnce('https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/products2.json', {
      headers: {
        Link: '',
      },
      body: JSON.stringify(products2),
    });

    const result = await makeRequest();

    expect(result).toEqual([...products1, ...products2]);
  });

  it('should reject if fetch fails', async () => {
    fetchMock.getOnce('https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/products.json', {
      status: 500,
    });

    await expect(makeRequest()).rejects.toThrow();
  });
});