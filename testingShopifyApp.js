//var shopifyAPI = require('shopify-node-api');
import "@shopify/shopify-api/adapters/node";
//import { shopify } from "@shopify/shopify-api";
import { shopifyApi, ApiVersion, Session } from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2023-04'; // 2022-07

var Shopify = new shopifyApi({
  apiSecretKey: "9a2ff22ebe3e683c84188812127a2c5d",            // Note: this is the API Secret Key, NOT the API access token
  apiVersion: ApiVersion.April23,
  isCustomStoreApp: true,                        // this MUST be set to true (default is false)
  adminApiAccessToken: "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", // Note: this is the API access token, NOT the API Secret Key
  isEmbeddedApp: false,
  hostName: "hand-me-diamonds-staging.myshopify.com",
  // Mount REST resources.
  restResources,

  /*
  shop: 'hand-me-diamonds-staging.myshopify.com', // MYSHOP.myshopify.com
  shopify_api_key: 'd39567787cc8ffa48d498b40b2393477', // Your API key
  access_token: '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' // Your API password
  */

});

Shopify.get('/admin/products.json', function(err, data, headers){
  console.log(data); // Data contains product json information
  console.log(headers); // Headers returned from request
});

const session = Shopify.session.customAppSession("hand-me-diamonds-staging.myshopify.com");

// Use REST resources to make calls.
const { count: productCount } = await Shopify.rest.Product.count({ session });
const { count: customerCount } = await Shopify.rest.Customer.count({ session });
const { count: orderCount } = await Shopify.rest.Order.count({ session });

console.log(
  `There are ${productCount} products, ${customerCount} customers, and ${orderCount} orders in the ${session.shop} store.`
);