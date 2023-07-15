import fetch from 'node-fetch'; // using node-fetch in this example
import { NIVODA_STAGING_USERNAME, NIVODA_STAGING_PASSWORD } from '../secrets.js';

// You can call the GraphQL with all common request libraries such as:
let libraries = {
  fetch: 'https://www.npmjs.com/package/node-fetch',
  axios: 'https://www.npmjs.com/package/axios'
};

const API_URL = 'http://wdc-intg-customer-staging.herokuapp.com/api/diamonds';
// the API_URL for production is https://integrations.nivoda.net/api/diamonds';

// Great documentation can be found here:
// https://graphql.org/graphql-js/graphql-clients/

// authentication query
// for production, the username and password are the same as what you would use to login to the Nivoda platform
// for staging, the username and password can be requested from tech @ nivoda dot net 
let authenticate_query = `{
    authenticate { 
        username_and_password(username: "${NIVODA_STAGING_USERNAME}", password: "${NIVODA_STAGING_PASSWORD}") {
            token
        }
    }
}
`;

(async function() {
  let authenticate_result = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: authenticate_query }),
  });
  let res = await authenticate_result.json();
  
  // the authentication token to get in future requests
  let { token } = res.data.authenticate.username_and_password;

  // example diamond query
  // note that this does not include all available fields, to see more fields please refer to the documentation
  let diamond_query = `
    query {
      diamonds_by_query(
        query: {
          labgrown: false,
          shapes: ["ROUND"],
          sizes: [{ from: 1.5, to: 2.5}],
          has_v360: true,
          has_image: true,
          color: [J,K]
        },
        offset: 0,
        limit: 50, 
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

  let result = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: diamond_query }),
  });

  let diamond_res = await result.json();
  let { items, total_count } = diamond_res.data.diamonds_by_query;

  console.log({ items, total_count });
  
  // example to access a diamond is mapping over the items
  // i.e. items[0].diamond.certificate.certNumber will give you the certificate number of the first item

  // BEGIN: loop-over-items
  for (let i = 0; i < items.length; i++) {
      const certNumber = items[i].diamond.certificate.certNumber;
      const video = items[i].diamond.video;
      const image = items[i].diamond.image;
      console.log(`Certificate number for item ${i}: ${certNumber}\n`);
  }
  // END: loop-over-items


})();