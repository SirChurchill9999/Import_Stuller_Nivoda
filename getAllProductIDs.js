// In another .js file in the same directory
import { shopify } from './testingShopifyApp.js';
import { session } from './testingShopifyApp.js';
import "@shopify/shopify-api/adapters/node";

// const client = new shopify.clients.Rest({session});

// const getAllProducts = async () => {
//   try {
//     let allProducts = [];
//     let nextLink = 'products.json';
//     while (nextLink) {
//       const products = await client.get({
//         path: nextLink,
//         query: {
//           fields: 'id,title,vendor,product_type,handle,tags,variants,images',
//         },
//       });
//       allProducts = allProducts.concat(products);
//       const headerLink = products.headers.get('link');
//       const match = headerLink.match(/<[^;]+\/(\w+\.json[^;]+)>;\srel="next"/);
//       nextLink = match ? match[1] : false;
//     }
//     console.log(allProducts);
//   } catch (error) {
//     console.error(error);
//   }
// };

// getAllProducts();



// const client = new shopify.clients.Rest({session});
// const getAllProducts = await client.get({
//     path: 'products.json',
//     query: {
//         fields: 'id, title, vendor, product_type, handle, tags, variants, images',
//     }
// });
// console.log(getAllProducts);

// function makeRequest(nextLink = 'https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-04/products.json?limit=250'){
//     return new Promise((resolve, reject) => {
//       fetch(nextLink).then(r => {
//         const headerLink = r.headers.get('Link');
//         console.log(headerLink);
//         const match = headerLink.match(/<[^;]+\/(\w+\.json[^;]+)>;\srel="next"/);
//         const nextLink = match ? match[1] : false;
//         if(nextLink){
//           makeRequest(nextLink)
//         } else {
//           resolve();
//         }
//       })
//     })
//   }

// makeRequest()



const client = new shopify.clients.Rest({session});

const getAllProducts = async () => {
    try {
        let allProducts = [];
        let nextLink = 'https://hand-me-diamonds-staging.myshopify.com/admin/api/2023-07/products.json';
        while (nextLink) {
            const products = await shopify.rest.Product.all({
                session,
                query: {
                    limit: 250,
                    fields: 'id,title,vendor,product_type,handle,tags,variants,images',
                },
            });
            allProducts = allProducts.concat(products);
            console.log(allProducts);
            const headerLink = allProducts.headers.get('link');
            if (!headerLink) {
                break;
            }
            const match = headerLink.match(/<[^;]+\/(\w+\.json[^;]+)>;\srel="next"/);
            nextLink = match ? match[1] : false;
        }
        console.log(allProducts);
    } catch (error) {
        console.error(error);
    }
};
  
getAllProducts();