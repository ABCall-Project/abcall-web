export interface IInvoiceDetail {
    id: string;
    detail: string;
    amount: number;       
    tax: number;         
    totalAmount: number;
    issueId: string;
    chanelPlanId: string;
    invoiceId: string;
    issueDate: Date
}