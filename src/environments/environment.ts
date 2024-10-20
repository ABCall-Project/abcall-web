import { paymentUrls } from "./environment.payment";
export const environment = {
    ApiBase:'http://localhost:5001',
    ...paymentUrls,
}