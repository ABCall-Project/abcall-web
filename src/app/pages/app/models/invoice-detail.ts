export interface IInvoiceDetail {
    id: string;
    detail: string;
    amount: number;       
    tax: number;         
    total_amount: number;
    issue_id: string;
    chanel_plan_id: string;
    invoice_id: string;
    issue_date: Date
}