import { paymentUrls } from "./environment.payment";
import { config } from "./env"
import { issuesUrls } from "./environment.issues"
export const environment = {
    ...config,
    ...paymentUrls,
    ...issuesUrls,
    
}
