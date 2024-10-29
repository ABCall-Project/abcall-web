import { paymentUrls } from "./environment.payment";
import { issuesUrls } from "./environment.issues"
export const environment = {
    ...{
        production: false,
        environment: 'local',
        ApiBase: 'http://localhost:5002'
    },
    ...paymentUrls,
    ...issuesUrls,
    key:'54T;uv3Dr885',
}
