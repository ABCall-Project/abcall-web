import { paymentUrls } from "./environment.payment";
import { issuesUrls } from "./environment.issues"
import { customersUrls } from "./environment.customers";
import { usersUrls } from "./environment.users";

export const environment = {
    ...{
        production: false,
        environment: 'local',
        ApiBase: 'http://localhost:5002',
        ApiCustomers: 'http://localhost:5003',
        ApiUsers: 'http://localhost:5004',
        ApiIssues: 'http://localhost:5007'
    },
    ...paymentUrls,
    ...issuesUrls,
    ...customersUrls,
    ...usersUrls

}
