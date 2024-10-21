import { paymentUrls } from "./environment.payment";
import { issuesUrls } from "./environment.issues"
export const environment = {
    ApiBase:'http://localhost:5002',
    ...paymentUrls,
    ...issuesUrls
}