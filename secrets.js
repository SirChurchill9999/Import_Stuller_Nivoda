// import fs from 'fs';
// import path from 'path';

// const secretsFilePath = path.join(__dirname, 'secrets.js');
// const gitignoreFilePath = path.join(__dirname, '.gitignore');

// // Check if .gitignore exists
// if (fs.existsSync(gitignoreFilePath)) {
//   // Read the contents of .gitignore
//   const gitignoreContents = fs.readFileSync(gitignoreFilePath, 'utf8');

//   // Check if secrets.js is already in .gitignore
//   if (!gitignoreContents.includes('secrets.js')) {
//     // Append secrets.js to .gitignore
//     fs.appendFileSync(gitignoreFilePath, '\nsecrets.js\n');
//   }
// } else {
//   // Create .gitignore and add secrets.js to it
//   fs.writeFileSync(gitignoreFilePath, 'secrets.js\n');
// }

export const SHOPIFY_API_SECRET_KEY = "9a2ff22ebe3e683c84188812127a2c5d";
export const SHOPIFY_API_ACCESS_TOKEN = "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";
export const STOREFRONT_API_ACCESS_TOKEN = "901e939497657211362ffc1d1542a586";
export const NIVODA_STAGING_USERNAME = "testaccount@sample.com";
export const NIVODA_STAGING_PASSWORD = "staging-nivoda-22";
export const SHOP = "hand-me-diamonds-staging.myshopify.com";
export const API_KEY = "d39567787cc8ffa48d498b40b2393477";