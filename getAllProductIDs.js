// In another .js file in the same directory
import { shopify } from './testingShopifyApp.js';
import { session } from './testingShopifyApp.js';
import "@shopify/shopify-api/adapters/node";
import fs from 'fs';
import path from 'path';

const client = new shopify.clients.Rest({session});

function makeRequest(nextLink = 'https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/products.json'){
    return new Promise((resolve, reject) => {
      fetch(nextLink).then(async r => {
        let allProducts = [];
        const products = await shopify.rest.Product.all({
            session,
            query: {
                //limit: 50,
                // fields: 'id,title,vendor,product_type,handle,tags,variants,images',
            },
        });
        allProducts = allProducts.concat(products);

        // USEFUL CODE FOR WRITING TO FILE

        // const fileName = 'response.json';
        // var __dirname = '/Users/christopherkonicki/Documents/GitHub/Import_Stuller_Nivoda';
        // const filePath = path.join(__dirname, fileName);
        // if (fs.existsSync(filePath)) {
        //     const fileExt = path.extname(fileName);
        //     const baseName = path.basename(fileName, fileExt);
        //     const newFileName = `${baseName}_${Date.now()}${fileExt}`;
        //     fs.writeFileSync(path.join(__dirname, newFileName), JSON.stringify(products));
        //     console.log(`File ${newFileName} created`);
        // } else {
        //     fs.writeFileSync(filePath, JSON.stringify(products));
        //     console.log(`File ${fileName} created`);
        // }

        // END USEFUL CODE FOR WRITING TO FILE

        const headerLink = products.headers.Link[0]
        const match = headerLink.match(/<[^;]+\/(\w+\.json[^;]+)>;\srel="next"/);
        const nextLink = match ? `https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/${match[1]}` : false;
        if(nextLink){
          makeRequest(nextLink)
        } else {
          resolve();
          console.log(allProducts);
        }
        
      })
    })
  }
makeRequest();
export default makeRequest;