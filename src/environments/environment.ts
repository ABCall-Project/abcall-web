import { paymentUrls } from "./environment.payment";
import { config } from "./env";
export const environment = {
    ...config,
    ...paymentUrls,
}
