import { paymentUrls } from "./environment.payment";
import { issuesUrls } from "./environment.issues"
import { customersUrls } from "./environment.customers";
import { usersUrls } from "./environment.users";
import { config } from './env';

export const environment = {
    ...{
        production: true,
        environment: 'production',
        ApiBase: 'http://172.212.38.79:3002',
        PHRASE_KEY: '',
    },
    ...config,
    ...paymentUrls,
    ...issuesUrls,
    ...customersUrls,
    ...usersUrls,

    key:'54T;uv3Dr885',
}
