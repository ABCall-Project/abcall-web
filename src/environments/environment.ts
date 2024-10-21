import { paymentUrls } from "./environment.payment";
import { config } from "./env";
import { issuesUrls } from "./environment.issues"
export const environment = {
    ApiBase:'http://localhost:5002',
    ...paymentUrls,
    ...issuesUrls,
    ...config
}
