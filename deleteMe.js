/**
 * FILEPATH: /Users/christopherkonicki/Documents/GitHub/Import_Stuller_Nivoda/deleteMe.js
 * 
 * This script imports all products from a Shopify store using the Shopify REST API.
 * It uses the 'shopify' and 'session' objects from the 'testingShopifyApp.js' file.
 * 
 * The 'makeRequest' function makes a request to the Shopify API to get all products.
 * It uses pagination to get all products, since the API returns a maximum of 250 products per request.
 * 
 * The 'allProducts' array stores all products retrieved from the API.
 * The 'since_id' variable is used to keep track of the last product ID retrieved from the API.
 * 
 * The function returns a Promise that resolves with the 'allProducts' array when all products have been retrieved.
 */
// In another .js file in the same directory
import { shopify } from './testingShopifyApp.js';
import { session } from './testingShopifyApp.js';
import "@shopify/shopify-api/adapters/node";

const client = new shopify.clients.Rest({session});

let allProducts = [];
let since_id = 0;

/**
 * This function makes a request to the Shopify API to get all products.
 * It uses pagination to get all products, since the API returns a maximum of 250 products per request.
 * 
 * The 'nextLink' parameter is used to specify the URL of the next page of products to retrieve.
 * If no 'nextLink' is provided, the function starts by retrieving the first page of products.
 * 
 * The function returns a Promise that resolves with an array of all products retrieved from the API.
 */
function makeRequest(nextLink = 'https://{EXAMPLE}.com/admin/api/2023-04/products.json') {
    return new Promise((resolve, reject) => {
        let products = [];
        // Make a request to the Shopify API to get the next page of products
        fetch(nextLink).then(async r => {
            // If this is the first page of products, use the Shopify REST API to get all products
            if (since_id === 0) {
                products = await shopify.rest.Product.all({
                    session,
                    query: {
                        since_id: 0,
                        fields: 'id,title,images',
                    },
                });
                allProducts = allProducts.concat(products);
                console.log('All products so far: ', allProducts[0]);
            };
            // If this is not the first page of products, use the 'since_id' parameter to get all products since the last product retrieved
            if (since_id !== 0) {
                let headerLink = products.headers.Link[0];
                while (headerLink) {
                    products = await shopify.rest.Product.all({
                        session,
                        query: {
                            since_id: since_id,
                            fields: 'id,title,images',
                        },
                    });
                    allProducts = allProducts.concat(products);
                    console.log('All products so far: ', allProducts[0]);
                    headerLink = products.headers.Link[0];
                }
            }
            // Get the URL of the next page of products from the 'Link' header of the API response
            const headerLink = products.headers.Link[0];
            const match = headerLink.match(/<[^;]+\/(\w+\.json[^;]+)>;\srel="next"/);
            const nextLink = match ? `https://{EXAMPLE}.com/admin/api/2023-04/${match[1]}` : false;
            console.log('The next link: ', nextLink);
            // If there is a next page of products, recursively call this function with the URL of the next page
            if (nextLink) {
                makeRequest(nextLink);
            } else {
                // If there are no more pages of products, resolve the Promise with the array of all products retrieved
                resolve(allProducts[0]);
            }
        }).catch(reject);
    });
}

// Call the 'makeRequest' function to start retrieving all products from the Shopify API
makeRequest();