import { paymentUrls } from "./environment.payment";
import { issuesUrls } from "./environment.issues"
import { customersUrls } from "./environment.customers";
import { usersUrls } from "./environment.users";
import { config } from './env';
const configPackage = require('../../package.json');

export const environment = {
    ...{
        production: true,
        environment: 'production',
        ApiBase: 'http://172.212.38.79:3002',
        PHRASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJuYW1lIjoiYWJjYWxsLWF1dGgtYXBpIn0.GmzwNvnOFDHdYnnsqj2nOIKn5199e2Kg7rNSJXWzrHQ',
        VERSION: configPackage.version
    },
    ...paymentUrls,
    ...issuesUrls,
    ...customersUrls,
    ...usersUrls,

    key:'54T;uv3Dr885',
}
