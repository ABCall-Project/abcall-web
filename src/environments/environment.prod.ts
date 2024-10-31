import { paymentUrls } from "./environment.payment";
import { issuesUrls } from "./environment.issues"
import { customersUrls } from "./environment.customers";
import { usersUrls } from "./environment.users";
export const environment = {
    ...{
        production: true,
        environment: 'production',
        ApiBase: 'http://172.212.38.79:3002'
    },
    ...paymentUrls,
    ...issuesUrls,
    ...customersUrls,
    ...usersUrls

}