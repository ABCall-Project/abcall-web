import { paymentUrls } from "./environment.payment";
import { issuesUrls } from "./environment.issues"
import { customersUrls } from "./environment.customers";
import { usersUrls } from "./environment.users";
export const environment = {
    ...{
        production: true,
        environment: 'production',
        ApiBase: 'http://172.212.38.79:3002',
        ApiCustomers: 'http://localhost:5003',
        ApiUsers: 'http://localhost:5004',
        ApiIssues: 'http://localhost:5007'
    },
    ...paymentUrls,
    ...issuesUrls,
    ...customersUrls,
    ...usersUrls

}