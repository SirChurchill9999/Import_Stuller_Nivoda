// Importing the node-fetch library to make HTTP requests
import fetch from 'node-fetch'; // using node-fetch in this example

// Importing the NIVODA_STAGING_USERNAME and NIVODA_STAGING_PASSWORD from the secrets.js file
// import { NIVODA_STAGING_USERNAME, NIVODA_STAGING_PASSWORD } from '../../secrets.js';
const NIVODA_STAGING_USERNAME = process.env.NIVODA_STAGING_USERNAME;
const NIVODA_STAGING_PASSWORD = process.env.NIVODA_STAGING_PASSWORD;
import fs from 'fs'
import { LocalStorage } from 'node-localstorage';


// You can call the GraphQL with all common request libraries such as:
let libraries = {
  fetch: 'https://www.npmjs.com/package/node-fetch',
  axios: 'https://www.npmjs.com/package/axios'
};

// The API URL for the staging environment
const API_URL = 'http://wdc-intg-customer-staging.herokuapp.com/api/diamonds';

// The API URL for the production environment
// const API_URL = 'https://integrations.nivoda.net/api/diamonds';

// Great documentation can be found here:
// https://graphql.org/graphql-js/graphql-clients/

let localStorage = new LocalStorage('./scratch');
// Check if a token is cached
let token = localStorage.getItem('token');

if (token) {
  console.log('Token found:', token);
} else {
  console.log('No token found.');
}

let cachedToken;
let cachedTokenTime;

try {
  cachedToken = localStorage.getItem('token');
  cachedTokenTime = localStorage.getItem('tokenTime');
} catch (error) {
  console.log('No valid token found.');
  cachedToken = null;
  cachedTokenTime = null;
}

// Check if a token was cached in the last x amount of time
let x = 60 * 60 * 1000; // 1 hour in milliseconds
if (cachedToken && cachedTokenTime && new Date().getTime() - cachedTokenTime < x) {
  // If a valid token was cached, set token to the cached value
  token = cachedToken;
} else {
  // If no valid token was cached, set token to null
  token = null;
}

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
  // Amend the authentication process to check if the token is still valid.
  // If the token is still valid, you can use it to make the diamond request.
  // If the token is not valid, you can make the authentication request to get a new token.
  // Check if the token is still valid
  let tokenIsValid = false;

  // Check if the token has any value
  if (token === null) {
    // Proceed with your code here if the token doesn't have any value
  } else {
    // If the token has a value, check if it's valid
    let validateTokenQuery = `
      query {
        validate_token(token: "${token}")
      }
    `;
    let validateTokenResult = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query: validateTokenQuery }),
    });
    let validateTokenRes = await validateTokenResult.json();
    tokenIsValid = validateTokenRes.data.validate_token;
    console.log(tokenIsValid.data);
  }
  
  // If the token is not valid, make the authentication request to get a new token
  if (!tokenIsValid) {
    console.log('Token is not valid. Making the authentication request to get a new token...');
    let authenticate_result = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: authenticate_query }),
    });
    let res = await authenticate_result.json();
    token = res.data.authenticate.username_and_password.token;
    console.log('New token:', token);

    if (typeof localStorage === "undefined" || localStorage === null) {
      localStorage = new LocalStorage('./scratch');
    }

    // Cache the token value
    localStorage.setItem('token', token);
  }

  // // Making the authentication request to get the authentication token
  // let authenticate_result = await fetch(API_URL, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ query: authenticate_query }),
  // });

  // // Parsing the authentication result to get the authentication token
  // let res = await authenticate_result.json();
  // let { token } = res.data.authenticate.username_and_password;

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

// Logging the items and total count of diamonds
console.log({ items, total_count });

// Save the resulting JSON to a new file
fs.writeFile('diamondsSchema.json', JSON.stringify(diamond_res, null, 2), (err) => {
    if (err) throw err;
    console.log('Schema saved to diamondsSchema.json');
})})();