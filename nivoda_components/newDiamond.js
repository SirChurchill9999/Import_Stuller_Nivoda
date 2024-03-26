/** Need to fix:
 * require('dotenv').config();
 * Gives error
 * Commented out for now
 */

/**
 * ULTIMATE GOAL:
 * 1. Fetch diamond information from Nivoda
 * 2. Create a new product in Shopify store <--- This is the part that needs to be added
 * 3. Update the product with diamond information
 */

// Importing the node-fetch library to make HTTP requests
import fetch from 'node-fetch'; // using node-fetch in this example

dotenv.config();
const NIVODA_STAGING_USERNAME = process.env.NIVODA_STAGING_USERNAME;
const NIVODA_STAGING_PASSWORD = process.env.NIVODA_STAGING_PASSWORD;
// Shopify API details
const SHOPIFY_API_ACCESS_TOKEN = process.env.SHOPIFY_API_ACCESS_TOKEN;
const SHOP = process.env.SHOP;
import fs from 'fs'
import dotenv from 'dotenv';

// You can call the GraphQL with all common request libraries such as:
let libraries = {
  fetch: 'https://www.npmjs.com/package/node-fetch',
  axios: 'https://www.npmjs.com/package/axios'
};

// The API URL for the staging environment
const API_URL = 'http://wdc-intg-customer-staging.herokuapp.com/api/diamonds';

// The authentication query to get the authentication token
let authenticate_query = `{
  authenticate { 
      username_and_password(username: "${NIVODA_STAGING_USERNAME}", password: "${NIVODA_STAGING_PASSWORD}") {
          token
      }
  }
}
`;

// An async function that makes the HTTP requests to the API
(async function() {
  // Making the authentication request to get the authentication token
  let authenticate_result = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: authenticate_query }),
  });

  // Parsing the authentication result to get the authentication token
  let res = await authenticate_result.json();
  let { token } = res.data.authenticate.username_and_password;
  // console.log('Token:', token);

  // The diamond query to get the diamonds from the API
  let diamond_query = `
    query {
      diamonds_by_query(
        query: {
          labgrown: false,
          shapes: ["ROUND"],
          sizes: [{ from: 1.5, to: 2.5}],
          has_v360: true,
          has_image: true,
          color: [D]
        },
        offset: 0,
        limit: 10, 
        order: { type: price, direction: ASC }
      ) {
        items {
          id
          diamond {
            id
            video
            image
            availability
            supplierStockId
            brown
            green
            milky
            eyeClean
            mine_of_origin
            certificate {
              id
              lab
              shape
              certNumber
              cut
              carats
              clarity
              polish
              symmetry
              color
              width
              length
              depth
              girdle
              floInt
              floCol
              depthPercentage
              table
            }
          }
          price
          discount
        }
        total_count
      }
    }
  `;

  // Making the diamond request to get the diamonds from the API
  let result = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: diamond_query }),
  });

  // Parsing the diamond result to get the diamonds
  let diamond_res = await result.json();
  console.log(JSON.stringify(diamond_res, null, 2));
  let { items, total_count } = diamond_res.data.diamonds_by_query;

    // Save the resulting JSON to a new file
  fs.writeFile('diamondsSchema.json', JSON.stringify(diamond_res, null, 2), (err) => {
    if (err) throw err;
    console.log('Schema saved to diamondsSchema.json');
  });  

  // Logging the items and total count of diamonds
  console.log({ items, total_count });
  
  // Looping over the items to access each diamond's certificate number
  for (let i = 0; i < items.length; i++) {
      const certNumber = items[i].diamond.certificate.certNumber;
      const video = items[i].diamond.video;
      const image = items[i].diamond.image;
      console.log(`Certificate number for item ${i}: ${certNumber}\n`);
      if (video !== null) {
        console.log(`Video for item ${i}: ${video}\n`);
      }
      if (image !== null) {
        console.log(`Image for item ${i}: ${image}\n`);
      }
  }

})();