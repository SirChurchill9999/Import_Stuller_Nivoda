import "@shopify/shopify-api/adapters/node";
import {shopifyApi, ApiVersion, BillingInterval} from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2022-07';

const shopify = shopifyApi.shopify;
const session = shopifyApi.createCustomAppSession({
    shop: 'hand-me-diamonds-staging.myshopify.com',
    accessToken: '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',
});

// Use REST resources to make calls.
const { count: productCount } = await shopify.rest.Product.count({ session });
const { count: customerCount } = await shopify.rest.Customer.count({ session });
const { count: orderCount } = await shopify.rest.Order.count({ session });

console.log(
  `There are ${productCount} products, ${customerCount} customers, and ${orderCount} orders in the ${session.shop} store.`
);

function callback(err, data, headers) {
    var api_limit = headers['http_x_shopify_shop_api_call_limit'];
    console.log( api_limit ); // "1/40"
  };