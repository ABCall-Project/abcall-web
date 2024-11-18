import { paymentUrls } from "./environment.payment";
import { issuesUrls } from "./environment.issues"
import { customersUrls } from "./environment.customers";
import { usersUrls } from "./environment.users";
import { config } from './env';

export const environment = {
    ...{
        production: false,
        environment: 'local',
        ApiBase: 'http://localhost:5002',
        ApiCustomers: 'http://localhost:5003',
        ApiUsers: 'http://localhost:5004',
        ApiIssues: 'http://localhost:5007',
        PHRASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZpcm9ubWVudCI6InRlc3QifQ.oH-jIKbyWL6jjH8YCk5YIEwnlnuB9f-5nXBYNFe3pXY',
    },
    ...config,
    ...paymentUrls,
    ...issuesUrls,
    ...customersUrls,
    ...usersUrls,
    key: '54T;uv3Dr885',
}
