// Used the first the time the app is initialized

import "@shopify/shopify-api/adapters/node";
import {shopifyApi, ApiVersion, BillingInterval} from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2022-07';
import { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_ACCESS_TOKEN } from './secrets.js';

var Shopify = new shopifyApi({
  apiKey: 'd39567787cc8ffa48d498b40b2393477',
  adminApiAccessToken: SHOPIFY_API_ACCESS_TOKEN,
  apiSecretKey: SHOPIFY_API_SECRET_KEY,
  scopes: ['read_products'],
  hostName: 'hand-me-diamonds-staging.myshopify.com',
  shop: 'hand-me-diamonds-staging',
  hostScheme: 'https',
  apiVersion: ApiVersion.July22,
  isEmbeddedApp: false,
  isCustomStoreApp: true,
  customShopDomains: ['*.hand-me-diamonds-staging.myshopify.com'],
  restResources,
});

function callback(err, data, headers) {
  var api_limit = headers['http_x_shopify_shop_api_call_limit'];
  console.log( api_limit ); // "1/40"
};

const query_data = {
  limit: 10,
  fields: 'id,title,handle',
};


Shopify.get('/admin/products.json', query_data, function(err, data, headers){
  console.log(data); // Data contains product json information
  console.log(headers); // Headers returned from request
});



/*

// Use REST resources to make calls.
const { count: productCount } = await shopify.rest.Product.count({ session });
const { count: customerCount } = await shopify.rest.Customer.count({ session });
const { count: orderCount } = await shopify.rest.Order.count({ session });

console.log(
  `There are ${productCount} products, ${customerCount} customers, and ${orderCount} orders in the ${session.shop} store.`
);
*/