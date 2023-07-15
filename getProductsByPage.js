import { shopify } from './testingShopifyApp.js';
import { session } from './testingShopifyApp.js';
import "@shopify/shopify-api/adapters/node";
import fs from 'fs';
import path from 'path';

const updateProduct = new shopify.rest.Product({session: session});
updateProduct.id = 632910392;
updateProduct.metafields = [
  {
    "key": "new",
    "value": "newvalue",
    "type": "single_line_text_field",
    "namespace": "global"
  }
];
await updateProduct.save({
  update: true,
});