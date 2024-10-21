export interface IInvoice {
    id: string;
    invoiceId: string;
    customerId: string;
    planId: string;
    amount: number;
    tax: number;
    totalAmount: number;
    status: string;
    createdAt: Date;
    startAt: Date;
    generationDate: Date;
    endAt: Date;
    planAmount: number;
    issuesAmount: number;
}
