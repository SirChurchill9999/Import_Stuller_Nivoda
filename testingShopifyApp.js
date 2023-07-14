import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion, LogSeverity } from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2023-04'; // 2022-07
import { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_ACCESS_TOKEN } from './secrets.js';
import { writeFileSync } from "fs";

const errorLogFile = './error.log';
const appLogFile = './application.log';

const myLoggingFunction = (severity, message) => {
  writeFileSync(appLogFile, `${message}\n`, {flag: 'a'});
  if (severity == LogSeverity.Error) {
    writeFileSync(errorLogFile, `${message}\n`, {flag: 'a'});
  }
};

const shopify = new shopifyApi({
  apiSecretKey: SHOPIFY_API_SECRET_KEY,
  apiVersion: ApiVersion.April23,
  isCustomStoreApp: true,
  adminApiAccessToken: SHOPIFY_API_ACCESS_TOKEN,
  isEmbeddedApp: false,
  hostName: "hand-me-diamonds-staging.myshopify.com",
  logger: {
    myLoggingFunction,
  },
  restResources
});

const session = shopify.session.customAppSession("hand-me-diamonds-staging.myshopify.com");
console.log(
  `Session successfully initialized.`
);

async function getProductCustomerOrderCounts() {
  try {
    // const session = Shopify.session.customAppSession("hand-me-diamonds-staging.myshopify.com");

    const { count: productCount } = await shopify.rest.Product.count({ session });
    const { count: customerCount } = await shopify.rest.Customer.count({ session });
    const { count: orderCount } = await shopify.rest.Order.count({ session });

    console.log(
      `There are ${productCount} products, ${customerCount} customers, and ${orderCount} orders in the ${session.shop} store.`
    );
  } catch (error) {
    if (error instanceof HttpError && error.response.status === 429) {
      console.error('Rate limit error:', error);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

getProductCustomerOrderCounts();

export { shopify };
export { session};