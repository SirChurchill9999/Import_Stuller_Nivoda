// In another .js file in the same directory
import { shopify } from './testingShopifyApp.js';
import { session } from './testingShopifyApp.js';
import "@shopify/shopify-api/adapters/node";
import fs from 'fs';
import path from 'path';

const client = new shopify.clients.Rest({session});

// let allProducts = [];
// let since_id = 0;
// function makeRequest(nextLink = 'https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/products.json'){
//     return new Promise((resolve, reject) => {
//       fetch(nextLink).then(async r => {
//         if (since_id === 0) {
//           const products = await shopify.rest.Product.all({
//             session,
//             query: {
//                 since_id: 0,
//                 fields: 'id,title,images',
//             },
//           });
//           const headerLink = products.headers.Link[0];
//           const match = headerLink.match(/<[^;]+\/(\w+\.json[^;]+)>;\srel="next"/);
//           const nextLink = match ? `https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/${match[1]}` : false;
//           allProducts = allProducts.concat(products);
//         };
//         if (since_id !== 0) {
//           while (headerLink) {
//             const products = await shopify.rest.Product.all({
//               session,
//               query: {
//                   since_id: since_id,
//                   fields: 'id,title,images',
//               },
//             });
//             allProducts = allProducts.concat(products);
//             const headerLink = products.headers.Link[0];
//             const match = headerLink.match(/<[^;]+\/(\w+\.json[^;]+)>;\srel="next"/);
//             const nextLink = match ? `https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/${match[1]}` : false;
//           };
//         };

//         // USEFUL CODE FOR WRITING TO FILE

//         // const fileName = 'response.json';
//         // var __dirname = '/Users/christopherkonicki/Documents/GitHub/Import_Stuller_Nivoda';
//         // const filePath = path.join(__dirname, fileName);
//         // if (fs.existsSync(filePath)) {
//         //     const fileExt = path.extname(fileName);
//         //     const baseName = path.basename(fileName, fileExt);
//         //     const newFileName = `${baseName}_${Date.now()}${fileExt}`;
//         //     fs.writeFileSync(path.join(__dirname, newFileName), JSON.stringify(products));
//         //     console.log(`File ${newFileName} created`);
//         // } else {
//         //     fs.writeFileSync(filePath, JSON.stringify(products));
//         //     console.log(`File ${fileName} created`);
//         // }

//         // END USEFUL CODE FOR WRITING TO FILE

//         if(nextLink){
//           makeRequest(nextLink)
//         } else {
//           resolve();
//           console.log(allProducts);
//         }
        
//       })
//     })
//   }
// makeRequest();




let allProducts = [];
let since_id = 0;
let delay = 0;
function makeRequest(nextLink = 'https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/products.json'){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let products = []; // Declare products variable outside if statements
        fetch(nextLink).then(async r => {
          if (since_id === 0) {
            const products = await shopify.rest.Product.all({
              session,
              query: {
                  since_id: 0,
                  fields: 'id,title,images',
              },
            });
            allProducts.concat(products);
            console.log('All products so far: '&{allProducts});
          };
          if (since_id !== 0) {
            while (headerLink) {
              const products = await shopify.rest.Product.all({
                session,
                query: {
                    since_id: since_id,
                    fields: 'id,title,images',
                },
              });
              allProducts.concat(products);
              console.log('All products so far: '&{allProducts});
              headerLink = products.headers.Link[0]; // Update headerLink variable
            }
          }
          const headerLink = products.headers.Link[0];
          const match = headerLink.match(/<[^;]+\/(\w+\.json[^;]+)>;\srel="next"/);
          const nextLink = match ? `https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/${match[1]}` : false;
          console.log('The next link: '&{nextLink});
          if (nextLink) {
            // delay++;
            // console.log(`Delaying for ${delay} seconds...`);
            makeRequest(nextLink);
          } else {
            resolve(allProducts);
          }
        }).catch(reject);
      }, delay * 1000);
    });
}
makeRequest();