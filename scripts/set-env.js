const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from the .env file
if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: '.env.local'});
}
else if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test'});
}
else {
  dotenv.config();
}

// Define the path to the Angular environment file
const targetPath = './src/environments/env.ts';

// Create the content of the environment file using the environment variables
const envConfigFile = `
export const config = {
  production: ${process.env.NODE_ENV == 'production'},
  environment: '${process.env.NODE_ENV}',
  ApiBase: '${process.env.ABCALL_BFF_BASE_URL}'
};
`;

// Write the environment file
fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Environment file created at ${targetPath}`);
  }
});
