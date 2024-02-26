require('dotenv').config();
const fetch = require('node-fetch');

// Nivoda API details
const NIVODA_API_URL = 'http://wdc-intg-customer-staging.herokuapp.com/api/diamonds';
const NIVODA_STAGING_USERNAME = process.env.NIVODA_STAGING_USERNAME;
const NIVODA_STAGING_PASSWORD = process.env.NIVODA_STAGING_PASSWORD;

// Shopify API details
const SHOPIFY_API_ACCESS_TOKEN = process.env.SHOPIFY_API_ACCESS_TOKEN;
const SHOP = process.env.SHOP;

// Function to authenticate and fetch diamond information from Nivoda
async function fetchDiamondInfo() {
  let authenticate_query = `{
    authenticate { 
      username_and_password(username: "${NIVODA_STAGING_USERNAME}", password: "${NIVODA_STAGING_PASSWORD}") {
        token
      }
    }
  }`;

  let authenticate_result = await fetch(NIVODA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: authenticate_query }),
  });

  let authRes = await authenticate_result.json();
  let { token } = authRes.data.authenticate.username_and_password;

  // Assuming the diamond query remains the same as in the initial snippet
  let diamond_query = `query { /* Your diamond query here */ }`;

  let diamondResult = await fetch(NIVODA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: diamond_query }),
  });

  let diamondRes = await diamondResult.json();
  console.log(diamondRes);
  return diamondRes.data; // Assuming this returns the information of the diamond
}

// Function to create a new product in Shopify store
async function createShopifyProduct(diamondInfo) {
  const shopifyAPIURL = `https://${SHOP}/admin/api/2021-07/products.json`;

  let productData = {
    product: {
      title: "Diamond Product", // Modify based on diamondInfo
      body_html: "<strong>Beautiful Diamond</strong>", // Modify based on diamondInfo
      vendor: "Nivoda",
      product_type: "Diamond",
      // Add more fields based on the diamondInfo and your requirements
    }
  };

  let response = await fetch(shopifyAPIURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_ACCESS_TOKEN,
    },
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  let productCreationData = await response.json();
  console.log(productCreationData);
}

// Main execution
(async () => {
  let diamondInfo = await fetchDiamondInfo(); // Fetch diamond info from Nivoda
  await createShopifyProduct(diamondInfo); // Create a product in Shopify store based on fetched diamond info
})();